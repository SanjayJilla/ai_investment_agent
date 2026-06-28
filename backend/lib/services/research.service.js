import { getTavilyClient } from "../config/tavily.js";

/**
 * Search the web for recent news and analysis about a company
 */
export async function searchCompanyNews(companyName, ticker) {
  const client = getTavilyClient();

  const queries = [
    `${companyName} ${ticker} stock analysis 2024 2025`,
    `${companyName} latest earnings revenue growth`,
    `${companyName} risks challenges competitors`,
  ];

  const results = await Promise.all(
    queries.map((query) =>
      client.search(query, {
        searchDepth: "advanced",
        maxResults: 3,
        includeAnswer: true,
      })
    )
  );

  const combined = results.flatMap((r) => r.results || []);
  const answer = results.map((r) => r.answer).filter(Boolean).join("\n\n");

  // Deduplicate by URL
  const seen = new Set();
  const unique = combined.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return {
    answer,
    sources: unique.map((item) => ({
      title: item.title,
      url: item.url,
      content: item.content,
      score: item.score,
    })),
  };
}
