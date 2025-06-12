/**
 * LikeButton Component
 * Interactive like button for social posts
 */

import Icon from "./Icon.js";

const LikeButton = ({
  id = "",
  liked = false,
  count = 0,
  showCount = true,
  size = "md",
  disabled = false,
  className = "",
  onToggle = "",
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
    "transition-all",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:ring-offset-2",
    disabled
      ? "opacity-60 cursor-not-allowed"
      : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [baseClasses, sizeClasses[size] || sizeClasses.md].join(" ");

  // Text color based on liked state
  const textColor = liked
    ? "text-red-600 dark:text-red-400"
    : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400";

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const buttonId =
    id || `like-button-${Math.random().toString(36).substr(2, 9)}`;

  const heartIcon = liked
    ? `<svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
             <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
           </svg>`
    : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
           </svg>`;

  const handleClick = onToggle
    ? `
        if (!${disabled}) {
            const button = document.getElementById('${buttonId}');
            const icon = button.querySelector('svg');
            const countSpan = button.querySelector('.like-count');
            const currentLiked = button.getAttribute('data-liked') === 'true';
            const currentCount = parseInt(button.getAttribute('data-count') || '0');
            
            // Toggle liked state
            const newLiked = !currentLiked;
            const newCount = newLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
            
            // Update attributes
            button.setAttribute('data-liked', newLiked);
            button.setAttribute('data-count', newCount);
            
            // Update icon
            if (newLiked) {
                icon.outerHTML = \`<svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>\`;
                button.className = button.className.replace('text-gray-600 dark:text-gray-400', 'text-red-600 dark:text-red-400');
            } else {
                icon.outerHTML = \`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>\`;
                button.className = button.className.replace('text-red-600 dark:text-red-400', 'text-gray-600 dark:text-gray-400');
            }
            
            // Update count
            if (countSpan) {
                countSpan.textContent = newCount;
            }
            
            // Call custom handler
            (${onToggle})(newLiked, newCount);
        }
    `
    : "";

  return `
        <button
            ${id ? `id="${buttonId}"` : ""}
            type="button"
            class="${classes} ${textColor}"
            ${disabled ? "disabled" : ""}
            ${handleClick ? `onclick="${handleClick}"` : ""}
            data-liked="${liked}"
            data-count="${count}"
            aria-label="${liked ? "Unlike" : "Like"} this post"
            ${attrs}
        >
            ${heartIcon}
            ${showCount ? `<span class="like-count">${count}</span>` : ""}
        </button>
    `;
};

export default LikeButton;
