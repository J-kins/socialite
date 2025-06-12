/**
 * DOM Utilities
 *
 * Provides comprehensive DOM manipulation utilities including element queries,
 * focus management, dimension calculations, and viewport detection.
 */

export interface ElementDimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

export interface ViewportInfo {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  devicePixelRatio: number;
  orientation?: 'portrait' | 'landscape';
}

export interface FocusableElementsOptions {
  includeHidden?: boolean;
  includeDisabled?: boolean;
  tabbableOnly?: boolean;
}

export interface ScrollOptions {
  behavior?: 'auto' | 'smooth';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
  offset?: { x?: number; y?: number };
}

// Focusable element selectors
const FOCUSABLE_SELECTORS = [
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  'area[href]',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
];

const TABBABLE_SELECTORS = [
  ...FOCUSABLE_SELECTORS.filter(s => !s.includes('[tabindex]')),
  '[tabindex]:not([tabindex="-1"]):not([tabindex=""])',
];

/**
 * Gets element dimensions and position
 */
export const getElementDimensions = (
  element: HTMLElement,
): ElementDimensions => {
  const rect = element.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
};

/**
 * Gets viewport information
 */
export const getViewportInfo = (): ViewportInfo => {
  const viewport: ViewportInfo = {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX || window.pageXOffset,
    scrollY: window.scrollY || window.pageYOffset,
    devicePixelRatio: window.devicePixelRatio || 1,
  };

  // Determine orientation
  if (viewport.width > viewport.height) {
    viewport.orientation = 'landscape';
  } else {
    viewport.orientation = 'portrait';
  }

  return viewport;
};

/**
 * Checks if element is in viewport
 */
export const isElementInViewport = (
  element: HTMLElement,
  offset: { top?: number; bottom?: number; left?: number; right?: number } = {},
): boolean => {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportInfo();

  const { top = 0, bottom = 0, left = 0, right = 0 } = offset;

  return (
    rect.top >= -top &&
    rect.left >= -left &&
    rect.bottom <= viewport.height + bottom &&
    rect.right <= viewport.width + right
  );
};

/**
 * Gets percentage of element visible in viewport
 */
export const getElementVisibility = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportInfo();

  const visibleWidth = Math.max(
    0,
    Math.min(rect.right, viewport.width) - Math.max(rect.left, 0),
  );
  const visibleHeight = Math.max(
    0,
    Math.min(rect.bottom, viewport.height) - Math.max(rect.top, 0),
  );
  const visibleArea = visibleWidth * visibleHeight;
  const totalArea = rect.width * rect.height;

  return totalArea > 0 ? visibleArea / totalArea : 0;
};

/**
 * Gets all focusable elements within a container
 */
export const getFocusableElements = (
  container: HTMLElement = document.body,
  options: FocusableElementsOptions = {},
): HTMLElement[] => {
  const {
    includeHidden = false,
    includeDisabled = false,
    tabbableOnly = false,
  } = options;

  const selectors = tabbableOnly ? TABBABLE_SELECTORS : FOCUSABLE_SELECTORS;
  let selector = selectors.join(', ');

  if (!includeDisabled) {
    selector = selector.replace(
      /:not\(\[disabled\]\)/g,
      ':not([disabled]):not([aria-disabled="true"])',
    );
  }

  const elements = Array.from(
    container.querySelectorAll(selector),
  ) as HTMLElement[];

  return elements.filter(element => {
    // Check if element is hidden
    if (!includeHidden) {
      const styles = window.getComputedStyle(element);
      if (
        styles.display === 'none' ||
        styles.visibility === 'hidden' ||
        styles.opacity === '0' ||
        element.hidden ||
        element.getAttribute('aria-hidden') === 'true'
      ) {
        return false;
      }
    }

    // Check if element has tabindex -1 (programmatically focusable but not tabbable)
    if (tabbableOnly && element.tabIndex === -1) {
      return false;
    }

    return true;
  });
};

/**
 * Gets the first focusable element in a container
 */
export const getFirstFocusableElement = (
  container: HTMLElement = document.body,
  options: FocusableElementsOptions = {},
): HTMLElement | null => {
  const elements = getFocusableElements(container, options);
  return elements[0] || null;
};

/**
 * Gets the last focusable element in a container
 */
export const getLastFocusableElement = (
  container: HTMLElement = document.body,
  options: FocusableElementsOptions = {},
): HTMLElement | null => {
  const elements = getFocusableElements(container, options);
  return elements[elements.length - 1] || null;
};

/**
 * Moves focus to next/previous focusable element
 */
export const moveFocus = (
  direction: 'next' | 'previous',
  container: HTMLElement = document.body,
): HTMLElement | null => {
  const focusableElements = getFocusableElements(container, {
    tabbableOnly: true,
  });
  const currentIndex = focusableElements.findIndex(
    el => el === document.activeElement,
  );

  let targetIndex: number;

  if (direction === 'next') {
    targetIndex =
      currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
  } else {
    targetIndex =
      currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
  }

  const targetElement = focusableElements[targetIndex];
  if (targetElement) {
    targetElement.focus();
    return targetElement;
  }

  return null;
};

/**
 * Traps focus within a container
 */
export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = getFocusableElements(container, {
    tabbableOnly: true,
  });
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab (forward)
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  // Focus first element initially
  firstElement?.focus();

  // Add event listener
  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Creates a focus restoration utility
 */
export const createFocusRestore = (): {
  save: () => void;
  restore: () => void;
} => {
  let previousActiveElement: HTMLElement | null = null;

  return {
    save: () => {
      previousActiveElement = document.activeElement as HTMLElement;
    },
    restore: () => {
      if (
        previousActiveElement &&
        typeof previousActiveElement.focus === 'function'
      ) {
        previousActiveElement.focus();
        previousActiveElement = null;
      }
    },
  };
};

/**
 * Scrolls element into view with options
 */
export const scrollIntoView = (
  element: HTMLElement,
  options: ScrollOptions = {},
): void => {
  const {
    behavior = 'smooth',
    block = 'nearest',
    inline = 'nearest',
    offset = {},
  } = options;

  // Use native scrollIntoView if no offset is needed
  if (!offset.x && !offset.y) {
    element.scrollIntoView({
      behavior,
      block,
      inline,
    });
    return;
  }

  // Calculate target position with offset
  const rect = element.getBoundingClientRect();
  const viewport = getViewportInfo();

  let targetX = viewport.scrollX;
  let targetY = viewport.scrollY;

  // Calculate Y position
  switch (block) {
    case 'start':
      targetY = viewport.scrollY + rect.top - (offset.y || 0);
      break;
    case 'center':
      targetY =
        viewport.scrollY + rect.top - viewport.height / 2 + rect.height / 2;
      break;
    case 'end':
      targetY =
        viewport.scrollY + rect.bottom - viewport.height + (offset.y || 0);
      break;
    case 'nearest':
      if (rect.top < 0) {
        targetY = viewport.scrollY + rect.top - (offset.y || 0);
      } else if (rect.bottom > viewport.height) {
        targetY =
          viewport.scrollY + rect.bottom - viewport.height + (offset.y || 0);
      }
      break;
  }

  // Calculate X position
  switch (inline) {
    case 'start':
      targetX = viewport.scrollX + rect.left - (offset.x || 0);
      break;
    case 'center':
      targetX =
        viewport.scrollX + rect.left - viewport.width / 2 + rect.width / 2;
      break;
    case 'end':
      targetX =
        viewport.scrollX + rect.right - viewport.width + (offset.x || 0);
      break;
    case 'nearest':
      if (rect.left < 0) {
        targetX = viewport.scrollX + rect.left - (offset.x || 0);
      } else if (rect.right > viewport.width) {
        targetX =
          viewport.scrollX + rect.right - viewport.width + (offset.x || 0);
      }
      break;
  }

  // Scroll to calculated position
  window.scrollTo({
    left: targetX,
    top: targetY,
    behavior,
  });
};

/**
 * Gets scroll parent of an element
 */
export const getScrollParent = (element: HTMLElement): HTMLElement | null => {
  if (!element || element === document.body) {
    return document.body;
  }

  const { overflow, overflowX, overflowY } = window.getComputedStyle(element);

  if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(element.parentElement as HTMLElement);
};

/**
 * Calculates distance between two elements
 */
export const getElementDistance = (
  element1: HTMLElement,
  element2: HTMLElement,
): number => {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  const center1 = {
    x: rect1.left + rect1.width / 2,
    y: rect1.top + rect1.height / 2,
  };

  const center2 = {
    x: rect2.left + rect2.width / 2,
    y: rect2.top + rect2.height / 2,
  };

  return Math.sqrt(
    Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2),
  );
};

/**
 * Checks if element is currently visible (not hidden by CSS)
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  if (!element || !element.parentElement) return false;

  const styles = window.getComputedStyle(element);

  if (
    styles.display === 'none' ||
    styles.visibility === 'hidden' ||
    styles.opacity === '0' ||
    element.hidden
  ) {
    return false;
  }

  // Check if any parent element is hidden
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const parentStyles = window.getComputedStyle(parent);
    if (
      parentStyles.display === 'none' ||
      parentStyles.visibility === 'hidden' ||
      parentStyles.opacity === '0' ||
      parent.hidden
    ) {
      return false;
    }
    parent = parent.parentElement;
  }

  return true;
};

/**
 * Gets element's computed style property
 */
export const getStyleProperty = (
  element: HTMLElement,
  property: string,
): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

/**
 * Sets multiple style properties at once
 */
export const setStyleProperties = (
  element: HTMLElement,
  styles: Record<string, string | number>,
): void => {
  Object.entries(styles).forEach(([property, value]) => {
    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    element.style.setProperty(cssProperty, value.toString());
  });
};

/**
 * Creates a debounced resize observer
 */
export const createDebouncedResizeObserver = (
  callback: (entries: ResizeObserverEntry[]) => void,
  delay: number = 250,
): ResizeObserver => {
  let timeoutId: number;

  return new ResizeObserver(entries => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(entries);
    }, delay);
  });
};

/**
 * Gets element's position relative to another element
 */
export const getRelativePosition = (
  element: HTMLElement,
  relativeTo: HTMLElement,
): { x: number; y: number } => {
  const elementRect = element.getBoundingClientRect();
  const relativeRect = relativeTo.getBoundingClientRect();

  return {
    x: elementRect.left - relativeRect.left,
    y: elementRect.top - relativeRect.top,
  };
};

/**
 * Clones an element with or without event listeners
 */
export const cloneElement = (
  element: HTMLElement,
  deep: boolean = true,
  includeEvents: boolean = false,
): HTMLElement => {
  const clone = element.cloneNode(deep) as HTMLElement;

  if (includeEvents) {
    // Note: This is a simplified version - full event cloning is complex
    // In practice, you'd need to track and re-attach specific event listeners
    console.warn('Event cloning is not fully implemented in this utility');
  }

  return clone;
};

/**
 * Creates a click outside handler
 */
export const createClickOutsideHandler = (
  element: HTMLElement,
  callback: (event: MouseEvent) => void,
  options: { includeEscape?: boolean } = {},
): (() => void) => {
  const { includeEscape = false } = options;

  const handleClick = (event: MouseEvent) => {
    if (!element.contains(event.target as Node)) {
      callback(event);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (includeEscape && event.key === 'Escape') {
      callback(event as any);
    }
  };

  document.addEventListener('mousedown', handleClick);
  if (includeEscape) {
    document.addEventListener('keydown', handleKeyDown);
  }

  return () => {
    document.removeEventListener('mousedown', handleClick);
    if (includeEscape) {
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
};

/**
 * Measures text width using canvas
 */
export const measureTextWidth = (
  text: string,
  font: string = '16px sans-serif',
): number => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return 0;

  context.font = font;
  return context.measureText(text).width;
};

/**
 * Gets element's z-index including inherited values
 */
export const getEffectiveZIndex = (element: HTMLElement): number => {
  let currentElement: HTMLElement | null = element;
  let zIndex = 0;

  while (currentElement) {
    const styles = window.getComputedStyle(currentElement);
    const currentZIndex = parseInt(styles.zIndex, 10);

    if (!isNaN(currentZIndex) && currentZIndex > zIndex) {
      zIndex = currentZIndex;
    }

    currentElement = currentElement.parentElement;
  }

  return zIndex;
};

export default {
  getElementDimensions,
  getViewportInfo,
  isElementInViewport,
  getElementVisibility,
  getFocusableElements,
  getFirstFocusableElement,
  getLastFocusableElement,
  moveFocus,
  trapFocus,
  createFocusRestore,
  scrollIntoView,
  getScrollParent,
  getElementDistance,
  isElementVisible,
  getStyleProperty,
  setStyleProperties,
  createDebouncedResizeObserver,
  getRelativePosition,
  cloneElement,
  createClickOutsideHandler,
  measureTextWidth,
  getEffectiveZIndex,
};
