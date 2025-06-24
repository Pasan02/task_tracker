import { useState, useEffect, useMemo } from 'react';
import { useHabits as useHabitsContext } from '../context/HabitContext';
import { formatDateForInput } from '../utils/dateHelpers';

/**
 * Custom hook for habit management with additional utilities
 * Provides filtered data and common operations
 */
const useHabits = (filters = {}) => {
  const {
    habits,
    loading,
    error,
    stats,
    categories,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getFilteredHabits,
    getTodaysHabits,
    getHabitCalendarData,
    calculateHabitStreak,
    getHabitById,
    clearError
  } = useHabitsContext();

  const [localFilters, setLocalFilters] = useState({
    frequency: 'all',
    category: 'all',
    search: '',
    completedToday: 'all',
    ...filters
  });

  // Filtered habits based on current filters
  const filteredHabits = useMemo(() => {
    return getFilteredHabits(localFilters);
  }, [habits, localFilters, getFilteredHabits]);

  // Today's date for completion checking
  const today = useMemo(() => formatDateForInput(new Date()), []);

  /**
   * Update filters
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = (newFilters) => {
    setLocalFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setLocalFilters({
      frequency: 'all',
      category: 'all',
      search: '',
      completedToday: 'all'
    });
  };

  /**
   * Get habits by frequency
   * @param {string} frequency - 'daily' or 'weekly'
   * @returns {Array} Filtered habits
   */
  const getHabitsByFrequency = (frequency) => {
    return habits.filter(habit => habit.frequency === frequency);
  };

  /**
   * Get habits by category
   * @param {string} category - Category name
   * @returns {Array} Filtered habits
   */
  const getHabitsByCategory = (category) => {
    return habits.filter(habit => habit.category === category);
  };

  /**
   * Get completed habits for today
   * @returns {Array} Today's completed habits
   */
  const getTodayCompletedHabits = () => {
    return habits.filter(habit => 
      habit.completions && habit.completions.includes(today)
    );
  };

  /**
   * Get pending habits for today
   * @returns {Array} Today's pending habits
   */
  const getTodayPendingHabits = () => {
    return habits.filter(habit => 
      !habit.completions || !habit.completions.includes(today)
    );
  };

  /**
   * Check if a habit is completed for a specific date
   * @param {string} habitId - Habit ID
   * @param {string} date - Date string (YYYY-MM-DD)
   * @returns {boolean} True if completed
   */
  const isHabitCompletedOnDate = (habitId, date) => {
    const habit = getHabitById(habitId);
    return habit?.completions?.includes(date) || false;
  };

  /**
   * Get habit completion percentage for a time period
   * @param {string} habitId - Habit ID
   * @param {number} days - Number of days to look back
   * @returns {number} Completion percentage (0-100)
   */
  const getHabitCompletionRate = (habitId, days = 7) => {
    const habit = getHabitById(habitId);
    if (!habit) return 0;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    let totalDays = 0;
    let completedDays = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      totalDays++;
      const dateString = formatDateForInput(d);
      if (habit.completions?.includes(dateString)) {
        completedDays++;
      }
    }

    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  };

  /**
   * Get habit streak information
   * @param {string} habitId - Habit ID
   * @returns {Object} Streak information
   */
  const getHabitStreakInfo = (habitId) => {
    const currentStreak = calculateHabitStreak(habitId);
    const habit = getHabitById(habitId);
    
    if (!habit) return { current: 0, longest: 0, percentage: 0 };

    // Calculate longest streak
    const completions = habit.completions || [];
    const sortedDates = completions
      .map(date => new Date(date))
      .sort((a, b) => a - b);

    let longestStreak = 0;
    let currentLongest = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currentDate = sortedDates[i];
      const daysDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

      if (daysDiff === 1) {
        currentLongest++;
      } else {
        longestStreak = Math.max(longestStreak, currentLongest);
        currentLongest = 1;
      }
    }
    longestStreak = Math.max(longestStreak, currentLongest);

    return {
      current: currentStreak,
      longest: longestStreak,
      percentage: getHabitCompletionRate(habitId, 30) // 30-day rate
    };
  };

  /**
   * Get habits that need attention (no recent activity)
   * @param {number} days - Days to look back (default: 3)
   * @returns {Array} Habits needing attention
   */
  const getHabitsNeedingAttention = (days = 3) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffString = formatDateForInput(cutoffDate);

    return habits.filter(habit => {
      const recentCompletions = habit.completions?.filter(date => date >= cutoffString) || [];
      return recentCompletions.length === 0;
    });
  };

  /**
   * Bulk toggle habits for today
   * @param {Array} habitIds - Array of habit IDs
   * @param {boolean} completed - Whether to mark as completed or not
   */
  const bulkToggleHabits = async (habitIds, completed) => {
    const promises = habitIds.map(habitId => {
      const isCurrentlyCompleted = isHabitCompletedOnDate(habitId, today);
      if (completed !== isCurrentlyCompleted) {
        return toggleHabitCompletion(habitId, today);
      }
      return Promise.resolve();
    });

    await Promise.all(promises);
  };

  /**
   * Get calendar data for multiple habits
   * @param {Array} habitIds - Array of habit IDs
   * @param {number} year - Year
   * @param {number} month - Month (0-11)
   * @returns {Promise<Object>} Combined calendar data
   */
  const getMultipleHabitsCalendarData = async (habitIds, year, month) => {
    const promises = habitIds.map(habitId => 
      getHabitCalendarData(habitId, year, month)
    );
    
    const results = await Promise.all(promises);
    
    return results.reduce((combined, data, index) => {
      combined[habitIds[index]] = data;
      return combined;
    }, {});
  };

  /**
   * Search habits by title or description
   * @param {string} query - Search query
   * @returns {Array} Matching habits
   */
  const searchHabits = (query) => {
    if (!query.trim()) return habits;
    
    const searchTerm = query.toLowerCase();
    return habits.filter(habit => 
      habit.title?.toLowerCase().includes(searchTerm) ||
      habit.description?.toLowerCase().includes(searchTerm)
    );
  };

  /**
   * Get habit performance summary
   * @returns {Object} Performance summary
   */
  const getPerformanceSummary = () => {
    const totalHabits = habits.length;
    const todayCompleted = getTodayCompletedHabits().length;
    const weeklyRate = getHabitCompletionRate('all', 7);
    const needingAttention = getHabitsNeedingAttention().length;

    return {
      totalHabits,
      todayCompleted,
      todayCompletionRate: totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0,
      weeklyCompletionRate: weeklyRate,
      habitsNeedingAttention: needingAttention,
      streakHabits: habits.filter(habit => calculateHabitStreak(habit.id) > 0).length
    };
  };

  return {
    // Core data
    habits: filteredHabits,
    allHabits: habits,
    loading,
    error,
    stats,
    categories,
    
    // Filters
    filters: localFilters,
    updateFilters,
    clearFilters,
    
    // CRUD operations
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitById,
    clearError,
    
    // Utility functions
    getHabitsByFrequency,
    getHabitsByCategory,
    getTodayCompletedHabits,
    getTodayPendingHabits,
    isHabitCompletedOnDate,
    getHabitCompletionRate,
    getHabitStreakInfo,
    getHabitsNeedingAttention,
    bulkToggleHabits,
    searchHabits,
    getPerformanceSummary,
    
    // Calendar functions
    getTodaysHabits,
    getHabitCalendarData,
    getMultipleHabitsCalendarData,
    calculateHabitStreak,
    
    // Helper values
    today
  };
};

export default useHabits;