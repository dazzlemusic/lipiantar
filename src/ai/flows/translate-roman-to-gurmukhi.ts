// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for translating Romanized Punjabi text into formal Gurmukhi Punjabi.
 *
 * - translateRomanToGurmukhi - A function that translates Romanized Punjabi to Gurmukhi Punjabi.
 * - TranslateRomanToGurmukhiInput - The input type for the translateRomanToGurmukhi function.
 * - TranslateRomanToGurmukhiOutput - The return type for the translateRomanToGurmukhi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateRomanToGurmukhiInputSchema = z.object({
  romanPunjabiText: z
    .string()
    .describe('The Romanized Punjabi text to translate.'),
});
export type TranslateRomanToGurmukhiInput = z.infer<typeof TranslateRomanToGurmukhiInputSchema>;

const TranslateRomanToGurmukhiOutputSchema = z.object({
  gurmukhiPunjabiText: z
    .string()
    .describe('The translated Gurmukhi Punjabi text.'),
});
export type TranslateRomanToGurmukhiOutput = z.infer<typeof TranslateRomanToGurmukhiOutputSchema>;

export async function translateRomanToGurmukhi(
  input: TranslateRomanToGurmukhiInput
): Promise<TranslateRomanToGurmukhiOutput> {
  return translateRomanToGurmukhiFlow(input);
}

const translateRomanToGurmukhiPrompt = ai.definePrompt({
  name: 'translateRomanToGurmukhiPrompt',
  input: {schema: TranslateRomanToGurmukhiInputSchema},
  output: {schema: TranslateRomanToGurmukhiOutputSchema},
  prompt: `Translate the following Romanized Punjabi into formal Gurmukhi Punjabi:

{{{romanPunjabiText}}}`,
});

const translateRomanToGurmukhiFlow = ai.defineFlow(
  {
    name: 'translateRomanToGurmukhiFlow',
    inputSchema: TranslateRomanToGurmukhiInputSchema,
    outputSchema: TranslateRomanToGurmukhiOutputSchema,
  },
  async input => {
    const {output} = await translateRomanToGurmukhiPrompt(input);
    return output!;
  }
);
