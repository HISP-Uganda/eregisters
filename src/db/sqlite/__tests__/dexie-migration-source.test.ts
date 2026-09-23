import { beforeEach, describe, expect, it, vi } from "vitest";

// Real IndexedDB isn't available under Vitest's Node environment, so the
// static Dexie helpers this module calls are stubbed out.
const { deleteMock, existsMock } = vi.hoisted(() => ({
    deleteMock: vi.fn(async (_name: string) => undefined),
    existsMock: vi.fn(async (_name: string) => true),
}));

vi.mock("dexie", () => {
    const Dexie = Object.assign(vi.fn(), {
        delete: deleteMock,
        exists: existsMock,
    });
    return { default: Dexie };
});

import { realDexieMigrationSource } from "../dexie-migration-source";

describe("realDexieMigrationSource", () => {
    beforeEach(() => {
        deleteMock.mockClear();
        existsMock.mockClear();
    });

    it("dropAll never deletes MOHRegisterDB — HMIS drafts still live there on the sqlite backend", async () => {
        await realDexieMigrationSource.dropAll();

        const deleted = deleteMock.mock.calls.map(([name]) => name);
        expect(deleted).not.toContain("MOHRegisterDB");
        expect(deleted).toEqual(
            expect.arrayContaining([
                "MOHRegister_TrackedEntities",
                "MOHRegister_Enrollments",
                "MOHRegister_Events",
                "MOHRegister_RuleResults",
            ]),
        );
    });

    it("existsAnyDexieData ignores MOHRegisterDB, which exists on every device that has opened an HMIS form", async () => {
        existsMock.mockImplementation(
            async (name: string) => name === "MOHRegisterDB",
        );

        expect(await realDexieMigrationSource.existsAnyDexieData()).toBe(
            false,
        );
    });
});
