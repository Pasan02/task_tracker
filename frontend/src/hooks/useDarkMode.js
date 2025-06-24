import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Custom hook for managing dark mode
 */
export const useDarkMode = () => {
  const { isDarkMode, toggleDarkMode, updatePreferences } = useApp();
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  // Check system preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (e) => {
      setSystemPrefersDark(e.matches);
    };

    // Listen for changes in system preference
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  /**
   * Toggle dark mode manually
   */
  const toggle = () => {
    toggleDarkMode();
  };

  /**
   * Set dark mode to a specific value
   * @param {boolean} enabled - Whether to enable dark mode
   */
  const setDarkMode = (enabled) => {
    if (enabled !== isDarkMode) {
      toggleDarkMode();
    }
  };

  /**
   * Use system preference for dark mode
   */
  const useSystemPreference = () => {
    setDarkMode(systemPrefersDark);
    updatePreferences({ 
      theme: systemPrefersDark ? 'dark' : 'light',
      useSystemTheme: true 
    });
  };

  /**
   * Get the appropriate theme colors based on current mode
   * @returns {Object} Theme color object
   */
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: '#111827',
        surface: '#1f2937',
        primary: '#3b82f6',
        secondary: '#6b7280',
        text: '#f9fafb',
        textSecondary: '#d1d5db',
        border: '#374151',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        cardBackground: '#1f2937',
        hover: '#374151'
      };
    }
    
    return {
      background: '#ffffff',
      surface: '#f9fafb',
      primary: '#3b82f6',
      secondary: '#6b7280',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      cardBackground: '#ffffff',
      hover: '#f3f4f6'
    };
  };

  /**
   * Get CSS custom properties for the current theme
   * @returns {Object} CSS custom properties object
   */
  const getThemeVariables = () => {
    const colors = getThemeColors();
    const variables = {};
    
    Object.keys(colors).forEach(key => {
      variables[`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = colors[key];
    });
    
    return variables;
  };

  /**
   * Apply theme variables to document root
   */
  const applyThemeVariables = () => {
    const variables = getThemeVariables();
    const root = document.documentElement;
    
    Object.keys(variables).forEach(property => {
      root.style.setProperty(property, variables[property]);
    });
  };

  // Apply theme variables when dark mode changes
  useEffect(() => {
    applyThemeVariables();
  }, [isDarkMode]);

  return {
    isDarkMode,
    systemPrefersDark,
    toggle,
    setDarkMode,
    useSystemPreference,
    getThemeColors,
    getThemeVariables,
    applyThemeVariables
  };
};

export default useDarkMode;