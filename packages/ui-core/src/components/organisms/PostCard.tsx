import React, { useState } from "react";
import { Avatar, Button, Badge, Icon } from "../atoms";
import { AvatarWithName } from "../molecules";

export interface PostCardProps {
  post: {
    id: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      isVerified?: boolean;
    };
    content: string;
    images?: string[];
    video?: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;
    isSaved?: boolean;
    location?: string;
    feeling?: string;
    privacy: "public" | "friends" | "private";
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onUserClick?: (userId: string) => void;
  onPostClick?: (postId: string) => void;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  onUserClick,
  onPostClick,
  className = "",
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getPrivacyIcon = (privacy: string) => {
    const iconMap = {
      public: "globe",
      friends: "people",
      private: "lock-closed",
    };
    return iconMap[privacy as keyof typeof iconMap] || "globe";
  };

  const contentPreview =
    post.content.length > 300
      ? post.content.substring(0, 300) + "..."
      : post.content;

  return (
    <article
      className={`
      bg-white dark:bg-gray-900 
      border border-gray-200 dark:border-gray-700 
      rounded-lg shadow-sm hover:shadow-md transition-shadow
      ${className}
    `}
    >
      {/* Header */}
      <header className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <button onClick={() => onUserClick?.(post.author.id)}>
              <Avatar
                src={post.author.avatar}
                alt={post.author.name}
                size="md"
              />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUserClick?.(post.author.id)}
                  className="font-medium text-gray-900 dark:text-white hover:underline"
                >
                  {post.author.name}
                </button>
                {post.author.isVerified && (
                  <Icon
                    name="checkmark-circle"
                    className="w-4 h-4 text-blue-500"
                  />
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatTime(post.timestamp)}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Icon
                    name={getPrivacyIcon(post.privacy)}
                    className="w-3 h-3"
                  />
                  <span className="capitalize">{post.privacy}</span>
                </div>
                {post.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="location" className="w-3 h-3" />
                      <span>{post.location}</span>
                    </div>
                  </>
                )}
                {post.feeling && (
                  <>
                    <span>•</span>
                    <span>feeling {post.feeling}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* More Options */}
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="ellipsis-horizontal" className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 pb-3">
        <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
          {showFullContent || post.content.length <= 300
            ? post.content
            : contentPreview}
          {post.content.length > 300 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {showFullContent ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>

      {/* Media */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800">
            <img
              src={post.images[currentImageIndex]}
              alt={`Post image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onPostClick?.(post.id)}
            />
          </div>

          {post.images.length > 1 && (
            <>
              {/* Image Counter */}
              <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {post.images.length}
              </div>

              {/* Navigation */}
              {currentImageIndex > 0 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Icon name="chevron-back" className="w-5 h-5" />
                </button>
              )}

              {currentImageIndex < post.images.length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Icon name="chevron-forward" className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      )}

      {post.video && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800">
          <video
            src={post.video}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Engagement Stats */}
      {(post.likes > 0 || post.comments > 0 || post.shares > 0) && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            {post.likes > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                    <Icon name="thumbs-up" className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                    <Icon name="heart" className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span>{formatNumber(post.likes)}</span>
              </div>
            )}

            <div className="flex items-center space-x-4">
              {post.comments > 0 && (
                <span>{formatNumber(post.comments)} comments</span>
              )}
              {post.shares > 0 && (
                <span>{formatNumber(post.shares)} shares</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <footer className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onLike?.(post.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${
                  post.isLiked
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <Icon
                name={post.isLiked ? "thumbs-up" : "thumbs-up-outline"}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Like</span>
            </button>

            <button
              onClick={() => onComment?.(post.id)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="chatbubble-outline" className="w-5 h-5" />
              <span className="text-sm font-medium">Comment</span>
            </button>

            <button
              onClick={() => onShare?.(post.id)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="share-outline" className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          <button
            onClick={() => onSave?.(post.id)}
            className={`
              p-2 rounded-lg transition-colors
              ${
                post.isSaved
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            `}
          >
            <Icon
              name={post.isSaved ? "bookmark" : "bookmark-outline"}
              className="w-5 h-5"
            />
          </button>
        </div>
      </footer>
    </article>
  );
};
