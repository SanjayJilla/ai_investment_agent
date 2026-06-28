export function getDecisionPrompt(companyName, ticker, stockData, researchData, riskData) {
  return `You are the Chief Investment Officer of a hedge fund. Based on comprehensive analysis, make a final binary investment decision for ${companyName} (${ticker}).

## Complete Analysis Summary

### Stock Fundamentals
- Current Price: $${stockData.currentPrice || "N/A"}
- Market Cap: ${stockData.marketCap ? `$${(stockData.marketCap / 1e9).toFixed(1)}B` : "N/A"}
- P/E Ratio: ${stockData.peRatio || "N/A"}
- Forward P/E: ${stockData.forwardPE || "N/A"}
- EPS: $${stockData.eps || "N/A"}
- Revenue Growth: ${stockData.revenueGrowth != null ? `${(stockData.revenueGrowth * 100).toFixed(1)}%` : "N/A"}
- Profit Margin: ${stockData.profitMargin != null ? `${(stockData.profitMargin * 100).toFixed(1)}%` : "N/A"}
- ROE: ${stockData.returnOnEquity != null ? `${(stockData.returnOnEquity * 100).toFixed(1)}%` : "N/A"}
- Debt/Equity: ${stockData.debtToEquity || "N/A"}
- Beta: ${stockData.beta || "N/A"}
- Dividend Yield: ${stockData.dividendYield ? `${(stockData.dividendYield * 100).toFixed(2)}%` : "None"}

### Research Intelligence
- Market Sentiment: ${researchData?.sentimentSummary || "Unknown"}
- Top Catalysts: ${researchData?.catalysts?.slice(0, 3).join("; ") || "None identified"}
- Top Headwinds: ${researchData?.headwinds?.slice(0, 3).join("; ") || "None identified"}
- Competitive Position: ${researchData?.competitivePosition || "Unknown"}
- Research Narrative: ${researchData?.researchSummary || "No summary available"}

### Risk Profile
- Overall Risk Level: ${riskData?.overallRiskLevel || "Unknown"}
- Risk Score: ${riskData?.riskScore || "N/A"}/10
- Key Risk Factors: ${riskData?.riskFactors?.map(r => `${r.category} (${r.severity})`).join(", ") || "None"}
- Mitigating Factors: ${riskData?.mitigatingFactors?.join("; ") || "None"}
- Risk Summary: ${riskData?.riskSummary || "No summary"}

## Decision Framework
Make a decisive INVEST or PASS decision. Consider:
- Risk-adjusted return potential
- Quality of the business (moat, management, margins)
- Valuation reasonableness
- Timing and market conditions
- Downside protection

Return a structured JSON object:
{
  "decision": "INVEST" or "PASS",
  "conviction": "low|medium|high|very_high",
  "targetHorizon": "short_term (< 1yr)|medium_term (1-3yr)|long_term (3yr+)",
  "keyReasons": ["string"] (exactly 5 specific, compelling reasons for the decision),
  "bullCase": "string (2-3 sentences describing the most optimistic scenario)",
  "bearCase": "string (2-3 sentences describing the key risks if wrong)",
  "summary": "string (3-4 sentence executive summary of the decision)",
  "priceTarget": number or null (estimated fair value if you can assess it),
  "confidenceScore": number (0-100, representing overall confidence in this decision)
}

Respond ONLY with the JSON object. Be decisive and specific — avoid hedging language.`;
}
