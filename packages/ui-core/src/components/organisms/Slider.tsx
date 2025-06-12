import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

export interface SliderItem {
  id: string;
  content: React.ReactNode;
  image?: string;
  title?: string;
  description?: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface SliderProps {
  /**
   * Slider items to display
   */
  items: SliderItem[];
  /**
   * Currently active slide index
   */
  activeIndex?: number;
  /**
   * Auto-play settings
   */
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  /**
   * Navigation settings
   */
  showNavigation?: boolean;
  showDots?: boolean;
  showProgress?: boolean;
  enableKeyboardNavigation?: boolean;
  enableTouchNavigation?: boolean;
  /**
   * Behavior settings
   */
  infinite?: boolean;
  slidesToShow?: number;
  slidesToScroll?: number;
  centerMode?: boolean;
  variableWidth?: boolean;
  /**
   * Animation settings
   */
  animationType?: 'slide' | 'fade' | 'zoom' | 'flip' | 'none';
  animationDuration?: number;
  animationEasing?: string;
  /**
   * Appearance
   */
  variant?: 'default' | 'minimal' | 'card' | 'hero';
  height?: string | number;
  aspectRatio?: string;
  gap?: string | number;
  /**
   * Responsive settings
   */
  responsive?: Array<{
    breakpoint: number;
    settings: Partial<SliderProps>;
  }>;
  /**
   * Loading and lazy loading
   */
  lazyLoad?: boolean;
  preloadImages?: boolean;
  /**
   * Event handlers
   */
  onSlideChange?: (index: number, item: SliderItem) => void;
  onSlideClick?: (item: SliderItem, index: number) => void;
  beforeSlideChange?: (currentIndex: number, nextIndex: number) => boolean;
  afterSlideChange?: (index: number, item: SliderItem) => void;
  /**
   * Custom rendering
   */
  renderSlide?: (item: SliderItem, index: number, isActive: boolean) => React.ReactNode;
  renderNavButton?: (direction: 'prev' | 'next', disabled: boolean) => React.ReactNode;
  renderDot?: (index: number, isActive: boolean) => React.ReactNode;
  /**
   * Accessibility
   */
  ariaLabel?: string;
  ariaLabelledBy?: string;
  /**
   * Performance
   */
  virtualScrolling?: boolean;
  bufferSize?: number;
  /**
   * Customization
   */
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  items = [],
  activeIndex = 0,
  autoPlay = false,
  autoPlayInterval = 5000,
  pauseOnHover = true,
  showNavigation = true,
  showDots = true,
  showProgress = false,
  enableKeyboardNavigation = true,
  enableTouchNavigation = true,
  infinite = true,
  slidesToShow = 1,
  slidesToScroll = 1,
  centerMode = false,
  variableWidth = false,
  animationType = 'slide',
  animationDuration = 500,
  animationEasing = 'ease-in-out',
  variant = 'default',
  height = 'auto',
  aspectRatio,
  gap = 0,
  responsive = [],
  lazyLoad = true,
  preloadImages = false,
  onSlideChange,
  onSlideClick,
  beforeSlideChange,
  afterSlideChange,
  renderSlide,
  renderNavButton,
  renderDot,
  ariaLabel = 'Image slider',
  ariaLabelledBy,
  virtualScrolling = false,
  bufferSize = 2,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [currentSettings, setCurrentSettings] = useState<SliderProps>({
    slidesToShow,
    slidesToScroll,
    showNavigation,
    showDots,
  });
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Handle responsive settings
  useEffect(() => {
    const updateSettings = () => {
      const width = window.innerWidth;
      let newSettings = {
        slidesToShow,
        slidesToScroll,
        showNavigation,
        showDots,
      };

      // Apply responsive settings
      responsive.forEach(({ breakpoint, settings }) => {
        if (width <= breakpoint) {
          newSettings = { ...newSettings, ...settings };
        }
      });

      setCurrentSettings(newSettings);
    };

    updateSettings();
    window.addEventListener('resize', updateSettings);
    return () => window.removeEventListener('resize', updateSettings);
  }, [responsive, slidesToShow, slidesToScroll, showNavigation, showDots]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    };

    const stopAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };

    startAutoPlay();

    if (pauseOnHover && sliderRef.current) {
      const slider = sliderRef.current;
      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', startAutoPlay);

      return () => {
        stopAutoPlay();
        slider.removeEventListener('mouseenter', stopAutoPlay);
        slider.removeEventListener('mouseleave', startAutoPlay);
      };
    }

    return stopAutoPlay;
  }, [autoPlay, autoPlayInterval, pauseOnHover, items.length]);

  // Progress bar animation
  useEffect(() => {
    if (!showProgress || !autoPlay || !progressRef.current) return;

    const progressBar = progressRef.current;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    // Force reflow
    progressBar.offsetHeight;

    progressBar.style.transition = `width ${autoPlayInterval}ms linear`;
    progressBar.style.width = '100%';
  }, [currentIndex, showProgress, autoPlay, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

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
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(items.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNavigation, items.length]);

  // Image preloading
  useEffect(() => {
    if (!preloadImages) return;

    items.forEach((item) => {
      if (item.image && !loadedImages.has(item.id)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(item.id));
        };
        img.src = item.image;
      }
    });
  }, [items, preloadImages, loadedImages]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    const nextIndex = infinite
      ? (currentIndex + currentSettings.slidesToScroll!) % items.length
      : Math.min(currentIndex + currentSettings.slidesToScroll!, items.length - 1);

    goToSlide(nextIndex);
  }, [currentIndex, currentSettings.slidesToScroll, items.length, infinite, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;

    const prevIndex = infinite
      ? (currentIndex - currentSettings.slidesToScroll! + items.length) % items.length
      : Math.max(currentIndex - currentSettings.slidesToScroll!, 0);

    goToSlide(prevIndex);
  }, [currentIndex, currentSettings.slidesToScroll, items.length, infinite, isTransitioning]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;

      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));

      // Call beforeSlideChange hook
      if (beforeSlideChange && !beforeSlideChange(currentIndex, clampedIndex)) {
        return;
      }

      setIsTransitioning(true);
      setCurrentIndex(clampedIndex);

      // Call slide change handlers
      onSlideChange?.(clampedIndex, items[clampedIndex]);

      // End transition after animation
      setTimeout(() => {
        setIsTransitioning(false);
        afterSlideChange?.(clampedIndex, items[clampedIndex]);
      }, animationDuration);
    },
    [
      currentIndex,
      items,
      beforeSlideChange,
      onSlideChange,
      afterSlideChange,
      animationDuration,
      isTransitioning,
    ]
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enableTouchNavigation) return;
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
      setIsDragging(true);
    },
    [enableTouchNavigation]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enableTouchNavigation || !isDragging) return;
      const touch = e.touches[0];
      setTouchEnd({ x: touch.clientX, y: touch.clientY });

      const deltaX = touch.clientX - touchStart.x;
      setDragOffset(deltaX);
    },
    [enableTouchNavigation, isDragging, touchStart.x]
  );

  const handleTouchEnd = useCallback(() => {
    if (!enableTouchNavigation || !isDragging) return;

    setIsDragging(false);
    setDragOffset(0);

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    // Only process horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
  }, [enableTouchNavigation, isDragging, touchEnd, touchStart, goToPrevious, goToNext]);

  // Handle slide click
  const handleSlideClick = useCallback(
    (item: SliderItem, index: number) => {
      onSlideClick?.(item, index);
    },
    [onSlideClick]
  );

  // Calculate transform for slides
  const getTransform = () => {
    const slideWidth = 100 / currentSettings.slidesToShow!;
    const translateX =
      -(currentIndex * slideWidth) + (dragOffset / (sliderRef.current?.offsetWidth || 1)) * 100;

    switch (animationType) {
      case 'slide':
        return `translateX(${translateX}%)`;
      case 'fade':
        return 'translateX(0)';
      default:
        return `translateX(${translateX}%)`;
    }
  };

  // Render individual slide
  const renderSlideItem = (item: SliderItem, index: number) => {
    const isActive = index === currentIndex;
    const isVisible = Math.abs(index - currentIndex) <= bufferSize;

    if (virtualScrolling && !isVisible) {
      return <div key={item.id} className="slider__slide slider__slide--placeholder" />;
    }

    if (renderSlide) {
      return (
        <div key={item.id} className="slider__slide">
          {renderSlide(item, index, isActive)}
        </div>
      );
    }

    const slideClasses = [
      'slider__slide',
      `slider__slide--${variant}`,
      isActive && 'slider__slide--active',
      animationType === 'fade' && !isActive && 'slider__slide--hidden',
    ]
      .filter(Boolean)
      .join(' ');

    const shouldLoadImage = !lazyLoad || isVisible || preloadImages;

    return (
      <div
        key={item.id}
        className={slideClasses}
        onClick={() => handleSlideClick(item, index)}
        style={{
          width: variableWidth ? 'auto' : `${100 / currentSettings.slidesToShow!}%`,
          marginRight: gap,
        }}
      >
        {item.image && shouldLoadImage && (
          <div className="slider__slide-image">
            <img
              src={item.image}
              alt={item.title || `Slide ${index + 1}`}
              loading={lazyLoad ? 'lazy' : 'eager'}
              onLoad={() => {
                setLoadedImages((prev) => new Set(prev).add(item.id));
              }}
            />
          </div>
        )}

        {item.content && <div className="slider__slide-content">{item.content}</div>}

        {(item.title || item.description) && (
          <div className="slider__slide-info">
            {item.title && <h3 className="slider__slide-title">{item.title}</h3>}
            {item.description && <p className="slider__slide-description">{item.description}</p>}
          </div>
        )}
      </div>
    );
  };

  // Don't render if no items
  if (items.length === 0) {
    return null;
  }

  const sliderClasses = [
    'slider',
    `slider--${variant}`,
    `slider--animation-${animationType}`,
    centerMode && 'slider--center',
    variableWidth && 'slider--variable-width',
    isDragging && 'slider--dragging',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const canGoPrev = infinite || currentIndex > 0;
  const canGoNext = infinite || currentIndex < items.length - currentSettings.slidesToShow!;

  return (
    <div
      ref={sliderRef}
      className={sliderClasses}
      style={
        {
          height,
          aspectRatio,
          '--animation-duration': `${animationDuration}ms`,
          '--animation-easing': animationEasing,
          '--slides-to-show': currentSettings.slidesToShow,
          '--gap': typeof gap === 'number' ? `${gap}px` : gap,
        } as React.CSSProperties
      }
      role="region"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress Bar */}
      {showProgress && autoPlay && (
        <div className="slider__progress">
          <div ref={progressRef} className="slider__progress-bar" />
        </div>
      )}

      {/* Slider Track */}
      <div className="slider__container">
        <div
          ref={trackRef}
          className="slider__track"
          style={{
            transform: getTransform(),
            transition:
              isTransitioning && !isDragging
                ? `transform ${animationDuration}ms ${animationEasing}`
                : 'none',
          }}
        >
          {items.map((item, index) => renderSlideItem(item, index))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentSettings.showNavigation && items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="lg"
            className="slider__nav slider__nav--prev"
            onClick={goToPrevious}
            disabled={!canGoPrev}
            aria-label="Previous slide"
          >
            {renderNavButton ? (
              renderNavButton('prev', !canGoPrev)
            ) : (
              <Icon name="chevron-left" size="lg" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="slider__nav slider__nav--next"
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label="Next slide"
          >
            {renderNavButton ? (
              renderNavButton('next', !canGoNext)
            ) : (
              <Icon name="chevron-right" size="lg" />
            )}
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {currentSettings.showDots && items.length > 1 && (
        <div className="slider__dots" role="tablist">
          {items.map((_, index) => (
            <button
              key={index}
              className={`slider__dot ${index === currentIndex ? 'slider__dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            >
              {renderDot ? renderDot(index, index === currentIndex) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
