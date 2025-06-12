import React from "react";
import { Avatar, Button, Badge, Icon } from "../atoms";

export interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    followerCount?: number;
    followingCount?: number;
    mutualFriendsCount?: number;
    isVerified?: boolean;
    isOnline?: boolean;
    badges?: Array<{
      id: string;
      name: string;
      icon: string;
      color: string;
    }>;
  };
  variant?: "default" | "compact" | "minimal";
  showStats?: boolean;
  showActions?: boolean;
  relationshipStatus?: "friend" | "requested" | "pending" | "blocked" | "none";
  onFollow?: () => void;
  onUnfollow?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
  onClick?: () => void;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  variant = "default",
  showStats = true,
  showActions = true,
  relationshipStatus = "none",
  onFollow,
  onUnfollow,
  onMessage,
  onViewProfile,
  onClick,
  className = "",
}) => {
  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getActionButton = () => {
    switch (relationshipStatus) {
      case "friend":
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" onClick={onUnfollow}>
              <Icon name="person-remove" className="w-4 h-4 mr-1" />
              Friends
            </Button>
            <Button size="sm" variant="primary" onClick={onMessage}>
              <Icon name="chatbubble" className="w-4 h-4" />
            </Button>
          </div>
        );
      case "requested":
        return (
          <Button size="sm" variant="secondary" disabled>
            <Icon name="time" className="w-4 h-4 mr-1" />
            Requested
          </Button>
        );
      case "pending":
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="primary" onClick={onFollow}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={onUnfollow}>
              Decline
            </Button>
          </div>
        );
      default:
        return (
          <Button size="sm" variant="primary" onClick={onFollow}>
            <Icon name="person-add" className="w-4 h-4 mr-1" />
            Follow
          </Button>
        );
    }
  };

  if (variant === "minimal") {
    return (
      <div
        className={`flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer ${className}`}
        onClick={onClick || onViewProfile}
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="md"
          isOnline={user.isOnline}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </h3>
            {user.isVerified && (
              <Icon name="checkmark-circle" className="w-4 h-4 text-blue-500" />
            )}
          </div>
          {user.username && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>
          )}
          {user.mutualFriendsCount && user.mutualFriendsCount > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.mutualFriendsCount} mutual friends
            </p>
          )}
        </div>
        {showActions && (
          <div onClick={(e) => e.stopPropagation()}>{getActionButton()}</div>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start space-x-3">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="lg"
            isOnline={user.isOnline}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <button
                onClick={onViewProfile}
                className="font-semibold text-gray-900 dark:text-white hover:underline truncate"
              >
                {user.name}
              </button>
              {user.isVerified && (
                <Icon
                  name="checkmark-circle"
                  className="w-5 h-5 text-blue-500"
                />
              )}
              {user.badges &&
                user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${badge.color}`}
                    title={badge.name}
                  >
                    <Icon name={badge.icon} className="w-3 h-3 text-white" />
                  </div>
                ))}
            </div>

            {user.username && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                @{user.username}
              </p>
            )}

            {user.bio && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                {user.bio}
              </p>
            )}

            {showStats && (
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>{formatNumber(user.followerCount)} followers</span>
                <span>{formatNumber(user.followingCount)} following</span>
                {user.mutualFriendsCount && user.mutualFriendsCount > 0 && (
                  <span>{user.mutualFriendsCount} mutual</span>
                )}
              </div>
            )}

            {showActions && getActionButton()}
          </div>
        </div>
      </div>
    );
  }

  // Default variant with cover image
  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      {/* Cover Image */}
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-600">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
        )}

        {/* Online indicator for cover */}
        {user.isOnline && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Profile Content */}
      <div className="p-4 -mt-8 relative">
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="xl"
            className="ring-4 ring-white dark:ring-gray-900"
          />
        </div>

        {/* Name and Verification */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={onViewProfile}
              className="text-lg font-semibold text-gray-900 dark:text-white hover:underline"
            >
              {user.name}
            </button>
            {user.isVerified && (
              <Icon name="checkmark-circle" className="w-5 h-5 text-blue-500" />
            )}
          </div>

          {user.username && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>
          )}
        </div>

        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="flex justify-center space-x-2 mb-3">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${badge.color}`}
                title={badge.name}
              >
                <Icon name={badge.icon} className="w-4 h-4 text-white" />
              </div>
            ))}
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-3 line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* Location */}
        {user.location && (
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Icon name="location" className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <div className="flex justify-center space-x-6 mb-4 py-2 border-t border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatNumber(user.followerCount)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Followers
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatNumber(user.followingCount)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Following
              </div>
            </div>
            {user.mutualFriendsCount && user.mutualFriendsCount > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.mutualFriendsCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Mutual
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex justify-center">{getActionButton()}</div>
        )}
      </div>
    </div>
  );
};
