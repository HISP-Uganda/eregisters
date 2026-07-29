const FRIENDLY_MESSAGES: Record<string, string> = {
    E1006: "This visit is missing its date. Open the visit and set a visit date.",
    E1023: "This enrollment is missing an enrollment date.",
    E1025: "The enrollment date cannot be in the future.",
    E1031: "This visit is missing its date. Open the visit and set a visit date.",
    E1041: "The date entered is outside the allowed range for this program.",
    E1048: "This record is missing a required identifier.",
    E1049: "This record is missing a required identifier.",
    E1050: "A required field on the client is empty. Please fill it in and save.",
    E1055: "This client is already enrolled in the program.",
    E1063: "This client already exists in the system.",
    E1064: "The value entered for one of the attributes is already used by another client.",
    E1075: "One of the required attributes on the client is empty.",
    E1076: "A required attribute on the client is empty.",
    E1080: "This record was already deleted on the server.",
    E1082: "This visit was already deleted.",
    E1083: "You do not have permission to change this record.",
    E1084: "You do not have permission to change this record.",
    E1090: "Enrollment date is required.",
    E1091: "The enrollment date is invalid.",
    E1113: "This enrollment was already deleted.",
    E1114: "This client was already deleted.",
    E1121: "A required question on this visit was not answered.",
    E1122: "A required question on this visit was not answered.",
    E1125: "One of the answers is not from the allowed option list.",
    E1300: "A program rule prevented saving this record.",
    E1301: "A program rule prevented saving this record.",
    E1302: "A program rule flagged a warning on this record.",
};

const GENERIC_FALLBACK =
    "There was a problem saving this record. Please review the technical details below or contact support.";

const LINE_PATTERN = /^\s*\[(E\d{3,4})\]\s*(.*)$/;
const UID_PATTERN = /\b[A-Za-z][A-Za-z0-9]{10}\b/g;

function replaceUids(text: string, names?: Map<string, string>): string {
    if (!names || names.size === 0) return text;
    return text.replace(UID_PATTERN, (uid) => {
        const name = names.get(uid);
        return name ? `${name} (${uid})` : uid;
    });
}

export function humanizeSyncError(
    raw: string | null | undefined,
    names?: Map<string, string>,
): {
    friendly: string;
    technical: string | null;
} {
    if (!raw) return { friendly: "", technical: null };

    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const friendlyLines: string[] = [];
    let anyCodeMatched = false;

    for (const line of lines) {
        const match = LINE_PATTERN.exec(line);
        if (match) {
            anyCodeMatched = true;
            const [, code, rest] = match;
            const preset = FRIENDLY_MESSAGES[code];
            const restResolved = replaceUids(rest?.trim() ?? "", names);
            if (preset) {
                friendlyLines.push(
                    restResolved ? `${preset} (${restResolved})` : preset,
                );
            } else if (restResolved) {
                friendlyLines.push(restResolved);
            } else {
                friendlyLines.push(GENERIC_FALLBACK);
            }
        } else {
            friendlyLines.push(replaceUids(line, names));
        }
    }

    const deduped = Array.from(new Set(friendlyLines));
    const friendly = deduped.join("\n");
    const technical = anyCodeMatched && friendly !== raw ? raw : null;

    return { friendly: friendly || raw, technical };
}
