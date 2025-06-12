/**
 * Hover Effect Utilities
 *
 * Provides comprehensive hover animation functionality including scale, opacity,
 * color transitions, and custom hover effects for interactive elements.
 */

export interface HoverEffectOptions {
  duration?: number;
  easing?: string;
  scale?: number;
  opacity?: number;
  translateX?: number;
  translateY?: number;
  rotate?: number;
  brightness?: number;
  blur?: number;
  borderRadius?: string;
  boxShadow?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  delay?: number;
  persist?: boolean; // Keep effect on focus/active states
}

export interface HoverTransformOptions extends HoverEffectOptions {
  transformOrigin?: string;
  preserve3d?: boolean;
  backfaceVisibility?: 'visible' | 'hidden';
}

export interface HoverColorOptions {
  from?: string;
  to?: string;
  property?: 'color' | 'backgroundColor' | 'borderColor' | 'fill' | 'stroke';
  duration?: number;
  easing?: string;
}

export interface HoverShadowOptions {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  blurRadius?: number;
  spreadRadius?: number;
  inset?: boolean;
  duration?: number;
  easing?: string;
}

// Pre-defined hover effect presets
export const HOVER_PRESETS = {
  // Scale effects
  scaleUp: { scale: 1.05, duration: 200 },
  scaleDown: { scale: 0.95, duration: 200 },
  scaleUpLarge: { scale: 1.1, duration: 250 },
  scaleUpSubtle: { scale: 1.02, duration: 150 },

  // Opacity effects
  fadeIn: { opacity: 0.8, duration: 200 },
  fadeOut: { opacity: 0.6, duration: 200 },
  ghostHover: { opacity: 0.7, duration: 300 },

  // Transform effects
  slideUp: { translateY: -4, duration: 200 },
  slideDown: { translateY: 4, duration: 200 },
  slideLeft: { translateX: -4, duration: 200 },
  slideRight: { translateX: 4, duration: 200 },

  // Rotation effects
  rotateClockwise: { rotate: 5, duration: 200 },
  rotateCounterClockwise: { rotate: -5, duration: 200 },
  rotateFlip: { rotate: 180, duration: 400 },

  // Combined effects
  liftUp: {
    scale: 1.02,
    translateY: -2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    duration: 250,
  },
  pressDown: { scale: 0.98, translateY: 1, duration: 150 },
  glow: { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)', duration: 300 },

  // Card effects
  cardHover: {
    scale: 1.02,
    translateY: -4,
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    duration: 250,
  },
  cardSubtle: {
    translateY: -2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    duration: 200,
  },

  // Button effects
  buttonPrimary: { scale: 1.02, brightness: 1.1, duration: 200 },
  buttonSecondary: { backgroundColor: 'rgba(0,0,0,0.05)', duration: 200 },
  buttonGhost: { backgroundColor: 'rgba(0,0,0,0.05)', duration: 200 },

  // Image effects
  imageZoom: { scale: 1.1, duration: 400 },
  imageBlur: { blur: 2, brightness: 1.1, duration: 300 },
  imageFade: { opacity: 0.8, scale: 1.05, duration: 300 },

  // Text effects
  textGlow: {
    color: '#3b82f6',
    textShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
    duration: 200,
  },
  textBright: { color: '#1d4ed8', brightness: 1.2, duration: 200 },

  // Icon effects
  iconBounce: {
    scale: 1.2,
    duration: 200,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  iconSpin: { rotate: 360, duration: 600 },
  iconPulse: { scale: 1.1, opacity: 0.8, duration: 300 },
} as const;

/**
 * Applies a hover effect to an element
 */
export const applyHoverEffect = (
  element: HTMLElement,
  options: HoverEffectOptions = {},
): (() => void) => {
  const {
    duration = 200,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    scale,
    opacity,
    translateX,
    translateY,
    rotate,
    brightness,
    blur,
    borderRadius,
    boxShadow,
    backgroundColor,
    color,
    borderColor,
    delay = 0,
    persist = false,
  } = options;

  // Store original styles
  const originalStyles = {
    transform: element.style.transform,
    opacity: element.style.opacity,
    filter: element.style.filter,
    borderRadius: element.style.borderRadius,
    boxShadow: element.style.boxShadow,
    backgroundColor: element.style.backgroundColor,
    color: element.style.color,
    borderColor: element.style.borderColor,
    transition: element.style.transition,
  };

  // Create hover styles
  const createTransform = () => {
    const transforms: string[] = [];
    if (scale !== undefined) transforms.push(`scale(${scale})`);
    if (translateX !== undefined)
      transforms.push(`translateX(${translateX}px)`);
    if (translateY !== undefined)
      transforms.push(`translateY(${translateY}px)`);
    if (rotate !== undefined) transforms.push(`rotate(${rotate}deg)`);
    return transforms.length > 0 ? transforms.join(' ') : '';
  };

  const createFilter = () => {
    const filters: string[] = [];
    if (brightness !== undefined) filters.push(`brightness(${brightness})`);
    if (blur !== undefined) filters.push(`blur(${blur}px)`);
    return filters.length > 0 ? filters.join(' ') : '';
  };

  const applyHoverStyles = () => {
    // Set transition
    element.style.transition = `all ${duration}ms ${easing}`;

    // Apply transform
    const transform = createTransform();
    if (transform) element.style.transform = transform;

    // Apply other styles
    if (opacity !== undefined) element.style.opacity = opacity.toString();

    const filter = createFilter();
    if (filter) element.style.filter = filter;

    if (borderRadius !== undefined) element.style.borderRadius = borderRadius;
    if (boxShadow !== undefined) element.style.boxShadow = boxShadow;
    if (backgroundColor !== undefined)
      element.style.backgroundColor = backgroundColor;
    if (color !== undefined) element.style.color = color;
    if (borderColor !== undefined) element.style.borderColor = borderColor;
  };

  const removeHoverStyles = () => {
    // Reset to original styles
    setTimeout(() => {
      Object.entries(originalStyles).forEach(([property, value]) => {
        (element.style as any)[property] = value;
      });
    }, delay);
  };

  // Event handlers
  const handleMouseEnter = () => {
    applyHoverStyles();
  };

  const handleMouseLeave = () => {
    if (!persist) {
      removeHoverStyles();
    }
  };

  const handleFocus = () => {
    if (persist) {
      applyHoverStyles();
    }
  };

  const handleBlur = () => {
    if (persist) {
      removeHoverStyles();
    }
  };

  // Add event listeners
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  if (persist) {
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
  }

  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);

    if (persist) {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    }

    // Reset styles
    Object.entries(originalStyles).forEach(([property, value]) => {
      (element.style as any)[property] = value;
    });
  };
};

/**
 * Applies a preset hover effect
 */
export const applyPresetHoverEffect = (
  element: HTMLElement,
  preset: keyof typeof HOVER_PRESETS,
): (() => void) => {
  const options = HOVER_PRESETS[preset];
  return applyHoverEffect(element, options);
};

/**
 * Creates a hover effect with transform animations
 */
export const createTransformHover = (
  element: HTMLElement,
  options: HoverTransformOptions = {},
): (() => void) => {
  const {
    transformOrigin = 'center',
    preserve3d = false,
    backfaceVisibility = 'visible',
    ...hoverOptions
  } = options;

  // Set transform origin and 3D properties
  element.style.transformOrigin = transformOrigin;
  if (preserve3d) element.style.transformStyle = 'preserve-3d';
  element.style.backfaceVisibility = backfaceVisibility;

  return applyHoverEffect(element, hoverOptions);
};

/**
 * Creates a color transition hover effect
 */
export const createColorHover = (
  element: HTMLElement,
  options: HoverColorOptions = {},
): (() => void) => {
  const {
    from,
    to,
    property = 'color',
    duration = 200,
    easing = 'ease',
  } = options;

  const originalColor =
    from || getComputedStyle(element).getPropertyValue(property);

  const handleMouseEnter = () => {
    element.style.transition = `${property} ${duration}ms ${easing}`;
    if (to) (element.style as any)[property] = to;
  };

  const handleMouseLeave = () => {
    (element.style as any)[property] = originalColor;
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    (element.style as any)[property] = originalColor;
  };
};

/**
 * Creates a shadow hover effect
 */
export const createShadowHover = (
  element: HTMLElement,
  options: HoverShadowOptions = {},
): (() => void) => {
  const {
    color = 'rgba(0, 0, 0, 0.15)',
    offsetX = 0,
    offsetY = 4,
    blurRadius = 12,
    spreadRadius = 0,
    inset = false,
    duration = 250,
    easing = 'ease',
  } = options;

  const originalShadow = element.style.boxShadow;
  const shadowValue = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;

  const handleMouseEnter = () => {
    element.style.transition = `box-shadow ${duration}ms ${easing}`;
    element.style.boxShadow = shadowValue;
  };

  const handleMouseLeave = () => {
    element.style.boxShadow = originalShadow;
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    element.style.boxShadow = originalShadow;
  };
};

/**
 * Creates a compound hover effect with multiple animations
 */
export const createCompoundHover = (
  element: HTMLElement,
  effects: Array<{ type: 'transform' | 'color' | 'shadow'; options: any }>,
): (() => void) => {
  const cleanupFunctions = effects.map(effect => {
    switch (effect.type) {
      case 'transform':
        return applyHoverEffect(element, effect.options);
      case 'color':
        return createColorHover(element, effect.options);
      case 'shadow':
        return createShadowHover(element, effect.options);
      default:
        return () => {};
    }
  });

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * Applies hover effects to multiple elements
 */
export const applyHoverToElements = (
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  options: HoverEffectOptions | keyof typeof HOVER_PRESETS,
): (() => void) => {
  const elementsArray = Array.from(elements);

  const cleanupFunctions = elementsArray.map(element => {
    if (typeof options === 'string') {
      return applyPresetHoverEffect(element, options);
    } else {
      return applyHoverEffect(element, options);
    }
  });

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * Creates a hover effect that works with CSS classes
 */
export const createClassBasedHover = (
  element: HTMLElement,
  {
    hoverClass,
    activeClass,
    focusClass,
    duration = 200,
  }: {
    hoverClass: string;
    activeClass?: string;
    focusClass?: string;
    duration?: number;
  },
): (() => void) => {
  // Set transition duration
  element.style.transition = `all ${duration}ms ease`;

  const handleMouseEnter = () => {
    element.classList.add(hoverClass);
  };

  const handleMouseLeave = () => {
    element.classList.remove(hoverClass);
  };

  const handleMouseDown = () => {
    if (activeClass) element.classList.add(activeClass);
  };

  const handleMouseUp = () => {
    if (activeClass) element.classList.remove(activeClass);
  };

  const handleFocus = () => {
    if (focusClass) element.classList.add(focusClass);
  };

  const handleBlur = () => {
    if (focusClass) element.classList.remove(focusClass);
  };

  // Add event listeners
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  if (activeClass) {
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
  }

  if (focusClass) {
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
  }

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);

    if (activeClass) {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
    }

    if (focusClass) {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    }

    // Clean up classes
    element.classList.remove(hoverClass);
    if (activeClass) element.classList.remove(activeClass);
    if (focusClass) element.classList.remove(focusClass);
  };
};

/**
 * Initializes hover effects for elements with data attributes
 */
export const initializeDataAttributeHovers = (
  container: HTMLElement = document.body,
): (() => void) => {
  const elements = container.querySelectorAll('[data-hover]');
  const cleanupFunctions: Array<() => void> = [];

  elements.forEach(element => {
    if (!(element instanceof HTMLElement)) return;

    const hoverType = element.dataset.hover;
    if (!hoverType) return;

    let cleanup: () => void;

    if (hoverType in HOVER_PRESETS) {
      cleanup = applyPresetHoverEffect(
        element,
        hoverType as keyof typeof HOVER_PRESETS,
      );
    } else {
      // Parse custom options from data attributes
      const options: HoverEffectOptions = {};

      if (element.dataset.hoverScale)
        options.scale = parseFloat(element.dataset.hoverScale);
      if (element.dataset.hoverOpacity)
        options.opacity = parseFloat(element.dataset.hoverOpacity);
      if (element.dataset.hoverDuration)
        options.duration = parseInt(element.dataset.hoverDuration);
      if (element.dataset.hoverDelay)
        options.delay = parseInt(element.dataset.hoverDelay);
      if (element.dataset.hoverColor)
        options.color = element.dataset.hoverColor;
      if (element.dataset.hoverBg)
        options.backgroundColor = element.dataset.hoverBg;
      if (element.dataset.hoverShadow)
        options.boxShadow = element.dataset.hoverShadow;

      cleanup = applyHoverEffect(element, options);
    }

    cleanupFunctions.push(cleanup);
  });

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * React hook for hover effects
 */
export const useHoverEffect = (
  options: HoverEffectOptions | keyof typeof HOVER_PRESETS,
) => {
  return (element: HTMLElement | null) => {
    if (!element) return;

    if (typeof options === 'string') {
      return applyPresetHoverEffect(element, options);
    } else {
      return applyHoverEffect(element, options);
    }
  };
};

export default {
  applyHoverEffect,
  applyPresetHoverEffect,
  createTransformHover,
  createColorHover,
  createShadowHover,
  createCompoundHover,
  applyHoverToElements,
  createClassBasedHover,
  initializeDataAttributeHovers,
  useHoverEffect,
  HOVER_PRESETS,
};
