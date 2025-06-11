import React from "react";
import { Icon, Badge } from "../atoms";

export interface SocialActionButtonProps {
  action: "like" | "comment" | "share" | "save" | "react";
  isActive?: boolean;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "filled";
  disabled?: boolean;
  onClick?: () => void;
  customIcon?: string;
  customLabel?: string;
  className?: string;
}

export const SocialActionButton: React.FC<SocialActionButtonProps> = ({
  action,
  isActive = false,
  count = 0,
  showCount = true,
  size = "md",
  variant = "default",
  disabled = false,
  onClick,
  customIcon,
  customLabel,
  className = "",
}) => {
  const getActionConfig = () => {
    const configs = {
      like: {
        icon: isActive ? "heart" : "heart-outline",
        label: "Like",
        activeColor: "text-red-500",
        activeBg: "bg-red-50 dark:bg-red-900/20",
      },
      comment: {
        icon: "chatbubble-outline",
        label: "Comment",
        activeColor: "text-blue-500",
        activeBg: "bg-blue-50 dark:bg-blue-900/20",
      },
      share: {
        icon: "share-outline",
        label: "Share",
        activeColor: "text-green-500",
        activeBg: "bg-green-50 dark:bg-green-900/20",
      },
      save: {
        icon: isActive ? "bookmark" : "bookmark-outline",
        label: "Save",
        activeColor: "text-yellow-500",
        activeBg: "bg-yellow-50 dark:bg-yellow-900/20",
      },
      react: {
        icon: "happy-outline",
        label: "React",
        activeColor: "text-purple-500",
        activeBg: "bg-purple-50 dark:bg-purple-900/20",
      },
    };

    return configs[action];
  };

  const getSizeClass = () => {
    const sizes = {
      sm: {
        button: "px-2 py-1.5 text-xs",
        icon: "w-4 h-4",
        gap: "gap-1",
      },
      md: {
        button: "px-3 py-2 text-sm",
        icon: "w-5 h-5",
        gap: "gap-2",
      },
      lg: {
        button: "px-4 py-2.5 text-base",
        icon: "w-6 h-6",
        gap: "gap-2",
      },
    };
    return sizes[size];
  };

  const getVariantClass = () => {
    const config = getActionConfig();

    if (variant === "filled") {
      return isActive
        ? `${config.activeBg} ${config.activeColor} border border-current border-opacity-20`
        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700";
    }

    if (variant === "minimal") {
      return isActive
        ? config.activeColor
        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300";
    }

    // Default variant
    return isActive
      ? `${config.activeBg} ${config.activeColor}`
      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white";
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const config = getActionConfig();
  const sizeClasses = getSizeClass();
  const variantClasses = getVariantClass();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses.button} ${variantClasses}
        inline-flex items-center ${sizeClasses.gap} font-medium rounded-lg
        transition-all duration-200 
        ${variant !== "minimal" ? "hover:scale-105" : ""}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
      aria-label={`${customLabel || config.label}${count > 0 ? ` (${count})` : ""}`}
    >
      {/* Icon */}
      <Icon
        name={customIcon || config.icon}
        className={`${sizeClasses.icon} transition-transform duration-200 ${
          isActive && action === "like" ? "animate-pulse" : ""
        }`}
      />

      {/* Label (only for larger sizes and default variant) */}
      {size !== "sm" && variant === "default" && (
        <span className="font-medium">{customLabel || config.label}</span>
      )}

      {/* Count */}
      {showCount && count > 0 && (
        <span className={`font-medium ${size === "sm" ? "text-xs" : ""}`}>
          {formatCount(count)}
        </span>
      )}

      {/* Badge for high counts */}
      {count > 999 && variant === "minimal" && (
        <Badge variant="secondary" size="sm">
          {formatCount(count)}
        </Badge>
      )}
    </button>
  );
};
