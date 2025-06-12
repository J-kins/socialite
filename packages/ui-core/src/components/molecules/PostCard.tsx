import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Text,
  PostText,
  PostImage,
  PostVideo,
  LikeButton,
  CommentButton,
  ShareButton,
} from '../atoms';
import { AvatarWithName } from './AvatarWithName';

export interface PostAuthor {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  verified?: boolean;
  badges?: Array<{ type: string; label: string }>;
}

export interface PostMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface PostCardProps {
  id: string;
  author: PostAuthor;
  content?: string;
  media?: PostMedia[];
  timestamp: string | Date;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  showActions?: boolean;
  showComments?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onAuthorClick?: (author: PostAuthor) => void;
  onPostClick?: () => void;
  className?: string;
}

/**
 * PostCard component for displaying social media posts
 * Supports text, images, videos, and interactive actions
 */
export const PostCard: React.FC<PostCardProps> = ({
  id,
  author,
  content,
  media = [],
  timestamp,
  likes = 0,
  comments = 0,
  shares = 0,
  isLiked = false,
  isBookmarked = false,
  variant = 'default',
  size = 'md',
  showActions = true,
  showComments = false,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onAuthorClick,
  onPostClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  const baseClasses = [
    'post-card',
    `post-card-${variant}`,
    `post-card-${size}`,
    onPostClick && 'post-card-clickable',
  ].filter(Boolean);

  const formatTimestamp = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;

    return date.toLocaleDateString();
  };

  const handleAuthorClick = () => {
    onAuthorClick?.(author);
  };

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't trigger post click if clicking on interactive elements
    if ((e.target as HTMLElement).closest('.post-card-actions, .post-card-author')) {
      return;
    }
    onPostClick?.();
  };

  const renderAuthor = () => (
    <div className="post-card-author">
      <AvatarWithName
        src={author.avatar}
        name={author.name}
        subtitle={`@${author.username} · ${formatTimestamp(timestamp)}`}
        size={size === 'lg' ? 'md' : 'sm'}
        showStatus={false}
        onClick={handleAuthorClick}
        className="post-card-author-info"
      />

      {author.verified && (
        <Badge variant="soft" size="sm" className="post-card-verified-badge">
          ✓
        </Badge>
      )}

      {author.badges?.map((badge, index) => (
        <Badge
          key={index}
          variant="soft"
          size="sm"
          className={`post-card-badge post-card-badge-${badge.type}`}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  );

  const renderContent = () => {
    if (!content) return null;

    return (
      <div className="post-card-content">
        <PostText
          content={content}
          variant="normal"
          size={size === 'lg' ? 'md' : 'sm'}
          expandable={content.length > 200}
          linkify
          highlightMentions
          highlightHashtags
        />
      </div>
    );
  };

  const renderMedia = () => {
    if (media.length === 0) return null;

    const renderSingleMedia = (item: PostMedia, index: number) => {
      if (item.type === 'image') {
        return (
          <PostImage
            key={index}
            src={item.url}
            alt={item.alt || `Image ${index + 1}`}
            variant="single"
            aspectRatio="auto"
            fit="cover"
            showZoom
            onError={() => setImageError((prev) => ({ ...prev, [item.url]: true }))}
            className="post-card-media-item"
          />
        );
      }

      if (item.type === 'video') {
        return (
          <PostVideo
            key={index}
            src={item.url}
            poster={item.thumbnail}
            variant="inline"
            aspectRatio="video"
            showControls
            muted
            className="post-card-media-item"
          />
        );
      }

      return null;
    };

    return (
      <div className="post-card-media">
        {media.length === 1 ? (
          <div className="post-card-media-single">{renderSingleMedia(media[0], 0)}</div>
        ) : (
          <div className={`post-card-media-grid post-card-media-grid-${Math.min(media.length, 4)}`}>
            {media.slice(0, 4).map((item, index) => (
              <div key={index} className="post-card-media-grid-item">
                {renderSingleMedia(item, index)}
                {index === 3 && media.length > 4 && (
                  <div className="post-card-media-more">+{media.length - 4}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderActions = () => {
    if (!showActions) return null;

    return (
      <div className="post-card-actions">
        <div className="post-card-action-group">
          <LikeButton
            liked={isLiked}
            count={likes}
            size={size === 'lg' ? 'md' : 'sm'}
            variant="minimal"
            onChange={onLike}
            showCount
            iconType="heart"
          />

          <CommentButton
            count={comments}
            size={size === 'lg' ? 'md' : 'sm'}
            variant="minimal"
            onClick={onComment}
            showCount
          />

          <ShareButton
            url={`/post/${id}`}
            title={`Post by ${author.name}`}
            text={content?.substring(0, 100)}
            size={size === 'lg' ? 'md' : 'sm'}
            variant="minimal"
            onShare={(platform, success) => {
              if (success) onShare?.();
            }}
          />
        </div>

        <div className="post-card-secondary-actions">
          <button
            type="button"
            onClick={onBookmark}
            className={`post-card-bookmark ${isBookmarked ? 'post-card-bookmark-active' : ''}`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          >
            <svg
              className="w-5 h-5"
              fill={isBookmarked ? 'currentColor' : 'none'}
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
          </button>
        </div>
      </div>
    );
  };

  return (
    <article
      className={`${baseClasses.join(' ')} ${className}`}
      onClick={onPostClick ? handlePostClick : undefined}
      role="article"
      aria-labelledby={`post-${id}-author`}
    >
      <div className="post-card-container">
        <div className="post-card-header">{renderAuthor()}</div>

        {renderContent()}
        {renderMedia()}

        {renderActions()}
      </div>
    </article>
  );
};

export type { PostCardProps, PostAuthor, PostMedia };
