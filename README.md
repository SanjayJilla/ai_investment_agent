# InvestBuddy — AI-Powered Investment Research Agent

InvestBuddy is a **multi-agent AI investment research platform** that takes any company name, runs it through a 5-stage agentic workflow, and delivers a decisive **INVEST** or **PASS** decision with concrete reasons, risks, and competitor comparisons.

---

## 📖 Table of Contents
1. [Overview](#-overview)
2. [How to Run It](#-how-to-run-it)
3. [How It Works (Approach & Architecture)](#-how-it-works-approach--architecture)
4. [Key Decisions & Trade-offs](#-key-decisions--trade-offs)
5. [Example Runs](#-example-runs)
6. [What We Would Improve With More Time](#-what-we-would-improve-with-more-time)

---

## 🔍 Overview
InvestBuddy helps retail investors cut through the noise of financial markets. Instead of manually searching Yahoo Finance, reading news articles, and doing risk calculations, the user enters a company name (e.g., "Apple" or "Tesla"). The platform uses an orchestration of specialized AI agents to gather real-time data, evaluate risks, and provide a single clean dashboard with a definitive recommendation.

---

## 🚀 How to Run It

### 1. Clone the project
```bash
git clone https://github.com/SanjayJilla/ai_investment_agent.git
cd ai_investment_agent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a file named `.env.local` in the root of the project and add your API keys:
```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```
* Note: You can obtain a free Groq key from [Groq Console](https://console.groq.com/) and a free search key from [Tavily](https://tavily.com/).

### 4. Start the application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 🛠️ How It Works (Approach & Architecture)

InvestBuddy uses a **sequential multi-agent architecture** built with **LangGraph JS** and **Groq (Llama 3)**.

```
[User Input] 
    ➔ (1) Ticker Resolver Agent
    ➔ (2) Stock Analyzer Agent (calls Yahoo Finance Tool)
    ➔ (3) Web Researcher Agent (calls Tavily Search Tool)
    ➔ (4) Risk Assessor Agent
    ➔ (5) CIO Decision Agent (Outputs Verdict)
```

### The 5-Agent Pipeline:
1. **Ticker Resolver Agent**: Takes any input text (e.g. "Google") and resolves it to a standardized stock ticker (e.g. `GOOGL`).
2. **Stock Analyzer Agent**: Fetches and digests quantitative financial statistics (P/E ratio, Revenue Growth, Margins, Debt/Equity) via Yahoo Finance.
3. **Web Researcher Agent**: Runs search queries using the Tavily Search API to scan the latest market sentiment, catalyst news, and competitive developments.
4. **Risk Assessor Agent**: Evaluates risk categories (Market, Financial, Business, Valuation) and outputs a severity score out of 10.
5. **Decision Agent (CIO)**: Acts as the Chief Investment Officer. It reviews the financial metrics, risk scores, and web sentiment to issue a binary **INVEST** or **PASS** decision.

---

## ⚖️ Key Decisions & Trade-offs

### 1. LangGraph JS instead of Python LangGraph
* **Why**: By choosing the Javascript version of LangGraph, we built both the frontend (Next.js/React) and the backend agentic pipeline in a single unified Node.js codebase.
* **Trade-off**: Python has a larger data science library ecosystem, but a JS-only stack makes the project much easier to deploy, configure, and maintain under a single package.json.

### 2. Tavily Search API instead of Custom Scrapers
* **Why**: Tavily provides LLM-optimized search results, pre-parsed content, and filters out noise/advertisements.
* **Trade-off**: Custom scrapers (e.g. using Puppeteer/Playwright) are free, but they frequently break due to website structure changes and are much slower, causing high latency for the user.

### 3. Left Out Features
* **Real-time charts**: Decided to show raw statistics and key data points instead of interactive graphs to keep the initial load time low and keep the focus on AI analysis.
* **Multi-User authentication**: Omitted user accounts to make it easy for companies/reviewers to test the application instantly without registering.

---

## 📝 Example Runs

### Example 1: Apple Inc. (AAPL)
- **Verdict**: `INVEST`
- **Conviction**: `High`
- **Key Reason**: Strong balance sheet, massive cash reserves ($90B+ FCF), ecosystem lock-in, and emerging AI integration on local devices.
- **Risk Score**: `3/10` (Low-to-moderate valuation risk).

### Example 2: Tesla Inc. (TSLA)
- **Verdict**: `PASS`
- **Conviction**: `Medium`
- **Key Reason**: High valuation (P/E ratio > 50x) combined with slowing global EV growth and margins compression.
- **Risk Score**: `7/10` (High valuation and competition risk).

---

## 💡 What We Would Improve With More Time

1. **Memory & Chat**: Add conversational memory so users can chat directly with the dashboard (e.g., asking "Why is their debt/equity so high?").
2. **SEC Filing Search**: Integrate a tool to fetch and analyze official SEC 10-K and 10-Q reports directly from the Edgar database.
3. **Interactive Charts**: Implement TradingView widgets for visual historical analysis.
