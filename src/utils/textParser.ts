/**
 * Text Parser Utilities
 * Handles text parsing, word splitting, and punctuation-based timing
 */

export interface ParsedWord {
  text: string;
  index: number;
  delayMultiplier: number; // Multiplier for base WPM timing
  isSentenceEnd: boolean;
  isClauseEnd: boolean;
}

/**
 * Parse text into an array of words with timing metadata
 * @param text - The full text to parse
 * @returns Array of parsed words with metadata
 */
export function parseText(text: string): ParsedWord[] {
  // Split on whitespace while preserving punctuation
  const words = text.trim().split(/\s+/);

  return words.map((word, index) => {
    const isSentenceEnd = /[.!?]$/.test(word);
    const isClauseEnd = /[,;:]$/.test(word);

    // Determine delay multiplier based on punctuation
    let delayMultiplier = 1.0;
    if (isSentenceEnd) {
      delayMultiplier = 1.5; // 50% longer pause for sentence endings
    } else if (isClauseEnd) {
      delayMultiplier = 1.2; // 20% longer pause for clauses
    }

    return {
      text: word,
      index,
      delayMultiplier,
      isSentenceEnd,
      isClauseEnd,
    };
  });
}

/**
 * Find the start index of a sentence containing the given word index
 * @param words - Array of parsed words
 * @param currentIndex - Current word index
 * @returns Index of the first word in the current sentence
 */
export function findSentenceStart(
  words: ParsedWord[],
  currentIndex: number
): number {
  // Go backwards from current position to find previous sentence end
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (words[i].isSentenceEnd) {
      return i + 1;
    }
  }
  return 0; // Beginning of text
}

/**
 * Find the start index of the next sentence after the given word index
 * @param words - Array of parsed words
 * @param currentIndex - Current word index
 * @returns Index of the first word in the next sentence
 */
export function findNextSentenceStart(
  words: ParsedWord[],
  currentIndex: number
): number {
  // Find the end of current sentence
  for (let i = currentIndex; i < words.length; i++) {
    if (words[i].isSentenceEnd) {
      return Math.min(i + 1, words.length - 1);
    }
  }
  return words.length - 1; // End of text
}

/**
 * Calculate the delay in milliseconds for a word based on WPM and delay multiplier
 * @param wpm - Words per minute
 * @param delayMultiplier - Multiplier for the base delay
 * @returns Delay in milliseconds
 */
export function calculateWordDelay(
  wpm: number,
  delayMultiplier: number = 1.0
): number {
  const baseDelay = (60 / wpm) * 1000; // Convert WPM to milliseconds per word
  return baseDelay * delayMultiplier;
}

/**
 * Count total words in text
 * @param text - The text to count
 * @returns Number of words
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}
