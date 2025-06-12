import React, { useState, useRef, useEffect } from 'react';
import { Icon, Button, Badge } from '../atoms';

export interface MediaPlayerProps {
  src: string;
  type: 'video' | 'audio';
  poster?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  variant?: 'default' | 'minimal' | 'compact';
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number) => void;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  src,
  type,
  poster,
  title,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  variant = 'default',
  aspectRatio = '16:9',
  className = '',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Failed to load media');
      setIsLoading(false);
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
      setCurrentTime(media.currentTime);
      onTimeUpdate?.(media.currentTime, media.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(media.duration);
    };

    const handleVolumeChange = () => {
      setVolume(media.volume);
      setIsMuted(media.muted);
      onVolumeChange?.(media.volume);
    };

    media.addEventListener('loadstart', handleLoadStart);
    media.addEventListener('canplay', handleCanPlay);
    media.addEventListener('error', handleError);
    media.addEventListener('play', handlePlay);
    media.addEventListener('pause', handlePause);
    media.addEventListener('ended', handleEnded);
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('volumechange', handleVolumeChange);

    return () => {
      media.removeEventListener('loadstart', handleLoadStart);
      media.removeEventListener('canplay', handleCanPlay);
      media.removeEventListener('error', handleError);
      media.removeEventListener('play', handlePlay);
      media.removeEventListener('pause', handlePause);
      media.removeEventListener('ended', handleEnded);
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [onPlay, onPause, onEnded, onTimeUpdate, onVolumeChange]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play().catch(console.error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const media = mediaRef.current;
    if (!media) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    media.currentTime = newTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const media = mediaRef.current;
    if (!media) return;

    const newVolume = parseFloat(e.target.value) / 100;
    media.volume = newVolume;
    media.muted = newVolume === 0;
  };

  const handleMute = () => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = !media.muted;
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && type === 'video') {
        setShowControls(false);
      }
    }, 3000);
  };

  const getAspectRatioClasses = () => {
    const ratios = {
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
      '1:1': 'aspect-square',
      auto: '',
    };
    return ratios[aspectRatio];
  };

  const getVariantClasses = () => {
    const variants = {
      default: 'bg-black rounded-lg overflow-hidden shadow-lg',
      minimal: 'bg-transparent rounded-md overflow-hidden',
      compact: 'bg-gray-900 rounded-md overflow-hidden shadow-md',
    };
    return variants[variant];
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  return (
    <div
      ref={containerRef}
      className={`
        relative ${getVariantClasses()} ${type === 'video' ? getAspectRatioClasses() : ''} ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying && type === 'video') {
          setShowControls(false);
        }
      }}
    >
      {/* Media Element */}
      {type === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          poster={poster}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={!controls}
          className="w-full h-full object-cover"
          playsInline
        />
      ) : (
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={src}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={!controls}
          className="w-full"
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Icon name="refresh" className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center text-white">
            <Icon name="alert-circle" className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      {controls && !error && (
        <div
          className={`
            absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent
            transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="p-4 space-y-3">
            {/* Progress Bar */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
              />
              <div
                className="absolute top-0 left-0 h-1 bg-blue-500 rounded-lg pointer-events-none"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Play/Pause */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  <Icon name={isPlaying ? 'pause' : 'play'} className="w-5 h-5" />
                </Button>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleMute}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon
                      name={
                        isMuted || volume === 0
                          ? 'volume-mute'
                          : volume < 0.5
                            ? 'volume-low'
                            : 'volume-high'
                      }
                      className="w-4 h-4"
                    />
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volumePercentage}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Time */}
                <span className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Title */}
                {title && (
                  <span className="text-white text-sm font-medium max-w-48 truncate">{title}</span>
                )}

                {/* Fullscreen (Video only) */}
                {type === 'video' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name={isFullscreen ? 'contract' : 'expand'} className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Play Button Overlay for Video */}
      {type === 'video' && !isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            variant="primary"
            onClick={handlePlayPause}
            className="bg-white/20 hover:bg-white/30 text-white border-white/50"
          >
            <Icon name="play" className="w-8 h-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Audio Player Layout */}
      {type === 'audio' && (
        <div className="p-4 bg-gray-800 text-white">
          <div className="flex items-center space-x-4">
            <Button
              size="md"
              variant="ghost"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20"
            >
              <Icon name={isPlaying ? 'pause' : 'play'} className="w-6 h-6" />
            </Button>

            <div className="flex-1">
              {title && <div className="text-sm font-medium mb-1">{title}</div>}
              <div className="relative mb-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                />
                <div
                  className="absolute top-0 left-0 h-1 bg-blue-500 rounded-lg pointer-events-none"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-300 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMute}
                className="text-white hover:bg-white/20"
              >
                <Icon
                  name={
                    isMuted || volume === 0
                      ? 'volume-mute'
                      : volume < 0.5
                        ? 'volume-low'
                        : 'volume-high'
                  }
                  className="w-4 h-4"
                />
              </Button>
              <input
                type="range"
                min="0"
                max="100"
                value={volumePercentage}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
