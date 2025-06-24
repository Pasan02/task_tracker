import { TASK_STATUS, TASK_PRIORITY, SORT_OPTIONS, SORT_ORDERS } from './constants';
import { isOverdue, isToday, isTomorrow, getDaysOverdue } from './dateHelpers';

/**
 * Task utility functions
 */

/**
 * Filter tasks based on various criteria
 * @param {Array} tasks - Array of tasks
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered tasks
 */
export const filterTasks = (tasks, filters = {}) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesTitle = task.title?.toLowerCase().includes(searchTerm);
      const matchesDescription = task.description?.toLowerCase().includes(searchTerm);
      const matchesCategory = task.category?.toLowerCase().includes(searchTerm);
      
      if (!matchesTitle && !matchesDescription && !matchesCategory) {
        return false;
      }
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (task.status !== filters.status) return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      if (task.priority !== filters.priority) return false;
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (task.category !== filters.category) return false;
    }
    
    // Date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      if (start && task.dueDate && new Date(task.dueDate) < new Date(start)) return false;
      if (end && task.dueDate && new Date(task.dueDate) > new Date(end)) return false;
    }
    
    return true;
  });
};

/**
 * Sort tasks based on criteria
 * @param {Array} tasks - Array of tasks
 * @param {string} sortBy - Sort field
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Array} Sorted tasks
 */
export const sortTasks = (tasks, sortBy = SORT_OPTIONS.DUE_DATE, sortOrder = SORT_ORDERS.ASC) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  
  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case SORT_OPTIONS.DUE_DATE:
        aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
        break;
        
      case SORT_OPTIONS.PRIORITY:
        const priorityOrder = { [TASK_PRIORITY.HIGH]: 3, [TASK_PRIORITY.MEDIUM]: 2, [TASK_PRIORITY.LOW]: 1 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
        break;
        
      case SORT_OPTIONS.STATUS:
        const statusOrder = { [TASK_STATUS.TODO]: 1, [TASK_STATUS.IN_PROGRESS]: 2, [TASK_STATUS.DONE]: 3 };
        aValue = statusOrder[a.status] || 0;
        bValue = statusOrder[b.status] || 0;
        break;
        
      case SORT_OPTIONS.TITLE:
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
        
      case SORT_OPTIONS.CREATED_AT:
        aValue = a.createdAt ? new Date(a.createdAt) : new Date(0);
        bValue = b.createdAt ? new Date(b.createdAt) : new Date(0);
        break;
        
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === SORT_ORDERS.ASC ? -1 : 1;
    if (aValue > bValue) return sortOrder === SORT_ORDERS.ASC ? 1 : -1;
    return 0;
  });
  
  return sortedTasks;
};

/**
 * Get tasks for today
 * @param {Array} tasks - Array of tasks
 * @returns {Array} Tasks due today
 */
export const getTodayTasks = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  
  return tasks.filter(task => 
    task.dueDate && isToday(task.dueDate) && task.status !== TASK_STATUS.DONE
  );
};

/**
 * Get overdue tasks
 * @param {Array} tasks - Array of tasks
 * @returns {Array} Overdue tasks
 */
export const getOverdueTasks = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  
  return tasks.filter(task => 
    task.dueDate && isOverdue(task.dueDate) && task.status !== TASK_STATUS.DONE
  );
};

/**
 * Get upcoming tasks (next 7 days)
 * @param {Array} tasks - Array of tasks
 * @param {number} days - Number of days to look ahead (default: 7)
 * @returns {Array} Upcoming tasks
 */
export const getUpcomingTasks = (tasks, days = 7) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  
  return tasks.filter(task => {
    if (!task.dueDate || task.status === TASK_STATUS.DONE) return false;
    
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= futureDate;
  });
};

/**
 * Get task statistics
 * @param {Array} tasks - Array of tasks
 * @returns {Object} Task statistics
 */
export const getTaskStats = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      overdue: 0,
      today: 0,
      upcoming: 0,
      completionRate: 0,
      priorities: { high: 0, medium: 0, low: 0 }
    };
  }
  
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === TASK_STATUS.DONE).length;
  const inProgress = tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length;
  const todo = tasks.filter(task => task.status === TASK_STATUS.TODO).length;
  const overdue = getOverdueTasks(tasks).length;
  const today = getTodayTasks(tasks).length;
  const upcoming = getUpcomingTasks(tasks).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const priorities = {
    high: tasks.filter(task => task.priority === TASK_PRIORITY.HIGH && task.status !== TASK_STATUS.DONE).length,
    medium: tasks.filter(task => task.priority === TASK_PRIORITY.MEDIUM && task.status !== TASK_STATUS.DONE).length,
    low: tasks.filter(task => task.priority === TASK_PRIORITY.LOW && task.status !== TASK_STATUS.DONE).length
  };
  
  return {
    total,
    completed,
    inProgress,
    todo,
    overdue,
    today,
    upcoming,
    completionRate,
    priorities
  };
};

/**
 * Get unique categories from tasks
 * @param {Array} tasks - Array of tasks
 * @returns {Array} Array of unique categories
 */
export const getTaskCategories = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  
  const categories = tasks
    .map(task => task.category)
    .filter(category => category && category.trim() !== '')
    .filter((category, index, array) => array.indexOf(category) === index);
  
  return categories.sort();
};

/**
 * Generate a new task ID (for local storage)
 * @returns {string} New task ID
 */
export const generateTaskId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new task with default values
 * @param {Object} taskData - Task data
 * @returns {Object} New task object
 */
export const createNewTask = (taskData = {}) => {
  const now = new Date().toISOString();
  
  return {
    id: generateTaskId(),
    title: taskData.title || '',
    description: taskData.description || '',
    dueDate: taskData.dueDate || null,
    priority: taskData.priority || TASK_PRIORITY.MEDIUM,
    status: taskData.status || TASK_STATUS.TODO,
    category: taskData.category || '',
    createdAt: now,
    updatedAt: now,
    ...taskData
  };
};

/**
 * Update a task with new data
 * @param {Object} existingTask - Existing task
 * @param {Object} updates - Updates to apply
 * @returns {Object} Updated task
 */
export const updateTask = (existingTask, updates) => {
  return {
    ...existingTask,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Check if a task is urgent (high priority or overdue)
 * @param {Object} task - Task to check
 * @returns {boolean} True if task is urgent
 */
export const isUrgentTask = (task) => {
  if (!task) return false;
  
  const isHighPriority = task.priority === TASK_PRIORITY.HIGH;
  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate);
  const isDaysOverdue = task.dueDate && getDaysOverdue(task.dueDate) >= 3;
  
  return isHighPriority || isTaskOverdue || isDaysOverdue;
};

/**
 * Get task priority weight for sorting
 * @param {string} priority - Task priority
 * @returns {number} Priority weight
 */
export const getPriorityWeight = (priority) => {
  const weights = {
    [TASK_PRIORITY.HIGH]: 3,
    [TASK_PRIORITY.MEDIUM]: 2,
    [TASK_PRIORITY.LOW]: 1
  };
  
  return weights[priority] || 0;
};

/**
 * Format task for display
 * @param {Object} task - Task to format
 * @returns {Object} Formatted task data
 */
export const formatTaskForDisplay = (task) => {
  if (!task) return null;
  
  return {
    ...task,
    isOverdue: task.dueDate ? isOverdue(task.dueDate) : false,
    isToday: task.dueDate ? isToday(task.dueDate) : false,
    isTomorrow: task.dueDate ? isTomorrow(task.dueDate) : false,
    daysOverdue: task.dueDate ? getDaysOverdue(task.dueDate) : 0,
    isUrgent: isUrgentTask(task),
    priorityWeight: getPriorityWeight(task.priority)
  };
};