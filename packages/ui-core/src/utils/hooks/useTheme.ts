import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeConfig {
  /** Initial theme mode */
  defaultTheme?: ThemeMode;
  /** Whether to persist theme in localStorage */
  storageKey?: string;
  /** Custom media query for system theme detection */
  systemThemeQuery?: string;
  /** Whether to add theme class to document element */
  addThemeClass?: boolean;
  /** Custom theme class names */
  themeClasses?: {
    light?: string;
    dark?: string;
  };
  /** Whether to add color-scheme CSS property */
  addColorScheme?: boolean;
  /** Custom CSS variables to update */
  cssVariables?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  /** Transition duration for theme changes */
  transitionDuration?: number;
  /** Whether to disable transitions during theme change */
  disableTransitions?: boolean;
}

export interface ThemeContextValue {
  /** Current theme mode (light, dark, or system) */
  theme: ThemeMode;
  /** Resolved theme (light or dark) */
  resolvedTheme: ResolvedTheme;
  /** Function to set theme mode */
  setTheme: (theme: ThemeMode) => void;
  /** Function to toggle between light and dark */
  toggleTheme: () => void;
  /** Whether system theme is available */
  systemThemeAvailable: boolean;
  /** Current system theme preference */
  systemTheme: ResolvedTheme;
  /** Whether theme is being loaded from storage */
  isLoading: boolean;
}

export interface UseThemeReturn extends ThemeContextValue {
  /** Function to cycle through theme modes */
  cycleTheme: () => void;
  /** Function to check if a specific theme is active */
  isTheme: (theme: ResolvedTheme) => boolean;
  /** Function to get theme-specific value */
  getThemeValue: <T>(lightValue: T, darkValue: T) => T;
}

// Default configuration
const DEFAULT_CONFIG: Required<ThemeConfig> = {
  defaultTheme: 'system',
  storageKey: 'theme',
  systemThemeQuery: '(prefers-color-scheme: dark)',
  addThemeClass: true,
  themeClasses: {
    light: 'light',
    dark: 'dark',
  },
  addColorScheme: true,
  cssVariables: {
    light: {},
    dark: {},
  },
  transitionDuration: 300,
  disableTransitions: true,
};

// Theme context
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Hook for theme management with system preference detection and persistence
 */
export const useTheme = (config: ThemeConfig = {}): UseThemeReturn => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const {
    defaultTheme,
    storageKey,
    systemThemeQuery,
    addThemeClass,
    themeClasses,
    addColorScheme,
    cssVariables,
    transitionDuration,
    disableTransitions,
  } = mergedConfig;

  // State
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  const systemThemeAvailable = isBrowser && 'matchMedia' in window;

  /**
   * Gets the resolved theme (light or dark)
   */
  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? systemTheme : (theme as ResolvedTheme);

  /**
   * Detects system theme preference
   */
  const detectSystemTheme = useCallback((): ResolvedTheme => {
    if (!systemThemeAvailable) return 'light';

    const mediaQuery = window.matchMedia(systemThemeQuery);
    return mediaQuery.matches ? 'dark' : 'light';
  }, [systemThemeAvailable, systemThemeQuery]);

  /**
   * Loads theme from localStorage
   */
  const loadThemeFromStorage = useCallback((): ThemeMode => {
    if (!isBrowser) return defaultTheme;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as ThemeMode;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }

    return defaultTheme;
  }, [isBrowser, storageKey, defaultTheme]);

  /**
   * Saves theme to localStorage
   */
  const saveThemeToStorage = useCallback(
    (themeToSave: ThemeMode) => {
      if (!isBrowser) return;

      try {
        localStorage.setItem(storageKey, themeToSave);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    },
    [isBrowser, storageKey],
  );

  /**
   * Applies theme to document
   */
  const applyTheme = useCallback(
    (targetTheme: ResolvedTheme) => {
      if (!isBrowser) return;

      const documentElement = document.documentElement;

      // Disable transitions temporarily if configured
      let originalTransition: string | null = null;
      if (disableTransitions) {
        originalTransition =
          documentElement.style.getPropertyValue('transition');
        documentElement.style.setProperty('transition', 'none', 'important');
      }

      // Add theme class
      if (addThemeClass) {
        const { light: lightClass, dark: darkClass } = themeClasses;
        documentElement.classList.remove(lightClass, darkClass);
        documentElement.classList.add(
          targetTheme === 'dark' ? darkClass : lightClass,
        );
      }

      // Add color-scheme CSS property
      if (addColorScheme) {
        documentElement.style.setProperty('color-scheme', targetTheme);
      }

      // Apply CSS variables
      const variables = cssVariables[targetTheme];
      if (variables) {
        Object.entries(variables).forEach(([property, value]) => {
          documentElement.style.setProperty(property, value);
        });
      }

      // Restore transitions
      if (disableTransitions) {
        // Force reflow
        documentElement.offsetHeight;

        if (originalTransition) {
          documentElement.style.setProperty('transition', originalTransition);
        } else {
          documentElement.style.removeProperty('transition');
        }
      }
    },
    [
      isBrowser,
      addThemeClass,
      themeClasses,
      addColorScheme,
      cssVariables,
      disableTransitions,
    ],
  );

  /**
   * Sets the theme mode
   */
  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      saveThemeToStorage(newTheme);

      // Apply theme immediately if not system, or if system then use current system theme
      const themeToApply =
        newTheme === 'system' ? systemTheme : (newTheme as ResolvedTheme);
      applyTheme(themeToApply);
    },
    [saveThemeToStorage, systemTheme, applyTheme],
  );

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    if (theme === 'system') {
      // If currently system, toggle to opposite of current system theme
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme, systemTheme, setTheme]);

  /**
   * Cycles through all theme modes
   */
  const cycleTheme = useCallback(() => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme(modes[nextIndex]);
  }, [theme, setTheme]);

  /**
   * Checks if a specific theme is currently active
   */
  const isTheme = useCallback(
    (targetTheme: ResolvedTheme): boolean => {
      return resolvedTheme === targetTheme;
    },
    [resolvedTheme],
  );

  /**
   * Gets theme-specific value
   */
  const getThemeValue = useCallback(
    <T>(lightValue: T, darkValue: T): T => {
      return resolvedTheme === 'dark' ? darkValue : lightValue;
    },
    [resolvedTheme],
  );

  // Initialize theme on mount
  useEffect(() => {
    if (!isBrowser) {
      setIsLoading(false);
      return;
    }

    // Detect system theme
    const detectedSystemTheme = detectSystemTheme();
    setSystemTheme(detectedSystemTheme);

    // Load theme from storage
    const storedTheme = loadThemeFromStorage();
    setThemeState(storedTheme);

    // Apply initial theme
    const initialResolvedTheme =
      storedTheme === 'system'
        ? detectedSystemTheme
        : (storedTheme as ResolvedTheme);
    applyTheme(initialResolvedTheme);

    setIsLoading(false);
  }, [isBrowser, detectSystemTheme, loadThemeFromStorage, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!systemThemeAvailable) return;

    const mediaQuery = window.matchMedia(systemThemeQuery);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);

      // If current theme is system, apply the new system theme
      if (theme === 'system') {
        applyTheme(newSystemTheme);
      }
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, [systemThemeAvailable, systemThemeQuery, theme, applyTheme]);

  // Apply theme when resolved theme changes
  useEffect(() => {
    if (!isLoading) {
      applyTheme(resolvedTheme);
    }
  }, [resolvedTheme, applyTheme, isLoading]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    cycleTheme,
    systemThemeAvailable,
    systemTheme,
    isLoading,
    isTheme,
    getThemeValue,
  };
};

/**
 * Hook to access theme context
 */
export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }

  return context;
};

/**
 * Theme provider component factory
 */
export const createThemeProvider = (config: ThemeConfig = {}) => {
  // This would be implemented in React components that use this hook
  // The actual JSX provider would be created in a separate React component file
  return {
    config,
    useThemeValue: () => useTheme(config),
  };
};

/**
 * Hook for theme-aware CSS-in-JS styling
 */
export const useThemeStyles = <T extends Record<string, any>>(styles: {
  light: T;
  dark: T;
}): T => {
  const { resolvedTheme } = useTheme();
  return styles[resolvedTheme];
};

/**
 * Hook for theme-aware media queries
 */
export const useThemeMediaQuery = (
  lightQuery: string,
  darkQuery: string,
): boolean => {
  const { resolvedTheme } = useTheme();
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = resolvedTheme === 'dark' ? darkQuery : lightQuery;
    const mediaQuery = window.matchMedia(query);

    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [lightQuery, darkQuery, resolvedTheme]);

  return matches;
};

/**
 * Hook for detecting if user prefers reduced motion
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

export default useTheme;
