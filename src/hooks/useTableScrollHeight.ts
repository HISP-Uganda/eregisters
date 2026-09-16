import { useEffect, useRef, useState } from "react";

/**
 * Measures how tall an antd `<Table>`'s scrollable body should be so it
 * fills its container instead of growing the page. Attach `containerRef`
 * to a div wrapping just the `<Table>` (as a flex:1 child of a bounded-
 * height layout) and pass the result to `scroll={{ y: scrollY }}`.
 *
 * Computed from `window.innerHeight` minus the container's own top offset
 * — NOT from `container.clientHeight` — because `clientHeight` only
 * reflects a flex:1 ancestor's stretch once the browser has actually laid
 * that stretch out; a still-mounting/first-paint container (or a flex
 * ancestor that hasn't resolved a definite height yet) reports a small
 * content-sized `clientHeight`, undershooting the real space and leaving
 * the table short with empty space below it even though its wrapping div
 * did stretch. `getBoundingClientRect().top` reflects normal document flow
 * regardless of that, so this can't undershoot the same way.
 *
 * `virtual` mode needs a real pixel number (not a CSS percentage/calc
 * string) to do its row-count math, so this re-measures via
 * ResizeObserver/window resize whenever the layout could have changed.
 */
export function useTableScrollHeight(minHeight = 160, bottomPadding = 16) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scrollY, setScrollY] = useState(minHeight);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const measure = () => {
            const header = container.querySelector<HTMLElement>(
                ".ant-table-header",
            );
            const headerHeight = header?.getBoundingClientRect().height ?? 0;
            const top = container.getBoundingClientRect().top;
            const available = window.innerHeight - top - bottomPadding;
            setScrollY(
                Math.max(Math.round(available - headerHeight), minHeight),
            );
        };

        measure();
        window.addEventListener("resize", measure);
        // Also re-measure on any size change of the container itself or the
        // page body — covers ancestor layout settling after first paint,
        // sibling rows above (filter bar wrapping, banners) changing size,
        // and the container's own flex-resolved size changing.
        const observer = new ResizeObserver(measure);
        observer.observe(container);
        observer.observe(document.body);
        return () => {
            window.removeEventListener("resize", measure);
            observer.disconnect();
        };
    }, [minHeight, bottomPadding]);

    return { containerRef, scrollY };
}
