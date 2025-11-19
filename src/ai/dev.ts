import { config } from 'dotenv';
config();

import '@/ai/flows/generate-poem-from-photo.ts';
import '@/ai/flows/improve-generated-poem.ts';
import '@/ai/flows/text-to-speech.ts';
