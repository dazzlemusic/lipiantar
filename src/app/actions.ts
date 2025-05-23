// Use server directive is required for Next.js Server Actions
'use server';

import { translateRomanToGurmukhi, type TranslateRomanToGurmukhiInput, type TranslateRomanToGurmukhiOutput } from '@/ai/flows/translate-roman-to-gurmukhi';

export interface TranslationResult {
  gurmukhiText?: string;
  error?: string;
}

export async function getGurmukhiTranslationAction(romanText: string): Promise<TranslationResult> {
  if (!romanText || !romanText.trim()) {
    return { error: 'Input text cannot be empty.' };
  }
  try {
    const input: TranslateRomanToGurmukhiInput = { romanPunjabiText: romanText };
    // Assuming translateRomanToGurmukhi is correctly set up and returns the expected structure.
    const result: TranslateRomanToGurmukhiOutput = await translateRomanToGurmukhi(input);
    return { gurmukhiText: result.gurmukhiPunjabiText };
  } catch (e: unknown) {
    console.error('Translation error:', e);
    // It's good practice to check the error type if possible, or at least serialize it safely.
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { error: `Failed to translate text: ${errorMessage}. Please try again.` };
  }
}
