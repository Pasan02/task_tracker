import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import habitService from '../services/habitService';
import { useApp } from './AppContext';
import { formatDateForInput } from '../utils/dateHelpers';

// Initial state
const initialState = {
  habits: [],
  loading: false,
  error: null,
  stats: {
    totalHabits: 0,
    activeHabits: 0,
    completedToday: 0,
    totalCompletions: 0,
    longestStreak: 0,
    currentStreaks: [],
    completionRate: 0,
    habitBreakdown: {
      daily: 0,
      weekly: 0
    }
  },
  categories: [],
  initialized: false
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_HABITS: 'SET_HABITS',
  ADD_HABIT: 'ADD_HABIT',
  UPDATE_HABIT: 'UPDATE_HABIT',
  DELETE_HABIT: 'DELETE_HABIT',
  SET_STATS: 'SET_STATS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_INITIALIZED: 'SET_INITIALIZED'
};

// Reducer function
const habitReducer = (state, action) => {
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
      
    case actionTypes.SET_HABITS:
      return {
        ...state,
        habits: action.payload,
        loading: false,
        error: null
      };
      
    case actionTypes.ADD_HABIT:
      return {
        ...state,
        habits: [...state.habits, action.payload]
      };
      
    case actionTypes.UPDATE_HABIT:
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? action.payload : habit
        )
      };
      
    case actionTypes.DELETE_HABIT:
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload)
      };
      
    case actionTypes.SET_STATS:
      return {
        ...state,
        stats: action.payload
      };
      
    case actionTypes.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
      
    case actionTypes.SET_INITIALIZED:
      return {
        ...state,
        initialized: action.payload
      };
      
    default:
      return state;
  }
};

// Create context
const HabitContext = createContext();

// Context provider component
export const HabitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const { setError: setAppError, clearError: clearAppError } = useApp();

  // Helper to update stats and categories
  const updateDerivedData = useCallback(async (habits) => {
    try {
      const stats = await habitService.getHabitStatistics();
      const categories = [...new Set(habits
        .map(habit => habit.category)
        .filter(category => category && category.trim() !== '')
      )].sort();
      
      dispatch({ type: actionTypes.SET_STATS, payload: stats });
      dispatch({ type: actionTypes.SET_CATEGORIES, payload: categories });
    } catch (error) {
      console.error('Error updating derived data:', error);
    }
  }, []);

  // Load habits on mount
  useEffect(() => {
    const loadHabits = async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        const habits = await habitService.getAllHabits();
        dispatch({ type: actionTypes.SET_HABITS, payload: habits });
        await updateDerivedData(habits);
        dispatch({ type: actionTypes.SET_INITIALIZED, payload: true });
      } catch (error) {
        const errorMessage = error.message || 'Failed to load habits';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
      }
    };

    loadHabits();
  }, [setAppError, updateDerivedData]);

  // Update derived data when habits change
  useEffect(() => {
    if (state.initialized && state.habits.length >= 0) {
      updateDerivedData(state.habits);
    }
  }, [state.habits, state.initialized, updateDerivedData]);

  // Action creators
  const actions = {
    // Create a new habit
    createHabit: async (habitData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        const newHabit = await habitService.createHabit(habitData);
        dispatch({ type: actionTypes.ADD_HABIT, payload: newHabit });
        
        return newHabit;
      } catch (error) {
        const errorMessage = error.message || 'Failed to create habit';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Update an existing habit
    updateHabit: async (habitId, updates) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        const updatedHabit = await habitService.updateHabitDetails(habitId, updates);
        dispatch({ type: actionTypes.UPDATE_HABIT, payload: updatedHabit });
        
        return updatedHabit;
      } catch (error) {
        const errorMessage = error.message || 'Failed to update habit';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Delete a habit
    deleteHabit: async (habitId) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        await habitService.deleteHabit(habitId);
        dispatch({ type: actionTypes.DELETE_HABIT, payload: habitId });
        
        return true;
      } catch (error) {
        const errorMessage = error.message || 'Failed to delete habit';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Toggle habit completion for a specific date
    toggleHabitCompletion: async (habitId, dateString) => {
      try {
        clearAppError();
        
        const updatedHabit = await habitService.toggleHabitCompletion(habitId, dateString);
        dispatch({ type: actionTypes.UPDATE_HABIT, payload: updatedHabit });
        
        return updatedHabit;
      } catch (error) {
        const errorMessage = error.message || 'Failed to toggle habit completion';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      }
    },

    // Mark habit as complete for today
    markHabitCompleteToday: async (habitId) => {
      const today = formatDateForInput(new Date());
      return actions.toggleHabitCompletion(habitId, today);
    },

    // Get today's habits with completion status
    getTodaysHabits: async () => {
      try {
        clearAppError();
        
        const todaysHabits = await habitService.getTodaysHabits();
        return todaysHabits;
      } catch (error) {
        const errorMessage = error.message || 'Failed to get today\'s habits';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      }
    },

    // Get habit calendar data
    getHabitCalendarData: async (habitId, year, month) => {
      try {
        clearAppError();
        
        const calendarData = await habitService.getHabitCalendarData(habitId, year, month);
        return calendarData;
      } catch (error) {
        const errorMessage = error.message || 'Failed to get habit calendar data';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      }
    },

    // Get filtered habits
    getFilteredHabits: (filters) => {
      const { habits } = state;
      
      return habits.filter(habit => {
        // Search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const matchesTitle = habit.title?.toLowerCase().includes(searchTerm);
          const matchesDescription = habit.description?.toLowerCase().includes(searchTerm);
          const matchesCategory = habit.category?.toLowerCase().includes(searchTerm);
          
          if (!matchesTitle && !matchesDescription && !matchesCategory) {
            return false;
          }
        }
        
        // Frequency filter
        if (filters.frequency && filters.frequency !== 'all') {
          if (habit.frequency !== filters.frequency) return false;
        }
        
        // Category filter
        if (filters.category && filters.category !== 'all') {
          if (habit.category !== filters.category) return false;
        }
        
        // Completed today filter
        if (filters.completedToday && filters.completedToday !== 'all') {
          const today = formatDateForInput(new Date());
          const isCompleted = habit.completions && habit.completions.includes(today);
          
          if (filters.completedToday === 'yes' && !isCompleted) return false;
          if (filters.completedToday === 'no' && isCompleted) return false;
        }
        
        return true;
      });
    },

    // Refresh habits from service
    refreshHabits: async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        const habits = await habitService.getAllHabits();
        dispatch({ type: actionTypes.SET_HABITS, payload: habits });
        
        return habits;
      } catch (error) {
        const errorMessage = error.message || 'Failed to refresh habits';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Export habits
    exportHabits: async () => {
      try {
        clearAppError();
        
        const jsonData = await habitService.exportHabits();
        return jsonData;
      } catch (error) {
        const errorMessage = error.message || 'Failed to export habits';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      }
    },

    // Import habits
    importHabits: async (jsonData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        const importedHabits = await habitService.importHabits(jsonData);
        
        // Refresh all habits after import
        const allHabits = await habitService.getAllHabits();
        dispatch({ type: actionTypes.SET_HABITS, payload: allHabits });
        
        return importedHabits;
      } catch (error) {
        const errorMessage = error.message || 'Failed to import habits';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Calculate streak for a specific habit
    calculateHabitStreak: (habitId) => {
      const habit = state.habits.find(h => h.id === habitId);
      if (!habit) return 0;
      
      return habitService.calculateCurrentStreak(habit);
    },

    // Get habit by ID
    getHabitById: (habitId) => {
      return state.habits.find(habit => habit.id === habitId) || null;
    },

    // Clear error
    clearError: () => {
      dispatch({ type: actionTypes.CLEAR_ERROR });
      clearAppError();
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to use the habit context
export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export default HabitContext;