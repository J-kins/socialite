/**
 * Hooks Index
 *
 * Central export point for all React hooks in the UI Core library.
 * Provides easy access to all custom hooks for state management,
 * UI interactions, and utility functions.
 */

// Core hooks
export { useModal, useMultipleModals, useConfirmModal } from './use-modal';
export type { UseModalOptions, UseModalReturn } from './use-modal';

export { useToggle, useMultipleToggle, usePersistedToggle } from './use-toggle';
export type { UseToggleReturn } from './use-toggle';

export { useSlider } from './use-slider';
export type { UseSliderOptions, UseSliderReturn } from './use-slider';

export { useLightbox } from './use-lightbox';
export type {
  LightboxImage,
  UseLightboxOptions,
  UseLightboxReturn,
} from './use-lightbox';

// File upload hooks
export { useFileUpload } from './useFileUpload';
export type {
  UseFileUploadOptions,
  UseFileUploadReturn,
} from './useFileUpload';

// Post interaction hooks
export { usePostInteraction } from './usePostInteraction';
export type {
  UsePostInteractionOptions,
  UsePostInteractionReturn,
} from './usePostInteraction';

// Drag and drop hooks
export { useDragDrop, useFileDrop, useSortable } from './useDragDrop';
export type {
  DragDropOptions,
  DragDropState,
  DragDropHandlers,
  UseDragDropReturn,
} from './useDragDrop';

// Scroll spy hooks
export { useScrollSpy, useAutoScrollSpy } from './useScrollSpy';
export type {
  ScrollSpyOptions,
  ScrollSpySection,
  UseScrollSpyReturn,
} from './useScrollSpy';

// Theme hooks
export {
  useTheme,
  useThemeContext,
  useThemeStyles,
  useThemeMediaQuery,
  usePrefersReducedMotion,
  createThemeProvider,
} from './useTheme';
export type {
  ThemeMode,
  ResolvedTheme,
  ThemeConfig,
  ThemeContextValue,
  UseThemeReturn,
} from './useTheme';

// Type exports
export * from './types/component-props';
export * from './types/file-upload-props';
export * from './types/post-props';
export * from './types/drag-drop-props';
export * from './types/scroll-spy-props';
export * from './types/theme-props';

// Re-export default hooks for convenience
export { default as useModal } from './use-modal';
export { default as useToggle } from './use-toggle';
export { default as useSlider } from './use-slider';
export { default as useLightbox } from './use-lightbox';
export { default as useFileUpload } from './useFileUpload';
export { default as usePostInteraction } from './usePostInteraction';
export { default as useDragDrop } from './useDragDrop';
export { default as useScrollSpy } from './useScrollSpy';
export { default as useTheme } from './useTheme';

// Utility functions that work with hooks
export const createHookFactory = <T extends (...args: any[]) => any>(
  hook: T,
  defaultOptions: Partial<Parameters<T>[0]> = {},
) => {
  return (options: Partial<Parameters<T>[0]> = {}) => {
    return hook({ ...defaultOptions, ...options });
  };
};

// Hook composition utilities
export const combineHooks = <T extends Record<string, any>>(hooks: T): T => {
  return hooks;
};

// Hook debugging utilities
export const debugHook = <T>(hookResult: T, label?: string): T => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Hook Debug${label ? ` - ${label}` : ''}]:`, hookResult);
  }
  return hookResult;
};

// Common hook patterns
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

// Import React for useLayoutEffect
import React from 'react';

// Hook for window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for media queries
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
};

// Hook for local storage
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = React.useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
};

// Hook for session storage
export const useSessionStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = React.useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
};

// Hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

// Hook for mounting state
export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
};

// Hook for async operations
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) => {
  const [status, setStatus] = React.useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<E | null>(null);

  const execute = React.useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error as E);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
};
