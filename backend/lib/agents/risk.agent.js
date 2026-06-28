import { createChatCompletion } from "../config/openai.js";
import { getRiskPrompt } from "../prompts/risk.prompt.js";
import { parseModelJSON } from "../utils/jsonParser.js";

/**
 * Evaluates risk factors for the stock using quantitative data and research findings
 */
export async function riskAgent(companyName, ticker, stockData, researchData) {

  const response = await createChatCompletion({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: getRiskPrompt(companyName, ticker, stockData, researchData),
      },
      {
        role: "user",
        content: `Perform a comprehensive risk analysis for ${companyName} (${ticker}). Return the JSON object only.`,
      },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  try {
    return parseModelJSON(response);
  } catch (err) {
    console.error(`[RiskAgent] Error parsing JSON response:`, err);
    console.error(`[RiskAgent] Raw content:`, response?.choices?.[0]?.message?.content);
    throw new Error(`Failed to parse risk evaluation data: ${err.message}`);
  }
}
