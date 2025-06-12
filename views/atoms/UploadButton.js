/**
 * UploadButton Component
 * Button that triggers file upload
 */

import Button from "./Button.js";
import Icon from "./Icon.js";

const UploadButton = ({
  id = "",
  label = "Upload",
  accept = "",
  multiple = false,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  onChange = "",
  icon = "",
  ...props
} = {}) => {
  const inputId = `upload-input-${Math.random().toString(36).substr(2, 9)}`;
  const buttonId =
    id || `upload-button-${Math.random().toString(36).substr(2, 9)}`;

  // Default upload icon
  const uploadIcon =
    icon ||
    Icon({
      name: "cloud-upload-outline",
      type: "ion",
      size: "sm",
    });

  // Create additional attributes string
  const attrs = Object.entries(props)
    .filter(([key]) => !["onChange"].includes(key))
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <div class="relative ${className}">
            <input
                type="file"
                id="${inputId}"
                ${accept ? `accept="${accept}"` : ""}
                ${multiple ? "multiple" : ""}
                ${disabled ? "disabled" : ""}
                ${onChange ? `onchange="${onChange}"` : ""}
                class="sr-only"
            />
            ${Button({
              id: buttonId,
              label: label,
              variant: variant,
              size: size,
              disabled: disabled,
              leftIcon: uploadIcon,
              onClick: `document.getElementById('${inputId}').click()`,
              ...props,
            })}
        </div>
    `;
};

export default UploadButton;
