/**
 * ListItem Component
 * Flexible list item with various layouts
 */

const ListItem = ({
  id = "",
  content = "",
  leftContent = "",
  rightContent = "",
  active = false,
  disabled = false,
  clickable = false,
  className = "",
  onClick = "",
  ...props
} = {}) => {
  const baseClasses = [
    "flex",
    "items-center",
    "justify-between",
    "px-4",
    "py-3",
    "transition-colors",
    "duration-200",
  ];

  const stateClasses = {
    default: ["text-gray-900", "dark:text-gray-100"],
    active: [
      "bg-blue-50",
      "text-blue-900",
      "dark:bg-blue-900/20",
      "dark:text-blue-100",
    ],
    disabled: ["text-gray-400", "dark:text-gray-600", "cursor-not-allowed"],
    clickable: ["hover:bg-gray-50", "dark:hover:bg-gray-800", "cursor-pointer"],
  };

  let currentStateClasses = [...stateClasses.default];

  if (disabled) {
    currentStateClasses = [...stateClasses.disabled];
  } else {
    if (active) {
      currentStateClasses.push(...stateClasses.active);
    }
    if (clickable || onClick) {
      currentStateClasses.push(...stateClasses.clickable);
    }
  }

  const classes = [...baseClasses, ...currentStateClasses, className]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const element = (clickable || onClick) && !disabled ? "button" : "div";

  return `
        <${element}
            ${id ? `id="${id}"` : ""}
            class="${classes}"
            ${disabled ? "disabled" : ""}
            ${onClick && !disabled ? `onclick="${onClick}"` : ""}
            ${element === "button" ? 'type="button"' : ""}
            ${attrs}
        >
            ${
              leftContent
                ? `
                <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">${leftContent}</div>
                    <div class="flex-1 min-w-0">${content}</div>
                </div>
            `
                : `
                <div class="flex-1 min-w-0">${content}</div>
            `
            }
            
            ${
              rightContent
                ? `
                <div class="flex-shrink-0">${rightContent}</div>
            `
                : ""
            }
        </${element}>
    `;
};

export default ListItem;
