import { useState, useMemo, useCallback } from 'react';
import { useTasks as useTasksContext } from '../context/TaskContext';
import { 
  getTodayTasks, 
  getOverdueTasks, 
  getUpcomingTasks,
  filterTasks,
  sortTasks 
} from '../utils/taskHelper';
import { isToday, isTomorrow, isOverdue } from '../utils/dateHelpers';

/**
 * Custom hook for task management with additional utilities
 * Provides filtered data, sorting, and common task operations
 */
const useTasks = (filters = {}) => {
  const {
    tasks,
    loading,
    error,
    stats,
    categories,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getFilteredTasks,
    getTodayTasks: getContextTodayTasks,
    getOverdueTasks: getContextOverdueTasks,
    getUpcomingTasks: getContextUpcomingTasks,
    searchTasks,
    clearError
  } = useTasksContext();

  const [localFilters, setLocalFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    sortBy: 'dueDate',
    sortOrder: 'asc',
    ...filters
  });

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let filtered = filterTasks(tasks, localFilters);
    return sortTasks(filtered, localFilters.sortBy, localFilters.sortOrder);
  }, [tasks, localFilters]);

  // Categorized tasks
  const categorizedTasks = useMemo(() => {
    return {
      today: getTodayTasks(tasks),
      overdue: getOverdueTasks(tasks),
      upcoming: getUpcomingTasks(tasks),
      completed: tasks.filter(task => task.status === 'done'),
      inProgress: tasks.filter(task => task.status === 'in-progress'),
      todo: tasks.filter(task => task.status === 'todo')
    };
  }, [tasks]);

  /**
   * Update filters
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = useCallback((newFilters) => {
    // Check if the new filters are actually different
    let hasChanges = false;
    
    for (const key in newFilters) {
      if (localFilters[key] !== newFilters[key]) {
        hasChanges = true;
        break;
      }
    }
    
    // Only update if there are actual changes
    if (hasChanges) {
      setLocalFilters(prev => ({
        ...prev,
        ...newFilters
      }));
    }
  }, [localFilters]);

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setLocalFilters({
      status: 'all',
      priority: 'all',
      category: 'all',
      search: '',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    });
  };

  /**
   * Get tasks by status
   * @param {string} status - Task status
   * @returns {Array} Filtered tasks
   */
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  /**
   * Get tasks by priority
   * @param {string} priority - Task priority
   * @returns {Array} Filtered tasks
   */
  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  /**
   * Get tasks by category
   * @param {string} category - Category name
   * @returns {Array} Filtered tasks
   */
  const getTasksByCategory = (category) => {
    return tasks.filter(task => task.category === category);
  };

  /**
   * Get tasks due within specific number of days
   * @param {number} days - Number of days
   * @returns {Array} Tasks due within the timeframe
   */
  const getTasksDueWithin = (days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate <= cutoffDate && dueDate >= new Date();
    });
  };

  /**
   * Get high priority overdue tasks
   * @returns {Array} High priority overdue tasks
   */
  const getUrgentTasks = () => {
    return tasks.filter(task => 
      task.priority === 'high' && 
      isOverdue(task.dueDate) && 
      task.status !== 'done'
    );
  };

  /**
   * Get tasks that need attention (overdue or due today with high priority)
   * @returns {Array} Tasks needing attention
   */
  const getTasksNeedingAttention = () => {
    return tasks.filter(task => {
      if (task.status === 'done') return false;
      
      const isHighPriority = task.priority === 'high';
      const isDueToday = isToday(task.dueDate);
      const isTaskOverdue = isOverdue(task.dueDate);
      
      return isTaskOverdue || (isHighPriority && isDueToday);
    });
  };

  /**
   * Get completion rate for a specific time period
   * @param {number} days - Number of days to look back
   * @returns {number} Completion rate percentage (0-100)
   */
  const getCompletionRate = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentTasks = tasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      return createdDate >= cutoffDate;
    });
    
    if (recentTasks.length === 0) return 0;
    
    const completedTasks = recentTasks.filter(task => task.status === 'done');
    return Math.round((completedTasks.length / recentTasks.length) * 100);
  };

  /**
   * Get productivity metrics
   * @returns {Object} Productivity metrics
   */
  const getProductivityMetrics = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayTasks = tasks.filter(task => 
      task.createdAt && isToday(new Date(task.createdAt))
    );
    
    const completedToday = todayTasks.filter(task => task.status === 'done').length;
    const weeklyRate = getCompletionRate(7);
    const monthlyRate = getCompletionRate(30);
    
    return {
      tasksCreatedToday: todayTasks.length,
      tasksCompletedToday: completedToday,
      weeklyCompletionRate: weeklyRate,
      monthlyCompletionRate: monthlyRate,
      averageTasksPerDay: Math.round(tasks.length / 30), // Rough estimate
      urgentTasksCount: getUrgentTasks().length,
      overdueTasksCount: getOverdueTasks(tasks).length
    };
  };

  /**
   * Bulk update tasks
   * @param {Array} taskIds - Array of task IDs
   * @param {Object} updates - Updates to apply
   */
  const bulkUpdateTasks = async (taskIds, updates) => {
    const promises = taskIds.map(taskId => updateTask(taskId, updates));
    await Promise.all(promises);
  };

  /**
   * Bulk delete tasks
   * @param {Array} taskIds - Array of task IDs
   */
  const bulkDeleteTasks = async (taskIds) => {
    const promises = taskIds.map(taskId => deleteTask(taskId));
    await Promise.all(promises);
  };

  /**
   * Mark multiple tasks as completed
   * @param {Array} taskIds - Array of task IDs
   */
  const bulkCompleteTask = async (taskIds) => {
    await bulkUpdateTasks(taskIds, { status: 'done' });
  };

  /**
   * Get tasks grouped by due date
   * @returns {Object} Tasks grouped by date categories
   */
  const getTasksByDueDate = () => {
    const grouped = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      nextWeek: [],
      later: [],
      noDueDate: []
    };

    tasks.forEach(task => {
      if (!task.dueDate) {
        grouped.noDueDate.push(task);
        return;
      }

      if (isOverdue(task.dueDate)) {
        grouped.overdue.push(task);
      } else if (isToday(task.dueDate)) {
        grouped.today.push(task);
      } else if (isTomorrow(task.dueDate)) {
        grouped.tomorrow.push(task);
      } else {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 7) {
          grouped.thisWeek.push(task);
        } else if (daysDiff <= 14) {
          grouped.nextWeek.push(task);
        } else {
          grouped.later.push(task);
        }
      }
    });

    return grouped;
  };

  /**
   * Search tasks with advanced options
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Array} Matching tasks
   */
  const advancedSearchTasks = (query, options = {}) => {
    const {
      searchFields = ['title', 'description', 'category'],
      caseSensitive = false,
      exactMatch = false
    } = options;

    if (!query.trim()) return tasks;

    const searchTerm = caseSensitive ? query : query.toLowerCase();

    return tasks.filter(task => {
      return searchFields.some(field => {
        const value = task[field] || '';
        const searchValue = caseSensitive ? value : value.toLowerCase();
        
        if (exactMatch) {
          return searchValue === searchTerm;
        } else {
          return searchValue.includes(searchTerm);
        }
      });
    });
  };

  /**
   * Get task progress summary
   * @returns {Object} Progress summary
   */
  const getProgressSummary = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;
    
    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      progressPercentage: totalTasks > 0 ? Math.round(((completedTasks + inProgressTasks) / totalTasks) * 100) : 0
    };
  };

  return {
    // Core data
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    stats,
    categories,
    
    // Categorized tasks
    categorizedTasks,
    
    // Filters
    filters: localFilters,
    updateFilters,
    clearFilters,
    
    // CRUD operations
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    clearError,
    
    // Bulk operations
    bulkUpdateTasks,
    bulkDeleteTasks,
    bulkCompleteTask,
    
    // Utility functions
    getTasksByStatus,
    getTasksByPriority,
    getTasksByCategory,
    getTasksDueWithin,
    getUrgentTasks,
    getTasksNeedingAttention,
    getTasksByDueDate,
    
    // Search functions
    searchTasks,
    advancedSearchTasks,
    
    // Analytics
    getCompletionRate,
    getProductivityMetrics,
    getProgressSummary,
    
    // Context functions
    getTodayTasks: getContextTodayTasks,
    getOverdueTasks: getContextOverdueTasks,
    getUpcomingTasks: getContextUpcomingTasks
  };
};

export default useTasks;
export { useTasks };