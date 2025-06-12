/**
 * ToggleThemeSwitch Component
 * Theme toggle switch for light/dark mode
 */

import Switch from "../atoms/Switch.js";
import Icon from "../atoms/Icon.js";

const ToggleThemeSwitch = ({ id, checked = false, className = "" }) => `
  <div class="toggle-theme-switch ${className}" id="${id}">
    ${Icon({ id: `${id}-icon`, name: checked ? "moon" : "sun", className: "w-4 h-4 mr-2 text-gray-600" })}
    ${Switch({ id: `${id}-switch`, checked, className: "theme-switch" })}
  </div>
`;

// Initialize theme switching functionality
document.addEventListener("DOMContentLoaded", () => {
  const initThemeSwitch = (id) => {
    const switchEl = document.querySelector(`#${id}-switch input`);
    const iconEl = document.querySelector(`#${id}-icon`);

    if (switchEl) {
      switchEl.addEventListener("change", function () {
        const isDark = this.checked;

        // Toggle dark mode class on body
        document.body.classList.toggle("dark", isDark);
        document.documentElement.classList.toggle("dark", isDark);

        // Update icon
        if (iconEl) {
          const iconName = isDark ? "moon" : "sun";
          iconEl.innerHTML = `<ion-icon name="${iconName}" class="w-4 h-4"></ion-icon>`;
        }

        // Store preference
        localStorage.setItem("theme", isDark ? "dark" : "light");

        // Dispatch theme change event
        document.dispatchEvent(
          new CustomEvent("theme:changed", {
            detail: { theme: isDark ? "dark" : "light" },
          }),
        );
      });
    }
  };

  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.documentElement.classList.add("dark");
  }

  // Auto-initialize
  document.querySelectorAll(".toggle-theme-switch").forEach((toggle) => {
    if (toggle.id) initThemeSwitch(toggle.id);
  });
});

export default ToggleThemeSwitch;
