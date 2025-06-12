import React, { useState, useEffect } from 'react';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';
import { MainContentPanel } from '../organisms/MainContentPanel';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { CommentSection } from '../organisms/CommentSection';
import '../../../styles/templates/video-watch-page.css';

export interface VideoWatchPageProps {
  videoId?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  author?: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  stats?: {
    views: number;
    likes: number;
    dislikes: number;
    shares: number;
  };
  tags?: string[];
  relatedVideos?: Array<{
    id: string;
    title: string;
    thumbnail: string;
    author: string;
    views: number;
    duration: string;
  }>;
  className?: string;
}

export const VideoWatchPage: React.FC<VideoWatchPageProps> = ({
  videoId = 'video-1',
  videoUrl = '/assets/videos/sample.mp4',
  title = 'Amazing Social Video Content',
  description = 'This is an amazing video that showcases our social platform features.',
  author = {
    id: 'user-1',
    name: 'John Creator',
    avatar: '/assets/images/avatars/avatar-1.jpg',
    isVerified: true,
  },
  stats = {
    views: 125000,
    likes: 8500,
    dislikes: 120,
    shares: 2400,
  },
  tags = ['social', 'video', 'entertainment', 'viral'],
  relatedVideos = [],
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className={`video-watch-page ${className || ''}`}>
      <Header />
      <Sidebar />

      <MainContentPanel className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="video-player-container relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  className="w-full h-full object-cover"
                  controls
                  poster="/assets/images/video-placeholder.jpg"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Overlay Controls */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {!isPlaying && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="pointer-events-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>

              {/* Video Info */}
              <div className="video-info space-y-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>

                {/* Video Stats and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatNumber(stats.views)} views</span>
                    <span>•</span>
                    <span>2 days ago</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isLiked ? 'primary' : 'outline'}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span>{formatNumber(stats.likes)}</span>
                    </Button>

                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.641a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                      </svg>
                      <span>{formatNumber(stats.dislikes)}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span>Share</span>
                    </Button>
                  </div>
                </div>

                {/* Channel Info */}
                <div className="channel-info flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={author.avatar}
                      alt={author.name}
                      size="lg"
                      className="ring-2 ring-white dark:ring-gray-800"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {author.name}
                        </h3>
                        {author.isVerified && (
                          <Badge variant="primary" size="sm">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">1.2M subscribers</p>
                    </div>
                  </div>

                  <Button variant={isSubscribed ? 'outline' : 'primary'} onClick={handleSubscribe}>
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                </div>

                {/* Description */}
                <div className="description bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p
                    className={`text-gray-700 dark:text-gray-300 ${!showFullDescription ? 'line-clamp-3' : ''}`}
                  >
                    {description}
                  </p>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </Button>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Comments Section */}
                <CommentSection
                  entityId={videoId}
                  entityType="video"
                  className="bg-white dark:bg-gray-800 rounded-lg p-4"
                />
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Up next</h3>

              {relatedVideos.length === 0 &&
                // Default related videos if none provided
                [...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="related-video-card flex space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-24 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        Related Video Title {index + 1}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Channel Name</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {Math.floor(Math.random() * 100)}K views •{' '}
                        {Math.floor(Math.random() * 7) + 1} days ago
                      </p>
                    </div>
                  </div>
                ))}

              {relatedVideos.map((video) => (
                <div
                  key={video.id}
                  className="related-video-card flex space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{video.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatNumber(video.views)} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainContentPanel>
    </div>
  );
};

export type { VideoWatchPageProps };
