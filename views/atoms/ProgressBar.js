/**
 * ProgressBar Component
 * Progress indicator with customizable appearance
 */

const ProgressBar = ({
  id = "",
  progress = 0,
  max = 100,
  size = "md",
  variant = "primary",
  showLabel = false,
  label = "",
  animated = false,
  className = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-6",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    error: "bg-red-600",
  };

  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  const baseClasses = [
    "w-full",
    "bg-gray-200",
    "rounded-full",
    "dark:bg-gray-700",
    sizeClasses[size] || sizeClasses.md,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const progressClasses = [
    variantClasses[variant] || variantClasses.primary,
    "rounded-full",
    sizeClasses[size] || sizeClasses.md,
    "transition-all",
    "duration-300",
    "ease-out",
    animated ? "animate-pulse" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const displayLabel = label || `${Math.round(percentage)}%`;

  return `
        <div class="${showLabel ? "space-y-2" : ""}">
            ${
              showLabel
                ? `
                <div class="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>${displayLabel}</span>
                    <span>${Math.round(percentage)}%</span>
                </div>
            `
                : ""
            }
            
            <div
                ${id ? `id="${id}"` : ""}
                class="${baseClasses}"
                role="progressbar"
                aria-valuenow="${progress}"
                aria-valuemin="0"
                aria-valuemax="${max}"
                ${attrs}
            >
                <div
                    class="${progressClasses}"
                    style="width: ${percentage}%"
                ></div>
            </div>
        </div>
    `;
};

export default ProgressBar;
