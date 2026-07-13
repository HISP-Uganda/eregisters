import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

export type DhisPeriodType =
    | "Daily"
    | "Weekly"
    | "BiWeekly"
    | "Monthly"
    | "BiMonthly"
    | "Quarterly"
    | "SixMonthly"
    | "SixMonthlyApril"
    | "Yearly"
    | "FinancialApril"
    | "FinancialJuly"
    | "FinancialOct";

export interface Period {
    id: string;
    label: string;
    start: Dayjs;
    end: Dayjs;
}

const PERIOD_TYPES: DhisPeriodType[] = [
    "Daily",
    "Weekly",
    "BiWeekly",
    "Monthly",
    "BiMonthly",
    "Quarterly",
    "SixMonthly",
    "SixMonthlyApril",
    "Yearly",
    "FinancialApril",
    "FinancialJuly",
    "FinancialOct",
];

export function normalizePeriodType(
    type: string | undefined,
): DhisPeriodType | undefined {
    if (!type) return undefined;
    const lower = type.toLowerCase();
    return PERIOD_TYPES.find((t) => t.toLowerCase() === lower);
}

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const MONTH_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

function pad2(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}

function isoWeeksInYear(year: number): number {
    // Dec 28 is always in the last ISO week of the year.
    return dayjs(`${year}-12-28`).isoWeek();
}

function isoWeekMonday(isoYear: number, weekNumber: number): Dayjs {
    // Monday of ISO week 1 in `isoYear`. Jan 4 is always in ISO week 1.
    const week1Monday = dayjs(`${isoYear}-01-04`).startOf("isoWeek");
    return week1Monday.add(weekNumber - 1, "week");
}

function daily(year: number): Period[] {
    const start = dayjs(`${year}-01-01`);
    const end = dayjs(`${year}-12-31`);
    const out: Period[] = [];
    let cursor = start;
    while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
        out.push({
            id: cursor.format("YYYYMMDD"),
            label: cursor.format("YYYY-MM-DD"),
            start: cursor,
            end: cursor,
        });
        cursor = cursor.add(1, "day");
    }
    return out;
}

function weekly(year: number): Period[] {
    const weeks = isoWeeksInYear(year);
    const out: Period[] = [];
    for (let w = 1; w <= weeks; w++) {
        const start = isoWeekMonday(year, w);
        const end = start.add(6, "day");
        out.push({
            id: `${year}W${w}`,
            label: `Week ${w} - ${start.format("YYYY-MM-DD")} - ${end.format("YYYY-MM-DD")}`,
            start,
            end,
        });
    }
    return out;
}

function biWeekly(year: number): Period[] {
    const weeks = isoWeeksInYear(year);
    const biWeeks = Math.ceil(weeks / 2);
    const out: Period[] = [];
    for (let b = 1; b <= biWeeks; b++) {
        const startWeek = 2 * b - 1;
        const endWeek = Math.min(2 * b, weeks);
        const start = isoWeekMonday(year, startWeek);
        const end = isoWeekMonday(year, endWeek).add(6, "day");
        out.push({
            id: `${year}BiW${b}`,
            label: `Bi-week ${b} - ${start.format("YYYY-MM-DD")} - ${end.format("YYYY-MM-DD")}`,
            start,
            end,
        });
    }
    return out;
}

function monthly(year: number): Period[] {
    const out: Period[] = [];
    for (let m = 1; m <= 12; m++) {
        const start = dayjs(`${year}-${pad2(m)}-01`);
        const end = start.endOf("month").startOf("day");
        out.push({
            id: `${year}${pad2(m)}`,
            label: `${MONTHS[m - 1]} ${year}`,
            start,
            end,
        });
    }
    return out;
}

function biMonthly(year: number): Period[] {
    const out: Period[] = [];
    for (let i = 0; i < 6; i++) {
        const startMonth = i * 2 + 1;
        const start = dayjs(`${year}-${pad2(startMonth)}-01`);
        const end = start.add(1, "month").endOf("month").startOf("day");
        out.push({
            id: `${year}${pad2(startMonth)}B`,
            label: `${MONTHS[startMonth - 1]} - ${MONTHS[startMonth]} ${year}`,
            start,
            end,
        });
    }
    return out;
}

function quarterly(year: number): Period[] {
    const spans = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];
    const out: Period[] = [];
    for (let q = 1; q <= 4; q++) {
        const startMonth = (q - 1) * 3 + 1;
        const start = dayjs(`${year}-${pad2(startMonth)}-01`);
        const end = start.add(2, "month").endOf("month").startOf("day");
        out.push({
            id: `${year}Q${q}`,
            label: `Q${q} ${year} - ${spans[q - 1]}`,
            start,
            end,
        });
    }
    return out;
}

function sixMonthly(year: number): Period[] {
    return [
        {
            id: `${year}S1`,
            label: `S1 ${year} - Jan-Jun`,
            start: dayjs(`${year}-01-01`),
            end: dayjs(`${year}-06-30`),
        },
        {
            id: `${year}S2`,
            label: `S2 ${year} - Jul-Dec`,
            start: dayjs(`${year}-07-01`),
            end: dayjs(`${year}-12-31`),
        },
    ];
}

function sixMonthlyApril(year: number): Period[] {
    return [
        {
            id: `${year}AprilS1`,
            label: `S1 ${year} - Apr-Sep`,
            start: dayjs(`${year}-04-01`),
            end: dayjs(`${year}-09-30`),
        },
        {
            id: `${year}AprilS2`,
            label: `S2 ${year} - Oct-Mar ${year + 1}`,
            start: dayjs(`${year}-10-01`),
            end: dayjs(`${year + 1}-03-31`),
        },
    ];
}

function yearly(year: number): Period[] {
    return [
        {
            id: `${year}`,
            label: `${year}`,
            start: dayjs(`${year}-01-01`),
            end: dayjs(`${year}-12-31`),
        },
    ];
}

function financial(
    year: number,
    startMonth: number,
    tag: "April" | "July" | "Oct",
): Period[] {
    const start = dayjs(`${year}-${pad2(startMonth)}-01`);
    const end = start.add(1, "year").subtract(1, "day");
    return [
        {
            id: `${year}${tag}`,
            label: `${MONTH_SHORT[startMonth - 1]} ${year} - ${MONTH_SHORT[end.month()]} ${end.year()}`,
            start,
            end,
        },
    ];
}

export function enumeratePeriods(
    type: DhisPeriodType,
    year: number,
): Period[] {
    let list: Period[];
    switch (type) {
        case "Daily":
            list = daily(year);
            break;
        case "Weekly":
            list = weekly(year);
            break;
        case "BiWeekly":
            list = biWeekly(year);
            break;
        case "Monthly":
            list = monthly(year);
            break;
        case "BiMonthly":
            list = biMonthly(year);
            break;
        case "Quarterly":
            list = quarterly(year);
            break;
        case "SixMonthly":
            list = sixMonthly(year);
            break;
        case "SixMonthlyApril":
            list = sixMonthlyApril(year);
            break;
        case "Yearly":
            list = yearly(year);
            break;
        case "FinancialApril":
            list = financial(year, 4, "April");
            break;
        case "FinancialJuly":
            list = financial(year, 7, "July");
            break;
        case "FinancialOct":
            list = financial(year, 10, "Oct");
            break;
    }
    return list.slice().reverse();
}

// Order matters: more specific patterns first.
const PARSE_ORDER: Array<{ re: RegExp; type: DhisPeriodType }> = [
    { re: /^(\d{4})AprilS[12]$/, type: "SixMonthlyApril" },
    { re: /^(\d{4})April$/, type: "FinancialApril" },
    { re: /^(\d{4})July$/, type: "FinancialJuly" },
    { re: /^(\d{4})Oct$/, type: "FinancialOct" },
    { re: /^(\d{4})S[12]$/, type: "SixMonthly" },
    { re: /^(\d{4})Q[1-4]$/, type: "Quarterly" },
    { re: /^(\d{4})BiW\d{1,2}$/, type: "BiWeekly" },
    { re: /^(\d{4})W\d{1,2}$/, type: "Weekly" },
    { re: /^(\d{4})(0[13579]|11)B$/, type: "BiMonthly" },
    { re: /^(\d{4})\d{4}$/, type: "Daily" },
    { re: /^(\d{4})(0[1-9]|1[0-2])$/, type: "Monthly" },
    { re: /^(\d{4})$/, type: "Yearly" },
];

export function parsePeriodId(
    id: string,
): { type: DhisPeriodType; year: number } | null {
    for (const { re, type } of PARSE_ORDER) {
        const m = id.match(re);
        if (m) return { type, year: parseInt(m[1], 10) };
    }
    return null;
}
