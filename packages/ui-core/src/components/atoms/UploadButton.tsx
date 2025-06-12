import React, { useRef } from 'react';
import { Icon } from './Icon';

export interface UploadButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
  uploadText?: string;
  uploadingText?: string;
  onFileSelect?: (files: FileList | null) => void;
  onError?: (error: string) => void;
}

/**
 * UploadButton component - A button that triggers file upload
 * Combines button styling with file input functionality
 */
export const UploadButton: React.FC<UploadButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  accept,
  multiple = false,
  maxSize,
  allowedTypes,
  uploadText,
  uploadingText = 'Uploading...',
  onFileSelect,
  onError,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const baseClasses = [
    'upload-button',
    `upload-button-${variant}`,
    `upload-button-${size}`,
    loading && 'upload-button-loading',
    disabled && 'upload-button-disabled',
  ].filter(Boolean);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // Validate each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validationError = validateFile(file);

        if (validationError) {
          onError?.(validationError);
          return;
        }
      }
    }

    onFileSelect?.(files);

    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !loading) {
      inputRef.current?.click();
    }
  };

  const getDisplayText = () => {
    if (loading) {
      return uploadingText;
    }

    if (uploadText) {
      return uploadText;
    }

    if (children) {
      return children;
    }

    return `Upload ${multiple ? 'Files' : 'File'}`;
  };

  const getIcon = () => {
    if (loading) {
      return <Icon name="loader" className="upload-button-spinner animate-spin" />;
    }

    if (icon) {
      return icon;
    }

    return <Icon name="upload" className="upload-button-icon" />;
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className={`${baseClasses.join(' ')} ${className}`}
        aria-label={loading ? uploadingText : `Upload ${multiple ? 'files' : 'file'}`}
        {...props}
      >
        <span className="upload-button-content">
          {getIcon()}
          <span className="upload-button-text">{getDisplayText()}</span>
        </span>

        {loading && (
          <div className="upload-button-progress">
            <div className="upload-button-progress-bar" />
          </div>
        )}
      </button>
    </>
  );
};

export type { UploadButtonProps };
