/**
 * PostImage Component
 * Image display for social media posts with lightbox support
 */

import Image from "./Image.js";

const PostImage = ({
  id = "",
  src = "",
  alt = "",
  caption = "",
  aspectRatio = "auto",
  lightbox = false,
  className = "",
  onClick = "",
  ...props
} = {}) => {
  // Aspect ratio classes
  const aspectRatioClasses = {
    auto: "",
    square: "aspect-square",
    "4/3": "aspect-4/3",
    "16/9": "aspect-video",
    "3/2": "aspect-3/2",
  };

  const containerClasses = [
    "relative",
    "overflow-hidden",
    "rounded-lg",
    "bg-gray-100",
    "dark:bg-gray-800",
    aspectRatioClasses[aspectRatio] || "",
    lightbox ? "cursor-pointer group" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const imageClasses = [
    "w-full",
    "h-full",
    "object-cover",
    "transition-transform",
    "duration-200",
    lightbox ? "group-hover:scale-105" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const imageId = id || `post-image-${Math.random().toString(36).substr(2, 9)}`;

  const lightboxClick = lightbox
    ? `
        event.preventDefault();
        const lightboxModal = document.createElement('div');
        lightboxModal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75';
        lightboxModal.innerHTML = \`
            <div class="relative max-w-4xl max-h-full p-4">
                <button 
                    class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                    onclick="this.closest('.fixed').remove()"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <img src="${src}" alt="${alt}" class="max-w-full max-h-full object-contain" />
            </div>
        \`;
        lightboxModal.onclick = (e) => {
            if (e.target === lightboxModal) lightboxModal.remove();
        };
        document.body.appendChild(lightboxModal);
    `
    : onClick;

  return `
        <div
            ${id ? `id="${imageId}"` : ""}
            class="${containerClasses}"
            ${lightboxClick ? `onclick="${lightboxClick}"` : ""}
            ${attrs}
        >
            ${Image({
              src: src,
              alt: alt,
              className: imageClasses,
              loading: "lazy",
            })}
            
            ${
              lightbox
                ? `
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                        </svg>
                    </div>
                </div>
            `
                : ""
            }
            
            ${
              caption
                ? `
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <p class="text-white text-sm">${caption}</p>
                </div>
            `
                : ""
            }
        </div>
    `;
};

export default PostImage;
