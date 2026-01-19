/**
 * Offline Queue Hook
 * Handles queuing and replaying updates when offline
 */

"use client";

import { useEffect, useCallback } from "react";
import { useReaderStore } from "@/store/useReaderStore";
import { OfflineUpdate } from "@/types";

export function useOfflineQueue() {
  const isOnline = useReaderStore((state) => state.isOnline);
  const setIsOnline = useReaderStore((state) => state.setIsOnline);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline]);

  const processQueue = useCallback(async () => {
    const queueStr = localStorage.getItem("offlineQueue");
    if (!queueStr) return;

    const queue: OfflineUpdate[] = JSON.parse(queueStr);
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} offline updates...`);

    const failedUpdates: OfflineUpdate[] = [];

    for (const update of queue) {
      try {
        const response = await fetch(
          `/api/readings/${update.readingId}/position`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              position: update.position,
              wpm: update.wpm,
            }),
          }
        );

        if (!response.ok) {
          failedUpdates.push(update);
        }
      } catch (error) {
        console.error("Failed to process offline update:", error);
        failedUpdates.push(update);
      }
    }

    // Save only failed updates back to queue
    if (failedUpdates.length > 0) {
      localStorage.setItem("offlineQueue", JSON.stringify(failedUpdates));
    } else {
      localStorage.removeItem("offlineQueue");
    }

    console.log(
      `Processed queue. ${queue.length - failedUpdates.length} succeeded, ${failedUpdates.length} failed.`
    );
  }, []);

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);

  const queueUpdate = useCallback(
    (readingId: string, position: number, wpm: number) => {
      const queue: OfflineUpdate[] = JSON.parse(
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
    },
    []
  );

  const getQueueSize = useCallback(() => {
    const queueStr = localStorage.getItem("offlineQueue");
    if (!queueStr) return 0;

    const queue: OfflineUpdate[] = JSON.parse(queueStr);
    return queue.length;
  }, []);

  return {
    isOnline,
    queueUpdate,
    processQueue,
    getQueueSize,
  };
}
