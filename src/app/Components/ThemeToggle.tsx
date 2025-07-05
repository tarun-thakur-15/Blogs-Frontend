// components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext"; 

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${theme === "dark" ? "dark" : "light"}`}
      aria-label="Toggle Dark Mode"
    >
      <span className="icon">{theme === "dark" ? "🌙" : "🌞"}</span>
      <span className="slider"></span>
    </button>
  );
}
