// Minimal ambient declaration for Node's built-in node:sqlite module,
// scoped to what this test-support driver actually uses. @types/node
// ships a full declaration (node_modules/@types/node/sqlite.d.ts), but the
// installed TypeScript 7 (tsgo) compiler isn't resolving that ambient
// module yet — this file is a narrow, self-contained fallback so the test
// driver typechecks regardless.
declare module "node:sqlite" {
    interface StatementResultingChanges {
        changes: number | bigint;
        lastInsertRowid: number | bigint;
    }

    class StatementSync {
        run(...params: unknown[]): StatementResultingChanges;
        all(...params: unknown[]): unknown[];
    }

    export class DatabaseSync {
        constructor(location: string, options?: Record<string, unknown>);
        exec(sql: string): void;
        prepare(sql: string): StatementSync;
        close(): void;
    }
}
