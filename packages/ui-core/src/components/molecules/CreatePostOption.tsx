import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../utils/hooks/types/component-props';

export interface CreatePostOptionProps extends BaseComponentProps {
  /** Option type */
  type: 'text' | 'photo' | 'video' | 'poll' | 'live' | 'event' | 'article' | 'story';
  /** Option title */
  title: string;
  /** Option description */
  description?: string;
  /** Option icon */
  icon?: React.ReactNode;
  /** Whether the option is active/selected */
  active?: boolean;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Badge content */
  badge?: React.ReactNode;
  /** Badge variant */
  badgeVariant?: 'new' | 'pro' | 'default';
  /** Click handler */
  onClick?: () => void;
  /** Layout variant */
  variant?: 'horizontal' | 'grid' | 'compact';
  /** Whether to show hover effects */
  hoverable?: boolean;
  /** Loading state */
  loading?: boolean;
}

export const CreatePostOption = forwardRef<HTMLButtonElement, CreatePostOptionProps>(
  (
    {
      type,
      title,
      description,
      icon,
      active = false,
      disabled = false,
      badge,
      badgeVariant = 'default',
      onClick,
      variant = 'horizontal',
      hoverable = true,
      loading = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'create-post-option';

    const classes = [
      baseClasses,
      `create-post-option--${type}`,
      variant !== 'horizontal' && `create-post-option--${variant}`,
      active && 'create-post-option--active',
      disabled && 'create-post-option--disabled',
      loading && 'create-post-option--loading',
      !hoverable && 'create-post-option--no-hover',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const getDefaultIcon = () => {
      const iconProps = { className: 'create-post-option__icon' };

      switch (type) {
        case 'text':
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="14,2 14,8 20,8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="16"
                y1="13"
                x2="8"
                y2="13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="16"
                y1="17"
                x2="8"
                y2="17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="10,9 9,9 8,9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case 'photo':
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" />
              <polyline
                points="21,15 16,10 5,21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case 'video':
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon
                points="23 7 16 12 23 17 23 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="1"
                y="5"
                width="15"
                height="14"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          );
        case 'poll':
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line
                x1="18"
                y1="20"
                x2="18"
                y2="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="20"
                x2="12"
                y2="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="6"
                y1="20"
                x2="6"
                y2="14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case 'live':
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
              <path
                d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M20.07 16.93a10 10 0 0 1 0-9.86M3.93 7.07a10 10 0 0 1 0 9.86"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case 'event':
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case 'article':
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="7"
                x2="16"
                y2="7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="11"
                x2="16"
                y2="11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          );
        case 'story':
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="2"
                y="3"
                width="20"
                height="14"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="21"
                x2="16"
                y2="21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="17"
                x2="12"
                y2="21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
          );
        default:
          return (
            <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
      }
    };

    const handleClick = () => {
      if (disabled || loading) return;
      onClick?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && !disabled && !loading) {
        event.preventDefault();
        onClick?.();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        aria-pressed={active}
        aria-label={`Create ${type} post: ${title}`}
        {...props}
      >
        {loading ? (
          <svg
            className="create-post-option__icon animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 32;16 16;0 32;0 32"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-16;-32;-32"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        ) : (
          icon || getDefaultIcon()
        )}

        <div className="create-post-option__content">
          <div className="create-post-option__title">{title}</div>
          {description && variant !== 'compact' && (
            <div className="create-post-option__description">{description}</div>
          )}
        </div>

        {badge && (
          <span
            className={`create-post-option__badge ${
              badgeVariant !== 'default' ? `create-post-option__badge--${badgeVariant}` : ''
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  }
);

CreatePostOption.displayName = 'CreatePostOption';

export default CreatePostOption;
