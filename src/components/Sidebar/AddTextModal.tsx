/**
 * Add Text Modal Component
 * Modal for adding new reading texts
 */

"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useReaderStore } from "@/store/useReaderStore";

interface AddTextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_TEXT = `The phenomenon of speed reading has fascinated researchers and educators for decades. Traditional reading involves subvocalization—the habit of pronouncing words in your head as you read them. This internal voice typically limits reading speed to around 200-300 words per minute. RSVP, or Rapid Serial Visual Presentation, bypasses this limitation by displaying one word at a time at a fixed focal point, eliminating the need for eye movement and reducing subvocalization. With practice, readers can reach speeds of 500-1000 words per minute while maintaining comprehension. The key is the Optimal Recognition Point, or ORP, which highlights the letter where your eye naturally focuses when recognizing a word.`;

export function AddTextModal({ isOpen, onClose }: AddTextModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const readerCode = useReaderStore((state) => state.readerCode);
  const addReading = useReaderStore((state) => state.addReading);
  const setCurrentReading = useReaderStore((state) => state.setCurrentReading);

  const handleReset = () => {
    setTitle("");
    setContent("");
    setError("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleLoadSample = () => {
    setTitle("Introduction to RSVP Speed Reading");
    setContent(SAMPLE_TEXT);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      setError("Please upload a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);

      // Auto-generate title from filename
      if (!title) {
        const filename = file.name.replace(/\.txt$/, "");
        setTitle(filename);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async (startReading: boolean) => {
    setError("");

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!content.trim()) {
      setError("Please enter some text");
      return;
    }

    if (!readerCode) {
      setError("Reader code not found");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: readerCode,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        setError("Failed to save reading");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      addReading(data.reading);

      if (startReading) {
        setCurrentReading(data.reading);
      }

      handleClose();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Text" maxWidth="xl">
      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this reading"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Text Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Text Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your text here..."
            rows={12}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {content.trim().split(/\s+/).filter((w) => w.length > 0).length} words
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleLoadSample}
            variant="secondary"
            size="sm"
          >
            Load Sample Text
          </Button>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition-colors">
              Upload .txt File
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Saving..." : "Save & Start Reading"}
          </Button>

          <Button
            onClick={() => handleSave(false)}
            disabled={isLoading}
            variant="secondary"
            className="flex-1"
          >
            Save for Later
          </Button>
        </div>
      </div>
    </Modal>
  );
}
