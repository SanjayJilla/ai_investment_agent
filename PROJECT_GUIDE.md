# Project Architecture & Structure Guide (Interview-Ready)

This guide explains the project's folder structure, files, and core concepts in simple, beginner-friendly terms. Use this to prepare for interviews or to walk companies through your codebase.

---

## 🌟 The High-Level Metaphor: A Research Team
If you are explaining this project to an interviewer, use this analogy:
> *"Instead of having a single AI try to do everything, this application builds a **virtual investment research team** consisting of 5 specialized agents. Each agent has a specific job, and they pass their work to the next agent in a pipeline, ending with a final investment decision."*

---

## 📁 Folder Structure Explained Simply

Here is where everything lives:

```text
investmentagent/
├── app/                      # The Frontend Pages & Router (Next.js)
│   ├── api/analyze/          # The Backend API endpoint that triggers the AI agents
│   ├── analyze/              # The Stock Analysis Dashboard page
│   ├── layout.jsx            # The global container/wrapper for our website
│   └── page.jsx              # The Landing Page (where users enter a company name)
│
├── frontend/                 # Visual components shown to the user
│   └── components/
│       ├── dashboard/        # Custom dashboard widgets (StockOverview, RiskOverview, etc.)
│       └── ui/               # Reusable base elements (like the Loader)
│
├── backend/                  # The AI "brain" and data integrations
│   └── lib/
│       ├── agents/           # The 5 specialized AI agents (Python/JS files)
│       ├── graph/            # The pipeline manager (LangGraph) that links agents together
│       ├── tools/            # Tools that agents use to search the web or get stock prices
│       ├── prompts/          # System instructions given to each agent
│       ├── services/         # Code to call Yahoo Finance and Tavily Search
│       └── utils/            # Helper functions (like currency formatting)
```

---

## 🤖 The 5-Agent Pipeline (Backend)
Here is how the AI agents work together step-by-step:

1. **Ticker Resolver Agent** (`agents/resolveTicker.agent.js`):
   - **Job:** Takes a user's typed name (e.g., "Apple") and figures out its official stock ticker (e.g., "AAPL").
2. **Stock Analyzer Agent** (`agents/analyzeStock.agent.js`):
   - **Job:** Looks at fundamental financial metrics (P/E ratio, revenue growth, debt-to-equity) fetched from Yahoo Finance.
3. **Web Researcher Agent** (`agents/research.agent.js`):
   - **Job:** Uses Tavily Search to scan the web for recent news, product launches, or headwinds.
4. **Risk Assessor Agent** (`agents/risk.agent.js`):
   - **Job:** Analyzes vulnerabilities, market competition, and assigns a risk score.
5. **Decision Agent** (`agents/decision.agent.js`):
   - **Job:** Act like a Chief Investment Officer (CIO) to issue a final **INVEST** or **PASS** decision with conviction levels and target price.

---

## 🛠️ Key Technologies to Mention
When talking to companies, highlight these three technologies:
1. **Next.js (App Router):** Modern React framework used to build both the user interface and the API endpoints under a single project.
2. **LangGraph JS:** An orchestration framework used to define a structured, state-driven workflow for LLM agents, ensuring they execute in a specific order and pass data cleanly.
3. **Yahoo Finance & Tavily APIs:** Real-world integrations used to feed current financial data and fresh web search results to the LLMs, eliminating AI hallucinations.
