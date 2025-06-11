import React from "react";
import { Avatar, Badge, Icon } from "../atoms";

export interface ChatPreviewProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  isTyping?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isGroup?: boolean;
  participants?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  onClick?: (id: string) => void;
  onPin?: (id: string) => void;
  onMute?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({
  id,
  name,
  avatar,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  isOnline = false,
  isTyping = false,
  isPinned = false,
  isMuted = false,
  isGroup = false,
  participants = [],
  onClick,
  onPin,
  onMute,
  onDelete,
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
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return time.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getAvatarDisplay = () => {
    if (isGroup && participants.length > 0) {
      return (
        <div className="relative">
          <div className="flex -space-x-2">
            {participants.slice(0, 2).map((participant, index) => (
              <Avatar
                key={participant.id}
                src={participant.avatar}
                alt={participant.name}
                size="sm"
                className={`ring-2 ring-white dark:ring-gray-900 ${index === 1 ? "z-10" : ""}`}
              />
            ))}
          </div>
          {participants.length > 2 && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
              +{participants.length - 2}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <Avatar
          src={avatar}
          alt={name}
          size="md"
          isOnline={isOnline && !isGroup}
        />
        {unreadCount > 0 && (
          <Badge
            variant="primary"
            size="sm"
            className="absolute -top-1 -right-1"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        relative flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 
        transition-colors duration-150 cursor-pointer group
        ${unreadCount > 0 ? "bg-blue-50 dark:bg-blue-900/10" : ""}
        ${className}
      `}
      onClick={() => onClick?.(id)}
    >
      {/* Pin Indicator */}
      {isPinned && (
        <div className="absolute top-1 left-1 z-10">
          <Icon name="pin" className="w-3 h-3 text-blue-500" />
        </div>
      )}

      {/* Avatar */}
      {getAvatarDisplay()}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`font-medium truncate ${
              unreadCount > 0
                ? "text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {name}
            {isGroup && (
              <Icon
                name="people"
                className="w-4 h-4 inline ml-1 text-gray-400"
              />
            )}
            {isMuted && (
              <Icon
                name="volume-mute"
                className="w-4 h-4 inline ml-1 text-gray-400"
              />
            )}
          </h3>

          {lastMessageTime && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {formatTime(lastMessageTime)}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isTyping ? (
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                <div
                  className="w-1 h-1 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1 h-1 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-sm italic">typing...</span>
            </div>
          ) : lastMessage ? (
            <p
              className={`text-sm truncate flex-1 ${
                unreadCount > 0
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {lastMessage}
            </p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              No messages yet
            </p>
          )}
        </div>
      </div>

      {/* Action Menu */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin?.(id);
            }}
            className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              isPinned ? "text-blue-500" : "text-gray-400"
            }`}
            title={isPinned ? "Unpin" : "Pin"}
          >
            <Icon name="pin" className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onMute?.(id);
            }}
            className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              isMuted ? "text-orange-500" : "text-gray-400"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            <Icon
              name={isMuted ? "volume-mute" : "volume-high"}
              className="w-4 h-4"
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(id);
            }}
            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Icon name="trash" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
