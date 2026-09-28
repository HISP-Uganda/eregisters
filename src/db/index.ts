import Dexie, { Table } from "dexie";
import type { HmisDraft } from "./hmis-drafts";

/**
 * Dexie's `MOHRegisterDB` — today only the HMIS aggregate report drafts
 * (`hmis-drafts.ts`), kept here on both storage backends. Its other
 * tables were the Dexie-era metadata copies; nothing has read them since
 * metadata moved behind `MetadataStore`, so version 5 deletes them on
 * devices (wayfinder "Simplify the codebase", ticket "Can the unused
 * MOHRegisterDB tables and old migration code go?"). The earlier versions
 * stay declared so a device on any old schema still upgrades.
 */
class RegisterDatabase extends Dexie {
    hmisDrafts!: Table<HmisDraft, string>;

    constructor() {
        super("MOHRegisterDB");
        this.version(1).stores({
            programRules: "id,program",
            programRuleVariables: "id,program",
            dataElements: "id,name",
            programIndicators: "id,name",
            trackedEntityAttributes: "id,name",
            organisationUnits: "id,name,path",
            optionSets: "[id+optionSet],id,optionSet,name,code",
            optionGroups: "[id+optionGroup],id,optionGroup,name,code",
            programs: "id,name,programType",
            metadataVersions: "id,lastSync",
            metadataSyncProgress: "id,status,updatedAt",
            syncState: "id,status,updatedAt",
            indicatorEvaluations: "id,eventId,updatedAt,version",
            categoryOptionCombos: "id,name",
            dataSets: "id,name",
        });
        this.version(2).stores({
            uiConfig: "id",
        });
        this.version(3).stores({
            hmisDrafts: "id, dataSet, period, orgUnit, syncStatus",
        });
        this.version(4).stores({
            stageHierarchy: "id",
        });
        this.version(5).stores({
            programRules: null,
            programRuleVariables: null,
            dataElements: null,
            programIndicators: null,
            trackedEntityAttributes: null,
            organisationUnits: null,
            optionSets: null,
            optionGroups: null,
            programs: null,
            metadataVersions: null,
            metadataSyncProgress: null,
            syncState: null,
            indicatorEvaluations: null,
            categoryOptionCombos: null,
            dataSets: null,
            uiConfig: null,
            stageHierarchy: null,
        });
    }
}
export const db = new RegisterDatabase();
