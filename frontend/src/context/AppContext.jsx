import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../components/common';

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
  const navigate = useNavigate();

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

  // Update the theme-related functions in AppContext

  // In the setTheme function, make sure it updates localStorage and the DOM
  const setTheme = useCallback((theme) => {
    if (theme === 'dark' || theme === 'light') {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      dispatch({ type: actionTypes.SET_THEME, payload: theme });
    }
  }, []);

  // Update the toggleTheme function
  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    
    // Add a transitioning class to prevent flash during transition
    document.documentElement.classList.add('theme-transitioning');
    document.body.classList.add('theme-transitioning');
    
    // Set data-theme attribute
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Also toggle body class
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Update localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update state
    dispatch({ type: actionTypes.SET_THEME, payload: newTheme });
    
    // Remove transition prevention class after changes are applied
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      document.body.classList.remove('theme-transitioning');
    }, 100);
  }, [state.theme]);

  // Update the setActiveRoute function to prevent duplicate navigation:
  const setActiveRoute = useCallback((route) => {
    if (typeof route === 'string') {
      // Ensure route starts with a slash for consistency
      const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
      
      // Only update if the route is actually different
      if (normalizedRoute !== state.activeRoute) {
        prevPathRef.current = normalizedRoute;
        dispatch({ type: actionTypes.SET_ACTIVE_ROUTE, payload: normalizedRoute });
        
        // Don't navigate here - let the Navigation component handle it
        // navigate(normalizedRoute);
      }
    }
  }, [state.activeRoute]); // Remove navigate from dependencies

  const toggleSidebar = useCallback((isOpen) => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR, payload: isOpen });
  }, []);

  // Dialog functionality for confirmations
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
    variant: 'primary'
  });

  const openConfirmDialog = useCallback((dialogConfig) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: true,
      ...dialogConfig
    });
  }, [confirmDialog]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
  }, [confirmDialog]);

  // Modal functionality
  const [taskFormState, setTaskFormState] = useState({
    isOpen: false,
    task: null
  });

  const [habitFormState, setHabitFormState] = useState({
    isOpen: false,
    habit: null
  });

  const openTaskForm = useCallback((task = null) => {
    setTaskFormState({
      isOpen: true,
      task
    });
  }, []);

  const closeTaskForm = useCallback(() => {
    setTaskFormState({
      isOpen: false,
      task: null
    });
  }, []);

  const openHabitForm = useCallback((habit = null) => {
    setHabitFormState({
      isOpen: true,
      habit
    });
  }, []);

  const closeHabitForm = useCallback(() => {
    setHabitFormState({
      isOpen: false,
      habit: null
    });
  }, []);

  // Set theme on initial load and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Add this useEffect at the top of your AppProvider component
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Set the theme on initial load
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // If the stored theme differs from the state, update the state
    if (savedTheme !== state.theme) {
      dispatch({ type: actionTypes.SET_THEME, payload: savedTheme });
    }
  }, []);

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setUser,
    setTheme,
    toggleTheme, // Add this
    setActiveRoute,
    toggleSidebar,
    // Dialog functionality
    openConfirmDialog,
    closeConfirmDialog,
    confirmDialog,
    // Modal functionality
    openTaskForm,
    closeTaskForm,
    taskFormState,
    openHabitForm,
    closeHabitForm,
    habitFormState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Render global confirm dialog if needed */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel || closeConfirmDialog}
          variant={confirmDialog.variant}
        />
      )}
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