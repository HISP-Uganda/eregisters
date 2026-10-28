import { Table, theme } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { FlattenedTrackedEntity } from "@/schemas";
import type { LastVisits } from "./client-lists";

type Column = ColumnType<FlattenedTrackedEntity>;

const CELL_SLACK = 12; // beyond the cell's side padding: rounding and the fixed column's edge
const SORTER_WIDTH = 22; // the sort arrows and their gap
const CANDIDATES = 20; // longest texts by length, measured exactly
const MIN_WIDTH = 80;
const FALLBACK_CHAR_WIDTH = 8;
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

let measureContext: CanvasRenderingContext2D | null | undefined;

/** The rendered width of `text` in `font`; an estimate where canvas isn't available. */
function textWidth(text: string, font: string) {
	if (measureContext === undefined) {
		try {
			measureContext = document.createElement("canvas").getContext("2d");
		} catch {
			measureContext = null;
		}
	}
	if (!measureContext) return text.length * FALLBACK_CHAR_WIDTH;
	measureContext.font = font;
	return measureContext.measureText(text).width;
}

/** The fonts a table draws its cells and titles in, and its cells' side padding. */
export interface TableFonts {
	padding: number;
	body: string;
	title: string;
}

const DEFAULT_FONTS: TableFonts = { padding: 16, body: "400 14px sans-serif", title: "600 14px sans-serif" };

/** The text a column shows for a client: what sorting compares and widths are sized from. */
export function cellText(column: Column, record: FlattenedTrackedEntity): string {
	const path = column.dataIndex as string[] | undefined;
	const raw = path ? path.reduce<any>((value, key) => value?.[key], record) : record;
	const shown = column.render ? column.render(raw, record, 0) : raw;
	return shown === undefined || shown === null || typeof shown === "object" ? "" : String(shown);
}

/**
 * A width that fits a column's title (with its sort arrows) and its widest
 * text across every row, so nothing wraps or is cut short.
 */
export function fittedWidth(column: Column, rows: FlattenedTrackedEntity[], fonts: TableFonts = DEFAULT_FONTS) {
	const longest: string[] = [];
	for (const row of rows) {
		const text = cellText(column, row);
		if (longest.length === CANDIDATES && text.length <= longest[CANDIDATES - 1].length) continue;
		longest.push(text);
		longest.sort((a, b) => b.length - a.length);
		if (longest.length > CANDIDATES) longest.pop();
	}
	const cells = longest.reduce((widest, text) => Math.max(widest, textWidth(text, fonts.body)), 0);
	const title = textWidth(String(column.title ?? ""), fonts.title) + SORTER_WIDTH;
	return Math.max(MIN_WIDTH, Math.ceil(Math.max(cells, title) + 2 * fonts.padding + CELL_SLACK));
}

/** The height available below the element's top inside its flex parent. */
function useFillHeight() {
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(400);
	useEffect(() => {
		if (!ref.current) return;
		const observer = new ResizeObserver(([entry]) => setHeight(Math.max(200, entry.contentRect.height)));
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);
	return { ref, height };
}

/**
 * The clients results: one virtual, unpaginated table filling its panel,
 * with a sticky header, one-line cells and every column sortable (Last
 * Visit by time, the rest by the text shown).
 */
export function ClientsTable({
	clients,
	columns,
	lastVisits,
	onOpenClient,
}: {
	clients: FlattenedTrackedEntity[];
	columns: ColumnsType<FlattenedTrackedEntity>;
	lastVisits: LastVisits;
	onOpenClient: (trackedEntity: string) => void;
}) {
	const { ref, height } = useFillHeight();
	// Measure in the font the table actually draws with: antd's, not the page's.
	const { token } = theme.useToken();
	const fonts = useMemo(
		() => ({
			// Default-size cells: antd pads them by the `padding` token on each side.
			padding: token.padding,
			body: `400 ${token.fontSize}px ${token.fontFamily}`,
			title: `${token.fontWeightStrong} ${token.fontSize}px ${token.fontFamily}`,
		}),
		[token.padding, token.fontSize, token.fontFamily, token.fontWeightStrong],
	);
	const headerHeight = Math.ceil(token.fontSize * token.lineHeight + 2 * token.padding + token.lineWidth);
	const sized = useMemo(
		() =>
			(columns as Column[]).map((column) => ({
				...column,
				width: column.width ?? fittedWidth(column, clients, fonts),
				sorter:
					column.key === "lastVisit"
						? (a: FlattenedTrackedEntity, b: FlattenedTrackedEntity) =>
							(lastVisits.get(a.trackedEntity)?.at ?? -Infinity) -
							(lastVisits.get(b.trackedEntity)?.at ?? -Infinity)
						: (a: FlattenedTrackedEntity, b: FlattenedTrackedEntity) =>
							collator.compare(cellText(column, a), cellText(column, b)),
			})),
		[columns, clients, lastVisits, fonts],
	);
	const width = sized.reduce((sum, column) => sum + Number(column.width), 0);

	return (
		<div ref={ref} className="clients-table" style={{ flex: 1, minHeight: 0 }}>
			<style>{`
                .clients-table .ant-table-row.clients-table-stripe > .ant-table-cell { background: #fafbfc; }
                .clients-table .ant-table-cell, .clients-table .ant-table-column-title { white-space: nowrap; }
            `}</style>
			<Table
				virtual
				columns={sized}
				dataSource={clients}
				rowKey="trackedEntity"
				pagination={false}
				scroll={{ x: width, y: height - headerHeight }}
				// By list position: the virtual body only draws the rows in view, so CSS :nth-child would swap stripes on scroll.
				rowClassName={(_, index) => (index % 2 === 1 ? "clients-table-stripe" : "")}
				onRow={(record) => ({
					onClick: () => onOpenClient(record.trackedEntity),
					style: { cursor: "pointer" },
				})}
			/>
		</div>
	);
}
