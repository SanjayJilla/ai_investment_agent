"use client";

export default function Loader() {
  return (
    <div style={{
      width: "100%",
      padding: "24px 0",
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>
      {/* Main visual trading chart loader container */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 160px)",
        minHeight: "450px",
        background: "radial-gradient(circle at center, #05160e 0%, #020906 100%)",
        border: "1px solid #10b98125",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden"
      }}>
        {/* Style injection for animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse-candle {
            0%, 100% { opacity: 0.35; transform: scaleY(0.95); }
            50% { opacity: 0.65; transform: scaleY(1.05); }
          }
          @keyframes move-upward-arrow {
            0% { transform: translate(-30px, 40px) scale(0.6); opacity: 0; }
            50% { opacity: 0.4; }
            100% { transform: translate(30px, -40px) scale(1.1); opacity: 0; }
          }
          @keyframes wave-glow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.5; }
          }
        `}} />

        {/* Status text directly in the chart */}
        <div style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 10px #10b981",
            animation: "wave-glow 1.5s infinite"
          }} />
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.05em",
            textTransform: "uppercase"
          }}>
            InvestBuddy AI Engine Running
          </span>
        </div>

        {/* Animated Candlesticks & Trading lines background */}
        <svg style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none"
        }}>
          {/* Grid lines background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b98108" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Upward glowing arrows */}
          <g style={{ transform: "translate(15%, 30%)" }}>
            <path d="M 0 15 L 10 0 L 20 15 L 14 15 L 14 30 L 6 30 L 6 15 Z" fill="#10b981" style={{ animation: "move-upward-arrow 6s infinite ease-in-out" }} />
          </g>
          <g style={{ transform: "translate(80%, 20%)" }}>
            <path d="M 0 15 L 10 0 L 20 15 L 14 15 L 14 30 L 6 30 L 6 15 Z" fill="#10b981" style={{ animation: "move-upward-arrow 4.5s infinite ease-in-out 1.5s" }} />
          </g>
          <g style={{ transform: "translate(45%, 75%)" }}>
            <path d="M 0 15 L 10 0 L 20 15 L 14 15 L 14 30 L 6 30 L 6 15 Z" fill="#10b981" style={{ animation: "move-upward-arrow 7s infinite ease-in-out 3s" }} />
          </g>

          {/* SVG Candlestick Columns */}
          {[
            { x: "8%", w: 12, h: 90, wickH: 140, y: 150, color: "#ef4444" },
            { x: "16%", w: 12, h: 140, wickH: 200, y: 100, color: "#10b981" },
            { x: "24%", w: 12, h: 80, wickH: 120, y: 130, color: "#ef4444" },
            { x: "32%", w: 12, h: 160, wickH: 220, y: 80, color: "#10b981" },
            { x: "40%", w: 12, h: 220, wickH: 280, y: 40, color: "#10b981" },
            { x: "60%", w: 12, h: 130, wickH: 190, y: 120, color: "#ef4444" },
            { x: "68%", w: 12, h: 190, wickH: 260, y: 60, color: "#10b981" },
            { x: "76%", w: 12, h: 90, wickH: 150, y: 140, color: "#ef4444" },
            { x: "84%", w: 12, h: 210, wickH: 290, y: 50, color: "#10b981" },
            { x: "92%", w: 12, h: 240, wickH: 310, y: 30, color: "#10b981" }
          ].map((c, i) => (
            <g key={i} style={{ 
              transformOrigin: `${c.x} ${c.y + c.h/2}px`, 
              animation: `pulse-candle ${3 + (i%3)}s ease-in-out infinite` 
            }}>
              {/* Wick */}
              <line x1={c.x} y1={c.y - (c.wickH - c.h)/2} x2={c.x} y2={c.y + c.h + (c.wickH - c.h)/2} stroke={c.color} strokeWidth="2" opacity="0.5" />
              {/* Body */}
              <rect x={`calc(${c.x} - ${c.w/2}px)`} y={c.y} width={c.w} height={c.h} fill={c.color} rx="2" opacity="0.75" />
            </g>
          ))}

          {/* Smooth EMA Trend line overlays */}
          <path d="M 0,220 Q 200,100 400,140 T 800,80 T 1200,120" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.3" style={{ animation: "wave-glow 5s infinite" }} />
          <path d="M 0,250 Q 200,140 400,190 T 800,120 T 1200,160" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
}
