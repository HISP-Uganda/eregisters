import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import type { DateBucket } from "./types";

dayjs.extend(isoWeek);

export interface BucketedDate {
    key: string;
    label: string;
}

export function bucketDate(value: unknown, bucket: DateBucket): BucketedDate {
    if (value === undefined || value === null || value === "") {
        return { key: "Missing", label: "Missing" };
    }

    const parsed = dayjs(String(value));
    if (!parsed.isValid()) return { key: "Missing", label: "Missing" };

    switch (bucket) {
        case "exact":
            return {
                key: parsed.format("YYYY-MM-DD"),
                label: parsed.format("YYYY-MM-DD"),
            };
        case "week":
            return {
                key: `${parsed.isoWeekYear()}W${parsed.isoWeek()}`,
                label: `Week ${parsed.isoWeek()} ${parsed.isoWeekYear()}`,
            };
        case "month":
            return {
                key: parsed.format("YYYY-MM"),
                label: parsed.format("MMMM YYYY"),
            };
        case "quarter": {
            const quarter = Math.floor(parsed.month() / 3) + 1;
            return {
                key: `${parsed.year()}Q${quarter}`,
                label: `Q${quarter} ${parsed.year()}`,
            };
        }
        case "year":
            return {
                key: parsed.format("YYYY"),
                label: parsed.format("YYYY"),
            };
    }
}
