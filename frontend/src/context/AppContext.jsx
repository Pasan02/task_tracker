import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';

// Define action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  SET_THEME: 'SET_THEME',
  SET_ACTIVE_ROUTE: 'SET_ACTIVE_ROUTE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR'
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  user: null,
  theme: localStorage.getItem('theme') || 'light',
  activeRoute: window.location.pathname,
  sidebarOpen: window.innerWidth > 768
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case actionTypes.SET_ACTIVE_ROUTE:
      // Only update if the route is actually different
      if (state.activeRoute === action.payload) return state;
      return { ...state, activeRoute: action.payload };
    case actionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: action.payload !== undefined ? action.payload : !state.sidebarOpen };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const prevPathRef = useRef(window.location.pathname);

  // Fix for the infinite loop - use a ref to track the current path
  useEffect(() => {
    const handleLocationChange = () => {
      const currentPath = window.location.pathname;
      // Only dispatch if the path actually changed
      if (prevPathRef.current !== currentPath) {
        prevPathRef.current = currentPath;
        dispatch({ type: actionTypes.SET_ACTIVE_ROUTE, payload: currentPath });
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Action creators wrapped in useCallback to prevent unnecessary re-renders
  const setLoading = useCallback((isLoading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  const setUser = useCallback((user) => {
    dispatch({ type: actionTypes.SET_USER, payload: user });
  }, []);

  const setTheme = useCallback((theme) => {
    localStorage.setItem('theme', theme);
    dispatch({ type: actionTypes.SET_THEME, payload: theme });
  }, []);

  // Define setActiveRoute function correctly
  const setActiveRoute = useCallback((route) => {
    if (typeof route === 'string' && route !== state.activeRoute) {
      prevPathRef.current = route;
      dispatch({ type: actionTypes.SET_ACTIVE_ROUTE, payload: route });
    }
  }, [state.activeRoute]);

  const toggleSidebar = useCallback((isOpen) => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR, payload: isOpen });
  }, []);

  // Set theme on initial load and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setUser,
    setTheme,
    setActiveRoute,
    toggleSidebar
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;