import { useState, useCallback, useEffect, useRef } from 'react';

export interface LightboxImage {
  id: string | number;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface UseLightboxOptions {
  images: LightboxImage[];
  initialIndex?: number;
  onOpen?: (index: number) => void;
  onClose?: () => void;
  onNext?: (index: number) => void;
  onPrevious?: (index: number) => void;
  onIndexChange?: (index: number) => void;
  enableKeyboard?: boolean;
  enableClickToClose?: boolean;
  enableSwipe?: boolean;
  loop?: boolean;
  animationDuration?: number;
  preloadNext?: boolean;
  preloadPrevious?: boolean;
}

export interface UseLightboxReturn {
  isOpen: boolean;
  currentIndex: number;
  currentImage: LightboxImage | null;
  open: (index?: number) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isLoading: boolean;
  isZoomed: boolean;
  zoomLevel: number;
  toggleZoom: () => void;
  setZoomLevel: (level: number) => void;
  resetZoom: () => void;
  lightboxRef: React.RefObject<HTMLDivElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  exitFullscreen: () => void;
  rotation: number;
  rotate: (degrees: number) => void;
  resetRotation: () => void;
}

export const useLightbox = (options: UseLightboxOptions): UseLightboxReturn => {
  const {
    images,
    initialIndex = 0,
    onOpen,
    onClose,
    onNext,
    onPrevious,
    onIndexChange,
    enableKeyboard = true,
    enableClickToClose = true,
    enableSwipe = true,
    loop = true,
    animationDuration = 300,
    preloadNext = true,
    preloadPrevious = true,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);

  const lightboxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const preloadedImages = useRef<Set<string>>(new Set());

  const currentImage = images[currentIndex] || null;
  const hasNext = loop || currentIndex < images.length - 1;
  const hasPrevious = loop || currentIndex > 0;

  const preloadImage = useCallback((src: string) => {
    if (preloadedImages.current.has(src)) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      preloadedImages.current.add(src);
    };
  }, []);

  const open = useCallback(
    (index: number = 0) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index);
        setIsOpen(true);
        setIsZoomed(false);
        setZoomLevel(1);
        setRotation(0);
        onOpen?.(index);

        // Preload adjacent images
        if (preloadNext && index < images.length - 1) {
          preloadImage(images[index + 1].src);
        }
        if (preloadPrevious && index > 0) {
          preloadImage(images[index - 1].src);
        }
      }
    },
    [images, onOpen, preloadNext, preloadPrevious, preloadImage]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setIsZoomed(false);
    setZoomLevel(1);
    setRotation(0);
    exitFullscreen();
    onClose?.();
  }, [onClose]);

  const next = useCallback(() => {
    if (!hasNext) return;

    const nextIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    setIsZoomed(false);
    setZoomLevel(1);
    setRotation(0);
    onNext?.(nextIndex);
    onIndexChange?.(nextIndex);

    // Preload next image
    if (preloadNext) {
      const preloadIndex = nextIndex >= images.length - 1 ? 0 : nextIndex + 1;
      if (preloadIndex !== nextIndex) {
        preloadImage(images[preloadIndex].src);
      }
    }
  }, [currentIndex, images.length, hasNext, onNext, onIndexChange, preloadNext, preloadImage]);

  const previous = useCallback(() => {
    if (!hasPrevious) return;

    const prevIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setIsZoomed(false);
    setZoomLevel(1);
    setRotation(0);
    onPrevious?.(prevIndex);
    onIndexChange?.(prevIndex);

    // Preload previous image
    if (preloadPrevious) {
      const preloadIndex = prevIndex <= 0 ? images.length - 1 : prevIndex - 1;
      if (preloadIndex !== prevIndex) {
        preloadImage(images[preloadIndex].src);
      }
    }
  }, [
    currentIndex,
    images.length,
    hasPrevious,
    onPrevious,
    onIndexChange,
    preloadPrevious,
    preloadImage,
  ]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length && index !== currentIndex) {
        setCurrentIndex(index);
        setIsZoomed(false);
        setZoomLevel(1);
        setRotation(0);
        onIndexChange?.(index);

        // Preload adjacent images
        if (preloadNext && index < images.length - 1) {
          preloadImage(images[index + 1].src);
        }
        if (preloadPrevious && index > 0) {
          preloadImage(images[index - 1].src);
        }
      }
    },
    [images.length, currentIndex, onIndexChange, preloadNext, preloadPrevious, preloadImage]
  );

  const toggleZoom = useCallback(() => {
    if (isZoomed) {
      setZoomLevel(1);
      setIsZoomed(false);
    } else {
      setZoomLevel(2);
      setIsZoomed(true);
    }
  }, [isZoomed]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setIsZoomed(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, []);

  const rotate = useCallback((degrees: number) => {
    setRotation((prev) => prev + degrees);
  }, []);

  const resetRotation = useCallback(() => {
    setRotation(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !enableKeyboard) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowLeft':
          previous();
          break;
        case 'ArrowRight':
          next();
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          toggleZoom();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'r':
        case 'R':
          rotate(90);
          break;
        case 'Home':
          goTo(0);
          break;
        case 'End':
          goTo(images.length - 1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    enableKeyboard,
    close,
    previous,
    next,
    toggleZoom,
    toggleFullscreen,
    rotate,
    goTo,
    images.length,
  ]);

  // Touch/swipe navigation
  useEffect(() => {
    if (!isOpen || !enableSwipe) return;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const threshold = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) {
          previous();
        } else if (deltaX < -threshold) {
          next();
        }
      }

      touchStartRef.current = null;
    };

    const lightboxElement = lightboxRef.current;
    if (lightboxElement) {
      lightboxElement.addEventListener('touchstart', handleTouchStart);
      lightboxElement.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (lightboxElement) {
        lightboxElement.removeEventListener('touchstart', handleTouchStart);
        lightboxElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isOpen, enableSwipe, previous, next]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Image loading state
  useEffect(() => {
    if (currentImage) {
      setIsLoading(true);
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
      img.src = currentImage.src;
    }
  }, [currentImage]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return {
    isOpen,
    currentIndex,
    currentImage,
    open,
    close,
    next,
    previous,
    goTo,
    hasNext,
    hasPrevious,
    isLoading,
    isZoomed,
    zoomLevel,
    toggleZoom,
    setZoomLevel,
    resetZoom,
    lightboxRef,
    imageRef,
    isFullscreen,
    toggleFullscreen,
    exitFullscreen,
    rotation,
    rotate,
    resetRotation,
  };
};

export default useLightbox;
