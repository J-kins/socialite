import React from "react";

export interface NotificationDotProps {
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "red" | "blue" | "green" | "yellow";
  className?: string;
  children?: React.ReactNode;
}

/**
 * NotificationDot component for displaying notification counts
 * Used in headers, navigation, and user interfaces
 */
export const NotificationDot: React.FC<NotificationDotProps> = ({
  count = 0,
  maxCount = 99,
  showZero = false,
  dot = false,
  size = "md",
  color = "red",
  className = "",
  children,
}) => {
  const shouldShow = dot || count > 0 || (count === 0 && showZero);

  if (!shouldShow) {
    return <>{children}</>;
  }

  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-xs",
    lg: "w-6 h-6 text-sm",
  };

  const colorClasses = {
    red: "bg-red-500 text-white",
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    yellow: "bg-yellow-500 text-white",
  };

  const baseClasses = [
    "absolute",
    "-top-1",
    "-right-1",
    "flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "font-medium",
    "border-2",
    "border-white",
    "dark:border-gray-800",
    sizeClasses[size],
    colorClasses[color],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const displayCount = dot
    ? ""
    : count > maxCount
      ? `${maxCount}+`
      : count.toString();

  if (children) {
    return (
      <div className="relative inline-block">
        {children}
        <span className={baseClasses}>{!dot && displayCount}</span>
      </div>
    );
  }

  return <span className={baseClasses}>{!dot && displayCount}</span>;
};

export default NotificationDot;
