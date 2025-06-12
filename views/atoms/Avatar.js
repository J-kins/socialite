/**
 * Avatar Component
 * User avatar with online indicator and fallback initials
 */

const Avatar = ({
  id = "",
  src = "",
  alt = "",
  size = "md",
  name = "",
  isOnline = false,
  className = "",
  onClick = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  const onlineIndicatorSizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "bg-gray-100",
    "dark:bg-gray-700",
    "overflow-hidden",
    "flex-shrink-0",
    onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
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
        <div 
            ${id ? `id="${id}"` : ""}
            class="${classes}"
            ${onClick ? `onclick="${onClick}"` : ""}
            ${attrs}
        >
            ${
              src
                ? `
                <img 
                    src="${src}" 
                    alt="${alt || name || "Avatar"}" 
                    class="w-full h-full object-cover"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                />
                <span class="font-medium text-gray-600 dark:text-gray-300 hidden w-full h-full items-center justify-center">
                    ${getInitials(name)}
                </span>
            `
                : `
                <span class="font-medium text-gray-600 dark:text-gray-300">
                    ${getInitials(name)}
                </span>
            `
            }

            ${
              isOnline
                ? `
                <div 
                    class="absolute -bottom-0.5 -right-0.5 ${onlineIndicatorSizes[size]} bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"
                    aria-label="Online"
                ></div>
            `
                : ""
            }
        </div>
    `;
};

export default Avatar;
