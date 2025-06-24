// Task status constants
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done'
};

// Task priority constants
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Habit frequency constants
export const HABIT_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly'
};

// UI constants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning'
};

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

export const MODAL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// Date constants
export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM d, yyyy',
  ISO: 'yyyy-MM-dd'
};

// Filter constants
export const SORT_OPTIONS = {
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  STATUS: 'status',
  TITLE: 'title',
  CREATED_AT: 'createdAt'
};

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Routes
export const ROUTES = {
  DASHBOARD: 'dashboard',
  TASKS: 'tasks',
  TASKS_TODAY: 'tasks-today',
  TASKS_UPCOMING: 'tasks-upcoming',
  TASKS_OVERDUE: 'tasks-overdue',
  HABITS: 'habits',
  HABITS_TODAY: 'habits-today'
};

// Local storage keys
export const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  HABITS: 'taskflow_habits',
  THEME: 'taskflow_theme',
  USER_PREFERENCES: 'taskflow_preferences'
};

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  HABITS: '/api/habits',
  AUTH: '/api/auth'
};

// Validation constants
export const VALIDATION_RULES = {
  TASK_TITLE_MAX_LENGTH: 100,
  TASK_DESCRIPTION_MAX_LENGTH: 500,
  HABIT_TITLE_MAX_LENGTH: 100,
  HABIT_DESCRIPTION_MAX_LENGTH: 500,
  CATEGORY_MAX_LENGTH: 50,
  MIN_TARGET_COUNT: 1,
  MAX_TARGET_COUNT: 100
};

// Colors for priority and status indicators
export const PRIORITY_COLORS = {
  [TASK_PRIORITY.HIGH]: {
    bg: '#fee2e2',
    text: '#dc2626',
    border: '#fecaca'
  },
  [TASK_PRIORITY.MEDIUM]: {
    bg: '#fef3c7',
    text: '#d97706',
    border: '#fed7aa'
  },
  [TASK_PRIORITY.LOW]: {
    bg: '#dcfce7',
    text: '#16a34a',
    border: '#bbf7d0'
  }
};

export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: {
    bg: '#f3f4f6',
    text: '#6b7280',
    border: '#d1d5db'
  },
  [TASK_STATUS.IN_PROGRESS]: {
    bg: '#fef3c7',
    text: '#d97706',
    border: '#fed7aa'
  },
  [TASK_STATUS.DONE]: {
    bg: '#dcfce7',
    text: '#16a34a',
    border: '#bbf7d0'
  }
};

// Default values
export const DEFAULTS = {
  TASK: {
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    category: ''
  },
  HABIT: {
    frequency: HABIT_FREQUENCY.DAILY,
    targetCount: 1,
    category: ''
  }
};