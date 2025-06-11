import React from "react";

export interface BadgeProps {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Badge component for notifications, status indicators, and labels
 * Matches the notification badges in the existing design
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  size = "md",
  dot = false,
  children,
  className = "",
}) => {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "font-medium",
    "rounded-full",
  ];

  const sizeClasses = {
    sm: dot ? "w-2 h-2" : "px-2 py-0.5 text-xs min-w-[16px] h-4",
    md: dot ? "w-2.5 h-2.5" : "px-2.5 py-1 text-xs min-w-[20px] h-5",
    lg: dot ? "w-3 h-3" : "px-3 py-1.5 text-sm min-w-[24px] h-6",
  };

  const variantClasses = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-cyan-500 text-white",
  };

  const classes = [
    ...baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // For dot badges, don't render children
  if (dot) {
    return <span className={classes} />;
  }

  return <span className={classes}>{children}</span>;
};

export default Badge;
