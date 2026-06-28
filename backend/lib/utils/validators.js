/**
 * Validate that a company name input is non-empty and reasonable
 */
export function validateCompanyInput(input) {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Company name is required." };
  }
  const trimmed = input.trim();
  if (trimmed.length < 1) {
    return { valid: false, error: "Company name cannot be empty." };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Company name is too long (max 100 characters)." };
  }
  return { valid: true, value: trimmed };
}

/**
 * Validate a ticker symbol format
 */
export function validateTicker(ticker) {
  if (!ticker || typeof ticker !== "string") {
    return { valid: false, error: "Ticker is required." };
  }
  const cleaned = ticker.trim().toUpperCase();
  if (!/^[A-Z]{1,5}(\.[A-Z]{1,2})?$/.test(cleaned)) {
    return { valid: false, error: `Invalid ticker format: ${ticker}` };
  }
  return { valid: true, value: cleaned };
}
