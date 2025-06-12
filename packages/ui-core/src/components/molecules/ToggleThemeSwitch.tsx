import React, { forwardRef, useEffect, useState } from 'react';
import type { BaseComponentProps, Size } from '../../utils/hooks/types/component-props';

export interface ToggleThemeSwitchProps extends BaseComponentProps {
  /** Current theme value */
  value?: 'light' | 'dark' | 'auto';
  /** Default theme value */
  defaultValue?: 'light' | 'dark' | 'auto';
  /** Theme change handler */
  onChange?: (theme: 'light' | 'dark' | 'auto') => void;
  /** Switch size */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show labels */
  showLabels?: boolean;
  /** Custom labels */
  labels?: {
    light?: string;
    dark?: string;
    auto?: string;
  };
  /** Whether to show icons */
  showIcons?: boolean;
  /** Custom icons */
  icons?: {
    light?: React.ReactNode;
    dark?: React.ReactNode;
    auto?: React.ReactNode;
  };
  /** Whether switch is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Animation variant */
  animation?: 'default' | 'bounce' | 'elastic';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Whether to detect system preference */
  detectSystemPreference?: boolean;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Auto theme detection */
  autoDetect?: boolean;
}

export const ToggleThemeSwitch = forwardRef<HTMLDivElement, ToggleThemeSwitchProps>(
  (
    {
      value,
      defaultValue = 'auto',
      onChange,
      size = 'medium',
      showLabels = false,
      labels = {
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
      },
      showIcons = true,
      icons,
      disabled = false,
      loading = false,
      animation = 'default',
      color = 'primary',
      detectSystemPreference = true,
      orientation = 'horizontal',
      autoDetect = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto'>(
      value || defaultValue
    );
    const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

    // Detect system preference
    useEffect(() => {
      if (!detectSystemPreference || typeof window === 'undefined') return;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e: MediaQueryListEvent) => {
        setSystemPreference(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, [detectSystemPreference]);

    // Update currentTheme when value prop changes
    useEffect(() => {
      if (value !== undefined) {
        setCurrentTheme(value);
      }
    }, [value]);

    // Auto-apply theme to document
    useEffect(() => {
      if (!autoDetect || typeof document === 'undefined') return;

      const effectiveTheme = currentTheme === 'auto' ? systemPreference : currentTheme;

      if (effectiveTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      document.documentElement.setAttribute('data-theme', effectiveTheme);
    }, [currentTheme, systemPreference, autoDetect]);

    const baseClasses = 'toggle-theme-switch';

    const sizeClasses = {
      small: 'toggle-theme-switch--small',
      medium: 'toggle-theme-switch--medium',
      large: 'toggle-theme-switch--large',
    };

    const classes = [
      baseClasses,
      sizeClasses[size],
      showLabels && 'toggle-theme-switch--with-labels',
      disabled && 'toggle-theme-switch--disabled',
      loading && 'toggle-theme-switch--loading',
      animation !== 'default' && `toggle-theme-switch--${animation}`,
      color !== 'primary' && `toggle-theme-switch--${color}`,
      orientation === 'vertical' && 'toggle-theme-switch--vertical',
      currentTheme === 'auto' && 'toggle-theme-switch--auto',
      currentTheme === 'auto' && detectSystemPreference && `toggle-theme-switch--system`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
      if (disabled || loading) return;

      if (value === undefined) {
        setCurrentTheme(newTheme);
      }
      onChange?.(newTheme);
    };

    const getEffectiveTheme = () => {
      return currentTheme === 'auto' ? systemPreference : currentTheme;
    };

    const defaultIcons = {
      light: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      dark: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      auto: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="3"
            width="20"
            height="14"
            rx="2"
            ry="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    };

    const themeIcons = { ...defaultIcons, ...icons };

    if (orientation === 'horizontal') {
      return (
        <div ref={ref} className={classes} role="group" aria-label="Theme selection" {...props}>
          <div className="toggle-theme-switch__options">
            {(['light', 'dark', 'auto'] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                role="radio"
                aria-checked={currentTheme === theme}
                className={`toggle-theme-switch__option ${
                  currentTheme === theme ? 'toggle-theme-switch__option--active' : ''
                }`}
                onClick={() => handleThemeChange(theme)}
                disabled={disabled || loading}
                aria-label={`Switch to ${theme} theme`}
              >
                {showIcons && (
                  <span className="toggle-theme-switch__icon">{themeIcons[theme]}</span>
                )}
                {showLabels && <span className="toggle-theme-switch__label">{labels[theme]}</span>}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Binary toggle for light/dark only
    const isActive = getEffectiveTheme() === 'dark';

    return (
      <div
        ref={ref}
        className={classes}
        role="switch"
        aria-checked={isActive}
        aria-label="Toggle theme"
        onClick={() => handleThemeChange(isActive ? 'light' : 'dark')}
        {...props}
      >
        {showLabels && (
          <span
            className={`toggle-theme-switch__label ${
              !isActive ? 'toggle-theme-switch__label--active' : ''
            }`}
          >
            {labels.light}
          </span>
        )}

        <div className="toggle-theme-switch__track">
          <div className="toggle-theme-switch__thumb">
            {loading ? (
              <svg
                className="toggle-theme-switch__spinner"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="32"
                  strokeDashoffset="32"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    dur="2s"
                    values="0 32;16 16;0 32;0 32"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    dur="2s"
                    values="0;-16;-32;-32"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            ) : showIcons ? (
              <>
                <span className="toggle-theme-switch__icon toggle-theme-switch__icon--sun">
                  {themeIcons.light}
                </span>
                <span className="toggle-theme-switch__icon toggle-theme-switch__icon--moon">
                  {themeIcons.dark}
                </span>
              </>
            ) : null}
          </div>
        </div>

        {showLabels && (
          <span
            className={`toggle-theme-switch__label ${
              isActive ? 'toggle-theme-switch__label--active' : ''
            }`}
          >
            {labels.dark}
          </span>
        )}
      </div>
    );
  }
);

ToggleThemeSwitch.displayName = 'ToggleThemeSwitch';

export default ToggleThemeSwitch;
