import React from "react";
import { Icon, Badge } from "../atoms";

export interface CreatePostOptionProps {
  icon: string;
  label: string;
  description?: string;
  badge?: string | number;
  color?: "blue" | "green" | "purple" | "red" | "yellow" | "pink" | "indigo";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CreatePostOption: React.FC<CreatePostOptionProps> = ({
  icon,
  label,
  description,
  badge,
  color = "blue",
  disabled = false,
  onClick,
  className = "",
}) => {
  const getColorClass = () => {
    const colors = {
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        icon: "text-blue-600 dark:text-blue-400",
        hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
      },
      green: {
        bg: "bg-green-50 dark:bg-green-900/20",
        icon: "text-green-600 dark:text-green-400",
        hover: "hover:bg-green-100 dark:hover:bg-green-900/30",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        icon: "text-purple-600 dark:text-purple-400",
        hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      },
      red: {
        bg: "bg-red-50 dark:bg-red-900/20",
        icon: "text-red-600 dark:text-red-400",
        hover: "hover:bg-red-100 dark:hover:bg-red-900/30",
      },
      yellow: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        icon: "text-yellow-600 dark:text-yellow-400",
        hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
      },
      pink: {
        bg: "bg-pink-50 dark:bg-pink-900/20",
        icon: "text-pink-600 dark:text-pink-400",
        hover: "hover:bg-pink-100 dark:hover:bg-pink-900/30",
      },
      indigo: {
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        icon: "text-indigo-600 dark:text-indigo-400",
        hover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
      },
    };
    return colors[color];
  };

  const colorClasses = getColorClass();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center space-x-4 p-4 rounded-lg transition-all duration-200
        ${colorClasses.bg} ${!disabled && colorClasses.hover}
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        }
        ${className}
      `}
    >
      {/* Icon Container */}
      <div
        className={`
        flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
        ${colorClasses.bg} border-2 border-current border-opacity-20
      `}
      >
        <Icon name={icon} className={`w-6 h-6 ${colorClasses.icon}`} />
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
          {badge && (
            <Badge variant="primary" size="sm">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0">
        <Icon
          name="chevron-forward"
          className="w-5 h-5 text-gray-400 dark:text-gray-500"
        />
      </div>
    </button>
  );
};
