import { describe, expect, it } from "vitest";
import * as Hmis033b from "./Hmis033b.config";
import * as Hmis10501 from "./Hmis10501.config";
import * as Hmis1050203 from "./Hmis1050203.config";
import * as Hmis1050405 from "./Hmis1050405.config";
import * as Hmis1050609 from "./Hmis1050609.config";
import * as Hmis10510 from "./Hmis10510.config";
import * as Hmis106A0102 from "./Hmis106A0102.config";
import * as Hmis106A03 from "./Hmis106A03.config";
import * as Hmis106A04 from "./Hmis106A04.config";
import * as Hmis108 from "./Hmis108.config";
import type { HmisFormConfig } from "./types";

const modules = {
    Hmis033b,
    Hmis10501,
    Hmis1050203,
    Hmis1050405,
    Hmis1050609,
    Hmis10510,
    Hmis106A0102,
    Hmis106A03,
    Hmis106A04,
    Hmis108,
};

const isFormConfig = (v: unknown): v is HmisFormConfig =>
    !!v &&
    typeof v === "object" &&
    Array.isArray((v as { tabs?: unknown }).tabs);

const configs: HmisFormConfig[] = Array.from(
    new Set(
        Object.values(modules).flatMap((m) =>
            Object.values(m).filter(isFormConfig),
        ),
    ),
);

describe("form configs render section titles exactly once", () => {
    // HmisForm.tsx renders section.title as its own <tr>, then iterates every
    // row from the config. Any row containing text equal to its section.title
    // would render the same heading twice.
    for (const cfg of configs) {
        it(`${cfg.id} has no row whose text duplicates section.title`, () => {
            const dups: string[] = [];
            for (const tab of cfg.tabs) {
                for (const section of tab.sections) {
                    const title = section.title.trim();
                    if (!title) continue;
                    for (const row of section.rows) {
                        for (const cell of row.cells) {
                            const text = (cell.text ?? "").trim();
                            if (text && text === title) {
                                dups.push(
                                    `${tab.key}/${section.key}/${row.key} -> ${JSON.stringify(title)}`,
                                );
                            }
                        }
                    }
                }
            }
            expect(dups, dups.join("\n")).toEqual([]);
        });
    }
});
