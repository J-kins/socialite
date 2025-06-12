/**
 * ShareButton Component
 * Share button for social posts with dropdown options
 */

import Icon from "./Icon.js";

const ShareButton = ({
  id = "",
  count = 0,
  showCount = true,
  size = "md",
  disabled = false,
  className = "",
  shareUrl = "",
  shareTitle = "",
  shareText = "",
  onClick = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
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
      : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [baseClasses, sizeClasses[size] || sizeClasses.md].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const shareIcon = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
    `;

  const buttonId =
    id || `share-button-${Math.random().toString(36).substr(2, 9)}`;

  // Default share handler with Web Share API fallback
  const defaultShareHandler = `
        if (navigator.share) {
            navigator.share({
                title: '${shareTitle}',
                text: '${shareText}',
                url: '${shareUrl || window.location.href}'
            }).catch(console.error);
        } else {
            // Fallback: Show share dropdown
            const dropdown = document.getElementById('${buttonId}-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        }
    `;

  const handleClick = onClick || defaultShareHandler;

  const shareDropdown = `
        <div id="${buttonId}-dropdown" class="hidden absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <div class="py-1">
                <button type="button" class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" onclick="window.open('https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl || window.location.href)}&text=${encodeURIComponent(shareText)}', '_blank', 'width=550,height=420')">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    <span>Twitter</span>
                </button>
                <button type="button" class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl || window.location.href)}', '_blank', 'width=550,height=420')">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span>Facebook</span>
                </button>
                <button type="button" class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" onclick="navigator.clipboard.writeText('${shareUrl || window.location.href}'); alert('Link copied to clipboard!')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <span>Copy link</span>
                </button>
            </div>
        </div>
    `;

  return `
        <div class="relative">
            <button
                ${id ? `id="${buttonId}"` : ""}
                type="button"
                class="${classes}"
                ${disabled ? "disabled" : ""}
                ${handleClick && !disabled ? `onclick="${handleClick}"` : ""}
                aria-label="Share this post"
                ${attrs}
            >
                ${shareIcon}
                ${showCount ? `<span>${count}</span>` : ""}
            </button>
            ${shareDropdown}
        </div>
    `;
};

export default ShareButton;
