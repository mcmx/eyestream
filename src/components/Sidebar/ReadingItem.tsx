/**
 * Reading Item Component
 * Individual reading item in the sidebar list
 */

"use client";

import React from "react";
import { Reading } from "@/types";

interface ReadingItemProps {
  reading: Reading;
  onClick: () => void;
  onDelete: () => void;
  isActive: boolean;
}

export function ReadingItem({
  reading,
  onClick,
  onDelete,
  isActive,
}: ReadingItemProps) {
  const progress = Math.round((reading.currentPosition / reading.wordCount) * 100);
  const lastRead = new Date(reading.lastReadAt);
  const formattedDate = lastRead.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`group relative p-4 rounded-lg cursor-pointer transition-all ${
        isActive
          ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"
          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent"
      }`}
      onClick={onClick}
    >
      {/* Delete button - show on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
        aria-label="Delete reading"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 pr-8 truncate">
        {reading.title}
      </h3>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
        <div
          className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Meta info */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>{progress}% complete</span>
        <span>{reading.currentWpm} WPM</span>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        Last read: {formattedDate}
      </div>
    </div>
  );
}
