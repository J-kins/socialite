import React, { useState } from "react";
import { Avatar, Button, Badge, Icon } from "../atoms";

export interface UserProfileProps {
  user: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinDate: string;
    isVerified?: boolean;
    isOnline?: boolean;
    followerCount: number;
    followingCount: number;
    postCount: number;
    mutualFriendsCount?: number;
    relationshipStatus?:
      | "friend"
      | "requested"
      | "pending"
      | "blocked"
      | "none";
    isPrivate?: boolean;
    badges?: Array<{
      id: string;
      name: string;
      icon: string;
      color: string;
    }>;
  };
  currentUser?: {
    id: string;
    name: string;
  };
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  onBlock?: (userId: string) => void;
  onReport?: (userId: string) => void;
  onEditProfile?: () => void;
  isOwnProfile?: boolean;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  currentUser,
  onFollow,
  onUnfollow,
  onMessage,
  onBlock,
  onReport,
  onEditProfile,
  isOwnProfile = false,
  className = "",
}) => {
  const [showMore, setShowMore] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "long",
    });
  };

  const getActionButton = () => {
    if (isOwnProfile) {
      return (
        <Button variant="outline" onClick={onEditProfile}>
          <Icon name="create" className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      );
    }

    switch (user.relationshipStatus) {
      case "friend":
        return (
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => onUnfollow?.(user.id)}>
              <Icon name="people" className="w-4 h-4 mr-2" />
              Friends
            </Button>
            <Button variant="primary" onClick={() => onMessage?.(user.id)}>
              <Icon name="chatbubble" className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        );
      case "requested":
        return (
          <Button variant="secondary" disabled>
            <Icon name="time" className="w-4 h-4 mr-2" />
            Request Sent
          </Button>
        );
      case "pending":
        return (
          <div className="flex space-x-2">
            <Button variant="primary" onClick={() => onFollow?.(user.id)}>
              Accept
            </Button>
            <Button variant="outline" onClick={() => onUnfollow?.(user.id)}>
              Decline
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex space-x-2">
            <Button variant="primary" onClick={() => onFollow?.(user.id)}>
              <Icon name="person-add" className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
            <Button variant="outline" onClick={() => onMessage?.(user.id)}>
              <Icon name="chatbubble" className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        );
    }
  };

  return (
    <div
      className={`
      bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
      rounded-lg overflow-hidden shadow-sm
      ${className}
    `}
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
        )}

        {/* Edit Cover Button for own profile */}
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors">
            <Icon name="camera" className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-end justify-between -mt-16 mb-4">
          <div className="relative">
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="xl"
              isOnline={user.isOnline}
              className="ring-4 ring-white dark:ring-gray-900"
            />
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                <Icon name="camera" className="w-3 h-3" />
              </button>
            )}
          </div>

          {!isOwnProfile && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onReport?.(user.id)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="More options"
              >
                <Icon name="ellipsis-horizontal" className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Name and Username */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            {user.isVerified && (
              <Icon name="checkmark-circle" className="w-6 h-6 text-blue-500" />
            )}
            {user.badges &&
              user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${badge.color}`}
                  title={badge.name}
                >
                  <Icon name={badge.icon} className="w-4 h-4 text-white" />
                </div>
              ))}
          </div>

          {user.username && (
            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {showMore || user.bio.length <= 150
                ? user.bio
                : `${user.bio.substring(0, 150)}...`}
              {user.bio.length > 150 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="space-y-2 mb-4">
          {user.location && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Icon name="location" className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}

          {user.website && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Icon name="link" className="w-4 h-4" />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Icon name="calendar" className="w-4 h-4" />
            <span>Joined {formatJoinDate(user.joinDate)}</span>
          </div>

          {user.mutualFriendsCount &&
            user.mutualFriendsCount > 0 &&
            !isOwnProfile && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Icon name="people" className="w-4 h-4" />
                <span>{user.mutualFriendsCount} mutual friends</span>
              </div>
            )}
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 mb-6 py-4 border-t border-b border-gray-200 dark:border-gray-700">
          <button className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(user.postCount)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Posts
            </div>
          </button>

          <button className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(user.followerCount)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Followers
            </div>
          </button>

          <button className="text-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(user.followingCount)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Following
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">{getActionButton()}</div>

        {/* Privacy Notice */}
        {user.isPrivate &&
          !isOwnProfile &&
          user.relationshipStatus !== "friend" && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Icon name="lock-closed" className="w-4 h-4" />
                <span className="text-sm">
                  This account is private. Follow to see their posts.
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
