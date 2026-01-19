/**
 * Code Entry Component
 * Onboarding screen for entering existing code or generating new one
 */

"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { useReaderStore } from "@/store/useReaderStore";
import { isValidCodeFormat } from "@/lib/generateCode";

export function CodeEntry() {
  const [mode, setMode] = useState<"select" | "enter" | "generate">("select");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const setReaderCode = useReaderStore((state) => state.setReaderCode);
  const setReadings = useReaderStore((state) => state.setReadings);
  const setSettings = useReaderStore((state) => state.setSettings);

  const handleEnterCode = async () => {
    setError("");

    if (!isValidCodeFormat(code)) {
      setError("Invalid code format. Code should be 6-8 alphanumeric characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/reader/${code.toUpperCase()}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Reader code not found. Please check your code.");
        } else {
          setError("Failed to validate code. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // Fetch readings
      const readingsResponse = await fetch(
        `/api/readings?code=${code.toUpperCase()}`
      );
      const readingsData = await readingsResponse.json();

      // Save to localStorage
      localStorage.setItem("readerCode", code.toUpperCase());

      // Update store
      setReaderCode(code.toUpperCase(), data.reader.id);
      setReadings(readingsData.readings || []);
      setSettings(data.reader.settings);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reader", { method: "POST" });

      if (!response.ok) {
        setError("Failed to generate code. Please try again.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // Save to localStorage
      localStorage.setItem("readerCode", data.code);

      // Update store
      setReaderCode(data.code, data.reader.id);
      setSettings(data.reader.settings);
      setReadings([]);

      setGeneratedCode(data.code);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (generatedCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Your Reader Code
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Save this code to access your library on any device
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider">
              {generatedCode}
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Write this code down or take a screenshot. You'll need it to access
            your readings on other devices.
          </p>

          <Button
            onClick={() => {
              navigator.clipboard.writeText(generatedCode);
            }}
            variant="secondary"
            className="w-full mb-3"
          >
            Copy Code
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Ready to start reading!
          </p>
        </div>
      </div>
    );
  }

  if (mode === "select") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              EyeStream
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              RSVP Speed Reading
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setMode("generate")}
              className="w-full"
              size="lg"
            >
              Generate New Code
            </Button>

            <Button
              onClick={() => setMode("enter")}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              I Have a Code
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-6">
            Your code lets you sync your reading library across devices
          </p>
        </div>
      </div>
    );
  }

  if (mode === "enter") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <button
            onClick={() => setMode("select")}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Enter Your Code
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Reader Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter your code"
                maxLength={8}
                className="w-full px-4 py-3 text-lg font-mono text-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 uppercase"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              onClick={handleEnterCode}
              disabled={isLoading || code.length < 6}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Validating..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "generate") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <button
            onClick={() => setMode("select")}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Generate Reader Code
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We'll create a unique code for you. Save it to access your reading
            library on any device.
          </p>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 mb-4">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerateCode}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Generating..." : "Generate My Code"}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
