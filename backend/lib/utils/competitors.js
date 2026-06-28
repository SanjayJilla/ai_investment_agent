/**
 * Returns a list of top competitors for a given stock ticker
 */
export function getCompetitors(ticker) {
  const mapping = {
    AAPL: [
      { ticker: "MSFT", name: "Microsoft" },
      { ticker: "GOOGL", name: "Alphabet" },
      { ticker: "META", name: "Meta Platforms" },
      { ticker: "DELL", name: "Dell Technologies" }
    ],
    MSFT: [
      { ticker: "AAPL", name: "Apple" },
      { ticker: "GOOGL", name: "Alphabet" },
      { ticker: "ORCL", name: "Oracle" },
      { ticker: "AMZN", name: "Amazon" }
    ],
    TSLA: [
      { ticker: "TM", name: "Toyota Motor" },
      { ticker: "F", name: "Ford Motor" },
      { ticker: "GM", name: "General Motors" },
      { ticker: "RIVN", name: "Rivian Automotive" }
    ],
    NVDA: [
      { ticker: "AMD", name: "Advanced Micro Devices" },
      { ticker: "INTC", name: "Intel" },
      { ticker: "AVGO", name: "Broadcom" },
      { ticker: "QCOM", name: "Qualcomm" }
    ],
    AMZN: [
      { ticker: "WMT", name: "Walmart" },
      { ticker: "TGT", name: "Target" },
      { ticker: "BABA", name: "Alibaba" },
      { ticker: "EBAY", name: "eBay" }
    ],
    GOOGL: [
      { ticker: "MSFT", name: "Microsoft" },
      { ticker: "META", name: "Meta Platforms" },
      { ticker: "AMZN", name: "Amazon" },
      { ticker: "NFLX", name: "Netflix" }
    ]
  };

  const cleanTicker = ticker?.toUpperCase();
  return mapping[cleanTicker] || [
    { ticker: "AAPL", name: "Apple" },
    { ticker: "MSFT", name: "Microsoft" },
    { ticker: "NVDA", name: "NVIDIA" },
    { ticker: "AMZN", name: "Amazon" }
  ];
}
