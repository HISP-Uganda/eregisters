import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import React from "react";
import { TEAL } from "./theme";
import { formatVerifiedAt, verifyButtonState } from "./values";

/**
 * The report's header actions: verify (or re-submit a verified report —
 * which stays editable), only once its period has fully ended; who verified
 * it and when; and "Revoke verification". Users who may not verify (the
 * admin's verifier roles) get a disabled button saying why, and no revoke.
 */
export function VerifyActions({
    period,
    readOnly,
    isVerified,
    verifiedBy,
    verifiedAt,
    saving,
    canVerify,
    onVerify,
    onRevoke,
}: {
    period?: string;
    readOnly: boolean;
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: string | number;
    saving: boolean;
    canVerify: boolean;
    onVerify: () => void;
    onRevoke?: () => void | Promise<void>;
}) {
    const { label, disabled, title } = verifyButtonState({ period, readOnly, isVerified, canVerify });
    // A disabled button stays readable on the teal header.
    const style: React.CSSProperties = disabled
        ? {
              background: "#ffffff",
              borderColor: "#ffffff",
              color: TEAL,
              opacity: 1,
              cursor: "not-allowed",
              fontWeight: 600,
          }
        : { fontWeight: 600 };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isVerified && (verifiedBy || verifiedAt) && (
                <span style={{ color: "#fff", fontSize: 12, opacity: 0.9 }}>
                    {verifiedBy ? `by ${verifiedBy}` : ""}
                    {verifiedBy && verifiedAt ? " · " : ""}
                    {verifiedAt ? formatVerifiedAt(verifiedAt) : ""}
                </span>
            )}
            {!canVerify && isVerified && (
                <span style={{ color: "#fff", fontWeight: 600 }}>
                    <CheckCircleOutlined /> Verified
                </span>
            )}
            <Button
                type="default"
                icon={canVerify && isVerified ? <CheckCircleOutlined /> : undefined}
                onClick={onVerify}
                disabled={disabled}
                loading={saving}
                style={style}
                title={title}
            >
                {label}
            </Button>
            {canVerify && isVerified && onRevoke && !readOnly && (
                <Popconfirm
                    title="Revoke verification?"
                    description="This will mark the report as unverified for everyone. Continue?"
                    okText="Revoke"
                    okType="danger"
                    onConfirm={() => onRevoke()}
                >
                    <Button danger>Revoke verification</Button>
                </Popconfirm>
            )}
        </div>
    );
}
