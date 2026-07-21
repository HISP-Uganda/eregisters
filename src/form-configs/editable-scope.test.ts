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

function firstTitledCell(config: HmisFormConfig): string[] {
    const titles: string[] = [];
    for (const tab of config.tabs) {
        for (const section of tab.sections) {
            for (const row of section.rows) {
                const titled = row.cells.find(
                    (c) => typeof c.title === "string" && c.title.length > 0,
                );
                if (titled?.title) titles.push(titled.title);
            }
        }
    }
    return titles;
}

describe("editableScope allowlists cover at least one row", () => {
    for (const cfg of configs) {
        const scope = cfg.editableScope;
        if (!scope || scope.mode !== "allowlist") continue;

        it(`${cfg.id} has ≥1 row whose title matches an allow regex`, () => {
            const titles = firstTitledCell(cfg);
            const matched = titles.filter((t) =>
                scope.allow.some((re) => re.test(t)),
            );
            expect(
                matched.length,
                `no row in ${cfg.id} matched any of ${scope.allow.map((r) => r.source).join(", ")}`,
            ).toBeGreaterThan(0);
        });
    }
});

describe("editableScope is present on every config", () => {
    for (const cfg of configs) {
        it(`${cfg.id} declares editableScope`, () => {
            expect(cfg.editableScope, `${cfg.id} missing editableScope`).toBeDefined();
        });
    }
});
