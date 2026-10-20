import dayjs from "dayjs";
import { getEventsCollection } from "@/db/collections";
import type { FlattenedEnrollment, FlattenedEvent, ProgramRuleResult } from "@/schemas";
import { generateUid } from "@/utils/id";
import { materializeEventActions } from "./action-effects";
import { getLocalAuthor } from "@/db/local-author";

/** Commit effects once at save; rule reevaluation itself never writes events. */
export async function commitRuleEventActions(source: FlattenedEvent, result?: ProgramRuleResult | null,
	parentEvent: string | null = source.parentEvent ?? source.event, syncStatus: "draft" | "pending" = "draft") {
	if (!result?.eventActions?.length) return;
	const actions = result.eventActions.filter((action) => !result.blockedStages?.includes(action.programStage));
	for (const action of actions) {
		const date = action.type === "SCHEDULEEVENT" ? action.date : source.dataValues?.occurredAt;
		if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !dayjs(date).isValid() || dayjs(date).format("YYYY-MM-DD") !== date) {
			throw new Error("Set a valid event date before creating or scheduling an event.");
		}
	}
	const collection = getEventsCollection();
	const rows = materializeEventActions(actions, source,
		collection.toArray.filter((event) => !event.deleted && event.syncStatus !== "deleted"),
		{ generateUid, now: dayjs().toISOString() });
	for (const row of rows) {
		// These events belong to the same visit, including when their source is a child stage.
		if (parentEvent === null) delete row.parentEvent;
		else row.parentEvent = parentEvent;
		row.syncStatus = syncStatus;
		const author = getLocalAuthor();
		if (author) { row.createdBy = author; row.updatedBy = author; }
		await collection.insert(row).isPersisted.promise;
	}
}

/** Enrollment rules have no source event; generated events must not link to a fictitious parent. */
export async function commitEnrollmentRuleActions(enrollment: FlattenedEnrollment, values: Record<string, any>,
	result?: ProgramRuleResult | null, syncStatus: "draft" | "pending" = "pending") {
	if (!result?.eventActions?.length) return;
	const date = values.enrolledAt ?? "";
	const source: FlattenedEvent = {
		event: enrollment.enrollment, enrollment: enrollment.enrollment, program: enrollment.program,
		programStage: "", orgUnit: enrollment.orgUnit, trackedEntity: enrollment.trackedEntity,
		occurredAt: date, dataValues: { occurredAt: date }, status: "ACTIVE", followUp: false, deleted: false,
		createdAt: enrollment.createdAt, updatedAt: enrollment.updatedAt, version: 1, syncStatus,
		lastSynced: "", syncError: "",
	};
	await commitRuleEventActions(source, result, null, syncStatus);
}
