import { useState, useCallback } from "react";

export type UseToggleReturn = [
  boolean,
  {
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
    setValue: (value: boolean) => void;
  },
];

/**
 * A custom hook for managing boolean state with convenient toggle functions
 *
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple containing the current value and an object with toggle functions
 *
 * @example
 * ```tsx
 * const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);
 *
 * return (
 *   <div>
 *     <button onClick={toggle}>Toggle</button>
 *     <button onClick={setTrue}>Open</button>
 *     <button onClick={setFalse}>Close</button>
 *     {isOpen && <div>Content is visible</div>}
 *   </div>
 * );
 * ```
 */
export const useToggle = (initialValue: boolean = false): UseToggleReturn => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const setValueCallback = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [
    value,
    {
      toggle,
      setTrue,
      setFalse,
      setValue: setValueCallback,
    },
  ];
};

/**
 * Hook for managing multiple toggle states
 *
 * @param initialStates - Object with initial boolean states
 * @returns Object with current states and toggle functions
 *
 * @example
 * ```tsx
 * const { states, toggle, setTrue, setFalse } = useMultipleToggle({
 *   modal: false,
 *   sidebar: true,
 *   dropdown: false
 * });
 *
 * return (
 *   <div>
 *     <button onClick={() => toggle('modal')}>Toggle Modal</button>
 *     <button onClick={() => setTrue('sidebar')}>Open Sidebar</button>
 *     {states.modal && <Modal />}
 *   </div>
 * );
 * ```
 */
export const useMultipleToggle = <T extends Record<string, boolean>>(
  initialStates: T,
) => {
  const [states, setStates] = useState<T>(initialStates);

  const toggle = useCallback((key: keyof T) => {
    setStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const setTrue = useCallback((key: keyof T) => {
    setStates((prev) => ({
      ...prev,
      [key]: true,
    }));
  }, []);

  const setFalse = useCallback((key: keyof T) => {
    setStates((prev) => ({
      ...prev,
      [key]: false,
    }));
  }, []);

  const setValue = useCallback((key: keyof T, value: boolean) => {
    setStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    setStates(initialStates);
  }, [initialStates]);

  return {
    states,
    toggle,
    setTrue,
    setFalse,
    setValue,
    reset,
  };
};

/**
 * Hook for managing a toggle with localStorage persistence
 *
 * @param key - localStorage key
 * @param initialValue - fallback initial value if not found in localStorage
 * @returns Same as useToggle but with localStorage persistence
 */
export const usePersistedToggle = (
  key: string,
  initialValue: boolean = false,
): UseToggleReturn => {
  const [value, setValue] = useState<boolean>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setPersistedValue = useCallback(
    (newValue: boolean) => {
      setValue(newValue);

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    [key],
  );

  const toggle = useCallback(() => {
    setPersistedValue(!value);
  }, [value, setPersistedValue]);

  const setTrue = useCallback(() => {
    setPersistedValue(true);
  }, [setPersistedValue]);

  const setFalse = useCallback(() => {
    setPersistedValue(false);
  }, [setPersistedValue]);

  return [
    value,
    {
      toggle,
      setTrue,
      setFalse,
      setValue: setPersistedValue,
    },
  ];
};
