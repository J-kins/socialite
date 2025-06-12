import React from "react";
import { Avatar } from "../atoms/Avatar";
import { Badge } from "../atoms/Badge";

export interface NotificationItemProps {
  id: string;
  type: "like" | "comment" | "friend_request" | "message" | "mention";
  user: {
    name: string;
    avatar: string;
    username?: string;
  };
  message: string;
  timestamp: string;
  read?: boolean;
  actionable?: boolean;
  onRead?: () => void;
  onAction?: (action: "accept" | "decline") => void;
  onClick?: () => void;
}

/**
 * NotificationItem molecule - Individual notification in dropdown/page
 * Matches the notification styling from the existing design
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  user,
  message,
  timestamp,
  read = false,
  actionable = false,
  onRead,
  onAction,
  onClick,
}) => {
  const typeIcons = {
    like: "heart",
    comment: "chatbubble-ellipses",
    friend_request: "person-add",
    message: "mail",
    mention: "at",
  };

  const typeColors = {
    like: "text-red-500",
    comment: "text-blue-500",
    friend_request: "text-green-500",
    message: "text-purple-500",
    mention: "text-orange-500",
  };

  const handleClick = () => {
    if (!read && onRead) {
      onRead();
    }
    if (onClick) {
      onClick();
    }
  };

  const handleAction = (action: "accept" | "decline") => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
        !read ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div
          className={`absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center`}
        >
          <ion-icon
            name={typeIcons[type]}
            className={`text-sm ${typeColors[type]}`}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              <span className="font-medium">{user.name}</span> {message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {timestamp}
            </p>
          </div>

          {!read && <Badge dot size="sm" className="mt-2" />}
        </div>

        {actionable && type === "friend_request" && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction("accept");
              }}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction("decline");
              }}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
