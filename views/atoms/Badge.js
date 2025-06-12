/**
 * Badge Component
 * Small status indicators and labels
 */

const Badge = ({
  id = "",
  text = "",
  variant = "default",
  size = "md",
  rounded = true,
  className = "",
  onClick = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  };

  const baseClasses = [
    "inline-flex",
    "items-center",
    "font-medium",
    "leading-none",
    rounded ? "rounded-full" : "rounded",
    onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.default,
  ].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <span
            ${id ? `id="${id}"` : ""}
            class="${classes}"
            ${onClick ? `onclick="${onClick}"` : ""}
            ${attrs}
        >
            ${text}
        </span>
    `;
};

export default Badge;
