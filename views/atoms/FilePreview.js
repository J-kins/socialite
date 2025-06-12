/**
 * FilePreview Component
 * Preview thumbnail for uploaded files
 */

import Image from "./Image.js";
import Icon from "./Icon.js";
import CloseButton from "./CloseButton.js";

const FilePreview = ({
  id = "",
  file = null,
  src = "",
  fileName = "",
  fileSize = "",
  fileType = "",
  removable = false,
  className = "",
  onRemove = "",
  onClick = "",
  ...props
} = {}) => {
  // Determine file type for icon
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "image-outline";
    if (type.startsWith("video/")) return "videocam-outline";
    if (type.startsWith("audio/")) return "musical-notes-outline";
    if (type.includes("pdf")) return "document-text-outline";
    if (type.includes("word") || type.includes("doc"))
      return "document-outline";
    if (type.includes("excel") || type.includes("sheet")) return "grid-outline";
    if (type.includes("powerpoint") || type.includes("presentation"))
      return "easel-outline";
    return "document-outline";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImage = fileType.startsWith("image/");
  const displaySize =
    typeof fileSize === "number" ? formatFileSize(fileSize) : fileSize;

  const baseClasses = [
    "relative",
    "group",
    "bg-white",
    "dark:bg-gray-800",
    "border",
    "border-gray-200",
    "dark:border-gray-700",
    "rounded-lg",
    "overflow-hidden",
    "hover:shadow-md",
    "transition-shadow",
    "duration-200",
    onClick ? "cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <div
            ${id ? `id="${id}"` : ""}
            class="${baseClasses}"
            ${onClick ? `onclick="${onClick}"` : ""}
            ${attrs}
        >
            ${
              removable
                ? `
                <div class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    ${CloseButton({
                      size: "sm",
                      variant: "solid",
                      onClick: onRemove,
                      ariaLabel: "Remove file",
                    })}
                </div>
            `
                : ""
            }

            <div class="p-4">
                ${
                  isImage && src
                    ? `
                    <div class="mb-3">
                        ${Image({
                          src: src,
                          alt: fileName,
                          className: "w-full h-24 object-cover rounded",
                          loading: "lazy",
                        })}
                    </div>
                `
                    : `
                    <div class="flex items-center justify-center h-16 mb-3 text-gray-400">
                        ${Icon({
                          name: getFileIcon(fileType),
                          type: "ion",
                          size: "2xl",
                        })}
                    </div>
                `
                }

                <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title="${fileName}">
                        ${fileName}
                    </p>
                    ${
                      displaySize
                        ? `
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            ${displaySize}
                        </p>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
    `;
};

export default FilePreview;
