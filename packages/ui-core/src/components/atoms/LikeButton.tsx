import React, { useState } from 'react';
import { Icon } from './Icon';

export interface LikeButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  liked?: boolean;
  count?: number;
  variant?: 'minimal' | 'filled' | 'outlined' | 'animated';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  iconType?: 'heart' | 'thumbs-up' | 'star';
  loading?: boolean;
  onChange?: (liked: boolean) => void;
  onCountClick?: () => void;
}

/**
 * LikeButton component for social interactions
 * Supports different icons, animations, and like counting
 */
export const LikeButton: React.FC<LikeButtonProps> = ({
  liked = false,
  count = 0,
  variant = 'minimal',
  size = 'md',
  showCount = true,
  iconType = 'heart',
  loading = false,
  onChange,
  onCountClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const baseClasses = [
    'like-button',
    `like-button-${variant}`,
    `like-button-${size}`,
    `like-button-${iconType}`,
    liked && 'like-button-liked',
    loading && 'like-button-loading',
    disabled && 'like-button-disabled',
    isAnimating && 'like-button-animating',
  ].filter(Boolean);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Call onChange handler
    onChange?.(!liked);

    // Call original onClick if provided
    if (props.onClick) {
      props.onClick(event);
    }
  };

  const handleCountClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCountClick?.();
  };

  const getIcon = () => {
    if (loading) {
      return <Icon name="loader" className="like-button-spinner animate-spin" />;
    }

    switch (iconType) {
      case 'thumbs-up':
        return <Icon name="thumbs-up" className="like-button-icon" />;
      case 'star':
        return <Icon name="star" className="like-button-icon" />;
      case 'heart':
      default:
        return <Icon name="heart" className="like-button-icon" />;
    }
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

  return (
    <div className="like-button-container">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className={`${baseClasses.join(' ')} ${className}`}
        aria-label={`${liked ? 'Unlike' : 'Like'} this post`}
        aria-pressed={liked}
        {...props}
      >
        <span className="like-button-content">
          {getIcon()}

          {showCount && count > 0 && (
            <span
              className="like-button-count"
              onClick={onCountClick ? handleCountClick : undefined}
            >
              {formatCount(count)}
            </span>
          )}
        </span>

        {/* Animation elements */}
        {variant === 'animated' && (
          <>
            <span className="like-button-ripple" />
            <span className="like-button-particles" />
          </>
        )}
      </button>
    </div>
  );
};

export type { LikeButtonProps };
