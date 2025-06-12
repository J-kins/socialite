import React from "react";
import { Icon, Switch } from "../atoms";

export interface ToggleThemeSwitchProps {
  isDark: boolean;
  onToggle: (isDark: boolean) => void;
  variant?: "switch" | "button" | "icon";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  labels?: {
    light: string;
    dark: string;
  };
  className?: string;
}

export const ToggleThemeSwitch: React.FC<ToggleThemeSwitchProps> = ({
  isDark,
  onToggle,
  variant = "switch",
  size = "md",
  showLabels = true,
  labels = {
    light: "Light",
    dark: "Dark",
  },
  className = "",
}) => {
  const getSizeClass = () => {
    const sizes = {
      sm: {
        button: "w-8 h-8",
        icon: "w-4 h-4",
        text: "text-sm",
      },
      md: {
        button: "w-10 h-10",
        icon: "w-5 h-5",
        text: "text-base",
      },
      lg: {
        button: "w-12 h-12",
        icon: "w-6 h-6",
        text: "text-lg",
      },
    };
    return sizes[size];
  };

  const sizeClasses = getSizeClass();

  if (variant === "icon") {
    return (
      <button
        onClick={() => onToggle(!isDark)}
        className={`
          ${sizeClasses.button} ${sizeClasses.text}
          flex items-center justify-center rounded-full
          text-gray-600 dark:text-gray-400 
          hover:text-gray-900 dark:hover:text-white
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800
          ${className}
        `}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <Icon
          name={isDark ? "sunny" : "moon"}
          className={`${sizeClasses.icon} transition-transform duration-200 ${isDark ? "rotate-180" : "rotate-0"}`}
        />
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={() => onToggle(!isDark)}
        className={`
          ${sizeClasses.text}
          flex items-center space-x-3 px-4 py-2 rounded-lg
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-800
          border border-gray-200 dark:border-gray-700
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800
          ${className}
        `}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <Icon
          name={isDark ? "sunny" : "moon"}
          className={`${sizeClasses.icon} transition-transform duration-200`}
        />
        {showLabels && (
          <span className="font-medium">
            {isDark ? labels.light : labels.dark} mode
          </span>
        )}
        <Icon name="chevron-forward" className="w-4 h-4 text-gray-400" />
      </button>
    );
  }

  // Switch variant (default)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showLabels && (
        <div className="flex items-center space-x-2">
          <Icon
            name="sunny"
            className={`${sizeClasses.icon} transition-colors duration-200 ${
              !isDark ? "text-yellow-500" : "text-gray-400 dark:text-gray-500"
            }`}
          />
          <span
            className={`${sizeClasses.text} font-medium transition-colors duration-200 ${
              !isDark
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {labels.light}
          </span>
        </div>
      )}

      <Switch
        checked={isDark}
        onChange={onToggle}
        size={size}
        aria-label="Toggle dark mode"
      />

      {showLabels && (
        <div className="flex items-center space-x-2">
          <span
            className={`${sizeClasses.text} font-medium transition-colors duration-200 ${
              isDark
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {labels.dark}
          </span>
          <Icon
            name="moon"
            className={`${sizeClasses.icon} transition-colors duration-200 ${
              isDark ? "text-blue-500" : "text-gray-400 dark:text-gray-500"
            }`}
          />
        </div>
      )}
    </div>
  );
};
