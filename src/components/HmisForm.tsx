import { CheckCircleOutlined } from "@ant-design/icons";
import {
    App,
    Button,
    Card,
    ConfigProvider,
    InputNumber,
    Tabs,
    Typography,
} from "antd";
import React, { useState } from "react";
import {
    draftId,
    getHmisDraft,
    upsertHmisDraft,
} from "../db/hmis-drafts";
import type { HmisDraft } from "../db/hmis-drafts";
import type {
    HmisCellConfig,
    HmisEditableScope,
    HmisFormConfig,
    HmisFormValues,
    HmisRowConfig,
    HmisSectionConfig,
    setValue,
} from "../form-configs/types";

export type { HmisFormValues } from "../form-configs/types";

const { Title } = Typography;

const TEAL = "#66a5ad";
const LIGHT_BLUE = "#c4dfe6";
const COC_SEPARATOR = "_";

export interface HmisFormProps {
    period?: string;
    orgUnit?: string;
    dataSet?: string;
    initialValues?: HmisFormValues;
    readOnly?: boolean;
    config: HmisFormConfig;
    onSave?: (payload: {
        period?: string;
        orgUnit?: string;
        dataValues: Array<{
            dataElement: string;
            categoryOptionCombo: string;
            value: string;
            attributeOptionCombo: string;
        }>;
    }) => void | Promise<void>;
    attributeOptionCombo: string;
    isVerified?: boolean;
    syncStatus?: HmisDraft["syncStatus"];
}

function dataValueKey(
    dataElement: string,
    categoryOptionCombo: string,
    attributeOptionCombo: string,
) {
    return `${dataElement}${COC_SEPARATOR}${categoryOptionCombo}${COC_SEPARATOR}${attributeOptionCombo}`;
}

function cleanNumericValue(raw: unknown) {
    if (raw === null || raw === undefined) return "";
    return String(raw).replace(/[^\d]/g, "");
}

function isRowEditable(
    row: HmisRowConfig,
    scope: HmisEditableScope | undefined,
): boolean {
    if (!scope || scope.mode === "all") return true;
    if (scope.mode === "none") return false;
    const identifying = row.cells.find(
        (c) => typeof c.title === "string" && c.title.length > 0,
    );
    if (!identifying?.title) return false;
    return scope.allow.some((re) => re.test(identifying.title!));
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
        width: cell.style?.width,
        verticalAlign: cell.style?.verticalAlign,
    };
}

const HmisFormStyles = () => (
    <style>
        {`
      .hmis105-form-table {
        width: auto;
        border-collapse: separate;
        border-spacing: 0;
        margin-bottom: 16px;
        border-left: 1px solid ${TEAL};
        border-top: 1px solid ${TEAL};
      }

      .hmis105-form-table th,
      .hmis105-form-table td {
        border-right: 1px solid ${TEAL};
        border-bottom: 1px solid ${TEAL};
        padding: 4px;
        vertical-align: middle;
        min-width: 80px;
      }

      .hmis105-form-table thead th,
      .hmis105-form-table thead td {
        position: sticky;
        top: 0;
        z-index: 3;
      }

      .hmis105-form-table .hmis105-sticky-col {
        position: sticky;
        z-index: 2;
        background: #ffffff;
      }

      .hmis105-form-table thead .hmis105-sticky-col {
        z-index: 4;
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

      .hmis105-data-row:hover .hmis105-sticky-col,
      .hmis105-label-row:hover .hmis105-sticky-col {
        background: ${LIGHT_BLUE} !important;
      }

      .hmis105-field {
        min-width: 80px;
        width: 80px;
        text-align: center;
      }

      /* antd v6 InputNumber uses .ant-input-number-disabled on the wrapper
         and .ant-input-number-input on the actual <input>. Its default
         disabled color is rgba(0,0,0,0.25) which is unreadable on our grey
         background — override both selectors. */
      .hmis105-field.ant-input-number-disabled,
      .hmis105-field.ant-input-disabled {
        background-color: #e6e6e6 !important;
        cursor: not-allowed !important;
      }

      .hmis105-field.ant-input-number-disabled .ant-input-number-input,
      .hmis105-field.ant-input-disabled .ant-input-number-input,
      .hmis105-field.ant-input-number-disabled input,
      .hmis105-field.ant-input-disabled input {
        color: #000 !important;
        -webkit-text-fill-color: #000 !important;
        cursor: not-allowed !important;
      }

      .hmis105-tabs {
        min-height: 0;
      }

      .hmis105-tabs > .ant-tabs {
        height: 100% !important;
        min-height: 0 !important;
        display: flex !important;
        overflow: hidden !important;
      }

      .hmis105-tabs .ant-tabs-nav {
        background: #f7fafb;
        border-right: 1px solid #d5e3e6;
        // padding: 8px 6px;
        flex: 0 0 auto !important;
        align-self: stretch !important;
      }

      .hmis105-tabs .ant-tabs-content-holder {
        flex: 1 1 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
        // padding: 0 0 0 12px;
      }

      .hmis105-tab-scroll::-webkit-scrollbar {
        width: 8px;
      }

      .hmis105-tab-scroll::-webkit-scrollbar-thumb {
        background: #c5d5d9;
        border-radius: 4px;
      }

      .hmis105-tabs .ant-tabs-content-holder::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .hmis105-tabs .ant-tabs-content-holder::-webkit-scrollbar-thumb {
        background: #c5d5d9;
        border-radius: 4px;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap {
        overflow: auto !important;
        height: 100%;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap::before,
      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap::after {
        display: none !important;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-operations {
        display: none !important;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap::-webkit-scrollbar {
        display: none;
      }

      .hmis105-tabs .ant-tabs-tab {
        height: auto !important;
        // padding: 10px 12px !important;
        // margin: 4px 2px !important;
        border-radius: 6px;
        transition: background-color 0.15s ease;
      }

      .hmis105-tabs .ant-tabs-tab .ant-tabs-tab-btn {
        color: #4a5b60 !important;
        font-weight: 500;
        white-space: normal !important;
        word-break: break-word;
        line-height: 1.35;
        text-align: left;
      }

      .hmis105-tabs .ant-tabs-tab:not(.ant-tabs-tab-active):hover {
        background: #e6f0f2 !important;
      }

      .hmis105-tabs .ant-tabs-tab.ant-tabs-tab-active {
        background: ${TEAL} !important;
        box-shadow: 0 1px 3px rgba(102, 165, 173, 0.35);
      }

      .hmis105-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #ffffff !important;
        font-weight: 600 !important;
      }

      .hmis105-tabs .ant-tabs-ink-bar {
        display: none !important;
      }
    `}
    </style>
);

const FieldCell: React.FC<{
    cell: HmisCellConfig;
    values: HmisFormValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
    rowEditable: boolean;
}> = ({
    cell,
    values,
    readOnly,
    setValue,
    attributeOptionCombo,
    rowEditable,
}) => {
    if (!cell.dataElement || !cell.categoryOptionCombo) {
        return (
            <InputNumber
                className="hmis105-field"
                disabled
                style={{ width: "100%", textAlign: "center" }}
            />
        );
    }

    const key = dataValueKey(
        cell.dataElement,
        cell.categoryOptionCombo,
        attributeOptionCombo,
    );

    return (
        <InputNumber
            className="hmis105-field"
            inputMode="numeric"
            title={cell.title ?? key}
            value={values.getOrInsert(key, "")}
            disabled={readOnly || !!cell.disabled || !rowEditable}
            style={{ width: "100%" }}
            onChange={(value) => {
                setValue({
                    attributeOptionCombo: cell.attributeOptionCombo!,
                    dataElement: cell.dataElement!,
                    categoryOptionCombo: cell.categoryOptionCombo!,
                    value: cleanNumericValue(value),
                });
            }}
        />
    );
};

const STICKY_COL_WIDTH = 80;

const RenderCell: React.FC<{
    cell: HmisCellConfig;
    values: HmisFormValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
    stickyLeft?: number;
    rowEditable: boolean;
}> = ({
    cell,
    values,
    readOnly,
    setValue,
    attributeOptionCombo,
    stickyLeft,
    rowEditable,
}) => {
    const stickyStyle: React.CSSProperties =
        stickyLeft !== undefined ? { left: stickyLeft } : {};
    const stickyClass =
        stickyLeft !== undefined ? "hmis105-sticky-col" : undefined;

    if (cell.kind === "field") {
        return (
            <td
                colSpan={cell.colSpan}
                rowSpan={cell.rowSpan}
                title={cell.title}
                className={stickyClass}
                style={{
                    ...getCellStyle(cell),
                    textAlign: "center",
                    ...stickyStyle,
                }}
            >
                <FieldCell
                    cell={cell}
                    values={values}
                    readOnly={readOnly}
                    setValue={setValue}
                    attributeOptionCombo={attributeOptionCombo}
                    rowEditable={rowEditable}
                />
            </td>
        );
    }

    return (
        <td
            colSpan={cell.colSpan}
            rowSpan={cell.rowSpan}
            title={cell.title}
            className={stickyClass}
            style={{ ...getCellStyle(cell), ...stickyStyle }}
        >
            {cell.text}
        </td>
    );
};

// Tracks columns occupied by a rowSpan from a previous row.
// Values are the remaining rows (>=1 means "still occupied for this row").
type RowSpanCarry = Map<number, number>;

const renderRow = (
    row: HmisRowConfig,
    frozenColumns: number,
    values: HmisFormValues,
    readOnly: boolean,
    setValue: setValue,
    attributeOptionCombo: string,
    carry: RowSpanCarry,
    rowEditable: boolean,
) => {
    let cursor = 0;
    const advancePastCarry = () => {
        while (carry.has(cursor)) cursor++;
    };
    advancePastCarry();

    const cellNodes = row.cells.map((cell, index) => {
        const startCol = cursor;
        const span = cell.colSpan ?? 1;
        const rSpan = cell.rowSpan ?? 1;
        for (let i = 0; i < span; i++) {
            if (rSpan > 1) carry.set(startCol + i, rSpan - 1);
        }
        cursor += span;
        advancePastCarry();

        const stickyLeft =
            frozenColumns > 0 && startCol < frozenColumns
                ? startCol * STICKY_COL_WIDTH
                : undefined;
        return (
            <RenderCell
                key={`${row.key}-${cell.key}-${index}`}
                cell={cell}
                values={values}
                readOnly={readOnly}
                setValue={setValue}
                attributeOptionCombo={attributeOptionCombo}
                stickyLeft={stickyLeft}
                rowEditable={rowEditable}
            />
        );
    });

    // Decrement carry counts for next row; drop entries that have expired.
    for (const [col, remaining] of Array.from(carry.entries())) {
        if (remaining <= 1) carry.delete(col);
        else carry.set(col, remaining - 1);
    }

    return (
        <tr key={row.key} className={getRowClassName(row)}>
            {cellNodes}
        </tr>
    );
};

const SectionTable: React.FC<{
    section: HmisSectionConfig;
    values: HmisFormValues;
    readOnly: boolean;
    setValue: setValue;
    attributeOptionCombo: string;
    editableScope: HmisEditableScope | undefined;
}> = ({
    section,
    values,
    readOnly,
    setValue,
    attributeOptionCombo,
    editableScope,
}) => {
    const frozenColumns = section.frozenColumns ?? 1;
    const carry: RowSpanCarry = new Map();

    const firstNonHead = section.rows.findIndex((r) => r.type !== "subhead");
    const headRows =
        firstNonHead === -1
            ? section.rows
            : section.rows.slice(0, firstNonHead);
    const bodyRows =
        firstNonHead === -1 ? [] : section.rows.slice(firstNonHead);

    return (
        <table className="hmis105-form-table">
            <thead>
                <tr className="hmis105-section-title-row">
                    <td
                        colSpan={section.columnCount}
                        className={
                            frozenColumns > 0 ? "hmis105-sticky-col" : undefined
                        }
                        style={frozenColumns > 0 ? { left: 0 } : undefined}
                    >
                        {section.title}
                    </td>
                </tr>
                {headRows.map((row) =>
                    renderRow(
                        row,
                        frozenColumns,
                        values,
                        readOnly,
                        setValue,
                        attributeOptionCombo,
                        carry,
                        true,
                    ),
                )}
            </thead>
            <tbody>
                {bodyRows.map((row) =>
                    renderRow(
                        row,
                        frozenColumns,
                        values,
                        readOnly,
                        setValue,
                        attributeOptionCombo,
                        carry,
                        isRowEditable(row, editableScope),
                    ),
                )}
            </tbody>
        </table>
    );
};

const InnerHmisForm: React.FC<HmisFormProps> = ({
    period,
    orgUnit,
    dataSet,
    initialValues,
    readOnly = false,
    config,
    onSave,
    attributeOptionCombo,
    isVerified = false,
    syncStatus = "draft",
}) => {
    // A verified report is not read-only — the user can still edit values
    // and re-submit. The button label communicates the current state.
    const effectiveReadOnly = readOnly;
    const [loading, setLoading] = useState<boolean>(false);
    const { message } = App.useApp();
    const [values, setValues] = React.useState<HmisFormValues>(
        initialValues ?? new Map(),
    );

    const draftKey =
        dataSet && period && orgUnit && attributeOptionCombo
            ? draftId({
                  dataSet,
                  period,
                  orgUnit,
                  attributeOptionCombo,
              })
            : undefined;

    const draftTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const latestValuesRef = React.useRef<HmisFormValues>(values);

    // Keep the latest-values ref in sync so the unmount flush writes fresh data.
    React.useEffect(() => {
        latestValuesRef.current = values;
    }, [values]);

    const flushDraft = React.useCallback(
        async (nextValues: HmisFormValues) => {
            if (!draftKey || !dataSet || !period || !orgUnit) return;
            const existing = await getHmisDraft(draftKey);
            await upsertHmisDraft({
                id: draftKey,
                dataSet,
                period,
                orgUnit,
                attributeOptionCombo,
                values: Object.fromEntries(nextValues),
                isVerified: existing?.isVerified ?? false,
                verifiedAt: existing?.verifiedAt,
                updatedAt: Date.now(),
                syncStatus:
                    existing?.syncStatus === "synced"
                        ? "draft"
                        : existing?.syncStatus ?? "draft",
            });
        },
        [draftKey, dataSet, period, orgUnit, attributeOptionCombo],
    );

    // Final flush on unmount — only when there's a pending timer to avoid a
    // redundant write when the user has already stopped typing for 500 ms.
    // If an in-flight `flushDraft` promise from an earlier timer is still
    // resolving when unmount fires, both writes carry the same `values` payload
    // (via `latestValuesRef`), and Dexie's `put` is last-write-wins on the same
    // primary key — safe by construction, not by ordering.
    React.useEffect(() => {
        return () => {
            if (draftTimerRef.current !== null) {
                clearTimeout(draftTimerRef.current);
                draftTimerRef.current = null;
                void flushDraft(latestValuesRef.current);
            }
        };
        // Intentionally not depending on flushDraft — this effect is a lifecycle
        // hook, not a data effect. flushDraft is closed over via useRef pattern.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setValue = React.useCallback(
        ({
            dataElement,
            categoryOptionCombo,
            value,
        }: {
            dataElement: string;
            categoryOptionCombo: string;
            value: string;
        }) => {
            setValues((previous) => {
                const key = dataValueKey(
                    dataElement,
                    categoryOptionCombo,
                    attributeOptionCombo,
                );
                const next = new Map(previous).set(key, value);
                // eslint-disable-next-line no-console
                console.log("[setValue]", { key, value, size: next.size });
                if (draftTimerRef.current !== null) {
                    clearTimeout(draftTimerRef.current);
                }
                draftTimerRef.current = setTimeout(() => {
                    draftTimerRef.current = null;
                    void flushDraft(next);
                }, 500);
                return next;
            });
        },
        [attributeOptionCombo, flushDraft],
    );

    const handleSave = async () => {
        setLoading(() => true);
        const dataValues = Array.from(values.entries())
            .filter(([, value]) => value !== "" && value != null)
            .map(([key, value]) => {
                const [dataElement, categoryOptionCombo, attributeOptionCombo] =
                    key.split(COC_SEPARATOR);

                return {
                    dataElement,
                    categoryOptionCombo,
                    attributeOptionCombo,
                    value,
                };
            });

        const payload = { period, orgUnit, dataValues, attributeOptionCombo };

        // eslint-disable-next-line no-console
        console.log("[handleSave] payload", {
            valuesSize: values.size,
            dataValuesLength: dataValues.length,
            first3: dataValues.slice(0, 3),
            attributeOptionCombo,
            period,
            orgUnit,
        });

        if (onSave) {
            await onSave(payload);
        } else {
            message.success(
                `Prepared ${dataValues.length} data value(s) for submission.`,
            );
        }
        setLoading(() => false);
    };

    const items = config.tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        children: (
            <div
                className="hmis105-tab-scroll"
                tabIndex={0}
                style={{
                    maxHeight: "calc(100vh - 260px)",
                    overflow: "auto",
                    // overflowX: "hidden",
                    overscrollBehavior: "contain",
                    padding: "0 10px",
                    outline: "none",
                }}
            >
                {tab.sections.map((section) => (
                    <SectionTable
                        key={section.key}
                        section={section}
                        values={values}
                        readOnly={effectiveReadOnly}
                        setValue={setValue}
                        attributeOptionCombo={attributeOptionCombo}
                        editableScope={config.editableScope}
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
                    margin: 0,
                    padding: "10px 0",
                },
                header: { background: TEAL, flexShrink: 0 },
            }}
            title={
                <Title level={4} style={{ margin: 0, color: "#fff" }}>
                    {config.title}
                </Title>
            }
            extra={
                <Button
                    type="default"
                    icon={
                        isVerified && syncStatus === "synced" ? (
                            <CheckCircleOutlined />
                        ) : undefined
                    }
                    onClick={handleSave}
                    disabled={effectiveReadOnly}
                    loading={loading}
                >
                    {isVerified && syncStatus === "synced"
                        ? "Verified — Re-submit to Update"
                        : isVerified && syncStatus === "pending"
                          ? "Retry Verification"
                          : "Mark Report as Verified"}
                </Button>
            }
        >
            <HmisFormStyles />
            <Tabs
                className="hmis105-tabs"
                style={{ height: "100%" }}
                tabPlacement="start"
                defaultActiveKey="tab1"
                type="card"
                items={items}
                tabBarStyle={{ width: 220, minWidth: 220 }}
                styles={{ content: { margin: 0, padding: 0 } }}
            />
        </Card>
    );
};

const HmisForm: React.FC<HmisFormProps> = (props) => (
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
        <InnerHmisForm {...props} />
    </ConfigProvider>
);

export default HmisForm;
