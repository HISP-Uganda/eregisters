import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, Flex, Input, Popover } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
    enumeratePeriods,
    normalizePeriodType,
    parsePeriodId,
    type Period,
} from "../utils/periods";

interface PeriodPickerProps {
    periodType: string | undefined;
    value?: string;
    onChange: (period: string | undefined) => void;
    disabled?: boolean;
    allowFuture?: boolean;
    placeholder?: string;
}

export default function PeriodPicker({
    periodType,
    value,
    onChange,
    disabled = false,
    allowFuture = false,
    placeholder,
}: PeriodPickerProps) {
    const normalizedType = useMemo(
        () => normalizePeriodType(periodType),
        [periodType],
    );
    const currentYear = dayjs().year();

    const [targetYear, setTargetYear] = useState(() => {
        const parsed = value ? parsePeriodId(value) : null;
        return parsed ? parsed.year : currentYear;
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const parsed = value ? parsePeriodId(value) : null;
        setTargetYear(parsed ? parsed.year : currentYear);
    }, [open, value, currentYear]);

    const periods = useMemo<Period[]>(() => {
        if (!normalizedType || normalizedType === "Daily") return [];
        return enumeratePeriods(normalizedType, targetYear);
    }, [normalizedType, targetYear]);

    const selectedLabel = useMemo(() => {
        if (!value) return "";
        const parsed = parsePeriodId(value);
        if (!parsed) return value;
        const items = enumeratePeriods(parsed.type, parsed.year);
        const match = items.find((p) => p.id === value);
        return match ? match.label : value;
    }, [value]);

    if (!normalizedType) {
        const ph = placeholder ?? "Select a dataset first";
        return (
            <Input
                disabled
                placeholder={ph}
                style={{ width: `${Math.max(ph.length + 6, 20)}ch` }}
            />
        );
    }

    if (normalizedType === "Daily") {
        const dailyValue = (() => {
            if (!value || !/^\d{8}$/.test(value)) return null;
            const iso = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
            const d = dayjs(iso);
            return d.isValid() ? d : null;
        })();
        return (
            <DatePicker
                style={{ width: "100%" }}
                disabled={disabled}
                allowClear
                value={dailyValue}
                format="YYYY-MM-DD"
                disabledDate={
                    allowFuture
                        ? undefined
                        : (d) => !!d && d.isAfter(dayjs(), "day")
                }
                onChange={(date) =>
                    onChange(date ? date.format("YYYYMMDD") : undefined)
                }
            />
        );
    }

    const today = dayjs();
    const nextYearBlocked = !allowFuture && targetYear >= currentYear;

    const overlay = (
        <div>
            <Flex
                align="center"
                justify="space-between"
                style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
                }}
            >
                <Button
                    type="text"
                    size="small"
                    icon={<LeftOutlined />}
                    onClick={() => setTargetYear((y) => y - 1)}
                />
                <div style={{ fontWeight: 500, fontSize: 14 }}>
                    {targetYear}
                </div>
                <Button
                    type="text"
                    size="small"
                    icon={<RightOutlined />}
                    disabled={nextYearBlocked}
                    onClick={() => setTargetYear((y) => y + 1)}
                />
            </Flex>
            <div
                style={{
                    maxHeight: 360,
                    overflowY: "auto",
                    padding: "4px 0",
                }}
            >
                {periods.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No periods"
                        style={{ padding: 12 }}
                    />
                ) : (
                    periods.map((p) => {
                        const isFuture =
                            !allowFuture && p.start.isAfter(today, "day");
                        const isSelected = p.id === value;
                        return (
                            <PeriodRow
                                key={p.id}
                                period={p}
                                isFuture={isFuture}
                                isSelected={isSelected}
                                onSelect={() => {
                                    onChange(p.id);
                                    setOpen(false);
                                }}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );

    const triggerText = selectedLabel || placeholder || "Select period";
    const triggerWidth = `${Math.max(triggerText.length + 6, 20)}ch`;

    return (
        <Popover
            open={disabled ? false : open}
            onOpenChange={(v) => !disabled && setOpen(v)}
            trigger="click"
            placement="bottomLeft"
            arrow={false}
            content={overlay}
            styles={{ content: { padding: 0 } }}
        >
            <Input
                readOnly
                disabled={disabled}
                value={selectedLabel}
                placeholder={placeholder ?? "Select period"}
                suffix={
                    <DownOutlined
                        style={{
                            color: "rgba(0,0,0,0.25)",
                            fontSize: 12,
                        }}
                    />
                }
                style={{
                    width: triggerWidth,
                    cursor: disabled ? "not-allowed" : "pointer",
                }}
            />
        </Popover>
    );
}

function PeriodRow({
    period,
    isFuture,
    isSelected,
    onSelect,
}: {
    period: Period;
    isFuture: boolean;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const [hover, setHover] = useState(false);
    const background = isSelected
        ? "rgba(22, 119, 255, 0.08)"
        : hover && !isFuture
          ? "rgba(0, 0, 0, 0.04)"
          : undefined;
    return (
        <div
            role="button"
            aria-disabled={isFuture}
            onClick={() => {
                if (!isFuture) onSelect();
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                padding: "6px 12px",
                cursor: isFuture ? "not-allowed" : "pointer",
                color: isFuture ? "rgba(0, 0, 0, 0.25)" : undefined,
                background,
                fontWeight: isSelected ? 500 : undefined,
                fontSize: 13,
                userSelect: "none",
            }}
        >
            {period.label}
        </div>
    );
}
