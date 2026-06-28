import { createChatCompletion } from "../config/openai.js";
import { fetchStockData } from "../services/stock.service.js";
import { stockAnalysisToolDefinition } from "../tools/stock.tool.js";
import { parseModelJSON } from "../utils/jsonParser.js";

/**
 * Fetches stock data and runs GPT-4o analysis on the financials
 */
export async function analyzeStockAgent(ticker, stockDataParam = null) {
  // Fetch real stock data first if not pre-fetched
  const stockData = stockDataParam || await fetchStockData(ticker);

  const historyText = stockData.history && stockData.history.length > 0
    ? stockData.history.map(h => `- ${h.date}: $${h.close?.toFixed(2)}`).join("\n")
    : "No historical data available.";

  const metricsText = `
Company: ${stockData.companyName} (${stockData.ticker})
Sector: ${stockData.sector || "N/A"} | Industry: ${stockData.industry || "N/A"}

PRICE & MARKET
- Current Price: $${stockData.currentPrice}
- Change: ${stockData.change > 0 ? "+" : ""}$${stockData.change?.toFixed(2)} (${stockData.changePercent?.toFixed(2)}%)
- Market Cap: $${stockData.marketCap ? (stockData.marketCap / 1e9).toFixed(2) + "B" : "N/A"}
- 52-Week Range: $${stockData.fiftyTwoWeekLow} - $${stockData.fiftyTwoWeekHigh}
- Volume: ${stockData.volume?.toLocaleString()} | Avg Vol: ${stockData.avgVolume?.toLocaleString()}

VALUATION
- Trailing P/E: ${stockData.peRatio || "N/A"}
- Forward P/E: ${stockData.forwardPE || "N/A"}
- EPS (TTM): $${stockData.eps || "N/A"}
- Dividend Yield: ${stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + "%" : "None"}
- Beta: ${stockData.beta || "N/A"}

FINANCIALS
- Revenue Growth (YoY): ${stockData.revenueGrowth != null ? (stockData.revenueGrowth * 100).toFixed(1) + "%" : "N/A"}
- Gross Margin: ${stockData.grossMargin != null ? (stockData.grossMargin * 100).toFixed(1) + "%" : "N/A"}
- Profit Margin: ${stockData.profitMargin != null ? (stockData.profitMargin * 100).toFixed(1) + "%" : "N/A"}
- ROE: ${stockData.returnOnEquity != null ? (stockData.returnOnEquity * 100).toFixed(1) + "%" : "N/A"}
- Debt/Equity: ${stockData.debtToEquity || "N/A"}
- Free Cash Flow: ${stockData.freeCashflow ? "$" + (stockData.freeCashflow / 1e9).toFixed(2) + "B" : "N/A"}
- Total Revenue: ${stockData.totalRevenue ? "$" + (stockData.totalRevenue / 1e9).toFixed(2) + "B" : "N/A"}

RECENT DAILY CLOSING PRICE HISTORY (LAST FEW TRADING DAYS):
${historyText}
`;

  const response = await createChatCompletion({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a senior equity analyst. Analyze the provided stock metrics and recent daily closing price history, and call the analyze_stock_metrics function with your structured assessment including recent performance trends and future projections.",
      },
      {
        role: "user",
        content: metricsText,
      },
    ],
    tools: [stockAnalysisToolDefinition],
    tool_choice: { type: "function", function: { name: "analyze_stock_metrics" } },
    temperature: 0.2,
  });

  let analysis;
  try {
    analysis = parseModelJSON(response, "analyze_stock_metrics");
  } catch (err) {
    console.error(`[AnalyzeStockAgent] Error parsing model response:`, err);
    console.error(`[AnalyzeStockAgent] Raw content:`, response?.choices?.[0]?.message?.content);
    console.error(`[AnalyzeStockAgent] Raw tool calls:`, JSON.stringify(response?.choices?.[0]?.message?.tool_calls || []));
    throw new Error(`Failed to parse stock analysis data: ${err.message}`);
  }

  // Sanitize valuationAssessment
  let valuation = analysis.valuationAssessment ? String(analysis.valuationAssessment).toLowerCase() : "fairly_valued";
  if (!["undervalued", "fairly_valued", "overvalued"].includes(valuation)) {
    valuation = "fairly_valued";
  }
  analysis.valuationAssessment = valuation;

  // Sanitize growthProfile
  let growth = analysis.growthProfile ? String(analysis.growthProfile).toLowerCase() : "moderate_growth";
  if (!["high_growth", "moderate_growth", "slow_growth", "declining"].includes(growth)) {
    growth = "moderate_growth";
  }
  analysis.growthProfile = growth;

  return { stockData, analysis };
}
