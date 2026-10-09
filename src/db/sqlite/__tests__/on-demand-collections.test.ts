import { and, createLiveQueryCollection, eq, ilike, inArray, not, or } from "@tanstack/db";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCrossTabBus } from "@/db/cross-tab";
import { createSchema } from "@/db/sqlite/schema";
import { createNodeSqliteDriver } from "@/db/sqlite/test-support/node-sqlite-driver";
import {
    createEnrollmentsSqliteCollection,
    createEventsSqliteCollection,
    createTrackedEntitiesSqliteCollection,
} from "@/db/sqlite/collections";
import { initCollections } from "@/db/collections";
import { resetTrackerCollectionsForTests } from "@/db/sqlite/tracker-collections-instance";
import type { FlattenedEnrollment, FlattenedEvent, FlattenedTrackedEntity } from "@/schemas";
import { createEmptyEnrollment, createEmptyEvent, createEmptyTrackedEntity } from "@/utils/record-factories";
import { deleteEventWithChildren } from "@/utils/record-cascades";

const ORG_UNIT = "ou-1";
const STAGE = "K2nxbE9ubSs";

type Client = { te: FlattenedTrackedEntity; enrollment: FlattenedEnrollment; visits: FlattenedEvent[] };

function makeClient(firstName: string, visitCount: number): Client {
    const te = { ...createEmptyTrackedEntity({ orgUnit: ORG_UNIT, attributes: { firstName } }), syncStatus: "synced" as const };
    const enrollment = {
        ...createEmptyEnrollment({ orgUnit: ORG_UNIT, trackedEntity: te.trackedEntity }),
        syncStatus: "synced" as const,
    };
    const visits = Array.from({ length: visitCount }, (_, i) => ({
        ...createEmptyEvent({
            orgUnit: ORG_UNIT,
            program: enrollment.program,
            trackedEntity: te.trackedEntity,
            enrollment: enrollment.enrollment,
            programStage: STAGE,
            dataValues: { weight: String(50 + i) },
        }),
        occurredAt: `2026-0${(i % 9) + 1}-01`,
        syncStatus: "synced" as const,
    }));
    return { te, enrollment, visits };
}

async function setUp(clients: Client[]) {
    const { driver, close } = createNodeSqliteDriver();
    await createSchema(driver);
    const trackedEntities = createTrackedEntitiesSqliteCollection(driver);
    const enrollments = createEnrollmentsSqliteCollection(driver);
    const events = createEventsSqliteCollection(driver);
    // What a pull does: written as server rows, none of them queried yet.
    await trackedEntities.utils.bulkInsertLocally(clients.map((c) => c.te), { source: "server" });
    await enrollments.utils.bulkInsertLocally(clients.map((c) => c.enrollment), { source: "server" });
    await events.utils.bulkInsertLocally(clients.flatMap((c) => c.visits), { source: "server" });
    return { driver, close, trackedEntities, enrollments, events };
}

function ids<T extends { event: string }>(rows: T[]): string[] {
    return rows.map((r) => r.event).sort();
}

describe("on-demand tracker collections", () => {
    let close: (() => void) | undefined;
    afterEach(() => {
        close?.();
        close = undefined;
        resetTrackerCollectionsForTests();
    });

    it("start empty and load only what a live query asks for", async () => {
        const clients = [makeClient("Kampala", 3), makeClient("John", 2), makeClient("Akello", 4)];
        const setup = await setUp(clients);
        close = setup.close;
        await setup.events.stateWhenReady();
        // A pull's rows don't enter memory: nothing has asked for them.
        expect(setup.events.size).toBe(0);
        expect(setup.trackedEntities.size).toBe(0);

        const tei = clients[0].te.trackedEntity;
        const visits = createLiveQueryCollection((q) =>
            q
                .from({ events: setup.events })
                .where(({ events }) =>
                    and(eq(events.trackedEntity, tei), eq(events.orgUnit, ORG_UNIT), not(eq(events.syncStatus, "deleted"))),
                )
                .orderBy(({ events }) => events.occurredAt, "desc"),
        );
        const rows = await visits.toArrayWhenReady();
        expect(ids(rows)).toEqual(ids(clients[0].visits));
        expect(rows[0].dataValues).toHaveProperty("weight");
        // Only that client's visits are in memory.
        expect(setup.events.size).toBe(3);
        await visits.cleanup();
    });

    it("searches client attributes in SQL with the same matches as in memory", async () => {
        const clients = [makeClient("Kampala", 0), makeClient("kampalaX", 0), makeClient("John", 0)];
        const setup = await setUp(clients);
        close = setup.close;
        const search = createLiveQueryCollection((q) =>
            q
                .from({ trackedEntity: setup.trackedEntities })
                .where(({ trackedEntity }) => ilike(trackedEntity.attributes["firstName"], "%KAMPALA%"))
                .where(({ trackedEntity }) =>
                    and(eq(trackedEntity.orgUnit, ORG_UNIT), not(eq(trackedEntity.syncStatus, "draft"))),
                ),
        );
        const found = await search.toArrayWhenReady();
        expect(found.map((t) => t.attributes.firstName).sort()).toEqual(["Kampala", "kampalaX"]);
        expect(setup.trackedEntities.size).toBe(2);
        await search.cleanup();
    });

    it("an empty key list loads nothing (the client search with no terms)", async () => {
        const setup = await setUp([makeClient("Kampala", 0)]);
        close = setup.close;
        const none = createLiveQueryCollection((q) =>
            q
                .from({ trackedEntity: setup.trackedEntities })
                .where(({ trackedEntity }) => inArray(trackedEntity.trackedEntity, [])),
        );
        expect(await none.toArrayWhenReady()).toEqual([]);
        expect(setup.trackedEntities.size).toBe(0);
        await none.cleanup();
    });

    it("a pull adds rows to an open query, and leaves the rest on disk", async () => {
        const clients = [makeClient("Kampala", 1), makeClient("John", 1)];
        const setup = await setUp(clients);
        close = setup.close;
        const tei = clients[0].te.trackedEntity;
        const visits = createLiveQueryCollection((q) =>
            q.from({ events: setup.events }).where(({ events }) => eq(events.trackedEntity, tei)),
        );
        await visits.toArrayWhenReady();
        expect(visits.size).toBe(1);

        const newForOpenClient = { ...clients[0].visits[0], event: "pulled-1", occurredAt: "2026-10-01" };
        const newForOtherClient = { ...clients[1].visits[0], event: "pulled-2", occurredAt: "2026-10-01" };
        await setup.events.utils.bulkInsertLocally([newForOpenClient, newForOtherClient], { source: "server" });

        expect(visits.toArray.map((e) => e.event).sort()).toEqual([clients[0].visits[0].event, "pulled-1"].sort());
        expect(setup.events.has("pulled-2")).toBe(false);
        await visits.cleanup();
    });

    it("a pull updates a loaded row", async () => {
        const clients = [makeClient("Kampala", 1)];
        const setup = await setUp(clients);
        close = setup.close;
        const visit = clients[0].visits[0];
        const one = createLiveQueryCollection((q) =>
            q.from({ events: setup.events }).where(({ events }) => eq(events.event, visit.event)),
        );
        await one.toArrayWhenReady();
        await one.cleanup();
        // No query open now, but the row is loaded: a pull must keep it current.
        await setup.events.utils.bulkInsertLocally(
            [{ ...visit, updatedAt: "2026-10-09T10:00:00.000", dataValues: { weight: "99" } }],
            { source: "server" },
        );
        expect(setup.events.get(visit.event)?.dataValues.weight).toBe("99");
    });

    it("keeps this tab's own new rows in memory, so they can be edited", async () => {
        const setup = await setUp([]);
        close = setup.close;
        const draft = createEmptyTrackedEntity({ orgUnit: ORG_UNIT });
        await setup.trackedEntities.utils.insertLocally(draft);
        expect(setup.trackedEntities.has(draft.trackedEntity)).toBe(true);
        const tx = setup.trackedEntities.update(draft.trackedEntity, (d) => {
            d.syncStatus = "pending";
        });
        await tx.isPersisted.promise;
        const { rows } = await setup.driver.execute<{ sync_status: string }>(
            "SELECT sync_status FROM tracked_entities WHERE tracked_entity = ?",
            [draft.trackedEntity],
        );
        expect(rows[0].sync_status).toBe("pending");
    });

    it("refresh picks up a direct SQL write to a loaded row and to an open query", async () => {
        const clients = [makeClient("Kampala", 2)];
        const setup = await setUp(clients);
        close = setup.close;
        const pending = createLiveQueryCollection((q) =>
            q
                .from({ events: setup.events })
                .where(({ events }) => or(eq(events.syncStatus, "pending"), eq(events.syncStatus, "deleted"))),
        );
        expect(await pending.toArrayWhenReady()).toEqual([]);
        // What push-results.ts does: one transaction straight to SQL, then refresh().
        await setup.driver.execute("UPDATE events SET sync_status = 'pending' WHERE event = ?", [clients[0].visits[0].event]);
        await setup.events.utils.refresh();
        expect(pending.toArray.map((e) => e.event)).toEqual([clients[0].visits[0].event]);
        await pending.cleanup();
    });

    it("another tab's write reaches an open query", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        const channel = `test-on-demand-${Date.now()}`;
        const client = makeClient("Kampala", 1);
        const { sqliteCollectionOptions } = await import("@/db/sqlite/collection-adapter");
        const { eventsRowAdapter } = await import("@/db/sqlite/row-adapters/events");
        const { createCollection } = await import("@tanstack/db");
        const tab = () =>
            createCollection(
                sqliteCollectionOptions<FlattenedEvent, string>({
                    id: "events",
                    db: driver,
                    getKey: (row) => row.event,
                    row: eventsRowAdapter,
                    crossTab: createCrossTabBus(channel, new EventTarget()),
                    syncMode: "on-demand",
                }),
            );
        const tabA = tab();
        const tabB = tab();
        const trackedEntities = createTrackedEntitiesSqliteCollection(driver);
        const enrollments = createEnrollmentsSqliteCollection(driver);
        await trackedEntities.utils.insertLocally(client.te);
        await enrollments.utils.insertLocally(client.enrollment);
        const openInB = createLiveQueryCollection((q) =>
            q.from({ events: tabB }).where(({ events }) => eq(events.trackedEntity, client.te.trackedEntity)),
        );
        await openInB.toArrayWhenReady();
        await tabA.stateWhenReady();
        await tabA.utils.insertLocally(client.visits[0]);
        await vi.waitFor(() => expect(openInB.toArray.map((e) => e.event)).toEqual([client.visits[0].event]));
        await openInB.cleanup();
    });

    it("cascades a visit delete through rows no screen has loaded", async () => {
        const mother = makeClient("Mother", 1);
        const motherVisit = mother.visits[0];
        const labEvent = {
            ...createEmptyEvent({
                orgUnit: ORG_UNIT,
                program: mother.enrollment.program,
                trackedEntity: mother.te.trackedEntity,
                enrollment: mother.enrollment.enrollment,
                programStage: "zKGWob5AZKP",
                parentEvent: motherVisit.event,
            }),
            syncStatus: "draft" as const,
        };
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        initCollections("sqlite", driver);
        const { getEventsCollection, getTrackedEntitiesCollection, getEnrollmentsCollection } = await import(
            "@/db/collections"
        );
        await getTrackedEntitiesCollection().utils.bulkInsertLocally([mother.te], { source: "server" });
        await getEnrollmentsCollection().utils.bulkInsertLocally([mother.enrollment], { source: "server" });
        await getEventsCollection().utils.bulkInsertLocally([motherVisit, labEvent], { source: "server" });
        expect(getEventsCollection().size).toBe(0);

        const { markedDeleted } = await deleteEventWithChildren(motherVisit.event);

        expect(markedDeleted.map((e) => e.event)).toEqual([motherVisit.event]);
        const { rows } = await driver.execute<{ event: string; sync_status: string }>(
            "SELECT event, sync_status FROM events ORDER BY event",
        );
        // The draft child is gone; the synced visit waits to be deleted on the server.
        expect(rows).toEqual([{ event: motherVisit.event, sync_status: "deleted" }]);
    });
});

describe("on-demand loading under concurrency", () => {
    it("serves several queries mounted at once (the app header's six status queries)", async () => {
        const clients = [makeClient("Kampala", 2)];
        const setup = await setUp(clients);
        try {
            const queries = ["pending", "failed", "deleted", "synced", "draft", "editing"].map((status) =>
                createLiveQueryCollection((q) =>
                    q.from({ events: setup.events }).where(({ events }) => eq(events.syncStatus, status)),
                ),
            );
            const results = await Promise.race([
                Promise.all(queries.map((query) => query.toArrayWhenReady())),
                new Promise((_, reject) => setTimeout(() => reject(new Error("queries never became ready")), 3000)),
            ]);
            expect((results as unknown[][]).map((r) => r.length)).toEqual([0, 0, 0, 2, 0, 0]);
            await Promise.all(queries.map((query) => query.cleanup()));
        } finally {
            setup.close();
        }
    });
});

describe("on-demand loading and React suspense", () => {
    it("a repeat of a loaded query is ready at once, so a suspended component's retry doesn't suspend again", async () => {
        const clients = [makeClient("Kampala", 2)];
        const setup = await setUp(clients);
        try {
            const query = () =>
                createLiveQueryCollection((q) =>
                    q.from({ events: setup.events }).where(({ events }) => eq(events.syncStatus, "synced")),
                );
            const first = query();
            await first.toArrayWhenReady();
            // What a suspended component's retry does: a new live query, same filter.
            const retry = query();
            void retry.preload();
            expect(retry.isReady()).toBe(true);
            expect(retry.toArray).toHaveLength(2);
            await Promise.all([first.cleanup(), retry.cleanup()]);
        } finally {
            setup.close();
        }
    });
});
