/**
 * Input Component
 * Versatile input field with various types and states
 */

const Input = ({
  id = "",
  type = "text",
  placeholder = "",
  value = "",
  name = "",
  disabled = false,
  required = false,
  className = "",
  size = "md",
  variant = "default",
  leftIcon = "",
  rightIcon = "",
  onChange = "",
  onFocus = "",
  onBlur = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-4 py-3 text-base h-12",
  };

  // Variant classes
  const variantClasses = {
    default: [
      "border-gray-300",
      "focus:border-blue-500",
      "focus:ring-blue-500",
    ],
    error: ["border-red-300", "focus:border-red-500", "focus:ring-red-500"],
    success: [
      "border-green-300",
      "focus:border-green-500",
      "focus:ring-green-500",
    ],
  };

  const baseClasses = [
    "block",
    "w-full",
    "rounded-lg",
    "border",
    "bg-white",
    "dark:bg-gray-800",
    "dark:border-gray-600",
    "dark:text-white",
    "placeholder-gray-400",
    "dark:placeholder-gray-500",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-0",
    "transition-colors",
    "duration-200",
    "disabled:opacity-60",
    "disabled:cursor-not-allowed",
  ];

  const classes = [
    ...baseClasses,
    ...variantClasses[variant],
    sizeClasses[size],
    leftIcon ? "pl-10" : "",
    rightIcon ? "pr-10" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const inputElement = `
        <input
            ${id ? `id="${id}"` : ""}
            type="${type}"
            ${name ? `name="${name}"` : ""}
            ${placeholder ? `placeholder="${placeholder}"` : ""}
            ${value ? `value="${value}"` : ""}
            class="${classes}"
            ${disabled ? "disabled" : ""}
            ${required ? "required" : ""}
            ${onChange ? `onchange="${onChange}"` : ""}
            ${onFocus ? `onfocus="${onFocus}"` : ""}
            ${onBlur ? `onblur="${onBlur}"` : ""}
            ${attrs}
        />
    `;

  // If no icons, return simple input
  if (!leftIcon && !rightIcon) {
    return inputElement;
  }

  // Return wrapped input with icons
  return `
        <div class="relative">
            ${
              leftIcon
                ? `
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    ${leftIcon}
                </div>
            `
                : ""
            }
            
            ${inputElement}
            
            ${
              rightIcon
                ? `
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    ${rightIcon}
                </div>
            `
                : ""
            }
        </div>
    `;
};

export default Input;
