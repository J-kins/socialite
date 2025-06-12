import React from "react";

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient" | "striped" | "animated";
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo" | "pink";
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  backgroundColor?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "md",
  variant = "default",
  color = "blue",
  showLabel = false,
  showPercentage = false,
  label,
  backgroundColor,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getSizeClass = () => {
    const sizes = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
      xl: "h-4",
    };
    return sizes[size];
  };

  const getColorClass = () => {
    const colors = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500",
      pink: "bg-pink-500",
    };
    return colors[color];
  };

  const getGradientClass = () => {
    const gradients = {
      blue: "bg-gradient-to-r from-blue-400 to-blue-600",
      green: "bg-gradient-to-r from-green-400 to-green-600",
      yellow: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      red: "bg-gradient-to-r from-red-400 to-red-600",
      purple: "bg-gradient-to-r from-purple-400 to-purple-600",
      indigo: "bg-gradient-to-r from-indigo-400 to-indigo-600",
      pink: "bg-gradient-to-r from-pink-400 to-pink-600",
    };
    return gradients[color];
  };

  const getBackgroundClass = () => {
    if (backgroundColor) return backgroundColor;
    return "bg-gray-200 dark:bg-gray-700";
  };

  const getProgressClass = () => {
    let baseClass = "h-full transition-all duration-500 ease-out rounded-full";

    if (variant === "gradient") {
      baseClass += ` ${getGradientClass()}`;
    } else if (variant === "striped") {
      baseClass += ` ${getColorClass()} bg-striped`;
    } else if (variant === "animated") {
      baseClass += ` ${getColorClass()} bg-striped animate-progress`;
    } else {
      baseClass += ` ${getColorClass()}`;
    }

    return baseClass;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and Percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {showLabel && label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div
        className={`
          ${getSizeClass()}
          ${getBackgroundClass()}
          w-full rounded-full overflow-hidden
        `}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
      >
        <div
          className={getProgressClass()}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Value Display for larger sizes */}
      {size === "xl" && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference"
          style={{ width: `${percentage}%` }}
        >
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};
