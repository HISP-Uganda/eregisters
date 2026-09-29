import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import React from "react";
import { isPeriodFullyPast } from "@/utils/periods";
import { TEAL } from "./theme";
import { formatVerifiedAt } from "./values";

/**
 * The report's header actions: verify (or re-submit a verified report —
 * which stays editable), only once its period has fully ended; who verified
 * it and when; and "Revoke verification".
 */
export function VerifyActions({
    period,
    readOnly,
    isVerified,
    verifiedBy,
    verifiedAt,
    saving,
    onVerify,
    onRevoke,
}: {
    period?: string;
    readOnly: boolean;
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: string | number;
    saving: boolean;
    onVerify: () => void;
    onRevoke?: () => void | Promise<void>;
}) {
    const periodBlocked = !period || !isPeriodFullyPast(period);
    const disabled = readOnly || periodBlocked;
    const label = isVerified
        ? "Verified — Re-submit to Update"
        : periodBlocked && period
          ? "Waiting for period to end"
          : "Mark Report as Verified";
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
            <Button
                type="default"
                icon={isVerified ? <CheckCircleOutlined /> : undefined}
                onClick={onVerify}
                disabled={disabled}
                loading={saving}
                style={style}
                title={
                    periodBlocked && period && !readOnly
                        ? "This period has not yet fully ended — verification will be enabled once the period is in the past."
                        : undefined
                }
            >
                {label}
            </Button>
            {isVerified && onRevoke && !readOnly && (
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
