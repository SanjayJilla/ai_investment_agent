import yahooFinance from "yahoo-finance2";

export { yahooFinance };

const fetchOptions = {
  fetchOptions: {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Connection": "close",
    },
  },
};

export async function getQuote(ticker) {
  try {
    const result = await yahooFinance.quote(ticker, {}, fetchOptions);
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch quote for ${ticker}: ${error.message}`);
  }
}

export async function getSummaryDetail(ticker) {
  try {
    const result = await yahooFinance.quoteSummary(
      ticker,
      {
        modules: ["summaryDetail", "financialData", "defaultKeyStatistics", "assetProfile"],
      },
      fetchOptions
    );
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch summary for ${ticker}: ${error.message}`);
  }
}


