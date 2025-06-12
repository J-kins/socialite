import React, { useState, useRef } from 'react';
import { Input, Button, Avatar } from '../atoms';

export interface CommentInputProps {
  placeholder?: string;
  maxLength?: number;
  userAvatar?: string;
  userName?: string;
  variant?: 'default' | 'compact' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showAvatar?: boolean;
  showCounter?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onSubmit?: (comment: string) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * CommentInput component for posting comments
 * Provides text input with avatar, character count, and action buttons
 */
export const CommentInput: React.FC<CommentInputProps> = ({
  placeholder = 'Write a comment...',
  maxLength = 500,
  userAvatar,
  userName = 'You',
  variant = 'default',
  size = 'md',
  showAvatar = true,
  showCounter = true,
  autoFocus = false,
  disabled = false,
  loading = false,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const baseClasses = [
    'comment-input',
    `comment-input-${variant}`,
    `comment-input-${size}`,
    isFocused && 'comment-input-focused',
    disabled && 'comment-input-disabled',
    loading && 'comment-input-loading',
  ].filter(Boolean);

  const handleSubmit = () => {
    if (comment.trim() && !disabled && !loading) {
      onSubmit?.(comment.trim());
      setComment('');
      textareaRef.current?.blur();
    }
  };

  const handleCancel = () => {
    setComment('');
    setIsFocused(false);
    onCancel?.();
    textareaRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setComment(value);
      adjustTextareaHeight();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!comment.trim()) {
      setIsFocused(false);
    }
  };

  const isSubmitDisabled = !comment.trim() || disabled || loading;
  const characterCount = comment.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <div className={`${baseClasses.join(' ')} ${className}`}>
      <div className="comment-input-container">
        {showAvatar && (
          <div className="comment-input-avatar">
            <Avatar
              src={userAvatar}
              alt={userName}
              size={size === 'lg' ? 'md' : 'sm'}
              fallback={userName.charAt(0).toUpperCase()}
            />
          </div>
        )}

        <div className="comment-input-content">
          <div className="comment-input-field-container">
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              className="comment-input-textarea"
              rows={1}
              style={{ resize: 'none', overflow: 'hidden' }}
            />

            {(isFocused || comment) && (
              <div className="comment-input-actions">
                <div className="comment-input-meta">
                  {showCounter && (
                    <span
                      className={`comment-input-counter ${isNearLimit ? 'comment-input-counter-warning' : ''}`}
                    >
                      {characterCount}/{maxLength}
                    </span>
                  )}
                </div>

                <div className="comment-input-buttons">
                  {(isFocused || comment) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={loading}
                      className="comment-input-cancel"
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    loading={loading}
                    className="comment-input-submit"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export type { CommentInputProps };
