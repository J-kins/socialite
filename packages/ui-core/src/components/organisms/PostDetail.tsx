import React, { useState, useCallback, useRef } from 'react';
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
  followerCount?: number;
  bio?: string;
  location?: string;
}

export interface PostMedia {
  id: string;
  type: 'image' | 'video' | 'gif' | 'document';
  url: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
  duration?: number; // for videos
  size?: number; // for documents
}

export interface PostReaction {
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  count: number;
  isActive?: boolean;
  users?: PostAuthor[]; // Users who reacted
}

export interface PostComment {
  id: string;
  author: PostAuthor;
  content: string;
  timestamp: Date;
  replies?: PostComment[];
  reactions?: PostReaction[];
  isEdited?: boolean;
  isPinned?: boolean;
  parentId?: string;
}

export interface Post {
  id: string;
  author: PostAuthor;
  content: string;
  media?: PostMedia[];
  timestamp: Date;
  editedAt?: Date;
  reactions: PostReaction[];
  comments: PostComment[];
  shares: number;
  views: number;
  isBookmarked?: boolean;
  isFollowing?: boolean;
  isSponsored?: boolean;
  category?: string;
  tags?: string[];
  location?: string;
  privacy: 'public' | 'friends' | 'private';
  allowComments?: boolean;
  allowSharing?: boolean;
  isPinned?: boolean;
  metadata?: Record<string, any>;
}

export interface PostDetailProps {
  /**
   * Post to display
   */
  post: Post;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * UI customization
   */
  variant?: 'default' | 'modal' | 'page' | 'sidebar';
  showAuthorInfo?: boolean;
  showFullMedia?: boolean;
  showAllComments?: boolean;
  showReactionDetails?: boolean;
  enableCommentReplies?: boolean;
  /**
   * Interaction handlers
   */
  onPostLike?: (postId: string, reactionType: string) => void;
  onPostShare?: (postId: string) => void;
  onPostBookmark?: (postId: string) => void;
  onPostComment?: (postId: string, comment: string, parentId?: string) => void;
  onPostFollow?: (authorId: string) => void;
  onPostReport?: (postId: string, reason: string) => void;
  onPostEdit?: (postId: string) => void;
  onPostDelete?: (postId: string) => void;
  /**
   * Comment interactions
   */
  onCommentLike?: (commentId: string, reactionType: string) => void;
  onCommentReply?: (commentId: string, reply: string) => void;
  onCommentEdit?: (commentId: string, content: string) => void;
  onCommentDelete?: (commentId: string) => void;
  onCommentPin?: (commentId: string) => void;
  /**
   * Media handling
   */
  onMediaClick?: (media: PostMedia, index: number) => void;
  enableMediaDownload?: boolean;
  onMediaDownload?: (media: PostMedia) => void;
  /**
   * User permissions
   */
  currentUserId?: string;
  canEditPost?: boolean;
  canDeletePost?: boolean;
  canModerateComments?: boolean;
  /**
   * Close handler for modal variant
   */
  onClose?: () => void;
  /**
   * Navigation
   */
  onNavigateToProfile?: (userId: string) => void;
  onNavigateToPost?: (postId: string) => void;
  /**
   * Custom rendering
   */
  renderPostHeader?: (post: Post) => React.ReactNode;
  renderPostContent?: (post: Post) => React.ReactNode;
  renderPostActions?: (post: Post) => React.ReactNode;
  renderComment?: (comment: PostComment, depth: number) => React.ReactNode;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  /**
   * Customization
   */
  className?: string;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  isLoading = false,
  variant = 'default',
  showAuthorInfo = true,
  showFullMedia = true,
  showAllComments = true,
  showReactionDetails = true,
  enableCommentReplies = true,
  onPostLike,
  onPostShare,
  onPostBookmark,
  onPostComment,
  onPostFollow,
  onPostReport,
  onPostEdit,
  onPostDelete,
  onCommentLike,
  onCommentReply,
  onCommentEdit,
  onCommentDelete,
  onCommentPin,
  onMediaClick,
  enableMediaDownload = false,
  onMediaDownload,
  currentUserId,
  canEditPost = false,
  canDeletePost = false,
  canModerateComments = false,
  onClose,
  onNavigateToProfile,
  onNavigateToPost,
  renderPostHeader,
  renderPostContent,
  renderPostActions,
  renderComment,
  ariaLabel = 'Post details',
  className = '',
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [selectedReactionType, setSelectedReactionType] = useState<string>('');

  const contentRef = useRef<HTMLDivElement>(null);

  // Format relative time
  const formatRelativeTime = useCallback((date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  // Format number count
  const formatCount = useCallback((count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }, []);

  // Handle reactions
  const handleReaction = useCallback(
    (reactionType: string) => {
      onPostLike?.(post.id, reactionType);
    },
    [onPostLike, post.id]
  );

  // Handle comment submission
  const handleCommentSubmit = useCallback(() => {
    if (commentInput.trim()) {
      onPostComment?.(post.id, commentInput.trim());
      setCommentInput('');
    }
  }, [commentInput, onPostComment, post.id]);

  // Handle reply submission
  const handleReplySubmit = useCallback(
    (commentId: string) => {
      const reply = replyInputs[commentId];
      if (reply?.trim()) {
        onCommentReply?.(commentId, reply.trim());
        setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
      }
    },
    [replyInputs, onCommentReply]
  );

  // Toggle comment expansion
  const toggleComment = useCallback((commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  // Toggle reply expansion
  const toggleReplies = useCallback((commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  // Handle reaction details
  const handleReactionDetails = useCallback((reactionType: string) => {
    setSelectedReactionType(reactionType);
    setShowReactionModal(true);
  }, []);

  // Render post media
  const renderPostMedia = useCallback(
    (media: PostMedia[], post: Post) => {
      if (!media || media.length === 0) return null;

      return (
        <div className="post-detail__media">
          {media.map((item, index) => (
            <div
              key={item.id}
              className="post-detail__media-item"
              onClick={() => onMediaClick?.(item, index)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.type}: ${item.alt || `Media ${index + 1}`}`}
            >
              {item.type === 'image' && (
                <img
                  src={item.url}
                  alt={item.alt || `Image ${index + 1}`}
                  style={{
                    aspectRatio:
                      item.width && item.height ? `${item.width}/${item.height}` : 'auto',
                  }}
                />
              )}

              {item.type === 'video' && (
                <video
                  src={item.url}
                  poster={item.thumbnail}
                  controls
                  style={{
                    aspectRatio:
                      item.width && item.height ? `${item.width}/${item.height}` : '16/9',
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {item.type === 'document' && (
                <div className="post-detail__document">
                  <Icon name="file" size="lg" />
                  <div className="post-detail__document-info">
                    <span className="post-detail__document-name">{item.alt || 'Document'}</span>
                    {item.size && (
                      <span className="post-detail__document-size">
                        {formatCount(item.size)} bytes
                      </span>
                    )}
                  </div>
                  {enableMediaDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMediaDownload?.(item);
                      }}
                      aria-label="Download document"
                    >
                      <Icon name="download" size="sm" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    },
    [onMediaClick, enableMediaDownload, onMediaDownload, formatCount]
  );

  // Render reactions
  const renderReactions = useCallback(() => {
    if (!post.reactions || post.reactions.length === 0) return null;

    const totalReactions = post.reactions.reduce((sum, r) => sum + r.count, 0);

    return (
      <div className="post-detail__reactions-section">
        <div className="post-detail__reaction-summary">
          <div className="post-detail__reaction-icons">
            {post.reactions.slice(0, 3).map((reaction) => (
              <Icon
                key={reaction.type}
                name={reaction.type}
                size="sm"
                className="post-detail__reaction-icon"
                onClick={() => showReactionDetails && handleReactionDetails(reaction.type)}
              />
            ))}
          </div>

          {showReactionDetails ? (
            <button
              className="post-detail__reaction-count"
              onClick={() => handleReactionDetails('all')}
            >
              {formatCount(totalReactions)} reactions
            </button>
          ) : (
            <span className="post-detail__reaction-count">
              {formatCount(totalReactions)} reactions
            </span>
          )}
        </div>

        <div className="post-detail__reaction-buttons">
          {post.reactions.map((reaction) => (
            <Button
              key={reaction.type}
              variant={reaction.isActive ? 'primary' : 'ghost'}
              size="sm"
              className="post-detail__reaction-button"
              onClick={() => handleReaction(reaction.type)}
            >
              <Icon name={reaction.type} size="sm" />
              <span>{reaction.type}</span>
              {reaction.count > 0 && (
                <span className="post-detail__reaction-button-count">
                  {formatCount(reaction.count)}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }, [post.reactions, showReactionDetails, handleReactionDetails, formatCount, handleReaction]);

  // Render individual comment
  const renderCommentItem = useCallback(
    (comment: PostComment, depth: number = 0) => {
      if (renderComment) {
        return renderComment(comment, depth);
      }

      const isExpanded = expandedComments.has(comment.id);
      const showReplies = expandedReplies.has(comment.id);
      const replyInput = replyInputs[comment.id] || '';
      const isOwner = currentUserId === comment.author.id;

      return (
        <div
          key={comment.id}
          className={`post-detail__comment post-detail__comment--depth-${depth}`}
        >
          {comment.isPinned && (
            <div className="post-detail__comment-pinned">
              <Icon name="pin" size="xs" />
              <span>Pinned comment</span>
            </div>
          )}

          <div className="post-detail__comment-main">
            <Avatar
              src={comment.author.avatar}
              alt={comment.author.name}
              name={comment.author.name}
              size="sm"
              showOnlineStatus={comment.author.isOnline}
              onClick={() => onNavigateToProfile?.(comment.author.id)}
            />

            <div className="post-detail__comment-content">
              <div className="post-detail__comment-header">
                <button
                  className="post-detail__comment-author"
                  onClick={() => onNavigateToProfile?.(comment.author.id)}
                >
                  {comment.author.name}
                  {comment.author.isVerified && (
                    <Icon name="check-circle" size="xs" className="post-detail__verified-badge" />
                  )}
                </button>

                <time className="post-detail__comment-time">
                  {formatRelativeTime(comment.timestamp)}
                  {comment.isEdited && <span className="post-detail__edited"> (edited)</span>}
                </time>
              </div>

              <div className="post-detail__comment-text">{comment.content}</div>

              <div className="post-detail__comment-actions">
                {comment.reactions && comment.reactions.length > 0 && (
                  <div className="post-detail__comment-reactions">
                    {comment.reactions.map((reaction) => (
                      <Button
                        key={reaction.type}
                        variant={reaction.isActive ? 'primary' : 'ghost'}
                        size="xs"
                        onClick={() => onCommentLike?.(comment.id, reaction.type)}
                      >
                        <Icon name={reaction.type} size="xs" />
                        {reaction.count > 0 && <span>{formatCount(reaction.count)}</span>}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="post-detail__comment-buttons">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onCommentLike?.(comment.id, 'like')}
                  >
                    Like
                  </Button>

                  {enableCommentReplies && depth < 3 && (
                    <Button variant="ghost" size="xs" onClick={() => toggleComment(comment.id)}>
                      Reply
                    </Button>
                  )}

                  {(isOwner || canModerateComments) && (
                    <>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onCommentEdit?.(comment.id, comment.content)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onCommentDelete?.(comment.id)}
                      >
                        Delete
                      </Button>

                      {canModerateComments && !comment.isPinned && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => onCommentPin?.(comment.id)}
                        >
                          Pin
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Reply Input */}
              {isExpanded && (
                <div className="post-detail__reply-input">
                  <input
                    type="text"
                    placeholder={`Reply to ${comment.author.name}...`}
                    value={replyInput}
                    onChange={(e) =>
                      setReplyInputs((prev) => ({ ...prev, [comment.id]: e.target.value }))
                    }
                    onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit(comment.id)}
                    className="post-detail__reply-field"
                  />
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={!replyInput.trim()}
                  >
                    Reply
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="post-detail__comment-replies">
              {!showReplies && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="post-detail__show-replies"
                  onClick={() => toggleReplies(comment.id)}
                >
                  <Icon name="corner-down-right" size="xs" />
                  Show {comment.replies.length} replies
                </Button>
              )}

              {showReplies && (
                <>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="post-detail__hide-replies"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    Hide replies
                  </Button>

                  {comment.replies.map((reply) => renderCommentItem(reply, depth + 1))}
                </>
              )}
            </div>
          )}
        </div>
      );
    },
    [
      renderComment,
      expandedComments,
      expandedReplies,
      replyInputs,
      currentUserId,
      formatRelativeTime,
      onNavigateToProfile,
      onCommentLike,
      enableCommentReplies,
      canModerateComments,
      onCommentEdit,
      onCommentDelete,
      onCommentPin,
      toggleComment,
      handleReplySubmit,
      toggleReplies,
      formatCount,
    ]
  );

  if (isLoading) {
    return (
      <div className="post-detail post-detail--loading">
        <LoadingSpinner size="lg" />
        <p>Loading post...</p>
      </div>
    );
  }

  const containerClasses = ['post-detail', `post-detail--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} aria-label={ariaLabel}>
      {/* Modal Header */}
      {variant === 'modal' && (
        <div className="post-detail__modal-header">
          <h2 className="post-detail__modal-title">Post Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close post details">
            <Icon name="close" size="md" />
          </Button>
        </div>
      )}

      <div ref={contentRef} className="post-detail__content">
        {/* Post Header */}
        <header className="post-detail__header">
          {renderPostHeader ? (
            renderPostHeader(post)
          ) : (
            <>
              {showAuthorInfo && (
                <div className="post-detail__author-section">
                  <div className="post-detail__author">
                    <Avatar
                      src={post.author.avatar}
                      alt={post.author.name}
                      name={post.author.name}
                      size="lg"
                      showOnlineStatus={post.author.isOnline}
                      onClick={() => onNavigateToProfile?.(post.author.id)}
                    />

                    <div className="post-detail__author-info">
                      <button
                        className="post-detail__author-name"
                        onClick={() => onNavigateToProfile?.(post.author.id)}
                      >
                        {post.author.name}
                        {post.author.isVerified && (
                          <Icon
                            name="check-circle"
                            size="sm"
                            className="post-detail__verified-badge"
                          />
                        )}
                      </button>

                      {post.author.username && (
                        <div className="post-detail__author-username">@{post.author.username}</div>
                      )}

                      {post.author.followerCount && (
                        <div className="post-detail__author-stats">
                          {formatCount(post.author.followerCount)} followers
                        </div>
                      )}

                      {post.author.bio && (
                        <div className="post-detail__author-bio">{post.author.bio}</div>
                      )}
                    </div>
                  </div>

                  {!post.isFollowing && currentUserId !== post.author.id && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onPostFollow?.(post.author.id)}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              )}

              <div className="post-detail__meta">
                <time className="post-detail__timestamp">
                  {formatRelativeTime(post.timestamp)}
                  {post.editedAt && <span className="post-detail__edited"> (edited)</span>}
                </time>

                {post.location && (
                  <span className="post-detail__location">
                    <Icon name="map-pin" size="sm" />
                    {post.location}
                  </span>
                )}

                <div className="post-detail__stats">
                  <span>{formatCount(post.views)} views</span>
                  <Icon name={post.privacy} size="sm" className="post-detail__privacy" />
                </div>

                {(canEditPost || canDeletePost) && (
                  <div className="post-detail__post-actions">
                    {canEditPost && (
                      <Button variant="ghost" size="sm" onClick={() => onPostEdit?.(post.id)}>
                        <Icon name="edit" size="sm" />
                        Edit
                      </Button>
                    )}

                    {canDeletePost && (
                      <Button variant="ghost" size="sm" onClick={() => onPostDelete?.(post.id)}>
                        <Icon name="trash" size="sm" />
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </header>

        {/* Post Content */}
        <div className="post-detail__post-content">
          {renderPostContent ? (
            renderPostContent(post)
          ) : (
            <>
              {post.content && <div className="post-detail__text">{post.content}</div>}

              {post.media && showFullMedia && renderPostMedia(post.media, post)}

              {/* Category and Tags */}
              {(post.category || (post.tags && post.tags.length > 0)) && (
                <div className="post-detail__metadata">
                  {post.category && (
                    <Badge variant="secondary" className="post-detail__category">
                      {post.category}
                    </Badge>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="post-detail__tags">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="post-detail__tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Reactions and Actions */}
        <div className="post-detail__interactions">
          {renderPostActions ? (
            renderPostActions(post)
          ) : (
            <>
              {renderReactions()}

              <div className="post-detail__action-buttons">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => onPostShare?.(post.id)}
                  disabled={!post.allowSharing}
                  className="post-detail__action"
                >
                  <Icon name="share" size="sm" />
                  Share
                  {post.shares > 0 && (
                    <span className="post-detail__action-count">{formatCount(post.shares)}</span>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => onPostBookmark?.(post.id)}
                  className={`post-detail__action ${post.isBookmarked ? 'post-detail__action--active' : ''}`}
                >
                  <Icon name={post.isBookmarked ? 'bookmark-check' : 'bookmark'} size="sm" />
                  {post.isBookmarked ? 'Saved' : 'Save'}
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => onPostReport?.(post.id, 'inappropriate')}
                  className="post-detail__action"
                >
                  <Icon name="flag" size="sm" />
                  Report
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Comments Section */}
        {post.allowComments && (
          <div className="post-detail__comments-section">
            <h3 className="post-detail__comments-title">
              Comments ({formatCount(post.comments.length)})
            </h3>

            {/* Comment Input */}
            <div className="post-detail__comment-input">
              <Avatar
                src="" // Current user avatar would go here
                alt="Your avatar"
                name="You"
                size="sm"
              />
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                className="post-detail__comment-field"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleCommentSubmit}
                disabled={!commentInput.trim()}
              >
                Post
              </Button>
            </div>

            {/* Comments List */}
            <div className="post-detail__comments-list">
              {showAllComments ? (
                post.comments.map((comment) => renderCommentItem(comment))
              ) : (
                <>
                  {post.comments.slice(0, 5).map((comment) => renderCommentItem(comment))}
                  {post.comments.length > 5 && (
                    <Button variant="ghost" size="md" className="post-detail__load-more-comments">
                      Load more comments ({post.comments.length - 5} remaining)
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
