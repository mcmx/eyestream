/**
 * Settings Modal Component
 * User settings including reader code, font size, theme, etc.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ReaderCodeDisplay } from "./ReaderCodeDisplay";
import { useReaderStore } from "@/store/useReaderStore";
import { ReaderSettings } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const readerCode = useReaderStore((state) => state.readerCode);
  const settings = useReaderStore((state) => state.settings);
  const setSettings = useReaderStore((state) => state.setSettings);
  const clearReaderCode = useReaderStore((state) => state.clearReaderCode);

  const [localSettings, setLocalSettings] = useState<Partial<ReaderSettings>>(
    {}
  );

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!readerCode || !settings) return;

    try {
      const response = await fetch(`/api/reader/${readerCode}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        onClose();
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleUseDifferentCode = () => {
    if (
      confirm(
        "Are you sure? This will log you out and you'll need to enter a new code."
      )
    ) {
      localStorage.removeItem("readerCode");
      clearReaderCode();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" maxWidth="lg">
      <div className="space-y-6">
        {/* Reader Code */}
        {readerCode && <ReaderCodeDisplay code={readerCode} />}

        {/* Use Different Code */}
        <div>
          <Button
            onClick={handleUseDifferentCode}
            variant="secondary"
            className="w-full"
          >
            Use Different Code
          </Button>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(["small", "medium", "large", "xlarge"] as const).map((size) => (
              <button
                key={size}
                onClick={() =>
                  setLocalSettings({ ...localSettings, fontSize: size })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  localSettings.fontSize === size
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["dark", "light"] as const).map((theme) => (
              <button
                key={theme}
                onClick={() =>
                  setLocalSettings({ ...localSettings, theme })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  localSettings.theme === theme
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Default WPM */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Reading Speed (WPM)
          </label>
          <input
            type="number"
            min="100"
            max="600"
            step="50"
            value={localSettings.defaultWpm || 300}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                defaultWpm: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Auto Save Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Auto-save Every N Words
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={localSettings.autoSaveEvery || 5}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                autoSaveEvery: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Position is saved every N words during reading
          </p>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
