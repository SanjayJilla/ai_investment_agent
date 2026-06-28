import { StateGraph, END } from "@langchain/langgraph";
import { InvestmentState } from "./state.js";
import {
  afterTickerResolution,
  afterAnalyzeAndResearch,
  afterRisk,
} from "./edges.js";
import { resolveTickerAgent } from "../agents/resolveTicker.agent.js";
import { analyzeStockAgent } from "../agents/analyzeStock.agent.js";
import { researchAgent } from "../agents/research.agent.js";
import { riskAgent } from "../agents/risk.agent.js";
import { decisionAgent } from "../agents/decision.agent.js";
import { fetchStockData } from "../services/stock.service.js";
import { yahooFinance, getQuote } from "../config/yahoo.js";
import { getCompetitors } from "../utils/competitors.js";

// ─── Node Definitions ───────────────────────────────────────────────────────

async function resolveTickerNode(state) {
  try {
    const result = await resolveTickerAgent(state.companyInput);
    let ticker = result.ticker;
    let canonicalName = result.canonicalName;
    let stockData;
    let competitorsData = [];
    
    try {
      // Fetch stock data and competitor quotes in parallel
      const [fetchedStock, fetchedComps] = await Promise.all([
        fetchStockData(ticker),
        (async () => {
          try {
            const comps = getCompetitors(ticker);
            return await Promise.all(
              comps.map(async (c) => {
                try {
                  const q = await getQuote(c.ticker);
                  return {
                    ticker: c.ticker,
                    name: c.name,
                    currentPrice: q.regularMarketPrice || null,
                    marketCap: q.marketCap || null,
                    changePercent: q.regularMarketChangePercent || null,
                  };
                } catch (e) {
                  return {
                    ticker: c.ticker,
                    name: c.name,
                    currentPrice: null,
                    marketCap: null,
                    changePercent: null,
                  };
                }
              })
            );
          } catch (e) {
            return [];
          }
        })()
      ]);
      
      stockData = fetchedStock;
      competitorsData = fetchedComps;
    } catch (err) {
      console.warn(`[resolveTickerNode] Failed to fetch stock data for resolved ticker "${ticker}". Searching for fallback tickers...`);
      const fetchOptions = {
        fetchOptions: {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Connection": "close",
          },
        },
      };
      const searchRes = await yahooFinance.search(canonicalName || state.companyInput, {}, fetchOptions).catch(() => null);
      const firstQuote = searchRes?.quotes?.find(q => q.isYahooFinance || q.symbol);
      if (firstQuote?.symbol && firstQuote.symbol !== ticker) {
        console.log(`[resolveTickerNode] Found fallback symbol: ${firstQuote.symbol}`);
        ticker = firstQuote.symbol;
        canonicalName = firstQuote.shortname || firstQuote.longname || canonicalName;
        
        // Retry fetch in parallel for fallback
        const [fetchedStock, fetchedComps] = await Promise.all([
          fetchStockData(ticker),
          (async () => {
            try {
              const comps = getCompetitors(ticker);
              return await Promise.all(
                comps.map(async (c) => {
                  try {
                    const q = await getQuote(c.ticker);
                    return {
                      ticker: c.ticker,
                      name: c.name,
                      currentPrice: q.regularMarketPrice || null,
                      marketCap: q.marketCap || null,
                      changePercent: q.regularMarketChangePercent || null,
                    };
                  } catch (e) {
                    return {
                      ticker: c.ticker,
                      name: c.name,
                      currentPrice: null,
                      marketCap: null,
                      changePercent: null,
                    };
                  }
                })
              );
            } catch (e) {
              return [];
            }
          })()
        ]);
        stockData = fetchedStock;
        competitorsData = fetchedComps;
      } else {
        throw err; // rethrow if no fallback found
      }
    }

    return {
      ticker: ticker,
      canonicalName: canonicalName,
      tickerConfidence: result.confidence,
      stockData: stockData,
      competitorsData: competitorsData,
    };
  } catch (err) {
    return { error: `Ticker resolution failed: ${err.message}` };
  }
}

async function analyzeAndResearchNode(state) {
  try {
    // Run stock analysis and web research concurrently
    const [analysisResult, researchResult] = await Promise.all([
      analyzeStockAgent(state.ticker, state.stockData),
      researchAgent(state.canonicalName, state.ticker, state.stockData)
    ]);
    return {
      stockAnalysis: analysisResult.analysis,
      researchData: researchResult.researchData,
      researchSources: researchResult.sources
    };
  } catch (err) {
    return { error: `Analysis/Research failed: ${err.message}` };
  }
}

async function riskNode(state) {
  try {
    const riskData = await riskAgent(
      state.canonicalName,
      state.ticker,
      state.stockData,
      state.researchData
    );
    return { riskData };
  } catch (err) {
    return { error: `Risk analysis failed: ${err.message}` };
  }
}

async function decisionNode(state) {
  try {
    const decision = await decisionAgent(
      state.canonicalName,
      state.ticker,
      state.stockData,
      state.researchData,
      state.riskData
    );
    return { decision, completedAt: new Date().toISOString() };
  } catch (err) {
    return { error: `Decision failed: ${err.message}` };
  }
}

async function errorNode(state) {
  return { completedAt: new Date().toISOString() };
}

// ─── Graph Assembly ──────────────────────────────────────────────────────────

export function buildInvestmentGraph() {
  const graph = new StateGraph(InvestmentState)
    .addNode("resolve_ticker", resolveTickerNode)
    .addNode("analyze_and_research", analyzeAndResearchNode)
    .addNode("risk", riskNode)
    .addNode("make_decision", decisionNode)
    .addNode("error_node", errorNode)

    .addEdge("__start__", "resolve_ticker")
    .addConditionalEdges("resolve_ticker", afterTickerResolution, {
      analyze_and_research: "analyze_and_research",
      error_node: "error_node",
    })
    .addConditionalEdges("analyze_and_research", afterAnalyzeAndResearch, {
      risk: "risk",
      error_node: "error_node",
    })
    .addConditionalEdges("risk", afterRisk, {
      make_decision: "make_decision",
      error_node: "error_node",
    })
    .addEdge("make_decision", END)
    .addEdge("error_node", END);

  return graph.compile();
}
