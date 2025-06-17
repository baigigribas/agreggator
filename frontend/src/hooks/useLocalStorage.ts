// Custom React hook for storing data in browser's local storage
// This lets us save data that persists even when user closes the browser

import { useState } from 'react';

// Helper to recursively convert listing ids to numbers
function fixListingIds<T>(data: T, key: string): T {
  if (key === 'listings' && Array.isArray(data)) {
    return data.map((item: any) =>
      typeof item.id === 'string'
        ? { ...item, id: Number(item.id) }
        : item
    ) as T;
  }
  return data;
}

// Generic function that works with any data type (T represents the type)
export function useLocalStorage<T>(key: string, initialValue: T) {
  
  // State to store the current value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Try to get existing value from localStorage
      const item = window.localStorage.getItem(key);
      
      // If item exists, parse it from JSON string back to original type
      // If not, use the initial value provided
      let value = item ? JSON.parse(item) : initialValue;
      value = fixListingIds(value, key);
      return value;
    } catch (error) {
      // If there's an error reading from localStorage, log it and use initial value
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Function to update the stored value
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function for updating based on previous value
      // This is similar to how setState works in React
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update the state
      setStoredValue(valueToStore);
      
      // Save to localStorage as JSON string
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // If there's an error saving to localStorage, log it
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Return the current value and the function to update it
  // This follows the same pattern as React's useState hook
  return [storedValue, setValue] as const;
}