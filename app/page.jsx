"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_COMPANIES = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "GOOGL"];

const FEATURES = [
  { icon: "📈", title: "Deep Equity Research", desc: "Instantly analyze valuation metrics, gross margins, growth profiles, and debt structure." },
  { icon: "🔄", title: "Competitor Analysis", desc: "Discover and compare top alternative companies in the same industry to optimize your portfolio." },
  { icon: "🛡️", title: "Risk Mitigation", desc: "Evaluate regulatory, financial, macro, and sector headwinds before committing capital." },
  { icon: "💡", title: "Strategic Decisioning", desc: "Clear BUY or PASS verdicts with concrete catalysts, target horizons, and fair value targets." }
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    router.push(`/analyze?company=${encodeURIComponent(q)}`);
  };

  const handleChipClick = (company) => {
    setQuery(company);
    setLoading(true);
    router.push(`/analyze?company=${encodeURIComponent(company)}`);
  };

  return (
    <div className="landing">
      <div className="landing-bg" />
      <div className="landing-grid" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">IB</div>
          <span className="navbar-name">InvestBuddy</span>
        </div>
        <span className="navbar-badge">Multi-Agent AI</span>
      </nav>

      {/* Hero */}
      <main className="hero">
        <h1 className="hero-headline">
          <span className="hero-headline-main">Research any stock.</span>
          <span className="hero-headline-accent">Invest or Pass.</span>
        </h1>

        <p className="hero-sub">
          A multi-agent AI pipeline that analyzes fundamentals, researches the web,
          evaluates risk, and delivers a decisive investment verdict — in seconds.
        </p>

        {/* Search */}
        <div className="hero-search">
          <form className="hero-search-inner" onSubmit={handleSubmit}>
            <span className="hero-search-icon">🔎</span>
            <input
              id="company-search-input"
              className="hero-search-input"
              type="text"
              placeholder="Enter company name or ticker (e.g. Apple, NVDA)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button
              id="analyze-btn"
              className="hero-search-btn"
              type="submit"
              disabled={loading || !query.trim()}
            >
              {loading ? "Analyzing..." : "Analyze →"}
            </button>
          </form>
        </div>

        {/* Quick chips */}
        <div className="hero-chips">
          <span className="hero-chips-label">Try:</span>
          {EXAMPLE_COMPANIES.map((c) => (
            <button
              key={c}
              id={`chip-${c.toLowerCase()}`}
              className="chip"
              onClick={() => handleChipClick(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </main>

      {/* Feature grid */}
      <div className="features">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
