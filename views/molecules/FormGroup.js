/**
 * FormGroup Component
 * Complete form field with label, input, and validation
 */

import Label from "../atoms/Label.js";
import Input from "../atoms/Input.js";
import Text from "../atoms/Text.js";

const FormGroup = ({
  id = "",
  label = "",
  type = "text",
  name = "",
  value = "",
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  helpText = "",
  size = "md",
  className = "",
  onChange = "",
  onFocus = "",
  onBlur = "",
  ...props
} = {}) => {
  const groupId = id || `form-group-${Math.random().toString(36).substr(2, 9)}`;
  const inputId = `${groupId}-input`;
  const errorId = `${groupId}-error`;
  const helpId = `${groupId}-help`;

  const baseClasses = ["form-group", "space-y-1", className]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .filter(([key]) => !["label", "error", "helpText"].includes(key))
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <div 
            ${id ? `id="${groupId}"` : ""}
            class="${baseClasses}"
        >
            ${
              label
                ? `
                ${Label({
                  htmlFor: inputId,
                  text: label,
                  required: required,
                  size: size,
                })}
            `
                : ""
            }
            
            ${Input({
              id: inputId,
              type: type,
              name: name,
              value: value,
              placeholder: placeholder,
              required: required,
              disabled: disabled,
              size: size,
              variant: error ? "error" : "default",
              onChange: onChange,
              onFocus: onFocus,
              onBlur: onBlur,
              "aria-describedby":
                [error ? errorId : "", helpText ? helpId : ""]
                  .filter(Boolean)
                  .join(" ") || undefined,
              "aria-invalid": error ? "true" : undefined,
              ...props,
            })}
            
            ${
              error
                ? `
                <div id="${errorId}" role="alert">
                    ${Text({
                      content: error,
                      size: "sm",
                      color: "error",
                      className: "mt-1",
                    })}
                </div>
            `
                : ""
            }
            
            ${
              helpText && !error
                ? `
                <div id="${helpId}">
                    ${Text({
                      content: helpText,
                      size: "sm",
                      color: "muted",
                      className: "mt-1",
                    })}
                </div>
            `
                : ""
            }
        </div>
    `;
};

export default FormGroup;
