import React, { useState, useEffect } from 'react';
import { Icon, Button } from '../atoms';

export interface NotificationBannerProps {
  id?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  persistent?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number; // in milliseconds
  position?: 'top' | 'bottom';
  variant?: 'default' | 'minimal' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showCloseButton?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
  onClose?: () => void;
  onClick?: () => void;
  className?: string;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  id,
  type,
  title,
  message,
  persistent = false,
  autoClose = false,
  autoCloseDelay = 5000,
  position = 'top',
  variant = 'default',
  size = 'md',
  showIcon = true,
  showCloseButton = true,
  actions = [],
  onClose,
  onClick,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (autoClose && !persistent) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, persistent, autoCloseDelay]);

  const getTypeConfig = () => {
    const configs = {
      info: {
        icon: 'information-circle',
        colors: {
          default:
            'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
          minimal: 'text-blue-600 dark:text-blue-400',
          outlined: 'border-blue-500 text-blue-600 dark:text-blue-400',
          filled: 'bg-blue-500 text-white',
        },
      },
      success: {
        icon: 'checkmark-circle',
        colors: {
          default:
            'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
          minimal: 'text-green-600 dark:text-green-400',
          outlined: 'border-green-500 text-green-600 dark:text-green-400',
          filled: 'bg-green-500 text-white',
        },
      },
      warning: {
        icon: 'alert-triangle',
        colors: {
          default:
            'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
          minimal: 'text-yellow-600 dark:text-yellow-400',
          outlined: 'border-yellow-500 text-yellow-600 dark:text-yellow-400',
          filled: 'bg-yellow-500 text-white',
        },
      },
      error: {
        icon: 'alert-circle',
        colors: {
          default:
            'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
          minimal: 'text-red-600 dark:text-red-400',
          outlined: 'border-red-500 text-red-600 dark:text-red-400',
          filled: 'bg-red-500 text-white',
        },
      },
    };
    return configs[type];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: {
        padding: 'p-3',
        text: 'text-sm',
        icon: 'w-4 h-4',
        title: 'text-sm font-medium',
        spacing: 'space-x-2',
      },
      md: {
        padding: 'p-4',
        text: 'text-sm',
        icon: 'w-5 h-5',
        title: 'text-base font-medium',
        spacing: 'space-x-3',
      },
      lg: {
        padding: 'p-5',
        text: 'text-base',
        icon: 'w-6 h-6',
        title: 'text-lg font-medium',
        spacing: 'space-x-4',
      },
    };
    return sizes[size];
  };

  const getVariantClasses = () => {
    const typeConfig = getTypeConfig();
    const baseClasses = 'border rounded-lg shadow-sm';

    if (variant === 'minimal') {
      return `${typeConfig.colors.minimal}`;
    }

    if (variant === 'outlined') {
      return `${baseClasses} border-2 bg-white dark:bg-gray-800 ${typeConfig.colors.outlined}`;
    }

    if (variant === 'filled') {
      return `${baseClasses} border-transparent ${typeConfig.colors.filled}`;
    }

    // Default variant
    return `${baseClasses} ${typeConfig.colors.default}`;
  };

  const getPositionClasses = () => {
    const positions = {
      top: 'top-4',
      bottom: 'bottom-4',
    };
    return positions[position];
  };

  const handleClose = () => {
    if (!showCloseButton && !autoClose) return;

    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200); // Animation duration
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (!isVisible) return null;

  const typeConfig = getTypeConfig();
  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();
  const positionClasses = getPositionClasses();

  return (
    <div
      className={`
        ${variantClasses} ${sizeClasses.padding} ${className}
        ${isClosing ? 'notification-banner--closing' : 'notification-banner--entering'}
        transition-all duration-200 ease-in-out
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
      `}
      onClick={handleClick}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className={`flex items-start ${sizeClasses.spacing}`}>
        {/* Icon */}
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon
              name={typeConfig.icon}
              className={`${sizeClasses.icon} ${variant === 'filled' ? 'text-white' : ''}`}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <h3 className={`${sizeClasses.title} mb-1`}>{title}</h3>}
          <p className={`${sizeClasses.text} ${title ? '' : 'leading-5'}`}>{message}</p>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'ghost'}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className={
                    variant === 'filled' ? 'text-white border-white/30 hover:bg-white/20' : ''
                  }
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        {showCloseButton && (
          <div className="flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className={`
                ${variant === 'filled' ? 'text-white hover:bg-white/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                -mt-1 -mr-1
              `}
            >
              <Icon name="close" className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar for Auto Close */}
      {autoClose && !persistent && (
        <div className="mt-3 h-1 bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-current opacity-50 notification-banner__progress"
            style={{
              animation: `notification-progress ${autoCloseDelay}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
};
