#!/usr/bin/env node
// Prepares a DHIS2 instance for the end-to-end tests, starting from a blank one:
//
//   node e2e/setup/setup.mjs                  # everything below
//   node e2e/setup/setup.mjs --data-only      # only reset and re-seed the test facility's tracker data
//   node e2e/setup/setup.mjs --skip-import    # all but the configuration import (minutes; needed once)
//   node e2e/setup/setup.mjs --app <zip>      # also install a built app (build/bundle/eregisters-*.zip)
//   node e2e/setup/setup.mjs --app-only <zip> # only install a built app; leaves the data alone
//   node e2e/setup/setup.mjs --target perf    # the performance profile's facility and user instead (config.mjs)
//
// 1. Imports the eRegisters configuration (E2E_CONFIG, default e2e/fixtures/eregisters-config.json.gz: the program,
//    its rules, data sets and their dependencies, and the `eregisters` dataStore namespace), readable by all users.
//    The export isn't in the repo; see e2e/README.md. Steps 2 and 4 read it too, so every run but --app-only needs it.
// 2. Creates the test org unit chain (config.mjs) and assigns the program and data sets to the facility.
// 3. Creates a user role and the test user, assigned to the facility only.
// 4. Deletes the facility's tracker data and seeds it again: E2E_CLIENTS generated clients plus named fixture
//    clients the tests use (see seed-data.mjs). Writes e2e/.state/seed.json.
//
// Settings come from the environment (config.mjs). Every step can be re-run.

import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { config, ORG_UNITS, TARGETS } from "../config.mjs";
import { buildSeed } from "./seed-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const E2E = join(HERE, "..");
const args = process.argv.slice(2);
const dataOnly = args.includes("--data-only");
const skipImport = args.includes("--skip-import");
const appOnly = args.includes("--app-only");
const appZip = appOnly
    ? args[args.indexOf("--app-only") + 1]
    : args.includes("--app")
      ? args[args.indexOf("--app") + 1]
      : null;
const targetName = args.includes("--target") ? args[args.indexOf("--target") + 1] : "e2e";
const target = TARGETS[targetName];
if (!target) throw new Error(`unknown --target ${targetName}; one of ${Object.keys(TARGETS).join(", ")}`);
const FACILITY = target.facility.id;
const REPO = join(HERE, "..", "..");

const AUTH = "Basic " + Buffer.from(`${config.admin.username}:${config.admin.password}`).toString("base64");

async function api(method, path, body, { auth = AUTH, allowError = false } = {}) {
    const response = await fetch(config.dhis2Url + path, {
        method,
        headers: { Authorization: auth, ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    let json;
    try {
        json = text ? JSON.parse(text) : {};
    } catch {
        json = { raw: text.slice(0, 500) };
    }
    if (!response.ok && !allowError) {
        throw new Error(`${method} ${path}: HTTP ${response.status} ${text.slice(0, 800)}`);
    }
    return { status: response.status, json };
}

function step(name) {
    console.log(`\n== ${name}`);
}

// Who may do what with each metadata type. The tests' user must read all the configuration (the app's metadata
// requests return nothing for objects it can't read) and write data to the program and data sets.
const SHARING = {
    programs: "rwrw----",
    programStages: "rwrw----",
    trackedEntityTypes: "rwrw----",
    dataSets: "rwrw----",
    categoryOptions: "r-rw----",
    categoryCombos: "r-------",
    categories: "r-------",
    optionSets: "r-------",
    optionGroups: "r-------",
    dataElements: "r-------",
    trackedEntityAttributes: "r-------",
    programIndicators: "r-------",
};

/**
 * The setup imports the eRegisters configuration over whatever the instance has, installs the app for every user,
 * and creates users with known passwords: it is for an empty instance only. So it refuses to run on an instance
 * with any org units besides the ones it creates (a blank DHIS2 has none, a real one always has some), unless
 * E2E_ALLOW_NON_EMPTY=1.
 */
async function requireEmptyInstance() {
    if (process.env.E2E_ALLOW_NON_EMPTY === "1") return;
    const ours = [...ORG_UNITS.map((ou) => ou.id), ...Object.values(TARGETS).map((t) => t.facility.id)];
    const { json } = await api(
        "GET",
        `/api/organisationUnits?fields=id,name,displayName&pageSize=3&filter=id:!in:[${ours.join(",")}]`,
    );
    const listed = Array.isArray(json.organisationUnits) ? json.organisationUnits : [];
    const total = json.pager?.total ?? listed.length;
    if (total === 0) return;
    const names = listed.map((ou) => ou.displayName || ou.name || ou.id).filter(Boolean);
    const examples = names.length ? ` (${names.join(", ")}${total > names.length ? ", ..." : ""})` : "";
    throw new Error(
        `${config.dhis2Url} isn't an empty instance: it has ${total} org unit${total === 1 ? "" : "s"} the setup ` +
            `didn't create${examples}. ` +
            "The setup and tests replace the eRegisters configuration, install the app for every user and create " +
            "users with known passwords, so they run only against an empty DHIS2 instance created for them " +
            "(see e2e/README.md). Set E2E_ALLOW_NON_EMPTY=1 only for a dedicated test instance.",
    );
}

async function importConfiguration(configuration) {
    step("Import the eRegisters configuration");
    const metadata = {};
    for (const [type, objects] of Object.entries(configuration.metadata)) {
        metadata[type] = objects.map((object) => {
            // Attribute values refer to custom attributes that aren't part of the export.
            const { attributeValues, sharing, ...rest } = object;
            return SHARING[type]
                ? { ...rest, sharing: { public: SHARING[type], external: false, users: {}, userGroups: {} } }
                : rest;
        });
    }
    // Asynchronous: the import takes minutes, longer than an HTTP client waits for a response.
    const { json: job } = await api(
        "POST",
        "/api/metadata?importStrategy=CREATE_AND_UPDATE&atomicMode=NONE&async=true",
        metadata,
    );
    const jobId = job.response?.id;
    if (!jobId) throw new Error(`metadata import didn't start: ${JSON.stringify(job).slice(0, 300)}`);
    const started = Date.now();
    for (;;) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const { json: notes } = await api("GET", `/api/system/tasks/METADATA_IMPORT/${jobId}`);
        if ((Array.isArray(notes) ? notes : []).some((n) => n.completed)) break;
        if (Date.now() - started > 60 * 60 * 1000) throw new Error("metadata import still running after an hour");
    }
    const { json: report } = await api("GET", `/api/system/taskSummaries/METADATA_IMPORT/${jobId}`);
    console.log(`import took ${Math.round((Date.now() - started) / 1000)} s`);
    // The summary (2.43: may be empty for async imports) and the job's last message.
    const { json: notes } = await api("GET", `/api/system/tasks/METADATA_IMPORT/${jobId}`);
    console.log(`last message: ${notes?.[0]?.message ?? "-"}; stats ${JSON.stringify(report.stats ?? {})}`);
    const errors = (report.typeReports ?? []).flatMap((t) =>
        (t.objectReports ?? []).flatMap((o) => (o.errorReports ?? []).map((e) => `${t.klass?.split(".").pop()} ${o.uid}: ${e.message}`)),
    );
    // On an instance without the Ministry's full metadata most of these are expected: the export assigns the program
    // and data sets to the Ministry's facilities (one error per missing facility), and leaves out some indicators,
    // custom forms and options its data sets and rules refer to. None of it is used by the tests. Summarised by kind.
    const kinds = new Map();
    for (const e of errors) {
        const [klass] = e.split(" ");
        const ref = e.match(/Invalid reference \[\w+\] \((\w+)\)/)?.[1];
        const kind = ref ? `${klass} -> missing ${ref}` : `${klass}: ${e.slice(e.indexOf(": ") + 2).replace(/\b\d+\b|`\w+`/g, "…").slice(0, 70)}`;
        kinds.set(kind, (kinds.get(kind) ?? 0) + 1);
    }
    if (errors.length) {
        const lines = [...kinds].sort((a, b) => b[1] - a[1]).map(([kind, n]) => `${String(n).padStart(7)}  ${kind}`);
        console.log(
            `${errors.length} object errors, by kind (expected on an instance without the Ministry's org units and full metadata):\n` +
                lines.join("\n"),
        );
    }
    if (report.status === "ERROR") throw new Error("metadata import failed");

    for (const [key, value] of Object.entries(configuration.dataStore.entries)) {
        const path = `/api/dataStore/${configuration.dataStore.namespace}/${key}`;
        const exists = (await api("GET", path, undefined, { allowError: true })).status === 200;
        await api(exists ? "PUT" : "POST", path, value);
        console.log(`dataStore ${key}: ${exists ? "updated" : "created"}`);
    }
}

async function createOrgUnitsAndUser(configuration) {
    step("Org units, assignments, role and user");
    // The shared chain down to sub county, then this target's facility.
    const chain = [...ORG_UNITS.slice(0, -1), target.facility];
    const organisationUnits = chain.map((ou, i) => ({
        id: ou.id,
        name: ou.name,
        shortName: ou.name,
        openingDate: "2000-01-01",
        ...(i > 0 ? { parent: { id: chain[i - 1].id } } : {}),
    }));
    await api("POST", "/api/metadata?importStrategy=CREATE_AND_UPDATE", { organisationUnits });
    await api("POST", `/api/programs/${config.program}/organisationUnits/${FACILITY}`);
    for (const dataSet of configuration.metadata.dataSets ?? []) {
        await api("POST", `/api/dataSets/${dataSet.id}/organisationUnits/${FACILITY}`);
    }
    // The user needs to see the facility; the admin, the chain (to read and check data in the tests).
    const me = (await api("GET", "/api/me?fields=id")).json;
    await api("POST", `/api/users/${me.id}/organisationUnits/${ORG_UNITS[0].id}`, undefined, { allowError: true });
    await api("POST", `/api/users/${me.id}/dataViewOrganisationUnits/${ORG_UNITS[0].id}`, undefined, { allowError: true });
    await api("POST", `/api/users/${me.id}/teiSearchOrganisationUnits/${ORG_UNITS[0].id}`, undefined, { allowError: true });

    const role = {
        id: "E2eRole0001",
        name: "eRegisters e2e clerk",
        authorities: [
            "M_eregisters",
            "F_TRACKED_ENTITY_INSTANCE_SEARCH",
            "F_TRACKED_ENTITY_INSTANCE_ADD",
            "F_TRACKED_ENTITY_INSTANCE_DELETE",
            "F_PROGRAM_ENROLLMENT",
            "F_UNCOMPLETE_EVENT",
            "F_DATAVALUE_ADD",
            "F_DATAVALUE_DELETE",
            "F_UNCOMPLETE_DATA_SET",
        ],
    };
    const facility = [{ id: FACILITY }];
    // An existing user with this username is updated (keeping its id) rather than duplicated.
    const existing = (await api("GET", `/api/users?filter=username:eq:${encodeURIComponent(target.user.username)}&fields=id`)).json.users?.[0];
    const user = {
        ...target.user,
        ...(existing ? { id: existing.id } : {}),
        userRoles: [{ id: role.id }],
        organisationUnits: facility,
        dataViewOrganisationUnits: facility,
        teiSearchOrganisationUnits: facility,
    };
    await api("POST", "/api/metadata?importStrategy=CREATE_AND_UPDATE", { userRoles: [role] });
    await api("POST", "/api/metadata?importStrategy=CREATE_AND_UPDATE", { users: [user] });
    const userAuth = "Basic " + Buffer.from(`${target.user.username}:${target.user.password}`).toString("base64");
    const check = await api("GET", "/api/me?fields=username,organisationUnits[id]", undefined, { auth: userAuth });
    console.log(`test user ${check.json.username} at ${JSON.stringify(check.json.organisationUnits)}`);
}

async function facilityTrackedEntities() {
    const ids = [];
    for (let page = 1; ; page++) {
        const { json } = await api(
            "GET",
            `/api/tracker/trackedEntities?program=${config.program}&orgUnits=${FACILITY}&orgUnitMode=SELECTED&fields=trackedEntity&pageSize=1000&page=${page}`,
        );
        const rows = json.trackedEntities ?? json.instances ?? [];
        ids.push(...rows.map((r) => r.trackedEntity));
        if (rows.length < 1000) return ids;
    }
}

async function tracker(strategy, payload) {
    const { json } = await api(
        "POST",
        `/api/tracker?async=false&importStrategy=${strategy}&validationMode=SKIP&skipRuleEngine=true&skipSideEffects=true`,
        payload,
        { allowError: true },
    );
    if (json.status === "ERROR") {
        const errors = (json.validationReport?.errorReports ?? []).slice(0, 5).map((e) => e.message);
        throw new Error(`tracker ${strategy} failed: ${JSON.stringify(errors).slice(0, 1200)}`);
    }
    return json.stats;
}

async function seedData(configuration) {
    step("Reset and seed the facility's tracker data");
    const existing = await facilityTrackedEntities();
    for (let i = 0; i < existing.length; i += 200) {
        await tracker("DELETE", { trackedEntities: existing.slice(i, i + 200).map((trackedEntity) => ({ trackedEntity })) });
    }
    console.log(`deleted ${existing.length} clients`);

    const seed = buildSeed(configuration.metadata, {
        clients: target.clients,
        seed: config.seed,
        orgUnit: FACILITY,
        dense: target.dense,
        fixtures: target.fixtures,
    });
    const started = Date.now();
    for (let i = 0; i < seed.trackedEntities.length; i += 200) {
        await tracker("CREATE_AND_UPDATE", { trackedEntities: seed.trackedEntities.slice(i, i + 200) });
    }
    console.log(
        `seeded ${seed.summary.clients} clients, ${seed.summary.events} events in ${Math.round((Date.now() - started) / 1000)} s`,
    );
    const state = join(REPO, target.state);
    mkdirSync(dirname(state), { recursive: true });
    writeFileSync(
        state,
        JSON.stringify({ summary: seed.summary, facility: FACILITY, fixtures: seed.fixtures, picks: seed.picks }, null, 1),
    );
}

/** Whether the app is installed: the tests open the build installed on the instance, not a local one. */
async function appInstalled() {
    const { json: apps } = await api("GET", "/api/apps");
    return Array.isArray(apps) && apps.some((app) => app.key === "eregisters");
}

async function installApp(zipPath) {
    step(`Install ${basename(zipPath)}`);
    const form = new FormData();
    form.append("file", new Blob([readFileSync(zipPath)]), basename(zipPath));
    const response = await fetch(config.dhis2Url + "/api/apps", { method: "POST", headers: { Authorization: AUTH }, body: form });
    if (!response.ok) throw new Error(`app install: HTTP ${response.status} ${(await response.text()).slice(0, 300)}`);
    console.log("installed");
}

await requireEmptyInstance();

if (appOnly) {
    if (!appZip) throw new Error("--app-only needs the zip to install");
    await installApp(appZip);
    process.exit(0);
}

const configFile = config.configFile ?? join(E2E, "fixtures", "eregisters-config.json.gz");
if (!existsSync(configFile)) {
    throw new Error(
        `The eRegisters configuration export isn't at ${configFile}. It isn't in the repo: get eregisters-config.json.gz ` +
            "from the eRegisters team, and put it there or set E2E_CONFIG to its path (see e2e/README.md).",
    );
}
const configuration = JSON.parse(gunzipSync(readFileSync(configFile)).toString());
const info = (await api("GET", "/api/system/info")).json;
console.log(`DHIS2 ${info.version} at ${config.dhis2Url}; target ${targetName} (${target.facility.name})`);
if (!dataOnly) {
    // The import replaces the program's and data sets' org unit assignments, so assign after it.
    if (!skipImport) await importConfiguration(configuration);
    await createOrgUnitsAndUser(configuration);
}
if (appZip) await installApp(appZip);
await seedData(configuration);
if (!appZip && !dataOnly && !(await appInstalled())) {
    console.log(
        `\nThe app isn't installed on ${config.dhis2Url}, and the tests need it. Build and install it:\n` +
            "  pnpm build && pnpm e2e:setup --app-only build/bundle/eregisters-*.zip",
    );
}
