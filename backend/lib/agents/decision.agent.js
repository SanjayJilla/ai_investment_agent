import { createChatCompletion } from "../config/openai.js";
import { getDecisionPrompt } from "../prompts/decision.prompt.js";
import { parseModelJSON } from "../utils/jsonParser.js";

/**
 * Makes the final INVEST / PASS decision based on all prior analysis
 */
export async function decisionAgent(companyName, ticker, stockData, researchData, riskData) {

  const response = await createChatCompletion({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: getDecisionPrompt(companyName, ticker, stockData, researchData, riskData),
      },
      {
        role: "user",
        content: `Make the final investment decision for ${companyName} (${ticker}). Return the JSON object only.`,
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  try {
    return parseModelJSON(response);
  } catch (err) {
    console.error(`[DecisionAgent] Error parsing JSON response:`, err);
    console.error(`[DecisionAgent] Raw content:`, response?.choices?.[0]?.message?.content);
    throw new Error(`Failed to parse investment decision data: ${err.message}`);
  }
}
