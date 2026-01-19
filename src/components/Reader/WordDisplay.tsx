/**
 * Word Display Component
 * Displays the current word with ORP highlighting
 * The ORP letter is centered on screen, with crosshairs for focus
 */

"use client";

import React from "react";
import { splitWordAtORP } from "@/utils/orp";

interface WordDisplayProps {
  word: string;
  fontSize: "small" | "medium" | "large" | "xlarge";
}

export function WordDisplay({ word, fontSize }: WordDisplayProps) {
  const { before, orp, after } = splitWordAtORP(word);

  const fontSizeClasses = {
    small: "text-4xl",
    medium: "text-5xl",
    large: "text-6xl",
    xlarge: "text-7xl",
  };

  return (
    <div className="relative w-full h-64 flex items-center justify-center bg-[#0a0a0a] rounded-lg">
      {/* Vertical crosshair lines */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none">
        {/* Top line */}
        <div className="w-px h-20 bg-gray-600 mb-2" />

        {/* Word display area - ORP letter is always at center */}
        <div className={`${fontSizeClasses[fontSize]} font-mono leading-none`}>
          <span className="text-white">{before}</span>
          <span className="text-[#ff4444] font-bold">{orp}</span>
          <span className="text-white">{after}</span>
        </div>

        {/* Bottom line */}
        <div className="w-px h-20 bg-gray-600 mt-2" />
      </div>

      {/* Focus guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Horizontal guide lines */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-500/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
