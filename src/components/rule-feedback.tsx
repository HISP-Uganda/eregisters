import React from "react";
import { Alert, Typography } from "antd";
import type { Message, ProgramRuleResult } from "@/schemas";

function content(message: Message) {
    const value = message.value;
    return value === undefined ? message.content : `${message.content}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`;
}

export function RuleMessages({ messages, type = "info" }: { messages: Message[]; type?: "info" | "warning" | "error" }) {
    return <>{messages.map((message, index) => <Alert key={index} type={type} title={content(message)} showIcon style={{ marginBottom: 8 }} />)}</>;
}

/** Field messages are rendered beside their field; untargeted feedback appears once. */
export function RuleFeedback({ result }: { result: ProgramRuleResult }) {
    const global = (messages: Message[]) => messages.filter(message => !message.key);
    const widgets = new Map<string, Message[]>();
    for (const message of global([...result.messages, ...(result.displayKeyValues ?? [])])) {
        const location = message.location ?? "";
        widgets.set(location, [...(widgets.get(location) ?? []), message]);
    }
    return <>
        <RuleMessages type="error" messages={global(result.errors)} />
        <RuleMessages type="warning" messages={global(result.warnings)} />
        {[...widgets].map(([location, messages]) => <section key={location} aria-label={location || "Program rule feedback"}>
            {location && <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>{location === "feedback" ? "Feedback" : location === "indicators" ? "Indicators" : location}</Typography.Text>}
            <RuleMessages messages={messages} />
        </section>)}
    </>;
}
