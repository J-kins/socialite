import { ReactNode } from 'react';

/**
 * Scroll Spy Component Props Types
 *
 * Comprehensive type definitions for scroll spy components including
 * navigation menus, table of contents, and progress indicators.
 */

// Base scroll spy props
export interface BaseScrollSpyProps {
  /** Unique identifier for the component */
  id?: string;
  /** CSS class names */
  className?: string;
  /** Test identifier */
  'data-testid'?: string;
  /** Whether component is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

// Scroll spy navigation props
export interface ScrollSpyNavProps extends BaseScrollSpyProps {
  /** Array of section IDs to track */
  sections: string[];
  /** Currently active section */
  activeSection?: string;
  /** Navigation layout */
  layout?: 'horizontal' | 'vertical';
  /** Navigation position */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'sticky' | 'fixed';
  /** Sticky offset from top/bottom */
  stickyOffset?: number;
  /** Whether to show section numbers */
  showNumbers?: boolean;
  /** Whether to show progress indicators */
  showProgress?: boolean;
  /** Whether to use smooth scrolling */
  smoothScroll?: boolean;
  /** Scroll offset when navigating to sections */
  scrollOffset?: number;
  /** Navigation item spacing */
  spacing?: 'compact' | 'normal' | 'relaxed';
  /** Color scheme */
  colorScheme?: 'light' | 'dark' | 'auto';
  /** Animation for active state changes */
  animation?: 'none' | 'slide' | 'fade' | 'scale';
  /** Whether to collapse inactive items */
  collapsible?: boolean;
  /** Maximum number of visible items (with scrolling) */
  maxVisibleItems?: number;

  // Event handlers
  /** Called when active section changes */
  onActiveChange?: (sectionId: string) => void;
  /** Called when section is clicked */
  onSectionClick?: (sectionId: string) => void;
  /** Called when section navigation starts */
  onNavigationStart?: (sectionId: string) => void;
  /** Called when section navigation completes */
  onNavigationComplete?: (sectionId: string) => void;
}

// Scroll spy nav item props
export interface ScrollSpyNavItemProps extends BaseScrollSpyProps {
  /** Section identifier */
  sectionId: string;
  /** Display label for the section */
  label: string;
  /** Whether this item is currently active */
  isActive?: boolean;
  /** Whether this section is currently visible */
  isVisible?: boolean;
  /** Visibility ratio (0-1) */
  visibilityRatio?: number;
  /** Item index in the navigation */
  index?: number;
  /** Nesting level for hierarchical navigation */
  level?: number;
  /** Icon to display */
  icon?: ReactNode;
  /** Badge content (e.g., notification count) */
  badge?: ReactNode;
  /** Whether item is clickable */
  clickable?: boolean;
  /** Item size */
  size?: 'sm' | 'md' | 'lg';
  /** Item variant */
  variant?: 'default' | 'pill' | 'underline' | 'highlight';
  /** Custom content */
  children?: ReactNode;

  // Event handlers
  /** Called when item is clicked */
  onClick?: (sectionId: string) => void;
  /** Called when item is hovered */
  onHover?: (sectionId: string) => void;
  /** Called when item receives focus */
  onFocus?: (sectionId: string) => void;
}

// Table of contents props
export interface TableOfContentsProps extends BaseScrollSpyProps {
  /** Sections to include in TOC */
  sections: Array<{
    id: string;
    title: string;
    level: number;
    children?: Array<{
      id: string;
      title: string;
      level: number;
    }>;
  }>;
  /** Currently active section */
  activeSection?: string;
  /** Maximum heading level to include */
  maxLevel?: number;
  /** Whether to show section numbers */
  showNumbers?: boolean;
  /** Numbering style */
  numberingStyle?: 'decimal' | 'roman' | 'alpha' | 'custom';
  /** Whether to make TOC collapsible */
  collapsible?: boolean;
  /** Whether to auto-expand active sections */
  autoExpand?: boolean;
  /** Whether to highlight the active path */
  highlightPath?: boolean;
  /** Maximum width of the TOC */
  maxWidth?: string | number;
  /** Maximum height (with scrolling) */
  maxHeight?: string | number;
  /** Title for the TOC */
  title?: string;
  /** Whether to show title */
  showTitle?: boolean;
  /** Whether to show progress indicator */
  showProgress?: boolean;
  /** Indent size for nested items */
  indentSize?: number;
  /** Line height for items */
  lineHeight?: number;

  // Event handlers
  /** Called when section is selected */
  onSectionSelect?: (sectionId: string) => void;
  /** Called when TOC is expanded/collapsed */
  onToggle?: (expanded: boolean) => void;
  /** Called when section is expanded/collapsed */
  onSectionToggle?: (sectionId: string, expanded: boolean) => void;
}

// Scroll progress props
export interface ScrollProgressProps extends BaseScrollSpyProps {
  /** Target element or selector to track progress */
  target?: string | HTMLElement;
  /** Progress bar orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Progress bar position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Progress bar thickness */
  thickness?: number;
  /** Progress bar color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Whether to show percentage text */
  showPercentage?: boolean;
  /** Percentage text position */
  percentagePosition?: 'start' | 'center' | 'end';
  /** Whether to animate progress changes */
  animated?: boolean;
  /** Animation duration */
  animationDuration?: number;
  /** Border radius */
  borderRadius?: number;
  /** Whether progress bar is indeterminate */
  indeterminate?: boolean;
  /** Z-index for positioning */
  zIndex?: number;

  // Event handlers
  /** Called when progress changes */
  onProgressChange?: (progress: number) => void;
  /** Called when scroll starts */
  onScrollStart?: () => void;
  /** Called when scroll ends */
  onScrollEnd?: () => void;
}

// Scroll indicator props
export interface ScrollIndicatorProps extends BaseScrollSpyProps {
  /** Sections to show indicators for */
  sections: string[];
  /** Currently active section */
  activeSection?: string;
  /** Indicator position */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** Indicator size */
  size?: 'sm' | 'md' | 'lg';
  /** Indicator shape */
  shape?: 'circle' | 'square' | 'line';
  /** Spacing between indicators */
  spacing?: number;
  /** Whether to show labels */
  showLabels?: boolean;
  /** Label position relative to indicator */
  labelPosition?: 'start' | 'end' | 'center';
  /** Whether to show connecting lines */
  showConnector?: boolean;
  /** Connector style */
  connectorStyle?: 'solid' | 'dashed' | 'dotted';
  /** Active indicator color */
  activeColor?: string;
  /** Inactive indicator color */
  inactiveColor?: string;
  /** Visited indicator color */
  visitedColor?: string;
  /** Whether to track visited sections */
  trackVisited?: boolean;

  // Event handlers
  /** Called when indicator is clicked */
  onIndicatorClick?: (sectionId: string) => void;
  /** Called when indicator is hovered */
  onIndicatorHover?: (sectionId: string) => void;
}

// Mini map props (overview of document sections)
export interface MiniMapProps extends BaseScrollSpyProps {
  /** Document sections to visualize */
  sections: Array<{
    id: string;
    title: string;
    height: number;
    offset: number;
  }>;
  /** Currently active section */
  activeSection?: string;
  /** Currently visible sections */
  visibleSections?: string[];
  /** Mini map width */
  width?: number;
  /** Mini map height */
  height?: number;
  /** Zoom level */
  zoom?: number;
  /** Whether to show section labels */
  showLabels?: boolean;
  /** Whether to show viewport indicator */
  showViewport?: boolean;
  /** Viewport indicator color */
  viewportColor?: string;
  /** Section colors */
  sectionColors?: Record<string, string>;
  /** Whether mini map is interactive */
  interactive?: boolean;
  /** Whether to auto-hide when not needed */
  autoHide?: boolean;

  // Event handlers
  /** Called when mini map section is clicked */
  onSectionClick?: (sectionId: string) => void;
  /** Called when viewport changes */
  onViewportChange?: (top: number, bottom: number) => void;
}

// Breadcrumb trail props
export interface BreadcrumbTrailProps extends BaseScrollSpyProps {
  /** Current navigation path */
  path: Array<{
    id: string;
    label: string;
    href?: string;
  }>;
  /** Separator between breadcrumb items */
  separator?: ReactNode;
  /** Maximum number of items to show */
  maxItems?: number;
  /** How to handle overflow */
  overflowBehavior?: 'truncate' | 'collapse' | 'scroll';
  /** Whether last item is clickable */
  lastItemClickable?: boolean;
  /** Item size */
  size?: 'sm' | 'md' | 'lg';
  /** Item variant */
  variant?: 'default' | 'ghost' | 'underline';
  /** Whether to show home icon */
  showHome?: boolean;
  /** Home icon */
  homeIcon?: ReactNode;

  // Event handlers
  /** Called when breadcrumb item is clicked */
  onItemClick?: (id: string, index: number) => void;
  /** Called when overflow menu is opened */
  onOverflowMenuOpen?: () => void;
}

// Floating action button for navigation
export interface FloatingNavButtonProps extends BaseScrollSpyProps {
  /** Button position */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Distance from edges */
  offset?: { x: number; y: number };
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button icon */
  icon?: ReactNode;
  /** Button label */
  label?: string;
  /** Whether to show label */
  showLabel?: boolean;
  /** Whether button is visible */
  visible?: boolean;
  /** Auto-hide conditions */
  autoHide?: {
    onScroll?: boolean;
    onInactivity?: boolean;
    inactivityDelay?: number;
  };
  /** Actions available in the button */
  actions?: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    action: () => void;
  }>;
  /** Whether actions expand as menu */
  expandActions?: boolean;
  /** Menu expansion direction */
  expansionDirection?: 'up' | 'down' | 'left' | 'right';

  // Event handlers
  /** Called when button is clicked */
  onClick?: () => void;
  /** Called when action is selected */
  onActionSelect?: (actionId: string) => void;
}

// Export all types
export type {
  BaseScrollSpyProps,
  ScrollSpyNavProps,
  ScrollSpyNavItemProps,
  TableOfContentsProps,
  ScrollProgressProps,
  ScrollIndicatorProps,
  MiniMapProps,
  BreadcrumbTrailProps,
  FloatingNavButtonProps,
};
