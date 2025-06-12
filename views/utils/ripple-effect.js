/**
 * Ripple Effect Utility
 * Creates material design ripple effect on click
 */

const rippleEffect = {
  // Add ripple effect to element
  add(element, options = {}) {
    if (!element) return;

    const {
      color = "rgba(255, 255, 255, 0.3)",
      duration = 600,
      size = null,
    } = options;

    // Ensure element has relative positioning and overflow hidden
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === "static") {
      element.style.position = "relative";
    }
    if (computedStyle.overflow === "visible") {
      element.style.overflow = "hidden";
    }

    // Add click event listener
    const handleClick = (event) => {
      // Remove existing ripples
      const existingRipples = element.querySelectorAll(".ripple");
      existingRipples.forEach((ripple) => ripple.remove());

      // Create ripple element
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      // Calculate ripple size and position
      const rect = element.getBoundingClientRect();
      const rippleSize = size || Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - rippleSize / 2;
      const y = event.clientY - rect.top - rippleSize / 2;

      // Style the ripple
      Object.assign(ripple.style, {
        position: "absolute",
        borderRadius: "50%",
        background: color,
        width: `${rippleSize}px`,
        height: `${rippleSize}px`,
        left: `${x}px`,
        top: `${y}px`,
        transform: "scale(0)",
        pointerEvents: "none",
        animation: `ripple-animation ${duration}ms ease-out`,
      });

      // Add ripple to element
      element.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      }, duration);
    };

    element.addEventListener("click", handleClick);

    // Return cleanup function
    return () => {
      element.removeEventListener("click", handleClick);
    };
  },

  // Remove ripple effect from element
  remove(element) {
    if (!element) return;

    // Remove existing ripples
    const ripples = element.querySelectorAll(".ripple");
    ripples.forEach((ripple) => ripple.remove());

    // Clone element to remove all event listeners
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);

    return newElement;
  },

  // Initialize ripple effects for all elements with ripple-effect class
  init() {
    const elements = document.querySelectorAll(".ripple-effect");
    elements.forEach((element) => {
      this.add(element);
    });
  },
};

// CSS for ripple animation
const rippleCSS = `
    @keyframes ripple-animation {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }

    .ripple-effect {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
    }
`;

// Inject CSS if not already present
if (
  typeof window !== "undefined" &&
  !document.getElementById("ripple-effect-styles")
) {
  const style = document.createElement("style");
  style.id = "ripple-effect-styles";
  style.textContent = rippleCSS;
  document.head.appendChild(style);
}

// Auto-initialize on DOM ready
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => rippleEffect.init());
  } else {
    rippleEffect.init();
  }

  // Re-initialize when new elements are added
  const observer = new MutationObserver(() => {
    rippleEffect.init();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export default rippleEffect;
