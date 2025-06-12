/**
 * CloseButton Component
 * Close button with X icon
 */

import Icon from "./Icon.js";

const CloseButton = ({
  id = "",
  size = "md",
  variant = "ghost",
  className = "",
  onClick = "",
  ariaLabel = "Close",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "w-6 h-6 p-1",
    md: "w-8 h-8 p-1.5",
    lg: "w-10 h-10 p-2",
  };

  // Variant classes
  const variantClasses = {
    ghost: [
      "text-gray-400",
      "hover:text-gray-600",
      "dark:text-gray-500",
      "dark:hover:text-gray-300",
      "hover:bg-gray-100",
      "dark:hover:bg-gray-700",
    ],
    solid: [
      "text-white",
      "bg-gray-600",
      "hover:bg-gray-700",
      "dark:bg-gray-500",
      "dark:hover:bg-gray-400",
    ],
  };

  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "transition-colors",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:ring-offset-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    ...(variantClasses[variant] || variantClasses.ghost),
  ].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const iconSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";

  return `
        <button
            ${id ? `id="${id}"` : ""}
            type="button"
            class="${classes}"
            aria-label="${ariaLabel}"
            ${onClick ? `onclick="${onClick}"` : ""}
            ${attrs}
        >
            ${Icon({
              name: "close",
              type: "svg",
              size: iconSize,
            })}
        </button>
    `;
};

export default CloseButton;
