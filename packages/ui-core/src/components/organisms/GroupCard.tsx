import React from "react";
import { Avatar, Button, Badge, Icon } from "../atoms";

export interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    memberCount: number;
    privacy: "public" | "private" | "secret";
    category?: string;
    recentActivity?: string;
    isJoined?: boolean;
    isPending?: boolean;
    recentMembers?: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
    admin?: {
      id: string;
      name: string;
      avatar?: string;
    };
    unreadPosts?: number;
    lastActivity?: string;
  };
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  onViewGroup?: (groupId: string) => void;
  onUserClick?: (userId: string) => void;
  variant?: "card" | "list" | "minimal";
  className?: string;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onJoin,
  onLeave,
  onViewGroup,
  onUserClick,
  variant = "card",
  className = "",
}) => {
  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M members`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K members`;
    }
    return `${count} members`;
  };

  const getPrivacyIcon = (privacy: string) => {
    const iconMap = {
      public: "globe",
      private: "people",
      secret: "lock-closed",
    };
    return iconMap[privacy as keyof typeof iconMap] || "globe";
  };

  const formatLastActivity = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Active now";
    if (diffInHours < 24) return `Active ${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `Active ${Math.floor(diffInHours / 24)}d ago`;
    return "Not recently active";
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={() => onViewGroup?.(group.id)}
        className={`
          w-full flex items-center space-x-3 p-3 rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left
          ${className}
        `}
      >
        <div className="relative">
          {group.coverImage ? (
            <img
              src={group.coverImage}
              alt={group.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="people" className="w-6 h-6 text-white" />
            </div>
          )}
          {group.unreadPosts && group.unreadPosts > 0 && (
            <Badge
              variant="primary"
              size="sm"
              className="absolute -top-1 -right-1"
            >
              {group.unreadPosts}
            </Badge>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {group.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatMemberCount(group.memberCount)}
          </p>
        </div>

        <div className="flex items-center space-x-1 text-gray-400">
          <Icon name={getPrivacyIcon(group.privacy)} className="w-4 h-4" />
        </div>
      </button>
    );
  }

  if (variant === "list") {
    return (
      <div
        className={`
        bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
        rounded-lg p-4 hover:shadow-md transition-shadow
        ${className}
      `}
      >
        <div className="flex items-start space-x-4">
          <button onClick={() => onViewGroup?.(group.id)}>
            {group.coverImage ? (
              <img
                src={group.coverImage}
                alt={group.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="people" className="w-8 h-8 text-white" />
              </div>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <button
                  onClick={() => onViewGroup?.(group.id)}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:underline"
                >
                  {group.name}
                </button>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Icon
                    name={getPrivacyIcon(group.privacy)}
                    className="w-4 h-4"
                  />
                  <span className="capitalize">{group.privacy} group</span>
                  <span>•</span>
                  <span>{formatMemberCount(group.memberCount)}</span>
                </div>
              </div>

              {!group.isJoined && !group.isPending && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onJoin?.(group.id)}
                >
                  {group.privacy === "private"
                    ? "Request to Join"
                    : "Join Group"}
                </Button>
              )}

              {group.isPending && (
                <Button size="sm" variant="secondary" disabled>
                  Request Sent
                </Button>
              )}

              {group.isJoined && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLeave?.(group.id)}
                >
                  Joined
                </Button>
              )}
            </div>

            {group.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {group.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {group.category && (
                  <Badge variant="secondary" size="sm">
                    {group.category}
                  </Badge>
                )}
                {group.lastActivity && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatLastActivity(group.lastActivity)}
                  </span>
                )}
              </div>

              {group.recentMembers && group.recentMembers.length > 0 && (
                <div className="flex -space-x-2">
                  {group.recentMembers.slice(0, 3).map((member) => (
                    <button
                      key={member.id}
                      onClick={() => onUserClick?.(member.id)}
                    >
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        size="xs"
                        className="ring-2 ring-white dark:ring-gray-900"
                      />
                    </button>
                  ))}
                  {group.recentMembers.length > 3 && (
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        +{group.recentMembers.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div
      className={`
      bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
      rounded-lg overflow-hidden hover:shadow-md transition-shadow
      ${className}
    `}
    >
      {/* Cover Image */}
      <button
        onClick={() => onViewGroup?.(group.id)}
        className="w-full aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600 relative"
      >
        {group.coverImage ? (
          <img
            src={group.coverImage}
            alt={group.name}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Icon name="people" className="w-12 h-12 text-white" />
          </div>
        )}

        {group.unreadPosts && group.unreadPosts > 0 && (
          <Badge variant="primary" className="absolute top-2 right-2">
            {group.unreadPosts} new
          </Badge>
        )}
      </button>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <button
              onClick={() => onViewGroup?.(group.id)}
              className="text-lg font-semibold text-gray-900 dark:text-white hover:underline text-left"
            >
              {group.name}
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Icon name={getPrivacyIcon(group.privacy)} className="w-4 h-4" />
              <span className="capitalize">{group.privacy}</span>
              <span>•</span>
              <span>{formatMemberCount(group.memberCount)}</span>
            </div>
          </div>

          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="ellipsis-horizontal" className="w-5 h-5" />
          </button>
        </div>

        {group.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {group.description}
          </p>
        )}

        {/* Recent Members */}
        {group.recentMembers && group.recentMembers.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex -space-x-2">
              {group.recentMembers.slice(0, 5).map((member) => (
                <button
                  key={member.id}
                  onClick={() => onUserClick?.(member.id)}
                  title={member.name}
                >
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    size="sm"
                    className="ring-2 ring-white dark:ring-gray-900"
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Recent members
            </span>
          </div>
        )}

        {/* Activity Info */}
        {group.lastActivity && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {formatLastActivity(group.lastActivity)}
          </p>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {!group.isJoined && !group.isPending && (
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => onJoin?.(group.id)}
            >
              {group.privacy === "private" ? "Request to Join" : "Join Group"}
            </Button>
          )}

          {group.isPending && (
            <Button variant="secondary" className="flex-1" disabled>
              Request Sent
            </Button>
          )}

          {group.isJoined && (
            <>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => onViewGroup?.(group.id)}
              >
                View Group
              </Button>
              <Button variant="outline" onClick={() => onLeave?.(group.id)}>
                <Icon name="checkmark" className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
