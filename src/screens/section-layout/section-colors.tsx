import { Button, ColorPicker, Flex, Popover, Space, Tooltip, Typography } from "antd";
import React from "react";
import { SectionStyle } from "../../schemas";

const COLORS: Array<{ key: keyof SectionStyle; label: string }> = [
    { key: "titleColor", label: "Title color" },
    { key: "headerBg", label: "Header background" },
    { key: "borderColor", label: "Border color" },
];

/** A section header's colour pickers, behind a swatch button. */
export function SectionColors({
    style,
    onChange,
}: {
    style: SectionStyle;
    onChange: (patch: Partial<SectionStyle>) => void;
}) {
    return (
        <Popover
            trigger="click"
            placement="bottomRight"
            title="Section colors"
            content={
                <Space direction="vertical" size={8}>
                    {COLORS.map(({ key, label }) => (
                        <Flex key={key} align="center" justify="space-between" gap={12}>
                            <Typography.Text style={{ fontSize: 12 }}>{label}</Typography.Text>
                            <ColorPicker
                                allowClear
                                value={style[key] ?? null}
                                onChangeComplete={(color) =>
                                    onChange({ [key]: color ? color.toHexString() : undefined })
                                }
                            />
                        </Flex>
                    ))}
                    <Button
                        size="small"
                        block
                        onClick={() =>
                            onChange({ titleColor: undefined, headerBg: undefined, borderColor: undefined })
                        }
                    >
                        Reset to default
                    </Button>
                </Space>
            }
        >
            <Tooltip title="Section colors">
                <Button
                    type="text"
                    size="small"
                    icon={
                        <span
                            style={{
                                display: "inline-block",
                                width: 14,
                                height: 14,
                                borderRadius: 3,
                                background:
                                    style.headerBg ??
                                    "linear-gradient(135deg,#ffdd57 0%,#ff5f6d 50%,#4facfe 100%)",
                                border: `1px solid ${style.borderColor ?? "#d9d9d9"}`,
                                verticalAlign: "middle",
                            }}
                        />
                    }
                />
            </Tooltip>
        </Popover>
    );
}
