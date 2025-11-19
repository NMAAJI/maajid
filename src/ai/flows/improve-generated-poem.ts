// src/ai/flows/improve-generated-poem.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving a generated poem based on user feedback.
 *
 * The flow takes an initial poem and user edits as input and uses an LLM to refine the poem.
 * It exports:
 * - `improveGeneratedPoem`: The main function to call to improve a poem.
 * - `ImproveGeneratedPoemInput`: The input type for the `improveGeneratedPoem` function.
 * - `ImproveGeneratedPoemOutput`: The output type for the `improveGeneratedPoem` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveGeneratedPoemInputSchema = z.object({
  initialPoem: z.string().describe('The initially generated poem.'),
  userEdits: z.string().describe('The user provided edits to the poem.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo that inspired the initial poem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImproveGeneratedPoemInput = z.infer<typeof ImproveGeneratedPoemInputSchema>;

const ImproveGeneratedPoemOutputSchema = z.object({
  improvedPoem: z.string().describe('The improved poem based on user edits.'),
});
export type ImproveGeneratedPoemOutput = z.infer<typeof ImproveGeneratedPoemOutputSchema>;

export async function improveGeneratedPoem(input: ImproveGeneratedPoemInput): Promise<ImproveGeneratedPoemOutput> {
  return improveGeneratedPoemFlow(input);
}

const improveGeneratedPoemPrompt = ai.definePrompt({
  name: 'improveGeneratedPoemPrompt',
  input: {schema: ImproveGeneratedPoemInputSchema},
  output: {schema: ImproveGeneratedPoemOutputSchema},
  prompt: `You are a helpful AI assistant that improves poems based on user edits.

  Here's the initial poem:
  {{initialPoem}}

  Here are the user's edits:
  {{userEdits}}

  Please refine the poem based on these edits, ensuring it maintains a consistent tone and theme from the photo:
  {{media url=photoDataUri}}`,
});

const improveGeneratedPoemFlow = ai.defineFlow(
  {
    name: 'improveGeneratedPoemFlow',
    inputSchema: ImproveGeneratedPoemInputSchema,
    outputSchema: ImproveGeneratedPoemOutputSchema,
  },
  async input => {
    const {output} = await improveGeneratedPoemPrompt(input);
    return output!;
  }
);
