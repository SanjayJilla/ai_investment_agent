"use client";

export default function Button({ children, onClick, disabled, variant = "primary", id, type = "button" }) {
  const cls = variant === "secondary" ? "header-btn" : "hero-search-btn";
  return (
    <button id={id} type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
