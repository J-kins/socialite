import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Avatar } from '../atoms/Avatar';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'default';
  title: string;
  message?: string;
  icon?: string;
  avatar?: string;
  timestamp?: Date;
  duration?: number; // Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
  persistent?: boolean; // Cannot be dismissed by user
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  category?: string;
  metadata?: Record<string, any>;
}

export interface NotificationSystemProps {
  /**
   * Array of notifications to display
   */
  notifications: Notification[];
  /**
   * Position of notification container
   */
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
  /**
   * Maximum number of visible notifications
   */
  maxVisible?: number;
  /**
   * Default auto-dismiss duration (can be overridden per notification)
   */
  defaultDuration?: number;
  /**
   * Animation settings
   */
  animationDuration?: number;
  animationType?: 'slide' | 'fade' | 'scale' | 'bounce';
  /**
   * Stacking behavior
   */
  stackBehavior?: 'stack' | 'replace' | 'queue';
  stackLimit?: number;
  /**
   * Interaction settings
   */
  pauseOnHover?: boolean;
  clickToDismiss?: boolean;
  swipeToDismiss?: boolean;
  /**
   * Appearance
   */
  variant?: 'default' | 'minimal' | 'compact' | 'rich';
  theme?: 'light' | 'dark' | 'auto';
  /**
   * Accessibility
   */
  announceNotifications?: boolean;
  reducedMotion?: boolean;
  /**
   * Event handlers
   */
  onNotificationAdd?: (notification: Notification) => void;
  onNotificationRemove?: (notificationId: string) => void;
  onNotificationClick?: (notification: Notification) => void;
  onNotificationAction?: (notification: Notification) => void;
  /**
   * Filtering and grouping
   */
  enableFiltering?: boolean;
  enableGrouping?: boolean;
  groupBy?: 'category' | 'type' | 'priority';
  /**
   * Sound notifications
   */
  enableSounds?: boolean;
  soundMapping?: Record<string, string>;
  /**
   * Custom rendering
   */
  renderNotification?: (notification: Notification) => React.ReactNode;
  /**
   * Customization
   */
  className?: string;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications = [],
  position = 'top-right',
  maxVisible = 5,
  defaultDuration = 5000,
  animationDuration = 300,
  animationType = 'slide',
  stackBehavior = 'stack',
  stackLimit = 10,
  pauseOnHover = true,
  clickToDismiss = true,
  swipeToDismiss = true,
  variant = 'default',
  theme = 'auto',
  announceNotifications = true,
  reducedMotion = false,
  onNotificationAdd,
  onNotificationRemove,
  onNotificationClick,
  onNotificationAction,
  enableFiltering = false,
  enableGrouping = false,
  groupBy = 'category',
  enableSounds = false,
  soundMapping = {},
  renderNotification,
  className = '',
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());
  const [pausedIds, setPausedIds] = useState<Set<string>>(new Set());
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);

  // Update visible notifications when props change
  useEffect(() => {
    const processNotifications = () => {
      let processed = [...notifications];

      // Apply filtering if enabled
      if (enableFiltering) {
        // Filter logic could be implemented here based on user preferences
      }

      // Apply grouping if enabled
      if (enableGrouping) {
        // Group notifications by specified criteria
        processed = groupNotifications(processed, groupBy);
      }

      // Apply stack behavior
      if (stackBehavior === 'replace') {
        processed = processed.slice(-1);
      } else if (stackBehavior === 'queue') {
        processed = processed.slice(0, stackLimit);
      }

      // Limit visible notifications
      processed = processed.slice(0, maxVisible);

      setVisibleNotifications(processed);

      // Announce new notifications for screen readers
      if (announceNotifications) {
        announceNewNotifications(processed);
      }

      // Play notification sounds
      if (enableSounds) {
        playNotificationSounds(processed);
      }

      // Call add handler for new notifications
      processed.forEach((notification) => {
        if (!visibleNotifications.find((n) => n.id === notification.id)) {
          onNotificationAdd?.(notification);
        }
      });
    };

    processNotifications();
  }, [
    notifications,
    enableFiltering,
    enableGrouping,
    groupBy,
    stackBehavior,
    stackLimit,
    maxVisible,
  ]);

  // Set up auto-dismiss timers
  useEffect(() => {
    visibleNotifications.forEach((notification) => {
      if (timersRef.current.has(notification.id)) return;

      const duration = notification.duration ?? defaultDuration;
      if (duration > 0 && !notification.persistent) {
        const timer = setTimeout(() => {
          dismissNotification(notification.id);
        }, duration);

        timersRef.current.set(notification.id, timer);
      }
    });

    // Clean up timers for removed notifications
    timersRef.current.forEach((timer, id) => {
      if (!visibleNotifications.find((n) => n.id === id)) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    });

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [visibleNotifications, defaultDuration]);

  // Handle paused notifications (pause timers on hover)
  useEffect(() => {
    pausedIds.forEach((id) => {
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    });
  }, [pausedIds]);

  // Resume timers when notifications are no longer paused
  useEffect(() => {
    visibleNotifications.forEach((notification) => {
      if (!pausedIds.has(notification.id) && !timersRef.current.has(notification.id)) {
        const duration = notification.duration ?? defaultDuration;
        if (duration > 0 && !notification.persistent) {
          const timer = setTimeout(() => {
            dismissNotification(notification.id);
          }, duration);

          timersRef.current.set(notification.id, timer);
        }
      }
    });
  }, [pausedIds, visibleNotifications, defaultDuration]);

  // Group notifications
  const groupNotifications = (notifications: Notification[], groupBy: string): Notification[] => {
    // Implementation for grouping notifications
    return notifications; // Simplified for now
  };

  // Announce new notifications for accessibility
  const announceNewNotifications = (notifications: Notification[]) => {
    if (!announceRef.current) return;

    const newNotifications = notifications.filter(
      (n) => !visibleNotifications.find((v) => v.id === n.id)
    );

    if (newNotifications.length > 0) {
      const announcement = newNotifications
        .map((n) => `${n.type} notification: ${n.title}`)
        .join('. ');

      announceRef.current.textContent = announcement;
    }
  };

  // Play notification sounds
  const playNotificationSounds = (notifications: Notification[]) => {
    notifications.forEach((notification) => {
      const soundUrl = soundMapping[notification.type];
      if (soundUrl) {
        const audio = new Audio(soundUrl);
        audio.play().catch(console.error);
      }
    });
  };

  // Dismiss notification
  const dismissNotification = useCallback(
    (id: string) => {
      if (dismissingIds.has(id)) return;

      setDismissingIds((prev) => new Set(prev).add(id));

      // Clear timer if exists
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }

      // Remove after animation
      setTimeout(() => {
        setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
        setDismissingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        setPausedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });

        onNotificationRemove?.(id);
      }, animationDuration);
    },
    [dismissingIds, animationDuration, onNotificationRemove]
  );

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification);
    if (clickToDismiss && !notification.persistent) {
      dismissNotification(notification.id);
    }
  };

  // Handle notification action
  const handleNotificationAction = (notification: Notification) => {
    notification.onAction?.();
    onNotificationAction?.(notification);
    if (!notification.persistent) {
      dismissNotification(notification.id);
    }
  };

  // Handle mouse enter (pause timer)
  const handleMouseEnter = (id: string) => {
    if (pauseOnHover) {
      setPausedIds((prev) => new Set(prev).add(id));
    }
  };

  // Handle mouse leave (resume timer)
  const handleMouseLeave = (id: string) => {
    if (pauseOnHover) {
      setPausedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Handle touch start for swipe to dismiss
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    if (swipeToDismiss) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  // Handle touch end for swipe to dismiss
  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    if (!swipeToDismiss || touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX - touchEndX;

    // Swipe threshold
    if (Math.abs(difference) > 100) {
      const notification = visibleNotifications.find((n) => n.id === id);
      if (notification && !notification.persistent) {
        dismissNotification(id);
      }
    }

    setTouchStartX(null);
  };

  // Get notification icon
  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;

    switch (notification.type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert-triangle';
      case 'info':
        return 'info';
      default:
        return 'bell';
    }
  };

  // Render individual notification
  const renderNotificationItem = (notification: Notification) => {
    if (renderNotification) {
      return renderNotification(notification);
    }

    const isDismissing = dismissingIds.has(notification.id);
    const isPaused = pausedIds.has(notification.id);

    const notificationClasses = [
      'notification-system__item',
      `notification-system__item--${notification.type}`,
      `notification-system__item--${variant}`,
      isDismissing && 'notification-system__item--dismissing',
      isPaused && 'notification-system__item--paused',
      `notification-system__item--priority-${notification.priority || 'normal'}`,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        key={notification.id}
        className={notificationClasses}
        onClick={() => handleNotificationClick(notification)}
        onMouseEnter={() => handleMouseEnter(notification.id)}
        onMouseLeave={() => handleMouseLeave(notification.id)}
        onTouchStart={(e) => handleTouchStart(e, notification.id)}
        onTouchEnd={(e) => handleTouchEnd(e, notification.id)}
        role="alert"
        aria-live={notification.priority === 'urgent' ? 'assertive' : 'polite'}
      >
        {/* Icon or Avatar */}
        <div className="notification-system__icon">
          {notification.avatar ? (
            <Avatar src={notification.avatar} size="sm" />
          ) : (
            <Icon
              name={getNotificationIcon(notification)}
              size="md"
              className={`notification-system__type-icon notification-system__type-icon--${notification.type}`}
            />
          )}
        </div>

        {/* Content */}
        <div className="notification-system__content">
          <h4 className="notification-system__title">{notification.title}</h4>
          {notification.message && (
            <p className="notification-system__message">{notification.message}</p>
          )}
          {notification.timestamp && (
            <time className="notification-system__timestamp">
              {new Intl.DateTimeFormat('en', {
                hour: '2-digit',
                minute: '2-digit',
              }).format(notification.timestamp)}
            </time>
          )}
        </div>

        {/* Actions */}
        <div className="notification-system__actions">
          {notification.actionLabel && notification.onAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleNotificationAction(notification);
              }}
              className="notification-system__action"
            >
              {notification.actionLabel}
            </Button>
          )}

          {!notification.persistent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                dismissNotification(notification.id);
              }}
              className="notification-system__dismiss"
              aria-label="Dismiss notification"
            >
              <Icon name="close" size="sm" />
            </Button>
          )}
        </div>

        {/* Progress bar for auto-dismiss */}
        {!notification.persistent && (notification.duration ?? defaultDuration) > 0 && (
          <div className="notification-system__progress">
            <div
              className="notification-system__progress-bar"
              style={{
                animationDuration: `${notification.duration ?? defaultDuration}ms`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const containerClasses = [
    'notification-system',
    `notification-system--${position}`,
    `notification-system--${variant}`,
    `notification-system--${theme}`,
    `notification-system--${animationType}`,
    reducedMotion && 'notification-system--reduced-motion',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Notification Container */}
      <div
        ref={containerRef}
        className={containerClasses}
        style={
          {
            '--animation-duration': `${animationDuration}ms`,
          } as React.CSSProperties
        }
      >
        {visibleNotifications.map(renderNotificationItem)}
      </div>

      {/* Screen Reader Announcements */}
      <div
        ref={announceRef}
        className="notification-system__announcer"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      />
    </>
  );
};

export default NotificationSystem;
