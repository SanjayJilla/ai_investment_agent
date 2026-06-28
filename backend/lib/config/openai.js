import OpenAI from "openai";
import https from "https";

let client;

export function getOpenAIClient() {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables.");
    }
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
      httpAgent: new https.Agent({ keepAlive: false }),
    });
  }
  return client;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Robust wrapper for chat completions that automatically:
 * 1. Handles rate limits (429) with exponential backoff retries.
 * 2. Falls back to alternative models if errors persist.
 */
export async function createChatCompletion(params) {
  const client = getOpenAIClient();
  
  const requestedModel = params.model || "llama-3.3-70b-versatile";
  const fallbackModels = [
    requestedModel,
    "llama-3.3-70b-specdec",
    "llama-3.1-70b-versatile",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
    "llama-3.1-8b-instant"
  ];
  
  const uniqueModels = Array.from(new Set(fallbackModels));
  let lastError;

  for (const model of uniqueModels) {
    let retries = 3;
    let delay = 2000; // start with 2s delay

    while (retries > 0) {
      try {
        console.log(`[OpenAIClient] Attempting completion using model: ${model} (${retries} retries left)`);
        const response = await client.chat.completions.create({
          ...params,
          model,
        });
        return response;
      } catch (err) {
        lastError = err;
        const isRateLimit = err.status === 429 || 
                            err.statusCode === 429 || 
                            String(err.message).toLowerCase().includes("rate limit") ||
                            String(err.message).includes("429");

        if (isRateLimit && retries > 1) {
          console.warn(`[OpenAIClient] Rate limited on ${model}. Retrying in ${delay}ms... (Error: ${err.message})`);
          await sleep(delay);
          delay *= 2; // exponential backoff
          retries--;
        } else {
          console.warn(`[OpenAIClient] Request failed for model ${model}. Error: ${err.message}`);
          break; // break retry loop and try fallback model
        }
      }
    }
  }
  
  throw lastError;
}
