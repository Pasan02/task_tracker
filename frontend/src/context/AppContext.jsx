import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

// Initial state
const initialState = {
  // UI State
  isDarkMode: false,
  sidebarOpen: false,
  loading: false,
  error: null,
  
  // Navigation
  activeRoute: 'dashboard',
  
  // Search
  searchQuery: '',
  
  // User preferences
  preferences: {
    theme: 'light',
    defaultTaskPriority: 'medium',
    defaultHabitFrequency: 'daily',
    notificationsEnabled: true,
    autoSave: true
  },
  
  // Modal states
  modals: {
    taskForm: { isOpen: false, task: null },
    habitForm: { isOpen: false, habit: null },
    confirmDialog: { isOpen: false, config: null }
  },
  
  // Filters
  filters: {
    tasks: {
      status: 'all',
      priority: 'all',
      category: 'all',
      search: '',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    },
    habits: {
      frequency: 'all',
      category: 'all',
      search: '',
      completedToday: 'all'
    }
  }
};

// Action types
const actionTypes = {
  // UI Actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  
  // Navigation
  SET_ACTIVE_ROUTE: 'SET_ACTIVE_ROUTE',
  
  // Search
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  
  // Preferences
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  LOAD_PREFERENCES: 'LOAD_PREFERENCES',
  
  // Modals
  OPEN_TASK_FORM: 'OPEN_TASK_FORM',
  CLOSE_TASK_FORM: 'CLOSE_TASK_FORM',
  OPEN_HABIT_FORM: 'OPEN_HABIT_FORM',
  CLOSE_HABIT_FORM: 'CLOSE_HABIT_FORM',
  OPEN_CONFIRM_DIALOG: 'OPEN_CONFIRM_DIALOG',
  CLOSE_CONFIRM_DIALOG: 'CLOSE_CONFIRM_DIALOG',
  
  // Filters
  SET_TASK_FILTERS: 'SET_TASK_FILTERS',
  SET_HABIT_FILTERS: 'SET_HABIT_FILTERS',
  CLEAR_TASK_FILTERS: 'CLEAR_TASK_FILTERS',
  CLEAR_HABIT_FILTERS: 'CLEAR_HABIT_FILTERS'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case actionTypes.TOGGLE_DARK_MODE:
      const newIsDarkMode = !state.isDarkMode;
      return {
        ...state,
        isDarkMode: newIsDarkMode,
        preferences: {
          ...state.preferences,
          theme: newIsDarkMode ? 'dark' : 'light'
        }
      };
      
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case actionTypes.SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: action.payload
      };
      
    case actionTypes.SET_ACTIVE_ROUTE:
      return {
        ...state,
        activeRoute: action.payload
      };
      
    case actionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };
      
    case actionTypes.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };
      
    case actionTypes.LOAD_PREFERENCES:
      return {
        ...state,
        preferences: action.payload,
        isDarkMode: action.payload.theme === 'dark'
      };
      
    case actionTypes.OPEN_TASK_FORM:
      return {
        ...state,
        modals: {
          ...state.modals,
          taskForm: {
            isOpen: true,
            task: action.payload || null
          }
        }
      };
      
    case actionTypes.CLOSE_TASK_FORM:
      return {
        ...state,
        modals: {
          ...state.modals,
          taskForm: {
            isOpen: false,
            task: null
          }
        }
      };
      
    case actionTypes.OPEN_HABIT_FORM:
      return {
        ...state,
        modals: {
          ...state.modals,
          habitForm: {
            isOpen: true,
            habit: action.payload || null
          }
        }
      };
      
    case actionTypes.CLOSE_HABIT_FORM:
      return {
        ...state,
        modals: {
          ...state.modals,
          habitForm: {
            isOpen: false,
            habit: null
          }
        }
      };
      
    case actionTypes.OPEN_CONFIRM_DIALOG:
      return {
        ...state,
        modals: {
          ...state.modals,
          confirmDialog: {
            isOpen: true,
            config: action.payload
          }
        }
      };
      
    case actionTypes.CLOSE_CONFIRM_DIALOG:
      return {
        ...state,
        modals: {
          ...state.modals,
          confirmDialog: {
            isOpen: false,
            config: null
          }
        }
      };
      
    case actionTypes.SET_TASK_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          tasks: {
            ...state.filters.tasks,
            ...action.payload
          }
        }
      };
      
    case actionTypes.SET_HABIT_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          habits: {
            ...state.filters.habits,
            ...action.payload
          }
        }
      };
      
    case actionTypes.CLEAR_TASK_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          tasks: {
            status: 'all',
            priority: 'all',
            category: 'all',
            search: '',
            sortBy: 'dueDate',
            sortOrder: 'asc'
          }
        }
      };
      
    case actionTypes.CLEAR_HABIT_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          habits: {
            frequency: 'all',
            category: 'all',
            search: '',
            completedToday: 'all'
          }
        }
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load preferences from localStorage on app start
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        dispatch({
          type: actionTypes.LOAD_PREFERENCES,
          payload: preferences
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(state.preferences)
      );
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, [state.preferences]);

  // Action creators
  const actions = {
    // UI Actions
    setLoading: (loading) => dispatch({
      type: actionTypes.SET_LOADING,
      payload: loading
    }),
    
    setError: (error) => dispatch({
      type: actionTypes.SET_ERROR,
      payload: error
    }),
    
    clearError: () => dispatch({
      type: actionTypes.CLEAR_ERROR
    }),
    
    toggleDarkMode: () => dispatch({
      type: actionTypes.TOGGLE_DARK_MODE
    }),
    
    toggleSidebar: () => dispatch({
      type: actionTypes.TOGGLE_SIDEBAR
    }),
    
    setSidebarOpen: (isOpen) => dispatch({
      type: actionTypes.SET_SIDEBAR_OPEN,
      payload: isOpen
    }),
    
    // Navigation
    setActiveRoute: (route) => dispatch({
      type: actionTypes.SET_ACTIVE_ROUTE,
      payload: route
    }),
    
    // Search
    setSearchQuery: (query) => dispatch({
      type: actionTypes.SET_SEARCH_QUERY,
      payload: query
    }),
    
    // Preferences
    updatePreferences: (preferences) => dispatch({
      type: actionTypes.UPDATE_PREFERENCES,
      payload: preferences
    }),
    
    // Modals
    openTaskForm: (task = null) => dispatch({
      type: actionTypes.OPEN_TASK_FORM,
      payload: task
    }),
    
    closeTaskForm: () => dispatch({
      type: actionTypes.CLOSE_TASK_FORM
    }),
    
    openHabitForm: (habit = null) => dispatch({
      type: actionTypes.OPEN_HABIT_FORM,
      payload: habit
    }),
    
    closeHabitForm: () => dispatch({
      type: actionTypes.CLOSE_HABIT_FORM
    }),
    
    openConfirmDialog: (config) => dispatch({
      type: actionTypes.OPEN_CONFIRM_DIALOG,
      payload: config
    }),
    
    closeConfirmDialog: () => dispatch({
      type: actionTypes.CLOSE_CONFIRM_DIALOG
    }),
    
    // Filters
    setTaskFilters: (filters) => dispatch({
      type: actionTypes.SET_TASK_FILTERS,
      payload: filters
    }),
    
    setHabitFilters: (filters) => dispatch({
      type: actionTypes.SET_HABIT_FILTERS,
      payload: filters
    }),
    
    clearTaskFilters: () => dispatch({
      type: actionTypes.CLEAR_TASK_FILTERS
    }),
    
    clearHabitFilters: () => dispatch({
      type: actionTypes.CLEAR_HABIT_FILTERS
    })
  };

  const value = {
    ...state,
    ...actions
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