/**
 * Sync Hook
 * Handles debounced syncing of reading position to server
 */

"use client";

import { useCallback, useRef, useEffect } from "react";
import { useReaderStore } from "@/store/useReaderStore";

export function useSync(readingId: string | null) {
  const isOnline = useReaderStore((state) => state.isOnline);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const syncCounterRef = useRef(0);

  const syncPosition = useCallback(
    async (position: number, wpm: number) => {
      if (!readingId || !isOnline) return;

      try {
        await fetch(`/api/readings/${readingId}/position`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position, wpm }),
        });
      } catch (error) {
        console.error("Failed to sync position:", error);
        // Queue for offline sync
        if (!isOnline) {
          const queue = JSON.parse(
            localStorage.getItem("offlineQueue") || "[]"
          );
          queue.push({
            id: Date.now().toString(),
            readingId,
            position,
            wpm,
            timestamp: Date.now(),
          });
          localStorage.setItem("offlineQueue", JSON.stringify(queue));
        }
      }
    },
    [readingId, isOnline]
  );

  const debouncedSync = useCallback(
    (position: number, wpm: number) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        syncPosition(position, wpm);
      }, 1000); // 1 second debounce
    },
    [syncPosition]
  );

  const syncEveryNWords = useCallback(
    (position: number, wpm: number, autoSaveEvery: number = 5) => {
      syncCounterRef.current++;

      if (syncCounterRef.current >= autoSaveEvery) {
        syncPosition(position, wpm);
        syncCounterRef.current = 0;
      }
    },
    [syncPosition]
  );

  const syncImmediately = useCallback(
    (position: number, wpm: number) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      syncPosition(position, wpm);
    },
    [syncPosition]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    debouncedSync,
    syncEveryNWords,
    syncImmediately,
  };
}
