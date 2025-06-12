// Export all components
export * from './components/atoms';
export * from './components/molecules';
export * from './components/organisms';
export * from './components/templates';

// Export all utilities and hooks
export * from './utils';

// Import all styles (side effects only)
import './styles/base/reset.css';
import './styles/base/typography.css';
import './styles/base/variables.css';
import './styles/base/global.css';

// Import all component styles
import './styles/atoms';
import './styles/molecules';
import './styles/organisms';
import './styles/templates';

// Import utility styles
import './styles/utilities/spacing.css';
import './styles/utilities/position.css';
import './styles/utilities/visibility.css';
import './styles/utilities/flex.css';
import './styles/utilities/transform-origin.css';
import './styles/utilities/ripple-effect.css';

// Import animation styles
import './styles/animations/fade.css';
import './styles/animations/scale.css';
import './styles/animations/slide.css';
import './styles/animations/kenburns.css';
import './styles/animations/shake.css';
import './styles/animations/stroke.css';

// Import transition styles
import './styles/transitions/fade.css';
import './styles/transitions/scale.css';
import './styles/transitions/slide.css';
import './styles/transitions/modal.css';
import './styles/transitions/simplebar.css';

// Import theme styles
import './styles/themes/light.css';
import './styles/themes/dark.css';

// Version information
export const VERSION = '1.0.0';

// Package metadata
export const PACKAGE_NAME = '@socialite/ui-core';
export const DESCRIPTION =
  'Nexify UI Core Components - A comprehensive React/Angular component library following atomic design principles';
export const AUTHOR = 'Socialite Team';
export const LICENSE = 'MIT';

// Feature flags for conditional exports
export const FEATURES = {
  REACT_COMPONENTS: true,
  ANGULAR_COMPONENTS: true, // Grid/Table view components
  TAILWIND_CSS: true,
  POSTCSS: true,
  DARK_MODE: true,
  ANIMATIONS: true,
  RESPONSIVE_DESIGN: true,
  ACCESSIBILITY: true,
  TYPESCRIPT: true,
} as const;

// Configuration options
export interface UIConfig {
  theme?: 'light' | 'dark' | 'auto';
  animations?: boolean;
  rippleEffects?: boolean;
  responsiveBreakpoints?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  colorPalette?: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// Default configuration
export const DEFAULT_CONFIG: UIConfig = {
  theme: 'auto',
  animations: true,
  rippleEffects: true,
  responsiveBreakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  colorPalette: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#d946ef',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
  },
};

// Utility function to configure the UI library
export function configureUI(config: Partial<UIConfig> = {}): UIConfig {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Apply theme
  if (mergedConfig.theme && typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', mergedConfig.theme);

    if (mergedConfig.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mergedConfig.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (mergedConfig.theme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  // Apply animations preference
  if (typeof document !== 'undefined') {
    if (mergedConfig.animations === false) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.documentElement.style.setProperty('--transition-duration', '0s');
    }

    if (mergedConfig.rippleEffects === false) {
      document.documentElement.setAttribute('data-ripple-disabled', 'true');
    }
  }

  // Apply color palette
  if (mergedConfig.colorPalette && typeof document !== 'undefined') {
    const root = document.documentElement;
    Object.entries(mergedConfig.colorPalette).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  return mergedConfig;
}

// Initialize with default configuration
if (typeof window !== 'undefined') {
  // Auto-configure on import in browser environment
  configureUI();
}

// Export types for TypeScript users
export type {
  BaseComponentProps,
  ButtonProps,
  InputProps,
  ModalProps,
  CardProps,
  AvatarProps,
  BadgeProps,
  TooltipProps,
  DropdownProps,
  TableProps,
  FormControlProps,
  AnimationProps,
  ResponsiveValue,
  Size,
  ColorVariant,
  ThemeVariant,
  CommonHTMLProps,
  ThemeProps,
  LayoutProps,
  SpacingProps,
  TypographyProps,
  PositionProps,
  BorderProps,
  ShadowProps,
  TransformProps,
  TransitionProps,
  StyleProps,
  ComponentProps,
  EventHandlers,
} from './utils/hooks/types/component-props';

// Export hook return types
export type {
  UseSliderOptions,
  UseSliderReturn,
  LightboxImage,
  UseLightboxOptions,
  UseLightboxReturn,
} from './utils';

// Re-export everything for convenience
export default {
  VERSION,
  PACKAGE_NAME,
  DESCRIPTION,
  FEATURES,
  DEFAULT_CONFIG,
  configureUI,
};
