import type { FilterValue } from "antd/es/table/interface";
import type { AnalyticsCell, AnalyticsColumn, AnalyticsRow } from "./types";
import { numericValue, optionTokens, type OptionSets } from "./value-format";

export const EMPTY_FILTER_VALUE = "__lineListEmpty__";
export const DATE_RANGE_PREFIX = "__lineListDateRange__:";
export const TEXT_SEARCH_PREFIX = "__lineListTextSearch__:";
export const NUMBER_RANGE_PREFIX = "__lineListNumberRange__:";

export function usesTextSearch(column: AnalyticsColumn): boolean {
	return !column.optionSetId && column.valueKind !== "date" && column.valueKind !== "number" &&
		column.valueKind !== "boolean" && !column.isComputed;
}

/** Inclusive numeric bounds. A missing side means no bound on that side. */
export function parseNumberSelection(value: React.Key | boolean): [number | null, number | null] | undefined {
	if (typeof value !== "string" || !value.startsWith(NUMBER_RANGE_PREFIX)) return undefined;
	const parts = value.slice(NUMBER_RANGE_PREFIX.length).split(":");
	if (parts.length !== 2 || parts.every((part) => part === "")) return undefined;
	const parseBound = (part: string): number | null | undefined => {
		if (part === "") return null;
		if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(part)) return undefined;
		const number = Number(part);
		return Number.isFinite(number) ? number : undefined;
	};
	const min = parseBound(parts[0]);
	const max = parseBound(parts[1]);
	if (min === undefined || max === undefined || (min !== null && max !== null && min > max)) return undefined;
	return [min, max];
}

function isEmptyCell(cell: AnalyticsCell | undefined): boolean {
	return !cell?.display?.trim();
}

function isCalendarDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const year = Number(value.slice(0, 4));
	const month = Number(value.slice(5, 7));
	const day = Number(value.slice(8, 10));
	const daysInMonth = [31, year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
		31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

/** Also accepts exact dates stored by the earlier distinct-value filter. */
export function parseDateSelection(value: React.Key | boolean): [string, string] | undefined {
	if (typeof value !== "string") return undefined;
	if (isCalendarDate(value)) return [value, value];
	if (!value.startsWith(DATE_RANGE_PREFIX)) return undefined;
	const parts = value.slice(DATE_RANGE_PREFIX.length).split(":");
	if (parts.length !== 2 || parts.some((part) => !isCalendarDate(part)) || parts[0] > parts[1]) return undefined;
	return [parts[0], parts[1]];
}

/** What a column filter's selected menu values ask for, parsed once for any number of rows. */
export interface ColumnSelection {
	includeEmpty: boolean;
	dateRanges: Array<[string, string]>;
	numberRanges: Array<[number | null, number | null]>;
	/** Ids and codes of the selected options, for option-set columns. */
	optionTokens: Set<string>;
	/** Lower-cased text searches. */
	queries: string[];
	/** Values matched exactly against a cell's display: plain menu values and legacy exact filters. */
	exact: Set<React.Key | boolean>;
}

function isTextSearch(value: React.Key | boolean): value is string {
	return typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX);
}

export function parseColumnSelection(
	column: AnalyticsColumn,
	optionSets: OptionSets,
	selected: FilterValue,
): ColumnSelection {
	const optionTokens = new Set<string>();
	if (column.optionSetId) {
		const selectedIds = new Set(selected.filter((value) => value !== EMPTY_FILTER_VALUE));
		for (const option of optionSets.get(column.optionSetId) ?? []) {
			if (selectedIds.has(option.id)) {
				optionTokens.add(option.id);
				optionTokens.add(option.code);
			}
		}
	}
	return {
		includeEmpty: selected.includes(EMPTY_FILTER_VALUE),
		dateRanges: selected.flatMap((value) => {
			const range = parseDateSelection(value);
			return range ? [range] : [];
		}),
		numberRanges: selected.flatMap((value) => {
			const range = parseNumberSelection(value);
			return range ? [range] : [];
		}),
		optionTokens,
		queries: selected.flatMap((value) =>
			isTextSearch(value) ? [value.slice(TEXT_SEARCH_PREFIX.length).trim().toLowerCase()] : [],
		).filter(Boolean),
		exact: new Set(selected.filter((value) =>
			value !== EMPTY_FILTER_VALUE && !isTextSearch(value) && !parseNumberSelection(value))),
	};
}

/** Compiles selected values once, before testing any rows. */
function compileColumnFilter(
	column: AnalyticsColumn,
	optionSets: OptionSets,
	selected: FilterValue,
): (record: AnalyticsRow) => boolean {
	const { includeEmpty, dateRanges, numberRanges, optionTokens: tokens, queries, exact } =
		parseColumnSelection(column, optionSets, selected);
	const isEmpty = (record: AnalyticsRow) => includeEmpty && isEmptyCell(record.values[column.key]);
	if (column.valueKind === "date") {
		return (record) => {
			if (isEmpty(record)) return true;
			const cell = record.values[column.key];
			if (typeof cell?.raw !== "string" || dateRanges.length === 0) return false;
			const rawDate = cell.raw.slice(0, 10);
			return isCalendarDate(rawDate) && dateRanges.some(([start, end]) => rawDate >= start && rawDate <= end);
		};
	}
	if (column.optionSetId) {
		return (record) =>
			isEmpty(record) ||
			(tokens.size > 0 && optionTokens(record.values[column.key]?.raw).some((token) => tokens.has(token)));
	}
	if (column.valueKind === "number" && !column.isComputed) {
		return (record) => {
			if (isEmpty(record)) return true;
			const cell = record.values[column.key];
			const number = numericValue(cell?.raw);
			const display = cell?.display ?? "";
			return (number !== undefined && numberRanges.some(([min, max]) =>
				(min === null || number >= min) && (max === null || number <= max))) ||
				exact.has(display) ||
				queries.some((query) => display.toLowerCase().includes(query));
		};
	}
	return (record) => {
		if (isEmpty(record)) return true;
		const display = record.values[column.key]?.display ?? "";
		return exact.has(display) ||
			(usesTextSearch(column) && queries.some((query) => display.toLowerCase().includes(query)));
	};
}

/** Gives Ant Design a stable, cached matcher for each selected menu value. */
export function makeColumnFilterMatcher(column: AnalyticsColumn, optionSets: OptionSets) {
	const predicates = new Map<React.Key | boolean, (record: AnalyticsRow) => boolean>();
	return (value: React.Key | boolean, record: AnalyticsRow): boolean => {
		let predicate = predicates.get(value);
		if (!predicate) {
			predicate = compileColumnFilter(column, optionSets, [value]);
			predicates.set(value, predicate);
		}
		return predicate(record);
	};
}

/** Keeps pivot/export rows aligned with selected line-list filters, including restored views. */
export function filterLineListRows(
	rows: AnalyticsRow[],
	columns: AnalyticsColumn[],
	filteredInfo: Record<string, FilterValue | null>,
	optionSets: OptionSets,
): AnalyticsRow[] {
	const active = columns.flatMap((column) => {
		const selected = filteredInfo[column.key];
		return selected?.length ? [compileColumnFilter(column, optionSets, selected)] : [];
	});
	if (active.length === 0) return rows;
	return rows.filter((row) => active.every((predicate) => predicate(row)));
}
