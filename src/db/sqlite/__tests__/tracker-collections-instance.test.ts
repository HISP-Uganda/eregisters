import { describe, expect, it } from "vitest";
import { createNodeSqliteDriver } from ".././test-support/node-sqlite-driver";
import { createSchema } from ".././schema";
import {
    getSqliteEnrollmentsCollection,
    getSqliteEventsCollection,
    getSqliteTrackedEntitiesCollection,
    initTrackerCollections,
} from ".././tracker-collections-instance";

// Module-level singleton state, like the singleton pattern the old op-sqlite driver module used —
// these tests are ordered (throw-before-init, then init, then
// singleton-identity-after-init) rather than independent.
describe("tracker-collections-instance", () => {
    it("throws if a getter is called before initTrackerCollections()", () => {
        expect(() => getSqliteTrackedEntitiesCollection()).toThrow(
            /not initialized/,
        );
        expect(() => getSqliteEnrollmentsCollection()).toThrow(/not initialized/);
        expect(() => getSqliteEventsCollection()).toThrow(/not initialized/);
    });

    it("initTrackerCollections() makes all three getters resolve, and repeated calls are idempotent (same instances)", async () => {
        const { driver } = createNodeSqliteDriver();
        await createSchema(driver);

        initTrackerCollections(driver);

        const te = getSqliteTrackedEntitiesCollection();
        const enr = getSqliteEnrollmentsCollection();
        const evt = getSqliteEventsCollection();
        expect(te).toBeDefined();
        expect(enr).toBeDefined();
        expect(evt).toBeDefined();

        // A second driver's worth of init should be a no-op (same pattern
        // as that same historical singleton pattern) — the getters keep
        // returning the FIRST collections created, not new ones.
        const { driver: otherDriver } = createNodeSqliteDriver();
        await createSchema(otherDriver);
        initTrackerCollections(otherDriver);

        expect(getSqliteTrackedEntitiesCollection()).toBe(te);
        expect(getSqliteEnrollmentsCollection()).toBe(enr);
        expect(getSqliteEventsCollection()).toBe(evt);
    });
});
