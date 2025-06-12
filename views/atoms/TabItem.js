/**
 * TabItem Component
 * Individual tab navigation item
 */

const TabItem = ({
  id = "",
  label = "",
  active = false,
  disabled = false,
  badge = "",
  icon = "",
  className = "",
  onClick = "",
  ...props
} = {}) => {
  const baseClasses = [
    "relative",
    "inline-flex",
    "items-center",
    "px-4",
    "py-2",
    "text-sm",
    "font-medium",
    "border-b-2",
    "transition-all",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:ring-offset-2",
  ];

  const stateClasses = {
    active: [
      "text-blue-600",
      "border-blue-600",
      "dark:text-blue-400",
      "dark:border-blue-400",
    ],
    inactive: [
      "text-gray-500",
      "border-transparent",
      "hover:text-gray-700",
      "hover:border-gray-300",
      "dark:text-gray-400",
      "dark:hover:text-gray-300",
      "dark:hover:border-gray-600",
    ],
    disabled: [
      "text-gray-300",
      "border-transparent",
      "cursor-not-allowed",
      "dark:text-gray-600",
    ],
  };

  let currentStateClasses;
  if (disabled) {
    currentStateClasses = stateClasses.disabled;
  } else if (active) {
    currentStateClasses = stateClasses.active;
  } else {
    currentStateClasses = stateClasses.inactive;
  }

  const classes = [
    ...baseClasses,
    ...currentStateClasses,
    disabled ? "" : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <button
            ${id ? `id="${id}"` : ""}
            type="button"
            class="${classes}"
            ${disabled ? "disabled" : ""}
            ${onClick && !disabled ? `onclick="${onClick}"` : ""}
            role="tab"
            aria-selected="${active}"
            ${attrs}
        >
            ${icon ? `<span class="mr-2">${icon}</span>` : ""}
            
            <span>${label}</span>
            
            ${
              badge
                ? `
                <span class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    ${badge}
                </span>
            `
                : ""
            }
        </button>
    `;
};

export default TabItem;
