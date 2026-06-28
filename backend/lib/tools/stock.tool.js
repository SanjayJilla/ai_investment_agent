export const stockAnalysisToolDefinition = {
  type: "function",
  function: {
    name: "analyze_stock_metrics",
    description:
      "Analyzes stock metrics and produces a structured assessment of the company's financial health, valuation, and growth profile.",
    parameters: {
      type: "object",
      properties: {
        valuationAssessment: {
          type: "string",
          description: "Overall valuation assessment based on PE, forward PE, and growth. Must be one of: undervalued, fairly_valued, overvalued.",
        },
        financialHealthScore: {
          type: "number",
          description: "Financial health score from 1 (very poor) to 10 (excellent).",
        },
        growthProfile: {
          type: "string",
          description: "Revenue and earnings growth profile. Must be one of: high_growth, moderate_growth, slow_growth, declining.",
        },
        keyStrengths: {
          type: "array",
          items: { type: "string" },
          description: "List of key financial strengths derived from the metrics.",
        },
        keyWeaknesses: {
          type: "array",
          items: { type: "string" },
          description: "List of key financial weaknesses or concerns from the metrics.",
        },
        analystSummary: {
          type: "string",
          description: "A concise 2-3 sentence summary of the stock's financial position.",
        },
        recentPerformance: {
          type: "string",
          description: "A summary analysis of how the stock has performed over the last few trading days based on the provided daily closing price history.",
        },
        futureProjections: {
          type: "object",
          properties: {
            shortTerm: {
              type: "string",
              description: "Short-term estimation and expected trend (1-3 months).",
            },
            longTerm: {
              type: "string",
              description: "Long-term outlook, projections, and key drivers (12+ months).",
            },
          },
          required: ["shortTerm", "longTerm"],
          description: "Future estimations and projections for the stock.",
        },
      },
      required: [
        "valuationAssessment",
        "financialHealthScore",
        "growthProfile",
        "keyStrengths",
        "keyWeaknesses",
        "analystSummary",
        "recentPerformance",
        "futureProjections",
      ],
    },
  },
};
