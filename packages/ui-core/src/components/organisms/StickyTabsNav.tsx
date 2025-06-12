import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  icon?: string;
  badge?: number;
  isDisabled?: boolean;
  href?: string;
  isActive?: boolean;
}

export interface StickyTabsNavProps {
  /**
   * Tab items to display
   */
  tabs: TabItem[];
  /**
   * Currently active tab ID
   */
  activeTab?: string;
  /**
   * Tab change handler
   */
  onTabChange?: (tab: TabItem) => void;
  /**
   * Sticky behavior
   */
  isSticky?: boolean;
  stickyOffset?: number;
  /**
   * Appearance
   */
  variant?: 'default' | 'minimal' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'center' | 'right' | 'stretch';
  /**
   * Navigation behavior
   */
  showScrollButtons?: boolean;
  scrollBehavior?: 'auto' | 'smooth';
  allowTabReordering?: boolean;
  /**
   * Content rendering
   */
  renderTabContent?: boolean;
  tabContentContainer?: React.RefObject<HTMLElement>;
  /**
   * Mobile behavior
   */
  isMobile?: boolean;
  showMobileDropdown?: boolean;
  mobileBreakpoint?: number;
  /**
   * Customization
   */
  showIcons?: boolean;
  showBadges?: boolean;
  maxTabWidth?: number;
  minTabWidth?: number;
  /**
   * Event handlers
   */
  onTabReorder?: (tabs: TabItem[]) => void;
  onTabClose?: (tab: TabItem) => void;
  onTabAdd?: () => void;
  /**
   * Additional features
   */
  closableTabs?: boolean;
  addButton?: boolean;
  overflowBehavior?: 'scroll' | 'dropdown' | 'wrap';
  className?: string;
}

export const StickyTabsNav: React.FC<StickyTabsNavProps> = ({
  tabs = [],
  activeTab,
  onTabChange,
  isSticky = true,
  stickyOffset = 0,
  variant = 'default',
  size = 'md',
  alignment = 'left',
  showScrollButtons = true,
  scrollBehavior = 'smooth',
  allowTabReordering = false,
  renderTabContent = false,
  tabContentContainer,
  isMobile = false,
  showMobileDropdown = false,
  mobileBreakpoint = 768,
  showIcons = true,
  showBadges = true,
  maxTabWidth,
  minTabWidth,
  onTabReorder,
  onTabClose,
  onTabAdd,
  closableTabs = false,
  addButton = false,
  overflowBehavior = 'scroll',
  className = '',
}) => {
  const [currentActiveTab, setCurrentActiveTab] = useState(activeTab || tabs[0]?.id);
  const [isStuck, setIsStuck] = useState(false);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= mobileBreakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint]);

  // Handle sticky behavior
  useEffect(() => {
    if (!isSticky || !navRef.current) return;

    const handleScroll = () => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      setIsStuck(rect.top <= stickyOffset);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky, stickyOffset]);

  // Handle scroll buttons visibility
  useEffect(() => {
    const checkScrollButtons = () => {
      if (!tabsContainerRef.current) return;

      const container = tabsContainerRef.current;
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(container.scrollLeft < container.scrollWidth - container.clientWidth);
    };

    checkScrollButtons();
    const container = tabsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [tabs]);

  // Update active tab indicator position
  useEffect(() => {
    if (!indicatorRef.current || !tabsContainerRef.current || variant !== 'underline') return;

    const activeTabElement = tabsContainerRef.current.querySelector(
      `[data-tab-id="${currentActiveTab}"]`
    ) as HTMLElement;

    if (activeTabElement) {
      const containerRect = tabsContainerRef.current.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();
      const indicator = indicatorRef.current;

      indicator.style.left = `${tabRect.left - containerRect.left + tabsContainerRef.current.scrollLeft}px`;
      indicator.style.width = `${tabRect.width}px`;
    }
  }, [currentActiveTab, tabs, variant]);

  // Handle tab selection
  const handleTabClick = (tab: TabItem) => {
    if (tab.isDisabled) return;

    setCurrentActiveTab(tab.id);
    onTabChange?.(tab);

    if (showMobileDropdown && isMobileView) {
      setDropdownOpen(false);
    }
  };

  // Handle scroll navigation
  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsContainerRef.current) return;

    const container = tabsContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: scrollBehavior,
    });
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, tab: TabItem) => {
    if (!allowTabReordering) return;
    setDraggedTab(tab.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!allowTabReordering || !draggedTab) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTab: TabItem) => {
    if (!allowTabReordering || !draggedTab) return;
    e.preventDefault();

    if (draggedTab === targetTab.id) return;

    const newTabs = [...tabs];
    const draggedIndex = newTabs.findIndex((tab) => tab.id === draggedTab);
    const targetIndex = newTabs.findIndex((tab) => tab.id === targetTab.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedElement] = newTabs.splice(draggedIndex, 1);
      newTabs.splice(targetIndex, 0, draggedElement);
      onTabReorder?.(newTabs);
    }

    setDraggedTab(null);
  };

  // Handle tab close
  const handleTabClose = (e: React.MouseEvent, tab: TabItem) => {
    e.stopPropagation();
    onTabClose?.(tab);

    // Switch to next available tab if current tab is being closed
    if (tab.id === currentActiveTab) {
      const currentIndex = tabs.findIndex((t) => t.id === tab.id);
      const nextTab = tabs[currentIndex + 1] || tabs[currentIndex - 1];
      if (nextTab) {
        setCurrentActiveTab(nextTab.id);
        onTabChange?.(nextTab);
      }
    }
  };

  // Get active tab content
  const activeTabData = tabs.find((tab) => tab.id === currentActiveTab);

  const navClasses = [
    'sticky-tabs-nav',
    `sticky-tabs-nav--${variant}`,
    `sticky-tabs-nav--${size}`,
    `sticky-tabs-nav--${alignment}`,
    isSticky && 'sticky-tabs-nav--sticky',
    isStuck && 'sticky-tabs-nav--stuck',
    isMobileView && 'sticky-tabs-nav--mobile',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const activeTabForMobile = tabs.find((tab) => tab.id === currentActiveTab);

  return (
    <div ref={navRef} className={navClasses}>
      <div className="sticky-tabs-nav__container">
        {/* Mobile Dropdown Toggle */}
        {isMobileView && showMobileDropdown ? (
          <div className="sticky-tabs-nav__mobile-toggle">
            <Button
              variant="ghost"
              size="md"
              className="sticky-tabs-nav__mobile-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              {showIcons && activeTabForMobile?.icon && (
                <Icon name={activeTabForMobile.icon} size="sm" />
              )}
              <span className="sticky-tabs-nav__mobile-label">
                {activeTabForMobile?.label || 'Select Tab'}
              </span>
              <Icon name="chevron-down" size="sm" />
            </Button>

            {dropdownOpen && (
              <div className="sticky-tabs-nav__mobile-dropdown">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={tab.id === currentActiveTab ? 'primary' : 'ghost'}
                    size="md"
                    className="sticky-tabs-nav__mobile-option"
                    onClick={() => handleTabClick(tab)}
                    disabled={tab.isDisabled}
                  >
                    {showIcons && tab.icon && <Icon name={tab.icon} size="sm" />}
                    <span>{tab.label}</span>
                    {showBadges && tab.badge && tab.badge > 0 && (
                      <Badge variant="notification" size="sm" count={tab.badge} />
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Desktop/Tablet Tabs */
          <div className="sticky-tabs-nav__wrapper">
            {/* Left Scroll Button */}
            {showScrollButtons && showLeftScroll && (
              <Button
                variant="ghost"
                size="sm"
                className="sticky-tabs-nav__scroll-button sticky-tabs-nav__scroll-button--left"
                onClick={() => scrollTabs('left')}
                aria-label="Scroll tabs left"
              >
                <Icon name="chevron-left" size="sm" />
              </Button>
            )}

            {/* Tabs Container */}
            <div ref={tabsContainerRef} className="sticky-tabs-nav__tabs" role="tablist">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={tab.id === currentActiveTab ? 'primary' : 'ghost'}
                  size={size}
                  className="sticky-tabs-nav__tab"
                  onClick={() => handleTabClick(tab)}
                  disabled={tab.isDisabled}
                  role="tab"
                  aria-selected={tab.id === currentActiveTab}
                  aria-controls={`tab-panel-${tab.id}`}
                  data-tab-id={tab.id}
                  draggable={allowTabReordering}
                  onDragStart={(e) => handleDragStart(e, tab)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, tab)}
                  style={{
                    maxWidth: maxTabWidth,
                    minWidth: minTabWidth,
                  }}
                >
                  {showIcons && tab.icon && (
                    <Icon name={tab.icon} size="sm" className="sticky-tabs-nav__tab-icon" />
                  )}
                  <span className="sticky-tabs-nav__tab-label">{tab.label}</span>
                  {showBadges && tab.badge && tab.badge > 0 && (
                    <Badge
                      variant="notification"
                      size="sm"
                      count={tab.badge}
                      className="sticky-tabs-nav__tab-badge"
                    />
                  )}
                  {closableTabs && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="sticky-tabs-nav__tab-close"
                      onClick={(e) => handleTabClose(e, tab)}
                      aria-label={`Close ${tab.label}`}
                    >
                      <Icon name="close" size="xs" />
                    </Button>
                  )}
                </Button>
              ))}

              {/* Active Tab Indicator */}
              {variant === 'underline' && (
                <div ref={indicatorRef} className="sticky-tabs-nav__indicator" />
              )}
            </div>

            {/* Right Scroll Button */}
            {showScrollButtons && showRightScroll && (
              <Button
                variant="ghost"
                size="sm"
                className="sticky-tabs-nav__scroll-button sticky-tabs-nav__scroll-button--right"
                onClick={() => scrollTabs('right')}
                aria-label="Scroll tabs right"
              >
                <Icon name="chevron-right" size="sm" />
              </Button>
            )}

            {/* Add Tab Button */}
            {addButton && (
              <Button
                variant="ghost"
                size={size}
                className="sticky-tabs-nav__add-button"
                onClick={onTabAdd}
                aria-label="Add new tab"
              >
                <Icon name="plus" size="sm" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tab Content */}
      {renderTabContent && activeTabData?.content && (
        <div
          className="sticky-tabs-nav__content"
          role="tabpanel"
          id={`tab-panel-${activeTabData.id}`}
          aria-labelledby={`tab-${activeTabData.id}`}
        >
          {activeTabData.content}
        </div>
      )}
    </div>
  );
};

export default StickyTabsNav;
