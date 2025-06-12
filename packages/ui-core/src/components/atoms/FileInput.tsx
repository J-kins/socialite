import React, { useRef, useState } from 'react';
import { Icon } from './Icon';

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variant?: 'default' | 'dropzone' | 'button' | 'avatar';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  label?: string;
  description?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
  preview?: boolean;
  error?: string;
  onFileSelect?: (files: FileList | null) => void;
  onError?: (error: string) => void;
}

/**
 * FileInput component for file upload functionality
 * Supports multiple variants including dropzone, button, and avatar styles
 */
export const FileInput: React.FC<FileInputProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  label,
  description,
  maxSize,
  allowedTypes,
  multiple = false,
  preview = false,
  error,
  onFileSelect,
  onError,
  className = '',
  disabled,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const baseClasses = [
    'file-input',
    `file-input-${variant}`,
    `file-input-${size}`,
    isDragOver && 'file-input-drag-over',
    error && 'file-input-error',
    disabled && 'file-input-disabled',
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
      const file = files[0];
      const validationError = validateFile(file);

      if (validationError) {
        onError?.(validationError);
        return;
      }

      // Create preview for images
      if (preview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }

    onFileSelect?.(files);
  };

  const handleDragEvents = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent) => {
    handleDragEvents(event);
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    handleDragEvents(event);
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    handleDragEvents(event);
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files && inputRef.current) {
      inputRef.current.files = files;
      handleFileChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const renderDefaultInput = () => (
    <div className={`${baseClasses.join(' ')} ${className}`}>
      {label && (
        <label className="file-input-label">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="file-input-wrapper">
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileChange}
          className="file-input-element"
          {...props}
        />

        {icon && <div className="file-input-icon">{icon}</div>}

        <div className="file-input-text">Choose file{multiple ? 's' : ''}</div>
      </div>

      {description && <p className="file-input-description">{description}</p>}

      {error && <p className="file-input-error-text">{error}</p>}
    </div>
  );

  const renderDropzone = () => (
    <div className={`${baseClasses.join(' ')} ${className}`}>
      {label && (
        <label className="file-input-label">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className="file-input-dropzone"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Upload files by clicking or dragging"
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
          {...props}
        />

        <div className="file-input-dropzone-content">
          {icon || <Icon name="upload" className="w-12 h-12 text-gray-400 mb-4" />}

          <div className="file-input-dropzone-text">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Drop files here or click to browse
            </p>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>

        {previewUrl && (
          <div className="file-input-preview">
            <img src={previewUrl} alt="Preview" className="file-input-preview-image" />
          </div>
        )}
      </div>

      {error && <p className="file-input-error-text">{error}</p>}
    </div>
  );

  const renderButton = () => (
    <div className={`${baseClasses.join(' ')} ${className}`}>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
        {...props}
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="file-input-button"
        aria-label={label || 'Upload file'}
      >
        {icon && <span className="file-input-button-icon">{icon}</span>}
        <span className="file-input-button-text">
          {label || `Upload file${multiple ? 's' : ''}`}
        </span>
      </button>

      {description && <p className="file-input-description">{description}</p>}

      {error && <p className="file-input-error-text">{error}</p>}
    </div>
  );

  const renderAvatar = () => (
    <div className={`${baseClasses.join(' ')} ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
        {...props}
      />

      <div
        className="file-input-avatar"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Upload avatar image"
      >
        <div className="file-input-avatar-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar preview" className="file-input-avatar-image" />
          ) : (
            <div className="file-input-avatar-placeholder">
              {icon || <Icon name="user" className="w-8 h-8 text-gray-400" />}
            </div>
          )}
        </div>

        <div className="file-input-avatar-overlay">
          <Icon name="camera" className="w-4 h-4 text-white" />
        </div>
      </div>

      {error && <p className="file-input-error-text">{error}</p>}
    </div>
  );

  switch (variant) {
    case 'dropzone':
      return renderDropzone();
    case 'button':
      return renderButton();
    case 'avatar':
      return renderAvatar();
    default:
      return renderDefaultInput();
  }
};

export type { FileInputProps };
