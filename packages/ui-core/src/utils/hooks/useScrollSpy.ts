import { useState, useEffect, useCallback, useRef } from 'react';

export interface ScrollSpyOptions {
  /** Root element for intersection observer (default: null for viewport) */
  root?: Element | null;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number | number[];
  /** Offset from top when determining active section */
  offset?: number;
  /** Smooth scroll behavior when navigating */
  smooth?: boolean;
  /** Whether to update URL hash when active section changes */
  updateHash?: boolean;
  /** Whether to listen for hash changes and scroll to sections */
  hashNavigation?: boolean;
  /** Debounce delay for scroll events (ms) */
  debounceDelay?: number;
  /** Custom scroll container (default: window) */
  scrollContainer?: Element | Window;
}

export interface ScrollSpySection {
  id: string;
  element: HTMLElement;
  isActive: boolean;
  isVisible: boolean;
  visibilityRatio: number;
}

export interface UseScrollSpyReturn {
  /** Currently active section ID */
  activeSection: string | null;
  /** Array of all tracked sections with their state */
  sections: ScrollSpySection[];
  /** Function to manually set active section */
  setActiveSection: (sectionId: string) => void;
  /** Function to scroll to a specific section */
  scrollToSection: (sectionId: string, options?: ScrollToOptions) => void;
  /** Function to register a new section */
  registerSection: (id: string, element: HTMLElement) => void;
  /** Function to unregister a section */
  unregisterSection: (id: string) => void;
  /** Function to refresh all sections */
  refreshSections: () => void;
}

/**
 * Advanced scroll spy hook for tracking active sections and navigation
 */
export const useScrollSpy = (
  sectionIds: string[] = [],
  options: ScrollSpyOptions = {},
): UseScrollSpyReturn => {
  const {
    root = null,
    rootMargin = '0px 0px -50% 0px',
    threshold = [0, 0.25, 0.5, 0.75, 1],
    offset = 0,
    smooth = true,
    updateHash = false,
    hashNavigation = true,
    debounceDelay = 100,
    scrollContainer = typeof window !== 'undefined' ? window : null,
  } = options;

  // State
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<ScrollSpySection[]>([]);

  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const debounceTimeoutRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  /**
   * Debounced function wrapper
   */
  const debounce = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = window.setTimeout(
        () => func(...args),
        delay,
      );
    };
  }, []);

  /**
   * Gets the scroll position of the container
   */
  const getScrollPosition = useCallback(() => {
    if (scrollContainer === window || scrollContainer === null) {
      return {
        scrollTop: window.pageYOffset || document.documentElement.scrollTop,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: window.innerHeight,
      };
    } else {
      const container = scrollContainer as Element;
      return {
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
      };
    }
  }, [scrollContainer]);

  /**
   * Calculates which section should be active based on scroll position
   */
  const calculateActiveSection = useCallback(() => {
    const { scrollTop, clientHeight } = getScrollPosition();
    const centerPoint = scrollTop + clientHeight / 2 + offset;

    let activeId: string | null = null;
    let minDistance = Infinity;

    sections.forEach(section => {
      if (!section.element) return;

      const rect = section.element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      const elementCenter = elementTop + rect.height / 2;
      const distance = Math.abs(centerPoint - elementCenter);

      // Prefer sections that are currently visible
      if (section.isVisible && distance < minDistance) {
        minDistance = distance;
        activeId = section.id;
      }
    });

    // If no visible section found, find the closest one
    if (!activeId) {
      sections.forEach(section => {
        if (!section.element) return;

        const rect = section.element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const distance = Math.abs(scrollTop - elementTop);

        if (distance < minDistance) {
          minDistance = distance;
          activeId = section.id;
        }
      });
    }

    return activeId;
  }, [sections, getScrollPosition, offset]);

  /**
   * Updates the active section
   */
  const updateActiveSection = useCallback(() => {
    if (isScrollingRef.current) return;

    const newActiveSection = calculateActiveSection();

    if (newActiveSection !== activeSection) {
      setActiveSection(newActiveSection);

      // Update URL hash if enabled
      if (updateHash && newActiveSection && !isScrollingRef.current) {
        const newHash = `#${newActiveSection}`;
        if (window.location.hash !== newHash) {
          window.history.replaceState(null, '', newHash);
        }
      }
    }
  }, [activeSection, calculateActiveSection, updateHash]);

  /**
   * Debounced version of updateActiveSection
   */
  const debouncedUpdateActiveSection = useCallback(
    debounce(updateActiveSection, debounceDelay),
    [updateActiveSection, debounceDelay],
  );

  /**
   * Intersection observer callback
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      setSections(prevSections => {
        const newSections = [...prevSections];

        entries.forEach(entry => {
          const sectionIndex = newSections.findIndex(
            s => s.element === entry.target,
          );

          if (sectionIndex >= 0) {
            newSections[sectionIndex] = {
              ...newSections[sectionIndex],
              isVisible: entry.isIntersecting,
              visibilityRatio: entry.intersectionRatio,
            };
          }
        });

        return newSections;
      });

      // Update active section after intersection changes
      setTimeout(updateActiveSection, 0);
    },
    [updateActiveSection],
  );

  /**
   * Registers a new section
   */
  const registerSection = useCallback((id: string, element: HTMLElement) => {
    sectionsMapRef.current.set(id, element);

    setSections(prevSections => {
      const existingIndex = prevSections.findIndex(s => s.id === id);
      const newSection: ScrollSpySection = {
        id,
        element,
        isActive: false,
        isVisible: false,
        visibilityRatio: 0,
      };

      if (existingIndex >= 0) {
        const newSections = [...prevSections];
        newSections[existingIndex] = newSection;
        return newSections;
      } else {
        return [...prevSections, newSection].sort((a, b) => {
          // Sort sections by their position in the document
          const rectA = a.element.getBoundingClientRect();
          const rectB = b.element.getBoundingClientRect();
          return rectA.top - rectB.top;
        });
      }
    });

    // Observe the new element
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  /**
   * Unregisters a section
   */
  const unregisterSection = useCallback(
    (id: string) => {
      const element = sectionsMapRef.current.get(id);

      if (element && observerRef.current) {
        observerRef.current.unobserve(element);
      }

      sectionsMapRef.current.delete(id);
      setSections(prevSections => prevSections.filter(s => s.id !== id));

      if (activeSection === id) {
        setActiveSection(null);
      }
    },
    [activeSection],
  );

  /**
   * Scrolls to a specific section
   */
  const scrollToSection = useCallback(
    (sectionId: string, scrollOptions: ScrollToOptions = {}) => {
      const element = sectionsMapRef.current.get(sectionId);
      if (!element) return;

      isScrollingRef.current = true;

      const rect = element.getBoundingClientRect();
      const { scrollTop } = getScrollPosition();
      const targetPosition = rect.top + scrollTop - offset;

      const defaultOptions: ScrollToOptions = {
        top: targetPosition,
        behavior: smooth ? 'smooth' : 'auto',
      };

      const finalOptions = { ...defaultOptions, ...scrollOptions };

      if (scrollContainer === window || scrollContainer === null) {
        window.scrollTo(finalOptions);
      } else {
        (scrollContainer as Element).scrollTo(finalOptions);
      }

      // Set active section immediately
      setActiveSection(sectionId);

      // Update hash if enabled
      if (updateHash) {
        window.history.pushState(null, '', `#${sectionId}`);
      }

      // Reset scrolling flag after animation
      setTimeout(
        () => {
          isScrollingRef.current = false;
        },
        smooth ? 1000 : 100,
      );
    },
    [getScrollPosition, offset, smooth, scrollContainer, updateHash],
  );

  /**
   * Refreshes all sections
   */
  const refreshSections = useCallback(() => {
    // Re-sort sections based on current document position
    setSections(prevSections => {
      return [...prevSections].sort((a, b) => {
        const rectA = a.element.getBoundingClientRect();
        const rectB = b.element.getBoundingClientRect();
        return rectA.top - rectB.top;
      });
    });

    // Recalculate active section
    setTimeout(updateActiveSection, 0);
  }, [updateActiveSection]);

  /**
   * Handles hash navigation
   */
  const handleHashChange = useCallback(() => {
    if (!hashNavigation) return;

    const hash = window.location.hash.slice(1);
    if (hash && sectionsMapRef.current.has(hash)) {
      scrollToSection(hash);
    }
  }, [hashNavigation, scrollToSection]);

  /**
   * Manual setter for active section
   */
  const manualSetActiveSection = useCallback(
    (sectionId: string) => {
      setActiveSection(sectionId);

      if (updateHash) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    },
    [updateHash],
  );

  // Initialize sections from sectionIds prop
  useEffect(() => {
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        registerSection(id, element);
      }
    });
  }, [sectionIds, registerSection]);

  // Setup intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold,
    });

    // Observe existing sections
    sections.forEach(section => {
      if (section.element) {
        observerRef.current!.observe(section.element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [root, rootMargin, threshold, handleIntersection]);

  // Setup scroll listener
  useEffect(() => {
    const container =
      scrollContainer === window ? document : (scrollContainer as Element);

    if (container) {
      container.addEventListener('scroll', debouncedUpdateActiveSection, {
        passive: true,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', debouncedUpdateActiveSection);
      }
    };
  }, [scrollContainer, debouncedUpdateActiveSection]);

  // Setup hash navigation
  useEffect(() => {
    if (hashNavigation) {
      window.addEventListener('hashchange', handleHashChange);

      // Handle initial hash
      handleHashChange();
    }

    return () => {
      if (hashNavigation) {
        window.removeEventListener('hashchange', handleHashChange);
      }
    };
  }, [hashNavigation, handleHashChange]);

  // Update section active states
  useEffect(() => {
    setSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        isActive: section.id === activeSection,
      })),
    );
  }, [activeSection]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    activeSection,
    sections,
    setActiveSection: manualSetActiveSection,
    scrollToSection,
    registerSection,
    unregisterSection,
    refreshSections,
  };
};

/**
 * Hook for simple scroll spy with automatic section detection
 */
export const useAutoScrollSpy = (
  containerSelector?: string,
  options: Omit<ScrollSpyOptions, 'sectionIds'> = {},
) => {
  const [detectedSections, setDetectedSections] = useState<string[]>([]);

  // Detect sections automatically
  useEffect(() => {
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : document.body;

    if (container) {
      const headings = container.querySelectorAll(
        'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id], section[id], div[id]',
      );
      const ids = Array.from(headings)
        .map(el => el.id)
        .filter(Boolean);

      setDetectedSections(ids);
    }
  }, [containerSelector]);

  return useScrollSpy(detectedSections, options);
};

export default useScrollSpy;
