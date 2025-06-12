import React from 'react';
import { Icon } from '../atoms';

export interface FormGroupProps {
  id: string;
  label?: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'inline' | 'floating' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  id,
  label,
  children,
  error,
  hint,
  required = false,
  disabled = false,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: {
        container: 'space-y-2',
        label: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
        content: '',
        error: 'text-sm text-red-600 dark:text-red-400',
        hint: 'text-sm text-gray-500 dark:text-gray-400',
      },
      inline: {
        container: 'flex items-center space-x-4',
        label: 'text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0',
        content: 'flex-1',
        error: 'text-sm text-red-600 dark:text-red-400',
        hint: 'text-sm text-gray-500 dark:text-gray-400',
      },
      floating: {
        container: 'relative',
        label:
          'absolute left-3 top-0 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-1/2 bg-white dark:bg-gray-800 px-1',
        content: '',
        error: 'text-sm text-red-600 dark:text-red-400 mt-1',
        hint: 'text-sm text-gray-500 dark:text-gray-400 mt-1',
      },
      compact: {
        container: 'space-y-1',
        label: 'block text-xs font-medium text-gray-600 dark:text-gray-400',
        content: '',
        error: 'text-xs text-red-600 dark:text-red-400',
        hint: 'text-xs text-gray-500 dark:text-gray-400',
      },
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: {
        spacing: 'space-y-1',
        text: 'text-xs',
      },
      md: {
        spacing: 'space-y-2',
        text: 'text-sm',
      },
      lg: {
        spacing: 'space-y-3',
        text: 'text-base',
      },
    };
    return sizes[size];
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <div
      className={`
        ${variantClasses.container} ${className}
        ${disabled ? 'opacity-60' : ''}
        ${error ? 'form-group--error' : ''}
      `}
    >
      {/* Label */}
      {label && variant !== 'floating' && (
        <label
          htmlFor={id}
          className={`
            ${variantClasses.label}
            ${required ? 'form-group__label--required' : ''}
            ${error ? 'text-red-700 dark:text-red-400' : ''}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Content */}
      <div className={`${variantClasses.content} relative`}>
        {variant === 'floating' && label && (
          <label
            htmlFor={id}
            className={`
              ${variantClasses.label}
              ${required ? 'form-group__label--required' : ''}
              ${error ? 'text-red-700 dark:text-red-400' : ''}
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {children}

        {/* Error Icon */}
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Icon name="alert-circle" className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>

      {/* Hint */}
      {hint && !error && <p className={variantClasses.hint}>{hint}</p>}

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-1">
          <Icon name="alert-circle" className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className={variantClasses.error}>{error}</p>
        </div>
      )}
    </div>
  );
};
