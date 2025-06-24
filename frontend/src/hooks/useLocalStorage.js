import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with JSON serialization
 * Provides automatic serialization/deserialization and error handling
 */
const useLocalStorage = (key, initialValue = null) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (valueToStore === null || valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove the key from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Get the current value without subscribing to changes
  const getValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // Check if the key exists in localStorage
  const hasValue = useCallback(() => {
    return window.localStorage.getItem(key) !== null;
  }, [key]);

  // Get the size of the stored value in bytes
  const getSize = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? new Blob([item]).size : 0;
    } catch (error) {
      console.error(`Error calculating size for localStorage key "${key}":`, error);
      return 0;
    }
  }, [key]);

  // Update stored value when localStorage changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === window.localStorage) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    getValue,
    hasValue,
    getSize
  };
};

/**
 * Hook for managing multiple localStorage keys as a single object
 * Useful for managing related data that should be updated together
 */
export const useLocalStorageState = (keys, initialValues = {}) => {
  const [state, setState] = useState(() => {
    const initial = {};
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(key);
        initial[key] = item ? JSON.parse(item) : (initialValues[key] || null);
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        initial[key] = initialValues[key] || null;
      }
    });
    return initial;
  });

  const updateState = useCallback((updates) => {
    setState(prevState => {
      const newState = { ...prevState, ...updates };
      
      // Update localStorage for each changed key
      Object.keys(updates).forEach(key => {
        try {
          if (updates[key] === null || updates[key] === undefined) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(updates[key]));
          }
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      });
      
      return newState;
    });
  }, []);

  const clearState = useCallback(() => {
    keys.forEach(key => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
      }
    });
    setState(initialValues);
  }, [keys, initialValues]);

  return {
    state,
    updateState,
    clearState
  };
};

/**
 * Hook for caching data in localStorage with expiration
 */
export const useLocalStorageCache = (key, fetchFunction, options = {}) => {
  const {
    maxAge = 5 * 60 * 1000, // 5 minutes default
    staleWhileRevalidate = false
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCachedData = useCallback(() => {
    try {
      const cached = window.localStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        if (age < maxAge) {
          return { data, isStale: false };
        } else if (staleWhileRevalidate) {
          return { data, isStale: true };
        }
      }
      return null;
    } catch (error) {
      console.error(`Error reading cache for key "${key}":`, error);
      return null;
    }
  }, [key, maxAge, staleWhileRevalidate]);

  const setCachedData = useCallback((data) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now()
      };
      window.localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error(`Error setting cache for key "${key}":`, error);
    }
  }, [key]);

  const fetchData = useCallback(async (force = false) => {
    // Check cache first unless forced
    if (!force) {
      const cached = getCachedData();
      if (cached && !cached.isStale) {
        setData(cached.data);
        return cached.data;
      }
      
      if (cached && cached.isStale) {
        setData(cached.data); // Set stale data immediately
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);
      setCachedData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, getCachedData, setCachedData]);

  const clearCache = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setData(null);
    } catch (error) {
      console.error(`Error clearing cache for key "${key}":`, error);
    }
  }, [key]);

  // Load cached data on mount
  useEffect(() => {
    const cached = getCachedData();
    if (cached) {
      setData(cached.data);
      
      // If stale, fetch new data in background
      if (cached.isStale && staleWhileRevalidate) {
        fetchData(true);
      }
    }
  }, [getCachedData, fetchData, staleWhileRevalidate]);

  return {
    data,
    loading,
    error,
    fetchData,
    clearCache,
    refetch: () => fetchData(true)
  };
};

export default useLocalStorage;