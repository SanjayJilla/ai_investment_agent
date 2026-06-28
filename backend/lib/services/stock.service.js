import { getQuote, getSummaryDetail, yahooFinance } from "../config/yahoo.js";

/**
 * Fetches comprehensive stock data for a given ticker
 */
export async function fetchStockData(ticker) {
  const today = new Date();
  const startDate = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 days ago to guarantee 10 calendar/trading days

  const fetchOptions = {
    fetchOptions: {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Connection": "close",
      },
    },
  };

  const [quote, summary, history] = await Promise.all([
    getQuote(ticker),
    getSummaryDetail(ticker),
    yahooFinance.historical(
      ticker,
      {
        period1: startDate.toISOString().split("T")[0],
        interval: "1d",
      },
      fetchOptions
    ).catch(() => []),
  ]);


  const financial = summary?.financialData || {};
  const keyStats = summary?.defaultKeyStatistics || {};
  const detail = summary?.summaryDetail || {};
  const profile = summary?.assetProfile || {};

  const historyData = history.map(h => ({
    date: h.date instanceof Date ? h.date.toISOString().split("T")[0] : String(h.date),
    close: h.close,
  }));

  return {
    ticker: quote.symbol,
    companyName: quote.longName || quote.shortName || ticker,
    currentPrice: quote.regularMarketPrice,
    previousClose: quote.regularMarketPreviousClose,
    change: quote.regularMarketChange,
    changePercent: quote.regularMarketChangePercent,
    marketCap: quote.marketCap,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
    volume: quote.regularMarketVolume,
    avgVolume: quote.averageDailyVolume3Month,
    peRatio: quote.trailingPE || detail.trailingPE,
    forwardPE: quote.forwardPE || detail.forwardPE,
    eps: quote.epsTrailingTwelveMonths,
    dividendYield: detail.dividendYield,
    beta: detail.beta || keyStats.beta,
    profitMargin: financial.profitMargins,
    revenueGrowth: financial.revenueGrowth,
    grossMargin: financial.grossMargins,
    debtToEquity: financial.debtToEquity,
    returnOnEquity: financial.returnOnEquity,
    freeCashflow: financial.freeCashflow,
    totalRevenue: financial.totalRevenue,
    industry: profile.industry,
    sector: profile.sector,
    description: profile.longBusinessSummary,
    employees: profile.fullTimeEmployees,
    country: profile.country,
    website: profile.website,
    history: historyData,
  };
}
