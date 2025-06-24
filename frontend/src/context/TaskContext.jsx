import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import taskService from '../services/taskService';
import { useApp } from './AppContext';
import { 
  getTodayTasks, 
  getOverdueTasks, 
  getUpcomingTasks, 
  getTaskStats,
  filterTasks,
  sortTasks 
} from '../utils/taskHelper';

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
    today: 0,
    upcoming: 0,
    completionRate: 0,
    priorities: { high: 0, medium: 0, low: 0 }
  },
  categories: [],
  initialized: false
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_STATS: 'SET_STATS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_INITIALIZED: 'SET_INITIALIZED'
};

// Reducer function
const taskReducer = (state, action) => {
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
      
    case actionTypes.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null
      };
      
    case actionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
      
    case actionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
      
    case actionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
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
const TaskContext = createContext();

// Context provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { setError: setAppError, clearError: clearAppError } = useApp();
  const tasksRef = useRef(null);

  // Load tasks on mount - only once
  useEffect(() => {
    // Only load if not initialized
    if (state.initialized) return;
    
    let isMounted = true;
    const loadTasks = async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        const tasks = await taskService.getAllTasks();
        
        if (isMounted) {
          tasksRef.current = JSON.stringify(tasks);
          
          // Calculate stats and categories once
          const stats = getTaskStats(tasks);
          const categories = [...new Set(tasks
            .map(task => task.category)
            .filter(category => category && category.trim() !== '')
          )].sort();
          
          dispatch({ type: actionTypes.SET_TASKS, payload: tasks });
          dispatch({ type: actionTypes.SET_STATS, payload: stats });
          dispatch({ type: actionTypes.SET_CATEGORIES, payload: categories });
          dispatch({ type: actionTypes.SET_INITIALIZED, payload: true });
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage = error.message || 'Failed to load tasks';
          dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
          setAppError(errorMessage);
        }
      } finally {
        if (isMounted) {
          dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
      }
    };

    loadTasks();
    
    return () => {
      isMounted = false;
    };
  }, [setAppError, state.initialized]);

  // Update derived data when tasks change - only after initialized
  useEffect(() => {
    if (!state.initialized || state.loading) return;
    
    const currentTasksJSON = JSON.stringify(state.tasks);
    
    // Skip processing if tasks haven't meaningfully changed
    if (currentTasksJSON === tasksRef.current) {
      return;
    }
    
    // Update the ref and recalculate
    tasksRef.current = currentTasksJSON;

    const stats = getTaskStats(state.tasks);
    const categories = [...new Set(state.tasks
      .map(task => task.category)
      .filter(category => category && category.trim() !== '')
    )].sort();
      
    dispatch({ type: actionTypes.SET_STATS, payload: stats });
    dispatch({ type: actionTypes.SET_CATEGORIES, payload: categories });
    
  }, [state.tasks, state.initialized, state.loading]);

  // Action creators
  const actions = {
    // Create a new task
    createTask: async (taskData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        const newTask = await taskService.createTask(taskData);
        dispatch({ type: actionTypes.ADD_TASK, payload: newTask });
        
        return newTask;
      } catch (error) {
        const errorMessage = error.message || 'Failed to create task';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Update an existing task
    updateTask: async (taskId, updates) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        const updatedTask = await taskService.updateTask(taskId, updates);
        dispatch({ type: actionTypes.UPDATE_TASK, payload: updatedTask });
        
        return updatedTask;
      } catch (error) {
        const errorMessage = error.message || 'Failed to update task';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Delete a task
    deleteTask: async (taskId) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        await taskService.deleteTask(taskId);
        dispatch({ type: actionTypes.DELETE_TASK, payload: taskId });
        
        return true;
      } catch (error) {
        const errorMessage = error.message || 'Failed to delete task';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Toggle task status
    toggleTaskStatus: async (taskId, newStatus) => {
      try {
        clearAppError();
        
        const updatedTask = await taskService.toggleTaskStatus(taskId, newStatus);
        dispatch({ type: actionTypes.UPDATE_TASK, payload: updatedTask });
        
        return updatedTask;
      } catch (error) {
        const errorMessage = error.message || 'Failed to toggle task status';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      }
    },

    // Get filtered tasks
    getFilteredTasks: (filters) => {
      const { tasks } = state;
      let filteredTasks = filterTasks(tasks, filters);
      
      if (filters.sortBy) {
        filteredTasks = sortTasks(filteredTasks, filters.sortBy, filters.sortOrder);
      }
      
      return filteredTasks;
    },

    // Get today's tasks
    getTodayTasks: () => {
      return getTodayTasks(state.tasks);
    },

    // Get overdue tasks
    getOverdueTasks: () => {
      return getOverdueTasks(state.tasks);
    },

    // Get upcoming tasks
    getUpcomingTasks: (days = 7) => {
      return getUpcomingTasks(state.tasks, days);
    },

    // Refresh tasks from service
    refreshTasks: async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        const tasks = await taskService.getAllTasks();
        dispatch({ type: actionTypes.SET_TASKS, payload: tasks });
        
        return tasks;
      } catch (error) {
        const errorMessage = error.message || 'Failed to refresh tasks';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    },

    // Search tasks
    searchTasks: async (query, additionalFilters = {}) => {
      try {
        clearAppError();
        
        const results = await taskService.searchTasks(query, additionalFilters);
        return results;
      } catch (error) {
        const errorMessage = error.message || 'Failed to search tasks';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      }
    },

    // Export tasks
    exportTasks: async () => {
      try {
        clearAppError();
        
        const jsonData = await taskService.exportTasks();
        return jsonData;
      } catch (error) {
        const errorMessage = error.message || 'Failed to export tasks';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      }
    },

    // Import tasks
    importTasks: async (jsonData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        clearAppError();
        
        const importedTasks = await taskService.importTasks(jsonData);
        
        // Refresh all tasks after import
        const allTasks = await taskService.getAllTasks();
        dispatch({ type: actionTypes.SET_TASKS, payload: allTasks });
        
        return importedTasks;
      } catch (error) {
        const errorMessage = error.message || 'Failed to import tasks';
        dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
        setAppError(errorMessage);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
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
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;