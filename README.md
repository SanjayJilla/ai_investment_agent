# InvestIQ — AI-Powered Investment Research Agent

A **multi-agent AI investment research platform** that takes any company name, runs it through a 5-stage agentic pipeline, and delivers a decisive **INVEST** or **PASS** verdict with full, detailed reasoning.

## Architecture

```
User Input (Company Name)
       ↓
[1] resolveTicker.agent    → Groq resolved name → stock ticker
       ↓
[2] analyzeStock.agent     → Yahoo Finance data + Groq financial analysis
       ↓
[3] research.agent         → Tavily web search + Groq synthesis
       ↓
[4] risk.agent             → Multi-dimensional risk scoring
       ↓
[5] decision.agent         → CIO-level INVEST / PASS verdict
       ↓
Dashboard UI (Next.js)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| AI Agents | Groq (LLaMA 3.3 70B / 3.1 70B / Mixtral) |
| Graph Orchestration | LangGraph JS |
| Web Research | Tavily Search API |
| Stock Data | Yahoo Finance (yahoo-finance2) |
| UI | React + Vanilla CSS |

## Setup & Run

### Step 1 — Clone / open the project

```bash
cd investmentagent
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Set up environment variables

Edit `.env.local` and add your API keys:

```env
GROQ_API_KEY=gsk_...your-groq-key...
TAVILY_API_KEY=tvly-...your-tavily-key...
```

**Get your keys:**
- **Groq:** https://console.groq.com/keys
- **Tavily (free tier):** https://app.tavily.com

### Step 4 — Start the development server

```bash
npm run dev
```

### Step 5 — Open in browser

Visit: **http://localhost:3000**

---

## Usage

1. Type a company name or ticker (e.g., `Apple`, `NVDA`, `Tesla`, `MSFT`)
2. Click **Analyze** or press Enter
3. Wait ~30–60 seconds for the pipeline to complete
4. View the full dashboard with:
   - 📊 Stock fundamentals (live from Yahoo Finance)
   - 🌐 Research intelligence (from web)
   - ⚠️ Risk assessment (5 risk categories)
   - ✅ / ❌ INVEST or PASS verdict with reasoning

## Dashboard Sections

### Stock Overview
Real-time price, market cap, P/E ratio, revenue growth, profit margins, ROE, debt/equity, free cash flow, 52-week range, and financial health score.

### Research Intelligence
Web-researched recent developments, catalysts, headwinds, competitive positioning, and sentiment — with links to source articles.

### Risk Assessment
Risk factors sorted by severity (critical → low), overall risk score out of 10, and mitigating factors.

### Decision Panel
- **INVEST** or **PASS** (binary)
- Conviction level (low → very high)
- Investment horizon (short/medium/long term)
- AI confidence score (0–100%)
- 5 specific key reasons
- Bull case and Bear case
- Estimated fair value / price target

---

## Project Structure

```
investmentagent/
├── app/
│   ├── api/analyze/route.js      ← POST API that runs the pipeline
│   ├── analyze/page.jsx           ← Dashboard results page
│   ├── globals.css                ← Design system
│   ├── layout.jsx                 ← Root layout
│   └── page.jsx                   ← Landing page
├── components/
│   ├── ui/                        ← Button, Input, Card, Loader
│   └── dashboard/                 ← SearchForm, StockOverview, etc.
├── lib/
│   ├── agents/                    ← 5 AI agents
│   ├── config/                    ← OpenAI, Tavily, Yahoo clients
│   ├── graph/                     ← LangGraph pipeline
│   ├── prompts/                   ← System prompts
│   ├── services/                  ← Data fetching services
│   ├── tools/                     ← Function calling tool definitions
│   └── utils/                     ← Formatters, validators
├── .env.local                     ← API keys (not committed)
└── package.json
```

---

> ⚠️ **Disclaimer:** This tool is for educational and research purposes only. It does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions.
