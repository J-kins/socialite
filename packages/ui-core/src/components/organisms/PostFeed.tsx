import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface PostAuthor {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  isVerified?: boolean;
  isOnline?: boolean;
}

export interface PostMedia {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface PostReaction {
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  count: number;
  isActive?: boolean;
}

export interface PostComment {
  id: string;
  author: PostAuthor;
  content: string;
  timestamp: Date;
  replies?: PostComment[];
  reactions?: PostReaction[];
}

export interface Post {
  id: string;
  author: PostAuthor;
  content: string;
  media?: PostMedia[];
  timestamp: Date;
  reactions: PostReaction[];
  comments: PostComment[];
  shares: number;
  isBookmarked?: boolean;
  isFollowing?: boolean;
  isSponsored?: boolean;
  category?: string;
  tags?: string[];
  location?: string;
  privacy: 'public' | 'friends' | 'private';
  metadata?: Record<string, any>;
}

export interface PostFeedProps {
  /**
   * Posts to display
   */
  posts: Post[];
  /**
   * Loading state
   */
  isLoading?: boolean;
  hasMore?: boolean;
  /**
   * Feed behavior
   */
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  layout?: 'single' | 'masonry' | 'grid';
  autoRefresh?: boolean;
  refreshInterval?: number;
  /**
   * Infinite scroll
   */
  enableInfiniteScroll?: boolean;
  loadMoreThreshold?: number;
  onLoadMore?: () => void;
  /**
   * Post interactions
   */
  onPostLike?: (postId: string, reactionType: string) => void;
  onPostShare?: (postId: string) => void;
  onPostBookmark?: (postId: string) => void;
  onPostComment?: (postId: string, comment: string) => void;
  onPostFollow?: (authorId: string) => void;
  onPostReport?: (postId: string, reason: string) => void;
  onPostHide?: (postId: string) => void;
  /**
   * Media handling
   */
  onMediaClick?: (media: PostMedia, post: Post) => void;
  enableMediaPreview?: boolean;
  enableVideoAutoplay?: boolean;
  /**
   * Filtering and sorting
   */
  enableFiltering?: boolean;
  availableFilters?: string[];
  sortBy?: 'latest' | 'popular' | 'oldest';
  onFilterChange?: (filters: string[]) => void;
  onSortChange?: (sortBy: string) => void;
  /**
   * User preferences
   */
  showReactionCounts?: boolean;
  showTimestamps?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  enableDarkMode?: boolean;
  /**
   * Real-time updates
   */
  enableRealTime?: boolean;
  onNewPost?: (post: Post) => void;
  onPostUpdate?: (postId: string, updates: Partial<Post>) => void;
  /**
   * Empty state
   */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  /**
   * Custom rendering
   */
  renderPost?: (post: Post) => React.ReactNode;
  renderPostHeader?: (post: Post) => React.ReactNode;
  renderPostContent?: (post: Post) => React.ReactNode;
  renderPostActions?: (post: Post) => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  /**
   * Customization
   */
  className?: string;
}

export const PostFeed: React.FC<PostFeedProps> = ({
  posts = [],
  isLoading = false,
  hasMore = false,
  variant = 'default',
  layout = 'single',
  autoRefresh = false,
  refreshInterval = 30000,
  enableInfiniteScroll = true,
  loadMoreThreshold = 300,
  onLoadMore,
  onPostLike,
  onPostShare,
  onPostBookmark,
  onPostComment,
  onPostFollow,
  onPostReport,
  onPostHide,
  onMediaClick,
  enableMediaPreview = true,
  enableVideoAutoplay = false,
  enableFiltering = false,
  availableFilters = [],
  sortBy = 'latest',
  onFilterChange,
  onSortChange,
  showReactionCounts = true,
  showTimestamps = true,
  showCategories = true,
  showTags = true,
  enableDarkMode = false,
  enableRealTime = false,
  onNewPost,
  onPostUpdate,
  emptyTitle = 'No posts yet',
  emptyDescription = 'Be the first to share something!',
  emptyAction,
  renderPost,
  renderPostHeader,
  renderPostContent,
  renderPostActions,
  renderEmptyState,
  ariaLabel = 'Post feed',
  className = '',
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const feedRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up intersection observer for infinite scroll and visibility tracking
  useEffect(() => {
    if (!enableInfiniteScroll && !enableRealTime) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.getAttribute('data-post-id');
          if (!postId) return;

          if (entry.isIntersecting) {
            setVisiblePosts((prev) => new Set(prev).add(postId));

            // Trigger load more if near bottom
            if (enableInfiniteScroll && entry.target === feedRef.current?.lastElementChild) {
              const scrollPercent =
                (window.scrollY + window.innerHeight) / document.body.offsetHeight;
              if (scrollPercent > 0.8 && hasMore && onLoadMore) {
                onLoadMore();
              }
            }
          } else {
            setVisiblePosts((prev) => {
              const newSet = new Set(prev);
              newSet.delete(postId);
              return newSet;
            });
          }
        });
      },
      {
        rootMargin: `${loadMoreThreshold}px`,
        threshold: 0.1,
      }
    );

    // Observe all post elements
    const postElements = feedRef.current?.querySelectorAll('[data-post-id]');
    postElements?.forEach((element) => observer.observe(element));

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [enableInfiniteScroll, enableRealTime, loadMoreThreshold, hasMore, onLoadMore]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    refreshIntervalRef.current = setInterval(() => {
      // Trigger refresh logic here
      console.log('Auto refreshing feed...');
    }, refreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filter: string) => {
      setSelectedFilters((prev) => {
        const newFilters = prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter];
        onFilterChange?.(newFilters);
        return newFilters;
      });
    },
    [onFilterChange]
  );

  // Handle reactions
  const handleReaction = useCallback(
    (postId: string, reactionType: string) => {
      onPostLike?.(postId, reactionType);
    },
    [onPostLike]
  );

  // Handle comment submission
  const handleCommentSubmit = useCallback(
    (postId: string) => {
      const comment = commentInputs[postId];
      if (comment?.trim()) {
        onPostComment?.(postId, comment.trim());
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    },
    [commentInputs, onPostComment]
  );

  // Handle comment input change
  const handleCommentInputChange = useCallback((postId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  }, []);

  // Toggle comments visibility
  const toggleComments = useCallback((postId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  // Format relative time
  const formatRelativeTime = useCallback((date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  }, []);

  // Render post media
  const renderPostMedia = useCallback(
    (media: PostMedia[], post: Post) => {
      if (!media || media.length === 0) return null;

      const mediaClasses = [
        'post-feed__media',
        `post-feed__media--count-${media.length}`,
        media.length > 1 && 'post-feed__media--grid',
      ]
        .filter(Boolean)
        .join(' ');

      return (
        <div className={mediaClasses}>
          {media.map((item, index) => (
            <div
              key={item.id}
              className="post-feed__media-item"
              onClick={() => onMediaClick?.(item, post)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.type}: ${item.alt || `Media ${index + 1}`}`}
            >
              {item.type === 'image' && (
                <img
                  src={item.url}
                  alt={item.alt || `Image ${index + 1}`}
                  loading="lazy"
                  style={{
                    aspectRatio:
                      item.width && item.height ? `${item.width}/${item.height}` : '16/9',
                  }}
                />
              )}

              {item.type === 'video' && (
                <video
                  src={item.url}
                  poster={item.thumbnail}
                  controls
                  autoPlay={enableVideoAutoplay}
                  muted={enableVideoAutoplay}
                  style={{
                    aspectRatio:
                      item.width && item.height ? `${item.width}/${item.height}` : '16/9',
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {item.type === 'gif' && (
                <img
                  src={item.url}
                  alt={item.alt || `GIF ${index + 1}`}
                  loading="lazy"
                  style={{
                    aspectRatio:
                      item.width && item.height ? `${item.width}/${item.height}` : '16/9',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      );
    },
    [onMediaClick, enableVideoAutoplay]
  );

  // Render post reactions
  const renderPostReactions = useCallback(
    (reactions: PostReaction[], postId: string) => {
      if (!reactions || reactions.length === 0) return null;

      return (
        <div className="post-feed__reactions">
          {reactions.map((reaction) => (
            <Button
              key={reaction.type}
              variant={reaction.isActive ? 'primary' : 'ghost'}
              size="sm"
              className="post-feed__reaction"
              onClick={() => handleReaction(postId, reaction.type)}
            >
              <Icon name={reaction.type} size="sm" />
              {showReactionCounts && reaction.count > 0 && (
                <span className="post-feed__reaction-count">{reaction.count}</span>
              )}
            </Button>
          ))}
        </div>
      );
    },
    [handleReaction, showReactionCounts]
  );

  // Render individual post
  const renderPostItem = useCallback(
    (post: Post) => {
      if (renderPost) {
        return renderPost(post);
      }

      const isCommentsExpanded = expandedComments.has(post.id);
      const commentInput = commentInputs[post.id] || '';

      const postClasses = [
        'post-feed__item',
        `post-feed__item--${variant}`,
        post.isSponsored && 'post-feed__item--sponsored',
        `post-feed__item--privacy-${post.privacy}`,
      ]
        .filter(Boolean)
        .join(' ');

      return (
        <article
          key={post.id}
          className={postClasses}
          data-post-id={post.id}
          aria-labelledby={`post-title-${post.id}`}
        >
          {/* Post Header */}
          <header className="post-feed__header">
            {renderPostHeader ? (
              renderPostHeader(post)
            ) : (
              <>
                <div className="post-feed__author">
                  <Avatar
                    src={post.author.avatar}
                    alt={post.author.name}
                    name={post.author.name}
                    size="md"
                    showOnlineStatus={post.author.isOnline}
                    className="post-feed__author-avatar"
                  />

                  <div className="post-feed__author-info">
                    <div className="post-feed__author-name">
                      <span>{post.author.name}</span>
                      {post.author.isVerified && (
                        <Icon name="check-circle" size="sm" className="post-feed__verified-badge" />
                      )}
                    </div>

                    {post.author.username && (
                      <div className="post-feed__author-username">@{post.author.username}</div>
                    )}

                    <div className="post-feed__meta">
                      {showTimestamps && (
                        <time className="post-feed__timestamp">
                          {formatRelativeTime(post.timestamp)}
                        </time>
                      )}

                      {post.location && (
                        <span className="post-feed__location">
                          <Icon name="map-pin" size="xs" />
                          {post.location}
                        </span>
                      )}

                      <Icon name={post.privacy} size="xs" className="post-feed__privacy" />
                    </div>
                  </div>
                </div>

                <div className="post-feed__header-actions">
                  {!post.isFollowing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPostFollow?.(post.author.id)}
                    >
                      Follow
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="post-feed__menu-button"
                    aria-label="Post options"
                  >
                    <Icon name="more-horizontal" size="sm" />
                  </Button>
                </div>
              </>
            )}
          </header>

          {/* Post Content */}
          <div className="post-feed__content">
            {renderPostContent ? (
              renderPostContent(post)
            ) : (
              <>
                {post.content && (
                  <div className="post-feed__text" id={`post-title-${post.id}`}>
                    {post.content}
                  </div>
                )}

                {post.media && renderPostMedia(post.media, post)}

                {/* Category and Tags */}
                {(showCategories && post.category) || (showTags && post.tags) ? (
                  <div className="post-feed__metadata">
                    {showCategories && post.category && (
                      <Badge variant="secondary" className="post-feed__category">
                        {post.category}
                      </Badge>
                    )}

                    {showTags && post.tags && post.tags.length > 0 && (
                      <div className="post-feed__tags">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="post-feed__tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Post Actions */}
          <footer className="post-feed__footer">
            {renderPostActions ? (
              renderPostActions(post)
            ) : (
              <>
                {/* Reactions */}
                {renderPostReactions(post.reactions, post.id)}

                {/* Action Buttons */}
                <div className="post-feed__actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComments(post.id)}
                    className="post-feed__action"
                  >
                    <Icon name="message-circle" size="sm" />
                    {post.comments.length > 0 && (
                      <span className="post-feed__action-count">{post.comments.length}</span>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPostShare?.(post.id)}
                    className="post-feed__action"
                  >
                    <Icon name="share" size="sm" />
                    {post.shares > 0 && (
                      <span className="post-feed__action-count">{post.shares}</span>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPostBookmark?.(post.id)}
                    className={`post-feed__action ${post.isBookmarked ? 'post-feed__action--active' : ''}`}
                  >
                    <Icon name={post.isBookmarked ? 'bookmark-check' : 'bookmark'} size="sm" />
                  </Button>
                </div>
              </>
            )}
          </footer>

          {/* Comments Section */}
          {isCommentsExpanded && (
            <div className="post-feed__comments">
              {/* Comment Input */}
              <div className="post-feed__comment-input">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInput}
                  onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                  className="post-feed__comment-field"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleCommentSubmit(post.id)}
                  disabled={!commentInput.trim()}
                >
                  Post
                </Button>
              </div>

              {/* Comments List */}
              <div className="post-feed__comments-list">
                {post.comments.slice(0, 3).map((comment) => (
                  <div key={comment.id} className="post-feed__comment">
                    <Avatar
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      name={comment.author.name}
                      size="sm"
                    />
                    <div className="post-feed__comment-content">
                      <div className="post-feed__comment-author">{comment.author.name}</div>
                      <div className="post-feed__comment-text">{comment.content}</div>
                      <div className="post-feed__comment-meta">
                        <time>{formatRelativeTime(comment.timestamp)}</time>
                      </div>
                    </div>
                  </div>
                ))}

                {post.comments.length > 3 && (
                  <Button variant="ghost" size="sm" className="post-feed__view-more-comments">
                    View all {post.comments.length} comments
                  </Button>
                )}
              </div>
            </div>
          )}
        </article>
      );
    },
    [
      variant,
      expandedComments,
      commentInputs,
      renderPost,
      renderPostHeader,
      renderPostContent,
      renderPostActions,
      formatRelativeTime,
      showTimestamps,
      showCategories,
      showTags,
      onPostFollow,
      renderPostMedia,
      renderPostReactions,
      toggleComments,
      onPostShare,
      onPostBookmark,
      handleCommentInputChange,
      handleCommentSubmit,
    ]
  );

  const feedClasses = [
    'post-feed',
    `post-feed--${variant}`,
    `post-feed--${layout}`,
    enableDarkMode && 'post-feed--dark',
    isLoading && 'post-feed--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={feedClasses} role="feed" aria-label={ariaLabel}>
      {/* Filters */}
      {enableFiltering && availableFilters.length > 0 && (
        <div className="post-feed__filters">
          <div className="post-feed__filter-buttons">
            {availableFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilters.includes(filter) ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleFilterChange(filter)}
                className="post-feed__filter"
              >
                {filter}
              </Button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="post-feed__sort"
            aria-label="Sort posts by"
          >
            <option value="latest">Latest</option>
            <option value="popular">Popular</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      )}

      {/* Posts */}
      <div ref={feedRef} className="post-feed__posts">
        {posts.length > 0 ? (
          posts.map(renderPostItem)
        ) : !isLoading ? (
          <div className="post-feed__empty">
            {renderEmptyState ? (
              renderEmptyState()
            ) : (
              <>
                <Icon name="edit" size="xl" className="post-feed__empty-icon" />
                <h3 className="post-feed__empty-title">{emptyTitle}</h3>
                <p className="post-feed__empty-description">{emptyDescription}</p>
                {emptyAction && <div className="post-feed__empty-action">{emptyAction}</div>}
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="post-feed__loading">
          <LoadingSpinner size="lg" />
          <p>Loading posts...</p>
        </div>
      )}

      {/* Load More Button */}
      {!enableInfiniteScroll && hasMore && (
        <div className="post-feed__load-more">
          <Button variant="secondary" size="lg" onClick={onLoadMore} disabled={isLoading}>
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
