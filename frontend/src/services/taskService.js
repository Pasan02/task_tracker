import apiService from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import { 
  createNewTask, 
  updateTask, 
  getTaskStats,
  filterTasks,
  sortTasks 
} from '../utils/taskHelper';
import { validateTask } from '../utils/validators';

/**
 * Task service for managing task operations
 * Handles both localStorage and API communication
 */
class TaskService {
  constructor() {
    this.storageKey = STORAGE_KEYS.TASKS;
    this.useLocalStorage = apiService.useLocalStorage;
  }

  /**
   * Get all tasks
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Array>} Array of tasks
   */
  async getAllTasks(filters = {}) {
    try {
      if (this.useLocalStorage) {
        let tasks = this.getTasksFromStorage();
        
        // Apply filters if provided
        if (Object.keys(filters).length > 0) {
          tasks = filterTasks(tasks, filters);
        }
        
        return tasks;
      }

      // API call for production
      const response = await apiService.get(API_ENDPOINTS.TASKS, filters);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
  }

  /**
   * Get task by ID
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Task object
   */
  async getTaskById(taskId) {
    try {
      if (this.useLocalStorage) {
        const tasks = this.getTasksFromStorage();
        const task = tasks.find(task => task.id === taskId);
        
        if (!task) {
          throw new Error('Task not found');
        }
        
        return task;
      }

      // API call for production
      const response = await apiService.get(`${API_ENDPOINTS.TASKS}/${taskId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error(`Failed to fetch task: ${error.message}`);
    }
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    try {
      // Validate task data
      const validationErrors = validateTask(taskData);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error(`Validation failed: ${Object.values(validationErrors).join(', ')}`);
      }

      if (this.useLocalStorage) {
        const newTask = createNewTask(taskData);
        const tasks = this.getTasksFromStorage();
        
        tasks.push(newTask);
        this.saveTasksToStorage(tasks);
        
        return newTask;
      }

      // API call for production
      const response = await apiService.post(API_ENDPOINTS.TASKS, taskData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  /**
   * Update an existing task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(taskId, updates) {
    try {
      // Validate updates
      const validationErrors = validateTask({ ...updates, id: taskId });
      if (Object.keys(validationErrors).length > 0) {
        throw new Error(`Validation failed: ${Object.values(validationErrors).join(', ')}`);
      }

      if (this.useLocalStorage) {
        const tasks = this.getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }
        
        const existingTask = tasks[taskIndex];
        const updatedTask = updateTask(existingTask, updates);
        
        tasks[taskIndex] = updatedTask;
        this.saveTasksToStorage(tasks);
        
        return updatedTask;
      }

      // API call for production
      const response = await apiService.put(`${API_ENDPOINTS.TASKS}/${taskId}`, updates);
      return response.data || response;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTask(taskId) {
    try {
      if (this.useLocalStorage) {
        const tasks = this.getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }
        
        tasks.splice(taskIndex, 1);
        this.saveTasksToStorage(tasks);
        
        return true;
      }

      // API call for production
      await apiService.delete(`${API_ENDPOINTS.TASKS}/${taskId}`);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  /**
   * Toggle task status
   * @param {string} taskId - Task ID
   * @param {string} newStatus - New status
   * @returns {Promise<Object>} Updated task
   */
  async toggleTaskStatus(taskId, newStatus) {
    try {
      return await this.updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw new Error(`Failed to toggle task status: ${error.message}`);
    }
  }

  /**
   * Get task statistics
   * @returns {Promise<Object>} Task statistics
   */
  async getTaskStatistics() {
    try {
      const tasks = await this.getAllTasks();
      return getTaskStats(tasks);
    } catch (error) {
      console.error('Error getting task statistics:', error);
      throw new Error(`Failed to get task statistics: ${error.message}`);
    }
  }

  /**
   * Search tasks
   * @param {string} query - Search query
   * @param {Object} additionalFilters - Additional filters
   * @returns {Promise<Array>} Filtered tasks
   */
  async searchTasks(query, additionalFilters = {}) {
    try {
      const filters = {
        ...additionalFilters,
        search: query
      };
      
      return await this.getAllTasks(filters);
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw new Error(`Failed to search tasks: ${error.message}`);
    }
  }

  /**
   * Get filtered and sorted tasks
   * @param {Object} filters - Filters to apply
   * @param {string} sortBy - Sort field
   * @param {string} sortOrder - Sort order
   * @returns {Promise<Array>} Processed tasks
   */
  async getFilteredTasks(filters = {}, sortBy = 'dueDate', sortOrder = 'asc') {
    try {
      let tasks = await this.getAllTasks();
      
      // Apply filters
      if (Object.keys(filters).length > 0) {
        tasks = filterTasks(tasks, filters);
      }
      
      // Apply sorting
      tasks = sortTasks(tasks, sortBy, sortOrder);
      
      return tasks;
    } catch (error) {
      console.error('Error getting filtered tasks:', error);
      throw new Error(`Failed to get filtered tasks: ${error.message}`);
    }
  }

  /**
   * Bulk update tasks
   * @param {Array} updates - Array of {id, updates} objects
   * @returns {Promise<Array>} Updated tasks
   */
  async bulkUpdateTasks(updates) {
    try {
      if (this.useLocalStorage) {
        const tasks = this.getTasksFromStorage();
        const updatedTasks = [];
        
        for (const { id, updates: taskUpdates } of updates) {
          const taskIndex = tasks.findIndex(task => task.id === id);
          if (taskIndex !== -1) {
            const existingTask = tasks[taskIndex];
            const updatedTask = updateTask(existingTask, taskUpdates);
            tasks[taskIndex] = updatedTask;
            updatedTasks.push(updatedTask);
          }
        }
        
        this.saveTasksToStorage(tasks);
        return updatedTasks;
      }

      // API call for production
      const response = await apiService.post(`${API_ENDPOINTS.TASKS}/bulk-update`, { updates });
      return response.data || response;
    } catch (error) {
      console.error('Error bulk updating tasks:', error);
      throw new Error(`Failed to bulk update tasks: ${error.message}`);
    }
  }

  /**
   * Export tasks to JSON
   * @returns {Promise<string>} JSON string of tasks
   */
  async exportTasks() {
    try {
      const tasks = await this.getAllTasks();
      return JSON.stringify(tasks, null, 2);
    } catch (error) {
      console.error('Error exporting tasks:', error);
      throw new Error(`Failed to export tasks: ${error.message}`);
    }
  }

  /**
   * Import tasks from JSON
   * @param {string} jsonData - JSON string of tasks
   * @returns {Promise<Array>} Imported tasks
   */
  async importTasks(jsonData) {
    try {
      const tasksToImport = JSON.parse(jsonData);
      
      if (!Array.isArray(tasksToImport)) {
        throw new Error('Invalid data format: expected array of tasks');
      }
      
      const importedTasks = [];
      
      for (const taskData of tasksToImport) {
        try {
          const newTask = await this.createTask({
            ...taskData,
            id: undefined // Let the system generate new IDs
          });
          importedTasks.push(newTask);
        } catch (error) {
          console.warn('Skipping invalid task during import:', error);
        }
      }
      
      return importedTasks;
    } catch (error) {
      console.error('Error importing tasks:', error);
      throw new Error(`Failed to import tasks: ${error.message}`);
    }
  }

  // Local Storage Methods

  /**
   * Get tasks from localStorage
   * @returns {Array} Array of tasks
   */
  getTasksFromStorage() {
    try {
      const tasksJson = localStorage.getItem(this.storageKey);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error reading tasks from storage:', error);
      return [];
    }
  }

  /**
   * Save tasks to localStorage
   * @param {Array} tasks - Array of tasks to save
   */
  saveTasksToStorage(tasks) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
      throw new Error('Failed to save tasks to local storage');
    }
  }

  /**
   * Clear all tasks from localStorage
   */
  clearTasksFromStorage() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing tasks from storage:', error);
    }
  }
}

// Export singleton instance
const taskService = new TaskService();
export default taskService;

// Export class for testing
export { TaskService };