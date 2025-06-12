import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Divider } from '../atoms/Divider';

export interface Notification {
  id: string;
  type:
    | 'like'
    | 'comment'
    | 'share'
    | 'mention'
    | 'follow'
    | 'message'
    | 'post'
    | 'event'
    | 'system';
  title: string;
  description?: string;
  avatar?: string;
  targetUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  isRead: boolean;
  isStarred?: boolean;
  actionUrl?: string;
  metadata?: {
    postId?: string;
    commentId?: string;
    userId?: string;
    eventId?: string;
    [key: string]: any;
  };
}

export interface NotificationsPanelProps {
  /**
   * List of notifications
   */
  notifications?: Notification[];
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Empty state content
   */
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: string;
  /**
   * Panel behavior
   */
  isOpen?: boolean;
  onClose?: () => void;
  maxHeight?: string;
  showMarkAllRead?: boolean;
  showClearAll?: boolean;
  showFilter?: boolean;
  /**
   * Event handlers
   */
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onDeleteNotification?: (notificationId: string) => void;
  onStarNotification?: (notificationId: string) => void;
  onLoadMore?: () => void;
  /**
   * Filtering and sorting
   */
  filterType?: 'all' | 'unread' | 'starred' | Notification['type'];
  onFilterChange?: (filter: string) => void;
  sortBy?: 'newest' | 'oldest' | 'unread';
  onSortChange?: (sort: string) => void;
  /**
   * Pagination
   */
  hasMore?: boolean;
  isLoadingMore?: boolean;
  /**
   * Appearance
   */
  variant?: 'dropdown' | 'sidebar' | 'modal' | 'page';
  theme?: 'light' | 'dark' | 'auto';
  position?: 'left' | 'right' | 'center';
  /**
   * Customization
   */
  showTimestamp?: boolean;
  showAvatars?: boolean;
  showActions?: boolean;
  groupByDate?: boolean;
  enableBulkActions?: boolean;
  /**
   * Real-time updates
   */
  onRefresh?: () => void;
  lastUpdated?: string;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  className?: string;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications = [],
  isLoading = false,
  emptyStateTitle = 'No notifications',
  emptyStateDescription = "You're all caught up! Check back later for new notifications.",
  emptyStateIcon = 'bell',
  isOpen = true,
  onClose,
  maxHeight = '400px',
  showMarkAllRead = true,
  showClearAll = true,
  showFilter = true,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllRead,
  onClearAll,
  onDeleteNotification,
  onStarNotification,
  onLoadMore,
  filterType = 'all',
  onFilterChange,
  sortBy = 'newest',
  onSortChange,
  hasMore = false,
  isLoadingMore = false,
  variant = 'dropdown',
  theme = 'light',
  position = 'right',
  showTimestamp = true,
  showAvatars = true,
  showActions = true,
  groupByDate = false,
  enableBulkActions = false,
  onRefresh,
  lastUpdated,
  ariaLabel = 'Notifications panel',
  className = '',
}) => {
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.isRead;
    if (filterType === 'starred') return notification.isStarred;
    return notification.type === filterType;
  });

  // Sort notifications
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    if (sortBy === 'unread') {
      if (a.isRead === b.isRead) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return a.isRead ? 1 : -1;
    }
    return 0;
  });

  // Group notifications by date if enabled
  const groupedNotifications = groupByDate
    ? groupNotificationsByDate(sortedNotifications)
    : { All: sortedNotifications };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead?.(notification.id);
    }
    onNotificationClick?.(notification);
  };

  // Handle bulk selection
  const handleBulkToggle = (notificationId: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedNotifications.size === sortedNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(sortedNotifications.map((n) => n.id)));
    }
  };

  // Handle bulk actions
  const handleBulkMarkRead = () => {
    selectedNotifications.forEach((id) => onMarkAsRead?.(id));
    setSelectedNotifications(new Set());
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach((id) => onDeleteNotification?.(id));
    setSelectedNotifications(new Set());
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    const iconMap = {
      like: 'heart',
      comment: 'message-circle',
      share: 'share',
      mention: 'at-sign',
      follow: 'user-plus',
      message: 'message-square',
      post: 'file-text',
      event: 'calendar',
      system: 'info',
    };
    return iconMap[type] || 'bell';
  };

  // Group notifications by date
  function groupNotificationsByDate(notifications: Notification[]) {
    const groups: { [key: string]: Notification[] } = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = date.toLocaleDateString();
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  }

  const panelClasses = [
    'notifications-panel',
    `notifications-panel--${variant}`,
    `notifications-panel--${theme}`,
    `notifications-panel--${position}`,
    isOpen && 'notifications-panel--open',
    isExpanded && 'notifications-panel--expanded',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!isOpen && variant === 'dropdown') {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={panelClasses}
      style={{ maxHeight: variant === 'dropdown' ? maxHeight : undefined }}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Header */}
      <div className="notifications-panel__header">
        <div className="notifications-panel__title">
          <Icon name="bell" size="sm" />
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Badge
              variant="secondary"
              size="sm"
              count={notifications.filter((n) => !n.isRead).length}
            />
          )}
        </div>

        <div className="notifications-panel__header-actions">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              title="Refresh notifications"
              className="notifications-panel__refresh"
            >
              <Icon name="refresh-cw" size="sm" />
            </Button>
          )}

          {variant !== 'page' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse' : 'Expand'}
              className="notifications-panel__expand"
            >
              <Icon name={isExpanded ? 'minimize-2' : 'maximize-2'} size="sm" />
            </Button>
          )}

          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              title="Close notifications"
              className="notifications-panel__close"
            >
              <Icon name="x" size="sm" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Actions */}
      {(showFilter || showMarkAllRead || showClearAll || enableBulkActions) && (
        <div className="notifications-panel__controls">
          {showFilter && (
            <div className="notifications-panel__filters">
              <select
                value={filterType}
                onChange={(e) => onFilterChange?.(e.target.value)}
                className="notifications-panel__filter-select"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="starred">Starred</option>
                <option value="like">Likes</option>
                <option value="comment">Comments</option>
                <option value="follow">Follows</option>
                <option value="mention">Mentions</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => onSortChange?.(e.target.value)}
                className="notifications-panel__sort-select"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="unread">Unread first</option>
              </select>
            </div>
          )}

          {enableBulkActions && sortedNotifications.length > 0 && (
            <div className="notifications-panel__bulk-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="notifications-panel__select-all"
              >
                {selectedNotifications.size === sortedNotifications.length
                  ? 'Deselect all'
                  : 'Select all'}
              </Button>

              {selectedNotifications.size > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBulkMarkRead}
                    className="notifications-panel__bulk-read"
                  >
                    Mark read ({selectedNotifications.size})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="notifications-panel__bulk-delete"
                  >
                    Delete ({selectedNotifications.size})
                  </Button>
                </>
              )}
            </div>
          )}

          {(showMarkAllRead || showClearAll) && (
            <div className="notifications-panel__actions">
              {showMarkAllRead && notifications.some((n) => !n.isRead) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllRead}
                  className="notifications-panel__mark-all-read"
                >
                  Mark all read
                </Button>
              )}

              {showClearAll && notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="notifications-panel__clear-all"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {lastUpdated && (
        <div className="notifications-panel__last-updated">
          Last updated: {formatTimestamp(lastUpdated)}
        </div>
      )}

      {/* Content */}
      <div className="notifications-panel__content">
        {isLoading ? (
          <div className="notifications-panel__loading">
            <LoadingSpinner size="lg" />
            <span>Loading notifications...</span>
          </div>
        ) : sortedNotifications.length === 0 ? (
          <div className="notifications-panel__empty">
            <Icon name={emptyStateIcon} size="xl" className="notifications-panel__empty-icon" />
            <h3 className="notifications-panel__empty-title">{emptyStateTitle}</h3>
            <p className="notifications-panel__empty-description">{emptyStateDescription}</p>
          </div>
        ) : (
          <div className="notifications-panel__list">
            {Object.entries(groupedNotifications).map(([groupKey, groupNotifications]) => (
              <div key={groupKey} className="notifications-panel__group">
                {groupByDate && <div className="notifications-panel__group-title">{groupKey}</div>}

                {groupNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={[
                      'notifications-panel__item',
                      !notification.isRead && 'notifications-panel__item--unread',
                      notification.isStarred && 'notifications-panel__item--starred',
                      selectedNotifications.has(notification.id) &&
                        'notifications-panel__item--selected',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {enableBulkActions && (
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={() => handleBulkToggle(notification.id)}
                        className="notifications-panel__item-checkbox"
                        aria-label={`Select notification: ${notification.title}`}
                      />
                    )}

                    <Button
                      variant="ghost"
                      className="notifications-panel__item-content"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {showAvatars && (
                        <div className="notifications-panel__item-avatar">
                          {notification.avatar || notification.targetUser?.avatar ? (
                            <Avatar
                              src={notification.avatar || notification.targetUser?.avatar}
                              alt={notification.targetUser?.name || 'User'}
                              name={notification.targetUser?.name}
                              size="sm"
                            />
                          ) : (
                            <div className="notifications-panel__item-icon">
                              <Icon name={getNotificationIcon(notification.type)} size="sm" />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="notifications-panel__item-body">
                        <div className="notifications-panel__item-title">
                          {notification.title}
                          {!notification.isRead && (
                            <div className="notifications-panel__item-unread-indicator" />
                          )}
                        </div>

                        {notification.description && (
                          <div className="notifications-panel__item-description">
                            {notification.description}
                          </div>
                        )}

                        {showTimestamp && (
                          <div className="notifications-panel__item-timestamp">
                            {formatTimestamp(notification.timestamp)}
                          </div>
                        )}
                      </div>

                      {notification.isStarred && (
                        <Icon name="star" size="sm" className="notifications-panel__item-star" />
                      )}
                    </Button>

                    {showActions && (
                      <div className="notifications-panel__item-actions">
                        {onStarNotification && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStarNotification(notification.id);
                            }}
                            title={notification.isStarred ? 'Unstar' : 'Star'}
                            className="notifications-panel__item-action"
                          >
                            <Icon
                              name={notification.isStarred ? 'star' : 'star'}
                              size="sm"
                              className={notification.isStarred ? 'filled' : ''}
                            />
                          </Button>
                        )}

                        {!notification.isRead && onMarkAsRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(notification.id);
                            }}
                            title="Mark as read"
                            className="notifications-panel__item-action"
                          >
                            <Icon name="check" size="sm" />
                          </Button>
                        )}

                        {onDeleteNotification && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteNotification(notification.id);
                            }}
                            title="Delete notification"
                            className="notifications-panel__item-action"
                          >
                            <Icon name="x" size="sm" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {index < Object.entries(groupedNotifications).length - 1 && (
                  <Divider className="notifications-panel__group-divider" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="notifications-panel__load-more">
            <Button
              variant="ghost"
              size="md"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="notifications-panel__load-more-button"
            >
              {isLoadingMore ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Loading...</span>
                </>
              ) : (
                'Load more notifications'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
