/**
 * Format a number as USD currency
 */
export function formatCurrency(value, decimals = 2) {
  if (value == null || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format large numbers into human-readable form (1.2B, 500M, etc.)
 */
export function formatLargeNumber(value) {
  if (value == null || isNaN(value)) return "N/A";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

/**
 * Format a percentage value
 */
export function formatPercent(value, decimals = 2) {
  if (value == null || isNaN(value)) return "N/A";
  const pct = typeof value === "number" && value < 1 && value > -1 ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Format a ratio to fixed decimals
 */
export function formatRatio(value, decimals = 2) {
  if (value == null || isNaN(value)) return "N/A";
  return value.toFixed(decimals);
}

/**
 * Truncate text to a max length
 */
export function truncate(text, maxLength = 200) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
