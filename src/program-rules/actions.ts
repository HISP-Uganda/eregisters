import { ProgramRuleAction, ProgramRuleResult } from "../schemas";

function addOnce(list: string[], id: string) {
    if (!list.includes(id)) list.push(id);
}

function addOnceUnder(map: Record<string, string[]>, key: string, id: string) {
    map[key] ??= [];
    addOnce(map[key], id);
}

/**
 * Applies one action of a rule whose condition held. `targetId` is the
 * action's data element or attribute. Action types not listed here are
 * ignored — including `HIDEPROGRAMSTAGE`, deliberately: the one real rule
 * using it ("TB- If TB treatment outcome has value. block future events or
 * encounters", YFZmzMxHfAx) would hide the Medical Visit stage, the only
 * visit stage, so a client with a TB outcome could never be seen again.
 * See wayfinder ticket "Which program-rule gaps against DHIS2 should be
 * fixed?".
 */
export function applyAction(
    result: ProgramRuleResult,
    action: ProgramRuleAction,
    targetId: string,
    evaluateExpression: (expression: string) => any,
) {
    const section = action.programStageSection?.id;
    const option = action.option?.id;
    const optionGroup = action.optionGroup?.id;
    const message =
        targetId && action.content
            ? { key: targetId, content: action.content }
            : undefined;

    switch (action.programRuleActionType) {
        case "ASSIGN":
            if (targetId && action.data) {
                result.assignments[targetId] = evaluateExpression(action.data);
            }
            break;
        case "HIDEFIELD":
            if (targetId) addOnce(result.hiddenFields, targetId);
            break;
        case "SHOWFIELD":
            if (targetId) addOnce(result.shownFields, targetId);
            break;
        case "SETMANDATORYFIELD":
            if (targetId) addOnce(result.mandatoryFields, targetId);
            break;
        case "HIDESECTION":
            if (section) addOnce(result.hiddenSections, section);
            break;
        case "SHOWSECTION":
            if (section) addOnce(result.shownSections, section);
            break;
        case "HIDEOPTION":
            if (targetId && option) addOnceUnder(result.hiddenOptions, targetId, option);
            break;
        case "SHOWOPTION":
            if (targetId && option) addOnceUnder(result.shownOptions, targetId, option);
            break;
        case "HIDEOPTIONGROUP":
            if (targetId && optionGroup) {
                addOnceUnder(result.hiddenOptionGroups, targetId, optionGroup);
            }
            break;
        case "SHOWOPTIONGROUP":
            if (targetId && optionGroup) {
                addOnceUnder(result.shownOptionGroups, targetId, optionGroup);
            }
            break;
        // Messages are not de-duplicated.
        case "DISPLAYTEXT":
            if (message) result.messages.push(message);
            break;
        case "ERROR":
        case "SHOWERROR":
            if (message) result.errors.push(message);
            break;
        case "SHOWWARNING":
            if (message) result.warnings.push(message);
            break;
    }
}
