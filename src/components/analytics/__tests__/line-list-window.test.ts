import { describe, expect, it } from "vitest";
import { LINE_LIST_OVERSCAN_ROWS, LINE_LIST_ROW_HEIGHT, lineListWindow } from "../line-list-window";

const VIEWPORT = 600; // 15 rows

describe("line-list viewport", () => {
    it("bounds a 200,000-row result to the screen plus overscan", () => {
        const start = lineListWindow(200_000, 0, VIEWPORT);
        const middle = lineListWindow(200_000, 100_000 * LINE_LIST_ROW_HEIGHT, VIEWPORT);
        const end = lineListWindow(200_000, 200_000 * LINE_LIST_ROW_HEIGHT - VIEWPORT, VIEWPORT);
        expect(start).toEqual({ start: 0, end: 15 + LINE_LIST_OVERSCAN_ROWS });
        expect(middle).toEqual({ start: 100_000 - LINE_LIST_OVERSCAN_ROWS, end: 100_015 + LINE_LIST_OVERSCAN_ROWS });
        expect(end).toEqual({ start: 200_000 - 15 - LINE_LIST_OVERSCAN_ROWS, end: 200_000 });
    });

    it("keeps the same window while scrolling inside the overscan band", () => {
        const current = lineListWindow(200_000, 1_000 * LINE_LIST_ROW_HEIGHT, VIEWPORT);
        for (let px = -200; px <= 200; px += 7) {
            expect(lineListWindow(200_000, 1_000 * LINE_LIST_ROW_HEIGHT + px, VIEWPORT, current)).toBe(current);
        }
    });

    it("re-windows once fewer than five overscan rows remain at an edge", () => {
        const current = lineListWindow(200_000, 1_000 * LINE_LIST_ROW_HEIGHT, VIEWPORT);
        const down = lineListWindow(200_000, 1_006 * LINE_LIST_ROW_HEIGHT, VIEWPORT, current);
        const up = lineListWindow(200_000, 994 * LINE_LIST_ROW_HEIGHT, VIEWPORT, current);
        expect(down).not.toBe(current);
        expect(down.start).toBe(1_006 - LINE_LIST_OVERSCAN_ROWS);
        expect(up).not.toBe(current);
        expect(up.end).toBe(994 + 15 + LINE_LIST_OVERSCAN_ROWS);
    });

    it("jumps straight to the target rows after a far scroll", () => {
        const current = lineListWindow(200_000, 0, VIEWPORT);
        expect(lineListWindow(200_000, 150_000 * LINE_LIST_ROW_HEIGHT, VIEWPORT, current).start)
            .toBe(150_000 - LINE_LIST_OVERSCAN_ROWS);
    });

    it("re-windows when the result shrinks below the current window", () => {
        const current = lineListWindow(200_000, 1_000 * LINE_LIST_ROW_HEIGHT, VIEWPORT);
        expect(lineListWindow(12, 0, VIEWPORT, current)).toEqual({ start: 0, end: 12 });
    });
});
