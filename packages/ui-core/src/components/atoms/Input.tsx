import React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outline";
  error?: boolean;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Input component that matches the existing Socialite design
 * Maintains the rounded, bordered style from the existing forms
 */
export const Input: React.FC<InputProps> = ({
  size = "md",
  variant = "default",
  error = false,
  helperText,
  label,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Size variants matching existing design
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-3 py-2 text-sm h-10",
    lg: "px-4 py-3 text-base h-12",
  };

  // Variant styles matching existing design
  const variantClasses = {
    default: [
      "border",
      "border-gray-300",
      "bg-white",
      "dark:bg-gray-800",
      "dark:border-gray-600",
    ],
    filled: ["border-0", "bg-gray-100", "dark:bg-gray-700"],
    outline: [
      "border-2",
      "border-gray-200",
      "bg-transparent",
      "dark:border-gray-700",
    ],
  };

  const baseClasses = [
    "rounded-lg",
    "transition-colors",
    "duration-200",
    "placeholder:text-gray-500",
    "dark:placeholder:text-gray-400",
    "text-gray-900",
    "dark:text-gray-100",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:border-transparent",
    "disabled:opacity-60",
    "disabled:cursor-not-allowed",
  ];

  // Error styles
  const errorClasses = error
    ? ["border-red-300", "focus:border-red-300", "focus:ring-red-500"]
    : [];

  // Icon padding adjustments
  const iconPaddingClasses = {
    left: leftIcon ? "pl-10" : "",
    right: rightIcon ? "pr-10" : "",
  };

  const inputClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...errorClasses,
    sizeClasses[size],
    iconPaddingClasses.left,
    iconPaddingClasses.right,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{leftIcon}</span>
          </div>
        )}

        <input id={inputId} className={inputClasses} {...props} />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">
              {rightIcon}
            </span>
          </div>
        )}
      </div>

      {helperText && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
