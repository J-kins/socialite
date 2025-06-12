/**
 * Dropdown Component
 * Select dropdown with customizable options
 */

const Dropdown = ({
  id = "",
  name = "",
  options = [],
  value = "",
  placeholder = "Select an option",
  disabled = false,
  size = "md",
  className = "",
  onChange = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-4 py-3 text-base h-12",
  };

  const baseClasses = [
    "block",
    "w-full",
    "rounded-lg",
    "border",
    "border-gray-300",
    "bg-white",
    "dark:bg-gray-800",
    "dark:border-gray-600",
    "dark:text-white",
    "text-gray-900",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:border-blue-500",
    "transition-colors",
    "duration-200",
    "disabled:opacity-60",
    "disabled:cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [baseClasses, sizeClasses[size] || sizeClasses.md].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Generate options HTML
  const optionsHTML = options
    .map((option) => {
      if (typeof option === "string") {
        return `<option value="${option}" ${value === option ? "selected" : ""}>${option}</option>`;
      } else if (typeof option === "object") {
        const optionValue = option.value || option.id || "";
        const optionLabel =
          option.label || option.name || option.text || optionValue;
        return `<option value="${optionValue}" ${value === optionValue ? "selected" : ""}>${optionLabel}</option>`;
      }
      return "";
    })
    .join("");

  return `
        <select
            ${id ? `id="${id}"` : ""}
            ${name ? `name="${name}"` : ""}
            class="${classes}"
            ${disabled ? "disabled" : ""}
            ${onChange ? `onchange="${onChange}"` : ""}
            ${attrs}
        >
            ${placeholder ? `<option value="" ${!value ? "selected" : ""}>${placeholder}</option>` : ""}
            ${optionsHTML}
        </select>
    `;
};

export default Dropdown;
