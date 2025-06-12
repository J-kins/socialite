/**
 * NotificationDot Component
 * Small indicator dot for notifications
 */

const NotificationDot = ({
  id = "",
  count = 0,
  showCount = false,
  size = "md",
  variant = "primary",
  position = "top-right",
  className = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: showCount ? "w-5 h-5 text-xs" : "w-2 h-2",
    md: showCount ? "w-6 h-6 text-xs" : "w-3 h-3",
    lg: showCount ? "w-7 h-7 text-sm" : "w-4 h-4",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-600 text-white",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-600 text-white",
  };

  // Position classes (for when used as overlay)
  const positionClasses = {
    "top-right": "-top-1 -right-1",
    "top-left": "-top-1 -left-1",
    "bottom-right": "-bottom-1 -right-1",
    "bottom-left": "-bottom-1 -left-1",
  };

  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "font-medium",
    "leading-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.primary,
    positionClasses[position] ? `absolute ${positionClasses[position]}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Don't show if count is 0 and showCount is true
  if (showCount && count === 0) {
    return "";
  }

  const displayCount = count > 99 ? "99+" : count;

  return `
        <span
            ${id ? `id="${id}"` : ""}
            class="${classes}"
            ${attrs}
        >
            ${showCount && count > 0 ? displayCount : ""}
        </span>
    `;
};

export default NotificationDot;
