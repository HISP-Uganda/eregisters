import dayjs from "dayjs";

/**
 * Who is creating and editing records on this device — wayfinder ticket
 * "Should records created on the device record their author, and how is
 * it sent to DHIS2?". Same-facility users share one local store, so a
 * record created by one can be pushed under another's session; recording
 * the author locally keeps it through the push (`storedBy` — see
 * `transformers.ts`).
 *
 * Set once per page from `me` (signing in reloads the page, so it never
 * changes while a page lives). Same shape as the `createdBy`/`updatedBy`
 * a pull stores (`UserSchema`), so local and pulled records read alike.
 */
export type LocalAuthor = {
    uid: string;
    username: string;
    firstName: string;
    surname: string;
};

let author: LocalAuthor | undefined;

export function setLocalAuthor(next: LocalAuthor | undefined): void {
    author = next;
}

export function getLocalAuthor(): LocalAuthor | undefined {
    return author;
}

/** The timestamp format the record factories use (`createEmpty*`). */
function localTimestamp(): string {
    return dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
}

/**
 * What a local edit changes besides the edit itself: who made it and
 * when. Applied by the tracker collections' `onUpdate` (user edits only —
 * pulls and push bookkeeping take other paths). Without a known author
 * only the time moves.
 */
export function localEditStamp(): {
    updatedAt: string;
    updatedBy?: LocalAuthor;
} {
    return author
        ? { updatedAt: localTimestamp(), updatedBy: author }
        : { updatedAt: localTimestamp() };
}
