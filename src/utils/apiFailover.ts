import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, LanguageModelV1, GenerateTextResult } from 'ai';
import { z } from 'zod'; // Keep z for potential future use or if it's implicitly needed by 'ai' types

const API_KEYS: string[] = [
  import.meta.env.VITE_GOOGLE_API_KEY,
  import.meta.env.VITE_GOOGLE_API_KEY_2,
  import.meta.env.VITE_GOOGLE_API_KEY_3,
].filter(Boolean); // Filter out any undefined keys

interface GenerateTextOptions {
  messages: any; // Use 'any' for now to avoid deep type issues, or define more strictly if needed
  tools?: Record<string, { description: string; parameters: z.ZodObject<any> }>;
  toolResults?: any[];
}

export async function callGeminiWithFailover(
  modelName: string,
  options: GenerateTextOptions
): Promise<any> {
  let lastError: unknown;

  for (const apiKey of API_KEYS) {
    try {
      if (!apiKey) {
        console.warn('Skipping undefined API key.');
        continue;
      }
      const googleAI = createGoogleGenerativeAI({ apiKey });
      const model: LanguageModelV1 = googleAI(modelName);
      
      return await generateText({
        model: model,
        ...options,
      });
    } catch (error) {
      console.error(`API call failed with key: ${apiKey}. Retrying with next key.`, error);
      lastError = error;
    }
  }

  if (lastError) {
    throw new Error(`All Gemini API key attempts failed. Last error: ${lastError}`);
  } else {
    throw new Error('No valid API keys were provided or all attempts failed without a specific error.');
  }
}