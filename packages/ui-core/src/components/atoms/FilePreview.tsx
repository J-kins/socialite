import React from 'react';
import { Icon } from './Icon';

export interface FilePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  file: File | { name: string; size: number; type: string; url?: string };
  variant?: 'card' | 'list' | 'grid' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showSize?: boolean;
  showType?: boolean;
  showRemove?: boolean;
  removable?: boolean;
  downloadable?: boolean;
  onRemove?: () => void;
  onDownload?: () => void;
  onPreview?: () => void;
}

/**
 * FilePreview component for displaying file information and preview
 * Supports different layouts and file types with appropriate icons
 */
export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  variant = 'card',
  size = 'md',
  showName = true,
  showSize = true,
  showType = false,
  showRemove = true,
  removable = true,
  downloadable = false,
  onRemove,
  onDownload,
  onPreview,
  className = '',
  ...props
}) => {
  const baseClasses = ['file-preview', `file-preview-${variant}`, `file-preview-${size}`];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Icon name="image" className="file-preview-type-icon file-preview-icon-image" />;
    }
    if (type.startsWith('video/')) {
      return <Icon name="video" className="file-preview-type-icon file-preview-icon-video" />;
    }
    if (type.startsWith('audio/')) {
      return <Icon name="music" className="file-preview-type-icon file-preview-icon-audio" />;
    }
    if (type === 'application/pdf') {
      return <Icon name="file-text" className="file-preview-type-icon file-preview-icon-pdf" />;
    }
    if (type.includes('word') || type.includes('document')) {
      return <Icon name="file-text" className="file-preview-type-icon file-preview-icon-doc" />;
    }
    if (type.includes('sheet') || type.includes('excel')) {
      return <Icon name="file-text" className="file-preview-type-icon file-preview-icon-excel" />;
    }
    if (type.includes('zip') || type.includes('rar') || type.includes('archive')) {
      return <Icon name="archive" className="file-preview-type-icon file-preview-icon-archive" />;
    }
    return <Icon name="file" className="file-preview-type-icon file-preview-icon-default" />;
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const isImageFile = (type: string): boolean => {
    return type.startsWith('image/');
  };

  const renderPreviewImage = () => {
    if (!isImageFile(file.type)) return null;

    const url =
      'url' in file && file.url
        ? file.url
        : file instanceof File
          ? URL.createObjectURL(file)
          : null;

    if (!url) return null;

    return (
      <div className="file-preview-image-container">
        <img src={url} alt={file.name} className="file-preview-image" onClick={onPreview} />
        {onPreview && (
          <div className="file-preview-image-overlay">
            <Icon name="eye" className="file-preview-preview-icon" />
          </div>
        )}
      </div>
    );
  };

  const renderActions = () => (
    <div className="file-preview-actions">
      {downloadable && onDownload && (
        <button
          type="button"
          onClick={onDownload}
          className="file-preview-action file-preview-download"
          aria-label="Download file"
        >
          <Icon name="download" className="file-preview-action-icon" />
        </button>
      )}

      {onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="file-preview-action file-preview-view"
          aria-label="Preview file"
        >
          <Icon name="eye" className="file-preview-action-icon" />
        </button>
      )}

      {removable && showRemove && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="file-preview-action file-preview-remove"
          aria-label="Remove file"
        >
          <Icon name="x" className="file-preview-action-icon" />
        </button>
      )}
    </div>
  );

  const renderFileInfo = () => (
    <div className="file-preview-info">
      {showName && (
        <div className="file-preview-name" title={file.name}>
          {file.name}
        </div>
      )}

      <div className="file-preview-meta">
        {showSize && <span className="file-preview-size">{formatFileSize(file.size)}</span>}

        {showType && <span className="file-preview-type">{getFileExtension(file.name)}</span>}
      </div>
    </div>
  );

  switch (variant) {
    case 'list':
      return (
        <div className={`${baseClasses.join(' ')} ${className}`} {...props}>
          <div className="file-preview-icon-container">{getFileTypeIcon(file.type)}</div>

          {renderFileInfo()}
          {renderActions()}
        </div>
      );

    case 'grid':
      return (
        <div className={`${baseClasses.join(' ')} ${className}`} {...props}>
          <div className="file-preview-grid-content">
            {isImageFile(file.type) ? (
              renderPreviewImage()
            ) : (
              <div className="file-preview-icon-container">
                {getFileTypeIcon(file.type)}
                <div className="file-preview-extension">{getFileExtension(file.name)}</div>
              </div>
            )}

            {renderFileInfo()}
          </div>

          {renderActions()}
        </div>
      );

    case 'minimal':
      return (
        <div className={`${baseClasses.join(' ')} ${className}`} {...props}>
          <div className="file-preview-minimal-icon">{getFileTypeIcon(file.type)}</div>

          <span className="file-preview-minimal-name">{file.name}</span>

          {removable && showRemove && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="file-preview-minimal-remove"
              aria-label="Remove file"
            >
              <Icon name="x" className="w-3 h-3" />
            </button>
          )}
        </div>
      );

    default: // card
      return (
        <div className={`${baseClasses.join(' ')} ${className}`} {...props}>
          <div className="file-preview-card-header">
            {isImageFile(file.type) ? (
              renderPreviewImage()
            ) : (
              <div className="file-preview-icon-container">{getFileTypeIcon(file.type)}</div>
            )}

            {renderActions()}
          </div>

          {renderFileInfo()}
        </div>
      );
  }
};

export type { FilePreviewProps };
