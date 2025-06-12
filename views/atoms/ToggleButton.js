/**
 * ToggleButton Component
 * Button that toggles between two states
 */

import Button from "./Button.js";

const ToggleButton = ({
  id = "",
  active = false,
  activeLabel = "Collapse",
  inactiveLabel = "Expand",
  variant = "outline",
  size = "md",
  className = "",
  onToggle = "",
  ...props
} = {}) => {
  const buttonId =
    id || `toggle-button-${Math.random().toString(36).substr(2, 9)}`;

  const currentLabel = active ? activeLabel : inactiveLabel;
  const currentVariant = active ? "primary" : variant;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .filter(([key]) => !["onToggle"].includes(key))
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const defaultToggle =
    onToggle ||
    `
        const button = document.getElementById('${buttonId}');
        const isActive = button.getAttribute('data-active') === 'true';
        const newActive = !isActive;
        
        button.setAttribute('data-active', newActive);
        button.textContent = newActive ? '${activeLabel}' : '${inactiveLabel}';
        
        // Update button styling
        if (newActive) {
            button.classList.remove('bg-transparent', 'text-gray-700', 'border-gray-300', 'hover:bg-gray-50');
            button.classList.add('bg-blue-600', 'text-white', 'border-transparent', 'hover:bg-blue-700');
        } else {
            button.classList.remove('bg-blue-600', 'text-white', 'border-transparent', 'hover:bg-blue-700');
            button.classList.add('bg-transparent', 'text-gray-700', 'border-gray-300', 'hover:bg-gray-50');
        }
        
        // Emit custom event
        button.dispatchEvent(new CustomEvent('toggle', { 
            detail: { active: newActive } 
        }));
    `;

  return `
        ${Button({
          id: buttonId,
          label: currentLabel,
          variant: currentVariant,
          size: size,
          className: `toggle-button ${className}`,
          onClick: defaultToggle,
          "data-active": active.toString(),
          ...props,
        })}
    `;
};

// Initialize toggle button functionality
document.addEventListener("DOMContentLoaded", () => {
  // Listen for toggle events
  $(document).on("toggle", ".toggle-button", function (event) {
    console.log("Toggle button state changed:", event.detail);
  });
});

export default ToggleButton;
