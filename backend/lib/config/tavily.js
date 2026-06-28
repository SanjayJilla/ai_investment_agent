import { tavily } from "@tavily/core";

let client;

export function getTavilyClient() {
  if (!client) {
    if (!process.env.TAVILY_API_KEY) {
      throw new Error("TAVILY_API_KEY is not set in environment variables.");
    }
    client = tavily({ apiKey: process.env.TAVILY_API_KEY });
  }
  return client;
}
