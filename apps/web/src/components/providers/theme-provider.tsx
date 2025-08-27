'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEME_COLORS, THEME_NAMES, THEME_DESCRIPTIONS, type THEME_COLORS as ThemeColorsType } from '@mobii/shared';
import type { ThemeType } from '@mobii/shared';

interface ThemeContextType {
  currentTheme: ThemeType;
  themeColors: typeof THEME_COLORS[ThemeType];
  setTheme: (theme: ThemeType) => void;
  availableThemes: Array<{
    id: ThemeType;
    name: string;
    description: string;
    colors: typeof THEME_COLORS[ThemeType];
  }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mobii-theme') as ThemeType;
    if (savedTheme && THEME_COLORS[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('mobii-theme', currentTheme);
    
    // Apply theme to document root
    const root = document.documentElement;
    const colors = THEME_COLORS[currentTheme];
    
    // Set CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });

    // Update document class for Tailwind
    root.className = currentTheme === 'dark' ? 'dark' : '';
  }, [currentTheme]);

  const setTheme = (theme: ThemeType) => {
    if (THEME_COLORS[theme]) {
      setCurrentTheme(theme);
    }
  };

  const availableThemes = Object.entries(THEME_COLORS).map(([id, colors]) => ({
    id: id as ThemeType,
    name: THEME_NAMES[id as ThemeType],
    description: THEME_DESCRIPTIONS[id as ThemeType],
    colors,
  }));

  const value: ThemeContextType = {
    currentTheme,
    themeColors: THEME_COLORS[currentTheme],
    setTheme,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
