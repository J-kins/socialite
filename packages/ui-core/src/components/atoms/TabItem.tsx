import React from "react";
import { Icon } from "./Icon";
import { Badge } from "./Badge";

export interface TabItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isActive?: boolean;
  icon?: string;
  badge?: string | number;
  variant?: "default" | "pills" | "underline" | "bordered";
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
  className?: string;
}

export const TabItem: React.FC<TabItemProps> = ({
  children,
  isActive = false,
  icon,
  badge,
  variant = "default",
  size = "md",
  orientation = "horizontal",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const getSizeClass = () => {
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };
    return sizes[size];
  };

  const getVariantClass = () => {
    if (variant === "pills") {
      return isActive
        ? "bg-blue-600 text-white rounded-full"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full";
    }

    if (variant === "underline") {
      return isActive
        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600";
    }

    if (variant === "bordered") {
      return isActive
        ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent rounded-lg";
    }

    // Default variant
    return isActive
      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"
      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg";
  };

  const getOrientationClass = () => {
    if (orientation === "vertical") {
      return "flex-col justify-start w-full text-left";
    }
    return "flex-row justify-center text-center";
  };

  return (
    <button
      type="button"
      className={`
        ${getSizeClass()}
        ${getVariantClass()}
        ${getOrientationClass()}
        ${fullWidth ? "w-full" : ""}
        inline-flex items-center gap-2 font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      {...props}
    >
      {icon && (
        <Icon
          name={icon}
          className={`
            ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}
            ${orientation === "vertical" ? "mr-0" : ""}
          `}
        />
      )}

      <span className={orientation === "vertical" ? "mt-1" : ""}>
        {children}
      </span>

      {badge && (
        <Badge
          variant={isActive ? "primary" : "secondary"}
          size="sm"
          className={orientation === "vertical" ? "ml-auto" : ""}
        >
          {badge}
        </Badge>
      )}
    </button>
  );
};
