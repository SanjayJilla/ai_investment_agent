export const researchToolDefinition = {
  type: "function",
  function: {
    name: "summarize_research",
    description:
      "Summarizes web research findings into structured investment-relevant insights about a company.",
    parameters: {
      type: "object",
      properties: {
        recentDevelopments: {
          type: "array",
          items: { type: "string" },
          description:
            "List of recent significant developments, news, or events affecting the company.",
        },
        competitivePosition: {
          type: "string",
          description:
            "Assessment of the company's position relative to competitors and market share.",
        },
        catalysts: {
          type: "array",
          items: { type: "string" },
          description: "Potential positive catalysts or growth drivers identified from research.",
        },
        headwinds: {
          type: "array",
          items: { type: "string" },
          description: "Headwinds, challenges, or threats identified from research.",
        },
        sentimentSummary: {
          type: "string",
          description: "Overall market and analyst sentiment based on recent research. Must be one of: very_bullish, bullish, neutral, bearish, very_bearish.",
        },
        researchSummary: {
          type: "string",
          description:
            "A comprehensive 3-4 sentence narrative summarizing the research findings.",
        },
      },
      required: [
        "recentDevelopments",
        "competitivePosition",
        "catalysts",
        "headwinds",
        "sentimentSummary",
        "researchSummary",
      ],
    },
  },
};
