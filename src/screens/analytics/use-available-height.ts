import { useEffect, useRef, useState } from "react";

/**
 * Used for the first paint only, before the measurement below runs —
 * the app's usual header budget, so nothing visibly jumps.
 */
export const FALLBACK_AVAILABLE_HEIGHT = "calc(100vh - 112px)";

/**
 * Measures the space between this element's top and the bottom of the
 * viewport, rather than assuming a header height: the mobile header is
 * shorter and banners (update notices) push content down, so a fixed
 * `calc(100vh - Npx)` either under- or over-shoots and the table doesn't
 * fill the space (or overflows the page instead of scrolling inside).
 */
export function useAvailableHeight() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const measure = () => {
            const top = el.getBoundingClientRect().top;
            setHeight(Math.max(window.innerHeight - top, 200));
        };
        measure();
        window.addEventListener("resize", measure);
        const observer = new ResizeObserver(measure);
        observer.observe(document.body);
        return () => {
            window.removeEventListener("resize", measure);
            observer.disconnect();
        };
    }, []);

    return { ref, height };
}
