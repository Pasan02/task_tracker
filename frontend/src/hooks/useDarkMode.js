import { useApp } from '../context/AppContext';

/**
 * Custom hook for managing dark mode - simplified to work with AppContext
 */
export const useDarkMode = () => {
  const { theme, toggleTheme } = useApp();
  const isDarkMode = theme === 'dark';
  
  // Just return the AppContext values for consistency
  return {
    isDarkMode,
    toggle: toggleTheme,
    setDarkMode: (enabled) => {
      if ((enabled && theme !== 'dark') || (!enabled && theme === 'dark')) {
        toggleTheme();
      }
    }
  };
};

export default useDarkMode;