/**
 * Keyboard Shortcuts Hook
 * Handles global keyboard shortcuts for the application
 */

"use client";

import { useEffect } from "react";
import { useReaderStore } from "@/store/useReaderStore";

interface KeyboardShortcutsOptions {
  onPlayPause?: () => void;
  onPreviousSentence?: () => void;
  onNextSentence?: () => void;
  onRestart?: () => void;
  onIncreaseWpm?: () => void;
  onDecreaseWpm?: () => void;
  onToggleSidebar?: () => void;
  onOpenAddText?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions) {
  const {
    onPlayPause,
    onPreviousSentence,
    onNextSentence,
    onRestart,
    onIncreaseWpm,
    onDecreaseWpm,
    onToggleSidebar,
    onOpenAddText,
  } = options;

  const settingsOpen = useReaderStore((state) => state.settingsOpen);
  const addTextModalOpen = useReaderStore((state) => state.addTextModalOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if a modal is open or user is typing
      if (
        settingsOpen ||
        addTextModalOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ": // Spacebar
          e.preventDefault();
          onPlayPause?.();
          break;

        case "ArrowLeft":
          e.preventDefault();
          onPreviousSentence?.();
          break;

        case "ArrowRight":
          e.preventDefault();
          onNextSentence?.();
          break;

        case "ArrowUp":
          e.preventDefault();
          onIncreaseWpm?.();
          break;

        case "ArrowDown":
          e.preventDefault();
          onDecreaseWpm?.();
          break;

        case "r":
        case "R":
          e.preventDefault();
          onRestart?.();
          break;

        case "b":
        case "B":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onToggleSidebar?.();
          }
          break;

        case "n":
        case "N":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onOpenAddText?.();
          }
          break;

        case "Escape":
          // Escape is handled by modals themselves
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    onPlayPause,
    onPreviousSentence,
    onNextSentence,
    onRestart,
    onIncreaseWpm,
    onDecreaseWpm,
    onToggleSidebar,
    onOpenAddText,
    settingsOpen,
    addTextModalOpen,
  ]);
}
