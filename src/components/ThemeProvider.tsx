'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorage.getItem('korwiki-theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = saved ?? preferred;
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function toggleTheme() {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('korwiki-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
