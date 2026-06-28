"use client";

import { formatCurrency, formatLargeNumber, formatPercent, formatRatio } from "../../../backend/lib/utils/formatter.js";
import PriceTrendChart from "./PriceTrendChart.jsx";

function MetricCard({ label, value, sub, className = "" }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${className}`}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

export default function StockOverview({ stockData, stockAnalysis }) {
  if (!stockData) return null;

  const changeUp = stockData.change >= 0;
  const changeClass = changeUp ? "up" : "down";
  const changeSign = changeUp ? "+" : "";

  const valuationMap = {
    undervalued: "📉 Undervalued",
    fairly_valued: "⚖️ Fairly Valued",
    overvalued: "📈 Overvalued",
  };

  const growthMap = {
    high_growth: "🚀 High Growth",
    moderate_growth: "📊 Moderate Growth",
    slow_growth: "🐢 Slow Growth",
    declining: "📉 Declining",
  };

  return (
    <div className="section" id="stock-overview-section">
      <div className="section-header">
        <div className="section-icon blue" style={{ color: "var(--accent-blue)" }}>📊</div>
        <div>
          <div className="section-title">Stock Overview</div>
          <div className="section-sub">Real-time fundamentals and AI analysis</div>
        </div>
      </div>

      {/* Valuation & Growth badges */}
      {stockAnalysis && (
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <span className={`valuation-badge ${stockAnalysis.valuationAssessment}`}>
            {valuationMap[stockAnalysis.valuationAssessment] || stockAnalysis.valuationAssessment}
          </span>
          <span className="sentiment-badge neutral" style={{ textTransform: "none", letterSpacing: 0, background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}>
            {growthMap[stockAnalysis.growthProfile] || stockAnalysis.growthProfile}
          </span>
        </div>
      )}

      {/* Financial health score */}
      {stockAnalysis?.financialHealthScore != null && (
        <div className="health-score" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div>
            <div className="health-score-label">Financial Health Score</div>
            <div className="health-score-num" style={{ color: "var(--accent-blue)" }}>{stockAnalysis.financialHealthScore}<span style={{ fontSize: 14, color: "var(--text-muted)" }}>/10</span></div>
          </div>
          <div className="health-score-bar" style={{ background: "#e2e8f0" }}>
            <div className="health-score-fill" style={{ width: `${stockAnalysis.financialHealthScore * 10}%`, background: "var(--accent-blue)" }} />
          </div>
        </div>
      )}

      {/* Grouped metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Group 1: Market & Size */}
        <div>
          <div className="sub-section-title" style={{ margin: "0 0 10px 0", fontSize: 11, fontWeight: 700 }}>Market & Valuation</div>
          <div className="metrics-grid">
            <MetricCard
              label="Current Price"
              value={formatCurrency(stockData.currentPrice)}
              sub={`${changeSign}${formatCurrency(stockData.change)} (${changeSign}${stockData.changePercent?.toFixed(2)}%)`}
              className={changeClass}
            />
            <MetricCard label="Market Cap" value={formatLargeNumber(stockData.marketCap)} />
            <MetricCard label="P/E Ratio" value={formatRatio(stockData.peRatio)} sub="Trailing" />
          </div>
        </div>

        {/* Group 2: Margins & Profitability */}
        <div>
          <div className="sub-section-title" style={{ margin: "0 0 10px 0", fontSize: 11, fontWeight: 700 }}>Growth & Profitability</div>
          <div className="metrics-grid">
            <MetricCard label="Revenue Growth" value={formatPercent(stockData.revenueGrowth)} className={stockData.revenueGrowth > 0 ? "positive" : "negative"} />
            <MetricCard label="Profit Margin" value={formatPercent(stockData.profitMargin)} className={stockData.profitMargin > 0 ? "positive" : "negative"} />
            <MetricCard label="Gross Margin" value={formatPercent(stockData.grossMargin)} />
            <MetricCard label="Return on Equity" value={formatPercent(stockData.returnOnEquity)} />
          </div>
        </div>

        {/* Group 3: Financial Strength */}
        <div>
          <div className="sub-section-title" style={{ margin: "0 0 10px 0", fontSize: 11, fontWeight: 700 }}>Financial Position</div>
          <div className="metrics-grid">
            <MetricCard label="EPS (TTM)" value={formatCurrency(stockData.eps)} />
            <MetricCard label="Debt / Equity" value={formatRatio(stockData.debtToEquity)} />
            <MetricCard label="Free Cash Flow" value={formatLargeNumber(stockData.freeCashflow)} />
            <MetricCard label="Beta" value={formatRatio(stockData.beta)} sub="vs S&P 500" />
          </div>
        </div>
      </div>

      {/* 52-week range */}
      <div style={{ marginTop: 24 }}>
        <div className="metric-label" style={{ marginBottom: 8 }}>52-Week Range</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent-red)", fontWeight: 600 }}>
            {formatCurrency(stockData.fiftyTwoWeekLow)}
          </span>
          <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, position: "relative" }}>
            {stockData.fiftyTwoWeekHigh && stockData.fiftyTwoWeekLow && stockData.currentPrice && (
              <div style={{
                position: "absolute",
                left: `${Math.min(100, Math.max(0, ((stockData.currentPrice - stockData.fiftyTwoWeekLow) / (stockData.fiftyTwoWeekHigh - stockData.fiftyTwoWeekLow)) * 100))}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "var(--accent-blue)",
                boxShadow: "0 0 6px rgba(37,99,235,0.4)",
              }} />
            )}
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent-green)", fontWeight: 600 }}>
            {formatCurrency(stockData.fiftyTwoWeekHigh)}
          </span>
        </div>
      </div>

      {/* Analyst summary */}
      {stockAnalysis?.analystSummary && (
        <>
          <div className="divider" />
          <div className="analysis-text" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid var(--accent-blue)" }}>
            {stockAnalysis.analystSummary}
          </div>
        </>
      )}

      {/* Key Strengths & Weaknesses (Positives & Negatives) */}
      {stockAnalysis && (stockAnalysis.keyStrengths?.length > 0 || stockAnalysis.keyWeaknesses?.length > 0) && (
        <>
          <div className="divider" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 16 }}>
            <div>
              <h4 style={{ color: "var(--accent-green)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 600 }}>
                <span>🟢</span> Key Strengths
              </h4>
              <ul style={{ paddingLeft: 20, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {stockAnalysis.keyStrengths.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color: "var(--accent-red)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 600 }}>
                <span>🔴</span> Key Risks
              </h4>
              <ul style={{ paddingLeft: 20, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {stockAnalysis.keyWeaknesses.map((w, i) => <li key={i} style={{ marginBottom: 4 }}>{w}</li>)}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Future Projections */}
      {stockAnalysis?.futureProjections && (
        <>
          <div className="divider" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <div style={{ background: "#fcfdfa", border: "1px solid #e6f4ea", borderRadius: "var(--radius-md)", padding: 16 }}>
              <h5 style={{ color: "var(--accent-green)", marginBottom: 8, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "var(--font-display)" }}>
                Short-Term Outlook (1-3mo)
              </h5>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {stockAnalysis.futureProjections.shortTerm.length > 180 ? `${stockAnalysis.futureProjections.shortTerm.slice(0, 180)}...` : stockAnalysis.futureProjections.shortTerm}
              </p>
            </div>
            <div style={{ background: "#fafaff", border: "1px solid #eef2ff", borderRadius: "var(--radius-md)", padding: 16 }}>
              <h5 style={{ color: "var(--accent-blue)", marginBottom: 8, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "var(--font-display)" }}>
                Long-Term Projections (12mo+)
              </h5>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {stockAnalysis.futureProjections.longTerm.length > 180 ? `${stockAnalysis.futureProjections.longTerm.slice(0, 180)}...` : stockAnalysis.futureProjections.longTerm}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Daily Closing Price Trend Chart */}
      {stockData.history && stockData.history.length > 0 && (
        <>
          <div className="divider" />
          <PriceTrendChart history={stockData.history} />
        </>
      )}
    </div>
  );
}

