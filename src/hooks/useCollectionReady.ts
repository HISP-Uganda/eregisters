import { useEffect, useState } from "react";

/** Whether `collection` has finished its first load; re-renders once it has. */
export function useCollectionReady(collection: { isReady: () => boolean; onFirstReady: (callback: () => void) => () => void }) {
    const [ready, setReady] = useState(() => collection.isReady());
    useEffect(() => {
        if (ready) return;
        if (collection.isReady()) {
            setReady(true);
            return;
        }
        return collection.onFirstReady(() => setReady(true));
    }, [collection, ready]);
    return ready;
}
