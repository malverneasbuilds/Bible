import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  success: string;
  warning: string;
  error: string;
}

const lightTheme: ThemeColors = {
  background: '#ffffff',
  surface: '#f8fafc',
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#fbbf24',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  card: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const darkTheme: ThemeColors = {
  background: '#0f172a',
  surface: '#1e293b',
  primary: '#60a5fa',
  secondary: '#94a3b8',
  accent: '#fde047',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  border: '#334155',
  card: '#1e293b',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsReady(true);
    }
  };

  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  const value = {
    theme,
    colors,
    toggleTheme,
    isReady,
  };

  return React.createElement(
    ThemeContext.Provider,
    { value },
    children
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
