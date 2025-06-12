import React, { forwardRef } from 'react';
import type { BaseComponentProps, Size } from '../../utils/hooks/types/component-props';

export interface TabItemProps extends BaseComponentProps {
  /** Whether the tab is active */
  active?: boolean;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Tab variant */
  variant?: 'underline' | 'pills' | 'buttons' | 'cards';
  /** Tab size */
  size?: Size;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Badge content */
  badge?: React.ReactNode;
  /** Close button callback */
  onClose?: () => void;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Loading state */
  loading?: boolean;
  /** Orientation for vertical tabs */
  orientation?: 'horizontal' | 'vertical';
  /** Tab value/identifier */
  value?: string;
}

export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  (
    {
      children,
      active = false,
      disabled = false,
      variant = 'underline',
      size = 'md',
      icon,
      badge,
      onClose,
      onClick,
      loading = false,
      orientation = 'horizontal',
      value,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'tab-item';

    const variantClasses = {
      underline: 'tab-item--underline',
      pills: 'tab-item--pills',
      buttons: 'tab-item--buttons',
      cards: 'tab-item--cards',
    };

    const sizeClasses = {
      xs: 'tab-item--xs',
      sm: 'tab-item--sm',
      md: 'tab-item--md',
      lg: 'tab-item--lg',
      xl: 'tab-item--xl',
      '2xl': 'tab-item--xl',
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      active && 'tab-item--active',
      disabled && 'tab-item--disabled',
      loading && 'tab-item--loading',
      orientation === 'vertical' && 'tab-item--vertical',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      onClick?.(event);
    };

    const handleCloseClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      onClose?.();
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={active}
        aria-disabled={disabled}
        tabIndex={active ? 0 : -1}
        data-value={value}
        className={classes}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <svg
            className="tab-item__spinner"
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
        )}

        {icon && (
          <span className={onClose ? 'tab-item__icon' : 'tab-item__icon--only'}>{icon}</span>
        )}

        {children && <span className="tab-item__text">{children}</span>}

        {badge && <span className="tab-item__badge">{badge}</span>}

        {onClose && (
          <button
            type="button"
            className="tab-item__close"
            onClick={handleCloseClick}
            aria-label="Close tab"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </button>
    );
  }
);

TabItem.displayName = 'TabItem';

export default TabItem;
