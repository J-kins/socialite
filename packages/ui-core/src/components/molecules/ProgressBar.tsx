import React from 'react';
import { Icon } from '../atoms';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  showPercentage = false,
  label,
  animated = false,
  striped = false,
  indeterminate = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getVariantClasses = () => {
    const variants = {
      default: {
        bg: 'bg-gray-200 dark:bg-gray-700',
        fill: 'bg-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
      },
      success: {
        bg: 'bg-gray-200 dark:bg-gray-700',
        fill: 'bg-green-500',
        text: 'text-green-600 dark:text-green-400',
      },
      warning: {
        bg: 'bg-gray-200 dark:bg-gray-700',
        fill: 'bg-yellow-500',
        text: 'text-yellow-600 dark:text-yellow-400',
      },
      error: {
        bg: 'bg-gray-200 dark:bg-gray-700',
        fill: 'bg-red-500',
        text: 'text-red-600 dark:text-red-400',
      },
      info: {
        bg: 'bg-gray-200 dark:bg-gray-700',
        fill: 'bg-cyan-500',
        text: 'text-cyan-600 dark:text-cyan-400',
      },
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: {
        height: 'h-1',
        text: 'text-xs',
        spacing: 'space-y-1',
      },
      sm: {
        height: 'h-2',
        text: 'text-sm',
        spacing: 'space-y-1',
      },
      md: {
        height: 'h-3',
        text: 'text-sm',
        spacing: 'space-y-2',
      },
      lg: {
        height: 'h-4',
        text: 'text-base',
        spacing: 'space-y-2',
      },
      xl: {
        height: 'h-6',
        text: 'text-lg',
        spacing: 'space-y-3',
      },
    };
    return sizes[size];
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <div className={`${sizeClasses.spacing} ${className}`}>
      {/* Label and Percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between">
          {showLabel && label && (
            <span className={`${sizeClasses.text} font-medium text-gray-700 dark:text-gray-300`}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={`${sizeClasses.text} font-medium ${variantClasses.text}`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div
        className={`
          relative ${sizeClasses.height} ${variantClasses.bg} rounded-full overflow-hidden
          ${animated ? 'transition-all duration-300 ease-out' : ''}
        `}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        {/* Progress Fill */}
        <div
          className={`
            ${sizeClasses.height} ${variantClasses.fill} rounded-full transition-all duration-300 ease-out
            ${striped ? 'progress-striped' : ''}
            ${animated && striped ? 'progress-animated' : ''}
            ${indeterminate ? 'progress-indeterminate' : ''}
          `}
          style={{
            width: indeterminate ? '100%' : `${percentage}%`,
            transform: indeterminate ? 'translateX(-100%)' : 'none',
          }}
        />

        {/* Shine Effect */}
        {animated && !indeterminate && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent progress-shine" />
        )}
      </div>

      {/* Status Icons */}
      {percentage === 100 && variant === 'success' && (
        <div className="flex items-center justify-center mt-2">
          <Icon name="checkmark-circle" className="w-5 h-5 text-green-500" />
        </div>
      )}

      {variant === 'error' && (
        <div className="flex items-center justify-center mt-2">
          <Icon name="alert-circle" className="w-5 h-5 text-red-500" />
        </div>
      )}
    </div>
  );
};
