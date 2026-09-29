import type { ColumnsType } from "antd/es/table";
import type { useMetadata } from "@/hooks/useMetadata";
import { FlattenedTrackedEntity, TrackedEntityAttribute } from "@/schemas";

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
