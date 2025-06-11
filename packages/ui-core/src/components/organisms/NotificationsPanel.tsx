import React, { useState } from "react";
import { Avatar, Badge, Icon, Button } from "../atoms";
import { NotificationItem } from "../molecules";

export interface Notification {
  id: string;
  type:
    | "like"
    | "comment"
    | "friend_request"
    | "mention"
    | "share"
    | "group_invite"
    | "event_invite";
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    postId?: string;
    groupId?: string;
    eventId?: string;
  };
}

export interface NotificationsPanelProps {
  notifications?: Notification[];
  isOpen?: boolean;
  onClose?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onAcceptFriendRequest?: (userId: string) => void;
  onDeclineFriendRequest?: (userId: string) => void;
  className?: string;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications = [],
  isOpen = false,
  onClose,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  className = "",
}) => {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter(
    (notification) => filter === "all" || !notification.isRead,
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconMap = {
      like: "heart",
      comment: "chatbubble",
      friend_request: "person-add",
      mention: "at",
      share: "share",
      group_invite: "people",
      event_invite: "calendar",
    };
    return iconMap[type] || "notifications";
  };

  const getNotificationColor = (type: Notification["type"]) => {
    const colorMap = {
      like: "text-red-500",
      comment: "text-blue-500",
      friend_request: "text-green-500",
      mention: "text-purple-500",
      share: "text-orange-500",
      group_invite: "text-indigo-500",
      event_invite: "text-pink-500",
    };
    return colorMap[type] || "text-gray-500";
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
      absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-900 
      border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg
      max-h-96 flex flex-col z-50
      ${className}
    `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="primary" size="sm" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close notifications"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setFilter("all")}
            className={`
              flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors
              ${
                filter === "all"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }
            `}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`
              flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors
              ${
                filter === "unread"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }
            `}
          >
            Unread
          </button>
        </div>

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Icon
              name="notifications-outline"
              className="w-12 h-12 mx-auto mb-3 opacity-50"
            />
            <p className="text-sm">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer
                  ${!notification.isRead ? "bg-blue-50 dark:bg-blue-900/10" : ""}
                `}
                onClick={() => {
                  onNotificationClick?.(notification);
                  if (!notification.isRead) {
                    onMarkAsRead?.(notification.id);
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      size="sm"
                    />
                    <div
                      className={`
                      absolute -bottom-1 -right-1 w-5 h-5 rounded-full 
                      bg-white dark:bg-gray-900 flex items-center justify-center
                      border-2 border-white dark:border-gray-900
                    `}
                    >
                      <Icon
                        name={getNotificationIcon(notification.type)}
                        className={`w-3 h-3 ${getNotificationColor(notification.type)}`}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`
                      text-sm text-gray-900 dark:text-white mb-1
                      ${!notification.isRead ? "font-medium" : ""}
                    `}
                    >
                      <span className="font-medium">
                        {notification.user.name}
                      </span>{" "}
                      {notification.content}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(notification.timestamp)}
                    </p>

                    {/* Friend Request Actions */}
                    {notification.type === "friend_request" && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptFriendRequest?.(notification.user.id);
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeclineFriendRequest?.(notification.user.id);
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>

                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline text-center">
          See all notifications
        </button>
      </div>
    </div>
  );
};
