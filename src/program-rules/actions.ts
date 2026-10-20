import { ProgramRuleAction, ProgramRuleResult } from "@/schemas";

function addOnce(list: string[], id: string) {
    if (!list.includes(id)) list.push(id);
}
function addOnceUnder(map: Record<string, string[]>, key: string, id: string) {
    map[key] ??= [];
    addOnce(map[key], id);
}

/** Pure action evaluation. Event/notification effects are committed at save/sync. */
export function applyAction(result: ProgramRuleResult, action: ProgramRuleAction, targetId: string,
    evaluateExpression: (expression: string) => any) {
    const section = action.programStageSection?.id;
    const option = action.option?.id;
    const optionGroup = action.optionGroup?.id;
    const evaluatable = ["ASSIGN", "DISPLAYTEXT", "DISPLAYKEYVALUEPAIR", "SHOWERROR", "ERROR", "SHOWWARNING", "ERRORONCOMPLETE", "WARNINGONCOMPLETE", "SCHEDULEMESSAGE"];
    const value = action.data && evaluatable.includes(action.programRuleActionType) ? evaluateExpression(action.data) : undefined;
    const content = `${action.content ?? ""}${value == null ? "" : String(value)}`;
    const message = content ? {
        key: targetId, content,
        ...(action.location ? { location: action.location } : {}),
    } : undefined;
    switch (action.programRuleActionType) {
        case "ASSIGN":
            if (targetId && action.data) result.assignments[targetId] = value;
            break;
        case "HIDEFIELD": if (targetId) addOnce(result.hiddenFields, targetId); break;
        case "SHOWFIELD": if (targetId) addOnce(result.shownFields, targetId); break;
        case "SETMANDATORYFIELD": if (targetId) addOnce(result.mandatoryFields, targetId); break;
        case "HIDESECTION": if (section) addOnce(result.hiddenSections, section); break;
        case "SHOWSECTION": if (section) addOnce(result.shownSections, section); break;
        case "HIDEPROGRAMSTAGE":
            if (action.programStage?.id) addOnce(result.blockedStages ??= [], action.programStage.id);
            break;
        case "HIDEOPTION": if (targetId && option) addOnceUnder(result.hiddenOptions, targetId, option); break;
        case "SHOWOPTION": if (targetId && option) addOnceUnder(result.shownOptions, targetId, option); break;
        case "HIDEOPTIONGROUP": if (targetId && optionGroup) addOnceUnder(result.hiddenOptionGroups, targetId, optionGroup); break;
        case "SHOWOPTIONGROUP": if (targetId && optionGroup) addOnceUnder(result.shownOptionGroups, targetId, optionGroup); break;
        case "DISPLAYTEXT": if (message) result.messages.push(message); break;
        case "DISPLAYKEYVALUEPAIR":
            (result.displayKeyValues ??= []).push({ key: targetId, content: action.content ?? "", value,
                ...(action.location ? { location: action.location } : {}) });
            break;
        case "ERROR": case "SHOWERROR": if (message) result.errors.push(message); break;
        case "SHOWWARNING": if (message) result.warnings.push(message); break;
        case "ERRORONCOMPLETE": if (message) (result.completionErrors ??= []).push(message); break;
        case "WARNINGONCOMPLETE": if (message) (result.completionWarnings ??= []).push(message); break;
        case "SENDMESSAGE": case "SCHEDULEMESSAGE":
            if (action.templateUid) (result.notificationActions ??= []).push({
                actionId: action.id, type: action.programRuleActionType, template: action.templateUid,
                ...(action.programRuleActionType === "SCHEDULEMESSAGE" && value ? { date: String(value) } : {}),
                execution: "server",
            });
            break;
    }
}
