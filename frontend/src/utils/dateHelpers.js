/**
 * Date utility functions for the Task & Habit Tracker
 */

/**
 * Format a date string for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'relative')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'relative':
      return getRelativeTimeString(dateObj);
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 * @param {Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (date) => {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 1) return `In ${diffInDays} days`;
  if (diffInDays < -1) return `${Math.abs(diffInDays)} days ago`;
  
  return formatDate(date);
};

/**
 * Check if a date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is tomorrow
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is tomorrow
 */
export const isTomorrow = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return dateObj.toDateString() === tomorrow.toDateString();
};

/**
 * Check if a date is overdue (past today)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj < today;
};

/**
 * Check if a date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  return dateObj > today;
};

/**
 * Get the number of days between two dates
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Number of days between dates
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffInMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

/**
 * Get days overdue for a given date
 * @param {string|Date} date - Date to check
 * @returns {number} Number of days overdue (0 if not overdue)
 */
export const getDaysOverdue = (date) => {
  if (!isOverdue(date)) return 0;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return getDaysDifference(dateObj, today);
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string for input
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Get start of week (Sunday) for a given date
 * @param {Date} date - Date to get week start for
 * @returns {Date} Start of week date
 */
export const getStartOfWeek = (date = new Date()) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

/**
 * Get end of week (Saturday) for a given date
 * @param {Date} date - Date to get week end for
 * @returns {Date} End of week date
 */
export const getEndOfWeek = (date = new Date()) => {
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + (6 - date.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

/**
 * Get array of dates for current week
 * @param {Date} date - Date to get week for
 * @returns {Date[]} Array of dates for the week
 */
export const getWeekDates = (date = new Date()) => {
  const startOfWeek = getStartOfWeek(date);
  const weekDates = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDates.push(day);
  }
  
  return weekDates;
};

/**
 * Get current date as ISO string (YYYY-MM-DD)
 * @returns {string} Current date in ISO format
 */
export const getCurrentDateISO = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Check if two dates are the same day
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return d1.toDateString() === d2.toDateString();
};

/**
 * Get readable date range string
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string} Formatted date range
 */
export const getDateRangeString = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = formatDate(startDate, 'short');
  const end = formatDate(endDate, 'short');
  
  if (start === end) return start;
  
  return `${start} - ${end}`;
};