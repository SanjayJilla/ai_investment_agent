export function getRiskPrompt(companyName, ticker, stockData, researchData) {
  return `You are a quantitative risk analyst specializing in equity investments. Evaluate the full risk profile of ${companyName} (${ticker}) based on both quantitative metrics and qualitative research.

## Quantitative Risk Metrics
- Beta: ${stockData.beta || "N/A"} (market volatility relative to S&P 500)
- Debt-to-Equity: ${stockData.debtToEquity || "N/A"}
- Profit Margin: ${stockData.profitMargin != null ? `${(stockData.profitMargin * 100).toFixed(1)}%` : "N/A"}
- Free Cash Flow: ${stockData.freeCashflow ? `$${(stockData.freeCashflow / 1e9).toFixed(2)}B` : "N/A"}
- Revenue Growth: ${stockData.revenueGrowth != null ? `${(stockData.revenueGrowth * 100).toFixed(1)}%` : "N/A"}
- Return on Equity: ${stockData.returnOnEquity != null ? `${(stockData.returnOnEquity * 100).toFixed(1)}%` : "N/A"}
- 52-Week Range: $${stockData.fiftyTwoWeekLow || "N/A"} - $${stockData.fiftyTwoWeekHigh || "N/A"}

## Research Findings Summary
- Recent headwinds identified: ${researchData?.headwinds?.join("; ") || "None identified"}
- Market sentiment: ${researchData?.sentimentSummary || "Unknown"}
- Competitive position: ${researchData?.competitivePosition || "Not assessed"}

## Risk Evaluation Framework
Assess risks across these dimensions:
1. **Market Risk** — Volatility, beta, macro sensitivity
2. **Financial Risk** — Leverage, liquidity, cash flow sustainability
3. **Business Risk** — Competitive threats, product concentration, regulatory exposure
4. **Valuation Risk** — Premium/discount to peers, growth expectations priced in
5. **Geopolitical/Macro Risk** — Supply chain, currency, interest rate sensitivity

For each risk factor identified:
- Assign severity: "low", "medium", "high", or "critical"
- Provide a specific, concrete description

Return a structured JSON object with these fields:
{
  "riskFactors": [
    { "category": "string", "severity": "low|medium|high|critical", "description": "string" }
  ],
  "overallRiskLevel": "low|moderate|high|very_high",
  "riskScore": number (1-10, where 10 is highest risk),
  "mitigatingFactors": ["string"],
  "riskSummary": "string (2-3 sentences)"
}

Respond ONLY with the JSON object, no other text.`;
}
