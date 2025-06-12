/**
 * Scroll Animation Utilities
 *
 * Provides comprehensive scroll-based animation functionality including
 * fade-in, slide-in, parallax, and reveal animations triggered by scroll position.
 */

export interface ScrollAnimationOptions {
  threshold?: number; // 0-1, percentage of element visibility
  offset?: number; // Offset in pixels
  duration?: number;
  delay?: number;
  easing?: string;
  once?: boolean; // Animate only once
  reverse?: boolean; // Reverse animation when scrolling back
  debug?: boolean; // Show debug information
}

export interface ScrollRevealOptions extends ScrollAnimationOptions {
  distance?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  scale?: number;
  rotate?: number;
  opacity?: number;
  blur?: number;
}

export interface ParallaxOptions {
  speed?: number; // -1 to 1, negative for reverse
  direction?: 'vertical' | 'horizontal';
  bounds?: {
    start?: number;
    end?: number;
  };
  element?: HTMLElement; // Element to apply transform to (default: self)
}

export interface ScrollProgressOptions {
  start?: number; // Start position (0-1)
  end?: number; // End position (0-1)
  property?: string; // CSS property to animate
  from?: string | number;
  to?: string | number;
  unit?: string; // CSS unit (px, %, em, etc.)
}

export interface IntersectionObserverConfig {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

// Pre-defined animation presets
export const SCROLL_ANIMATION_PRESETS = {
  // Fade animations
  fadeIn: {
    duration: 600,
    opacity: 0,
    initialTransform: 'translateY(0px)',
    finalTransform: 'translateY(0px)',
  },
  fadeInUp: {
    duration: 600,
    opacity: 0,
    distance: '30px',
    direction: 'bottom' as const,
  },
  fadeInDown: {
    duration: 600,
    opacity: 0,
    distance: '30px',
    direction: 'top' as const,
  },
  fadeInLeft: {
    duration: 600,
    opacity: 0,
    distance: '30px',
    direction: 'right' as const,
  },
  fadeInRight: {
    duration: 600,
    opacity: 0,
    distance: '30px',
    direction: 'left' as const,
  },

  // Scale animations
  scaleIn: {
    duration: 500,
    scale: 0.8,
    opacity: 0,
  },
  scaleUp: {
    duration: 400,
    scale: 0.95,
  },

  // Slide animations
  slideUp: {
    duration: 700,
    distance: '50px',
    direction: 'bottom' as const,
  },
  slideDown: {
    duration: 700,
    distance: '50px',
    direction: 'top' as const,
  },
  slideLeft: {
    duration: 700,
    distance: '50px',
    direction: 'right' as const,
  },
  slideRight: {
    duration: 700,
    distance: '50px',
    direction: 'left' as const,
  },

  // Rotation animations
  rotateIn: {
    duration: 800,
    rotate: -10,
    opacity: 0,
  },
  rotateInUp: {
    duration: 800,
    rotate: -5,
    distance: '20px',
    direction: 'bottom' as const,
    opacity: 0,
  },

  // Zoom animations
  zoomIn: {
    duration: 600,
    scale: 0.6,
    opacity: 0,
  },
  zoomInUp: {
    duration: 600,
    scale: 0.8,
    distance: '60px',
    direction: 'bottom' as const,
    opacity: 0,
  },

  // Flip animations
  flipUp: {
    duration: 800,
    initialTransform: 'perspective(400px) rotateX(90deg)',
    finalTransform: 'perspective(400px) rotateX(0deg)',
  },
  flipLeft: {
    duration: 800,
    initialTransform: 'perspective(400px) rotateY(90deg)',
    finalTransform: 'perspective(400px) rotateY(0deg)',
  },

  // Bounce animations
  bounceIn: {
    duration: 1000,
    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
    scale: 0.3,
    opacity: 0,
  },
  bounceInUp: {
    duration: 1000,
    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
    distance: '3000px',
    direction: 'bottom' as const,
  },
} as const;

/**
 * Creates an intersection observer for scroll animations
 */
export const createScrollObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  config: IntersectionObserverConfig = {},
): IntersectionObserver => {
  const { root = null, rootMargin = '0px', threshold = 0.1 } = config;

  return new IntersectionObserver(callback, {
    root,
    rootMargin,
    threshold,
  });
};

/**
 * Applies scroll reveal animation to an element
 */
export const applyScrollReveal = (
  element: HTMLElement,
  options: ScrollRevealOptions = {},
): (() => void) => {
  const {
    threshold = 0.1,
    offset = 0,
    duration = 600,
    delay = 0,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    once = true,
    reverse = false,
    distance = '30px',
    direction = 'bottom',
    scale = 1,
    rotate = 0,
    opacity = 1,
    blur = 0,
    debug = false,
  } = options;

  // Store original styles
  const originalStyles = {
    opacity: element.style.opacity,
    transform: element.style.transform,
    filter: element.style.filter,
    transition: element.style.transition,
  };

  // Calculate initial transform
  const getInitialTransform = (): string => {
    const transforms: string[] = [];

    // Direction-based translation
    switch (direction) {
      case 'top':
        transforms.push(`translateY(-${distance})`);
        break;
      case 'bottom':
        transforms.push(`translateY(${distance})`);
        break;
      case 'left':
        transforms.push(`translateX(-${distance})`);
        break;
      case 'right':
        transforms.push(`translateX(${distance})`);
        break;
    }

    // Scale
    if (scale !== 1) {
      transforms.push(`scale(${scale})`);
    }

    // Rotation
    if (rotate !== 0) {
      transforms.push(`rotate(${rotate}deg)`);
    }

    return transforms.join(' ');
  };

  // Set initial state
  const setInitialState = () => {
    const initialTransform = getInitialTransform();
    const initialFilter = blur > 0 ? `blur(${blur}px)` : '';

    element.style.opacity = opacity < 1 ? opacity.toString() : '0';
    element.style.transform = initialTransform;
    if (initialFilter) element.style.filter = initialFilter;
    element.style.transition = 'none';

    if (debug) {
      console.log('Scroll reveal initial state:', {
        element: element.tagName,
        opacity: element.style.opacity,
        transform: element.style.transform,
        filter: element.style.filter,
      });
    }
  };

  // Animate to visible state
  const animateIn = () => {
    setTimeout(() => {
      element.style.transition = `all ${duration}ms ${easing}`;
      element.style.opacity = '1';
      element.style.transform =
        'translateX(0) translateY(0) scale(1) rotate(0deg)';
      element.style.filter = 'blur(0px)';

      if (debug) {
        console.log('Scroll reveal animate in:', element.tagName);
      }
    }, delay);
  };

  // Animate to hidden state
  const animateOut = () => {
    if (!reverse) return;

    element.style.transition = `all ${duration}ms ${easing}`;
    setInitialState();
    setTimeout(() => {
      element.style.transition = `all ${duration}ms ${easing}`;
    }, 50);

    if (debug) {
      console.log('Scroll reveal animate out:', element.tagName);
    }
  };

  let hasAnimated = false;

  // Intersection observer callback
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.target === element) {
        const rect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;
        const triggerPoint = viewportHeight - offset;

        if (entry.isIntersecting && rect.top < triggerPoint) {
          if (!hasAnimated || !once) {
            animateIn();
            if (once) hasAnimated = true;
          }
        } else if (reverse && hasAnimated && !entry.isIntersecting) {
          animateOut();
          if (once) hasAnimated = false;
        }
      }
    });
  };

  // Set initial state
  setInitialState();

  // Create observer
  const observer = createScrollObserver(handleIntersection, {
    threshold,
    rootMargin: `${offset}px`,
  });

  observer.observe(element);

  // Return cleanup function
  return () => {
    observer.unobserve(element);
    observer.disconnect();

    // Reset styles
    Object.entries(originalStyles).forEach(([property, value]) => {
      (element.style as any)[property] = value;
    });
  };
};

/**
 * Applies a preset scroll animation
 */
export const applyPresetScrollAnimation = (
  element: HTMLElement,
  preset: keyof typeof SCROLL_ANIMATION_PRESETS,
  options: ScrollAnimationOptions = {},
): (() => void) => {
  const presetOptions = SCROLL_ANIMATION_PRESETS[preset];
  const mergedOptions = { ...presetOptions, ...options };
  return applyScrollReveal(element, mergedOptions);
};

/**
 * Creates a parallax effect for an element
 */
export const createParallaxEffect = (
  element: HTMLElement,
  options: ParallaxOptions = {},
): (() => void) => {
  const {
    speed = -0.5,
    direction = 'vertical',
    bounds = {},
    element: targetElement = element,
  } = options;

  const { start = 0, end = 1 } = bounds;

  let ticking = false;

  const updateParallax = () => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;

    // Calculate progress (0 to 1)
    const progress = Math.max(
      0,
      Math.min(
        1,
        (viewportCenter - elementCenter + viewportHeight) /
          (viewportHeight + rect.height),
      ),
    );

    // Apply bounds
    const boundedProgress = Math.max(start, Math.min(end, progress));

    // Calculate movement
    const movement = (boundedProgress - 0.5) * speed * 100;

    // Apply transform
    if (direction === 'vertical') {
      targetElement.style.transform = `translateY(${movement}px)`;
    } else {
      targetElement.style.transform = `translateX(${movement}px)`;
    }

    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  // Initial call
  updateParallax();

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    targetElement.style.transform = '';
  };
};

/**
 * Creates a scroll progress animation
 */
export const createScrollProgress = (
  element: HTMLElement,
  options: ScrollProgressOptions = {},
): (() => void) => {
  const {
    start = 0,
    end = 1,
    property = 'opacity',
    from = 0,
    to = 1,
    unit = '',
  } = options;

  let ticking = false;

  const updateProgress = () => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate element's visibility progress
    const elementTop = rect.top;
    const elementHeight = rect.height;
    const visibleHeight = Math.max(
      0,
      Math.min(elementHeight, viewportHeight - elementTop),
    );
    const visibility = visibleHeight / elementHeight;

    // Apply start/end bounds
    const progress = Math.max(
      0,
      Math.min(1, (visibility - start) / (end - start)),
    );

    // Interpolate value
    const fromValue =
      typeof from === 'number' ? from : parseFloat(from.toString());
    const toValue = typeof to === 'number' ? to : parseFloat(to.toString());
    const currentValue = fromValue + (toValue - fromValue) * progress;

    // Apply to element
    (element.style as any)[property] = `${currentValue}${unit}`;

    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  };

  // Initial call
  updateProgress();

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

/**
 * Applies scroll animations to multiple elements
 */
export const applyScrollAnimationsToElements = (
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  options: ScrollRevealOptions | keyof typeof SCROLL_ANIMATION_PRESETS,
  stagger: number = 0,
): (() => void) => {
  const elementsArray = Array.from(elements);

  const cleanupFunctions = elementsArray.map((element, index) => {
    const delayedOptions =
      typeof options === 'string'
        ? { delay: index * stagger }
        : { ...options, delay: (options.delay || 0) + index * stagger };

    if (typeof options === 'string') {
      return applyPresetScrollAnimation(element, options, delayedOptions);
    } else {
      return applyScrollReveal(element, delayedOptions);
    }
  });

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * Creates a waypoint trigger for custom actions
 */
export const createWaypoint = (
  element: HTMLElement,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverConfig = {},
): (() => void) => {
  const observer = createScrollObserver([callback], options);
  observer.observe(element);

  return () => {
    observer.unobserve(element);
    observer.disconnect();
  };
};

/**
 * Creates a scroll-triggered counter animation
 */
export const createCountUpAnimation = (
  element: HTMLElement,
  {
    from = 0,
    to = 100,
    duration = 2000,
    separator = ',',
    decimal = 0,
    prefix = '',
    suffix = '',
    easing = 'easeOutCubic',
  }: {
    from?: number;
    to?: number;
    duration?: number;
    separator?: string;
    decimal?: number;
    prefix?: string;
    suffix?: string;
    easing?: string;
  } = {},
): (() => void) => {
  let hasTriggered = false;

  const easingFunctions = {
    linear: (t: number) => t,
    easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  const easingFunc =
    easingFunctions[easing as keyof typeof easingFunctions] ||
    easingFunctions.easeOutCubic;

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimal);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  const animateCount = () => {
    if (hasTriggered) return;
    hasTriggered = true;

    const startTime = Date.now();
    const difference = to - from;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunc(progress);
      const currentValue = from + difference * easedProgress;

      element.textContent = prefix + formatNumber(currentValue) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    updateCount();
  };

  return createWaypoint(
    element,
    entry => {
      if (entry.isIntersecting) {
        animateCount();
      }
    },
    { threshold: 0.5 },
  );
};

/**
 * Initializes scroll animations for elements with data attributes
 */
export const initializeDataAttributeScrollAnimations = (
  container: HTMLElement = document.body,
): (() => void) => {
  const elements = container.querySelectorAll('[data-scroll]');
  const cleanupFunctions: Array<() => void> = [];

  elements.forEach(element => {
    if (!(element instanceof HTMLElement)) return;

    const animationType = element.dataset.scroll;
    if (!animationType) return;

    // Parse options from data attributes
    const options: ScrollRevealOptions = {};

    if (element.dataset.scrollDelay)
      options.delay = parseInt(element.dataset.scrollDelay);
    if (element.dataset.scrollDuration)
      options.duration = parseInt(element.dataset.scrollDuration);
    if (element.dataset.scrollDistance)
      options.distance = element.dataset.scrollDistance;
    if (element.dataset.scrollDirection)
      options.direction = element.dataset.scrollDirection as any;
    if (element.dataset.scrollOnce)
      options.once = element.dataset.scrollOnce === 'true';
    if (element.dataset.scrollReverse)
      options.reverse = element.dataset.scrollReverse === 'true';

    let cleanup: () => void;

    if (animationType in SCROLL_ANIMATION_PRESETS) {
      cleanup = applyPresetScrollAnimation(
        element,
        animationType as keyof typeof SCROLL_ANIMATION_PRESETS,
        options,
      );
    } else {
      cleanup = applyScrollReveal(element, options);
    }

    cleanupFunctions.push(cleanup);
  });

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * React hook for scroll animations
 */
export const useScrollAnimation = (
  options: ScrollRevealOptions | keyof typeof SCROLL_ANIMATION_PRESETS,
) => {
  return (element: HTMLElement | null) => {
    if (!element) return;

    if (typeof options === 'string') {
      return applyPresetScrollAnimation(element, options);
    } else {
      return applyScrollReveal(element, options);
    }
  };
};

export default {
  applyScrollReveal,
  applyPresetScrollAnimation,
  createParallaxEffect,
  createScrollProgress,
  applyScrollAnimationsToElements,
  createWaypoint,
  createCountUpAnimation,
  initializeDataAttributeScrollAnimations,
  useScrollAnimation,
  createScrollObserver,
  SCROLL_ANIMATION_PRESETS,
};
