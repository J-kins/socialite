import { ReactNode } from 'react';

/**
 * Theme Component Props Types
 *
 * Comprehensive type definitions for theme-related components including
 * theme providers, theme toggles, and theme-aware components.
 */

// Theme mode types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// Base theme props
export interface BaseThemeProps {
  /** Unique identifier for the component */
  id?: string;
  /** CSS class names */
  className?: string;
  /** Test identifier */
  'data-testid'?: string;
  /** Current theme mode */
  theme?: ThemeMode;
  /** Whether component is disabled */
  disabled?: boolean;
}

// Theme provider props
export interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  /** Default theme mode */
  defaultTheme?: ThemeMode;
  /** localStorage key for theme persistence */
  storageKey?: string;
  /** Whether to persist theme in localStorage */
  enablePersistence?: boolean;
  /** Whether to detect system theme preference */
  enableSystemTheme?: boolean;
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
  /** Custom CSS variables for each theme */
  cssVariables?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  /** Theme transition configuration */
  transition?: {
    duration?: number;
    property?: string;
    easing?: string;
    disabled?: boolean;
  };
  /** Theme configuration */
  config?: {
    colors?: {
      light?: Record<string, string>;
      dark?: Record<string, string>;
    };
    fonts?: Record<string, string>;
    spacing?: Record<string, string>;
    breakpoints?: Record<string, string>;
  };

  // Event handlers
  /** Called when theme changes */
  onThemeChange?: (theme: ThemeMode, resolvedTheme: ResolvedTheme) => void;
  /** Called when theme is loaded from storage */
  onThemeLoad?: (theme: ThemeMode) => void;
  /** Called when system theme changes */
  onSystemThemeChange?: (systemTheme: ResolvedTheme) => void;
}

// Theme toggle button props
export interface ThemeToggleProps extends BaseThemeProps {
  /** Toggle variant */
  variant?: 'button' | 'switch' | 'dropdown' | 'icon' | 'text';
  /** Component size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Toggle modes available */
  modes?: ThemeMode[];
  /** Whether to include system theme option */
  includeSystem?: boolean;
  /** Icons for each theme mode */
  icons?: {
    light?: ReactNode;
    dark?: ReactNode;
    system?: ReactNode;
  };
  /** Labels for each theme mode */
  labels?: {
    light?: string;
    dark?: string;
    system?: string;
  };
  /** Current theme mode */
  currentTheme?: ThemeMode;
  /** Whether to show current theme label */
  showLabel?: boolean;
  /** Whether to show tooltip */
  showTooltip?: boolean;
  /** Tooltip content */
  tooltip?: string | Record<ThemeMode, string>;
  /** Animation for theme changes */
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'flip';
  /** Animation duration */
  animationDuration?: number;
  /** Button shape (for button variant) */
  shape?: 'square' | 'circle' | 'rounded';
  /** Color scheme for the toggle itself */
  colorScheme?: 'primary' | 'secondary' | 'neutral';
  /** Whether toggle adapts to current theme */
  adaptive?: boolean;

  // Event handlers
  /** Called when theme is toggled */
  onToggle?: (newTheme: ThemeMode) => void;
  /** Called when dropdown is opened (for dropdown variant) */
  onDropdownOpen?: () => void;
  /** Called when dropdown is closed (for dropdown variant) */
  onDropdownClose?: () => void;
}

// Theme selector props
export interface ThemeSelectorProps extends BaseThemeProps {
  /** Available theme options */
  themes: Array<{
    mode: ThemeMode;
    label: string;
    description?: string;
    icon?: ReactNode;
    preview?: ReactNode;
    disabled?: boolean;
  }>;
  /** Currently selected theme */
  selectedTheme?: ThemeMode;
  /** Selector layout */
  layout?: 'grid' | 'list' | 'carousel' | 'dropdown';
  /** Number of columns (for grid layout) */
  columns?: number;
  /** Whether to show theme previews */
  showPreviews?: boolean;
  /** Preview size */
  previewSize?: 'sm' | 'md' | 'lg';
  /** Whether to show descriptions */
  showDescriptions?: boolean;
  /** Whether selection is multiple (for custom themes) */
  multiple?: boolean;
  /** Whether to group themes by category */
  grouped?: boolean;
  /** Theme groups */
  groups?: Array<{
    label: string;
    themes: ThemeMode[];
  }>;
  /** Animation for selection changes */
  selectionAnimation?: 'none' | 'highlight' | 'scale' | 'glow';

  // Event handlers
  /** Called when theme is selected */
  onThemeSelect?: (theme: ThemeMode) => void;
  /** Called when theme preview is hovered */
  onPreviewHover?: (theme: ThemeMode) => void;
  /** Called when custom theme is created */
  onCustomThemeCreate?: (theme: any) => void;
}

// Theme preview props
export interface ThemePreviewProps extends BaseThemeProps {
  /** Theme to preview */
  previewTheme: ThemeMode;
  /** Preview content type */
  contentType?: 'sample' | 'current' | 'custom';
  /** Custom preview content */
  children?: ReactNode;
  /** Preview size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Preview shape */
  shape?: 'square' | 'circle' | 'rounded';
  /** Whether preview is interactive */
  interactive?: boolean;
  /** Whether to show theme name */
  showName?: boolean;
  /** Whether to show color palette */
  showColors?: boolean;
  /** Whether to show border */
  showBorder?: boolean;
  /** Border color */
  borderColor?: string;
  /** Shadow configuration */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether preview is selected */
  selected?: boolean;
  /** Selection indicator style */
  selectionStyle?: 'border' | 'checkmark' | 'highlight' | 'glow';

  // Event handlers
  /** Called when preview is clicked */
  onClick?: (theme: ThemeMode) => void;
  /** Called when preview is hovered */
  onHover?: (theme: ThemeMode) => void;
  /** Called when preview receives focus */
  onFocus?: (theme: ThemeMode) => void;
}

// Theme aware component props
export interface ThemeAwareProps extends BaseThemeProps {
  /** Component variants for different themes */
  variants?: {
    light?: any;
    dark?: any;
  };
  /** Whether to automatically adapt to theme changes */
  autoAdapt?: boolean;
  /** Custom theme styles */
  themeStyles?: {
    light?: Record<string, any>;
    dark?: Record<string, any>;
  };
  /** Custom theme classes */
  themeClasses?: {
    light?: string;
    dark?: string;
  };
  /** Whether to use theme-aware colors */
  useThemeColors?: boolean;
  /** Whether to use theme-aware fonts */
  useThemeFonts?: boolean;
  /** Whether to use theme-aware spacing */
  useThemeSpacing?: boolean;

  // Event handlers
  /** Called when component adapts to theme change */
  onThemeAdapt?: (theme: ResolvedTheme) => void;
}

// Color scheme props
export interface ColorSchemeProps extends BaseThemeProps {
  /** Color scheme name */
  scheme: string;
  /** Primary colors for the scheme */
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  /** Secondary colors */
  secondary?: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  /** Accent colors */
  accent?: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  /** Neutral/gray colors */
  neutral?: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  /** Semantic colors */
  semantic?: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  /** Whether scheme supports dark mode */
  supportsDarkMode?: boolean;
  /** Dark mode color overrides */
  darkModeColors?: Partial<ColorSchemeProps>;
}

// Theme customizer props
export interface ThemeCustomizerProps extends BaseThemeProps {
  /** Current theme configuration */
  currentTheme: any;
  /** Available customization options */
  options: {
    colors?: boolean;
    fonts?: boolean;
    spacing?: boolean;
    borderRadius?: boolean;
    shadows?: boolean;
  };
  /** Customizer layout */
  layout?: 'sidebar' | 'modal' | 'drawer' | 'inline';
  /** Whether to show live preview */
  showPreview?: boolean;
  /** Whether to show code export */
  showCodeExport?: boolean;
  /** Export formats available */
  exportFormats?: Array<'css' | 'scss' | 'json' | 'js' | 'ts'>;
  /** Whether changes are applied in real-time */
  realTimeUpdates?: boolean;
  /** Whether to show reset option */
  showReset?: boolean;
  /** Whether to show save/load options */
  showSaveLoad?: boolean;
  /** Predefined theme templates */
  templates?: Array<{
    name: string;
    description: string;
    theme: any;
  }>;

  // Event handlers
  /** Called when theme is customized */
  onThemeChange?: (theme: any) => void;
  /** Called when theme is reset */
  onReset?: () => void;
  /** Called when theme is saved */
  onSave?: (theme: any, name: string) => void;
  /** Called when theme is loaded */
  onLoad?: (theme: any) => void;
  /** Called when theme is exported */
  onExport?: (theme: any, format: string) => void;
}

// Dark mode toggle props (simplified)
export interface DarkModeToggleProps extends BaseThemeProps {
  /** Toggle size */
  size?: 'sm' | 'md' | 'lg';
  /** Toggle variant */
  variant?: 'switch' | 'button' | 'icon';
  /** Icon for light mode */
  lightIcon?: ReactNode;
  /** Icon for dark mode */
  darkIcon?: ReactNode;
  /** Whether to show labels */
  showLabels?: boolean;
  /** Custom labels */
  labels?: {
    light?: string;
    dark?: string;
  };
  /** Whether dark mode is currently active */
  isDark?: boolean;
  /** Animation type */
  animation?: 'none' | 'slide' | 'fade' | 'flip';

  // Event handlers
  /** Called when dark mode is toggled */
  onToggle?: (isDark: boolean) => void;
}

// Export all types
export type {
  ThemeMode,
  ResolvedTheme,
  BaseThemeProps,
  ThemeProviderProps,
  ThemeToggleProps,
  ThemeSelectorProps,
  ThemePreviewProps,
  ThemeAwareProps,
  ColorSchemeProps,
  ThemeCustomizerProps,
  DarkModeToggleProps,
};
