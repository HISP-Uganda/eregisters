import { afterEach, describe, expect, it } from "vitest";
import type { SqlDriver } from "@/db/sqlite/driver-types";
import { enrollmentsRowAdapter } from "@/db/sqlite/row-adapters/enrollments";
import { eventsRowAdapter } from "@/db/sqlite/row-adapters/events";
import { trackedEntitiesRowAdapter } from "@/db/sqlite/row-adapters/tracked-entities";
import { createSchema } from "@/db/sqlite/schema";
import { createNodeSqliteDriver } from "@/db/sqlite/test-support/node-sqlite-driver";
import { readVisitSummaries } from "@/db/sqlite/visit-summaries";

const sync = { lastSynced: "2026-01-01", syncError: null, version: 1 };

async function client(driver: SqlDriver, id: string, orgUnit: string, syncStatus = "synced") {
    await trackedEntitiesRowAdapter.insertRow(driver, {
        trackedEntity: id,
        trackedEntityType: "tet",
        orgUnit,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        inactive: false,
        deleted: false,
        potentialDuplicate: false,
        ...sync,
        syncStatus,
        attributes: {},
    } as never);
    await enrollmentsRowAdapter.insertRow(driver, {
        enrollment: `enr-${id}`,
        trackedEntity: id,
        program: "prog",
        orgUnit,
        status: "ACTIVE",
        enrolledAt: "2026-01-01",
        occurredAt: "2026-01-01",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
        followUp: false,
        deleted: false,
        ...sync,
        syncStatus: "synced",
        attributes: {},
    } as never);
}

async function visit(driver: SqlDriver, event: string, trackedEntity: string, stage: string, syncStatus = "synced") {
    await eventsRowAdapter.insertRow(driver, {
        event,
        status: "ACTIVE",
        program: "prog",
        programStage: stage,
        enrollment: `enr-${trackedEntity}`,
        trackedEntity,
        orgUnit: "ou",
        occurredAt: "2026-10-28",
        followUp: false,
        deleted: false,
        createdAt: "2026-10-28T08:00:00.000",
        createdAtClient: event === "v1" ? "2026-10-28T07:59:00.000" : undefined,
        updatedAt: "2026-10-28T08:00:00.000",
        ...sync,
        syncStatus,
        dataValues: { x: "1" },
    } as never);
}

describe("readVisitSummaries", () => {
    let close: (() => void) | undefined;
    afterEach(() => close?.());

    it("reads the facility's live clients' live main-stage visits, a few fields each", async () => {
        const { driver, close: c } = createNodeSqliteDriver();
        close = c;
        await createSchema(driver);
        await client(driver, "here", "ou");
        await client(driver, "elsewhere", "other");
        await client(driver, "draftClient", "ou", "draft");
        await visit(driver, "v1", "here", "main");
        await visit(driver, "v2", "here", "other-stage");
        await visit(driver, "v3", "here", "main", "deleted");
        await visit(driver, "v4", "elsewhere", "main");
        await visit(driver, "v5", "draftClient", "main");

        expect(await readVisitSummaries(driver, "main", "ou")).toEqual([
            {
                trackedEntity: "here",
                occurredAt: "2026-10-28",
                createdAt: "2026-10-28T08:00:00.000",
                createdAtClient: "2026-10-28T07:59:00.000",
            },
        ]);
    });
});
