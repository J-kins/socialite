/**
 * CommentButton Component
 * Comment button for social posts
 */

import Icon from "./Icon.js";

const CommentButton = ({
  id = "",
  count = 0,
  showCount = true,
  size = "md",
  disabled = false,
  className = "",
  onClick = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: "sm",
    md: "md",
    lg: "lg",
  };

  const baseClasses = [
    "inline-flex",
    "items-center",
    "space-x-1",
    "rounded-lg",
    "text-gray-600",
    "dark:text-gray-400",
    "transition-all",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:ring-offset-2",
    disabled
      ? "opacity-60 cursor-not-allowed"
      : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [baseClasses, sizeClasses[size] || sizeClasses.md].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const commentIcon = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    `;

  return `
        <button
            ${id ? `id="${id}"` : ""}
            type="button"
            class="${classes}"
            ${disabled ? "disabled" : ""}
            ${onClick && !disabled ? `onclick="${onClick}"` : ""}
            aria-label="Comment on this post"
            ${attrs}
        >
            ${commentIcon}
            ${showCount ? `<span>${count}</span>` : ""}
        </button>
    `;
};

export default CommentButton;
