# InvestIQ — AI-Powered Investment Research Agent

A **multi-agent AI investment research platform** that takes a company name, executes a 5-stage agentic workflow, and outputs a clear **INVEST** or **PASS** decision.

---

## 🚀 Quick Start

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```
2. **Add API keys** to `.env.local`:
   ```env
   GROQ_API_KEY=gsk_...
   TAVILY_API_KEY=tvly-...
   ```
3. **Start the application**:
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000** in your browser.

---

## 🛠️ Architecture & Tech Stack

The application employs a 5-agent pipeline orchestrated with **LangGraph JS** to execute sequential research:

```
[User Input] 
    ➔ (1) Resolve Ticker 
    ➔ (2) Analyze Stock (Yahoo Finance) 
    ➔ (3) Research Web (Tavily Search) 
    ➔ (4) Assess Risks 
    ➔ (5) CIO Decision (INVEST/PASS)
```

- **Frontend / Backend**: Next.js 14 (App Router), React, Vanilla CSS.
- **Agent Orchestration**: LangGraph JS.
- **LLM Provider**: Groq (Llama 3 family).
- **Data Integrations**: Yahoo Finance API (financial statistics), Tavily Search API (web research news).

---

> ⚠️ *Disclaimer: For educational and research purposes only. Not financial advice.*
