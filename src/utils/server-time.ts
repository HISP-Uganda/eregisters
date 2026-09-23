import dayjs, { type Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const EXPLICIT_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/i;

/**
 * DHIS2's system/info.serverDate (the source of lastDataPull/
 * lastMetadataPull, see sync.ts's extractServerDate) is a naive timestamp
 * with no zone marker (e.g. "2024-01-15T10:30:00.000") on the server's own
 * clock. Plain dayjs(...) would read it as browser-local time, and
 * dayjs.utc(...) assumes the server runs UTC — neither holds in general,
 * so it's interpreted in the server's `serverTimeZoneId` (also from
 * system/info, exposed via useConfig().systemInfo). Falls back to UTC when
 * that's missing or not a zone the browser's Intl knows. A timestamp that
 * already carries an offset (e.g. lastDataPush's toISOString() "Z") is
 * parsed as-is.
 */
export function parseServerTime(
    serverTimestamp: string,
    serverTimeZoneId: string | undefined,
): Dayjs {
    if (EXPLICIT_OFFSET.test(serverTimestamp) || !serverTimeZoneId) {
        return dayjs.utc(serverTimestamp);
    }
    try {
        return dayjs.tz(serverTimestamp, serverTimeZoneId);
    } catch {
        // Unrecognised zone id — Intl throws a RangeError.
        return dayjs.utc(serverTimestamp);
    }
}
