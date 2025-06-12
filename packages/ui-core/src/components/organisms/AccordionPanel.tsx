import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: string;
  badge?: number;
  isDisabled?: boolean;
  isExpanded?: boolean;
  metadata?: Record<string, any>;
}

export interface AccordionPanelProps {
  /**
   * Accordion items to display
   */
  items: AccordionItem[];
  /**
   * Behavior settings
   */
  allowMultiple?: boolean;
  allowToggle?: boolean;
  defaultExpandedItems?: string[];
  /**
   * Appearance
   */
  variant?: 'default' | 'minimal' | 'bordered' | 'filled' | 'card';
  size?: 'sm' | 'md' | 'lg';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Animation settings
   */
  animateExpansion?: boolean;
  animationDuration?: number;
  animationEasing?: string;
  /**
   * Icon settings
   */
  showExpandIcon?: boolean;
  expandIcon?: string;
  collapseIcon?: string;
  iconPosition?: 'left' | 'right';
  /**
   * Content settings
   */
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  lazyLoadContent?: boolean;
  /**
   * Accessibility
   */
  reducedMotion?: boolean;
  /**
   * Event handlers
   */
  onItemToggle?: (item: AccordionItem, isExpanded: boolean) => void;
  onItemExpand?: (item: AccordionItem) => void;
  onItemCollapse?: (item: AccordionItem) => void;
  /**
   * Custom rendering
   */
  renderTitle?: (item: AccordionItem, isExpanded: boolean) => React.ReactNode;
  renderContent?: (item: AccordionItem, isExpanded: boolean) => React.ReactNode;
  renderIcon?: (item: AccordionItem, isExpanded: boolean) => React.ReactNode;
  /**
   * Search and filtering
   */
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filterFunction?: (item: AccordionItem, query: string) => boolean;
  /**
   * Keyboard navigation
   */
  enableKeyboardNavigation?: boolean;
  /**
   * Customization
   */
  className?: string;
}

export const AccordionPanel: React.FC<AccordionPanelProps> = ({
  items = [],
  allowMultiple = false,
  allowToggle = true,
  defaultExpandedItems = [],
  variant = 'default',
  size = 'md',
  spacing = 'md',
  animateExpansion = true,
  animationDuration = 300,
  animationEasing = 'ease',
  showExpandIcon = true,
  expandIcon = 'chevron-down',
  collapseIcon = 'chevron-up',
  iconPosition = 'right',
  contentPadding = 'md',
  lazyLoadContent = false,
  reducedMotion = false,
  onItemToggle,
  onItemExpand,
  onItemCollapse,
  renderTitle,
  renderContent,
  renderIcon,
  searchable = false,
  searchPlaceholder = 'Search accordion items...',
  onSearch,
  filterFunction,
  enableKeyboardNavigation = true,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(defaultExpandedItems));
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const accordionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Initialize expanded items from props
  useEffect(() => {
    const initialExpanded = new Set(defaultExpandedItems);

    // Add items that have isExpanded = true
    items.forEach((item) => {
      if (item.isExpanded) {
        initialExpanded.add(item.id);
      }
    });

    setExpandedItems(initialExpanded);
  }, [defaultExpandedItems, items]);

  // Handle search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }

    const defaultFilter = (item: AccordionItem, query: string) => {
      const searchTerm = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        (typeof item.content === 'string' && item.content.toLowerCase().includes(searchTerm))
      );
    };

    const filter = filterFunction || defaultFilter;
    const filtered = items.filter((item) => filter(item, searchQuery));
    setFilteredItems(filtered);
  }, [items, searchQuery, filterFunction]);

  // Handle item toggle
  const handleItemToggle = (item: AccordionItem) => {
    if (item.isDisabled) return;

    const isCurrentlyExpanded = expandedItems.has(item.id);
    const newExpandedItems = new Set(expandedItems);

    if (isCurrentlyExpanded) {
      if (allowToggle) {
        newExpandedItems.delete(item.id);
        onItemCollapse?.(item);
      }
    } else {
      if (!allowMultiple) {
        // Close all other items if multiple expansion is not allowed
        newExpandedItems.clear();
      }
      newExpandedItems.add(item.id);
      onItemExpand?.(item);
    }

    setExpandedItems(newExpandedItems);
    onItemToggle?.(item, !isCurrentlyExpanded);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!enableKeyboardNavigation) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(Math.min(index + 1, filteredItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(Math.max(index - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(filteredItems.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleItemToggle(filteredItems[index]);
        break;
    }
  };

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && filteredItems[focusedIndex]) {
      const itemId = filteredItems[focusedIndex].id;
      const itemElement = itemRefs.current.get(itemId);
      if (itemElement) {
        const button = itemElement.querySelector('[role="button"]') as HTMLElement;
        button?.focus();
      }
    }
  }, [focusedIndex, filteredItems]);

  // Get content height for animation
  const getContentHeight = (itemId: string) => {
    const itemElement = itemRefs.current.get(itemId);
    if (!itemElement) return 0;

    const contentElement = itemElement.querySelector('.accordion-panel__content') as HTMLElement;
    return contentElement?.scrollHeight || 0;
  };

  // Render accordion item
  const renderAccordionItem = (item: AccordionItem, index: number) => {
    const isExpanded = expandedItems.has(item.id);
    const contentHeight = animateExpansion ? getContentHeight(item.id) : 'auto';

    const itemClasses = [
      'accordion-panel__item',
      `accordion-panel__item--${variant}`,
      `accordion-panel__item--${size}`,
      isExpanded && 'accordion-panel__item--expanded',
      item.isDisabled && 'accordion-panel__item--disabled',
      index === focusedIndex && 'accordion-panel__item--focused',
    ]
      .filter(Boolean)
      .join(' ');

    const shouldShowContent = lazyLoadContent ? isExpanded : true;

    return (
      <div
        key={item.id}
        ref={(el) => {
          if (el) {
            itemRefs.current.set(item.id, el);
          } else {
            itemRefs.current.delete(item.id);
          }
        }}
        className={itemClasses}
      >
        {/* Header */}
        <div
          className="accordion-panel__header"
          role="button"
          tabIndex={item.isDisabled ? -1 : 0}
          aria-expanded={isExpanded}
          aria-controls={`accordion-content-${item.id}`}
          aria-disabled={item.isDisabled}
          onClick={() => handleItemToggle(item)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {/* Icon (Left) */}
          {showExpandIcon && iconPosition === 'left' && (
            <div className="accordion-panel__icon accordion-panel__icon--left">
              {renderIcon ? (
                renderIcon(item, isExpanded)
              ) : (
                <Icon
                  name={isExpanded ? collapseIcon : expandIcon}
                  size="sm"
                  className="accordion-panel__expand-icon"
                />
              )}
            </div>
          )}

          {/* Item Icon */}
          {item.icon && (
            <div className="accordion-panel__item-icon">
              <Icon name={item.icon} size="sm" />
            </div>
          )}

          {/* Title */}
          <div className="accordion-panel__title">
            {renderTitle ? renderTitle(item, isExpanded) : item.title}
          </div>

          {/* Badge */}
          {item.badge && item.badge > 0 && (
            <Badge
              variant="notification"
              size="sm"
              count={item.badge}
              className="accordion-panel__badge"
            />
          )}

          {/* Icon (Right) */}
          {showExpandIcon && iconPosition === 'right' && (
            <div className="accordion-panel__icon accordion-panel__icon--right">
              {renderIcon ? (
                renderIcon(item, isExpanded)
              ) : (
                <Icon
                  name={isExpanded ? collapseIcon : expandIcon}
                  size="sm"
                  className="accordion-panel__expand-icon"
                />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="accordion-panel__content-wrapper"
          style={{
            height: isExpanded ? (animateExpansion ? `${contentHeight}px` : 'auto') : 0,
            transition:
              animateExpansion && !reducedMotion
                ? `height ${animationDuration}ms ${animationEasing}`
                : 'none',
          }}
        >
          <div
            id={`accordion-content-${item.id}`}
            className="accordion-panel__content"
            role="region"
            aria-labelledby={`accordion-header-${item.id}`}
          >
            {shouldShowContent && (renderContent ? renderContent(item, isExpanded) : item.content)}
          </div>
        </div>
      </div>
    );
  };

  const accordionClasses = [
    'accordion-panel',
    `accordion-panel--${variant}`,
    `accordion-panel--${size}`,
    `accordion-panel--spacing-${spacing}`,
    `accordion-panel--content-padding-${contentPadding}`,
    `accordion-panel--icon-${iconPosition}`,
    animateExpansion && 'accordion-panel--animated',
    reducedMotion && 'accordion-panel--reduced-motion',
    searchable && 'accordion-panel--searchable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={accordionRef} className={accordionClasses}>
      {/* Search */}
      {searchable && (
        <div className="accordion-panel__search">
          <div className="accordion-panel__search-input">
            <Icon name="search" size="sm" className="accordion-panel__search-icon" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="accordion-panel__search-field"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="accordion-panel__search-clear"
                onClick={() => handleSearch('')}
                aria-label="Clear search"
              >
                <Icon name="close" size="sm" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="accordion-panel__items">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => renderAccordionItem(item, index))
        ) : (
          <div className="accordion-panel__empty">
            <Icon name="search" size="lg" className="accordion-panel__empty-icon" />
            <p className="accordion-panel__empty-text">
              {searchQuery ? 'No items match your search.' : 'No items available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionPanel;
