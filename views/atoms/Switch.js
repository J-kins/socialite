/**
 * Switch Component
 * Toggle switch for boolean values
 */

const Switch = ({
  id = "",
  name = "",
  checked = false,
  disabled = false,
  size = "md",
  className = "",
  onChange = "",
  label = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: {
      track: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      track: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      track: "w-14 h-7",
      thumb: "w-6 h-6",
      translate: "translate-x-7",
    },
  };

  const sizeConfig = sizeClasses[size] || sizeClasses.md;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  const switchElement = `
        <div class="relative ${className}">
            <input
                type="checkbox"
                ${id ? `id="${switchId}"` : ""}
                ${name ? `name="${name}"` : ""}
                ${checked ? "checked" : ""}
                ${disabled ? "disabled" : ""}
                ${onChange ? `onchange="${onChange}"` : ""}
                class="sr-only peer"
                ${attrs}
            />
            <div class="relative ${sizeConfig.track} bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:${sizeConfig.translate} peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:${sizeConfig.thumb} after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
        </div>
    `;

  if (label) {
    return `
            <div class="flex items-center space-x-3">
                ${switchElement}
                <label for="${switchId}" class="text-sm font-medium text-gray-700 dark:text-gray-300 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}">
                    ${label}
                </label>
            </div>
        `;
  }

  return switchElement;
};

export default Switch;
