import { createCollection } from "@tanstack/db";
import { afterEach, describe, expect, it } from "vitest";
import { createEmptyEnrollment, createEmptyEvent, createEmptyTrackedEntity } from "../../utils/record-factories";
import { localEditStamp, setLocalAuthor, type LocalAuthor } from "../local-author";
import { sqliteCollectionOptions } from "../sqlite/collection-adapter";
import type { RowAdapter } from "../sqlite/row-adapter";
import { createNodeSqliteDriver } from "../sqlite/test-support/node-sqlite-driver";
import {
    transformEnrollment,
    transformEvent,
    transformTrackedEntity,
} from "../transformers";

/**
 * Wayfinder ticket "Should records created on the device record their
 * author, and how is it sent to DHIS2?".
 */

const NURSE: LocalAuthor = {
    uid: "nurseUid001",
    username: "nurse.a",
    firstName: "Nurse",
    surname: "A",
};

afterEach(() => setLocalAuthor(undefined));

describe("records created on the device", () => {
    it("carry the signed-in user as their author", () => {
        setLocalAuthor(NURSE);
        const te = createEmptyTrackedEntity({ orgUnit: "ou" });
        const en = createEmptyEnrollment({ orgUnit: "ou", trackedEntity: te.trackedEntity });
        const ev = createEmptyEvent({
            orgUnit: "ou",
            program: "p",
            trackedEntity: te.trackedEntity,
            enrollment: en.enrollment,
            programStage: "ps",
        });
        for (const row of [te, en, ev]) {
            expect(row.createdBy).toEqual(NURSE);
            expect(row.updatedBy).toEqual(NURSE);
        }
    });

    it("carry no author when none is known — never a guess", () => {
        const te = createEmptyTrackedEntity({ orgUnit: "ou" });
        expect(te.createdBy).toBeUndefined();
        expect(te.updatedBy).toBeUndefined();
    });
});

describe("what a push sends", () => {
    it("sends the local author as storedBy, with the record's own times", () => {
        setLocalAuthor(NURSE);
        const te = createEmptyTrackedEntity({ orgUnit: "ou" });
        const en = createEmptyEnrollment({ orgUnit: "ou", trackedEntity: te.trackedEntity });
        const ev = createEmptyEvent({
            orgUnit: "ou",
            program: "p",
            trackedEntity: te.trackedEntity,
            enrollment: en.enrollment,
            programStage: "ps",
        });

        for (const [row, payload] of [
            [te, transformTrackedEntity(te)],
            [en, transformEnrollment(en)],
            [ev, transformEvent(ev, new Set())],
        ] as const) {
            expect(payload).toMatchObject({
                storedBy: "nurse.a",
                createdAtClient: row.createdAt,
                updatedAtClient: row.updatedAt,
            });
        }
    });

    it("sends no storedBy for a record without a known author", () => {
        const te = createEmptyTrackedEntity({ orgUnit: "ou" });
        const payload = transformTrackedEntity(te) as Record<string, unknown>;
        expect(payload.storedBy).toBeUndefined();
        expect(payload.createdAtClient).toBe(te.createdAt);
    });
});

describe("a user's edit", () => {
    type Row = { id: string; label: string; updatedAt?: string; updatedBy?: LocalAuthor };

    function adapter(): RowAdapter<Row, string> {
        return {
            rowVersion: (row) => `${row.updatedAt}`,
            loadAll: async (db) =>
                (await db.execute<{ data: string }>("SELECT data FROM rows")).rows.map(
                    (r) => JSON.parse(r.data) as Row,
                ),
            insertRow: async (db, row) => {
                await db.execute("INSERT INTO rows (id, data) VALUES (?, ?)", [row.id, JSON.stringify(row)]);
            },
            updateRow: async (db, row) => {
                await db.execute("UPDATE rows SET data = ? WHERE id = ?", [JSON.stringify(row), row.id]);
            },
            deleteRow: async (db, key) => {
                await db.execute("DELETE FROM rows WHERE id = ?", [key]);
            },
        };
    }

    it("records who made it and when; a pull writing the same row does not", async () => {
        setLocalAuthor(NURSE);
        const { driver, close } = createNodeSqliteDriver();
        try {
            await driver.execute("CREATE TABLE rows (id TEXT PRIMARY KEY, data TEXT)");
            const collection = createCollection(
                sqliteCollectionOptions<Row, string>({
                    id: "test-stamp",
                    db: driver,
                    getKey: (row) => row.id,
                    row: adapter(),
                    stampEdit: localEditStamp,
                }),
            );
            await collection.toArrayWhenReady();
            const utils = collection.utils as unknown as {
                bulkInsertLocally: (rows: Row[], options?: { source: "server" }) => Promise<void>;
            };

            // A pull stores the server's version — not stamped.
            await utils.bulkInsertLocally(
                [{ id: "r1", label: "from server", updatedAt: "2026-01-01T00:00:00.000" }],
                { source: "server" },
            );
            expect(collection.get("r1")?.updatedBy).toBeUndefined();

            // The user edits it — stamped with who and when.
            const tx = collection.update("r1", (draft) => {
                draft.label = "edited";
            });
            await tx.isPersisted.promise;

            const stored = (await adapter().loadAll(driver))[0];
            expect(stored.label).toBe("edited");
            expect(stored.updatedBy).toEqual(NURSE);
            expect(stored.updatedAt).not.toBe("2026-01-01T00:00:00.000");
        } finally {
            close();
        }
    });
});
