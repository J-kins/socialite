import React, { useState } from "react";
import { MainLayout } from "./MainLayout";
import { UserProfile, PostCard, MediaGallery, FriendsList } from "../organisms";
import { Button, Icon, Badge } from "../atoms";
import type { MainLayoutProps } from "./MainLayout";
import type {
  UserProfileProps,
  PostCardProps,
  MediaGalleryProps,
  FriendsListProps,
} from "../organisms";

export interface ProfilePageProps extends Omit<MainLayoutProps, "children"> {
  profileUser: UserProfileProps["user"];
  currentUser?: UserProfileProps["currentUser"];
  posts?: PostCardProps["post"][];
  photos?: MediaGalleryProps["items"];
  friends?: FriendsListProps["friends"];
  mutualFriends?: FriendsListProps["friends"];
  isOwnProfile?: boolean;
  activeTab?: "posts" | "about" | "photos" | "friends" | "videos";
  onTabChange?: (tab: string) => void;
  onProfileInteraction?: {
    onFollow?: (userId: string) => void;
    onUnfollow?: (userId: string) => void;
    onMessage?: (userId: string) => void;
    onBlock?: (userId: string) => void;
    onReport?: (userId: string) => void;
    onEditProfile?: () => void;
  };
  onPostInteraction?: {
    onLike?: (postId: string) => void;
    onComment?: (postId: string) => void;
    onShare?: (postId: string) => void;
    onSave?: (postId: string) => void;
  };
  className?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profileUser,
  currentUser,
  posts = [],
  photos = [],
  friends = [],
  mutualFriends = [],
  isOwnProfile = false,
  activeTab = "posts",
  onTabChange,
  onProfileInteraction = {},
  onPostInteraction = {},
  className = "",
  ...layoutProps
}) => {
  const [showAllFriends, setShowAllFriends] = useState(false);

  const tabs = [
    { id: "posts", label: "Posts", count: posts.length, icon: "document-text" },
    { id: "about", label: "About", icon: "information-circle" },
    {
      id: "photos",
      label: "Photos",
      count: photos.filter((p) => p.type === "image").length,
      icon: "images",
    },
    { id: "friends", label: "Friends", count: friends.length, icon: "people" },
    {
      id: "videos",
      label: "Videos",
      count: photos.filter((p) => p.type === "video").length,
      icon: "videocam",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
                <Icon
                  name="document-text"
                  className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {isOwnProfile
                    ? "You haven't shared any posts yet. Share your first post to get started!"
                    : `${profileUser.name} hasn't shared any posts yet.`}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={onPostInteraction.onLike}
                  onComment={onPostInteraction.onComment}
                  onShare={onPostInteraction.onShare}
                  onSave={onPostInteraction.onSave}
                />
              ))
            )}
          </div>
        );

      case "about":
        return (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              About {profileUser.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Basic Information
                </h4>
                <div className="space-y-3">
                  {profileUser.bio && (
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">
                        Bio
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white mt-1">
                        {profileUser.bio}
                      </dd>
                    </div>
                  )}

                  {profileUser.location && (
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">
                        Location
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white mt-1 flex items-center">
                        <Icon name="location" className="w-4 h-4 mr-1" />
                        {profileUser.location}
                      </dd>
                    </div>
                  )}

                  {profileUser.website && (
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">
                        Website
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white mt-1">
                        <a
                          href={profileUser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                        >
                          <Icon name="link" className="w-4 h-4 mr-1" />
                          {profileUser.website.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">
                      Joined
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white mt-1 flex items-center">
                      <Icon name="calendar" className="w-4 h-4 mr-1" />
                      {new Date(profileUser.joinDate).toLocaleDateString([], {
                        year: "numeric",
                        month: "long",
                      })}
                    </dd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Activity
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Posts
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {profileUser.postCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Followers
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {profileUser.followerCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Following
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {profileUser.followingCount}
                    </span>
                  </div>
                </div>

                {profileUser.badges && profileUser.badges.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Badges
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${badge.color}`}
                          title={badge.name}
                        >
                          <Icon name={badge.icon} className="w-4 h-4" />
                          <span>{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "photos":
        return (
          <MediaGallery
            items={photos.filter((p) => p.type === "image")}
            viewMode="grid"
            allowDownload={true}
            allowDelete={isOwnProfile}
            allowUpload={isOwnProfile}
          />
        );

      case "videos":
        return (
          <MediaGallery
            items={photos.filter((p) => p.type === "video")}
            viewMode="grid"
            allowDownload={true}
            allowDelete={isOwnProfile}
            allowUpload={isOwnProfile}
          />
        );

      case "friends":
        return (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            {/* Mutual Friends (if not own profile) */}
            {!isOwnProfile && mutualFriends.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Mutual Friends ({mutualFriends.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mutualFriends.slice(0, 8).map((friend) => (
                    <div key={friend.id} className="text-center">
                      <button className="w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-16 h-16 rounded-full mx-auto mb-2"
                        />
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {friend.name}
                        </h4>
                        {friend.mutualFriendsCount && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {friend.mutualFriendsCount} mutual
                          </p>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                {mutualFriends.length > 8 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllFriends(true)}
                    >
                      See all mutual friends
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* All Friends */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {isOwnProfile
                  ? "Your Friends"
                  : `${profileUser.name}'s Friends`}{" "}
                ({friends.length})
              </h3>

              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <Icon
                    name="people"
                    className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                  />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No friends yet
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    {isOwnProfile
                      ? "Start connecting with people to build your network!"
                      : `${profileUser.name} hasn't connected with anyone yet.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {friends
                    .slice(0, showAllFriends ? friends.length : 12)
                    .map((friend) => (
                      <div key={friend.id} className="text-center">
                        <button className="w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                          <div className="relative inline-block">
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-16 h-16 rounded-full mx-auto mb-2"
                            />
                            {friend.isOnline && (
                              <div className="absolute bottom-2 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {friend.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {friend.isOnline ? "Online" : "Offline"}
                          </p>
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {friends.length > 12 && !showAllFriends && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllFriends(true)}
                  >
                    See all friends
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout {...layoutProps} className={className}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Profile Header */}
        <div className="mb-6">
          <UserProfile
            user={profileUser}
            currentUser={currentUser}
            isOwnProfile={isOwnProfile}
            onFollow={onProfileInteraction.onFollow}
            onUnfollow={onProfileInteraction.onUnfollow}
            onMessage={onProfileInteraction.onMessage}
            onBlock={onProfileInteraction.onBlock}
            onReport={onProfileInteraction.onReport}
            onEditProfile={onProfileInteraction.onEditProfile}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }
                  `}
                >
                  <Icon name={tab.icon} className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <Badge variant="secondary" size="sm">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </MainLayout>
  );
};
