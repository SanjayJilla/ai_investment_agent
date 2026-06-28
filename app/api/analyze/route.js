import { NextResponse } from "next/server";
import { buildInvestmentGraph } from "../../../backend/lib/graph/investment.graph.js";
import { validateCompanyInput } from "../../../backend/lib/utils/validators.js";
import { getCompetitors } from "../../../backend/lib/utils/competitors.js";
import { getQuote } from "../../../backend/lib/config/yahoo.js";

export const runtime = "nodejs";
export const maxDuration = 120; // 2 minutes

export async function POST(request) {
  try {
    const body = await request.json();
    const { company } = body;

    // Validate input
    const validation = validateCompanyInput(company);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Build and run the investment analysis graph
    const graph = buildInvestmentGraph();

    const result = await graph.invoke({
      companyInput: validation.value,
    });

    // Check for pipeline errors
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Return the complete analysis
    return NextResponse.json({
      success: true,
      data: {
        ticker: result.ticker,
        canonicalName: result.canonicalName,
        tickerConfidence: result.tickerConfidence,
        stockData: result.stockData,
        stockAnalysis: result.stockAnalysis,
        researchData: result.researchData,
        researchSources: result.researchSources,
        riskData: result.riskData,
        decision: result.decision,
        completedAt: result.completedAt,
        competitorsData: result.competitorsData || [],
      },
    });
  } catch (error) {
    console.error("[/api/analyze] Error:", error);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred during analysis.",
      },
      { status: 500 }
    );
  }
}
