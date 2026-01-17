/**
 * ORP (Optimal Recognition Point) Algorithm
 * Determines which letter in a word should be highlighted for optimal reading speed
 */

/**
 * Get the ORP position for a given word
 * @param word - The word to analyze
 * @returns The 0-indexed position of the ORP letter
 */
export function getORPPosition(word: string): number {
  const length = word.length;

  if (length === 1) return 0;
  if (length >= 2 && length <= 5) return 1;
  if (length >= 6 && length <= 9) return 2;
  if (length >= 10 && length <= 13) return 3;
  return 4; // 14+ chars
}

/**
 * Split a word into three parts: before ORP, ORP letter, and after ORP
 * @param word - The word to split
 * @returns Object with before, orp, and after parts
 */
export function splitWordAtORP(word: string): {
  before: string;
  orp: string;
  after: string;
} {
  const orpPos = getORPPosition(word);

  return {
    before: word.slice(0, orpPos),
    orp: word[orpPos],
    after: word.slice(orpPos + 1),
  };
}
