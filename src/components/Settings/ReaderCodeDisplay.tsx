/**
 * Reader Code Display Component
 * Shows the reader code with copy functionality
 */

"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";

interface ReaderCodeDisplayProps {
  code: string;
}

export function ReaderCodeDisplay({ code }: ReaderCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Your Reader Code
      </label>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3">
          <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider text-center">
            {code}
          </div>
        </div>

        <Button onClick={handleCopy} variant="secondary" size="md">
          {copied ? (
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Use this code to access your library on other devices
      </p>
    </div>
  );
}
