import type { MetadataStore } from "../db/metadata-store";
import { SyncContext } from "../machines/sync";

/**
 * The active backend's `MetadataStore` (SQL or Dexie, whichever is live) —
 * a single choke point so callers don't each independently reach into
 * `SyncContext` for this field (`useConfigRow.ts`, `admin.app-settings.tsx`).
 * Not folded into `useMetadata.ts` — that hook is specifically about DHIS2
 * domain metadata (programs, data elements, ...), while `MetadataStore` is
 * infra/session state, same distinction as `backend`.
 */
export const useMetadataStore = (): MetadataStore =>
    SyncContext.useSelector((a) => a.context.metadataStore);
