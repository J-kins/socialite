import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';
import { MainContentPanel } from '../organisms/MainContentPanel';
import { PostFeed } from '../organisms/PostFeed';
import { CreatePost } from '../organisms/CreatePost';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Avatar } from '../atoms/Avatar';
import '../../../styles/templates/post-feed-page.css';

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  mediaFiles: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }>;
  timestamp: string;
  location?: string;
  tags: string[];
  mentions: string[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  userInteraction: {
    isLiked: boolean;
    isBookmarked: boolean;
    isFollowing: boolean;
  };
  visibility: 'public' | 'friends' | 'private';
  isSponsored?: boolean;
  isPinned?: boolean;
}

export interface PostFeedPageProps {
  currentUser?: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  feedType?: 'home' | 'following' | 'trending' | 'recent';
  posts?: Post[];
  onPostCreate?: (content: string, mediaFiles: File[]) => void;
  onPostLike?: (postId: string) => void;
  onPostShare?: (postId: string) => void;
  onPostBookmark?: (postId: string) => void;
  onPostComment?: (postId: string, comment: string) => void;
  onFollowUser?: (userId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const PostFeedPage: React.FC<PostFeedPageProps> = ({
  currentUser = {
    id: 'user-1',
    name: 'John Smith',
    avatar: '/assets/images/avatars/avatar-1.jpg',
    username: 'johnsmith',
  },
  feedType = 'home',
  posts = [],
  onPostCreate,
  onPostLike,
  onPostShare,
  onPostBookmark,
  onPostComment,
  onFollowUser,
  onLoadMore,
  hasMore = true,
  isLoading = false,
  className,
}) => {
  const [activeFilter, setActiveFilter] = useState(feedType);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  const handlePostCreate = useCallback(
    (content: string, mediaFiles: File[]) => {
      onPostCreate?.(content, mediaFiles);
      setShowCreatePost(false);
    },
    [onPostCreate]
  );

  const handlePostLike = useCallback(
    (postId: string) => {
      setFeedPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                stats: {
                  ...post.stats,
                  likes: post.userInteraction.isLiked ? post.stats.likes - 1 : post.stats.likes + 1,
                },
                userInteraction: {
                  ...post.userInteraction,
                  isLiked: !post.userInteraction.isLiked,
                },
              }
            : post
        )
      );
      onPostLike?.(postId);
    },
    [onPostLike]
  );

  const handlePostBookmark = useCallback(
    (postId: string) => {
      setFeedPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                userInteraction: {
                  ...post.userInteraction,
                  isBookmarked: !post.userInteraction.isBookmarked,
                },
              }
            : post
        )
      );
      onPostBookmark?.(postId);
    },
    [onPostBookmark]
  );

  const handleFollowUser = useCallback(
    (userId: string) => {
      setFeedPosts((prev) =>
        prev.map((post) =>
          post.author.id === userId
            ? {
                ...post,
                userInteraction: {
                  ...post.userInteraction,
                  isFollowing: !post.userInteraction.isFollowing,
                },
              }
            : post
        )
      );
      onFollowUser?.(userId);
    },
    [onFollowUser]
  );

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      await onLoadMore?.();
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, onLoadMore]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 43200) return `${Math.floor(diffInMinutes / 1440)}d`;
    return postTime.toLocaleDateString();
  };

  const feedFilters = [
    { key: 'home', label: 'Home', description: 'Posts from people you follow' },
    { key: 'following', label: 'Following', description: 'Recent posts from followed users' },
    { key: 'trending', label: 'Trending', description: 'Popular posts right now' },
    { key: 'recent', label: 'Recent', description: 'Latest posts from everyone' },
  ];

  return (
    <div className={`post-feed-page ${className || ''}`}>
      <Header />
      <Sidebar />

      <MainContentPanel className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Feed Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feed</h1>
              <Button
                variant="primary"
                onClick={() => setShowCreatePost(true)}
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Create Post</span>
              </Button>
            </div>

            {/* Feed Filters */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {feedFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={filter.description}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Create Post */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <Avatar src={currentUser.avatar} alt={currentUser.name} size="lg" />
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex-1 text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                What's on your mind, {currentUser.name}?
              </button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Photo/Video</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Feeling/Activity</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Check In</span>
                </button>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          {isLoading && feedPosts.length === 0 ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
                    </div>
                    <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : feedPosts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {activeFilter === 'home'
                  ? 'Follow some people to see their posts in your feed'
                  : 'Be the first to share something!'}
              </p>
              <Button variant="primary" onClick={() => setShowCreatePost(true)}>
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {feedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-6 pb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar src={post.author.avatar} alt={post.author.name} size="lg" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {post.author.name}
                          </h3>
                          {post.author.isVerified && (
                            <Badge variant="primary" size="sm">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Badge>
                          )}
                          {post.isSponsored && (
                            <Badge variant="warning" size="sm">
                              Sponsored
                            </Badge>
                          )}
                          {post.isPinned && (
                            <Badge variant="secondary" size="sm">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>@{post.author.username}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(post.timestamp)}</span>
                          {post.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{post.location}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!post.userInteraction.isFollowing && post.author.id !== currentUser.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFollowUser(post.author.id)}
                        >
                          Follow
                        </Button>
                      )}

                      <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Tags and Mentions */}
                    {(post.tags.length > 0 || post.mentions.length > 0) && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.map((tag, index) => (
                          <Badge key={`tag-${index}`} variant="primary" size="sm">
                            #{tag}
                          </Badge>
                        ))}
                        {post.mentions.map((mention, index) => (
                          <Badge key={`mention-${index}`} variant="secondary" size="sm">
                            @{mention}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media */}
                  {post.mediaFiles.length > 0 && (
                    <div className="pb-4">
                      <div
                        className={`grid gap-2 px-6 ${
                          post.mediaFiles.length === 1
                            ? 'grid-cols-1'
                            : post.mediaFiles.length === 2
                              ? 'grid-cols-2'
                              : 'grid-cols-2'
                        }`}
                      >
                        {post.mediaFiles.slice(0, 4).map((media, index) => (
                          <div
                            key={media.id}
                            className={`relative ${
                              post.mediaFiles.length === 3 && index === 0 ? 'row-span-2' : ''
                            }`}
                          >
                            {media.type === 'image' ? (
                              <img
                                src={media.url}
                                alt="Post media"
                                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                              />
                            ) : (
                              <div className="relative">
                                <video
                                  src={media.url}
                                  poster={media.thumbnail}
                                  className="w-full h-64 object-cover rounded-lg cursor-pointer"
                                  muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black/50 rounded-full p-3">
                                    <svg
                                      className="w-8 h-8 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            )}

                            {post.mediaFiles.length > 4 && index === 3 && (
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">
                                  +{post.mediaFiles.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>{formatNumber(post.stats.likes)} likes</span>
                        <span>{formatNumber(post.stats.comments)} comments</span>
                        <span>{formatNumber(post.stats.shares)} shares</span>
                        {post.stats.views && <span>{formatNumber(post.stats.views)} views</span>}
                      </div>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        <Button
                          variant={post.userInteraction.isLiked ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handlePostLike(post.id)}
                          className="flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          <span>Like</span>
                        </Button>

                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Comment</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPostShare?.(post.id)}
                          className="flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                          <span>Share</span>
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePostBookmark(post.id)}
                        className={post.userInteraction.isBookmarked ? 'text-yellow-600' : ''}
                      >
                        <svg
                          className="w-4 h-4"
                          fill={post.userInteraction.isBookmarked ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="text-center py-8">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="min-w-[120px]"
                  >
                    {loadingMore ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      'Load More Posts'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Create Post Modal */}
          {showCreatePost && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create Post
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => setShowCreatePost(false)}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
                <div className="p-6">
                  <CreatePost
                    user={currentUser}
                    onPost={handlePostCreate}
                    placeholder="What's happening?"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </MainContentPanel>
    </div>
  );
};

export type { PostFeedPageProps, Post };
