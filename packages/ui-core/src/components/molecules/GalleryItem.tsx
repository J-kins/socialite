import React, { useState } from 'react';
import { Icon, Badge, Button } from '../atoms';

export interface GalleryItemProps {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  src: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  size?: string;
  duration?: string; // for video/audio
  uploadDate?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isSelected?: boolean;
  isLoading?: boolean;
  variant?: 'default' | 'compact' | 'grid' | 'list';
  showActions?: boolean;
  showMetadata?: boolean;
  onSelect?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({
  id,
  type,
  src,
  thumbnail,
  title,
  description,
  size,
  duration,
  uploadDate,
  author,
  isSelected = false,
  isLoading = false,
  variant = 'default',
  showActions = true,
  showMetadata = true,
  onSelect,
  onView,
  onDownload,
  onDelete,
  onEdit,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = () => {
    const icons = {
      image: 'image',
      video: 'videocam',
      document: 'document-text',
      audio: 'musical-notes',
    };
    return icons[type];
  };

  const getTypeColor = () => {
    const colors = {
      image: 'text-blue-500',
      video: 'text-purple-500',
      document: 'text-red-500',
      audio: 'text-green-500',
    };
    return colors[type];
  };

  const formatSize = (bytes?: string) => {
    if (!bytes) return '';
    const num = parseInt(bytes);
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getVariantClasses = () => {
    const variants = {
      default: {
        container:
          'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
        content: 'p-4',
        imageContainer: 'aspect-video mb-3',
      },
      compact: {
        container: 'bg-white dark:bg-gray-800 rounded-md',
        content: 'p-2',
        imageContainer: 'aspect-square mb-2',
      },
      grid: {
        container:
          'bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700',
        content: 'p-3',
        imageContainer: 'aspect-square mb-3',
      },
      list: {
        container:
          'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        content: 'p-3 flex items-center space-x-3',
        imageContainer: 'w-16 h-16 flex-shrink-0',
      },
    };
    return variants[variant];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    } else if (onView) {
      onView(id);
    }
  };

  const variantClasses = getVariantClasses();
  const displaySrc = thumbnail || src;

  if (variant === 'list') {
    return (
      <div
        className={`
          ${variantClasses.container} ${className}
          ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
          ${isLoading ? 'opacity-60' : ''}
          transition-all duration-200 cursor-pointer hover:shadow-md
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className={variantClasses.content}>
          {/* Thumbnail */}
          <div className={`${variantClasses.imageContainer} relative`}>
            {type === 'image' && !imageError ? (
              <img
                src={displaySrc}
                alt={title || 'Gallery item'}
                className="w-full h-full object-cover rounded-lg"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Icon name={getTypeIcon()} className={`w-6 h-6 ${getTypeColor()}`} />
              </div>
            )}

            {duration && (
              <Badge variant="dark" size="sm" className="absolute bottom-1 right-1 text-xs">
                {duration}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {title || 'Untitled'}
                </h3>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {description}
                  </p>
                )}
                {showMetadata && (
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {size && <span>{formatSize(size)}</span>}
                    {uploadDate && <span>•</span>}
                    {uploadDate && <span>{formatDate(uploadDate)}</span>}
                  </div>
                )}
              </div>

              {/* Actions */}
              {showActions && isHovered && (
                <div className="flex items-center space-x-1 ml-2">
                  {onView && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(id);
                      }}
                    >
                      <Icon name="eye" className="w-4 h-4" />
                    </Button>
                  )}
                  {onDownload && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(id);
                      }}
                    >
                      <Icon name="download" className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        ${variantClasses.container} ${className}
        ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
        ${isLoading ? 'opacity-60' : ''}
        transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className={variantClasses.content}>
        {/* Thumbnail */}
        <div className={`${variantClasses.imageContainer} relative group`}>
          {type === 'image' && !imageError ? (
            <img
              src={displaySrc}
              alt={title || 'Gallery item'}
              className="w-full h-full object-cover rounded-lg"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Icon name={getTypeIcon()} className={`w-8 h-8 ${getTypeColor()}`} />
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-lg flex items-center justify-center">
              <Icon name="refresh" className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          )}

          {/* Duration Badge */}
          {duration && (
            <Badge variant="dark" size="sm" className="absolute bottom-2 right-2">
              {duration}
            </Badge>
          )}

          {/* Type Badge */}
          <Badge variant="secondary" size="sm" className="absolute top-2 left-2">
            <Icon name={getTypeIcon()} className="w-3 h-3 mr-1" />
            {type}
          </Badge>

          {/* Hover Actions */}
          {showActions && isHovered && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center space-x-2">
                {onView && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(id);
                    }}
                  >
                    <Icon name="eye" className="w-4 h-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(id);
                    }}
                  >
                    <Icon name="create" className="w-4 h-4" />
                  </Button>
                )}
                {onDownload && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(id);
                    }}
                  >
                    <Icon name="download" className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="checkmark" className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        {showMetadata && (
          <div className="space-y-2">
            {title && (
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {title}
              </h3>
            )}

            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                {size && <span>{formatSize(size)}</span>}
                {uploadDate && size && <span>•</span>}
                {uploadDate && <span>{formatDate(uploadDate)}</span>}
              </div>

              {author && (
                <div className="flex items-center space-x-1">
                  {author.avatar && (
                    <img src={author.avatar} alt={author.name} className="w-4 h-4 rounded-full" />
                  )}
                  <span className="truncate max-w-20">{author.name}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
