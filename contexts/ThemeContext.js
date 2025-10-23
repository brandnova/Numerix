import React, { createContext, useState, useEffect, useContext } from 'react';
import { THEMES } from '../constants/theme';
import { Storage } from '../utils/storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [colors, setColors] = useState(THEMES.dark);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      setIsLoading(true);
      const settings = await Storage.getSettings();
      changeTheme(settings.theme || 'dark');
    } catch (error) {
      console.error('Error loading theme:', error);
      changeTheme('dark');
    } finally {
      setIsLoading(false);
    }
  };

  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
      setColors(THEMES[themeName]);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, colors, changeTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}