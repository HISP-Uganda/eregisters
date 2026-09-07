import type { SqlDriver } from "../driver-types";

export type SqlUser = {
    uid: string;
    username: string;
    firstName: string;
    surname: string;
};

/** Upserts a user row (shared lookup table, ticket 003's schema decision). */
export async function upsertUser(
    db: SqlDriver,
    user: SqlUser | undefined,
): Promise<void> {
    if (!user) return;
    await db.execute(
        `INSERT INTO users (uid, username, first_name, surname)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(uid) DO UPDATE SET
            username = excluded.username,
            first_name = excluded.first_name,
            surname = excluded.surname`,
        [user.uid, user.username, user.firstName, user.surname],
    );
}

export async function loadUsersByUid(
    db: SqlDriver,
): Promise<Map<string, SqlUser>> {
    const result = await db.execute<{
        uid: string;
        username: string;
        first_name: string;
        surname: string;
    }>("SELECT uid, username, first_name, surname FROM users");
    const map = new Map<string, SqlUser>();
    for (const row of result.rows) {
        map.set(row.uid, {
            uid: row.uid,
            username: row.username,
            firstName: row.first_name,
            surname: row.surname,
        });
    }
    return map;
}
