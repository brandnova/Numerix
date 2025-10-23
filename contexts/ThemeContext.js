import React, { createContext, useState, useEffect, useContext } from 'react';
import { THEMES } from '../constants/theme';
import { Storage } from '../utils/storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [colors, setColors] = useState(THEMES.dark);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await Storage.getSettings();
      changeTheme(settings.theme || 'dark');
    } catch (error) {
      console.error('Error loading theme:', error);
      changeTheme('dark');
    }
  };

  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
      setColors(THEMES[themeName]);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, colors, changeTheme }}>
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