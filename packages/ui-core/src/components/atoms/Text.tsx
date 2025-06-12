import React from "react";

export interface TextProps {
  as?: "p" | "span" | "div" | "small" | "strong" | "em";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "muted" | "danger" | "success" | "warning";
  align?: "left" | "center" | "right" | "justify";
  truncate?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Text component for consistent typography
 * Provides standardized text styling across the application
 */
export const Text: React.FC<TextProps> = ({
  as: Component = "p",
  size = "base",
  weight = "normal",
  color = "primary",
  align = "left",
  truncate = false,
  children,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorClasses = {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-600 dark:text-gray-400",
    danger: "text-red-600 dark:text-red-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const baseClasses = [
    sizeClasses[size],
    weightClasses[weight],
    colorClasses[color],
    alignClasses[align],
    truncate ? "truncate" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={baseClasses} {...props}>
      {children}
    </Component>
  );
};

export default Text;
