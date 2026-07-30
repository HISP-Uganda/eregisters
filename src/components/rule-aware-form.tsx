import React, { useEffect } from "react";
import { EventContext, TrackedEntityContext } from "../machines";
import type { ProgramRuleResult } from "../schemas";

export function EventRuleAwareForm({
    children,
    onRuleResult,
}: {
    children: React.ReactNode;
    onRuleResult: (r: ProgramRuleResult) => void;
}) {
    const ruleResult = EventContext.useSelector((s) => s.context.ruleResult);
    useEffect(() => {
        onRuleResult(ruleResult);
    }, [ruleResult, onRuleResult]);
    return <>{children}</>;
}

export function TrackedEntityRuleAwareForm({
    children,
    onRuleResult,
}: {
    children: React.ReactNode;
    onRuleResult: (r: ProgramRuleResult) => void;
}) {
    const ruleResult = TrackedEntityContext.useSelector(
        (s) => s.context.ruleResult,
    );
    useEffect(() => {
        onRuleResult(ruleResult);
    }, [ruleResult, onRuleResult]);
    return <>{children}</>;
}
