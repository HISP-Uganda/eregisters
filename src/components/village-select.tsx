import { FormInstance, Select } from "antd";
import React from "react";
import { Village } from "@/schemas";

interface WatchField {
    fieldId: string | string[];
    label: string;
}

interface VillageSelectProps {
    value?: string;
    onChange?: (value: string) => void;
    form: FormInstance<any>;
    watchFields: WatchField[];
    filterFields?: string[];
    sortField?: keyof Village;
    allowDirectSearch?: boolean;
    syncParentFields?: boolean;
    onFieldChange?: (fieldId: string, value: any) => void;
    fieldId?: string;
}

type VillageOption = { value: string; label: string; search: string };
type VillageList = { options: VillageOption[]; byValue: Map<string, Village> };

let villageList: Promise<VillageList> | undefined;

/**
 * The country's villages (about 70,000), loaded and turned into options once
 * for the whole app. Rebuilding them per field and per render made every
 * screen with a village field slow to render and to type in.
 */
function loadVillages(): Promise<VillageList> {
    villageList ??= fetch("./data/villages.min.json")
        .then((res) => res.json())
        .then((villages: Village[]) => {
            const options: VillageOption[] = [];
            const byValue = new Map<string, Village>();
            for (const v of villages) {
                const value = `${v.village_id}(${v.village_name})`;
                const label = [v.village_name, v.parish_name, v.subcounty_name, v.District].filter(Boolean).join("/");
                options.push({ value, label, search: label.toLowerCase() });
                byValue.set(value, v);
            }
            return { options, byValue };
        })
        .catch((error) => {
            villageList = undefined; // try again on the next field
            throw error;
        });
    return villageList;
}

const EMPTY: VillageList = { options: [], byValue: new Map() };

const SHOW_SEARCH = {
    filterOption: (input: string, option?: VillageOption) => {
        const parts = input.split(" ").map((part) => part.trim().toLowerCase());
        return parts.every((part) => option?.search.includes(part) ?? false);
    },
};

export default function VillageSelect({
    value,
    onChange,
    form,
    watchFields,
    filterFields,
    syncParentFields = false,
    onFieldChange,
    fieldId,
}: VillageSelectProps) {
    const [villages, setVillages] = React.useState<VillageList>(EMPTY);

    React.useEffect(() => {
        let current = true;
        loadVillages()
            .then((list) => {
                if (current) setVillages(list);
            })
            .catch((error) => console.error("Failed to load villages:", error));
        return () => {
            current = false;
        };
    }, []);

    const handleVillageChange = async (selectedValue: string) => {
        onChange?.(selectedValue);

        if (!selectedValue) {
            onFieldChange?.(fieldId!, undefined);
            for (const { fieldId: wfId } of watchFields) {
                const ids = Array.isArray(wfId) ? wfId : [wfId];
                for (const id of ids) {
                    form.setFieldValue(id, undefined);
                    onFieldChange?.(id, undefined);
                }
            }
            if (filterFields) {
                for (const f of filterFields) {
                    form.setFieldValue(f, undefined);
                    onFieldChange?.(f, undefined);
                }
            }
            return;
        }

        if (syncParentFields) {
            try {
                const selectedVillage = villages.byValue.get(selectedValue);
                if (selectedVillage) {
                    const districtUpdates = Array.isArray(
                        watchFields[0].fieldId,
                    )
                        ? watchFields[0].fieldId
                        : [watchFields[0].fieldId];

                    const subUpdates = Array.isArray(watchFields[1].fieldId)
                        ? watchFields[1].fieldId
                        : [watchFields[1].fieldId];

                    const parishUpdates = Array.isArray(watchFields[2].fieldId)
                        ? watchFields[2].fieldId
                        : [watchFields[2].fieldId];

                    for (const d of districtUpdates) {
                        form.setFieldValue(d, selectedVillage.District);
                    }
                    for (const s of subUpdates) {
                        form.setFieldValue(s, selectedVillage.subcounty_name);
                    }
                    for (const p of parishUpdates) {
                        form.setFieldValue(p, selectedVillage.parish_name);
                    }
                    if (filterFields) {
                        for (const f of filterFields) {
                            form.setFieldValue(f, selectedValue);
                        }
                    }

                    if (fieldId) {
                        onFieldChange?.(fieldId, selectedValue);
                    }
                    for (const d of districtUpdates) {
                        onFieldChange?.(d, selectedVillage.District);
                    }
                    for (const s of subUpdates) {
                        onFieldChange?.(s, selectedVillage.subcounty_name);
                    }
                    for (const p of parishUpdates) {
                        onFieldChange?.(p, selectedVillage.parish_name);
                    }
                }
            } catch (error) {
                console.error("Failed to sync parent fields:", error);
            }
        } else if (fieldId) {
            onFieldChange?.(fieldId, selectedValue);
        }
    };

    return (
        <Select
            placeholder="Select Village"
            value={value}
            onChange={handleVillageChange}
            options={villages.options}
            showSearch={SHOW_SEARCH}
            virtual
            allowClear
            style={{ width: "100%" }}
        />
    );
}
