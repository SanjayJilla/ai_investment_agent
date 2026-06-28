"use client";

import { formatCurrency } from "../../../backend/lib/utils/formatter.js";

const CONVICTION_LABELS = {
  very_high: "Very High Conviction",
  high: "High Conviction",
  medium: "Medium Conviction",
  low: "Low Conviction",
};

const HORIZON_LABELS = {
  "short_term (< 1yr)": "Short Term < 1yr",
  "medium_term (1-3yr)": "Medium Term 1–3yr",
  "long_term (3yr+)": "Long Term 3yr+",
};

export default function DecisionOverview({ decision, ticker }) {
  if (!decision) return null;

  const isInvest = decision.decision === "INVEST";
  const cls = isInvest ? "invest" : "pass";
  const confidence = decision.confidenceScore ?? 0;

  return (
    <div id="decision-overview-section">
      {/* Main verdict card */}
      <div className={`decision-card ${cls}`}>
        {/* Verdict */}
        <div className="decision-verdict">
          <span className={`verdict-label ${cls}`}>{decision.decision}</span>
          <span className="verdict-icon">{isInvest ? "✅" : "❌"}</span>
        </div>

        {/* Conviction */}
        <div className="decision-conviction">
          {CONVICTION_LABELS[decision.conviction] || decision.conviction} · {HORIZON_LABELS[decision.targetHorizon] || decision.targetHorizon}
        </div>

        {/* Confidence Circle Gauge */}
        <div className="confidence-circle-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0" }}>
          <div style={{ position: "relative", width: "120px", height: "120px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="rgba(0, 0, 0, 0.05)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke={isInvest ? "#047857" : "#b91c1c"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="302"
                strokeDashoffset={302 - (confidence / 100) * 302}
                style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
              />
            </svg>
            {/* Center label inside circle */}
            <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "24px", fontWeight: 800, color: isInvest ? "#047857" : "#b91c1c", fontFamily: "var(--font-mono)", lineHeight: 1 }}>
                {confidence}%
              </span>
              <span style={{ fontSize: "8px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginTop: "4px", textTransform: "uppercase" }}>
                AI Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        {decision.summary && (
          <div className="decision-summary">{decision.summary}</div>
        )}

        {/* Key reasons */}
        {decision.keyReasons?.length > 0 && (
          <>
            <div className="sub-section-title" style={{ textAlign: "left" }}>
              Key Reasons
            </div>
            <div className="reasons-list">
              {decision.keyReasons.slice(0, 3).map((r, i) => (
                <div key={i} className="reason-item" id={`reason-${i}`}>
                  <span className="reason-num">{i + 1}</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Price target */}
        {decision.priceTarget && (
          <div style={{
            marginTop: 20,
            padding: "12px 16px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Est. Fair Value
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, color: isInvest ? "var(--accent-green)" : "var(--accent-red)" }}>
              {formatCurrency(decision.priceTarget)}
            </span>
          </div>
        )}

        {/* Bull / Bear cases */}
        {(decision.bullCase || decision.bearCase) && (
          <div className="cases-grid">
            {decision.bullCase && (
              <div className="case-card bull">
                <div className="case-title">Bull Case</div>
                <div className="case-text">
                  {decision.bullCase.length > 180 ? `${decision.bullCase.slice(0, 180)}...` : decision.bullCase}
                </div>
              </div>
            )}
            {decision.bearCase && (
              <div className="case-card bear">
                <div className="case-title">Bear Case</div>
                <div className="case-text">
                  {decision.bearCase.length > 180 ? `${decision.bearCase.slice(0, 180)}...` : decision.bearCase}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
