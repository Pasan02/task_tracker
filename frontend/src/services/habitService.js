import apiService from './api';
import { API_ENDPOINTS, STORAGE_KEYS, HABIT_FREQUENCY } from '../utils/constants';
import { validateHabit } from '../utils/validators';
import { formatDateForInput, isToday, getDaysDifference } from '../utils/dateHelpers';

/**
 * Habit service for managing habit operations
 * Handles both localStorage and API communication
 */
class HabitService {
  constructor() {
    this.storageKey = STORAGE_KEYS.HABITS;
    this.useLocalStorage = apiService.useLocalStorage;
  }

  /**
   * Generate a new habit ID
   * @returns {string} New habit ID
   */
  generateHabitId() {
    return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new habit object with defaults
   * @param {Object} habitData - Habit data
   * @returns {Object} New habit object
   */
  createNewHabit(habitData = {}) {
    const now = new Date().toISOString();
    
    return {
      id: this.generateHabitId(),
      title: habitData.title || '',
      description: habitData.description || '',
      frequency: habitData.frequency || HABIT_FREQUENCY.DAILY,
      category: habitData.category || '',
      targetCount: habitData.targetCount || 1,
      completions: habitData.completions || [],
      createdAt: now,
      updatedAt: now,
      ...habitData
    };
  }

  /**
   * Update habit with new data
   * @param {Object} existingHabit - Existing habit
   * @param {Object} updates - Updates to apply
   * @returns {Object} Updated habit
   */
  updateHabit(existingHabit, updates) {
    return {
      ...existingHabit,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Get all habits
   * @returns {Promise<Array>} Array of habits
   */
  async getAllHabits() {
    try {
      if (this.useLocalStorage) {
        return this.getHabitsFromStorage();
      }

      // API call for production
      const response = await apiService.get(API_ENDPOINTS.HABITS);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching habits:', error);
      throw new Error(`Failed to fetch habits: ${error.message}`);
    }
  }

  /**
   * Get habit by ID
   * @param {string} habitId - Habit ID
   * @returns {Promise<Object>} Habit object
   */
  async getHabitById(habitId) {
    try {
      if (this.useLocalStorage) {
        const habits = this.getHabitsFromStorage();
        const habit = habits.find(habit => habit.id === habitId);
        
        if (!habit) {
          throw new Error('Habit not found');
        }
        
        return habit;
      }

      // API call for production
      const response = await apiService.get(`${API_ENDPOINTS.HABITS}/${habitId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching habit:', error);
      throw new Error(`Failed to fetch habit: ${error.message}`);
    }
  }

  /**
   * Create a new habit
   * @param {Object} habitData - Habit data
   * @returns {Promise<Object>} Created habit
   */
  async createHabit(habitData) {
    try {
      // Validate habit data
      const validationErrors = validateHabit(habitData);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error(`Validation failed: ${Object.values(validationErrors).join(', ')}`);
      }

      if (this.useLocalStorage) {
        const newHabit = this.createNewHabit(habitData);
        const habits = this.getHabitsFromStorage();
        
        habits.push(newHabit);
        this.saveHabitsToStorage(habits);
        
        return newHabit;
      }

      // API call for production
      const response = await apiService.post(API_ENDPOINTS.HABITS, habitData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw new Error(`Failed to create habit: ${error.message}`);
    }
  }

  /**
   * Update an existing habit
   * @param {string} habitId - Habit ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated habit
   */
  async updateHabitDetails(habitId, updates) {
    try {
      // Validate updates
      const validationErrors = validateHabit({ ...updates, id: habitId });
      if (Object.keys(validationErrors).length > 0) {
        throw new Error(`Validation failed: ${Object.values(validationErrors).join(', ')}`);
      }

      if (this.useLocalStorage) {
        const habits = this.getHabitsFromStorage();
        const habitIndex = habits.findIndex(habit => habit.id === habitId);
        
        if (habitIndex === -1) {
          throw new Error('Habit not found');
        }
        
        const existingHabit = habits[habitIndex];
        const updatedHabit = this.updateHabit(existingHabit, updates);
        
        habits[habitIndex] = updatedHabit;
        this.saveHabitsToStorage(habits);
        
        return updatedHabit;
      }

      // API call for production
      const response = await apiService.put(`${API_ENDPOINTS.HABITS}/${habitId}`, updates);
      return response.data || response;
    } catch (error) {
      console.error('Error updating habit:', error);
      throw new Error(`Failed to update habit: ${error.message}`);
    }
  }

  /**
   * Delete a habit
   * @param {string} habitId - Habit ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteHabit(habitId) {
    try {
      if (this.useLocalStorage) {
        const habits = this.getHabitsFromStorage();
        const habitIndex = habits.findIndex(habit => habit.id === habitId);
        
        if (habitIndex === -1) {
          throw new Error('Habit not found');
        }
        
        habits.splice(habitIndex, 1);
        this.saveHabitsToStorage(habits);
        
        return true;
      }

      // API call for production
      await apiService.delete(`${API_ENDPOINTS.HABITS}/${habitId}`);
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw new Error(`Failed to delete habit: ${error.message}`);
    }
  }

  /**
   * Toggle habit completion for a specific date
   * @param {string} habitId - Habit ID
   * @param {string} dateString - Date string (YYYY-MM-DD)
   * @returns {Promise<Object>} Updated habit
   */
  async toggleHabitCompletion(habitId, dateString) {
    try {
      if (this.useLocalStorage) {
        const habits = this.getHabitsFromStorage();
        const habitIndex = habits.findIndex(habit => habit.id === habitId);
        
        if (habitIndex === -1) {
          throw new Error('Habit not found');
        }
        
        const habit = habits[habitIndex];
        const completions = habit.completions || [];
        const completionIndex = completions.indexOf(dateString);
        
        if (completionIndex === -1) {
          // Add completion
          completions.push(dateString);
        } else {
          // Remove completion
          completions.splice(completionIndex, 1);
        }
        
        const updatedHabit = this.updateHabit(habit, { completions });
        habits[habitIndex] = updatedHabit;
        this.saveHabitsToStorage(habits);
        
        return updatedHabit;
      }

      // API call for production
      const response = await apiService.post(`${API_ENDPOINTS.HABITS}/${habitId}/toggle`, {
        date: dateString
      });
      return response.data || response;
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      throw new Error(`Failed to toggle habit completion: ${error.message}`);
    }
  }

  /**
   * Mark habit as completed for a specific date
   * @param {string} habitId - Habit ID
   * @param {string} dateString - Date string (YYYY-MM-DD)
   * @returns {Promise<Object>} Updated habit
   */
  async markHabitComplete(habitId, dateString) {
    try {
      const habit = await this.getHabitById(habitId);
      const completions = habit.completions || [];
      
      if (!completions.includes(dateString)) {
        completions.push(dateString);
        return await this.updateHabitDetails(habitId, { completions });
      }
      
      return habit; // Already completed
    } catch (error) {
      console.error('Error marking habit complete:', error);
      throw new Error(`Failed to mark habit complete: ${error.message}`);
    }
  }

  /**
   * Mark habit as incomplete for a specific date
   * @param {string} habitId - Habit ID
   * @param {string} dateString - Date string (YYYY-MM-DD)
   * @returns {Promise<Object>} Updated habit
   */
  async markHabitIncomplete(habitId, dateString) {
    try {
      const habit = await this.getHabitById(habitId);
      const completions = habit.completions || [];
      const completionIndex = completions.indexOf(dateString);
      
      if (completionIndex !== -1) {
        completions.splice(completionIndex, 1);
        return await this.updateHabitDetails(habitId, { completions });
      }
      
      return habit; // Already incomplete
    } catch (error) {
      console.error('Error marking habit incomplete:', error);
      throw new Error(`Failed to mark habit incomplete: ${error.message}`);
    }
  }

  /**
   * Get habit statistics
   * @param {string} habitId - Optional habit ID for specific habit stats
   * @returns {Promise<Object>} Habit statistics
   */
  async getHabitStatistics(habitId = null) {
    try {
      const habits = habitId 
        ? [await this.getHabitById(habitId)]
        : await this.getAllHabits();
      
      const today = formatDateForInput(new Date());
      const stats = {
        totalHabits: habits.length,
        activeHabits: habits.filter(habit => habit.frequency).length,
        completedToday: 0,
        totalCompletions: 0,
        longestStreak: 0,
        currentStreaks: [],
        completionRate: 0,
        habitBreakdown: {
          daily: 0,
          weekly: 0
        }
      };
      
      habits.forEach(habit => {
        // Count completions for today
        if (habit.completions && habit.completions.includes(today)) {
          stats.completedToday++;
        }
        
        // Count total completions
        if (habit.completions) {
          stats.totalCompletions += habit.completions.length;
        }
        
        // Calculate current streak
        const currentStreak = this.calculateCurrentStreak(habit);
        stats.currentStreaks.push({
          habitId: habit.id,
          habitTitle: habit.title,
          streak: currentStreak
        });
        
        // Track longest streak
        const longestStreak = this.calculateLongestStreak(habit);
        if (longestStreak > stats.longestStreak) {
          stats.longestStreak = longestStreak;
        }
        
        // Count by frequency
        if (habit.frequency === HABIT_FREQUENCY.DAILY) {
          stats.habitBreakdown.daily++;
        } else if (habit.frequency === HABIT_FREQUENCY.WEEKLY) {
          stats.habitBreakdown.weekly++;
        }
      });
      
      // Calculate completion rate for today
      if (stats.totalHabits > 0) {
        stats.completionRate = Math.round((stats.completedToday / stats.totalHabits) * 100);
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting habit statistics:', error);
      throw new Error(`Failed to get habit statistics: ${error.message}`);
    }
  }

  /**
   * Calculate current streak for a habit
   * @param {Object} habit - Habit object
   * @returns {number} Current streak count
   */
  calculateCurrentStreak(habit) {
    if (!habit.completions || habit.completions.length === 0) {
      return 0;
    }
    
    const today = new Date();
    const sortedCompletions = habit.completions
      .map(date => new Date(date))
      .sort((a, b) => b - a); // Most recent first
    
    let streak = 0;
    let currentDate = new Date(today);
    
    // Check if today is completed, if not start from yesterday
    const todayString = formatDateForInput(today);
    if (!habit.completions.includes(todayString)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (currentDate >= sortedCompletions[sortedCompletions.length - 1]) {
      const dateString = formatDateForInput(currentDate);
      if (habit.completions.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  /**
   * Calculate longest streak for a habit
   * @param {Object} habit - Habit object
   * @returns {number} Longest streak count
   */
  calculateLongestStreak(habit) {
    if (!habit.completions || habit.completions.length === 0) {
      return 0;
    }
    
    const sortedDates = habit.completions
      .map(date => new Date(date))
      .sort((a, b) => a - b); // Oldest first
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currentDate = sortedDates[i];
      const daysDiff = getDaysDifference(prevDate, currentDate);
      
      if (daysDiff === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  }

  /**
   * Get habits for today
   * @returns {Promise<Array>} Today's habits with completion status
   */
  async getTodaysHabits() {
    try {
      const habits = await this.getAllHabits();
      const today = formatDateForInput(new Date());
      
      return habits.map(habit => ({
        ...habit,
        completedToday: habit.completions && habit.completions.includes(today)
      }));
    } catch (error) {
      console.error('Error getting today\'s habits:', error);
      throw new Error(`Failed to get today's habits: ${error.message}`);
    }
  }

  /**
   * Get habit completion data for calendar view
   * @param {string} habitId - Habit ID
   * @param {number} year - Year
   * @param {number} month - Month (0-11)
   * @returns {Promise<Object>} Calendar data
   */
  async getHabitCalendarData(habitId, year, month) {
    try {
      const habit = await this.getHabitById(habitId);
      const completions = habit.completions || [];
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      
      const calendarData = {
        year,
        month,
        daysInMonth,
        completions: {},
        streaks: [],
        totalCompletions: 0
      };
      
      // Mark completed days
      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = formatDateForInput(new Date(year, month, day));
        const isCompleted = completions.includes(dateString);
        
        calendarData.completions[day] = isCompleted;
        if (isCompleted) {
          calendarData.totalCompletions++;
        }
      }
      
      return calendarData;
    } catch (error) {
      console.error('Error getting habit calendar data:', error);
      throw new Error(`Failed to get habit calendar data: ${error.message}`);
    }
  }

  /**
   * Export habits to JSON
   * @returns {Promise<string>} JSON string of habits
   */
  async exportHabits() {
    try {
      const habits = await this.getAllHabits();
      return JSON.stringify(habits, null, 2);
    } catch (error) {
      console.error('Error exporting habits:', error);
      throw new Error(`Failed to export habits: ${error.message}`);
    }
  }

  /**
   * Import habits from JSON
   * @param {string} jsonData - JSON string of habits
   * @returns {Promise<Array>} Imported habits
   */
  async importHabits(jsonData) {
    try {
      const habitsToImport = JSON.parse(jsonData);
      
      if (!Array.isArray(habitsToImport)) {
        throw new Error('Invalid data format: expected array of habits');
      }
      
      const importedHabits = [];
      
      for (const habitData of habitsToImport) {
        try {
          const newHabit = await this.createHabit({
            ...habitData,
            id: undefined // Let the system generate new IDs
          });
          importedHabits.push(newHabit);
        } catch (error) {
          console.warn('Skipping invalid habit during import:', error);
        }
      }
      
      return importedHabits;
    } catch (error) {
      console.error('Error importing habits:', error);
      throw new Error(`Failed to import habits: ${error.message}`);
    }
  }

  // Local Storage Methods

  /**
   * Get habits from localStorage
   * @returns {Array} Array of habits
   */
  getHabitsFromStorage() {
    try {
      const habitsJson = localStorage.getItem(this.storageKey);
      return habitsJson ? JSON.parse(habitsJson) : [];
    } catch (error) {
      console.error('Error reading habits from storage:', error);
      return [];
    }
  }

  /**
   * Save habits to localStorage
   * @param {Array} habits - Array of habits to save
   */
  saveHabitsToStorage(habits) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits to storage:', error);
      throw new Error('Failed to save habits to local storage');
    }
  }

  /**
   * Clear all habits from localStorage
   */
  clearHabitsFromStorage() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing habits from storage:', error);
    }
  }
}

// Export singleton instance
const habitService = new HabitService();
export default habitService;

// Export class for testing
export { HabitService };