import React, { useRef, useState, useEffect } from 'react';
import { Icon } from './Icon';

export interface PostVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  variant?: 'inline' | 'modal' | 'thumbnail';
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
  showControls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playOnHover?: boolean;
  showDuration?: boolean;
  showProgress?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

/**
 * PostVideo component for displaying videos in social media posts
 * Supports different layouts, custom controls, and interactive features
 */
export const PostVideo: React.FC<PostVideoProps> = ({
  src,
  poster,
  variant = 'inline',
  aspectRatio = 'video',
  showControls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  playOnHover = false,
  showDuration = true,
  showProgress = false,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  className = '',
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = [
    'post-video',
    `post-video-${variant}`,
    `post-video-${aspectRatio}`,
    !isLoaded && 'post-video-loading',
    hasError && 'post-video-error',
    isPlaying && 'post-video-playing',
  ].filter(Boolean);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(video.duration);
    };

    const handleError = () => {
      setHasError(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      setCurrentTime(currentTime);
      onTimeUpdate?.(currentTime, duration);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [duration, onPlay, onPause, onEnded, onTimeUpdate]);

  useEffect(() => {
    if (playOnHover && videoRef.current) {
      if (isHovered && !isPlaying) {
        videoRef.current.play();
      } else if (!isHovered && isPlaying && playOnHover) {
        videoRef.current.pause();
      }
    }
  }, [isHovered, isPlaying, playOnHover]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  const renderPlayButton = () => (
    <button
      type="button"
      onClick={togglePlay}
      className="post-video-play-button"
      aria-label={isPlaying ? 'Pause video' : 'Play video'}
    >
      <Icon name={isPlaying ? 'pause' : 'play'} className="post-video-play-icon" />
    </button>
  );

  const renderControls = () => (
    <div className="post-video-controls">
      <button
        type="button"
        onClick={togglePlay}
        className="post-video-control-button"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <Icon name={isPlaying ? 'pause' : 'play'} className="post-video-control-icon" />
      </button>

      {showDuration && (
        <div className="post-video-time">
          <span className="post-video-current-time">{formatTime(currentTime)}</span>
          <span className="post-video-duration">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className="post-video-progress-container">
      <div className="post-video-progress-bar" style={{ width: `${getProgress()}%` }} />
    </div>
  );

  const renderError = () => (
    <div className="post-video-error-state">
      <Icon name="video-off" className="w-8 h-8 text-gray-400 mb-2" />
      <span className="text-sm text-gray-500">Failed to load video</span>
    </div>
  );

  const renderThumbnail = () => (
    <div className="post-video-thumbnail">
      {poster && <img src={poster} alt="Video thumbnail" className="post-video-thumbnail-image" />}
      <div className="post-video-thumbnail-overlay">
        {renderPlayButton()}
        {showDuration && duration > 0 && (
          <div className="post-video-duration-badge">{formatTime(duration)}</div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`post-video-container ${baseClasses.join(' ')} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="post-video-wrapper">
        {hasError ? (
          renderError()
        ) : (
          <>
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              controls={false} // We use custom controls
              className="post-video-element"
              {...props}
            />

            {!isLoaded && renderThumbnail()}

            {isLoaded && !showControls && !isPlaying && renderPlayButton()}

            {isLoaded && showControls && renderControls()}

            {showProgress && renderProgress()}
          </>
        )}
      </div>
    </div>
  );
};

export type { PostVideoProps };
