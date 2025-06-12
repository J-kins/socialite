/**
 * Label Component
 * Form label with optional required indicator
 */

const Label = ({
  id = "",
  htmlFor = "",
  text = "",
  required = false,
  className = "",
  size = "md",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const baseClasses = [
    "block",
    "font-medium",
    "text-gray-700",
    "dark:text-gray-300",
    "mb-1",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [baseClasses, sizeClasses[size]].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <label
            ${id ? `id="${id}"` : ""}
            ${htmlFor ? `for="${htmlFor}"` : ""}
            class="${classes}"
            ${attrs}
        >
            ${text}
            ${required ? '<span class="text-red-500 ml-1">*</span>' : ""}
        </label>
    `;
};

export default Label;
