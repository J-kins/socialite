import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';

export interface ScrollSpySection {
  id: string;
  label: string;
  element?: string; // CSS selector or element ID
  offset?: number;
  icon?: string;
  badge?: number;
  children?: ScrollSpySection[];
  isDisabled?: boolean;
  metadata?: Record<string, any>;
}

export interface ScrollSpyNavProps {
  /**
   * Sections to track
   */
  sections: ScrollSpySection[];
  /**
   * Navigation behavior
   */
  activeSection?: string;
  onSectionChange?: (section: ScrollSpySection) => void;
  smoothScroll?: boolean;
  scrollOffset?: number;
  threshold?: number;
  /**
   * Appearance
   */
  variant?: 'default' | 'minimal' | 'pills' | 'sidebar' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right' | 'top' | 'bottom';
  orientation?: 'horizontal' | 'vertical';
  /**
   * Sticky behavior
   */
  sticky?: boolean;
  stickyOffset?: number;
  /**
   * Progressive disclosure
   */
  showProgress?: boolean;
  progressPosition?: 'left' | 'right' | 'top' | 'bottom';
  /**
   * Nested sections
   */
  showNestedSections?: boolean;
  maxDepth?: number;
  autoCollapse?: boolean;
  /**
   * Mobile behavior
   */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showMobileToggle?: boolean;
  /**
   * Visual indicators
   */
  showIcons?: boolean;
  showBadges?: boolean;
  showConnectors?: boolean;
  highlightActive?: boolean;
  /**
   * Scroll behavior
   */
  scrollContainer?: string | HTMLElement;
  rootMargin?: string;
  trackVisibility?: boolean;
  updateOnScroll?: boolean;
  /**
   * Event handlers
   */
  onSectionClick?: (section: ScrollSpySection, event: React.MouseEvent) => void;
  onSectionEnter?: (section: ScrollSpySection) => void;
  onSectionLeave?: (section: ScrollSpySection) => void;
  /**
   * Custom rendering
   */
  renderSection?: (section: ScrollSpySection, isActive: boolean, depth: number) => React.ReactNode;
  renderProgress?: (progress: number) => React.ReactNode;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  ariaLabelledBy?: string;
  /**
   * Customization
   */
  className?: string;
}

export const ScrollSpyNav: React.FC<ScrollSpyNavProps> = ({
  sections = [],
  activeSection,
  onSectionChange,
  smoothScroll = true,
  scrollOffset = 80,
  threshold = 0.3,
  variant = 'default',
  size = 'md',
  position = 'right',
  orientation = 'vertical',
  sticky = true,
  stickyOffset = 100,
  showProgress = false,
  progressPosition = 'left',
  showNestedSections = true,
  maxDepth = 3,
  autoCollapse = false,
  collapsible = false,
  defaultCollapsed = false,
  showMobileToggle = false,
  showIcons = true,
  showBadges = true,
  showConnectors = false,
  highlightActive = true,
  scrollContainer,
  rootMargin = '0px 0px -70% 0px',
  trackVisibility = true,
  updateOnScroll = true,
  onSectionClick,
  onSectionEnter,
  onSectionLeave,
  renderSection,
  renderProgress,
  ariaLabel = 'Page navigation',
  ariaLabelledBy,
  className = '',
}) => {
  const [currentActiveSection, setCurrentActiveSection] = useState(
    activeSection || sections[0]?.id
  );
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isStuck, setIsStuck] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const progressObserverRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get scroll container
  const getScrollContainer = useCallback(() => {
    if (typeof scrollContainer === 'string') {
      return document.querySelector(scrollContainer) as HTMLElement;
    }
    return scrollContainer || document.documentElement;
  }, [scrollContainer]);

  // Set up intersection observer
  useEffect(() => {
    if (!trackVisibility) return;

    const container = getScrollContainer();
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleSections = new Set(visibleSections);
        let mostVisibleSection = '';
        let maxIntersectionRatio = 0;

        entries.forEach((entry) => {
          const sectionId = entry.target.id;

          if (entry.isIntersecting) {
            newVisibleSections.add(sectionId);

            if (entry.intersectionRatio > maxIntersectionRatio) {
              maxIntersectionRatio = entry.intersectionRatio;
              mostVisibleSection = sectionId;
            }
          } else {
            newVisibleSections.delete(sectionId);
          }
        });

        setVisibleSections(newVisibleSections);

        // Update active section based on most visible
        if (mostVisibleSection && mostVisibleSection !== currentActiveSection) {
          const section = findSectionById(mostVisibleSection);
          if (section) {
            setCurrentActiveSection(mostVisibleSection);
            onSectionChange?.(section);
            onSectionEnter?.(section);
          }
        }
      },
      {
        root: container === document.documentElement ? null : container,
        rootMargin,
        threshold: [0, threshold, 1],
      }
    );

    // Observe all section elements
    const observeSection = (section: ScrollSpySection) => {
      const element =
        document.getElementById(section.id) ||
        document.querySelector(section.element || `#${section.id}`);
      if (element) {
        observer.observe(element);
      }

      if (section.children) {
        section.children.forEach(observeSection);
      }
    };

    sections.forEach(observeSection);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [
    sections,
    currentActiveSection,
    threshold,
    rootMargin,
    trackVisibility,
    onSectionChange,
    onSectionEnter,
    visibleSections,
    getScrollContainer,
  ]);

  // Set up scroll progress tracking
  useEffect(() => {
    if (!showProgress || !updateOnScroll) return;

    const container = getScrollContainer();
    if (!container) return;

    const updateProgress = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    const handleScroll = () => {
      updateProgress();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        updateProgress();
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [showProgress, updateOnScroll, getScrollContainer]);

  // Handle sticky behavior
  useEffect(() => {
    if (!sticky || !navRef.current) return;

    const handleScroll = () => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      setIsStuck(rect.top <= stickyOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky, stickyOffset]);

  // Find section by ID
  const findSectionById = useCallback(
    (id: string): ScrollSpySection | null => {
      const findInSections = (sections: ScrollSpySection[]): ScrollSpySection | null => {
        for (const section of sections) {
          if (section.id === id) return section;
          if (section.children) {
            const found = findInSections(section.children);
            if (found) return found;
          }
        }
        return null;
      };
      return findInSections(sections);
    },
    [sections]
  );

  // Handle section click
  const handleSectionClick = useCallback(
    (section: ScrollSpySection, event: React.MouseEvent) => {
      event.preventDefault();

      if (section.isDisabled) return;

      onSectionClick?.(section, event);

      // Scroll to section
      const element =
        document.getElementById(section.id) ||
        document.querySelector(section.element || `#${section.id}`);

      if (element) {
        const container = getScrollContainer();
        const elementTop = element.offsetTop;
        const scrollTo = elementTop - scrollOffset;

        if (container && smoothScroll) {
          container.scrollTo({
            top: scrollTo,
            behavior: 'smooth',
          });
        } else if (container) {
          container.scrollTop = scrollTo;
        }

        // Update active section immediately
        setCurrentActiveSection(section.id);
        onSectionChange?.(section);
      }
    },
    [smoothScroll, scrollOffset, onSectionClick, onSectionChange, getScrollContainer]
  );

  // Handle section expansion
  const handleSectionExpand = useCallback(
    (sectionId: string) => {
      setExpandedSections((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(sectionId)) {
          newSet.delete(sectionId);
        } else {
          newSet.add(sectionId);

          // Auto-collapse siblings if enabled
          if (autoCollapse) {
            const section = findSectionById(sectionId);
            if (section) {
              // Find parent and collapse siblings
              // This is a simplified implementation
              newSet.clear();
              newSet.add(sectionId);
            }
          }
        }
        return newSet;
      });
    },
    [autoCollapse, findSectionById]
  );

  // Render section item
  const renderSectionItem = (section: ScrollSpySection, depth: number = 0) => {
    if (depth > maxDepth) return null;

    const isActive = section.id === currentActiveSection;
    const isVisible = visibleSections.has(section.id);
    const isExpanded = expandedSections.has(section.id);
    const hasChildren = section.children && section.children.length > 0;

    if (renderSection) {
      return (
        <li key={section.id} className="scrollspy-nav__item">
          {renderSection(section, isActive, depth)}
        </li>
      );
    }

    const itemClasses = [
      'scrollspy-nav__item',
      `scrollspy-nav__item--depth-${depth}`,
      isActive && 'scrollspy-nav__item--active',
      isVisible && 'scrollspy-nav__item--visible',
      section.isDisabled && 'scrollspy-nav__item--disabled',
      hasChildren && 'scrollspy-nav__item--has-children',
      isExpanded && 'scrollspy-nav__item--expanded',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li key={section.id} className={itemClasses}>
        <div className="scrollspy-nav__item-wrapper">
          {/* Connector line */}
          {showConnectors && depth > 0 && <div className="scrollspy-nav__connector" />}

          {/* Expand button for nested sections */}
          {hasChildren && showNestedSections && (
            <Button
              variant="ghost"
              size="xs"
              className="scrollspy-nav__expand-button"
              onClick={() => handleSectionExpand(section.id)}
              aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            >
              <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size="xs" />
            </Button>
          )}

          {/* Section link */}
          <Button
            variant="ghost"
            size={size}
            className="scrollspy-nav__link"
            onClick={(e) => handleSectionClick(section, e)}
            disabled={section.isDisabled}
            aria-current={isActive ? 'location' : undefined}
            title={section.label}
          >
            {showIcons && section.icon && (
              <Icon name={section.icon} size="sm" className="scrollspy-nav__icon" />
            )}

            <span className="scrollspy-nav__label">{section.label}</span>

            {showBadges && section.badge && section.badge > 0 && (
              <Badge
                variant="notification"
                size="sm"
                count={section.badge}
                className="scrollspy-nav__badge"
              />
            )}
          </Button>
        </div>

        {/* Nested sections */}
        {hasChildren && showNestedSections && isExpanded && (
          <ul className="scrollspy-nav__nested">
            {section.children!.map((child) => renderSectionItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const navClasses = [
    'scrollspy-nav',
    `scrollspy-nav--${variant}`,
    `scrollspy-nav--${size}`,
    `scrollspy-nav--${position}`,
    `scrollspy-nav--${orientation}`,
    sticky && 'scrollspy-nav--sticky',
    isStuck && 'scrollspy-nav--stuck',
    isCollapsed && 'scrollspy-nav--collapsed',
    showProgress && 'scrollspy-nav--with-progress',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav
      ref={navRef}
      className={navClasses}
      role="navigation"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {/* Mobile toggle */}
      {collapsible && showMobileToggle && (
        <Button
          variant="ghost"
          size="sm"
          className="scrollspy-nav__toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!isCollapsed}
        >
          <Icon name={isCollapsed ? 'menu' : 'close'} size="sm" />
        </Button>
      )}

      {/* Progress bar */}
      {showProgress && (
        <div className={`scrollspy-nav__progress scrollspy-nav__progress--${progressPosition}`}>
          {renderProgress ? (
            renderProgress(scrollProgress)
          ) : (
            <div
              className="scrollspy-nav__progress-bar"
              style={{
                [orientation === 'horizontal' ? 'width' : 'height']: `${scrollProgress}%`,
              }}
            />
          )}
        </div>
      )}

      {/* Navigation items */}
      <ul className="scrollspy-nav__list" role="list">
        {sections.map((section) => renderSectionItem(section))}
      </ul>
    </nav>
  );
};

export default ScrollSpyNav;
