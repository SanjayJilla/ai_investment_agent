"use client";

export default function Input({ value, onChange, placeholder, id, className = "" }) {
  return (
    <input
      id={id}
      type="text"
      className={`header-input ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
