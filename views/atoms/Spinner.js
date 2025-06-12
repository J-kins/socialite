/**
 * Spinner Component
 * Loading spinner with various sizes and styles
 */

const Spinner = ({
  id = "",
  size = "md",
  variant = "default",
  className = "",
  label = "Loading...",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  // Variant classes
  const variantClasses = {
    default: "text-blue-600",
    primary: "text-blue-600",
    secondary: "text-gray-600",
    white: "text-white",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  const baseClasses = [
    "animate-spin",
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.default,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Different spinner styles
  const spinnerStyles = {
    default: `
            <svg class="${baseClasses}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ${attrs}>
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `,
    dots: `
            <div class="flex space-x-1 ${className}" ${attrs}>
                <div class="${sizeClasses[size]} ${variantClasses[variant]} rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="${sizeClasses[size]} ${variantClasses[variant]} rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="${sizeClasses[size]} ${variantClasses[variant]} rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
        `,
    pulse: `
            <div class="${baseClasses} rounded-full bg-current animate-pulse" ${attrs}></div>
        `,
  };

  const spinnerType =
    variant === "dots" || variant === "pulse" ? variant : "default";

  return `
        <div ${id ? `id="${id}"` : ""} role="status" aria-label="${label}">
            ${spinnerStyles[spinnerType]}
            <span class="sr-only">${label}</span>
        </div>
    `;
};

export default Spinner;
