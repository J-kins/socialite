/**
 * DropdownItem Component
 * Individual item for dropdown menus
 */

import Icon from "../atoms/Icon.js";
import Text from "../atoms/Text.js";
import Badge from "../atoms/Badge.js";

const DropdownItem = ({
  id = "",
  label = "",
  href = "",
  icon = "",
  iconType = "ion",
  rightIcon = "",
  badge = "",
  badgeVariant = "primary",
  disabled = false,
  divider = false,
  className = "",
  onClick = "",
  ...props
} = {}) => {
  // If divider, return a divider element
  if (divider) {
    return `<div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>`;
  }

  const baseClasses = [
    "flex",
    "items-center",
    "justify-between",
    "px-4",
    "py-2",
    "text-sm",
    "transition-colors",
    "duration-200",
    disabled
      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const element = href && !disabled ? "a" : "button";
  const elementProps = href && !disabled ? `href="${href}"` : 'type="button"';

  return `
        <${element}
            ${id ? `id="${id}"` : ""}
            ${elementProps}
            class="${baseClasses}"
            ${disabled ? "disabled" : ""}
            ${onClick && !disabled ? `onclick="${onClick}"` : ""}
            ${attrs}
        >
            <div class="flex items-center space-x-3 flex-1 min-w-0">
                ${
                  icon
                    ? `
                    <div class="flex-shrink-0">
                        ${Icon({
                          name: icon,
                          type: iconType,
                          size: "sm",
                          className: disabled
                            ? "text-gray-400 dark:text-gray-600"
                            : "text-gray-500 dark:text-gray-400",
                        })}
                    </div>
                `
                    : ""
                }

                <span class="truncate">${label}</span>
            </div>

            <div class="flex items-center space-x-2 flex-shrink-0">
                ${
                  badge
                    ? `
                    ${Badge({
                      text: badge,
                      variant: badgeVariant,
                      size: "sm",
                    })}
                `
                    : ""
                }

                ${
                  rightIcon
                    ? `
                    ${Icon({
                      name: rightIcon,
                      type: iconType,
                      size: "sm",
                      className: disabled
                        ? "text-gray-400 dark:text-gray-600"
                        : "text-gray-400 dark:text-gray-500",
                    })}
                `
                    : ""
                }
            </div>
        </${element}>
    `;
};

export default DropdownItem;
