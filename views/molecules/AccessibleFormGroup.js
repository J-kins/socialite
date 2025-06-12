/**
 * AccessibleFormGroup Component
 * Accessible form field group with proper ARIA labeling
 */

import Label from "../atoms/Label.js";
import Input from "../atoms/Input.js";
import AriaLabel from "../atoms/AriaLabel.js";
import Text from "../atoms/Text.js";

const AccessibleFormGroup = ({
  id,
  label,
  placeholder,
  type = "text",
  required = false,
  error,
  helpText,
  value = "",
  className = "",
}) => `
  <div class="accessible-form-group ${className}" id="${id}">
    ${Label({
      id: `${id}-label`,
      for: `${id}-input`,
      text: label,
      required,
      className: "block text-sm font-medium text-gray-700 mb-1",
    })}
    
    ${AriaLabel({
      id: `${id}-aria`,
      text: `${label}${required ? " (required)" : ""}${helpText ? ". " + helpText : ""}`,
      className: "sr-only",
    })}
    
    ${Input({
      id: `${id}-input`,
      type,
      placeholder,
      value,
      required,
      className: `w-full mt-1 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`,
      ariaDescribedBy:
        `${helpText ? `${id}-help` : ""}${error ? ` ${id}-error` : ""}`.trim(),
      ariaInvalid: error ? "true" : "false",
    })}
    
    ${
      helpText
        ? Text({
            id: `${id}-help`,
            content: helpText,
            className: "mt-1 text-xs text-gray-500",
            role: "note",
          })
        : ""
    }
    
    ${
      error
        ? Text({
            id: `${id}-error`,
            content: error,
            className: "mt-1 text-xs text-red-600",
            role: "alert",
            ariaLive: "polite",
          })
        : ""
    }
  </div>
`;

// Initialize accessible form functionality
document.addEventListener("DOMContentLoaded", () => {
  const initAccessibleFormGroup = (id) => {
    const input = document.querySelector(`#${id}-input`);
    const errorEl = document.querySelector(`#${id}-error`);
    const formGroup = document.querySelector(`#${id}`);

    if (input) {
      // Real-time validation
      input.addEventListener("blur", () => {
        validateField(input, errorEl, formGroup);
      });

      input.addEventListener("input", () => {
        // Clear error on input if present
        if (errorEl && errorEl.textContent) {
          clearFieldError(input, errorEl, formGroup);
        }
      });

      // Form submission validation
      const form = input.closest("form");
      if (form) {
        form.addEventListener("submit", (e) => {
          if (!validateField(input, errorEl, formGroup)) {
            e.preventDefault();
            input.focus();
          }
        });
      }
    }
  };

  // Validation helper
  function validateField(input, errorEl, formGroup) {
    const value = input.value.trim();
    const required = input.hasAttribute("required");
    const type = input.type;

    let isValid = true;
    let errorMessage = "";

    // Required validation
    if (required && !value) {
      isValid = false;
      errorMessage = "This field is required";
    }

    // Type-specific validation
    if (value && type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address";
      }
    }

    if (value && type === "url") {
      try {
        new URL(value);
      } catch {
        isValid = false;
        errorMessage = "Please enter a valid URL";
      }
    }

    // Update UI
    if (isValid) {
      clearFieldError(input, errorEl, formGroup);
    } else {
      showFieldError(input, errorEl, formGroup, errorMessage);
    }

    return isValid;
  }

  function showFieldError(input, errorEl, formGroup, message) {
    input.classList.add(
      "border-red-500",
      "focus:border-red-500",
      "focus:ring-red-500",
    );
    input.setAttribute("aria-invalid", "true");

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
    }

    if (formGroup) {
      formGroup.classList.add("has-error");
    }
  }

  function clearFieldError(input, errorEl, formGroup) {
    input.classList.remove(
      "border-red-500",
      "focus:border-red-500",
      "focus:ring-red-500",
    );
    input.setAttribute("aria-invalid", "false");

    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
    }

    if (formGroup) {
      formGroup.classList.remove("has-error");
    }
  }

  // Auto-initialize
  document.querySelectorAll(".accessible-form-group").forEach((group) => {
    if (group.id) initAccessibleFormGroup(group.id);
  });
});

export default AccessibleFormGroup;
