import { VALIDATION_RULES } from './constants';

/**
 * Validation utility functions
 */

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate string length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Error message or null if valid
 */
export const validateLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or less`;
  }
  return null;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validate date format and logic
 * @param {string} date - Date string to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null if valid
 */
export const validateDate = (date, options = {}) => {
  if (!date) {
    return options.required ? 'Date is required' : null;
  }
  
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Please enter a valid date';
  }
  
  // Check if date is in the past (if not allowed)
  if (options.noFuture && dateObj > new Date()) {
    return 'Date cannot be in the future';
  }
  
  // Check if date is in the past (if not allowed)
  if (options.noPast) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) {
      return 'Date cannot be in the past';
    }
  }
  
  // Check minimum date
  if (options.minDate && dateObj < new Date(options.minDate)) {
    return `Date must be after ${new Date(options.minDate).toLocaleDateString()}`;
  }
  
  // Check maximum date
  if (options.maxDate && dateObj > new Date(options.maxDate)) {
    return `Date must be before ${new Date(options.maxDate).toLocaleDateString()}`;
  }
  
  return null;
};

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Error message or null if valid
 */
export const validateNumber = (value, min, max, fieldName = 'Value') => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (min !== undefined && num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `${fieldName} must be ${max} or less`;
  }
  
  return null;
};

/**
 * Validate task data
 * @param {Object} task - Task object to validate
 * @returns {Object} Validation errors object
 */
export const validateTask = (task) => {
  const errors = {};
  
  // Validate title
  const titleError = validateRequired(task.title, 'Title') || 
                    validateLength(task.title, VALIDATION_RULES.TASK_TITLE_MAX_LENGTH, 'Title');
  if (titleError) errors.title = titleError;
  
  // Validate description
  const descriptionError = validateLength(task.description, VALIDATION_RULES.TASK_DESCRIPTION_MAX_LENGTH, 'Description');
  if (descriptionError) errors.description = descriptionError;
  
  // Validate due date
  const dueDateError = validateDate(task.dueDate, { noPast: true });
  if (dueDateError) errors.dueDate = dueDateError;
  
  // Validate category
  const categoryError = validateLength(task.category, VALIDATION_RULES.CATEGORY_MAX_LENGTH, 'Category');
  if (categoryError) errors.category = categoryError;
  
  // Validate priority
  if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
    errors.priority = 'Priority must be low, medium, or high';
  }
  
  // Validate status
  if (task.status && !['todo', 'in-progress', 'done'].includes(task.status)) {
    errors.status = 'Status must be todo, in-progress, or done';
  }
  
  return errors;
};

/**
 * Validate habit data
 * @param {Object} habit - Habit object to validate
 * @returns {Object} Validation errors object
 */
export const validateHabit = (habit) => {
  const errors = {};
  
  // Validate title
  const titleError = validateRequired(habit.title, 'Title') || 
                    validateLength(habit.title, VALIDATION_RULES.HABIT_TITLE_MAX_LENGTH, 'Title');
  if (titleError) errors.title = titleError;
  
  // Validate description
  const descriptionError = validateLength(habit.description, VALIDATION_RULES.HABIT_DESCRIPTION_MAX_LENGTH, 'Description');
  if (descriptionError) errors.description = descriptionError;
  
  // Validate frequency
  if (habit.frequency && !['daily', 'weekly'].includes(habit.frequency)) {
    errors.frequency = 'Frequency must be daily or weekly';
  }
  
  // Validate target count
  const targetCountError = validateNumber(
    habit.targetCount, 
    VALIDATION_RULES.MIN_TARGET_COUNT, 
    VALIDATION_RULES.MAX_TARGET_COUNT, 
    'Target count'
  );
  if (targetCountError) errors.targetCount = targetCountError;
  
  // Validate category
  const categoryError = validateLength(habit.category, VALIDATION_RULES.CATEGORY_MAX_LENGTH, 'Category');
  if (categoryError) errors.category = categoryError;
  
  return errors;
};

/**
 * Validate filter data
 * @param {Object} filters - Filters object to validate
 * @returns {Object} Validation errors object
 */
export const validateFilters = (filters) => {
  const errors = {};
  
  // Validate search term length
  if (filters.search && filters.search.length > 100) {
    errors.search = 'Search term is too long';
  }
  
  // Validate date range
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    
    if (start) {
      const startError = validateDate(start);
      if (startError) errors.startDate = startError;
    }
    
    if (end) {
      const endError = validateDate(end);
      if (endError) errors.endDate = endError;
    }
    
    if (start && end && new Date(start) > new Date(end)) {
      errors.dateRange = 'Start date must be before end date';
    }
  }
  
  return errors;
};

/**
 * Check if validation errors object has any errors
 * @param {Object} errors - Errors object
 * @returns {boolean} True if there are errors
 */
export const hasValidationErrors = (errors) => {
  return Object.keys(errors || {}).length > 0;
};

/**
 * Get first error message from errors object
 * @param {Object} errors - Errors object
 * @returns {string|null} First error message or null
 */
export const getFirstError = (errors) => {
  const errorKeys = Object.keys(errors || {});
  return errorKeys.length > 0 ? errors[errorKeys[0]] : null;
};

/**
 * Sanitize input string
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateUrl = (url) => {
  if (!url) return null;
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with errors and strength
 */
export const validatePassword = (password) => {
  const errors = [];
  let strength = 0;
  
  if (!password) {
    return { errors: ['Password is required'], strength: 0 };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    strength += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strength += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strength += 1;
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strength += 1;
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    strength += 1;
  }
  
  return { errors, strength };
};