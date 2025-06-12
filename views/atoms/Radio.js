/**
 * Radio Component
 * Custom styled radio input for forms
 */

const Radio = ({
  id = "",
  name = "",
  value = "",
  checked = false,
  disabled = false,
  className = "",
  onChange = "",
  label = "",
  ...props
} = {}) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    "radio",
    "w-4",
    "h-4",
    "text-blue-600",
    "bg-gray-100",
    "border-gray-300",
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

  const radioElement = `
        <input
            type="radio"
            ${id ? `id="${radioId}"` : ""}
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
                ${radioElement}
                <label for="${radioId}" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}">
                    ${label}
                </label>
            </div>
        `;
  }

  return radioElement;
};

// Initialize radio interactions
document.addEventListener("DOMContentLoaded", () => {
  // Add visual feedback on selection
  $(document).on("change", ".radio", function () {
    if (!this.disabled) {
      const radio = $(this);
      const name = radio.attr("name");

      // Reset all radios with same name
      if (name) {
        $(`.radio[name="${name}"]`).removeClass("ring-2 ring-blue-500");
      }

      // Highlight selected radio
      if (this.checked) {
        radio.addClass("ring-2 ring-blue-500");
      }
    }
  });
});

export default Radio;
