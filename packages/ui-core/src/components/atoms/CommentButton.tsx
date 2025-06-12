import React from 'react';
import { Icon } from './Icon';

export interface CommentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
  variant?: 'minimal' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  loading?: boolean;
  onCountClick?: () => void;
}

/**
 * CommentButton component for social interactions
 * Displays comment count and handles comment actions
 */
export const CommentButton: React.FC<CommentButtonProps> = ({
  count = 0,
  variant = 'minimal',
  size = 'md',
  showCount = true,
  loading = false,
  onCountClick,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = [
    'comment-button',
    `comment-button-${variant}`,
    `comment-button-${size}`,
    loading && 'comment-button-loading',
    disabled && 'comment-button-disabled',
  ].filter(Boolean);

  const handleCountClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCountClick?.();
  };

  const formatCount = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getIcon = () => {
    if (loading) {
      return <Icon name="loader" className="comment-button-spinner animate-spin" />;
    }
    return <Icon name="message-circle" className="comment-button-icon" />;
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`${baseClasses.join(' ')} ${className}`}
      aria-label={`Comment on this post${count > 0 ? ` (${count} comments)` : ''}`}
      {...props}
    >
      <span className="comment-button-content">
        {getIcon()}

        {showCount && count > 0 && (
          <span
            className="comment-button-count"
            onClick={onCountClick ? handleCountClick : undefined}
          >
            {formatCount(count)}
          </span>
        )}
      </span>
    </button>
  );
};

export type { CommentButtonProps };
