import { useEffect, useRef, useState } from "react";

/**
 * Measures how tall an antd `<Table>`'s scrollable body should be so it
 * fills its container instead of growing the page. Attach `containerRef`
 * to a div wrapping just the `<Table>` (as a flex:1 child of a bounded-
 * height layout) and pass the result to `scroll={{ y: scrollY }}`.
 *
 * `virtual` mode needs a real pixel number (not a CSS percentage/calc
 * string) to do its row-count math, so this re-measures via
 * ResizeObserver whenever the container's actual size changes.
 */
export function useTableScrollHeight(minHeight = 160) {
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
            const next = container.clientHeight - headerHeight - 16;
            setScrollY(Math.max(Math.round(next), minHeight));
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(container);
        return () => observer.disconnect();
    }, [minHeight]);

    return { containerRef, scrollY };
}
