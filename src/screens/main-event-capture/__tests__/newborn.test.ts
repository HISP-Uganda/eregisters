import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import type { FlattenedEnrollment, FlattenedTrackedEntity } from "../../../schemas";
import { newbornAttributes, newbornFirstVisit } from "../newborn";
import { showsFollowUpStage } from "../visit-tabs";

const mother = {
    trackedEntity: "mum",
    orgUnit: "ou",
    attributes: {
        KSq9EyZ8ZFi: "Jane",
        TWPNbc9O2nK: "Doe",
        XjgpfkoxffK: "Village A",
        W87HAtUHJjB: "",
        hPGgzWsb14m: "0772000000",
    },
} as unknown as FlattenedTrackedEntity;

describe("newbornAttributes", () => {
    it("copies the mother's address, joins her name, and takes the birth date from the visit", () => {
        const attributes = newbornAttributes(mother, {
            KJ2V2JlOxFi: dayjs("2026-09-01"),
            occurredAt: "2026-09-02",
        });
        expect(attributes).toEqual({
            XjgpfkoxffK: "Village A",
            Y3DE5CZWySr: "2026-09-01",
            P6Kp91wfCWy: "Jane Doe",
            ACgDjRCyX8r: "0772000000",
            lpAaZa1cKCB: "Village A",
            sOBCVNIm1kX: "Village A",
            enrolledAt: "2026-09-02",
        });
    });

    it("keeps a date of birth given as text", () => {
        expect(newbornAttributes(mother, { KJ2V2JlOxFi: "2026-08-30" }).Y3DE5CZWySr).toBe("2026-08-30");
    });
});

describe("newbornFirstVisit", () => {
    it("is a newborn child-health visit under the mother's visit, dated at enrollment", () => {
        const enrollment = {
            enrollment: "en",
            trackedEntity: "baby",
            program: "ueBhWkWll5v",
            orgUnit: "ou",
        } as FlattenedEnrollment;
        const visit = newbornFirstVisit(enrollment, { enrolledAt: "2026-09-02" }, "mumVisit");
        expect(visit).toMatchObject({
            trackedEntity: "baby",
            enrollment: "en",
            programStage: "K2nxbE9ubSs",
            parentEvent: "mumVisit",
            dataValues: {
                occurredAt: "2026-09-02",
                UuxHHVp5CnF: "Newborn",
                mrKZWf2WMIC: "Child Health Services",
            },
        });
    });
});

describe("showsFollowUpStage", () => {
    it("shows for TB, DR-TB, Leprosy, ART and HTS visits only", () => {
        expect(showsFollowUpStage("Outpatient,ART")).toBe(true);
        expect(showsFollowUpStage("Outpatient")).toBe(false);
        expect(showsFollowUpStage(undefined)).toBe(false);
    });
});
