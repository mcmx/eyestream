/**
 * RSVP Reading Hook
 * Handles timing logic for displaying words at specified WPM
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  parseText,
  calculateWordDelay,
  findSentenceStart,
  findNextSentenceStart,
  ParsedWord,
} from "@/utils/textParser";
import { useReaderStore } from "@/store/useReaderStore";

export function useRSVP(content: string) {
  const [words, setWords] = useState<ParsedWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentWpm = useReaderStore((state) => state.currentWpm);
  const setStoreIsPlaying = useReaderStore((state) => state.setIsPlaying);
  const setCurrentWordIndex = useReaderStore(
    (state) => state.setCurrentWordIndex
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse text when content changes
  useEffect(() => {
    if (content) {
      const parsed = parseText(content);
      setWords(parsed);
    }
  }, [content]);

  // Sync store with local state
  useEffect(() => {
    setStoreIsPlaying(isPlaying);
  }, [isPlaying, setStoreIsPlaying]);

  useEffect(() => {
    setCurrentWordIndex(currentIndex);
  }, [currentIndex, setCurrentWordIndex]);

  // Main playback loop
  useEffect(() => {
    if (!isPlaying || words.length === 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (currentIndex >= words.length) {
      setIsPlaying(false);
      return;
    }

    const currentWord = words[currentIndex];
    const delay = calculateWordDelay(currentWpm, currentWord.delayMultiplier);

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentIndex, words, currentWpm]);

  const play = useCallback(() => {
    if (words.length > 0 && currentIndex < words.length) {
      setIsPlaying(true);
    }
  }, [words.length, currentIndex]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const restart = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const goToPreviousSentence = useCallback(() => {
    if (words.length === 0) return;
    const prevStart = findSentenceStart(words, currentIndex);
    setCurrentIndex(prevStart);
    setIsPlaying(false);
  }, [words, currentIndex]);

  const goToNextSentence = useCallback(() => {
    if (words.length === 0) return;
    const nextStart = findNextSentenceStart(words, currentIndex);
    setCurrentIndex(nextStart);
    setIsPlaying(false);
  }, [words, currentIndex]);

  const setIndex = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, words.length - 1)));
    setIsPlaying(false);
  }, [words.length]);

  const currentWord = words[currentIndex];

  return {
    currentWord: currentWord?.text || "",
    currentIndex,
    totalWords: words.length,
    isPlaying,
    play,
    pause,
    togglePlayPause,
    restart,
    goToPreviousSentence,
    goToNextSentence,
    setIndex,
  };
}
