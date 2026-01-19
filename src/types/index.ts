/**
 * Type definitions for the RSVP Speed Reading PWA
 */

export interface Reader {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reading {
  id: string;
  readerId: string;
  title: string;
  content: string;
  wordCount: number;
  currentPosition: number;
  currentWpm: number;
  isCompleted: boolean;
  createdAt: Date;
  lastReadAt: Date;
}

export interface ReaderSettings {
  id: string;
  readerId: string;
  defaultWpm: number;
  fontSize: "small" | "medium" | "large" | "xlarge";
  theme: "dark" | "light";
  autoSaveEvery: number;
}

export interface OfflineUpdate {
  id: string;
  readingId: string;
  position: number;
  wpm: number;
  timestamp: number;
}

export type WPMOption = 100 | 150 | 200 | 250 | 300 | 350 | 400 | 450 | 500 | 600;

export const WPM_OPTIONS: WPMOption[] = [
  100, 150, 200, 250, 300, 350, 400, 450, 500, 600,
];
