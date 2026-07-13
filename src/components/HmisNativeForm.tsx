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
import type {
    HmisNativeFormCell,
    HmisNativeFormDefinition,
    HmisNativeFormSection,
    setValue,
} from "../form-configs/types";

const { Title, Text } = Typography;

const TEAL = "#66a5ad";
const LIGHT_BLUE = "#c4dfe6";
const COC_SEPARATOR = "_";

export type HmisNativeValues = Map<string, string>;

export interface HmisNativeFormProps {
    period?: string;
    orgUnit?: string;
    initialValues?: HmisNativeValues;
    readOnly?: boolean;
    config: HmisNativeFormDefinition;
    onSave?: (payload: {
        period?: string;
        orgUnit?: string;
        dataValues: Array<{
            dataElement: string;
            categoryOptionCombo: string;
            value: string;
        }>;
    }) => void | Promise<void>;
    attributeOptionCombo: string;
}

function dataValueKey(
    dataElement: string,
    categoryOptionCombo: string,
    attributeOptionCombo: string,
) {
    return `${dataElement}${COC_SEPARATOR}${categoryOptionCombo}${COC_SEPARATOR}${attributeOptionCombo}`;
}

function cleanNumericValue(raw: string) {
    return raw.replace(/[^\d]/g, "");
}

function getCellStyle(cell: HmisNativeFormCell): React.CSSProperties {
    return {
        textAlign: cell.align,
        verticalAlign: cell.verticalAlign,
        background: cell.background,
        width: cell.width,
    };
}

const NativeFormStyles = () => (
    <style>
        {`
      .hmis-native-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
      }

      .hmis-native-table th,
      .hmis-native-table td {
        border: 1px solid ${TEAL};
        padding: 4px 6px;
        vertical-align: middle;
      }

      .hmis-native-section-title td {
        background: ${TEAL} !important;
        color: #ffffff;
        font-weight: 700;
      }

      .hmis-native-table .section-subhead td {
        background: ${LIGHT_BLUE} !important;
        font-weight: 700;
        text-align: center;
      }

      .hmis-native-table tr:not(.hmis-native-section-title):not(.section-subhead):hover td {
        background: ${LIGHT_BLUE} !important;
      }

      .hmis-native-field {
        width: 5em;
        max-width: 90px;
      }

      .hmis-native-field.ant-input-disabled {
        background-color: #e6e6e6 !important;
        color: #333 !important;
        cursor: not-allowed !important;
      }

      .hmis-native-tabs {
        min-height: 0;
      }

      .hmis-native-tabs > .ant-tabs {
        height: 100% !important;
        min-height: 0 !important;
        display: flex !important;
        overflow: hidden !important;
      }

      .hmis-native-tabs .ant-tabs-nav {
        background: #f7fafb;
        border-right: 1px solid #d5e3e6;
        padding: 8px 6px;
        flex: 0 0 auto !important;
        align-self: stretch !important;
      }

      .hmis-native-tabs .ant-tabs-content-holder {
        flex: 1 1 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
        padding: 0 0 0 12px;
      }

      .hmis-native-tab-scroll::-webkit-scrollbar {
        width: 8px;
      }

      .hmis-native-tab-scroll::-webkit-scrollbar-thumb {
        background: #c5d5d9;
        border-radius: 4px;
      }

      .hmis-native-tabs .ant-tabs-content-holder::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .hmis-native-tabs .ant-tabs-content-holder::-webkit-scrollbar-thumb {
        background: #c5d5d9;
        border-radius: 4px;
      }

      .hmis-native-tabs .ant-tabs-nav .ant-tabs-nav-wrap {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        height: 100%;
      }

      .hmis-native-tabs .ant-tabs-nav .ant-tabs-nav-wrap::before,
      .hmis-native-tabs .ant-tabs-nav .ant-tabs-nav-wrap::after {
        display: none !important;
      }

      .hmis-native-tabs .ant-tabs-nav .ant-tabs-nav-operations {
        display: none !important;
      }

      .hmis-native-tabs .ant-tabs-nav .ant-tabs-nav-wrap {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .hmis-native-tabs .ant-tabs-nav .ant-tabs-nav-wrap::-webkit-scrollbar {
        display: none;
      }

      .hmis-native-tabs .ant-tabs-tab {
        height: auto !important;
        padding: 10px 12px !important;
        margin: 4px 2px !important;
        border-radius: 6px;
        transition: background-color 0.15s ease;
      }

      .hmis-native-tabs .ant-tabs-tab .ant-tabs-tab-btn {
        color: #4a5b60 !important;
        font-weight: 500;
        white-space: normal !important;
        word-break: break-word;
        line-height: 1.35;
        text-align: left;
      }

      .hmis-native-tabs .ant-tabs-tab:not(.ant-tabs-tab-active):hover {
        background: #e6f0f2 !important;
      }

      .hmis-native-tabs .ant-tabs-tab.ant-tabs-tab-active {
        background: ${TEAL} !important;
        box-shadow: 0 1px 3px rgba(102, 165, 173, 0.35);
      }

      .hmis-native-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #ffffff !important;
        font-weight: 600 !important;
      }

      .hmis-native-tabs .ant-tabs-ink-bar {
        display: none !important;
      }
    `}
    </style>
);

const FieldCell: React.FC<{
    cell: HmisNativeFormCell;
    values: HmisNativeValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
}> = ({ cell, values, readOnly, setValue, attributeOptionCombo }) => {
    if (!cell.dataElement || !cell.categoryOptionCombo) {
        return <Input size="small" className="hmis-native-field" disabled />;
    }

    const key = dataValueKey(
        cell.dataElement,
        cell.categoryOptionCombo,
        attributeOptionCombo,
    );
    return (
        <Input
            size="small"
            className="hmis-native-field"
            inputMode="numeric"
            title={cell.title ?? key}
            value={values.getOrInsert(key, "")}
            disabled={readOnly || cell.disabled}
            onChange={(event) => {
                setValue({
                    attributeOptionCombo: cell.attributeOptionCombo!,
                    dataElement: cell.dataElement!,
                    categoryOptionCombo: cell.categoryOptionCombo!,
                    value: cleanNumericValue(event.target.value),
                });
            }}
        />
    );
};

const RenderCell: React.FC<{
    cell: HmisNativeFormCell;
    values: HmisNativeValues;
    readOnly: boolean;
    rowKey: string;
    index: number;
    setValue: setValue;
    attributeOptionCombo: string;
}> = ({ cell, values, readOnly, setValue, attributeOptionCombo }) => {
    const isField = Boolean(cell.dataElement && cell.categoryOptionCombo);

    const content = isField ? (
        <FieldCell
            cell={cell}
            values={values}
            readOnly={readOnly}
            setValue={setValue}
            attributeOptionCombo={attributeOptionCombo}
        />
    ) : (
        cell.label
    );

    return (
        <td
            colSpan={cell.colSpan}
            rowSpan={cell.rowSpan}
            title={cell.title}
            className={cell.className}
            style={getCellStyle(cell)}
        >
            {content}
        </td>
    );
};

const SectionTable: React.FC<{
    section: HmisNativeFormSection;
    values: HmisNativeValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
}> = ({ section, values, readOnly, setValue, attributeOptionCombo }) => {
    return (
        <table className="hmis-native-table">
            <tbody>
                <tr className="hmis-native-section-title">
                    <td colSpan={section.colSpan}>{section.title}</td>
                </tr>

                {section.rows.map((row) => (
                    <tr key={row.key} className={row.className}>
                        {row.cells.map((cell, index) => (
                            <RenderCell
                                key={`${row.key}-${index}`}
                                cell={cell}
                                values={values}
                                readOnly={readOnly}
                                rowKey={row.key}
                                index={index}
                                setValue={setValue}
                                attributeOptionCombo={attributeOptionCombo}
                            />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const InnerHmisNativeForm: React.FC<HmisNativeFormProps> = ({
    period,
    orgUnit,
    initialValues,
    readOnly = false,
    config,
    onSave,
    attributeOptionCombo,
}) => {
    const { message } = App.useApp();
    const [values, setValues] = React.useState<HmisNativeValues>(
        initialValues ?? new Map(),
    );

    React.useEffect(() => {
        setValues(initialValues ?? new Map());
    }, [initialValues]);

    const setValue = React.useCallback(
        ({
            dataElement,
            categoryOptionCombo,
            attributeOptionCombo,
            value,
        }: {
            dataElement: string;
            categoryOptionCombo: string;
            attributeOptionCombo: string;
            value: string;
        }) => {
            setValues((previous) =>
                previous.set(
                    dataValueKey(
                        dataElement,
                        categoryOptionCombo,
                        attributeOptionCombo,
                    ),
                    value,
                ),
            );
        },
        [],
    );

    const handleSave = async () => {
        const dataValues = Object.entries(values)
            .filter(([, value]) => value !== "" && value != null)
            .map(([key, value]) => {
                const [dataElement, categoryOptionCombo] =
                    key.split(COC_SEPARATOR);

                return { dataElement, categoryOptionCombo, value };
            });

        const payload = { period, orgUnit, dataValues };

        if (onSave) {
            await onSave(payload);
        } else {
            message.success(
                `Prepared ${dataValues.length} data value(s) for submission.`,
            );
        }
    };

    const items = config.tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        children: (
            <div
                className="hmis-native-tab-scroll"
                tabIndex={0}
                onWheel={(e) => {
                    e.preventDefault();
                    e.currentTarget.scrollTop += e.deltaY;
                    e.stopPropagation();
                }}
                style={{
                    maxHeight: "calc(100vh - 260px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                    overscrollBehavior: "contain",
                    paddingRight: 6,
                    outline: "none",
                }}
            >
                {tab.sections.map((section) => (
                    <SectionTable
                        key={section.key}
                        section={section}
                        values={values}
                        readOnly={readOnly}
                        setValue={setValue}
                        attributeOptionCombo={attributeOptionCombo}
                    />
                ))}
            </div>
        ),
    }));

    return (
        <Card
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
            styles={{
                body: {
                    paddingTop: 12,
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                },
                header: { background: TEAL, flexShrink: 0 },
            }}
            title={
                <Title level={4} style={{ margin: 0, color: "#fff" }}>
                    {config.title}
                </Title>
            }
            extra={
                <Button type="primary" onClick={handleSave} disabled={readOnly}>
                    Save
                </Button>
            }
        >
            <NativeFormStyles />

            <Space
                size="middle"
                style={{ marginBottom: 12, flexShrink: 0 }}
                wrap
            >
                {period && (
                    <Text type="secondary">
                        Period: <strong>{period}</strong>
                    </Text>
                )}
            </Space>

            <div
                className="hmis-native-tabs"
                style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
            >
                <Tabs
                    style={{ height: "100%" }}
                    tabPlacement="start"
                    defaultActiveKey="tab1"
                    type="card"
                    items={items}
                    tabBarStyle={{ width: 220, minWidth: 220 }}
                />
            </div>
        </Card>
    );
};

const HmisNativeForm: React.FC<HmisNativeFormProps> = (props) => (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: TEAL,
                borderRadius: 4,
            },
            components: {
                Tabs: {
                    itemColor: "#4a5b60",
                    itemHoverColor: TEAL,
                    itemSelectedColor: "#ffffff",
                    inkBarColor: "transparent",
                },
                Card: {
                    headerBg: TEAL,
                },
            },
        }}
    >
        <App
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <InnerHmisNativeForm {...props} />
        </App>
    </ConfigProvider>
);

export default HmisNativeForm;
