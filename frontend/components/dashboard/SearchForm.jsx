"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm({ initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    router.push(`/analyze?company=${encodeURIComponent(q)}`);
  };

  return (
    <form className="header-search" onSubmit={handleSubmit} id="header-search-form">
      <input
        id="header-search-input"
        type="text"
        className="header-input"
        placeholder="Search another company..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        id="header-analyze-btn"
        type="submit"
        className="header-btn"
        disabled={loading || !query.trim()}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
}
