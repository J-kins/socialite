/**
 * GalleryItem Component
 * Gallery item display with media preview and caption
 */

import FilePreview from "../atoms/FilePreview.js";
import Text from "../atoms/Text.js";

const GalleryItem = ({
  id,
  src,
  type = "image",
  caption,
  alt,
  className = "",
}) => `
  <div class="gallery-item ${className}" id="${id}">
    <div class="gallery-media">
      ${FilePreview({
        id: `${id}-preview`,
        src,
        type,
        alt: alt || caption || "Gallery item",
        className: "w-full h-48 object-cover",
      })}
    </div>
    ${
      caption
        ? `
      <div class="gallery-caption p-3">
        ${Text({
          id: `${id}-caption`,
          content: caption,
          className: "text-sm text-gray-700 text-center",
        })}
      </div>
    `
        : ""
    }
  </div>
`;

// Initialize gallery item functionality
document.addEventListener("DOMContentLoaded", () => {
  const initGalleryItem = (id) => {
    const item = document.querySelector(`#${id}`);
    const preview = document.querySelector(`#${id}-preview`);

    if (item && preview) {
      // Click to open lightbox
      preview.addEventListener("click", () => {
        const src = preview.src || preview.dataset.src;
        const type = preview.dataset.type || "image";
        const caption = document.querySelector(`#${id}-caption`)?.textContent;

        // Dispatch lightbox event
        document.dispatchEvent(
          new CustomEvent("gallery:open", {
            detail: {
              src,
              type,
              caption,
              itemId: id,
            },
          }),
        );
      });

      // Keyboard support
      preview.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          preview.click();
        }
      });

      // Add focus styles for accessibility
      preview.setAttribute("tabindex", "0");
      preview.setAttribute("role", "button");
      preview.setAttribute("aria-label", "Open in lightbox");
    }
  };

  // Auto-initialize
  document.querySelectorAll(".gallery-item").forEach((item) => {
    if (item.id) initGalleryItem(item.id);
  });
});

export default GalleryItem;
