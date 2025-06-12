import React from 'react';
import { Avatar, Badge } from '../atoms';

export interface UserMentionProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
    isOnline?: boolean;
    role?: 'admin' | 'moderator' | 'user';
  };
  variant?: 'inline' | 'card' | 'minimal' | 'pill';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showAvatar?: boolean;
  showRole?: boolean;
  showOnlineStatus?: boolean;
  onClick?: (userId: string) => void;
  onHover?: (userId: string) => void;
  className?: string;
}

export const UserMention: React.FC<UserMentionProps> = ({
  user,
  variant = 'inline',
  size = 'md',
  interactive = true,
  showAvatar = true,
  showRole = false,
  showOnlineStatus = false,
  onClick,
  onHover,
  className = '',
}) => {
  const getVariantClasses = () => {
    const variants = {
      inline: {
        container:
          'inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
        content: 'inline-flex items-center',
      },
      card: {
        container:
          'flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md',
        content: 'flex items-center space-x-3',
      },
      minimal: {
        container:
          'inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
        content: 'inline-flex items-center',
      },
      pill: {
        container:
          'inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50',
        content: 'inline-flex items-center',
      },
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: {
        text: 'text-xs',
        avatar: 'w-4 h-4',
        spacing: 'space-x-1',
      },
      sm: {
        text: 'text-sm',
        avatar: 'w-5 h-5',
        spacing: 'space-x-1',
      },
      md: {
        text: 'text-sm',
        avatar: 'w-6 h-6',
        spacing: 'space-x-2',
      },
      lg: {
        text: 'text-base',
        avatar: 'w-8 h-8',
        spacing: 'space-x-2',
      },
    };
    return sizes[size];
  };

  const getRoleColor = () => {
    const colors = {
      admin: 'text-red-500 dark:text-red-400',
      moderator: 'text-purple-500 dark:text-purple-400',
      user: 'text-gray-500 dark:text-gray-400',
    };
    return colors[user.role || 'user'];
  };

  const handleClick = () => {
    if (interactive && onClick) {
      onClick(user.id);
    }
  };

  const handleMouseEnter = () => {
    if (onHover) {
      onHover(user.id);
    }
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <span
      className={`
        ${variantClasses.container} ${sizeClasses.text} ${className}
        ${interactive ? 'cursor-pointer transition-colors duration-150' : ''}
        font-medium
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-user-id={user.id}
      data-mention="true"
    >
      <span className={`${variantClasses.content} ${sizeClasses.spacing}`}>
        {/* Avatar */}
        {showAvatar && variant !== 'minimal' && (
          <div className="relative flex-shrink-0">
            <Avatar
              src={user.avatar}
              alt={user.name}
              size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : size === 'md' ? 'sm' : 'md'}
              className={sizeClasses.avatar}
            />

            {/* Online Status */}
            {showOnlineStatus && user.isOnline && (
              <div
                className={`
                absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-800
                ${size === 'xs' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'}
              `}
              />
            )}
          </div>
        )}

        {/* Text Content */}
        <span className="flex items-center space-x-1">
          <span className="font-medium">@{user.username}</span>

          {/* Verified Badge */}
          {user.isVerified && (
            <span className="flex-shrink-0">
              <svg
                className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} text-blue-500`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}

          {/* Role Badge */}
          {showRole && user.role && user.role !== 'user' && (
            <Badge variant="secondary" size="sm" className={`${getRoleColor()} text-xs`}>
              {user.role}
            </Badge>
          )}
        </span>

        {/* Card variant additional info */}
        {variant === 'card' && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
          </div>
        )}
      </span>
    </span>
  );
};
