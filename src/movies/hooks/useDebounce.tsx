import { useEffect, useState } from "react";

/**
 * useDebounce
 *
 * Custom hook to debounce a value.
 * Useful for delaying actions like API calls until the user stops typing.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before updating the debounced value
 * @returns debouncedValue - The latest value after the debounce delay
 */
export function useDebounce<T>(value: T, delay: number) {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timeout to update the debounced value after `delay` ms
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup: clear timeout if value or delay changes before timeout completes
    return () => clearTimeout(handler);
  }, [value, delay]); // Re-run effect if `value` or `delay` changes

  return debouncedValue;
}
