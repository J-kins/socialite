/**
 * Nexify Views Library
 * A comprehensive JavaScript template literal component library for social media applications
 * Based on atomic design principles with vanilla JS, jQuery, and AngularJS for grid/table components
 */

// Export all component modules
export * from "./atoms/index.js";
export * from "./molecules/index.js";
export * from "./organisms/index.js";
export * from "./templates/index.js";

// Export utility modules
export * from "./utils/index.js";

// Export style modules
export * from "./styles/index.js";

// Main initialization function
export function initializeViews() {
  // Initialize theme management
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Initialize ripple effects
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("ripple-effect")) {
      const ripple = document.createElement("span");
      const rect = e.target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      e.target.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  });

  console.log("Nexify Views Library initialized");
}

// Auto-initialize if in browser environment
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeViews);
  } else {
    initializeViews();
  }
}
