import React, { useState } from 'react';
import { Icon } from './Icon';

export interface PostImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  variant?: 'single' | 'gallery' | 'cover' | 'thumbnail';
  aspectRatio?: 'square' | 'video' | 'auto' | 'portrait' | 'landscape';
  fit?: 'cover' | 'contain' | 'fill';
  blur?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  caption?: string;
  overlay?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  onImageClick?: () => void;
  showZoom?: boolean;
  showFullscreen?: boolean;
}

/**
 * PostImage component for displaying images in social media posts
 * Supports different layouts, lazy loading, and interactive features
 */
export const PostImage: React.FC<PostImageProps> = ({
  src,
  alt,
  variant = 'single',
  aspectRatio = 'auto',
  fit = 'cover',
  blur = false,
  loading = 'lazy',
  placeholder,
  caption,
  overlay,
  onLoad,
  onError,
  onImageClick,
  showZoom = false,
  showFullscreen = false,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = [
    'post-image',
    `post-image-${variant}`,
    `post-image-${aspectRatio}`,
    `post-image-${fit}`,
    blur && 'post-image-blur',
    !isLoaded && 'post-image-loading',
    hasError && 'post-image-error',
    onImageClick && 'post-image-clickable',
  ].filter(Boolean);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick();
    }
  };

  const renderPlaceholder = () => (
    <div className="post-image-placeholder">
      {placeholder ? (
        <img src={placeholder} alt={alt} className="post-image-placeholder-img" />
      ) : (
        <div className="post-image-placeholder-icon">
          <Icon name="image" className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );

  const renderError = () => (
    <div className="post-image-error-state">
      <Icon name="image-off" className="w-8 h-8 text-gray-400 mb-2" />
      <span className="text-sm text-gray-500">Failed to load image</span>
    </div>
  );

  const renderOverlay = () => (
    <div className="post-image-overlay">
      {overlay}

      <div className="post-image-actions">
        {showZoom && (
          <button
            type="button"
            className="post-image-action post-image-zoom"
            onClick={handleImageClick}
            aria-label="Zoom image"
          >
            <Icon name="zoom-in" className="w-4 h-4" />
          </button>
        )}

        {showFullscreen && (
          <button
            type="button"
            className="post-image-action post-image-fullscreen"
            onClick={handleImageClick}
            aria-label="View fullscreen"
          >
            <Icon name="maximize" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`post-image-container ${baseClasses.join(' ')} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="post-image-wrapper">
        {!isLoaded && !hasError && renderPlaceholder()}

        {hasError ? (
          renderError()
        ) : (
          <img
            src={src}
            alt={alt}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            onClick={handleImageClick}
            className="post-image-element"
            {...props}
          />
        )}

        {(isHovered || overlay) && renderOverlay()}
      </div>

      {caption && <div className="post-image-caption">{caption}</div>}
    </div>
  );
};

export type { PostImageProps };
