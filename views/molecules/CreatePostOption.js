/**
 * CreatePostOption Component
 * Post creation option button with icon and label
 */

import Button from "../atoms/Button.js";
import Icon from "../atoms/Icon.js";

const CreatePostOption = ({ id, type, label, className = "" }) => {
  const getIconName = (type) => {
    switch (type) {
      case "photo":
        return "image";
      case "video":
        return "videocam";
      case "event":
        return "calendar";
      case "poll":
        return "bar-chart";
      case "document":
        return "document-text";
      default:
        return "add";
    }
  };

  return `
    <div class="create-post-option ${className}" id="${id}">
      ${Button({
        id: `${id}-button`,
        label: "",
        className:
          "flex items-center gap-2 w-full justify-start px-4 py-3 text-left hover:bg-gray-50 transition-colors",
        content: `
          ${Icon({ id: `${id}-icon`, name: getIconName(type), className: "w-5 h-5 text-blue-600" })}
          <span class="text-gray-700">${label || type}</span>
        `,
      })}
    </div>
  `;
};

// Initialize create post option functionality
document.addEventListener("DOMContentLoaded", () => {
  const initCreatePostOption = (id) => {
    const button = document.querySelector(`#${id}-button`);

    if (button) {
      button.addEventListener("click", () => {
        const type =
          button.closest(".create-post-option").dataset.type || "text";

        // Dispatch create post event
        document.dispatchEvent(
          new CustomEvent("post:create", {
            detail: { type, optionId: id },
          }),
        );

        console.log("Create post type:", type);
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".create-post-option").forEach((option) => {
    if (option.id) initCreatePostOption(option.id);
  });
});

export default CreatePostOption;
