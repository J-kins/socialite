import React from "react";
import { Icon, CloseButton } from "../atoms";

export interface RecentSearchItemProps {
  id: string;
  query: string;
  type?: "text" | "user" | "hashtag" | "location";
  user?: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
  timestamp?: string;
  onClick?: (query: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export const RecentSearchItem: React.FC<RecentSearchItemProps> = ({
  id,
  query,
  type = "text",
  user,
  timestamp,
  onClick,
  onRemove,
  className = "",
}) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return "";

    const time = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return time.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getIcon = () => {
    switch (type) {
      case "user":
        return "person";
      case "hashtag":
        return "pricetag";
      case "location":
        return "location";
      default:
        return "time";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "user":
        return "text-blue-500";
      case "hashtag":
        return "text-purple-500";
      case "location":
        return "text-green-500";
      default:
        return "text-gray-400 dark:text-gray-500";
    }
  };

  const handleClick = () => {
    onClick?.(query);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(id);
  };

  return (
    <div
      className={`
        group flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 
        rounded-lg transition-colors duration-150 cursor-pointer
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Icon or Avatar */}
      <div className="flex-shrink-0">
        {type === "user" && user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${
              type === "user"
                ? "bg-blue-50 dark:bg-blue-900/20"
                : type === "hashtag"
                  ? "bg-purple-50 dark:bg-purple-900/20"
                  : type === "location"
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-gray-50 dark:bg-gray-800"
            }
          `}
          >
            <Icon name={getIcon()} className={`w-4 h-4 ${getIconColor()}`} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {type === "hashtag" ? `#${query}` : query}
          </span>

          {type === "user" && user?.username && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              @{user.username}
            </span>
          )}
        </div>

        {timestamp && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(timestamp)}
          </span>
        )}
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <CloseButton size="sm" variant="ghost" onClose={handleRemove} />
      </div>
    </div>
  );
};
