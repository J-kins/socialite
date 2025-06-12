/**
 * PostVideo Component
 * Video player for social media posts
 */

const PostVideo = ({
  id = "",
  src = "",
  poster = "",
  caption = "",
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  aspectRatio = "16/9",
  className = "",
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
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const videoClasses = ["w-full", "h-full", "object-cover"].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const videoId = id || `post-video-${Math.random().toString(36).substr(2, 9)}`;

  return `
        <div
            ${id ? `id="${videoId}"` : ""}
            class="${containerClasses}"
            ${attrs}
        >
            <video
                class="${videoClasses}"
                ${poster ? `poster="${poster}"` : ""}
                ${controls ? "controls" : ""}
                ${autoplay ? "autoplay" : ""}
                ${muted ? "muted" : ""}
                ${loop ? "loop" : ""}
                preload="metadata"
            >
                <source src="${src}" type="video/mp4" />
                <p class="text-gray-500 dark:text-gray-400">
                    Your browser doesn't support HTML5 video. 
                    <a href="${src}" class="text-blue-600 hover:text-blue-800">Download the video</a> instead.
                </p>
            </video>
            
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

export default PostVideo;
