export interface RippleOptions {
  color?: string;
  duration?: number;
  scale?: number;
  opacity?: number;
}

export const createRippleEffect = (
  element: HTMLElement,
  event: MouseEvent | TouchEvent,
  options: RippleOptions = {},
) => {
  const {
    color = "rgba(255, 255, 255, 0.5)",
    duration = 600,
    scale = 4,
    opacity = 0.5,
  } = options;

  // Create ripple element
  const ripple = document.createElement("span");
  ripple.className = "ripple-overlay";

  // Get element dimensions and position
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const radius = size / 2;

  // Get click/touch position
  let clientX: number, clientY: number;

  if ("touches" in event) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // Calculate ripple position
  const x = clientX - rect.left - radius;
  const y = clientY - rect.top - radius;

  // Set ripple styles
  Object.assign(ripple.style, {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    background: color,
    transform: "scale(0)",
    opacity: "0",
    pointerEvents: "none",
    zIndex: "1000",
  });

  // Add ripple to element
  element.appendChild(ripple);

  // Animate ripple
  const animation = ripple.animate(
    [
      {
        transform: "scale(0)",
        opacity: opacity.toString(),
      },
      {
        transform: `scale(${scale})`,
        opacity: "0",
      },
    ],
    {
      duration,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    },
  );

  // Remove ripple after animation
  animation.addEventListener("finish", () => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  });

  return animation;
};

export const addRippleToElement = (
  element: HTMLElement,
  options: RippleOptions = {},
) => {
  const handleRipple = (event: MouseEvent | TouchEvent) => {
    // Don't create ripple if element is disabled
    if (element.hasAttribute("disabled")) return;

    createRippleEffect(element, event, options);
  };

  // Add event listeners
  element.addEventListener("mousedown", handleRipple);
  element.addEventListener("touchstart", handleRipple);

  // Return cleanup function
  return () => {
    element.removeEventListener("mousedown", handleRipple);
    element.removeEventListener("touchstart", handleRipple);
  };
};

export const useRippleEffect = (options: RippleOptions = {}) => {
  return (element: HTMLElement | null) => {
    if (!element) return;

    return addRippleToElement(element, options);
  };
};

// CSS class-based ripple effect
export const initializeRippleElements = (
  selector: string = ".ripple-effect",
  options: RippleOptions = {},
) => {
  const elements = document.querySelectorAll(selector);
  const cleanupFunctions: Array<() => void> = [];

  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      const cleanup = addRippleToElement(element, options);
      cleanupFunctions.push(cleanup);
    }
  });

  // Return function to cleanup all ripple effects
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
};

// Dark theme ripple effect
export const createDarkRippleEffect = (
  element: HTMLElement,
  event: MouseEvent | TouchEvent,
) => {
  return createRippleEffect(element, event, {
    color: "rgba(0, 0, 0, 0.1)",
    duration: 600,
    scale: 4,
    opacity: 0.1,
  });
};

// Light theme ripple effect
export const createLightRippleEffect = (
  element: HTMLElement,
  event: MouseEvent | TouchEvent,
) => {
  return createRippleEffect(element, event, {
    color: "rgba(255, 255, 255, 0.5)",
    duration: 600,
    scale: 4,
    opacity: 0.5,
  });
};

// Themed ripple effect that adapts to dark mode
export const createThemedRippleEffect = (
  element: HTMLElement,
  event: MouseEvent | TouchEvent,
) => {
  const isDarkMode =
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return isDarkMode
    ? createLightRippleEffect(element, event)
    : createDarkRippleEffect(element, event);
};
