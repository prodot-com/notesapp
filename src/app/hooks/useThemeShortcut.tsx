"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeShortcutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ⌨️ Ctrl + J
      if (
        e.ctrlKey &&
        e.key.toLowerCase() === "j" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [theme, setTheme]);

  return <>{children}</>;
}