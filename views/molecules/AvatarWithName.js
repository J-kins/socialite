/**
 * AvatarWithName Component
 * Avatar with user name and optional metadata
 */

import Avatar from "../atoms/Avatar.js";
import Text from "../atoms/Text.js";
import Badge from "../atoms/Badge.js";

const AvatarWithName = ({
  id = "",
  src = "",
  name = "",
  subtitle = "",
  size = "md",
  layout = "horizontal", // 'horizontal', 'vertical'
  isOnline = false,
  badge = "",
  badgeVariant = "primary",
  clickable = false,
  className = "",
  onClick = "",
  ...props
} = {}) => {
  // Layout classes
  const layoutClasses = {
    horizontal: "flex items-center space-x-3",
    vertical: "flex flex-col items-center space-y-2 text-center",
  };

  // Size configurations for different layouts
  const textSizes = {
    xs: { name: "sm", subtitle: "xs" },
    sm: { name: "sm", subtitle: "xs" },
    md: { name: "base", subtitle: "sm" },
    lg: { name: "lg", subtitle: "base" },
    xl: { name: "xl", subtitle: "lg" },
  };

  const baseClasses = [
    layoutClasses[layout] || layoutClasses.horizontal,
    clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const textConfig = textSizes[size] || textSizes.md;

  return `
        <div
            ${id ? `id="${id}"` : ""}
            class="${baseClasses}"
            ${clickable && onClick ? `onclick="${onClick}"` : ""}
            ${attrs}
        >
            <div class="relative flex-shrink-0">
                ${Avatar({
                  src: src,
                  name: name,
                  size: size,
                  isOnline: isOnline,
                  onClick: clickable && !onClick ? onClick : "",
                })}
                
                ${
                  badge
                    ? `
                    <div class="absolute -top-1 -right-1">
                        ${Badge({
                          text: badge,
                          variant: badgeVariant,
                          size: "sm",
                        })}
                    </div>
                `
                    : ""
                }
            </div>

            <div class="${layout === "vertical" ? "text-center" : "flex-1 min-w-0"}">
                ${
                  name
                    ? `
                    ${Text({
                      content: name,
                      size: textConfig.name,
                      weight: "medium",
                      className: layout === "horizontal" ? "truncate" : "",
                    })}
                `
                    : ""
                }
                
                ${
                  subtitle
                    ? `
                    ${Text({
                      content: subtitle,
                      size: textConfig.subtitle,
                      color: "muted",
                      className:
                        layout === "horizontal" ? "truncate mt-0.5" : "mt-1",
                    })}
                `
                    : ""
                }
            </div>
        </div>
    `;
};

export default AvatarWithName;
