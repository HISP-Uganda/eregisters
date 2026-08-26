import { SettingOutlined } from "@ant-design/icons";
import { Button, Checkbox, Drawer, Flex, Typography } from "antd";
import React, { useState } from "react";
import type { AnalyticsColumn } from "../../analytics/types";

const { Text } = Typography;

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
    const groups = groupColumns(columns);

    return (
        <>
            <Button icon={<SettingOutlined />} onClick={() => setOpen(true)}>
                Columns
            </Button>
            <Drawer
                title="Line list columns"
                open={open}
                onClose={() => setOpen(false)}
                width={460}
            >
                <Checkbox.Group
                    value={visibleColumnKeys}
                    onChange={(keys) => onChange(keys.map(String))}
                    style={{ width: "100%" }}
                >
                    <Flex vertical gap="middle">
                        {groups.map((group) => (
                            <Flex vertical gap={8} key={group.path}>
                                <Text strong>{group.path}</Text>
                                <Flex vertical gap={6}>
                                    {group.columns.map((column) => (
                                        <Checkbox
                                            key={column.key}
                                            value={column.key}
                                        >
                                            {column.label}
                                        </Checkbox>
                                    ))}
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </Checkbox.Group>
            </Drawer>
        </>
    );
}

function groupColumns(columns: AnalyticsColumn[]) {
    const groups = new Map<string, AnalyticsColumn[]>();
    for (const column of columns) {
        const path = column.groupPath.join(" / ");
        groups.set(path, [...(groups.get(path) ?? []), column]);
    }
    return [...groups.entries()].map(([path, groupedColumns]) => ({
        path,
        columns: groupedColumns,
    }));
}
