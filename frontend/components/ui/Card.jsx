"use client";

export default function Card({ children, className = "" }) {
  return (
    <div className={`section ${className}`}>
      {children}
    </div>
  );
}
