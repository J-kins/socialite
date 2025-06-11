import React from "react";
import { Avatar, Badge, NotificationDot, Icon } from "../atoms";
import { SearchBox } from "../molecules";

export interface HeaderProps {
  user?: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  notificationCount?: number;
  messageCount?: number;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onMessagesClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notificationCount = 0,
  messageCount = 0,
  onSearch,
  onNotificationsClick,
  onMessagesClick,
  onProfileClick,
  className = "",
}) => {
  return (
    <header
      className={`
      bg-white dark:bg-gray-900 
      border-b border-gray-200 dark:border-gray-700
      px-4 py-3
      flex items-center justify-between
      sticky top-0 z-50
      backdrop-blur-sm bg-white/95 dark:bg-gray-900/95
      ${className}
    `}
    >
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          <Icon name="heart" className="inline-block w-8 h-8" />
          <span className="ml-2">Socialite</span>
        </div>
      </div>

      {/* Search Box */}
      <div className="flex-1 max-w-md mx-8">
        <SearchBox
          placeholder="Search for friends, posts, photos and more..."
          onSearch={onSearch}
          className="w-full"
        />
      </div>

      {/* Navigation & User */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button
          onClick={onNotificationsClick}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount})` : ""}`}
        >
          <Icon name="notifications" className="w-6 h-6" />
          {notificationCount > 0 && (
            <NotificationDot
              count={notificationCount}
              className="absolute -top-1 -right-1"
            />
          )}
        </button>

        {/* Messages */}
        <button
          onClick={onMessagesClick}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label={`Messages ${messageCount > 0 ? `(${messageCount})` : ""}`}
        >
          <Icon name="chatbubble" className="w-6 h-6" />
          {messageCount > 0 && (
            <NotificationDot
              count={messageCount}
              className="absolute -top-1 -right-1"
            />
          )}
        </button>

        {/* User Profile */}
        {user && (
          <button
            onClick={onProfileClick}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Profile menu"
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="sm"
              isOnline={user.isOnline}
            />
            <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </span>
            <Icon name="chevron-down" className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Mobile Menu */}
        <button className="md:hidden p-2 text-gray-600 dark:text-gray-300">
          <Icon name="menu" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
