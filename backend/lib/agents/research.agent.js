import { createChatCompletion } from "../config/openai.js";
import { searchCompanyNews } from "../services/research.service.js";
import { researchToolDefinition } from "../tools/research.tool.js";
import { getResearchPrompt } from "../prompts/research.prompt.js";
import { parseModelJSON } from "../utils/jsonParser.js";

/**
 * Runs web research via Tavily and synthesizes findings using GPT-4o
 */
export async function researchAgent(companyName, ticker, stockData) {
  // Fetch real web research
  const rawResearch = await searchCompanyNews(companyName, ticker);

  const researchContent = `
## Web Research Results for ${companyName} (${ticker})

### AI-Generated Answer
${rawResearch.answer || "No direct answer available"}

### Source Articles
${rawResearch.sources
    .slice(0, 9)
    .map(
      (s, i) => `
**Source ${i + 1}: ${s.title}**
URL: ${s.url}
Content: ${s.content?.slice(0, 400)}...
`
    )
    .join("\n")}
`;

  const response = await createChatCompletion({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: getResearchPrompt(companyName, ticker, stockData),
      },
      {
        role: "user",
        content: researchContent,
      },
    ],
    tools: [researchToolDefinition],
    tool_choice: { type: "function", function: { name: "summarize_research" } },
    temperature: 0.4,
  });

  let researchData;
  try {
    researchData = parseModelJSON(response, "summarize_research");
  } catch (err) {
    console.error(`[ResearchAgent] Error parsing model response:`, err);
    console.error(`[ResearchAgent] Raw content:`, response?.choices?.[0]?.message?.content);
    console.error(`[ResearchAgent] Raw tool calls:`, JSON.stringify(response?.choices?.[0]?.message?.tool_calls || []));
    throw new Error(`Failed to parse research data: ${err.message}`);
  }

  // Sanitize sentimentSummary
  let sentimentSummary = researchData.sentimentSummary ? String(researchData.sentimentSummary).toLowerCase() : "neutral";
  if (!["very_bullish", "bullish", "neutral", "bearish", "very_bearish"].includes(sentimentSummary)) {
    sentimentSummary = "neutral";
  }
  researchData.sentimentSummary = sentimentSummary;

  return { researchData, sources: rawResearch.sources.slice(0, 6) };
}
