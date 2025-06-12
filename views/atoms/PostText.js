/**
 * PostText Component
 * Text content for social media posts with special formatting
 */

import Text from "./Text.js";

const PostText = ({
  id = "",
  content = "",
  maxLength = null,
  showReadMore = false,
  expanded = false,
  className = "",
  linkify = true,
  mentionify = true,
  hashtagify = true,
  ...props
} = {}) => {
  // Process content for links, mentions, hashtags
  const processContent = (text) => {
    let processed = text;

    if (linkify) {
      // Convert URLs to links
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      processed = processed.replace(
        urlRegex,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">$1</a>',
      );
    }

    if (mentionify) {
      // Convert @mentions to links
      const mentionRegex = /@(\w+)/g;
      processed = processed.replace(
        mentionRegex,
        '<a href="/profile/$1" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">@$1</a>',
      );
    }

    if (hashtagify) {
      // Convert #hashtags to links
      const hashtagRegex = /#(\w+)/g;
      processed = processed.replace(
        hashtagRegex,
        '<a href="/hashtag/$1" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">#$1</a>',
      );
    }

    return processed;
  };

  // Handle read more functionality
  const shouldTruncate = maxLength && content.length > maxLength && !expanded;
  const displayContent = shouldTruncate
    ? content.substring(0, maxLength)
    : content;
  const processedContent = processContent(displayContent);

  const baseClasses = [
    "post-text",
    "text-gray-900",
    "dark:text-gray-100",
    "leading-relaxed",
    "whitespace-pre-wrap",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const textId = id || `post-text-${Math.random().toString(36).substr(2, 9)}`;

  return `
        <div
            ${id ? `id="${textId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            <div class="post-content">${processedContent}</div>
            
            ${
              shouldTruncate && showReadMore
                ? `
                <span class="text-gray-500">...</span>
                <button 
                    type="button"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium ml-1"
                    onclick="
                        const container = this.closest('.post-text');
                        const content = container.querySelector('.post-content');
                        content.innerHTML = '${processContent(content).replace(/'/g, "\\'")}';
                        this.style.display = 'none';
                        const showLess = container.querySelector('.show-less');
                        if (showLess) showLess.style.display = 'inline';
                    "
                >
                    Read more
                </button>
                <button 
                    type="button"
                    class="show-less text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium ml-1 hidden"
                    onclick="
                        const container = this.closest('.post-text');
                        const content = container.querySelector('.post-content');
                        content.innerHTML = '${processedContent.replace(/'/g, "\\'")}';
                        this.style.display = 'none';
                        const readMore = container.querySelector('button:not(.show-less)');
                        if (readMore) readMore.style.display = 'inline';
                    "
                >
                    Show less
                </button>
            `
                : ""
            }
        </div>
    `;
};

export default PostText;
