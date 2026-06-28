import "./globals.css";

export const metadata = {
  title: "InvestBuddy — AI-Powered Investment Research",
  description:
    "Multi-agent AI that researches any stock and delivers a binary INVEST or PASS verdict backed by deep fundamental analysis, web research, and risk assessment.",
  keywords: "investment research, stock analysis, AI investing, portfolio analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
