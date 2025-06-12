import React, { useState, useEffect } from "react";
import { Avatar, Button, Icon } from "../atoms";

export interface Story {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: {
    type: "image" | "video";
    url: string;
    duration?: number; // in seconds
  };
  timestamp: string;
  isViewed?: boolean;
}

export interface StoryViewerProps {
  stories?: Story[];
  currentStoryIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose?: () => void;
  onUserClick?: (userId: string) => void;
  onStoryComplete?: (storyId: string) => void;
  autoPlay?: boolean;
  className?: string;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories = [],
  currentStoryIndex = 0,
  onNext,
  onPrevious,
  onClose,
  onUserClick,
  onStoryComplete,
  autoPlay = true,
  className = "",
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentStory = stories[currentStoryIndex];
  const duration = currentStory?.content.duration || 5; // Default 5 seconds for images

  useEffect(() => {
    if (!currentStory || isPaused || !autoPlay) return;

    setProgress(0);
    setIsLoading(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration * 10);
        if (newProgress >= 100) {
          onStoryComplete?.(currentStory.id);
          if (currentStoryIndex < stories.length - 1) {
            onNext?.();
          } else {
            onClose?.();
          }
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    currentStory,
    isPaused,
    autoPlay,
    duration,
    currentStoryIndex,
    stories.length,
    onNext,
    onClose,
    onStoryComplete,
  ]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") onPrevious?.();
    if (e.key === "ArrowRight") onNext?.();
    if (e.key === "Escape") onClose?.();
    if (e.key === " ") {
      e.preventDefault();
      setIsPaused(!isPaused);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (!currentStory) return null;

  return (
    <div
      className={`
        fixed inset-0 bg-black z-50 flex items-center justify-center
        ${className}
      `}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex space-x-1">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    index < currentStoryIndex
                      ? "100%"
                      : index === currentStoryIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => onUserClick?.(currentStory.author.id)}>
            <Avatar
              src={currentStory.author.avatar}
              alt={currentStory.author.name}
              size="md"
              className="ring-2 ring-white"
            />
          </button>
          <div>
            <button
              onClick={() => onUserClick?.(currentStory.author.id)}
              className="text-white font-medium hover:underline"
            >
              {currentStory.author.name}
            </button>
            <p className="text-white/80 text-sm">
              {formatTime(currentStory.timestamp)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            <Icon name={isPaused ? "play" : "pause"} className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onMouseDown={handlePause}
        onMouseUp={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {currentStory.content.type === "image" ? (
          <img
            src={currentStory.content.url}
            alt="Story content"
            className="max-w-full max-h-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        ) : (
          <video
            src={currentStory.content.url}
            className="max-w-full max-h-full object-contain"
            autoPlay={autoPlay}
            muted
            onLoadedData={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            onPause={handlePause}
            onPlay={handleResume}
          />
        )}

        {/* Navigation Areas */}
        <div className="absolute inset-0 flex">
          {/* Previous Story Area */}
          <button
            onClick={onPrevious}
            className="flex-1 bg-transparent"
            disabled={currentStoryIndex === 0}
            aria-label="Previous story"
          />

          {/* Next Story Area */}
          <button
            onClick={onNext}
            className="flex-1 bg-transparent"
            disabled={currentStoryIndex === stories.length - 1}
            aria-label="Next story"
          />
        </div>

        {/* Navigation Indicators */}
        {currentStoryIndex > 0 && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <Icon name="chevron-back" className="w-6 h-6" />
          </button>
        )}

        {currentStoryIndex < stories.length - 1 && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <Icon name="chevron-forward" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-white/20 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Send message..."
              className="w-full bg-transparent text-white placeholder-white/70 border-none outline-none"
            />
          </div>
          <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
            <Icon name="heart-outline" className="w-6 h-6" />
          </button>
          <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
            <Icon name="share-outline" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Story Counter */}
      <div className="absolute top-20 right-4 z-10 bg-black/40 text-white px-3 py-1 rounded-full text-sm">
        {currentStoryIndex + 1} / {stories.length}
      </div>
    </div>
  );
};
