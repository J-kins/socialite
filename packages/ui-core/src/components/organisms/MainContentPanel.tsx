import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Divider } from '../atoms/Divider';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface MainContentPanelProps {
  /**
   * Panel content
   */
  children: React.ReactNode;
  /**
   * Header configuration
   */
  title?: string;
  subtitle?: string;
  headerContent?: React.ReactNode;
  showHeader?: boolean;
  /**
   * Layout and appearance
   */
  variant?: 'default' | 'minimal' | 'card' | 'split' | 'full-height';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
  /**
   * Scrolling behavior
   */
  scrollable?: boolean;
  scrollToTop?: boolean;
  onScrollToTop?: () => void;
  scrollThreshold?: number;
  /**
   * Loading states
   */
  isLoading?: boolean;
  loadingText?: string;
  loadingSpinner?: React.ReactNode;
  /**
   * Error states
   */
  error?: string | React.ReactNode;
  onRetry?: () => void;
  /**
   * Empty states
   */
  isEmpty?: boolean;
  emptyState?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  /**
   * Actions and toolbar
   */
  actions?: Array<{
    id: string;
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    onClick: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
  }>;
  toolbar?: React.ReactNode;
  /**
   * Sidebar and layout
   */
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: string;
  sidebarCollapsible?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  /**
   * Footer
   */
  footer?: React.ReactNode;
  stickyFooter?: boolean;
  /**
   * Responsive behavior
   */
  isMobile?: boolean;
  mobileBreakpoint?: number;
  adaptiveLayout?: boolean;
  /**
   * Animations and transitions
   */
  animateContent?: boolean;
  transitionDuration?: number;
  /**
   * Custom styling
   */
  backgroundColor?: string;
  backgroundPattern?: string;
  /**
   * Event handlers
   */
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  onResize?: (width: number, height: number) => void;
  className?: string;
}

export const MainContentPanel: React.FC<MainContentPanelProps> = ({
  children,
  title,
  subtitle,
  headerContent,
  showHeader = true,
  variant = 'default',
  padding = 'md',
  maxWidth = 'full',
  scrollable = true,
  scrollToTop = false,
  onScrollToTop,
  scrollThreshold = 300,
  isLoading = false,
  loadingText = 'Loading...',
  loadingSpinner,
  error,
  onRetry,
  isEmpty = false,
  emptyState,
  emptyTitle = 'No content available',
  emptyDescription = 'There is currently no content to display.',
  emptyAction,
  actions = [],
  toolbar,
  sidebar,
  sidebarPosition = 'left',
  sidebarWidth = '280px',
  sidebarCollapsible = false,
  sidebarCollapsed = false,
  onSidebarToggle,
  footer,
  stickyFooter = false,
  isMobile = false,
  mobileBreakpoint = 768,
  adaptiveLayout = true,
  animateContent = true,
  transitionDuration = 300,
  backgroundColor,
  backgroundPattern,
  onScroll,
  onResize,
  className = '',
}) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isResponsiveMobile, setIsResponsiveMobile] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Handle responsive behavior
  useEffect(() => {
    if (!adaptiveLayout) return;

    const handleResize = () => {
      setIsResponsiveMobile(window.innerWidth <= mobileBreakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adaptiveLayout, mobileBreakpoint]);

  // Handle content resize observation
  useEffect(() => {
    if (!contentRef.current || !onResize) return;

    resizeObserverRef.current = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setContentHeight(height);
        onResize(width, height);
      }
    });

    resizeObserverRef.current.observe(contentRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [onResize]);

  // Handle scroll behavior
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const shouldShowScrollToTop = target.scrollTop > scrollThreshold;
    setShowScrollToTop(shouldShowScrollToTop);
    onScroll?.(event);
  };

  // Handle scroll to top
  const handleScrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    onScrollToTop?.();
  };

  // Determine if mobile layout should be used
  const useMobileLayout = isMobile || isResponsiveMobile;

  // Build class names
  const panelClasses = [
    'main-content-panel',
    `main-content-panel--${variant}`,
    `main-content-panel--padding-${padding}`,
    maxWidth !== 'full' && `main-content-panel--max-width-${maxWidth}`,
    scrollable && 'main-content-panel--scrollable',
    useMobileLayout && 'main-content-panel--mobile',
    sidebarCollapsed && 'main-content-panel--sidebar-collapsed',
    animateContent && 'main-content-panel--animated',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Render loading state
  if (isLoading) {
    return (
      <div className={panelClasses} ref={panelRef}>
        <div className="main-content-panel__loading">
          {loadingSpinner || <LoadingSpinner size="lg" />}
          {loadingText && <p className="main-content-panel__loading-text">{loadingText}</p>}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={panelClasses} ref={panelRef}>
        <div className="main-content-panel__error">
          <Icon name="alert-circle" size="xl" className="main-content-panel__error-icon" />
          <div className="main-content-panel__error-content">
            {typeof error === 'string' ? (
              <p className="main-content-panel__error-message">{error}</p>
            ) : (
              error
            )}
            {onRetry && (
              <Button
                variant="primary"
                onClick={onRetry}
                className="main-content-panel__error-action"
              >
                <Icon name="refresh" size="sm" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (isEmpty && !children) {
    return (
      <div className={panelClasses} ref={panelRef}>
        <div className="main-content-panel__empty">
          {emptyState || (
            <>
              <Icon name="inbox" size="xl" className="main-content-panel__empty-icon" />
              <h3 className="main-content-panel__empty-title">{emptyTitle}</h3>
              <p className="main-content-panel__empty-description">{emptyDescription}</p>
              {emptyAction && <div className="main-content-panel__empty-action">{emptyAction}</div>}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={panelClasses}
      ref={panelRef}
      style={{
        backgroundColor,
        backgroundImage: backgroundPattern,
        transitionDuration: animateContent ? `${transitionDuration}ms` : undefined,
      }}
    >
      {/* Sidebar */}
      {sidebar && (
        <aside
          className={`main-content-panel__sidebar main-content-panel__sidebar--${sidebarPosition}`}
          style={{
            width: sidebarCollapsed ? '0' : sidebarWidth,
            minWidth: sidebarCollapsed ? '0' : sidebarWidth,
          }}
        >
          {sidebarCollapsible && (
            <Button
              variant="ghost"
              size="sm"
              className="main-content-panel__sidebar-toggle"
              onClick={onSidebarToggle}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon
                name={
                  sidebarCollapsed
                    ? sidebarPosition === 'left'
                      ? 'chevron-right'
                      : 'chevron-left'
                    : sidebarPosition === 'left'
                      ? 'chevron-left'
                      : 'chevron-right'
                }
                size="sm"
              />
            </Button>
          )}
          <div className="main-content-panel__sidebar-content">{sidebar}</div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="main-content-panel__main">
        {/* Header */}
        {showHeader && (title || subtitle || headerContent || actions.length > 0 || toolbar) && (
          <header className="main-content-panel__header">
            <div className="main-content-panel__header-content">
              {(title || subtitle) && (
                <div className="main-content-panel__header-text">
                  {title && <h1 className="main-content-panel__title">{title}</h1>}
                  {subtitle && <p className="main-content-panel__subtitle">{subtitle}</p>}
                </div>
              )}
              {headerContent && (
                <div className="main-content-panel__header-custom">{headerContent}</div>
              )}
            </div>

            {/* Actions and Toolbar */}
            {(actions.length > 0 || toolbar) && (
              <div className="main-content-panel__header-actions">
                {toolbar && <div className="main-content-panel__toolbar">{toolbar}</div>}
                {actions.length > 0 && (
                  <div className="main-content-panel__actions">
                    {actions.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant || 'secondary'}
                        size="md"
                        onClick={action.onClick}
                        disabled={action.isDisabled}
                        loading={action.isLoading}
                        className="main-content-panel__action"
                      >
                        {action.icon && <Icon name={action.icon} size="sm" />}
                        <span>{action.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </header>
        )}

        {showHeader && <Divider className="main-content-panel__header-divider" />}

        {/* Content */}
        <div
          ref={contentRef}
          className="main-content-panel__content"
          onScroll={scrollable ? handleScroll : undefined}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <>
            <Divider className="main-content-panel__footer-divider" />
            <footer
              className={`main-content-panel__footer ${
                stickyFooter ? 'main-content-panel__footer--sticky' : ''
              }`}
            >
              {footer}
            </footer>
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      {scrollable && scrollToTop && showScrollToTop && (
        <Button
          variant="primary"
          size="sm"
          className="main-content-panel__scroll-to-top"
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
        >
          <Icon name="chevron-up" size="sm" />
        </Button>
      )}
    </div>
  );
};

export default MainContentPanel;
