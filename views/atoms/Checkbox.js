/**
 * Checkbox Component
 * Custom styled checkbox input for forms
 */

const Checkbox = ({
  id = "",
  name = "",
  checked = false,
  disabled = false,
  value = "",
  className = "",
  onChange = "",
  label = "",
  ...props
} = {}) => {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    "checkbox",
    "w-4",
    "h-4",
    "text-blue-600",
    "bg-gray-100",
    "border-gray-300",
    "rounded",
    "focus:ring-blue-500",
    "dark:focus:ring-blue-600",
    "dark:ring-offset-gray-800",
    "focus:ring-2",
    "dark:bg-gray-700",
    "dark:border-gray-600",
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const checkboxElement = `
        <input
            type="checkbox"
            ${id ? `id="${checkboxId}"` : ""}
            ${name ? `name="${name}"` : ""}
            ${value ? `value="${value}"` : ""}
            ${checked ? "checked" : ""}
            ${disabled ? "disabled" : ""}
            ${onChange ? `onchange="${onChange}"` : ""}
            class="${baseClasses}"
            ${attrs}
        />
    `;

  if (label) {
    return `
            <div class="flex items-center">
                ${checkboxElement}
                <label for="${checkboxId}" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}">
                    ${label}
                </label>
            </div>
        `;
  }

  return checkboxElement;
};

// Initialize checkbox interactions
document.addEventListener("DOMContentLoaded", () => {
  // Add ripple effect on click
  $(document).on("click", ".checkbox", function () {
    if (!this.disabled) {
      const checkbox = $(this);
      checkbox.addClass("scale-95");
      setTimeout(() => {
        checkbox.removeClass("scale-95");
      }, 150);
    }
  });
});

export default Checkbox;
