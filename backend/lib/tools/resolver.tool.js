export const resolverToolDefinition = {
  type: "function",
  function: {
    name: "resolve_ticker",
    description:
      "Resolves a company name to its stock market ticker symbol. Returns the ticker and the canonical company name.",
    parameters: {
      type: "object",
      properties: {
        ticker: {
          type: "string",
          description:
            "The stock ticker symbol (e.g., AAPL, MSFT, GOOGL, TSLA). Use the primary exchange listing (NYSE or NASDAQ).",
        },
        canonicalName: {
          type: "string",
          description:
            "The official full company name (e.g., Apple Inc., Microsoft Corporation).",
        },
        confidence: {
          type: "string",
          description: "Confidence level of the resolution. Must be one of: high, medium, low.",
        },
      },
      required: ["ticker", "canonicalName", "confidence"],
    },
  },
};
