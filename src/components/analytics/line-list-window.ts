export const LINE_LIST_ROW_HEIGHT = 40;
/** Rows rendered beyond each edge of the viewport. */
export const LINE_LIST_OVERSCAN_ROWS = 10;
/** Re-window only once fewer than this many overscan rows remain at an edge. */
const MIN_OVERSCAN_ROWS = 5;

export interface LineListWindow {
    start: number;
    end: number;
}

/**
 * The rows to render for a natively scrolled body: the viewport plus
 * overscan. Returns `current` itself while the viewport still sits at least
 * `MIN_OVERSCAN_ROWS` inside it, so most scroll events cause no re-render.
 */
export function lineListWindow(
    count: number,
    scrollTop: number,
    viewportHeight: number,
    current?: LineListWindow,
): LineListWindow {
    const first = Math.max(0, Math.min(count, Math.floor(scrollTop / LINE_LIST_ROW_HEIGHT)));
    const last = Math.min(count, Math.ceil((scrollTop + viewportHeight) / LINE_LIST_ROW_HEIGHT));
    if (current && current.end <= count &&
        (current.start === 0 || first - current.start >= MIN_OVERSCAN_ROWS) &&
        (current.end === count || current.end - last >= MIN_OVERSCAN_ROWS) &&
        current.start <= first && current.end >= last) {
        return current;
    }
    return {
        start: Math.max(0, first - LINE_LIST_OVERSCAN_ROWS),
        end: Math.min(count, last + LINE_LIST_OVERSCAN_ROWS),
    };
}
