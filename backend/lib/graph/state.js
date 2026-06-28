import { Annotation } from "@langchain/langgraph";

/**
 * LangGraph state schema for the investment analysis pipeline
 */
export const InvestmentState = Annotation.Root({
  // Input
  companyInput: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => "",
  }),

  // Phase 1: Ticker Resolution
  ticker: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),
  canonicalName: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),
  tickerConfidence: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),

  // Phase 2: Stock Data & Analysis
  stockData: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),
  stockAnalysis: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),

  // Phase 3: Research
  researchData: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),
  researchSources: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => [],
  }),

  // Phase 4: Risk
  riskData: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),

  // Phase 5: Decision
  decision: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),

  competitorsData: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => [],
  }),

  // Meta
  error: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),
  completedAt: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null,
  }),
});
