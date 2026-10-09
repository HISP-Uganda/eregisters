// The test facility's tracker data: generated clients for realistic volume, plus named fixture clients that the
// tests look up by surname. Each test uses its own fixtures, and each screen size (Playwright project) its own
// copy of them, so tests don't depend on each other's changes.
//
// Content is deterministic for a given seed. UIDs are new on every run: DHIS2 keeps deleted records, and a
// deleted UID can't be imported again, so fixtures are found by name (and recorded in e2e/.state/seed.json).

const PROGRAM = "ueBhWkWll5v";
const VISIT = "K2nxbE9ubSs"; // Medical Visit
const LAB = "zKGWob5AZKP"; // Laboratory Tests
const A = {
    firstName: "KSq9EyZ8ZFi",
    surname: "TWPNbc9O2nK",
    dob: "Y3DE5CZWySr",
    sex: "bqliZKdUGMX",
    category: "N6Y4aCbmHHt",
    village: "oTI0DLitzFY",
    parent: "FhyNxUVOpjh", // a newborn's mother (tracked entity id)
};
const D = {
    services: "mrKZWf2WMIC",
    weight: "scpPwoNsS27",
    height: "uIFJ94mZt0S",
    childServices: "UuxHHVp5CnF",
    opdType: "lFKnsWk3TxJ", // OPD type of Patient: a program rule makes it mandatory for Outpatient visits
    parentEvent: "Wx7x4sMAa62", // a lab test's or newborn visit's parent visit (event id)
};

const FIRST_NAMES = ["Aisha", "Brian", "Christine", "David", "Esther", "Francis", "Grace", "Henry", "Irene", "John",
    "Kevin", "Lydia", "Moses", "Naome", "Oscar", "Patience", "Ruth", "Samuel", "Teddy", "Vivian"];
const SURNAMES = ["Akello", "Byaruhanga", "Kato", "Mugisha", "Namubiru", "Nankya", "Ochieng", "Okello", "Ssempala",
    "Tumusiime", "Wasswa", "Nabirye", "Kiggundu", "Atim", "Lubega"];
const VILLAGES = ["Kireka", "Bweyogerere", "Namugongo", "Kyaliwajjala", "Seeta"];

function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALNUM = ALPHA + "0123456789";

/** The Playwright projects; each gets its own fixtures, with the project's tag in their surnames. */
export const PROJECTS = { desktop: "Desk", phone: "Phone" };

export function buildSeed(metadata, { clients, seed, orgUnit }) {
    const rnd = mulberry32(seed);
    const uidRnd = mulberry32(seed ^ (Date.now() & 0x7fffffff));
    const pick = (list) => list[Math.floor(rnd() * list.length)];
    const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
    const uid = () => ALPHA[Math.floor(uidRnd() * 52)] + Array.from({ length: 10 }, () => ALNUM[Math.floor(uidRnd() * 62)]).join("");
    const program = metadata.programs.find((p) => p.id === PROGRAM);
    const trackedEntityType = program.trackedEntityType.id;

    const day = (iso, offset) => {
        const d = new Date(`${iso}T00:00:00Z`);
        d.setUTCDate(d.getUTCDate() + offset);
        return d.toISOString().slice(0, 10);
    };
    const attributes = (values) =>
        Object.entries(values).filter(([, v]) => v !== undefined).map(([k, v]) => ({ attribute: A[k], value: String(v) }));
    const dataValues = (values) =>
        Object.entries(values).filter(([, v]) => v !== undefined).map(([k, v]) => ({ dataElement: D[k], value: String(v) }));

    let events = 0;
    function client({ firstName, surname, dob, sex, parent, visits }) {
        const trackedEntity = uid();
        const enrollment = uid();
        const enrolledAt = visits[0]?.date ?? "2025-01-15";
        const built = [];
        for (const visit of visits) {
            const event = uid();
            built.push({
                event, program: PROGRAM, programStage: VISIT, orgUnit, enrollment, trackedEntity,
                occurredAt: visit.date, status: "ACTIVE",
                dataValues: dataValues(visit.values),
            });
            visit.event = event;
            for (const lab of visit.labs ?? []) {
                lab.event = uid();
                built.push({
                    event: lab.event, program: PROGRAM, programStage: LAB, orgUnit, enrollment, trackedEntity,
                    occurredAt: visit.date, status: "ACTIVE",
                    dataValues: dataValues({ parentEvent: event }),
                });
            }
        }
        events += built.length;
        return {
            trackedEntity, trackedEntityType, orgUnit,
            attributes: attributes({ firstName, surname, dob, sex, category: "National", village: pick(VILLAGES), parent }),
            enrollments: [{
                enrollment, program: PROGRAM, orgUnit, trackedEntity, status: "ACTIVE",
                enrolledAt, occurredAt: enrolledAt, events: built,
            }],
        };
    }

    const trackedEntities = [];
    for (let i = 0; i < clients; i++) {
        const first = day("2025-01-01", int(0, 600));
        const visits = Array.from({ length: int(1, 4) }, (_, k) => ({
            date: day(first, k * int(14, 60)),
            values: { services: "Outpatient", opdType: "New", weight: int(40, 95), height: int(140, 190) },
            labs: rnd() < 0.2 ? [{}] : [],
        }));
        trackedEntities.push(client({
            firstName: pick(FIRST_NAMES), surname: pick(SURNAMES),
            dob: day("1960-01-01", int(0, 15000)), sex: pick(["Female", "Male"]), visits,
        }));
    }

    // Named fixtures, one or more per test and project. Surnames start with "E2e" and end with the project's tag,
    // so a search finds exactly one client.
    const fixtures = {};
    for (const [project, tag] of Object.entries(PROJECTS)) {
        const mine = (fixtures[project] = {});
        const fixture = (key, spec) => {
            const te = client({ dob: "1990-05-05", sex: "Female", ...spec });
            trackedEntities.push(te);
            mine[key] = {
                trackedEntity: te.trackedEntity,
                enrollment: te.enrollments[0].enrollment,
                firstName: spec.firstName,
                surname: spec.surname,
                visits: spec.visits.map((v) => ({ event: v.event, date: v.date, labs: (v.labs ?? []).map((l) => l.event) })),
            };
            return te;
        };
        const outpatient = (date, weight, labs = []) => ({ date, values: { services: "Outpatient", opdType: "Revisit", weight, height: 165 }, labs });

        fixture("visits", { firstName: "Ada", surname: `E2eVisits${tag}`, visits: [
            outpatient("2026-03-02", 61), outpatient("2026-05-04", 62), outpatient("2026-07-06", 63)] });
        fixture("edit", { firstName: "Ben", surname: `E2eEdit${tag}`, visits: [outpatient("2026-06-01", 70)] });
        fixture("server", { firstName: "Cleo", surname: `E2eServer${tag}`, visits: [outpatient("2026-06-02", 71)] });
        fixture("offline", { firstName: "Dina", surname: `E2eOffline${tag}`, visits: [outpatient("2026-06-03", 72)] });
        fixture("tabs", { firstName: "Eve", surname: `E2eTabs${tag}`, visits: [outpatient("2026-06-04", 73)] });
        fixture("cancel", { firstName: "Faith", surname: `E2eCancel${tag}`, visits: [outpatient("2026-06-05", 74)] });
        fixture("resend", { firstName: "Gloria", surname: `E2eResend${tag}`, visits: [outpatient("2026-06-06", 75)] });
        fixture("delete", { firstName: "Hope", surname: `E2eDelete${tag}`, visits: [
            outpatient("2026-04-01", 80), outpatient("2026-08-01", 81, [{}])] });
        // A mother with a newborn registered at each of two visits.
        const mother = fixture("mother", { firstName: "Joy", surname: `E2eMother${tag}`, visits: [
            { date: "2026-02-10", values: { services: "Outpatient", opdType: "New", weight: 66 } },
            { date: "2026-09-10", values: { services: "Outpatient", opdType: "Revisit", weight: 64 } }] });
        const [birth1, birth2] = mine.mother.visits;
        const newborn = (surname, birth) => ({
            firstName: "Baby", surname, dob: birth.date, sex: "Male", parent: mother.trackedEntity,
            visits: [{ date: birth.date, values: { services: "Child Health Services", childServices: "Newborn", parentEvent: birth.event, weight: 3 } }],
        });
        fixture("newbornOne", newborn(`E2eNewbornOne${tag}`, birth1));
        fixture("newbornTwo", newborn(`E2eNewbornTwo${tag}`, birth2));
    }

    return {
        trackedEntities,
        fixtures,
        summary: { clients: trackedEntities.length, generated: clients, events, seed },
    };
}
