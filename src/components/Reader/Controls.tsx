/**
 * Controls Component
 * Playback controls for RSVP reading
 */

"use client";

import React from "react";
import { Button } from "../ui/Button";
import { WPM_OPTIONS, WPMOption } from "@/types";

interface ControlsProps {
  isPlaying: boolean;
  currentWpm: number;
  onPlayPause: () => void;
  onWpmChange: (wpm: number) => void;
  onRestart: () => void;
  onPreviousSentence: () => void;
  onNextSentence: () => void;
  disabled?: boolean;
}

export function Controls({
  isPlaying,
  currentWpm,
  onPlayPause,
  onWpmChange,
  onRestart,
  onPreviousSentence,
  onNextSentence,
  disabled = false,
}: ControlsProps) {
  return (
    <div className="space-y-4">
      {/* Play/Pause and Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={onPreviousSentence}
          variant="secondary"
          size="md"
          disabled={disabled || isPlaying}
          title="Previous sentence (←)"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>

        <Button
          onClick={onPlayPause}
          size="lg"
          disabled={disabled}
          className="px-12"
          title="Play/Pause (Space)"
        >
          {isPlaying ? (
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </Button>

        <Button
          onClick={onNextSentence}
          variant="secondary"
          size="md"
          disabled={disabled || isPlaying}
          title="Next sentence (→)"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>

        <Button
          onClick={onRestart}
          variant="secondary"
          size="md"
          disabled={disabled || isPlaying}
          title="Restart (R)"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </Button>
      </div>

      {/* WPM Control */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reading Speed
          </span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {currentWpm} WPM
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {WPM_OPTIONS.map((wpm) => (
            <button
              key={wpm}
              onClick={() => onWpmChange(wpm)}
              disabled={disabled}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentWpm === wpm
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {wpm}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-3">
          <Button
            onClick={() =>
              onWpmChange(Math.max(100, currentWpm - 50))
            }
            variant="ghost"
            size="sm"
            disabled={disabled || currentWpm <= 100}
            title="Decrease WPM (↓)"
          >
            -50
          </Button>
          <Button
            onClick={() =>
              onWpmChange(Math.min(600, currentWpm + 50))
            }
            variant="ghost"
            size="sm"
            disabled={disabled || currentWpm >= 600}
            title="Increase WPM (↑)"
          >
            +50
          </Button>
        </div>
      </div>
    </div>
  );
}
