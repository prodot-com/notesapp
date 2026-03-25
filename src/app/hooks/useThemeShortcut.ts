"use client";

import { useEffect } from "react";

export default function useThemeShortcut(toggleTheme: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [toggleTheme]);
}