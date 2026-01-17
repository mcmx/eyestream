/**
 * Zustand Store for Reader State Management
 * Manages reader code, readings, settings, and UI state
 */

import { create } from "zustand";
import { Reading, ReaderSettings } from "@/types";

interface ReaderState {
  // Reader data
  readerCode: string | null;
  readerId: string | null;
  readings: Reading[];
  settings: ReaderSettings | null;

  // Current reading state
  currentReading: Reading | null;
  isPlaying: boolean;
  currentWordIndex: number;
  currentWpm: number;

  // UI state
  sidebarOpen: boolean;
  settingsOpen: boolean;
  addTextModalOpen: boolean;
  isOnline: boolean;

  // Actions
  setReaderCode: (code: string, readerId: string) => void;
  clearReaderCode: () => void;
  setReadings: (readings: Reading[]) => void;
  addReading: (reading: Reading) => void;
  updateReading: (id: string, updates: Partial<Reading>) => void;
  deleteReading: (id: string) => void;
  setSettings: (settings: ReaderSettings) => void;
  setCurrentReading: (reading: Reading | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentWordIndex: (index: number) => void;
  setCurrentWpm: (wpm: number) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSettingsOpen: (open: boolean) => void;
  setAddTextModalOpen: (open: boolean) => void;
  setIsOnline: (online: boolean) => void;
  reset: () => void;
}

const initialState = {
  readerCode: null,
  readerId: null,
  readings: [],
  settings: null,
  currentReading: null,
  isPlaying: false,
  currentWordIndex: 0,
  currentWpm: 300,
  sidebarOpen: true,
  settingsOpen: false,
  addTextModalOpen: false,
  isOnline: true,
};

export const useReaderStore = create<ReaderState>((set) => ({
  ...initialState,

  setReaderCode: (code, readerId) =>
    set({ readerCode: code, readerId }),

  clearReaderCode: () =>
    set({
      readerCode: null,
      readerId: null,
      readings: [],
      settings: null,
      currentReading: null,
    }),

  setReadings: (readings) => set({ readings }),

  addReading: (reading) =>
    set((state) => ({ readings: [...state.readings, reading] })),

  updateReading: (id, updates) =>
    set((state) => ({
      readings: state.readings.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
      currentReading:
        state.currentReading?.id === id
          ? { ...state.currentReading, ...updates }
          : state.currentReading,
    })),

  deleteReading: (id) =>
    set((state) => ({
      readings: state.readings.filter((r) => r.id !== id),
      currentReading:
        state.currentReading?.id === id ? null : state.currentReading,
    })),

  setSettings: (settings) => set({ settings }),

  setCurrentReading: (reading) =>
    set({
      currentReading: reading,
      currentWordIndex: reading?.currentPosition ?? 0,
      currentWpm: reading?.currentWpm ?? 300,
      isPlaying: false,
    }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setCurrentWordIndex: (index) => set({ currentWordIndex: index }),

  setCurrentWpm: (wpm) => set({ currentWpm: wpm }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSettingsOpen: (open) => set({ settingsOpen: open }),

  setAddTextModalOpen: (open) => set({ addTextModalOpen: open }),

  setIsOnline: (online) => set({ isOnline: online }),

  reset: () => set(initialState),
}));
