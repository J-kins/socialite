import React from "react";
import { Avatar, Badge, Icon } from "../atoms";
import { SidebarLink, AvatarWithName } from "../molecules";

export interface SidebarProps {
  user?: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
  };
  friends?: Array<{
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  }>;
  groups?: Array<{
    id: string;
    name: string;
    memberCount: number;
    unreadCount?: number;
  }>;
  onNavigate?: (path: string) => void;
  onFriendClick?: (friendId: string) => void;
  onGroupClick?: (groupId: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  friends = [],
  groups = [],
  onNavigate,
  onFriendClick,
  onGroupClick,
  className = "",
}) => {
  const navigationItems = [
    { id: "feed", icon: "home", label: "News Feed", path: "/feed" },
    {
      id: "messages",
      icon: "chatbubble",
      label: "Messages",
      path: "/messages",
    },
    { id: "groups", icon: "people", label: "Groups", path: "/groups" },
    { id: "events", icon: "calendar", label: "Events", path: "/events" },
    {
      id: "marketplace",
      icon: "storefront",
      label: "Marketplace",
      path: "/marketplace",
    },
    { id: "games", icon: "game-controller", label: "Games", path: "/games" },
    { id: "videos", icon: "play", label: "Videos", path: "/videos" },
    { id: "photos", icon: "images", label: "Photos", path: "/photos" },
  ];

  const shortcuts = [
    { id: "saved", icon: "bookmark", label: "Saved", path: "/saved" },
    { id: "memories", icon: "time", label: "Memories", path: "/memories" },
    { id: "pages", icon: "flag", label: "Pages", path: "/pages" },
  ];

  return (
    <aside
      className={`
      w-80 bg-white dark:bg-gray-900 
      border-r border-gray-200 dark:border-gray-700
      h-full overflow-y-auto
      flex flex-col
      ${className}
    `}
    >
      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <AvatarWithName
            src={user.avatar}
            name={user.name}
            subtitle={user.email}
            size="md"
            onClick={() => onNavigate?.("/profile")}
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors"
          />
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-6">
          {navigationItems.map((item) => (
            <SidebarLink
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => onNavigate?.(item.path)}
              className="mb-1"
            />
          ))}
        </div>

        {/* Shortcuts */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Your shortcuts
          </h3>
          {shortcuts.map((item) => (
            <SidebarLink
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => onNavigate?.(item.path)}
              className="mb-1"
            />
          ))}
        </div>

        {/* Groups */}
        {groups.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Your groups
              </h3>
              <button
                onClick={() => onNavigate?.("/groups")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                See all
              </button>
            </div>
            <div className="space-y-1">
              {groups.slice(0, 5).map((group) => (
                <button
                  key={group.id}
                  onClick={() => onGroupClick?.(group.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon name="people" className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {group.memberCount} members
                      </div>
                    </div>
                  </div>
                  {group.unreadCount && group.unreadCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {group.unreadCount}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Online Friends */}
        {friends.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Online friends
              </h3>
              <button
                onClick={() => onNavigate?.("/friends")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                See all
              </button>
            </div>
            <div className="space-y-1">
              {friends
                .filter((f) => f.isOnline)
                .slice(0, 8)
                .map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => onFriendClick?.(friend.id)}
                    className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <AvatarWithName
                      src={friend.avatar}
                      name={friend.name}
                      size="sm"
                      isOnline={friend.isOnline}
                    />
                  </button>
                ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};
