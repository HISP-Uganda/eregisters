import { DashboardOutlined, MoreOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import type { useMetadata } from "../../hooks/useMetadata";
import { FlattenedTrackedEntity, TrackedEntityAttribute } from "../../schemas";

/**
 * Its items have no click handlers, and the column only appears for an
 * attribute with id "actions", which the program doesn't have — see the
 * map's "commented-out code" item.
 */
const actionMenu: MenuProps = {
    items: [
        { key: "dashboard", label: "Patient Dashboard", icon: <DashboardOutlined /> },
        { key: "patient", label: "Patient Summary", icon: <UserOutlined /> },
    ],
};

/** Not an attribute: which facility registered the client. */
const REGISTERING_FACILITY = {
    displayInList: true,
    displayFormName: "Registering Facility",
    name: "Registering Facility",
    id: "registeringFacility",
    valueType: "TEXT",
    optionSetValue: false,
    generated: false,
    unique: false,
    pattern: "",
    confidential: false,
};

type Listed = Pick<TrackedEntityAttribute, "id" | "name" | "displayFormName"> & { displayInList?: boolean };

function column(attribute: Listed, orgUnit: string, orgUnitName: string | undefined) {
    const title = attribute.displayFormName || attribute.name;
    switch (attribute.id) {
        case "registeringFacility":
            return {
                title,
                key: attribute.id,
                render: (record: FlattenedTrackedEntity) => (record.orgUnit === orgUnit ? orgUnitName : "N/A"),
            };
        case "oTI0DLitzFY":
            // The village is stored as "Name (Village)"; the list shows the part in brackets.
            return {
                title,
                key: attribute.id,
                dataIndex: ["attributes", "oTI0DLitzFY"],
                render: (text: unknown) => String(text).split("(")[1]?.replace(")", ""),
            };
        case "actions":
            return {
                title: "Action",
                key: "action",
                fixed: "right" as const,
                width: 100,
                render: () => (
                    // The row is clickable — stop the click so the menu doesn't also open the client.
                    <span onClick={(e) => e.stopPropagation()}>
                        <Dropdown menu={actionMenu} trigger={["click"]}>
                            <Button type="text" icon={<MoreOutlined />} style={{ color: "#666", fontSize: 20 }} />
                        </Dropdown>
                    </span>
                ),
            };
        default:
            return { title, dataIndex: ["attributes", attribute.id], key: attribute.id };
    }
}

/** The results table's columns: the program's list attributes, then the registering facility. */
export function clientColumns({
    program,
    trackedEntityAttributes,
    orgUnit,
    orgUnitName,
}: Pick<ReturnType<typeof useMetadata>, "program" | "trackedEntityAttributes" | "orgUnit" | "orgUnitName">): ColumnsType<FlattenedTrackedEntity> {
    const listed: Listed[] = [
        ...program.programTrackedEntityAttributes.map(({ trackedEntityAttribute: { id }, ...rest }) => ({
            ...rest,
            ...trackedEntityAttributes.get(id)!,
        })),
        REGISTERING_FACILITY,
    ];
    return listed.filter((a) => a.displayInList).map((a) => column(a, orgUnit, orgUnitName));
}

// A "Delete client" column, switched off — see the map's "commented-out code" item.
// columns.push({
//     title: "Action",
//     key: "delete",
//     fixed: "right" as const,
//     width: 80,
//     render: (_: unknown, record: FlattenedTrackedEntity) => (
//         <Popconfirm
//             title="Delete Client"
//             description="Are you sure you want to delete this client and all their visits?"
//             okText="Delete"
//             okType="danger"
//             onConfirm={async () => {
//                 try {
//                     const { needsSync } =
//                         await deleteTrackedEntityWithChildren(
//                             record.trackedEntity,
//                         );
//                     if (needsSync) {
//                         syncActor.send({ type: "PUSH_DATA" });
//                     }
//                 } catch (error) {
//                     console.error("Failed to delete client:", error);
//                 }
//             }}
//         >
//             <Button danger icon={<DeleteOutlined />} size="small" />
//         </Popconfirm>
//     ),
// });
