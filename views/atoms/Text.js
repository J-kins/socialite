/**
 * Text Component
 * Versatile text display with various semantic elements
 */

const Text = ({
  id = "",
  content = "",
  element = "p",
  size = "md",
  weight = "normal",
  color = "default",
  align = "left",
  className = "",
  truncate = false,
  maxLines = null,
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  // Weight variants
  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  // Color variants
  const colorClasses = {
    default: "text-gray-900 dark:text-gray-100",
    muted: "text-gray-600 dark:text-gray-400",
    primary: "text-blue-600 dark:text-blue-400",
    secondary: "text-gray-500 dark:text-gray-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
  };

  // Alignment classes
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const baseClasses = [
    sizeClasses[size] || sizeClasses.md,
    weightClasses[weight] || weightClasses.normal,
    colorClasses[color] || colorClasses.default,
    alignClasses[align] || alignClasses.left,
    truncate ? "truncate" : "",
    maxLines ? `line-clamp-${maxLines}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Choose appropriate HTML element
  const validElements = [
    "p",
    "span",
    "div",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "strong",
    "em",
    "small",
  ];
  const tag = validElements.includes(element) ? element : "p";

  return `
        <${tag}
            ${id ? `id="${id}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            ${content}
        </${tag}>
    `;
};

export default Text;
