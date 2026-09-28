import { describe, expect, it, vi } from "vitest";
import { createActor, toPromise, type AnyActorLogic } from "xstate";
import type { MetadataStore } from "../../db/metadata-store";
import type { Engine, Metadata, MetadataVersion, Resource } from "../../schemas";
import { syncMachine } from "../sync";

// Hands the timeout to the engine, so each recorded request shows it.
vi.mock("../network-reachability", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../network-reachability")>()),
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
    programRuleVariables: { programRuleVariables: [{ id: "prv1" }] },
    optionSets: {
        optionSets: [
            {
                id: "os1",
                name: "Yes/No",
                options: [
                    { id: "o1", name: "Yes", code: "1", sortOrder: 1 },
                    { id: "o2", name: "No", code: "0", sortOrder: 2 },
                ],
            },
        ],
    },
    optionGroups: {
        optionGroups: [
            { id: "og1", options: [{ id: "o1", name: "Yes", code: "1", sortOrder: 1 }] },
        ],
    },
};

function recordingEngine(failing: string[] = []) {
    const requests: unknown[] = [];
    const engine = {
        query: vi.fn(async (query: Record<string, unknown>, options?: { timeoutMs?: number }) => {
            const [key] = Object.keys(query);
            requests.push({ ...query, timeoutMs: options?.timeoutMs });
            if (failing.includes(key)) throw new Error(`${key} failed`);
            return { [key]: responses[key] };
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

    it("stamps every succeeded resource with the server date", async () => {
        const { engine } = recordingEngine();
        const metadata = await pull(engine, {
            previous: { id: "metadata-version", lastSync: "old", versions: { me: "old" } },
        });
        const [version] = metadata.metadataVersion;
        expect(version.lastSync).toBe(SERVER_DATE);
        expect(version.versions).toEqual({
            me: "old",
            ...Object.fromEntries(ALL_RESOURCES.map((r) => [r, SERVER_DATE])),
        });
    });

    it("skips a failed resource and doesn't stamp it", async () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        const { engine } = recordingEngine(["dataElements"]);
        const metadata = await pull(engine);
        expect(metadata.dataElements).toEqual([]);
        expect(metadata.succeededResources!.has("dataElements")).toBe(false);
        expect(metadata.succeededResources!.has("programs")).toBe(true);
        expect(metadata.metadataVersion[0].versions.dataElements).toBeUndefined();
    });

    it("records no version when nothing succeeds", async () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        const { engine } = recordingEngine(["dataElements"]);
        const metadata = await pull(engine, { resources: ["dataElements"] });
        expect(metadata.metadataVersion).toEqual([]);
    });

    it("falls back to the last pull when the server gives no date", async () => {
        const { engine } = recordingEngine();
        (engine.query as ReturnType<typeof vi.fn>).mockImplementationOnce(async () => ({ info: {} }));
        const metadata = await pull(engine, { lastMetadataPull: "2026-09-01T00:00:00.000" });
        expect(metadata.metadataVersion[0].lastSync).toBe("2026-09-01T00:00:00.000");
    });
});
