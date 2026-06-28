"use client";

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export default function RiskOverview({ riskData }) {
  if (!riskData) return null;

  const sorted = [...(riskData.riskFactors || [])].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4)
  );

  const riskLevel = riskData.overallRiskLevel || "moderate";
  const riskScore = riskData.riskScore || 5;

  return (
    <div className="section" id="risk-overview-section">
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div className="section-icon red">⚠️</div>
        <div>
          <div className="section-title">Risk Assessment</div>
          <div className="section-sub">Multi-dimensional risk evaluation</div>
        </div>
      </div>

      {/* Two-column layout grid */}
      <div className="risk-grid-container" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "32px",
        alignItems: "start"
      }}>
        {/* Left Column: Risk Score & Mitigating Factors */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="risk-score-wrap" style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            textAlign: "center", 
            justifyContent: "center",
            padding: "28px 24px",
            background: "rgba(15, 23, 42, 0.01)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
          }}>
            {/* Premium SVG Risk Gauge with Needle */}
            <div style={{ position: "relative", width: "200px", height: "120px", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
              <svg width="200" height="120" viewBox="0 0 200 120" style={{ overflow: "visible" }}>
                <defs>
                  {/* Gauge color gradient from Green -> Yellow -> Red */}
                  <linearGradient id="risk-gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  {/* Drop shadow for the needle cap */}
                  <filter id="needle-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Outer Track Arc */}
                <path
                  d="M 25,100 A 65,65 0 0,1 175,100"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                
                {/* Colored Gradient Arc */}
                <path
                  d="M 25,100 A 65,65 0 0,1 175,100"
                  fill="none"
                  stroke="url(#risk-gauge-grad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Rotating Needle */}
                <g style={{
                  transform: `rotate(${-90 + (riskScore / 10) * 180}deg)`,
                  transformOrigin: "100px 100px",
                  transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}>
                  {/* Needle Pointer */}
                  <polygon
                    points="97,100 100,25 103,100"
                    fill="#1e293b"
                  />
                  {/* Needle Base Pin */}
                  <circle
                    cx="100"
                    cy="100"
                    r="8"
                    fill="#1e293b"
                    filter="url(#needle-shadow)"
                  />
                </g>
              </svg>

              {/* Float Numeric Value */}
              <div style={{
                position: "absolute",
                bottom: "-6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)", lineHeight: 1 }}>
                  {riskScore.toFixed(1)}
                </span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em", marginTop: "2px", textTransform: "uppercase" }}>
                  Risk Score
                </span>
              </div>
            </div>

            <div className="risk-score-info" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "18px" }}>
              <span className={`risk-level-badge ${riskLevel}`} style={{ textTransform: "uppercase", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: "12px", border: "1px solid" }}>
                {riskLevel.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Mitigating factors */}
          {riskData.mitigatingFactors?.length > 0 && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "flex-start",
              padding: "20px",
              background: "rgba(22, 163, 74, 0.02)",
              border: "1px dashed rgba(22, 163, 74, 0.15)",
              borderRadius: "var(--radius-lg)"
            }}>
              <div className="sub-section-title" style={{ fontSize: 12, fontWeight: 700, margin: "0 0 12px 0", color: "var(--accent-green)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                🛡️ Mitigating Factors
              </div>
              <div className="badge-list" style={{ justifyContent: "flex-start", display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                {riskData.mitigatingFactors.map((m, i) => (
                  <div key={i} className="badge-item" id={`mitigator-${i}`} style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: "var(--radius-sm)", width: "100%" }}>
                    <span className="badge-dot green" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)" }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Risk Factors List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {sorted.length > 0 && (
            <>
              <div className="sub-section-title" style={{ fontSize: 12, fontWeight: 700, margin: "0 0 4px 0", color: "var(--accent-red)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ⚠️ Identified Risk Factors
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {sorted.map((rf, i) => (
                  <div key={i} className="risk-item" id={`risk-factor-${i}`} style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    gap: 8, 
                    width: "100%", 
                    padding: 14, 
                    background: "#ffffff", 
                    border: "1px solid var(--border)", 
                    borderRadius: "var(--radius-md)" 
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className={`risk-severity ${rf.severity}`} style={{ 
                        textTransform: "uppercase", 
                        fontSize: 9, 
                        fontWeight: 700, 
                        padding: "2px 8px", 
                        borderRadius: 4 
                      }}>
                        {rf.severity}
                      </span>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{rf.category}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {rf.description}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Risk summary at the bottom */}
      {riskData.riskSummary && (
        <div style={{ marginTop: 24 }}>
          <div className="divider" style={{ margin: "16px 0" }} />
          <div className="analysis-text" style={{ 
            borderLeft: "4px solid var(--accent-red)", 
            textAlign: "left", 
            background: "rgba(220, 38, 38, 0.01)",
            padding: "16px 20px",
            borderRadius: "0 var(--radius-md) var(--radius-md) 0",
            fontSize: 13,
            lineHeight: 1.6,
            color: "var(--text-secondary)"
          }}>
            <strong>Summary:</strong> {riskData.riskSummary}
          </div>
        </div>
      )}
    </div>
  );
}
