'use server';
/**
 * @fileOverview An AI agent that generates a poem from a photo.
 *
 * - generatePoemFromPhoto - A function that handles the poem generation process.
 * - GeneratePoemFromPhotoInput - The input type for the generatePoemFromPhoto function.
 * - GeneratePoemFromPhotoOutput - The return type for the generatePoemFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to generate a poem from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'  ),
});
export type GeneratePoemFromPhotoInput = z.infer<typeof GeneratePoemFromPhotoInputSchema>;

const GeneratePoemFromPhotoOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemFromPhotoOutput = z.infer<typeof GeneratePoemFromPhotoOutputSchema>;

export async function generatePoemFromPhoto(input: GeneratePoemFromPhotoInput): Promise<GeneratePoemFromPhotoOutput> {
  return generatePoemFromPhotoFlow(input);
}

const generatePoemPrompt = ai.definePrompt({
  name: 'generatePoemPrompt',
  input: {schema: GeneratePoemFromPhotoInputSchema},
  output: {schema: GeneratePoemFromPhotoOutputSchema},
  prompt: `You are a poet laureate. You are given a photo, and your task is to write a poem inspired by the photo. The poem should capture the essence, emotion, and visual elements of the photo.

Photo: {{media url=photoDataUri}}

Write a poem:`,
});

const generatePoemFromPhotoFlow = ai.defineFlow(
  {
    name: 'generatePoemFromPhotoFlow',
    inputSchema: GeneratePoemFromPhotoInputSchema,
    outputSchema: GeneratePoemFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await generatePoemPrompt(input);
    return output!;
  }
);
