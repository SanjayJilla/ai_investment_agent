"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchForm from "../../frontend/components/dashboard/SearchForm.jsx";
import StockOverview from "../../frontend/components/dashboard/StockOverview.jsx";
import ResearchOverview from "../../frontend/components/dashboard/ResearchOverview.jsx";
import RiskOverview from "../../frontend/components/dashboard/RiskOverview.jsx";
import DecisionOverview from "../../frontend/components/dashboard/DecisionOverview.jsx";
import Loader from "../../frontend/components/ui/Loader.jsx";
import CompetitorChart from "../../frontend/components/dashboard/CompetitorChart.jsx";
import { formatCurrency } from "../../backend/lib/utils/formatter.js";
import { getCompetitors } from "../../backend/lib/utils/competitors.js";

function AnalyzePageContent() {
  const searchParams = useSearchParams();
  const company = searchParams.get("company") || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!company) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setData(null);

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Analysis failed.");
        }
        setData(json.data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [company]);

  const stockData = data?.stockData;
  const isUp = stockData?.change >= 0;

  return (
    <div className="analyze-page">
      {/* Sticky header */}
      <header className="analyze-header">
        <Link href="/" className="header-brand" id="header-brand-link">
          <div className="header-logo">IB</div>
          <span className="header-name">InvestBuddy</span>
        </Link>
        <SearchForm initialValue={company} />
      </header>

      {/* Loading state */}
      {loading && <Loader company={company} />}

      {/* Error state */}
      {!loading && error && (
        <div className="error-page" id="error-section">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Analysis Failed</div>
          <div className="error-msg">{error}</div>
          <button className="error-btn" onClick={() => { fetchedRef.current = ""; window.location.reload(); }}>
            Try Again
          </button>
          <Link href="/" style={{ textDecoration: "none" }}>
            <button className="error-btn">← Back to Home</button>
          </Link>
        </div>
      )}

      {/* Results */}
      {!loading && data && (
        <div className="analyze-content">
          {/* Ticker hero banner */}
          <div className="ticker-hero" id="ticker-hero">
            <div className="ticker-info">
              <div className="ticker-symbol">{data.ticker}</div>
              <div className="ticker-name-row">
                <div className="ticker-company">{data.canonicalName}</div>
                <div className="ticker-meta">
                  {stockData?.sector && `${stockData.sector}`}
                  {stockData?.industry && ` · ${stockData.industry}`}
                  {stockData?.country && ` · ${stockData.country}`}
                </div>
              </div>
            </div>

            <div className="ticker-price-block">
              <div className="ticker-price">{formatCurrency(stockData?.currentPrice)}</div>
              <div className={`ticker-change ${isUp ? "up" : "down"}`}>
                {isUp ? "▲" : "▼"} {formatCurrency(Math.abs(stockData?.change))} ({isUp ? "+" : ""}{stockData?.changePercent?.toFixed(2)}%)
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="analyze-grid">
            {/* Left column */}
            <div className="analyze-main">
              <StockOverview stockData={data.stockData} stockAnalysis={data.stockAnalysis} />
            </div>

            {/* Right sidebar */}
            <div className="analyze-sidebar">
              {/* Decision — sticky at top of sidebar */}
              <DecisionOverview decision={data.decision} ticker={data.ticker} />
            </div>
          </div>

          {/* Quick Stats & Competitors Row (Competitors displayed to the right of Quick Stats) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, margin: "24px 0" }} className="stats-competitors-row">
            
            {/* Quick Stats */}
            <div className="section" id="mini-stats-section" style={{ margin: 0, textAlign: "center" }}>
              <div className="section-header" style={{ marginBottom: 16, justifyContent: "center" }}>
                <div className="section-icon amber">💡</div>
                <div>
                  <div className="section-title">Quick Stats</div>
                </div>
              </div>
              <div className="mini-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                <div className="mini-stat">
                  <div className="mini-stat-label">Dividend Yield</div>
                  <div className="mini-stat-val">
                    {stockData?.dividendYield ? `${(stockData.dividendYield * 100).toFixed(2)}%` : "None"}
                  </div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-label">Volume</div>
                  <div className="mini-stat-val">
                    {stockData?.volume ? (stockData.volume / 1e6).toFixed(1) + "M" : "N/A"}
                  </div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-label">Total Revenue</div>
                  <div className="mini-stat-val">
                    {stockData?.totalRevenue ? (stockData.totalRevenue / 1e9).toFixed(1) + "B" : "N/A"}
                  </div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-label">Country</div>
                  <div className="mini-stat-val">
                    {stockData?.country || "N/A"}
                  </div>
                </div>
              </div>

              {stockData?.website && (
                <div style={{ marginTop: 16 }}>
                  <a
                    href={stockData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--accent-blue)",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: 14
                    }}
                    id="company-website-link"
                  >
                    Official Website: {stockData.website}
                  </a>
                </div>
              )}

              {/* Business description */}
              {stockData?.description && (
                <div style={{ textAlign: "left" }}>
                  <div className="divider" />
                  <div className="sub-section-title">About</div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
                    {stockData.description.slice(0, 300)}...
                  </p>
                </div>
              )}
            </div>

            {/* Compare Competitors */}
            <CompetitorChart 
              targetTicker={data.ticker} 
              targetName={data.canonicalName} 
              targetStockData={data.stockData} 
              competitorsData={data.competitorsData} 
            />
          </div>

          {/* Centered Risk Assessment */}
          <div style={{ margin: "24px 0" }} className="centered-risk-wrap">
            <RiskOverview riskData={data.riskData} />
          </div>

          {/* Research Intelligence (Web research synthesis) comes at the end, full width */}
          <ResearchOverview researchData={data.researchData} researchSources={data.researchSources} />

          {/* Disclaimer at the very end */}
          <div style={{
            marginTop: 24,
            padding: "16px 20px",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            fontSize: 12,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            textAlign: "center",
            maxWidth: "100%",
          }} className="disclaimer-section">
            ⚠️ <strong style={{ color: "var(--text-secondary)" }}>Disclaimer:</strong> This is AI-generated analysis for educational purposes only. Not financial advice. Always do your own research and consult a qualified financial advisor before investing.
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<Loader />}>
      <AnalyzePageContent />
    </Suspense>
  );
}
