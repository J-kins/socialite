/**
 * Tag Component
 * Hashtag or category tag display
 */

const Tag = ({
  id = "",
  text = "",
  variant = "default",
  size = "md",
  removable = false,
  className = "",
  onClick = "",
  onRemove = "",
  ...props
} = {}) => {
  const tagId = id || `tag-${Math.random().toString(36).substr(2, 9)}`;

  // Size variants
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    hashtag:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  };

  const baseClasses = [
    "tag",
    "inline-flex",
    "items-center",
    "font-medium",
    "rounded-full",
    "transition-colors",
    "duration-200",
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.default,
    onClick ? "cursor-pointer hover:opacity-80" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <span
            ${id ? `id="${tagId}"` : ""}
            class="${baseClasses}"
            ${onClick ? `onclick="${onClick}"` : ""}
            ${attrs}
        >
            ${text || "Tag"}
            ${
              removable
                ? `
                <button
                    type="button"
                    class="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-current hover:bg-black hover:bg-opacity-20 rounded-full transition-colors duration-200"
                    onclick="${onRemove || `document.getElementById('${tagId}').remove()`}"
                    aria-label="Remove tag"
                >
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            `
                : ""
            }
        </span>
    `;
};

export default Tag;
