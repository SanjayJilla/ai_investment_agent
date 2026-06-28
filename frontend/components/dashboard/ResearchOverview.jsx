"use client";

const SENTIMENT_LABELS = {
  very_bullish: "🚀 Very Bullish",
  bullish: "📈 Bullish",
  neutral: "➡️ Neutral",
  bearish: "📉 Bearish",
  very_bearish: "🔻 Very Bearish",
};

export default function ResearchOverview({ researchData, researchSources }) {
  if (!researchData) return null;

  return (
    <div className="section" id="research-overview-section">
      <div className="section-header">
        <div className="section-icon green">🌐</div>
        <div>
          <div className="section-title">Research Intelligence</div>
          <div className="section-sub">Web research synthesis via Tavily AI</div>
        </div>
      </div>

      {/* Sentiment + competitive position */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <span className={`sentiment-badge ${researchData.sentimentSummary}`}>
          {SENTIMENT_LABELS[researchData.sentimentSummary] || researchData.sentimentSummary}
        </span>
        {researchData.competitivePosition && (
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {researchData.competitivePosition}
          </span>
        )}
      </div>

      {/* Research narrative */}
      {researchData.researchSummary && (
        <div className="analysis-text" style={{ marginBottom: 20 }}>
          {researchData.researchSummary}
        </div>
      )}

      {/* Recent developments */}
      {researchData.recentDevelopments?.length > 0 && (
        <>
          <div className="sub-section-title">Recent Developments</div>
          <div className="badge-list" style={{ marginBottom: 16 }}>
            {researchData.recentDevelopments.map((dev, i) => (
              <div key={i} className="badge-item" id={`dev-item-${i}`}>
                <span className="badge-dot blue" />
                <span>{dev}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="research-insights-grid">
        {/* Catalysts */}
        {researchData.catalysts?.length > 0 && (
          <div>
            <div className="sub-section-title">📈 Catalysts</div>
            <div className="badge-list">
              {researchData.catalysts.map((c, i) => (
                <div key={i} className="badge-item" id={`catalyst-${i}`}>
                  <span className="badge-dot green" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Headwinds */}
        {researchData.headwinds?.length > 0 && (
          <div>
            <div className="sub-section-title">📉 Headwinds</div>
            <div className="badge-list">
              {researchData.headwinds.map((h, i) => (
                <div key={i} className="badge-item" id={`headwind-${i}`}>
                  <span className="badge-dot red" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sources */}
      {researchSources?.length > 0 && (
        <>
          <div className="divider" />
          <div className="sub-section-title" style={{ marginBottom: 12 }}>Sources</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {researchSources.slice(0, 5).map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all var(--transition)"
                }}
                className="source-pill"
                id={`source-${i}`}
              >
                <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--accent-blue)" }}>
                  {src.title || new URL(src.url).hostname}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
