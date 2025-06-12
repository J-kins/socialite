/**
 * Link Component
 * Styled hyperlinks with various appearances
 */

const Link = ({
  id = "",
  href = "#",
  text = "",
  target = "",
  variant = "default",
  size = "md",
  underline = true,
  className = "",
  onClick = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Variant classes
  const variantClasses = {
    default: [
      "text-blue-600",
      "dark:text-blue-400",
      "hover:text-blue-800",
      "dark:hover:text-blue-300",
    ],
    muted: [
      "text-gray-600",
      "dark:text-gray-400",
      "hover:text-gray-800",
      "dark:hover:text-gray-200",
    ],
    danger: [
      "text-red-600",
      "dark:text-red-400",
      "hover:text-red-800",
      "dark:hover:text-red-300",
    ],
    success: [
      "text-green-600",
      "dark:text-green-400",
      "hover:text-green-800",
      "dark:hover:text-green-300",
    ],
  };

  const baseClasses = [
    "transition-colors",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:ring-offset-2",
    "rounded",
    underline ? "hover:underline" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    ...(variantClasses[variant] || variantClasses.default),
  ].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <a
            ${id ? `id="${id}"` : ""}
            href="${href}"
            ${target ? `target="${target}"` : ""}
            class="${classes}"
            ${onClick ? `onclick="${onClick}"` : ""}
            ${attrs}
        >
            ${text}
        </a>
    `;
};

export default Link;
