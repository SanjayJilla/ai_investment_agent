/**
 * Robust JSON extraction and parsing utility for model completions
 */
export function parseModelJSON(response, functionName = null) {
  const choice = response?.choices?.[0];
  const message = choice?.message;

  // 1. Try to extract from formal tool call
  if (message?.tool_calls && message.tool_calls.length > 0) {
    const toolCall = message.tool_calls[0];
    if (!functionName || toolCall.function?.name === functionName) {
      const argsStr = toolCall.function?.arguments;
      if (argsStr) {
        try {
          return JSON.parse(argsStr);
        } catch (err) {
          console.warn(`[JSONParser] Failed to parse tool_calls arguments directly. Trying fallback extraction. String: ${argsStr}`);
          const fallbackParsed = extractAndParseJSON(argsStr);
          if (fallbackParsed) return fallbackParsed;
        }
      }
    }
  }

  // 2. Try to extract from text content (often models output JSON inside content block)
  const content = message?.content;
  if (content) {
    try {
      // Direct parse check first
      return JSON.parse(content.trim());
    } catch (e) {
      // Fallback extraction
      const extracted = extractAndParseJSON(content);
      if (extracted) return extracted;
    }
  }

  throw new Error(`Failed to extract valid JSON for function/structure: ${functionName || "any"}. Response details: ${JSON.stringify(message || {})}`);
}

/**
 * Helper to extract and parse JSON from mixed string content
 */
function extractAndParseJSON(str) {
  if (!str) return null;

  try {
    let cleanStr = str.trim();

    // Remove markdown code blocks if present
    if (cleanStr.includes("```")) {
      // match ```json { ... } ``` or ``` { ... } ```
      const matches = cleanStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (matches && matches[1]) {
        cleanStr = matches[1].trim();
      }
    }

    // Find the first '{' and the last '}'
    const startIndex = cleanStr.indexOf("{");
    const endIndex = cleanStr.lastIndexOf("}");

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      cleanStr = cleanStr.slice(startIndex, endIndex + 1);
      
      // Clean up common LLM JSON bugs (e.g. trailing commas, escaped quotes)
      cleanStr = cleanStr
        .replace(/,\s*([\]}])/g, "$1") // trailing commas before } or ]
        .replace(/\\"/g, '"'); // unescape quotes
        
      return JSON.parse(cleanStr);
    }
  } catch (err) {
    console.error(`[JSONParser] extractAndParseJSON failed to parse clean string. Error: ${err.message}`);
  }

  return null;
}
