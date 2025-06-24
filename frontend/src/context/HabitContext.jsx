import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
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
      return { ...state, loading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case actionTypes.SET_HABITS:
      return { ...state, habits: action.payload, loading: false, error: null };
    case actionTypes.ADD_HABIT:
      return { ...state, habits: [...state.habits, action.payload] };
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
      return { ...state, stats: action.payload };
    case actionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case actionTypes.SET_INITIALIZED:
      return { ...state, initialized: action.payload };
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
  const habitsRef = useRef(null);

  // Effect for the initial load of habits.
  useEffect(() => {
    if (state.initialized) return;
    
    let isMounted = true;
    const loadInitialData = async () => {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      try {
        const habits = await habitService.getAllHabits();
        
        if (isMounted) {
          habitsRef.current = JSON.stringify(habits);
          
          // Calculate derived data immediately
          const today = formatDateForInput(new Date());
          const newStats = {
            totalHabits: habits.length,
            activeHabits: habits.filter(h => h.frequency).length,
            completedToday: habits.filter(h => h.completions?.includes(today)).length,
            totalCompletions: habits.reduce((sum, h) => sum + (h.completions?.length || 0), 0),
            longestStreak: calculateMaxLongestStreak(habits),
            currentStreaks: habits.map(h => ({ 
              habitId: h.id, 
              habitTitle: h.title, 
              streak: calculateCurrentStreak(h) 
            })),
            habitBreakdown: habits.reduce((breakdown, h) => {
              if (h.frequency === 'daily') breakdown.daily++;
              if (h.frequency === 'weekly') breakdown.weekly++;
              return breakdown;
            }, { daily: 0, weekly: 0 })
          };
          
          newStats.completionRate = newStats.totalHabits > 0 ? 
            Math.round((newStats.completedToday / newStats.totalHabits) * 100) : 0;

          const newCategories = [...new Set(habits
            .map(h => h.category)
            .filter(c => c && c.trim() !== '')
          )].sort();
          
          dispatch({ type: actionTypes.SET_HABITS, payload: habits });
          dispatch({ type: actionTypes.SET_STATS, payload: newStats });
          dispatch({ type: actionTypes.SET_CATEGORIES, payload: newCategories });
          dispatch({ type: actionTypes.SET_INITIALIZED, payload: true });
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage = error.message || 'Failed to load habits';
          dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
          setAppError(errorMessage);
        }
      } finally {
        if (isMounted) {
          dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
      }
    };
    
    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [state.initialized, setAppError]);

  // Functions for calculating streaks - moved outside useEffect for clarity
  const getDaysDifference = (date1, date2) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.round(diffTime / oneDay);
  };

  const calculateCurrentStreak = (habit) => {
    if (!habit.completions || habit.completions.length === 0) return 0;
    const today = new Date();
    const sortedCompletions = habit.completions.map(date => new Date(date)).sort((a, b) => b - a);
    let streak = 0;
    let currentDate = new Date(today);
    const todayString = formatDateForInput(today);
    if (!habit.completions.includes(todayString)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    while (true) {
      const dateString = formatDateForInput(currentDate);
      if (habit.completions.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateLongestStreak = (habit) => {
    if (!habit.completions || habit.completions.length < 1) return 0;
    const sortedDates = habit.completions.map(date => new Date(date)).sort((a, b) => a - b);
    if (sortedDates.length === 1) return 1;
    let longestStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      if (getDaysDifference(sortedDates[i - 1], sortedDates[i]) === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    return Math.max(longestStreak, currentStreak);
  };

  const calculateMaxLongestStreak = (habits) => {
    if (!habits || habits.length === 0) return 0;
    return Math.max(0, ...habits.map(calculateLongestStreak));
  };

  // Effect to update stats and categories when habits change.
  useEffect(() => {
    if (!state.initialized || state.loading) return;

    const currentHabitsJSON = JSON.stringify(state.habits);
    
    // Skip processing if habits haven't meaningfully changed
    if (currentHabitsJSON === habitsRef.current) {
      return;
    }
    
    // Update the ref and recalculate
    habitsRef.current = currentHabitsJSON;

    const today = formatDateForInput(new Date());
    const newStats = {
      totalHabits: state.habits.length,
      activeHabits: state.habits.filter(h => h.frequency).length,
      completedToday: state.habits.filter(h => h.completions?.includes(today)).length,
      totalCompletions: state.habits.reduce((sum, h) => sum + (h.completions?.length || 0), 0),
      longestStreak: calculateMaxLongestStreak(state.habits),
      currentStreaks: state.habits.map(h => ({ 
        habitId: h.id, 
        habitTitle: h.title, 
        streak: calculateCurrentStreak(h) 
      })),
      habitBreakdown: state.habits.reduce((breakdown, h) => {
        if (h.frequency === 'daily') breakdown.daily++;
        if (h.frequency === 'weekly') breakdown.weekly++;
        return breakdown;
      }, { daily: 0, weekly: 0 })
    };
    
    newStats.completionRate = newStats.totalHabits > 0 ? 
      Math.round((newStats.completedToday / newStats.totalHabits) * 100) : 0;

    const newCategories = [...new Set(state.habits
      .map(h => h.category)
      .filter(c => c && c.trim() !== '')
    )].sort();

    dispatch({ type: actionTypes.SET_STATS, payload: newStats });
    dispatch({ type: actionTypes.SET_CATEGORIES, payload: newCategories });

  }, [state.habits, state.initialized, state.loading]);

  const handleApiCall = useCallback(async (apiCall, successCallback) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    clearAppError();
    try {
      const result = await apiCall();
      if (successCallback) {
        successCallback(result);
      }
      return result;
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      setAppError(errorMessage);
      throw error;
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }, [clearAppError, setAppError]);

  const createHabit = useCallback((habitData) => handleApiCall(
    () => habitService.createHabit(habitData),
    (newHabit) => dispatch({ type: actionTypes.ADD_HABIT, payload: newHabit })
  ), [handleApiCall]);

  const updateHabit = useCallback((habitId, updates) => handleApiCall(
    () => habitService.updateHabitDetails(habitId, updates),
    (updatedHabit) => dispatch({ type: actionTypes.UPDATE_HABIT, payload: updatedHabit })
  ), [handleApiCall]);

  const deleteHabit = useCallback((habitId) => handleApiCall(
    () => habitService.deleteHabit(habitId),
    () => dispatch({ type: actionTypes.DELETE_HABIT, payload: habitId })
  ), [handleApiCall]);

  const toggleHabitCompletion = useCallback(async (habitId, dateString) => {
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
  }, [clearAppError, setAppError]);

  const markHabitCompleteToday = useCallback((habitId) => {
    const today = formatDateForInput(new Date());
    return toggleHabitCompletion(habitId, today);
  }, [toggleHabitCompletion]);

  const getTodaysHabits = useCallback(async () => {
    try {
      clearAppError();
      return await habitService.getTodaysHabits();
    } catch (error) {
      const errorMessage = error.message || "Failed to get today's habits";
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      setAppError(errorMessage);
      throw error;
    }
  }, [clearAppError, setAppError]);

  const getHabitCalendarData = useCallback(async (habitId, year, month) => {
    try {
      clearAppError();
      return await habitService.getHabitCalendarData(habitId, year, month);
    } catch (error) {
      const errorMessage = error.message || 'Failed to get habit calendar data';
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      setAppError(errorMessage);
      throw error;
    }
  }, [clearAppError, setAppError]);

  const getFilteredHabits = useCallback((filters) => {
    return state.habits.filter(habit => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!habit.title?.toLowerCase().includes(searchTerm) &&
            !habit.description?.toLowerCase().includes(searchTerm) &&
            !habit.category?.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }
      if (filters.frequency && filters.frequency !== 'all' && habit.frequency !== filters.frequency) return false;
      if (filters.category && filters.category !== 'all' && habit.category !== filters.category) return false;
      if (filters.completedToday && filters.completedToday !== 'all') {
        const today = formatDateForInput(new Date());
        const isCompleted = habit.completions?.includes(today);
        if (filters.completedToday === 'yes' && !isCompleted) return false;
        if (filters.completedToday === 'no' && isCompleted) return false;
      }
      return true;
    });
  }, [state.habits]);

  const refreshHabits = useCallback(() => handleApiCall(
    () => habitService.getAllHabits(),
    (habits) => dispatch({ type: actionTypes.SET_HABITS, payload: habits })
  ), [handleApiCall]);

  const exportHabits = useCallback(() => habitService.exportHabits(), []);

  const importHabits = useCallback(async (jsonData) => {
    await handleApiCall(() => habitService.importHabits(jsonData));
    await refreshHabits();
  }, [handleApiCall, refreshHabits]);

  const calculateHabitStreak = useCallback((habitId) => {
    const habit = state.habits.find(h => h.id === habitId);
    return habit ? calculateCurrentStreak(habit) : 0;
  }, [state.habits]);

  const getHabitById = useCallback((habitId) => {
    return state.habits.find(habit => habit.id === habitId) || null;
  }, [state.habits]);

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
    clearAppError();
  }, [clearAppError]);

  const value = {
    ...state,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    markHabitCompleteToday,
    getTodaysHabits,
    getHabitCalendarData,
    getFilteredHabits,
    refreshHabits,
    exportHabits,
    importHabits,
    calculateHabitStreak,
    getHabitById,
    clearError
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