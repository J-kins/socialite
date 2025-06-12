/**
 * Divider Component
 * Visual separator element
 */

const Divider = ({
  id = "",
  orientation = "horizontal",
  variant = "default",
  className = "",
  text = "",
  ...props
} = {}) => {
  // Orientation classes
  const orientationClasses = {
    horizontal: "w-full h-px",
    vertical: "h-full w-px",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-gray-200 dark:bg-gray-700",
    light: "bg-gray-100 dark:bg-gray-800",
    dark: "bg-gray-300 dark:bg-gray-600",
  };

  const baseClasses = [
    "flex-shrink-0",
    orientationClasses[orientation],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // If text is provided, create a divider with text
  if (text && orientation === "horizontal") {
    return `
            <div class="relative flex items-center ${className}">
                <div class="flex-grow border-t ${variantClasses[variant]}"></div>
                <span class="px-3 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                    ${text}
                </span>
                <div class="flex-grow border-t ${variantClasses[variant]}"></div>
            </div>
        `;
  }

  return `
        <div
            ${id ? `id="${id}"` : ""}
            class="${baseClasses}"
            ${attrs}
        ></div>
    `;
};

export default Divider;
