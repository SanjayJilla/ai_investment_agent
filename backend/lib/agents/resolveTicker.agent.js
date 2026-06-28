import { createChatCompletion } from "../config/openai.js";
import { resolverToolDefinition } from "../tools/resolver.tool.js";

/**
 * Resolves a user-provided company name or partial ticker to a definitive ticker symbol
 */
export async function resolveTickerAgent(companyInput) {
  const response = await createChatCompletion({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a financial data specialist. Given a company name or partial ticker, identify the correct publicly-traded stock ticker symbol on US markets (NYSE or NASDAQ preferred). 
        
Common examples:
- "Apple" or "apple" → AAPL, "Apple Inc."
- "Microsoft" → MSFT, "Microsoft Corporation"  
- "Tesla" → TSLA, "Tesla, Inc."
- "Google" or "Alphabet" → GOOGL, "Alphabet Inc."
- "Amazon" → AMZN, "Amazon.com, Inc."
- "Meta" or "Facebook" → META, "Meta Platforms, Inc."

Always call the resolve_ticker function with your answer.`,
      },
      {
        role: "user",
        content: `Resolve this to a stock ticker: "${companyInput}"`,
      },
    ],
    tools: [resolverToolDefinition],
    tool_choice: { type: "function", function: { name: "resolve_ticker" } },
    temperature: 0,
  });

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    throw new Error("Ticker resolver did not return a tool call.");
  }

  const result = JSON.parse(toolCall.function.arguments);
  
  // Sanitize confidence
  let confidence = result.confidence ? String(result.confidence).toLowerCase() : "medium";
  if (!["high", "medium", "low"].includes(confidence)) {
    confidence = "medium";
  }

  return {
    ticker: result.ticker.toUpperCase(),
    canonicalName: result.canonicalName,
    confidence: confidence,
  };
}
