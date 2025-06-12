import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface GalleryItem {
  id: string;
  src: string;
  thumbnail?: string;
  alt: string;
  title?: string;
  description?: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
}

export interface LightboxGalleryProps {
  /**
   * Gallery items to display
   */
  items: GalleryItem[];
  /**
   * Initially selected item
   */
  selectedIndex?: number;
  /**
   * Lightbox visibility
   */
  isOpen?: boolean;
  onOpen?: (index: number) => void;
  onClose?: () => void;
  /**
   * Navigation settings
   */
  showNavigation?: boolean;
  showThumbnails?: boolean;
  showIndicators?: boolean;
  enableKeyboardNavigation?: boolean;
  enableTouchNavigation?: boolean;
  enableZoom?: boolean;
  /**
   * Auto-play settings (for videos)
   */
  autoPlay?: boolean;
  loop?: boolean;
  /**
   * Appearance
   */
  variant?: 'default' | 'minimal' | 'fullscreen';
  theme?: 'light' | 'dark' | 'auto';
  showOverlay?: boolean;
  overlayOpacity?: number;
  /**
   * Animation settings
   */
  animationDuration?: number;
  transitionType?: 'slide' | 'fade' | 'zoom' | 'none';
  /**
   * Thumbnail grid settings
   */
  thumbnailSize?: 'sm' | 'md' | 'lg';
  thumbnailsPerRow?: number;
  thumbnailPosition?: 'bottom' | 'top' | 'left' | 'right';
  /**
   * Loading and error handling
   */
  lazyLoadThumbnails?: boolean;
  showLoadingSpinner?: boolean;
  onItemLoad?: (item: GalleryItem) => void;
  onItemError?: (item: GalleryItem, error: Error) => void;
  /**
   * Interaction settings
   */
  clickOutsideToClose?: boolean;
  escapeToClose?: boolean;
  doubleClickToZoom?: boolean;
  /**
   * Custom rendering
   */
  renderThumbnail?: (item: GalleryItem, index: number, isActive: boolean) => React.ReactNode;
  renderTitle?: (item: GalleryItem) => React.ReactNode;
  renderDescription?: (item: GalleryItem) => React.ReactNode;
  renderControls?: (currentIndex: number, totalItems: number) => React.ReactNode;
  /**
   * Event handlers
   */
  onItemChange?: (item: GalleryItem, index: number) => void;
  onZoomChange?: (zoomLevel: number) => void;
  onDownload?: (item: GalleryItem) => void;
  onShare?: (item: GalleryItem) => void;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  /**
   * Customization
   */
  className?: string;
}

export const LightboxGallery: React.FC<LightboxGalleryProps> = ({
  items = [],
  selectedIndex = 0,
  isOpen = false,
  onOpen,
  onClose,
  showNavigation = true,
  showThumbnails = true,
  showIndicators = true,
  enableKeyboardNavigation = true,
  enableTouchNavigation = true,
  enableZoom = true,
  autoPlay = false,
  loop = false,
  variant = 'default',
  theme = 'dark',
  showOverlay = true,
  overlayOpacity = 0.9,
  animationDuration = 300,
  transitionType = 'slide',
  thumbnailSize = 'md',
  thumbnailsPerRow = 6,
  thumbnailPosition = 'bottom',
  lazyLoadThumbnails = true,
  showLoadingSpinner = true,
  onItemLoad,
  onItemError,
  clickOutsideToClose = true,
  escapeToClose = true,
  doubleClickToZoom = true,
  renderThumbnail,
  renderTitle,
  renderDescription,
  renderControls,
  onItemChange,
  onZoomChange,
  onDownload,
  onShare,
  ariaLabel = 'Image gallery lightbox',
  ariaLabelledBy,
  ariaDescribedBy,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const lightboxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Update current index when selectedIndex prop changes
  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  // Call onItemChange when current index changes
  useEffect(() => {
    if (items[currentIndex]) {
      onItemChange?.(items[currentIndex], currentIndex);
    }
  }, [currentIndex, items, onItemChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !enableKeyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          if (escapeToClose) {
            e.preventDefault();
            handleClose();
          }
          break;
        case 'Home':
          e.preventDefault();
          goToFirst();
          break;
        case 'End':
          e.preventDefault();
          goToLast();
          break;
        case '+':
        case '=':
          if (enableZoom) {
            e.preventDefault();
            handleZoomIn();
          }
          break;
        case '-':
          if (enableZoom) {
            e.preventDefault();
            handleZoomOut();
          }
          break;
        case '0':
          if (enableZoom) {
            e.preventDefault();
            handleZoomReset();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, enableKeyboardNavigation, escapeToClose, enableZoom]);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= items.length - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
    resetZoom();
  }, [items.length, loop]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return loop ? items.length - 1 : prev;
      }
      return prev - 1;
    });
    resetZoom();
  }, [items.length, loop]);

  const goToFirst = useCallback(() => {
    setCurrentIndex(0);
    resetZoom();
  }, []);

  const goToLast = useCallback(() => {
    setCurrentIndex(items.length - 1);
    resetZoom();
  }, [items.length]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < items.length) {
        setCurrentIndex(index);
        resetZoom();
      }
    },
    [items.length]
  );

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    if (!enableZoom) return;
    const newZoom = Math.min(zoomLevel * 1.2, 3);
    setZoomLevel(newZoom);
    onZoomChange?.(newZoom);
  }, [zoomLevel, enableZoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    if (!enableZoom) return;
    const newZoom = Math.max(zoomLevel / 1.2, 0.5);
    setZoomLevel(newZoom);
    onZoomChange?.(newZoom);
  }, [zoomLevel, enableZoom, onZoomChange]);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
    onZoomChange?.(1);
  }, [onZoomChange]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  }, []);

  // Close handler
  const handleClose = useCallback(() => {
    resetZoom();
    onClose?.();
  }, [onClose, resetZoom]);

  // Overlay click handler
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (clickOutsideToClose && e.target === e.currentTarget) {
        handleClose();
      }
    },
    [clickOutsideToClose, handleClose]
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enableTouchNavigation) return;
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    },
    [enableTouchNavigation]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enableTouchNavigation) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;

      // Swipe threshold
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    },
    [enableTouchNavigation, touchStart, goToPrevious, goToNext]
  );

  // Double click to zoom
  const handleDoubleClick = useCallback(() => {
    if (doubleClickToZoom && enableZoom) {
      if (zoomLevel === 1) {
        handleZoomIn();
      } else {
        handleZoomReset();
      }
    }
  }, [doubleClickToZoom, enableZoom, zoomLevel, handleZoomIn, handleZoomReset]);

  // Image load handler
  const handleImageLoad = useCallback(
    (item: GalleryItem) => {
      setIsLoading(false);
      setLoadedImages((prev) => new Set(prev).add(item.id));
      onItemLoad?.(item);
    },
    [onItemLoad]
  );

  // Image error handler
  const handleImageError = useCallback(
    (item: GalleryItem, error: Error) => {
      setIsLoading(false);
      onItemError?.(item, error);
    },
    [onItemError]
  );

  // Current item
  const currentItem = items[currentIndex];

  // Render thumbnail
  const renderThumbnailItem = (item: GalleryItem, index: number) => {
    const isActive = index === currentIndex;

    if (renderThumbnail) {
      return renderThumbnail(item, index, isActive);
    }

    const thumbnailClasses = [
      'lightbox-gallery__thumbnail',
      `lightbox-gallery__thumbnail--${thumbnailSize}`,
      isActive && 'lightbox-gallery__thumbnail--active',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        key={item.id}
        className={thumbnailClasses}
        onClick={() => goToIndex(index)}
        aria-label={`View ${item.alt}`}
      >
        <img
          src={item.thumbnail || item.src}
          alt={item.alt}
          loading={lazyLoadThumbnails ? 'lazy' : 'eager'}
          onLoad={() => handleImageLoad(item)}
          onError={(e) => handleImageError(item, new Error('Failed to load thumbnail'))}
        />
        {item.type === 'video' && (
          <Icon name="play" size="sm" className="lightbox-gallery__thumbnail-play" />
        )}
      </button>
    );
  };

  // Don't render if not open or no items
  if (!isOpen || items.length === 0) {
    return null;
  }

  const lightboxClasses = [
    'lightbox-gallery',
    `lightbox-gallery--${variant}`,
    `lightbox-gallery--${theme}`,
    `lightbox-gallery--transition-${transitionType}`,
    `lightbox-gallery--thumbnails-${thumbnailPosition}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={lightboxRef}
      className={lightboxClasses}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={
        {
          '--overlay-opacity': overlayOpacity,
          '--animation-duration': `${animationDuration}ms`,
        } as React.CSSProperties
      }
    >
      {/* Overlay */}
      {showOverlay && <div className="lightbox-gallery__overlay" />}

      {/* Main Content */}
      <div className="lightbox-gallery__content">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="lg"
          className="lightbox-gallery__close"
          onClick={handleClose}
          aria-label="Close gallery"
        >
          <Icon name="close" size="lg" />
        </Button>

        {/* Navigation Arrows */}
        {showNavigation && items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              className="lightbox-gallery__nav lightbox-gallery__nav--prev"
              onClick={goToPrevious}
              disabled={!loop && currentIndex === 0}
              aria-label="Previous image"
            >
              <Icon name="chevron-left" size="lg" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="lightbox-gallery__nav lightbox-gallery__nav--next"
              onClick={goToNext}
              disabled={!loop && currentIndex === items.length - 1}
              aria-label="Next image"
            >
              <Icon name="chevron-right" size="lg" />
            </Button>
          </>
        )}

        {/* Media Container */}
        <div className="lightbox-gallery__media-container">
          {isLoading && showLoadingSpinner && (
            <div className="lightbox-gallery__loading">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {currentItem && (
            <div
              className="lightbox-gallery__media"
              style={{
                transform: `scale(${zoomLevel}) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
              }}
              onDoubleClick={handleDoubleClick}
            >
              {currentItem.type === 'image' ? (
                <img
                  ref={imageRef}
                  src={currentItem.src}
                  alt={currentItem.alt}
                  onLoad={() => handleImageLoad(currentItem)}
                  onError={(e) => handleImageError(currentItem, new Error('Failed to load image'))}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={currentItem.src}
                  controls
                  autoPlay={autoPlay}
                  loop={loop}
                  onLoadedData={() => handleImageLoad(currentItem)}
                  onError={(e) => handleImageError(currentItem, new Error('Failed to load video'))}
                />
              )}
            </div>
          )}
        </div>

        {/* Info Panel */}
        {currentItem && (currentItem.title || currentItem.description) && (
          <div className="lightbox-gallery__info">
            {currentItem.title && (
              <h3 className="lightbox-gallery__title">
                {renderTitle ? renderTitle(currentItem) : currentItem.title}
              </h3>
            )}
            {currentItem.description && (
              <p className="lightbox-gallery__description">
                {renderDescription ? renderDescription(currentItem) : currentItem.description}
              </p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="lightbox-gallery__controls">
          {renderControls ? (
            renderControls(currentIndex, items.length)
          ) : (
            <>
              {/* Zoom Controls */}
              {enableZoom && currentItem?.type === 'image' && (
                <div className="lightbox-gallery__zoom-controls">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                    aria-label="Zoom out"
                  >
                    <Icon name="zoom-out" size="sm" />
                  </Button>
                  <span className="lightbox-gallery__zoom-level">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    aria-label="Zoom in"
                  >
                    <Icon name="zoom-in" size="sm" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomReset}
                    aria-label="Reset zoom"
                  >
                    <Icon name="maximize" size="sm" />
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="lightbox-gallery__actions">
                {onDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(currentItem)}
                    aria-label="Download"
                  >
                    <Icon name="download" size="sm" />
                  </Button>
                )}
                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShare(currentItem)}
                    aria-label="Share"
                  >
                    <Icon name="share" size="sm" />
                  </Button>
                )}
              </div>

              {/* Indicators */}
              {showIndicators && items.length > 1 && (
                <div className="lightbox-gallery__indicators">
                  <span className="lightbox-gallery__counter">
                    {currentIndex + 1} / {items.length}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && items.length > 1 && (
          <div
            ref={thumbnailsRef}
            className="lightbox-gallery__thumbnails"
            style={
              {
                '--thumbnails-per-row': thumbnailsPerRow,
              } as React.CSSProperties
            }
          >
            {items.map((item, index) => renderThumbnailItem(item, index))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LightboxGallery;
