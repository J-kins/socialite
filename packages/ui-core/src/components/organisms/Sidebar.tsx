import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { Divider } from '../atoms/Divider';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  isActive?: boolean;
  badge?: number;
  children?: SidebarItem[];
  isExpanded?: boolean;
  isDisabled?: boolean;
  tooltip?: string;
}

export interface SidebarProps {
  /**
   * Current user information
   */
  user?: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
    isOnline?: boolean;
    role?: string;
  };
  /**
   * Navigation items
   */
  items?: SidebarItem[];
  /**
   * Quick actions
   */
  quickActions?: Array<{
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  }>;
  /**
   * Sidebar behavior
   */
  isCollapsed?: boolean;
  isCollapsible?: boolean;
  onToggleCollapse?: () => void;
  /**
   * Navigation handlers
   */
  onItemClick?: (item: SidebarItem) => void;
  onItemExpand?: (item: SidebarItem) => void;
  /**
   * User actions
   */
  onUserClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  /**
   * Appearance
   */
  variant?: 'default' | 'minimal' | 'floating' | 'glass';
  theme?: 'light' | 'dark' | 'auto';
  position?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Mobile behavior
   */
  isMobile?: boolean;
  isOverlay?: boolean;
  onOverlayClick?: () => void;
  /**
   * Footer content
   */
  footerContent?: React.ReactNode;
  /**
   * Custom content slots
   */
  headerContent?: React.ReactNode;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  /**
   * Customization
   */
  showUserSection?: boolean;
  showQuickActions?: boolean;
  showCollapseButton?: boolean;
  allowItemReordering?: boolean;
  /**
   * Event handlers
   */
  onReorderItems?: (items: SidebarItem[]) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  items = [],
  quickActions = [],
  isCollapsed = false,
  isCollapsible = true,
  onToggleCollapse,
  onItemClick,
  onItemExpand,
  onUserClick,
  onSettingsClick,
  onLogoutClick,
  variant = 'default',
  theme = 'light',
  position = 'left',
  width = 'md',
  isMobile = false,
  isOverlay = false,
  onOverlayClick,
  footerContent,
  headerContent,
  topContent,
  bottomContent,
  showUserSection = true,
  showQuickActions = true,
  showCollapseButton = true,
  allowItemReordering = false,
  onReorderItems,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Handle item expansion
  const handleItemExpand = (item: SidebarItem) => {
    if (!item.children || item.children.length === 0) return;

    const newExpandedItems = new Set(expandedItems);
    if (expandedItems.has(item.id)) {
      newExpandedItems.delete(item.id);
    } else {
      newExpandedItems.add(item.id);
    }
    setExpandedItems(newExpandedItems);
    onItemExpand?.(item);
  };

  // Handle item click
  const handleItemClick = (item: SidebarItem, event: React.MouseEvent) => {
    event.preventDefault();

    if (item.isDisabled) return;

    // If item has children, toggle expansion
    if (item.children && item.children.length > 0) {
      handleItemExpand(item);
      return;
    }

    onItemClick?.(item);
  };

  // Handle collapse toggle
  const handleCollapseToggle = () => {
    onToggleCollapse?.();
  };

  // Handle drag and drop for item reordering
  const handleDragStart = (e: React.DragEvent, item: SidebarItem) => {
    if (!allowItemReordering) return;
    setDraggedItem(item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!allowItemReordering || !draggedItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItem: SidebarItem) => {
    if (!allowItemReordering || !draggedItem) return;
    e.preventDefault();

    if (draggedItem === targetItem.id) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex((item) => item.id === draggedItem);
    const targetIndex = newItems.findIndex((item) => item.id === targetItem.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedElement] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedElement);
      onReorderItems?.(newItems);
    }

    setDraggedItem(null);
  };

  // Render navigation item
  const renderItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const itemClasses = [
      'sidebar__item',
      item.isActive && 'sidebar__item--active',
      item.isDisabled && 'sidebar__item--disabled',
      hasChildren && 'sidebar__item--has-children',
      isExpanded && 'sidebar__item--expanded',
      `sidebar__item--level-${level}`,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li key={item.id} className={itemClasses}>
        <Button
          variant={item.isActive ? 'primary' : 'ghost'}
          size={isCollapsed ? 'sm' : 'md'}
          className="sidebar__item-button"
          onClick={(e) => handleItemClick(item, e)}
          disabled={item.isDisabled}
          title={isCollapsed ? item.label : item.tooltip}
          aria-expanded={hasChildren ? isExpanded : undefined}
          draggable={allowItemReordering}
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
        >
          <Icon name={item.icon} size={isCollapsed ? 'md' : 'sm'} className="sidebar__item-icon" />

          {!isCollapsed && (
            <>
              <span className="sidebar__item-label">{item.label}</span>

              {item.badge && item.badge > 0 && (
                <Badge
                  variant="notification"
                  size="sm"
                  count={item.badge}
                  className="sidebar__item-badge"
                />
              )}

              {hasChildren && (
                <Icon
                  name={isExpanded ? 'chevron-down' : 'chevron-right'}
                  size="sm"
                  className="sidebar__item-arrow"
                />
              )}
            </>
          )}
        </Button>

        {hasChildren && isExpanded && !isCollapsed && (
          <ul className="sidebar__submenu">
            {item.children!.map((childItem) => renderItem(childItem, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  const sidebarClasses = [
    'sidebar',
    `sidebar--${variant}`,
    `sidebar--${theme}`,
    `sidebar--${position}`,
    `sidebar--${width}`,
    isCollapsed && 'sidebar--collapsed',
    isMobile && 'sidebar--mobile',
    isOverlay && 'sidebar--overlay',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Overlay for mobile */}
      {isOverlay && (
        <div className="sidebar__overlay" onClick={onOverlayClick} aria-hidden="true" />
      )}

      <aside className={sidebarClasses} role="navigation" aria-label="Main navigation">
        {/* Header Section */}
        {headerContent && <div className="sidebar__header">{headerContent}</div>}

        {/* User Section */}
        {showUserSection && user && (
          <div className="sidebar__user">
            <Button
              variant="ghost"
              size="lg"
              className="sidebar__user-button"
              onClick={onUserClick}
              title={isCollapsed ? user.name : undefined}
            >
              <Avatar
                src={user.avatar}
                alt={user.name}
                name={user.name}
                size={isCollapsed ? 'md' : 'lg'}
                showOnlineStatus={user.isOnline}
                className="sidebar__user-avatar"
              />

              {!isCollapsed && (
                <div className="sidebar__user-info">
                  <div className="sidebar__user-name">{user.name}</div>
                  {user.username && <div className="sidebar__user-username">@{user.username}</div>}
                  {user.role && <div className="sidebar__user-role">{user.role}</div>}
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Top Content */}
        {topContent && <div className="sidebar__top-content">{topContent}</div>}

        {/* Quick Actions */}
        {showQuickActions && quickActions.length > 0 && (
          <div className="sidebar__quick-actions">
            {!isCollapsed && <h3 className="sidebar__section-title">Quick Actions</h3>}
            <div className="sidebar__quick-actions-list">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || 'primary'}
                  size={isCollapsed ? 'sm' : 'md'}
                  className="sidebar__quick-action"
                  onClick={action.onClick}
                  title={isCollapsed ? action.label : undefined}
                >
                  <Icon name={action.icon} size="sm" />
                  {!isCollapsed && <span>{action.label}</span>}
                </Button>
              ))}
            </div>
          </div>
        )}

        {(showQuickActions && quickActions.length > 0) || topContent ? (
          <Divider className="sidebar__divider" />
        ) : null}

        {/* Navigation Items */}
        <nav className="sidebar__nav" role="navigation">
          <ul className="sidebar__nav-list">{items.map((item) => renderItem(item))}</ul>
        </nav>

        {/* Bottom Content */}
        {bottomContent && <div className="sidebar__bottom-content">{bottomContent}</div>}

        {/* Footer Section */}
        <div className="sidebar__footer">
          {footerContent && <div className="sidebar__footer-content">{footerContent}</div>}

          {/* Settings and Logout */}
          <div className="sidebar__footer-actions">
            {onSettingsClick && (
              <Button
                variant="ghost"
                size="sm"
                className="sidebar__footer-action"
                onClick={onSettingsClick}
                title={isCollapsed ? 'Settings' : undefined}
              >
                <Icon name="settings" size="sm" />
                {!isCollapsed && <span>Settings</span>}
              </Button>
            )}

            {onLogoutClick && (
              <Button
                variant="ghost"
                size="sm"
                className="sidebar__footer-action"
                onClick={onLogoutClick}
                title={isCollapsed ? 'Logout' : undefined}
              >
                <Icon name="logout" size="sm" />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            )}
          </div>

          {/* Collapse Toggle */}
          {isCollapsible && showCollapseButton && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="sidebar__collapse-toggle"
              onClick={handleCollapseToggle}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} size="sm" />
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
