import React from "react";
import {
    App,
    Button,
    Card,
    ConfigProvider,
    Input,
    Space,
    Tabs,
    Typography,
} from "antd";
import { HMIS_106A_04_CONFIG } from "../form-configs/Hmis106A04.config";
import type {
    HmisCellConfig,
    HmisFormConfig,
    HmisRowConfig,
    HmisSectionConfig,
} from "../form-configs/types";

const { Title, Text } = Typography;

const TEAL = "#66a5ad";
const LIGHT_BLUE = "#c4dfe6";
const COC_SEPARATOR = "-";

export type Hmis106A04Values = Record<string, string>;

export interface Hmis106A04FormProps {
    period?: string;
    orgUnit?: string;
    initialValues?: Hmis106A04Values;
    readOnly?: boolean;
    config?: HmisFormConfig;
    onSave?: (payload: {
        period?: string;
        orgUnit?: string;
        dataValues: Array<{
            dataElement: string;
            categoryOptionCombo: string;
            value: string;
        }>;
    }) => void | Promise<void>;
}

function dataValueKey(dataElement: string, categoryOptionCombo: string) {
    return `${dataElement}${COC_SEPARATOR}${categoryOptionCombo}`;
}

function cleanNumericValue(raw: string) {
    return raw.replace(/[^\d]/g, "");
}

function getRowClassName(row: HmisRowConfig) {
    switch (row.type) {
        case "section":
            return "hmis105-section-row";
        case "subhead":
            return "hmis105-subhead-row";
        case "label":
            return "hmis105-label-row";
        default:
            return "hmis105-data-row";
    }
}

function getCellStyle(cell: HmisCellConfig): React.CSSProperties {
    return {
        textAlign: cell.style?.align as React.CSSProperties["textAlign"],
        background: cell.style?.background,
    };
}

const Hmis106A04Styles = () => (
    <style>
        {`
      .hmis105-form-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
      }

      .hmis105-form-table th,
      .hmis105-form-table td {
        border: 1px solid ${TEAL};
        padding: 4px 6px;
        vertical-align: middle;
      }

      .hmis105-section-title-row td,
      .hmis105-section-row td {
        background: ${TEAL} !important;
        color: #ffffff;
        font-weight: 700;
      }

      .hmis105-subhead-row td,
      .hmis105-subhead-row th {
        background: ${LIGHT_BLUE} !important;
        font-weight: 700;
        text-align: center;
      }

      .hmis105-data-row:hover td,
      .hmis105-label-row:hover td {
        background: ${LIGHT_BLUE} !important;
      }

      .hmis105-field {
        width: 5em;
        max-width: 90px;
      }

      .hmis105-field.ant-input-disabled {
        background-color: #e6e6e6 !important;
        color: #333 !important;
        cursor: not-allowed !important;
      }
    `}
    </style>
);

const FieldCell: React.FC<{
    cell: HmisCellConfig;
    values: Hmis106A04Values;
    readOnly: boolean;
    setValue: (
        dataElement: string,
        categoryOptionCombo: string,
        value: string,
    ) => void;
}> = ({ cell, values, readOnly, setValue }) => {
    if (!cell.dataElement || !cell.categoryOptionCombo) {
        return <Input size="small" className="hmis105-field" disabled />;
    }

    const key = dataValueKey(cell.dataElement, cell.categoryOptionCombo);

    return (
        <Input
            size="small"
            className="hmis105-field"
            inputMode="numeric"
            title={cell.title ?? key}
            value={values[key] ?? ""}
            disabled={readOnly}
            onChange={(event) => {
                setValue(
                    cell.dataElement!,
                    cell.categoryOptionCombo!,
                    cleanNumericValue(event.target.value),
                );
            }}
        />
    );
};

const RenderCell: React.FC<{
    cell: HmisCellConfig;
    values: Hmis106A04Values;
    readOnly: boolean;
    setValue: (
        dataElement: string,
        categoryOptionCombo: string,
        value: string,
    ) => void;
}> = ({ cell, values, readOnly, setValue }) => {
    const content =
        cell.kind === "field" ? (
            <FieldCell
                cell={cell}
                values={values}
                readOnly={readOnly}
                setValue={setValue}
            />
        ) : (
            cell.text
        );

    return (
        <td
            colSpan={cell.colSpan}
            rowSpan={cell.rowSpan}
            title={cell.title}
            style={getCellStyle(cell)}
        >
            {content}
        </td>
    );
};

const SectionTable: React.FC<{
    section: HmisSectionConfig;
    values: Hmis106A04Values;
    readOnly: boolean;
    setValue: (
        dataElement: string,
        categoryOptionCombo: string,
        value: string,
    ) => void;
}> = ({ section, values, readOnly, setValue }) => {
    return (
        <table className="hmis105-form-table">
            <tbody>
                <tr className="hmis105-section-title-row">
                    <td colSpan={section.columnCount}>{section.title}</td>
                </tr>

                {section.rows.map((row) => (
                    <tr key={row.key} className={getRowClassName(row)}>
                        {row.cells.map((cell, index) => (
                            <RenderCell
                                key={`${row.key}-${cell.key}-${index}`}
                                cell={cell}
                                values={values}
                                readOnly={readOnly}
                                setValue={setValue}
                            />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const InnerHmis106A04Form: React.FC<Hmis106A04FormProps> = ({
    period,
    orgUnit,
    initialValues,
    readOnly = false,
    config = HMIS_106A_04_CONFIG,
    onSave,
}) => {
    const { message } = App.useApp();
    const [values, setValues] = React.useState<Hmis106A04Values>(
        initialValues ?? {},
    );

    React.useEffect(() => {
        setValues(initialValues ?? {});
    }, [initialValues]);

    const setValue = React.useCallback(
        (dataElement: string, categoryOptionCombo: string, value: string) => {
            setValues((previous) => ({
                ...previous,
                [dataValueKey(dataElement, categoryOptionCombo)]: value,
            }));
        },
        [],
    );

    const handleSave = async () => {
        const dataValues = Object.entries(values)
            .filter(([, value]) => value !== "" && value != null)
            .map(([key, value]) => {
                const [dataElement, categoryOptionCombo] =
                    key.split(COC_SEPARATOR);

                return {
                    dataElement,
                    categoryOptionCombo,
                    value,
                };
            });

        const payload = {
            period,
            orgUnit,
            dataValues,
        };

        if (onSave) {
            await onSave(payload);
        } else {
            // eslint-disable-next-line no-console
            console.log("HMIS 106A:04 dataValueSet payload:", payload);
            message.success(
                `Prepared ${dataValues.length} data value(s) for submission.`,
            );
        }
    };

    const items = config.tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        children: (
            <div>
                {tab.sections.map((section) => (
                    <SectionTable
                        key={section.key}
                        section={section}
                        values={values}
                        readOnly={readOnly}
                        setValue={setValue}
                    />
                ))}
            </div>
        ),
    }));

    return (
        <Card
            styles={{ body: { paddingTop: 12, overflowX: "auto" } }}
            title={
                <Title level={4} style={{ margin: 0, color: "#fff" }}>
                    {config.title}
                </Title>
            }
            headStyle={{ background: TEAL }}
            extra={
                <Button type="primary" onClick={handleSave} disabled={readOnly}>
                    Save
                </Button>
            }
        >
            <Hmis106A04Styles />

            <Space size="middle" style={{ marginBottom: 12 }} wrap>
                {period && (
                    <Text type="secondary">
                        Period: <strong>{period}</strong>
                    </Text>
                )}

                {orgUnit && (
                    <Text type="secondary">
                        Org unit: <strong>{orgUnit}</strong>
                    </Text>
                )}
            </Space>

            <Tabs tabPosition="left" defaultActiveKey="tab1" items={items} />
        </Card>
    );
};

const Hmis106A04Form: React.FC<Hmis106A04FormProps> = (props) => (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: TEAL,
                borderRadius: 4,
            },
            components: {
                Tabs: {
                    itemSelectedColor: TEAL,
                    inkBarColor: TEAL,
                },
                Card: {
                    headerBg: TEAL,
                },
            },
        }}
    >
        <App>
            <InnerHmis106A04Form {...props} />
        </App>
    </ConfigProvider>
);

export default Hmis106A04Form;
