import { describe, expect, it, vi } from "vitest";
import { createActor, toPromise, type AnyActorLogic } from "xstate";
import type { MetadataStore } from "@/db/metadata-store";
import type { Engine, Metadata, MetadataVersion, Resource } from "@/schemas";
import { syncMachine } from "@/machines/sync";

// Hands the timeout to the engine, so each recorded request shows it.
vi.mock("@/machines/network-reachability", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@/machines/network-reachability")>()),
    queryWithTimeout: (engine: Engine, query: unknown, timeoutMs: number) =>
        engine.query(query as never, { timeoutMs } as never),
}));

/**
 * Pins the metadata pull — what it requests and what it returns — so it
 * can be restructured safely: wayfinder ticket "How should the metadata
 * pull (pullResource) be broken up?".
 */

const ALL_RESOURCES: Resource[] = [
    "programs",
    "programStages",
    "dataElements",
    "optionSets",
    "optionGroups",
    "attributes",
    "programRuleVariables",
    "categoryOptionCombos",
    "programRules",
    "dataSets",
    "organisationUnits",
    "programIndicators",
];

const SERVER_DATE = "2026-09-28T10:00:00.000";

/** Canned responses by query key, each shaped like DHIS2's. */
const responses: Record<string, unknown> = {
    info: { serverDate: SERVER_DATE },
    categoryOptionCombos: { categoryOptionCombos: [{ id: "coc1" }] },
    organisationUnits: { organisationUnits: [{ id: "ou1" }, { id: "ou2" }] },
    dataSets: { dataSets: [{ id: "ds1" }] },
    program: { id: "ueBhWkWll5v", programStages: [] },
    dataElements: { dataElements: [{ id: "de1" }] },
    programIndicators: { programIndicators: [{ id: "pi1" }] },
    trackedEntityAttributes: { trackedEntityAttributes: [{ id: "tea1" }] },
    programRules: { programRules: [{ id: "pr1" }] },
    programRuleActions: { programRuleActions: [{ id: "a1", programRule: { id: "pr1" }, programRuleActionType: "HIDEFIELD" }] },
    programRuleVariables: { programRuleVariables: [{ id: "prv1" }] },
    options: { options: [
        { id: "o1", name: "Yes", code: "1", sortOrder: 1, optionSet: { id: "os1", name: "Yes/No" } },
        { id: "o2", name: "No", code: "0", sortOrder: 2, optionSet: { id: "os1", name: "Yes/No" } },
    ] },
    optionSets: { optionSets: [{ id: "os1", name: "Yes/No" }] },
    optionGroups: {
        optionGroups: [
            { id: "og1", options: [{ id: "o1" }] },
        ],
    },
};

function recordingEngine(failing: string[] = []) {
    const requests: unknown[] = [];
    const engine = {
        query: vi.fn(async (query: Record<string, unknown>, options?: { timeoutMs?: number }) => {
            const [key] = Object.keys(query);
            requests.push({ ...query, timeoutMs: options?.timeoutMs });
            if (Object.keys(query).some((name) => failing.includes(name))) throw new Error(`${key} failed`);
            return Object.fromEntries(Object.keys(query).map((name) => [name, responses[name]]));
        }),
    } as unknown as Engine;
    return { engine, requests };
}

function store(previous?: MetadataVersion): MetadataStore {
    return { getRow: async () => previous } as unknown as MetadataStore;
}

async function pull(
    engine: Engine,
    {
        mode = "full",
        lastMetadataPull,
        previous,
        resources = ALL_RESOURCES,
    }: {
        mode?: "full" | "incremental";
        lastMetadataPull?: string;
        previous?: MetadataVersion;
        resources?: Resource[];
    } = {},
): Promise<Metadata> {
    const logic = syncMachine.implementations.actors.pullResource as AnyActorLogic;
    const actor = createActor(logic, {
        input: {
            resources,
            engine,
            metadataStore: store(previous),
            lastMetadataPull,
            metadataSyncMode: mode,
            userOrgUnit: "userOU",
        },
    });
    actor.start();
    return (await toPromise(actor)) as Metadata;
}

/** Requests in a stable order — they're sent in parallel. */
const sorted = (requests: unknown[]) =>
    [...requests].sort((a, b) =>
        Object.keys(a as object)[0].localeCompare(Object.keys(b as object)[0]),
    );

describe("the metadata pull", () => {
    it("requests every resource in full", async () => {
        const { engine, requests } = recordingEngine();
        await pull(engine, { lastMetadataPull: "2026-09-01T00:00:00.000" });
        expect(sorted(requests)).toMatchSnapshot();
    });

    it("adds a lastUpdated filter to the incremental resources", async () => {
        const { engine, requests } = recordingEngine();
        await pull(engine, { mode: "incremental", lastMetadataPull: "2026-09-01T00:00:00.000" });
        expect(sorted(requests)).toMatchSnapshot();
    });

    it("requests only fields used by program rule evaluation and action assembly", async () => {
        const { engine, requests } = recordingEngine();
        await pull(engine, { resources: ["programRules", "programRuleVariables"] });
        const rules = requests.find((request) => "programRules" in (request as object)) as any;
        const variables = requests.find((request) => "programRuleVariables" in (request as object)) as any;
        expect(rules.programRules.params.fields).toBe("id,condition,priority,program[id],programStage[id]");
        expect(rules.programRuleActions.params.fields).toBe(
            "id,programRuleActionType,programRule[id],dataElement[id],trackedEntityAttribute[id],programStage[id],programStageSection[id],option[id],optionGroup[id],data,content,location,templateUid",
        );
        expect(variables.programRuleVariables.params.fields).toBe(
            "id,name,programRuleVariableSourceType,dataElement[id],trackedEntityAttribute[id],programStage[id]",
        );
    });

    it("pulls in full when incremental has no previous pull", async () => {
        const full = recordingEngine();
        await pull(full.engine);
        const incremental = recordingEngine();
        await pull(incremental.engine, { mode: "incremental" });
        expect(sorted(incremental.requests)).toEqual(sorted(full.requests));
    });

    it("returns each resource's records, options flattened", async () => {
        const { engine } = recordingEngine();
        const metadata = await pull(engine);
        expect(metadata).toMatchSnapshot();
    });

    it("uses independently changed options and actions when parents are unchanged", async () => {
        const { engine, requests } = recordingEngine();
        const queryMock = engine.query as ReturnType<typeof vi.fn>;
        const recordQuery = queryMock.getMockImplementation() as
            (query: Record<string, unknown>) => Promise<unknown>;
        queryMock.mockImplementation(async (query: Record<string, unknown>) => {
            await recordQuery(query);
            return Object.fromEntries(Object.keys(query).map((name) => [name,
                name === "options" ? { options: [
                    { id: "o1", name: "Updated yes", code: "YES", sortOrder: 5, optionSet: { id: "os1", name: "Yes/No" } },
                    { id: "o2", name: "No", code: "0", sortOrder: 2, optionSet: { id: "os1", name: "Yes/No" } },
                ] } : name === "programRuleActions" ? { programRuleActions: [
                    { id: "a2", programRule: { id: "pr1" }, programRuleActionType: "SHOWFIELD" },
                ] } : responses[name],
            ]));
        });
        const metadata = await pull(engine, {
            mode: "incremental",
            lastMetadataPull: "2026-09-01T00:00:00.000",
        });
        expect(requests.some((request) => "optionSets" in (request as object))).toBe(true);
        const optionsRequest = requests.find((request) => "options" in (request as object)) as any;
        expect(optionsRequest.options.params).toEqual({
            fields: "id,name,code,sortOrder,optionSet[id]", paging: false,
        });
        expect(requests.some((request) => "programRuleActions" in (request as object))).toBe(true);
        expect(metadata.optionSets).toContainEqual({
            id: "o1", name: "Updated yes", code: "YES", sortOrder: 5,
            optionSet: "os1", optionSetName: "Yes/No",
        });
        expect(metadata.optionGroups).toContainEqual({
            id: "o1", name: "Updated yes", code: "YES", sortOrder: 5, optionGroup: "og1",
        });
        expect(metadata.programRules[0]?.programRuleActions.map((action) => action.id)).toEqual(["a2"]);
    });

    it("omits options without a set", async () => {
        const { engine } = recordingEngine();
        (engine.query as ReturnType<typeof vi.fn>).mockImplementation(async (query: Record<string, unknown>) =>
            Object.fromEntries(Object.keys(query).map((name) => [name,
                name === "options" ? { options: [
                    { id: "o1", name: "Yes", code: "YES", sortOrder: 1, optionSet: { id: "os1", name: "Yes/No" } },
                    { id: "MnBMMHlUbSw", name: "Orphan", code: "ORPHAN", sortOrder: 2 },
                ] } : responses[name],
            ])),
        );
        const metadata = await pull(engine);
        expect(metadata.optionSets).toEqual([{
            id: "o1", name: "Yes", code: "YES", sortOrder: 1,
            optionSet: "os1", optionSetName: "Yes/No",
        }]);
        expect(metadata.optionGroups[0]?.name).toBe("Yes");
    });

    it("refreshes option-set names even when the option references are unchanged", async () => {
        const { engine } = recordingEngine();
        (engine.query as ReturnType<typeof vi.fn>).mockImplementation(async (query: Record<string, unknown>) =>
            Object.fromEntries(Object.keys(query).map((name) => [name,
                name === "optionSets" ? { optionSets: [{ id: "os1", name: "Updated set name" }] }
                    : responses[name],
            ])),
        );
        const metadata = await pull(engine, {
            mode: "incremental",
            lastMetadataPull: "2026-09-01T00:00:00.000",
        });
        expect(metadata.optionSets.map(({ optionSetName }) => optionSetName)).toEqual([
            "Updated set name", "Updated set name",
        ]);
    });

    it("stamps every succeeded resource with the server date", async () => {
        const { engine } = recordingEngine();
        const previous = { id: "metadata-version", lastSync: "old", versions: { me: "old" } };
        const metadata = await pull(engine, {
            previous,
        });
        const [version] = metadata.metadataVersion;
        expect(version.lastSync).toBe(SERVER_DATE);
        expect(version.versions).toEqual({
            me: "old",
            ...Object.fromEntries(ALL_RESOURCES.map((r) => [r, SERVER_DATE])),
        });
        expect(previous).toEqual({ id: "metadata-version", lastSync: "old", versions: { me: "old" } });
    });

    it("fails the whole pull when a resource fails", async () => {
        const { engine } = recordingEngine(["dataElements"]);
        await expect(pull(engine)).rejects.toThrow("dataElements failed");
    });

    it("does not record a version when the only resource fails", async () => {
        const { engine } = recordingEngine(["dataElements"]);
        await expect(pull(engine, { resources: ["dataElements"] })).rejects.toThrow();
    });

    it("falls back to the last pull when the server gives no date", async () => {
        const { engine } = recordingEngine();
        (engine.query as ReturnType<typeof vi.fn>).mockImplementationOnce(async () => ({ info: {} }));
        const metadata = await pull(engine, { lastMetadataPull: "2026-09-01T00:00:00.000" });
        expect(metadata.metadataVersion[0].lastSync).toBe("2026-09-01T00:00:00.000");
    });

    it("rejects a first pull with no trusted server time", async () => {
        const { engine } = recordingEngine();
        (engine.query as ReturnType<typeof vi.fn>).mockImplementationOnce(async () => ({ info: {} }));
        await expect(pull(engine)).rejects.toThrow("requires server time");
    });

    it("keeps valid group members and omits options outside current option sets", async () => {
        const { engine } = recordingEngine();
        (engine.query as ReturnType<typeof vi.fn>).mockImplementation(async (query: Record<string, unknown>) =>
            Object.fromEntries(Object.keys(query).map((name) => [name,
                name === "optionGroups" ? { optionGroups: [{ id: "og", options: [{ id: "o1" }, { id: "JoENQbYnBNz" }] }] }
                    : responses[name],
            ])),
        );
        const metadata = await pull(engine);
        expect(metadata.optionGroups).toEqual([{
            id: "o1", name: "Yes", code: "1", sortOrder: 1, optionGroup: "og",
        }]);
    });
});
