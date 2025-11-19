"use server";

import { generatePoemFromPhoto } from "@/ai/flows/generate-poem-from-photo";
import {
  improveGeneratedPoem,
  type ImproveGeneratedPoemInput,
} from "@/ai/flows/improve-generated-poem";
import {
  textToSpeech,
  type TextToSpeechInput,
} from "@/ai/flows/text-to-speech";

export async function generatePoemAction(photoDataUri: string) {
  if (!photoDataUri) {
    return { error: "Photo data is missing." };
  }
  try {
    const result = await generatePoemFromPhoto({ photoDataUri });
    return { poem: result.poem };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to generate poem: ${errorMessage}` };
  }
}

export async function improvePoemAction(input: ImproveGeneratedPoemInput) {
  if (!input.initialPoem || !input.userEdits || !input.photoDataUri) {
    return { error: "Required information for improving poem is missing." };
  }
  try {
    const result = await improveGeneratedPoem(input);
    return { improvedPoem: result.improvedPoem };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to improve poem: ${errorMessage}` };
  }
}

export async function textToSpeechAction(input: TextToSpeechInput) {
  if (!input.text) {
    return { error: "Text for speech synthesis is missing." };
  }
  try {
    const result = await textToSpeech(input);
    return { audioDataUri: result.audioDataUri };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to generate audio: ${errorMessage}` };
  }
}
