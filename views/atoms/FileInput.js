/**
 * FileInput Component
 * File input field with drag and drop support
 */

const FileInput = ({
  id = "",
  name = "",
  accept = "",
  multiple = false,
  disabled = false,
  className = "",
  onChange = "",
  dragDrop = false,
  placeholder = "Choose files...",
  ...props
} = {}) => {
  const inputId = id || `file-input-${Math.random().toString(36).substr(2, 9)}`;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  if (dragDrop) {
    return `
            <div class="relative ${className}">
                <input
                    type="file"
                    ${id ? `id="${inputId}"` : ""}
                    ${name ? `name="${name}"` : ""}
                    ${accept ? `accept="${accept}"` : ""}
                    ${multiple ? "multiple" : ""}
                    ${disabled ? "disabled" : ""}
                    ${onChange ? `onchange="${onChange}"` : ""}
                    class="sr-only"
                    ${attrs}
                />
                <label
                    for="${inputId}"
                    class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors duration-200 ${disabled ? "opacity-60 cursor-not-allowed" : ""}"
                    ondragover="event.preventDefault(); this.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20')"
                    ondragleave="this.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20')"
                    ondrop="event.preventDefault(); this.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20'); const files = event.dataTransfer.files; if (files.length > 0) { const input = this.previousElementSibling; input.files = files; ${onChange ? `(${onChange})(event);` : ""} }"
                >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span class="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            ${placeholder}
                        </p>
                    </div>
                </label>
            </div>
        `;
  }

  // Standard file input
  const baseClasses = [
    "block",
    "w-full",
    "text-sm",
    "text-gray-900",
    "border",
    "border-gray-300",
    "rounded-lg",
    "cursor-pointer",
    "bg-gray-50",
    "dark:text-gray-400",
    "focus:outline-none",
    "dark:bg-gray-700",
    "dark:border-gray-600",
    "dark:placeholder-gray-400",
    disabled ? "opacity-60 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return `
        <input
            type="file"
            ${id ? `id="${inputId}"` : ""}
            ${name ? `name="${name}"` : ""}
            ${accept ? `accept="${accept}"` : ""}
            ${multiple ? "multiple" : ""}
            ${disabled ? "disabled" : ""}
            ${onChange ? `onchange="${onChange}"` : ""}
            class="${baseClasses}"
            ${attrs}
        />
    `;
};

export default FileInput;
