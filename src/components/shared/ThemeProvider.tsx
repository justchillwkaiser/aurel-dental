"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (next: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "aurel_theme_v1";
const THEME_EVENT = "aurel-theme-change";

function readClientTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch {
    return "light";
  }
  return "light";
}

function subscribeTheme(callback: () => void) {
  const onEvent = () => callback();
  window.addEventListener("storage", onEvent);
  window.addEventListener(THEME_EVENT, onEvent);
  return () => {
    window.removeEventListener("storage", onEvent);
    window.removeEventListener(THEME_EVENT, onEvent);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribeTheme,
    readClientTheme,
    () => "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      // Sync strictly-necessary non-HttpOnly UI theme preference via modern Cookie Store API (secure contexts).
      if ("cookieStore" in window && window.cookieStore) {
        void window.cookieStore.set({
          name: "aurel_theme",
          value: next,
          path: "/",
          sameSite: "lax",
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
        });
      }
    } catch {
      // Ignore storage persistence failures
    }
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }
  return ctx;
}
