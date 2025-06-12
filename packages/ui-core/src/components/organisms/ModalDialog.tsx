import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { CloseButton } from '../atoms/CloseButton';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface ModalDialogProps {
  /**
   * Modal visibility
   */
  isOpen: boolean;
  onClose: () => void;
  /**
   * Modal content
   */
  title?: string;
  children?: React.ReactNode;
  /**
   * Header content
   */
  headerContent?: React.ReactNode;
  showHeader?: boolean;
  showCloseButton?: boolean;
  headerIcon?: string;
  /**
   * Footer content and actions
   */
  footerContent?: React.ReactNode;
  showFooter?: boolean;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    isLoading?: boolean;
    isDisabled?: boolean;
    icon?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    isDisabled?: boolean;
    icon?: string;
  };
  additionalActions?: Array<{
    id: string;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    isDisabled?: boolean;
    icon?: string;
  }>;
  /**
   * Modal behavior
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'sidebar' | 'fullscreen' | 'drawer';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  /**
   * Interaction behavior
   */
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  preventBodyScroll?: boolean;
  /**
   * Loading and states
   */
  isLoading?: boolean;
  loadingText?: string;
  /**
   * Appearance
   */
  theme?: 'light' | 'dark' | 'auto';
  hasBackdrop?: boolean;
  backdropBlur?: boolean;
  /**
   * Animation
   */
  animationType?: 'fade' | 'slide' | 'scale' | 'none';
  animationDuration?: number;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  ariaDescribedBy?: string;
  initialFocus?: 'first' | 'close' | 'primary' | 'none';
  returnFocus?: boolean;
  /**
   * Mobile behavior
   */
  isMobile?: boolean;
  mobileFullscreen?: boolean;
  /**
   * Event handlers
   */
  onOpen?: () => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
  onBackdropClick?: () => void;
  onEscapeKey?: () => void;
  /**
   * Customization
   */
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  backdropClassName?: string;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  headerContent,
  showHeader = true,
  showCloseButton = true,
  headerIcon,
  footerContent,
  showFooter = true,
  primaryAction,
  secondaryAction,
  additionalActions = [],
  size = 'md',
  variant = 'default',
  position = 'center',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  preventBodyScroll = true,
  isLoading = false,
  loadingText = 'Loading...',
  theme = 'light',
  hasBackdrop = true,
  backdropBlur = true,
  animationType = 'fade',
  animationDuration = 300,
  ariaLabel,
  ariaDescribedBy,
  initialFocus = 'first',
  returnFocus = true,
  isMobile = false,
  mobileFullscreen = false,
  onOpen,
  onAfterOpen,
  onAfterClose,
  onBackdropClick,
  onEscapeKey,
  className = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
  backdropClassName = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle modal open/close with animation
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      if (returnFocus) {
        previousActiveElement.current = document.activeElement as HTMLElement;
      }

      setIsVisible(true);
      setIsAnimating(true);
      onOpen?.();

      // Prevent body scroll
      if (preventBodyScroll) {
        document.body.style.overflow = 'hidden';
      }

      // Animation complete callback
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAfterOpen?.();

        // Focus management
        if (initialFocus === 'first') {
          const firstFocusable = modalRef.current?.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          firstFocusable?.focus();
        } else if (initialFocus === 'close') {
          modalRef.current?.querySelector('[data-close-button]')?.focus();
        } else if (initialFocus === 'primary' && primaryAction) {
          modalRef.current?.querySelector('[data-primary-action]')?.focus();
        }
      }, animationDuration);

      return () => clearTimeout(timer);
    } else if (isVisible) {
      setIsAnimating(true);

      // Animation complete callback
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        onAfterClose?.();

        // Restore body scroll
        if (preventBodyScroll) {
          document.body.style.overflow = '';
        }

        // Return focus
        if (returnFocus && previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    animationDuration,
    preventBodyScroll,
    returnFocus,
    initialFocus,
    primaryAction,
    onOpen,
    onAfterOpen,
    onAfterClose,
  ]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscapeKey?.();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose, onEscapeKey]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onBackdropClick?.();
      onClose();
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    onClose();
  };

  // Focus trap
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  };

  // Don't render if not visible
  if (!isVisible && !isOpen) {
    return null;
  }

  const modalClasses = [
    'modal-dialog',
    `modal-dialog--${variant}`,
    `modal-dialog--${size}`,
    `modal-dialog--${position}`,
    `modal-dialog--${theme}`,
    `modal-dialog--${animationType}`,
    isOpen && 'modal-dialog--open',
    isAnimating && 'modal-dialog--animating',
    isMobile && 'modal-dialog--mobile',
    mobileFullscreen && 'modal-dialog--mobile-fullscreen',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = ['modal-dialog__content', contentClassName].filter(Boolean).join(' ');

  const backdropClasses = [
    'modal-dialog__backdrop',
    backdropBlur && 'modal-dialog__backdrop--blur',
    backdropClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={modalClasses} style={{ animationDuration: `${animationDuration}ms` }}>
      {/* Backdrop */}
      {hasBackdrop && (
        <div className={backdropClasses} onClick={handleBackdropClick} aria-hidden="true" />
      )}

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={contentClasses}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        aria-describedby={ariaDescribedBy}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="modal-dialog__loading-overlay">
            <LoadingSpinner size="lg" />
            {loadingText && <span className="modal-dialog__loading-text">{loadingText}</span>}
          </div>
        )}

        {/* Header */}
        {showHeader && (title || headerContent || showCloseButton) && (
          <div className={['modal-dialog__header', headerClassName].filter(Boolean).join(' ')}>
            {headerContent || (
              <>
                <div className="modal-dialog__title-section">
                  {headerIcon && (
                    <Icon name={headerIcon} size="md" className="modal-dialog__title-icon" />
                  )}
                  {title && <h2 className="modal-dialog__title">{title}</h2>}
                </div>

                {showCloseButton && (
                  <CloseButton
                    onClick={handleCloseClick}
                    size="md"
                    variant="ghost"
                    className="modal-dialog__close-button"
                    data-close-button="true"
                    aria-label="Close modal"
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal-dialog__body">{children}</div>

        {/* Footer */}
        {showFooter &&
          (footerContent || primaryAction || secondaryAction || additionalActions.length > 0) && (
            <div className={['modal-dialog__footer', footerClassName].filter(Boolean).join(' ')}>
              {footerContent || (
                <>
                  <div className="modal-dialog__actions">
                    {/* Additional Actions */}
                    {additionalActions.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant || 'secondary'}
                        onClick={action.onClick}
                        disabled={action.isDisabled}
                        className="modal-dialog__action"
                      >
                        {action.icon && <Icon name={action.icon} size="sm" />}
                        {action.label}
                      </Button>
                    ))}

                    {/* Secondary Action */}
                    {secondaryAction && (
                      <Button
                        variant={secondaryAction.variant || 'secondary'}
                        onClick={secondaryAction.onClick}
                        disabled={secondaryAction.isDisabled}
                        className="modal-dialog__action modal-dialog__action--secondary"
                      >
                        {secondaryAction.icon && <Icon name={secondaryAction.icon} size="sm" />}
                        {secondaryAction.label}
                      </Button>
                    )}

                    {/* Primary Action */}
                    {primaryAction && (
                      <Button
                        variant={primaryAction.variant || 'primary'}
                        onClick={primaryAction.onClick}
                        disabled={primaryAction.isDisabled}
                        isLoading={primaryAction.isLoading}
                        className="modal-dialog__action modal-dialog__action--primary"
                        data-primary-action="true"
                      >
                        {primaryAction.icon && <Icon name={primaryAction.icon} size="sm" />}
                        {primaryAction.label}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default ModalDialog;
