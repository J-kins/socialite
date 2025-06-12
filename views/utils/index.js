/**
 * Utility Functions
 * Helper functions for component logic and interactions
 */

export { default as rippleEffect } from "./ripple-effect.js";
export { default as useToggle } from "./use-toggle.js";
export { default as useModal } from "./use-modal.js";
export { default as useSlider } from "./use-slider.js";
export { default as useLightbox } from "./use-lightbox.js";
export { default as componentProps } from "./component-props.js";
export { default as fileUpload } from "./file-upload.js";
export { default as postUtils } from "./post-utils.js";
export { default as useFileUpload } from "./useFileUpload.js";
export { default as usePostInteraction } from "./usePostInteraction.js";
export { default as fileUploadProps } from "./file-upload-props.js";
export { default as postProps } from "./post-props.js";

// Theme utilities
export const ThemeUtils = {
  // Toggle between light and dark themes
  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");

    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    // Dispatch theme change event
    window.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: { theme: isDark ? "light" : "dark" },
      }),
    );
  },

  // Set specific theme
  setTheme(theme) {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);

    window.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: { theme },
      }),
    );
  },

  // Get current theme
  getCurrentTheme() {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  },

  // Initialize theme from localStorage or system preference
  initializeTheme() {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
};

// DOM utilities
export const DOMUtils = {
  // Get element by ID with error handling
  getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID "${id}" not found`);
    }
    return element;
  },

  // Query selector with error handling
  querySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.error(`Invalid selector: "${selector}"`, error);
      return null;
    }
  },

  // Query all with error handling
  querySelectorAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      console.error(`Invalid selector: "${selector}"`, error);
      return [];
    }
  },

  // Add event listener with cleanup
  addEventListener(element, event, handler, options = {}) {
    if (!element || !event || !handler) return null;

    element.addEventListener(event, handler, options);

    // Return cleanup function
    return () => {
      element.removeEventListener(event, handler, options);
    };
  },

  // Create element with attributes and children
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else if (key === "textContent") {
        element.textContent = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    // Append children
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });

    return element;
  },
};

// Animation utilities
export const AnimationUtils = {
  // Fade in element
  fadeIn(element, duration = 300) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      element.style.opacity = "0";
      element.style.display = "block";

      const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration,
        easing: "ease-out",
        fill: "forwards",
      });

      animation.onfinish = () => {
        element.style.opacity = "";
        resolve();
      };
    });
  },

  // Fade out element
  fadeOut(element, duration = 300) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration,
        easing: "ease-out",
        fill: "forwards",
      });

      animation.onfinish = () => {
        element.style.display = "none";
        element.style.opacity = "";
        resolve();
      };
    });
  },

  // Slide down element
  slideDown(element, duration = 300) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      const height = element.scrollHeight;
      element.style.height = "0";
      element.style.overflow = "hidden";
      element.style.display = "block";

      const animation = element.animate(
        [{ height: "0px" }, { height: `${height}px` }],
        {
          duration,
          easing: "ease-out",
          fill: "forwards",
        },
      );

      animation.onfinish = () => {
        element.style.height = "";
        element.style.overflow = "";
        resolve();
      };
    });
  },

  // Slide up element
  slideUp(element, duration = 300) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      const height = element.scrollHeight;
      element.style.height = `${height}px`;
      element.style.overflow = "hidden";

      const animation = element.animate(
        [{ height: `${height}px` }, { height: "0px" }],
        {
          duration,
          easing: "ease-out",
          fill: "forwards",
        },
      );

      animation.onfinish = () => {
        element.style.display = "none";
        element.style.height = "";
        element.style.overflow = "";
        resolve();
      };
    });
  },
};

// Validation utilities
export const ValidationUtils = {
  // Email validation
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // URL validation
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Phone number validation (basic)
  isValidPhone(phone) {
    const regex = /^[\+]?[1-9][\d]{0,15}$/;
    return regex.test(phone.replace(/\s/g, ""));
  },

  // Required field validation
  isRequired(value) {
    return value !== null && value !== undefined && value !== "";
  },

  // Min length validation
  minLength(value, min) {
    return value && value.length >= min;
  },

  // Max length validation
  maxLength(value, max) {
    return !value || value.length <= max;
  },
};

// Format utilities
export const FormatUtils = {
  // Format number with commas
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Format date relative to now
  formatTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}mo`;
    if (weeks > 0) return `${weeks}w`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  },

  // Truncate text
  truncate(text, length = 100, suffix = "...") {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + suffix;
  },
};

// Initialize utilities when module loads
if (typeof window !== "undefined") {
  ThemeUtils.initializeTheme();
}
