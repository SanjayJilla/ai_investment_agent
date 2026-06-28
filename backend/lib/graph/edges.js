/**
 * Edge conditions for the optimized linear investment analysis graph
 */

/**
 * After ticker resolution — check if we got a valid ticker before proceeding
 */
export function afterTickerResolution(state) {
  if (state.error || !state.ticker) {
    return "error_node";
  }
  return "analyze_and_research";
}

/**
 * After concurrent analysis & research
 */
export function afterAnalyzeAndResearch(state) {
  if (state.error) {
    return "error_node";
  }
  return "risk";
}

/**
 * After risk evaluation — always proceed to decision
 */
export function afterRisk(state) {
  if (state.error) {
    return "error_node";
  }
  return "make_decision";
}
