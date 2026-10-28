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

/** Compiles selected values once, before testing any rows. */
function compileColumnFilter(
	column: AnalyticsColumn,
	optionSets: OptionSets,
	selected: FilterValue,
): (record: AnalyticsRow) => boolean {
	const includeEmpty = selected.includes(EMPTY_FILTER_VALUE);
	if (column.valueKind === "date") {
		const ranges = selected.flatMap((value) => {
			const range = parseDateSelection(value);
			return range ? [range] : [];
		});
		return (record) => {
			const cell = record.values[column.key];
			if (includeEmpty && isEmptyCell(cell)) return true;
			if (typeof cell?.raw !== "string" || ranges.length === 0) return false;
			const rawDate = cell.raw.slice(0, 10);
			return isCalendarDate(rawDate) && ranges.some(([start, end]) => rawDate >= start && rawDate <= end);
		};
	}
	if (column.optionSetId) {
		const selectedIds = new Set(selected.filter((value) => value !== EMPTY_FILTER_VALUE));
		const selectedTokens = new Set<string>();
		for (const option of optionSets.get(column.optionSetId) ?? []) {
			if (selectedIds.has(option.id)) {
				selectedTokens.add(option.id);
				selectedTokens.add(option.code);
			}
		}
		return (record) => {
			const cell = record.values[column.key];
			if (includeEmpty && isEmptyCell(cell)) return true;
			return selectedTokens.size > 0 && optionTokens(cell?.raw).some((token) => selectedTokens.has(token));
		};
	}
	if (column.valueKind === "number" && !column.isComputed) {
		const ranges = selected.flatMap((value) => {
			const range = parseNumberSelection(value);
			return range ? [range] : [];
		});
		const queries = selected.flatMap((value) =>
			typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX)
				? [value.slice(TEXT_SEARCH_PREFIX.length).trim().toLowerCase()] : [],
		).filter(Boolean);
		const exact = new Set(selected.filter((value) =>
			value !== EMPTY_FILTER_VALUE && !parseNumberSelection(value) &&
			!(typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX)),
		));
		return (record) => {
			const cell = record.values[column.key];
			if (includeEmpty && isEmptyCell(cell)) return true;
			const number = numericValue(cell?.raw);
			return (number !== undefined && ranges.some(([min, max]) =>
				(min === null || number >= min) && (max === null || number <= max))) ||
				exact.has(cell?.display ?? "") ||
				queries.some((query) => (cell?.display ?? "").toLowerCase().includes(query));
		};
	}
	if (usesTextSearch(column)) {
		const queries = selected.flatMap((value) =>
			typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX)
				? [value.slice(TEXT_SEARCH_PREFIX.length).trim().toLowerCase()]
				: [],
		).filter(Boolean);
		const legacyExactValues = new Set(selected.filter((value) =>
			value !== EMPTY_FILTER_VALUE &&
			!(typeof value === "string" && value.startsWith(TEXT_SEARCH_PREFIX)),
		));
		return (record) => {
			const cell = record.values[column.key];
			if (includeEmpty && isEmptyCell(cell)) return true;
			const display = cell?.display ?? "";
			return legacyExactValues.has(display) ||
				(queries.length > 0 && queries.some((query) => display.toLowerCase().includes(query)));
		};
	}
	const selectedDisplays = new Set(selected.filter((value) => value !== EMPTY_FILTER_VALUE));
	return (record) => {
		const cell = record.values[column.key];
		return (includeEmpty && isEmptyCell(cell)) || selectedDisplays.has(cell?.display ?? "");
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
