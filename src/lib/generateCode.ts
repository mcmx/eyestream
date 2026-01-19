/**
 * Reader Code Generator
 * Generates unique alphanumeric codes for readers
 */

import { customAlphabet } from "nanoid";

// Use only alphanumeric characters (uppercase and numbers) for easy typing
// Exclude similar-looking characters: 0/O, 1/I/l
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

// Generate 8-character codes
const generateNanoId = customAlphabet(alphabet, 8);

/**
 * Generate a unique reader code
 * @returns An 8-character alphanumeric code
 */
export function generateReaderCode(): string {
  return generateNanoId();
}

/**
 * Validate reader code format
 * @param code - The code to validate
 * @returns True if valid format
 */
export function isValidCodeFormat(code: string): boolean {
  // Should be 6-8 alphanumeric characters
  return /^[A-Z0-9]{6,8}$/.test(code.toUpperCase());
}
