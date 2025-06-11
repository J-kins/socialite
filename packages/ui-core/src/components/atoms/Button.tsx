import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Button component that matches the existing Socialite design
 * Maintains all the existing styling while providing a clean API
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-lg",
    "font-medium",
    "transition-all",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "disabled:opacity-60",
    "disabled:cursor-not-allowed",
  ];

  // Size variants matching existing design
  const sizeClasses = {
    sm: ["px-3", "py-1.5", "text-sm", "h-8"],
    md: ["px-4", "py-2", "text-sm", "h-10"],
    lg: ["px-6", "py-3", "text-base", "h-12"],
  };

  // Color variants matching existing design
  const variantClasses = {
    primary: [
      "bg-blue-600",
      "text-white",
      "border-transparent",
      "hover:bg-blue-700",
      "focus:ring-blue-500",
      "shadow-sm",
    ],
    secondary: [
      "bg-gray-100",
      "text-gray-900",
      "border-transparent",
      "hover:bg-gray-200",
      "focus:ring-gray-500",
      "dark:bg-gray-700",
      "dark:text-gray-100",
      "dark:hover:bg-gray-600",
    ],
    outline: [
      "bg-transparent",
      "text-gray-700",
      "border",
      "border-gray-300",
      "hover:bg-gray-50",
      "focus:ring-gray-500",
      "dark:text-gray-300",
      "dark:border-gray-600",
      "dark:hover:bg-gray-800",
    ],
    ghost: [
      "bg-transparent",
      "text-gray-700",
      "border-transparent",
      "hover:bg-gray-100",
      "focus:ring-gray-500",
      "dark:text-gray-300",
      "dark:hover:bg-gray-800",
    ],
    danger: [
      "bg-red-600",
      "text-white",
      "border-transparent",
      "hover:bg-red-700",
      "focus:ring-red-500",
      "shadow-sm",
    ],
  };

  const classes = [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || loading;

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {leftIcon && !loading && (
        <span className="mr-2 flex-shrink-0">{leftIcon}</span>
      )}

      <span className={loading ? "opacity-75" : ""}>{children}</span>

      {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
