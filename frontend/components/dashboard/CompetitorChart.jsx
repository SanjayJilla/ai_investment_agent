"use client";

import Link from "next/link";
import { formatCurrency, formatLargeNumber } from "../../../backend/lib/utils/formatter.js";

export default function CompetitorChart({ targetTicker, targetName, targetStockData, competitorsData }) {
  if (!competitorsData || competitorsData.length === 0) return null;

  // Combine target stock and competitors for full comparison
  const targetItem = {
    ticker: targetTicker,
    name: targetName,
    currentPrice: targetStockData?.currentPrice || null,
    marketCap: targetStockData?.marketCap || null,
    changePercent: targetStockData?.changePercent || null,
    isTarget: true,
  };

  const list = [targetItem, ...competitorsData.map(c => ({ ...c, isTarget: false }))];

  // Find max market cap for scaling bars
  const validCaps = list.map(item => item.marketCap).filter(val => val != null);
  const maxCap = validCaps.length > 0 ? Math.max(...validCaps) : 1;

  return (
    <div className="section" id="competitor-chart-section" style={{ margin: 0 }}>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div className="section-icon blue" style={{ color: "var(--accent-blue)" }}>🔄</div>
        <div>
          <div className="section-title">Competitor Comparison</div>
          <div className="section-sub">Market Cap & 1-day performance comparison</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {list.map((item) => {
          const capPercent = item.marketCap ? (item.marketCap / maxCap) * 100 : 0;
          const isUp = item.changePercent >= 0;
          const isTarget = item.isTarget;

          const rowContent = (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              width: "100%",
              padding: "12px",
              background: isTarget ? "rgba(37, 99, 235, 0.04)" : "#ffffff",
              border: isTarget ? "1.5px solid var(--accent-blue)" : "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              cursor: isTarget ? "default" : "pointer",
              transition: "transform var(--transition), box-shadow var(--transition)",
            }}
            className={isTarget ? "" : "competitor-row-hover"}
            >
              {/* Top row: name, ticker, price and change */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ 
                    fontFamily: "var(--font-mono)", 
                    fontWeight: 700, 
                    fontSize: 14, 
                    color: isTarget ? "var(--accent-blue)" : "var(--text-primary)" 
                  }}>
                    {item.ticker}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                    {item.name}
                  </span>
                  {isTarget && (
                    <span style={{ 
                      fontSize: 10, 
                      fontWeight: 600, 
                      padding: "2px 6px", 
                      background: "var(--accent-blue)", 
                      color: "#ffffff", 
                      borderRadius: "10px" 
                    }}>
                      Active
                    </span>
                  )}
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}>
                    {item.currentPrice ? formatCurrency(item.currentPrice) : "N/A"}
                  </span>
                  {item.changePercent != null && (
                    <span style={{ 
                      fontFamily: "var(--font-mono)", 
                      fontSize: 11, 
                      fontWeight: 700,
                      color: isUp ? "var(--accent-green)" : "var(--accent-red)"
                    }}>
                      {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{item.changePercent.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Bar row: Horizontal SVG Bar representing Market Cap */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                <div style={{ flex: 1, height: 12, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div style={{ 
                    width: `${Math.max(3, capPercent)}%`, 
                    height: "100%", 
                    background: isTarget ? "linear-gradient(90deg, var(--accent-blue), #60a5fa)" : "linear-gradient(90deg, #94a3b8, #cbd5e1)",
                    borderRadius: 6,
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)" 
                  }} />
                </div>
                <span style={{ 
                  fontFamily: "var(--font-mono)", 
                  fontSize: 11, 
                  fontWeight: 600, 
                  color: "var(--text-secondary)", 
                  minWidth: 70, 
                  textAlign: "right" 
                }}>
                  {item.marketCap ? formatLargeNumber(item.marketCap) : "N/A"}
                </span>
              </div>
            </div>
          );

          if (isTarget) {
            return <div key={item.ticker}>{rowContent}</div>;
          }

          return (
            <Link 
              key={item.ticker} 
              href={`/analyze?company=${encodeURIComponent(item.ticker)}`}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              {rowContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
