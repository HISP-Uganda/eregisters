import { SearchOutlined, SettingOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Collapse,
    Drawer,
    Empty,
    Flex,
    Input,
    Typography,
} from "antd";
import React, { useMemo, useState } from "react";
import type { AnalyticsColumn } from "../../analytics/types";
import { useIsMobile } from "../../hooks/useIsMobile";

const { Text } = Typography;

const DEFAULT_DRAWER_WIDTH = 640;
const MAX_DRAWER_WIDTH = 900;

export function ColumnChooser({
    columns,
    visibleColumnKeys,
    onChange,
}: {
    columns: AnalyticsColumn[];
    visibleColumnKeys: string[];
    onChange: (keys: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState<string[]>([]);
    const isMobile = useIsMobile();

    const { entries, memberKeysByChooserKey } = useMemo(
        () => buildChooserEntries(columns),
        [columns],
    );
    const groups = useMemo(() => groupEntries(entries), [entries]);

    const openDrawer = () => {
        setDraft(toChooserValue(visibleColumnKeys, entries, memberKeysByChooserKey));
        setSearch("");
        setOpen(true);
    };

    const filteredGroups = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return groups;
        return groups
            .map((group) => ({
                ...group,
                entries: group.entries.filter(
                    (entry) =>
                        entry.label.toLowerCase().includes(query) ||
                        group.path.toLowerCase().includes(query),
                ),
            }))
            .filter((group) => group.entries.length > 0);
    }, [groups, search]);

    const toggleOne = (key: string, checked: boolean) => {
        setDraft((prev) =>
            checked ? [...prev, key] : prev.filter((k) => k !== key),
        );
    };

    const toggleGroup = (groupEntries: ChooserEntry[], checked: boolean) => {
        setDraft((prev) => {
            const set = new Set(prev);
            for (const entry of groupEntries) {
                if (checked) set.add(entry.key);
                else set.delete(entry.key);
            }
            return [...set];
        });
    };

    const handleUpdate = () => {
        const expanded = draft.flatMap(
            (key) => memberKeysByChooserKey.get(key) ?? [key],
        );
        onChange(expanded);
        setOpen(false);
    };

    const selectedColumnCount = draft.flatMap(
        (key) => memberKeysByChooserKey.get(key) ?? [key],
    ).length;

    return (
        <>
            <Button icon={<SettingOutlined />} onClick={openDrawer}>
                Columns
                {visibleColumnKeys.length > 0
                    ? ` (${visibleColumnKeys.length})`
                    : ""}
            </Button>
            <Drawer
                title="Line list columns"
                open={open}
                onClose={() => setOpen(false)}
                resizable={!isMobile}
                defaultSize={isMobile ? "100%" : DEFAULT_DRAWER_WIDTH}
                maxSize={MAX_DRAWER_WIDTH}
                styles={{
                    body: {
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                        overflow: "hidden",
                    },
                }}
                footer={
                    <Flex align="center" justify="space-between">
                        <Text type="secondary">
                            {selectedColumnCount} column
                            {selectedColumnCount === 1 ? "" : "s"} selected
                        </Text>
                        <Flex gap={8}>
                            <Button onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={handleUpdate}>
                                Update
                            </Button>
                        </Flex>
                    </Flex>
                }
            >
                {/* Kept out of the scrollable region below so the search
                    box stays visible while a long column list scrolls. */}
                <div style={{ padding: "24px 24px 16px" }}>
                    <Input
                        allowClear
                        prefix={<SearchOutlined />}
                        placeholder="Search columns..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",
                        padding: "0 24px 24px",
                    }}
                >
                    {filteredGroups.length === 0 ? (
                        <Empty description="No matching columns" />
                    ) : (
                        <Collapse
                            key={search.trim() ? "search" : "browse"}
                            defaultActiveKey={
                                search.trim()
                                    ? filteredGroups.map((group) => group.path)
                                    : [groups[0]?.path].filter(Boolean)
                            }
                            items={filteredGroups.map((group) => {
                                const checkedInGroup = group.entries.filter(
                                    (entry) => draft.includes(entry.key),
                                ).length;
                                const allChecked =
                                    checkedInGroup === group.entries.length;
                                return {
                                    key: group.path,
                                    label: (
                                        <Flex
                                            // justify="space-between"
                                            align="center"
                                            gap={10}
                                        >
                                            <span>{group.path}</span>
                                            <Text type="secondary">
                                                {checkedInGroup}/
                                                {group.entries.length}
                                            </Text>
                                        </Flex>
                                    ),
                                    extra: (
                                        <a
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                toggleGroup(
                                                    group.entries,
                                                    !allChecked,
                                                );
                                            }}
                                        >
                                            {allChecked
                                                ? " Clear"
                                                : " Select all"}
                                        </a>
                                    ),
                                    children: (
                                        <Flex vertical gap={6}>
                                            {group.entries.map((entry) => (
                                                <Checkbox
                                                    key={entry.key}
                                                    checked={draft.includes(
                                                        entry.key,
                                                    )}
                                                    onChange={(event) =>
                                                        toggleOne(
                                                            entry.key,
                                                            event.target
                                                                .checked,
                                                        )
                                                    }
                                                >
                                                    {entry.label}
                                                </Checkbox>
                                            ))}
                                        </Flex>
                                    ),
                                };
                            })}
                        />
                    )}
                </div>
            </Drawer>
        </>
    );
}

interface ChooserEntry {
    key: string;
    label: string;
    groupPath: string[];
}

function buildChooserEntries(columns: AnalyticsColumn[]): {
    entries: ChooserEntry[];
    memberKeysByChooserKey: Map<string, string[]>;
} {
    const entries: ChooserEntry[] = [];
    const memberKeysByChooserKey = new Map<string, string[]>();

    for (const column of columns) {
        if (!column.chooserKey) {
            entries.push({
                key: column.key,
                label: column.label,
                groupPath: column.groupPath,
            });
            continue;
        }
        const members = memberKeysByChooserKey.get(column.chooserKey);
        if (members) {
            members.push(column.key);
            continue;
        }
        memberKeysByChooserKey.set(column.chooserKey, [column.key]);
        entries.push({
            key: column.chooserKey,
            label: column.chooserLabel ?? column.label,
            groupPath: column.groupPath,
        });
    }

    return { entries, memberKeysByChooserKey };
}

function groupEntries(entries: ChooserEntry[]) {
    const groups = new Map<string, ChooserEntry[]>();
    for (const entry of entries) {
        const path = entry.groupPath.join(" / ");
        groups.set(path, [...(groups.get(path) ?? []), entry]);
    }
    return [...groups.entries()].map(([path, groupedEntries]) => ({
        path,
        entries: groupedEntries,
    }));
}

function toChooserValue(
    visibleColumnKeys: string[],
    entries: ChooserEntry[],
    memberKeysByChooserKey: Map<string, string[]>,
): string[] {
    const result: string[] = [];
    for (const entry of entries) {
        const members = memberKeysByChooserKey.get(entry.key);
        if (members) {
            if (members.every((key) => visibleColumnKeys.includes(key))) {
                result.push(entry.key);
            }
        } else if (visibleColumnKeys.includes(entry.key)) {
            result.push(entry.key);
        }
    }
    return result;
}
