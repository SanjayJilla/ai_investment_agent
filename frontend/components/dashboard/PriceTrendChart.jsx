"use client";

import { formatCurrency } from "../../../backend/lib/utils/formatter.js";

export default function PriceTrendChart({ history }) {
  if (!history || history.length === 0) return null;

  // Take the last 10 days of data
  const data = history.slice(-10);

  const prices = data.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // SVG dimensions
  const width = 500;
  const height = 150;
  const padding = { top: 20, right: 20, bottom: 25, left: 45 };

  // Helper to map index & price to SVG coordinates
  const getX = (index) => {
    const scaleWidth = width - padding.left - padding.right;
    return padding.left + (index / (data.length - 1)) * scaleWidth;
  };

  const getY = (price) => {
    const scaleHeight = height - padding.top - padding.bottom;
    if (priceRange === 0) return padding.top + scaleHeight / 2;
    // Invert Y so higher price is at top
    return padding.top + scaleHeight - ((price - minPrice) / priceRange) * scaleHeight;
  };

  // Generate path points
  const points = data.map((d, index) => ({
    x: getX(index),
    y: getY(d.close),
    price: d.close,
    date: d.date,
  }));

  // Build the path string for the line
  const linePath = points.reduce((path, pt, i) => {
    return path + `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`;
  }, "");

  // Build the path string for the gradient fill area
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`
    : "";

  return (
    <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px", marginTop: "16px" }}>
      <h4 style={{ color: "var(--text-primary)", marginBottom: "16px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-display)", fontWeight: 600 }}>
        📈 Daily Closing Price Trend (10-Day Chart)
      </h4>
      <div style={{ position: "relative", width: "100%", height: `${height}px` }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((pct, i) => {
            const yVal = minPrice + pct * priceRange;
            const y = getY(yVal);
            return (
              <g key={i}>
                <line 
                  x1={padding.left} 
                  y1={y} 
                  x2={width - padding.right} 
                  y2={y} 
                  stroke="#f1f5f9" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={padding.left - 8} 
                  y={y + 4} 
                  fill="var(--text-muted)" 
                  fontSize="9px" 
                  fontFamily="var(--font-mono)" 
                  textAnchor="end"
                >
                  {formatCurrency(yVal)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#trend-gradient)" />

          {/* Trend Line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="var(--accent-blue)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle 
                cx={pt.x} 
                cy={pt.y} 
                r="4" 
                fill="#ffffff" 
                stroke="var(--accent-blue)" 
                strokeWidth="2" 
                style={{ cursor: "pointer" }}
              />
              <title>{`${pt.date}: ${formatCurrency(pt.price)}`}</title>
            </g>
          ))}

          {/* X Axis Labels */}
          {points.filter((_, idx) => idx % 2 === 0).map((pt, i) => {
            const formattedDate = pt.date.slice(5); // Format: MM-DD
            return (
              <text 
                key={i} 
                x={pt.x} 
                y={height - 6} 
                fill="var(--text-muted)" 
                fontSize="9px" 
                fontFamily="var(--font-sans)" 
                textAnchor="middle"
              >
                {formattedDate}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
