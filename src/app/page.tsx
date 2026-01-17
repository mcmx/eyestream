"use client";

import React, { useEffect, useState } from "react";
import { CodeEntry } from "@/components/Onboarding/CodeEntry";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { AddTextModal } from "@/components/Sidebar/AddTextModal";
import { WordDisplay } from "@/components/Reader/WordDisplay";
import { ProgressBar } from "@/components/Reader/ProgressBar";
import { Controls } from "@/components/Reader/Controls";
import { SettingsModal } from "@/components/Settings/SettingsModal";
import { Button } from "@/components/ui/Button";
import { useReaderStore } from "@/store/useReaderStore";
import { useRSVP } from "@/hooks/useRSVP";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSync } from "@/hooks/useSync";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);

  const readerCode = useReaderStore((state) => state.readerCode);
  const readerId = useReaderStore((state) => state.readerId);
  const currentReading = useReaderStore((state) => state.currentReading);
  const settings = useReaderStore((state) => state.settings);
  const currentWpm = useReaderStore((state) => state.currentWpm);
  const sidebarOpen = useReaderStore((state) => state.sidebarOpen);
  const settingsOpen = useReaderStore((state) => state.settingsOpen);
  const addTextModalOpen = useReaderStore((state) => state.addTextModalOpen);

  const setReaderCode = useReaderStore((state) => state.setReaderCode);
  const setReadings = useReaderStore((state) => state.setReadings);
  const setSettings = useReaderStore((state) => state.setSettings);
  const setCurrentWpm = useReaderStore((state) => state.setCurrentWpm);
  const toggleSidebar = useReaderStore((state) => state.toggleSidebar);
  const setSettingsOpen = useReaderStore((state) => state.setSettingsOpen);
  const setAddTextModalOpen = useReaderStore(
    (state) => state.setAddTextModalOpen
  );

  // Initialize from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem("readerCode");
    if (savedCode) {
      fetch(`/api/reader/${savedCode}`)
        .then((res) => res.json())
        .then((data) => {
          setReaderCode(savedCode, data.reader.id);
          setSettings(data.reader.settings);

          // Fetch readings
          return fetch(`/api/readings?code=${savedCode}`);
        })
        .then((res) => res.json())
        .then((data) => {
          setReadings(data.readings || []);
        })
        .catch((err) => {
          console.error("Failed to load reader data:", err);
          localStorage.removeItem("readerCode");
        })
        .finally(() => {
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, [setReaderCode, setReadings, setSettings]);

  // RSVP hook
  const {
    currentWord,
    currentIndex,
    totalWords,
    isPlaying,
    togglePlayPause,
    restart,
    goToPreviousSentence,
    goToNextSentence,
  } = useRSVP(currentReading?.content || "");

  // Sync hook
  const { syncEveryNWords, syncImmediately } = useSync(currentReading?.id || null);

  // Offline queue hook
  useOfflineQueue();

  // Sync position when it changes
  useEffect(() => {
    if (currentReading && currentIndex > 0) {
      syncEveryNWords(currentIndex, currentWpm, settings?.autoSaveEvery || 5);
    }
  }, [currentIndex, currentWpm, currentReading, settings, syncEveryNWords]);

  // Sync when pausing
  useEffect(() => {
    if (!isPlaying && currentReading && currentIndex > 0) {
      syncImmediately(currentIndex, currentWpm);
    }
  }, [isPlaying, currentIndex, currentWpm, currentReading, syncImmediately]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: togglePlayPause,
    onPreviousSentence: goToPreviousSentence,
    onNextSentence: goToNextSentence,
    onRestart: restart,
    onIncreaseWpm: () => setCurrentWpm(Math.min(600, currentWpm + 50)),
    onDecreaseWpm: () => setCurrentWpm(Math.max(100, currentWpm - 50)),
    onToggleSidebar: toggleSidebar,
    onOpenAddText: () => setAddTextModalOpen(true),
  });

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!readerCode || !readerId) {
    return <CodeEntry />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentReading?.title || "EyeStream"}
              </h1>
            </div>

            <Button
              onClick={() => setSettingsOpen(true)}
              variant="ghost"
              size="sm"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
          </div>
        </header>

        {/* Reading Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentReading ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Word Display */}
              <WordDisplay
                word={currentWord}
                fontSize={settings?.fontSize || "large"}
              />

              {/* Progress Bar */}
              <ProgressBar current={currentIndex} total={totalWords} />

              {/* Controls */}
              <Controls
                isPlaying={isPlaying}
                currentWpm={currentWpm}
                onPlayPause={togglePlayPause}
                onWpmChange={setCurrentWpm}
                onRestart={restart}
                onPreviousSentence={goToPreviousSentence}
                onNextSentence={goToNextSentence}
                disabled={!currentReading}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📖</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No Reading Selected
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose a reading from the sidebar or add a new one
                </p>
                <Button onClick={() => setAddTextModalOpen(true)}>
                  Add New Text
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddTextModal
        isOpen={addTextModalOpen}
        onClose={() => setAddTextModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
