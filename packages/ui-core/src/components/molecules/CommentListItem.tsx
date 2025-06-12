import React, { useState } from 'react';
import { Icon, Avatar, Button, Badge } from '../atoms';

export interface CommentListItemProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
    isVerified?: boolean;
    role?: 'admin' | 'moderator' | 'user';
  };
  content: string;
  timestamp: string;
  isEdited?: boolean;
  likes?: number;
  isLiked?: boolean;
  replies?: number;
  isPinned?: boolean;
  isReported?: boolean;
  isHighlighted?: boolean;
  level?: number; // for nested comments (0 = top level, 1 = reply, etc.)
  variant?: 'default' | 'compact' | 'highlighted' | 'minimal';
  showActions?: boolean;
  showReplies?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canReply?: boolean;
  onLike?: (id: string) => void;
  onReply?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
  onPin?: (id: string) => void;
  onShowReplies?: (id: string) => void;
  onAuthorClick?: (authorId: string) => void;
  className?: string;
}

export const CommentListItem: React.FC<CommentListItemProps> = ({
  id,
  author,
  content,
  timestamp,
  isEdited = false,
  likes = 0,
  isLiked = false,
  replies = 0,
  isPinned = false,
  isReported = false,
  isHighlighted = false,
  level = 0,
  variant = 'default',
  showActions = true,
  showReplies = true,
  canEdit = false,
  canDelete = false,
  canReply = true,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onReport,
  onPin,
  onShowReplies,
  onAuthorClick,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return time.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getVariantClasses = () => {
    const variants = {
      default: {
        container:
          'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        padding: 'p-4',
      },
      compact: {
        container: 'bg-gray-50 dark:bg-gray-800/50 rounded-md',
        padding: 'p-3',
      },
      highlighted: {
        container:
          'bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800',
        padding: 'p-4',
      },
      minimal: {
        container: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md',
        padding: 'p-2',
      },
    };
    return variants[variant];
  };

  const getRoleColor = () => {
    const colors = {
      admin: 'text-red-500',
      moderator: 'text-purple-500',
      user: 'text-gray-500',
    };
    return colors[author.role || 'user'];
  };

  const getIndentationStyle = () => {
    if (level === 0) return {};
    return {
      marginLeft: `${Math.min(level * 24, 96)}px`, // Max 4 levels of indentation
    };
  };

  const handleAuthorClick = () => {
    onAuthorClick?.(author.id);
  };

  const handleLike = () => {
    onLike?.(id);
  };

  const handleReply = () => {
    onReply?.(id);
  };

  const handleEdit = () => {
    onEdit?.(id);
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  const handleReport = () => {
    onReport?.(id);
  };

  const handlePin = () => {
    onPin?.(id);
  };

  const handleShowReplies = () => {
    onShowReplies?.(id);
  };

  const variantClasses = getVariantClasses();
  const shouldTruncate = content.length > 300;
  const displayContent = isExpanded
    ? content
    : shouldTruncate
      ? `${content.slice(0, 300)}...`
      : content;

  return (
    <div
      className={`
        ${variantClasses.container} ${className}
        ${isPinned ? 'ring-1 ring-yellow-300 dark:ring-yellow-600' : ''}
        ${isHighlighted ? 'ring-2 ring-blue-400' : ''}
        ${isReported ? 'opacity-60' : ''}
        transition-all duration-200 group
      `}
      style={getIndentationStyle()}
    >
      <div className={variantClasses.padding}>
        {/* Pinned Badge */}
        {isPinned && (
          <div className="flex items-center space-x-1 mb-2">
            <Icon name="push-pin" className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
              Pinned comment
            </span>
          </div>
        )}

        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar
              src={author.avatar}
              alt={author.name}
              size={variant === 'compact' || variant === 'minimal' ? 'sm' : 'md'}
              className="cursor-pointer"
              onClick={handleAuthorClick}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <button
                onClick={handleAuthorClick}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
              >
                {author.name}
              </button>

              {author.isVerified && (
                <Icon name="checkmark-circle" className="w-4 h-4 text-blue-500" />
              )}

              {author.role && author.role !== 'user' && (
                <Badge variant="secondary" size="sm" className={getRoleColor()}>
                  {author.role}
                </Badge>
              )}

              {author.username && (
                <span className="text-sm text-gray-500 dark:text-gray-400">@{author.username}</span>
              )}

              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>

              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(timestamp)}
              </span>

              {isEdited && (
                <span className="text-xs text-gray-400 dark:text-gray-500 italic">(edited)</span>
              )}

              {/* Menu Button */}
              {showActions && (canEdit || canDelete || onReport) && (
                <div className="relative ml-auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <Icon name="ellipsis-horizontal" className="w-4 h-4" />
                  </Button>

                  {showMenu && (
                    <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                      {canEdit && (
                        <button
                          onClick={() => {
                            handleEdit();
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg"
                        >
                          Edit
                        </button>
                      )}
                      {onPin && (
                        <button
                          onClick={() => {
                            handlePin();
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          {isPinned ? 'Unpin' : 'Pin'}
                        </button>
                      )}
                      {onReport && (
                        <button
                          onClick={() => {
                            handleReport();
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600"
                        >
                          Report
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            handleDelete();
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 rounded-b-lg"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment Content */}
            <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-2">
              <p className="whitespace-pre-wrap">{displayContent}</p>

              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-1 font-medium"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-4 text-sm">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`
                    flex items-center space-x-1 transition-colors duration-150
                    ${
                      isLiked
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                    }
                  `}
                >
                  <Icon name={isLiked ? 'heart' : 'heart-outline'} className="w-4 h-4" />
                  {likes > 0 && <span>{likes}</span>}
                </button>

                {/* Reply Button */}
                {canReply && (
                  <button
                    onClick={handleReply}
                    className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-150"
                  >
                    <Icon name="chatbubble-outline" className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                )}

                {/* Show Replies */}
                {showReplies && replies > 0 && (
                  <button
                    onClick={handleShowReplies}
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150 font-medium"
                  >
                    <Icon name="return-down-forward" className="w-4 h-4" />
                    <span>
                      {replies} {replies === 1 ? 'reply' : 'replies'}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />}
    </div>
  );
};
