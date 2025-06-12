import React, { useState, useEffect } from 'react';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';
import { MainContentPanel } from '../organisms/MainContentPanel';
import { PostFeed } from '../organisms/PostFeed';
import { CreatePost } from '../organisms/CreatePost';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import '../../../styles/templates/timeline-page.css';

export interface TimelinePageProps {
  userId?: string;
  profileType?: 'user' | 'page' | 'group' | 'event';
  profileData?: {
    id: string;
    name: string;
    username?: string;
    avatar: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinDate?: string;
    isVerified?: boolean;
    isFollowing?: boolean;
    stats?: {
      followers: number;
      following: number;
      posts: number;
      likes?: number;
      members?: number;
      attending?: number;
    };
  };
  tabs?: Array<{
    key: string;
    label: string;
    count?: number;
  }>;
  activeTab?: string;
  canPost?: boolean;
  posts?: Array<any>;
  className?: string;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  userId = 'user-1',
  profileType = 'user',
  profileData = {
    id: 'user-1',
    name: 'John Smith',
    username: 'johnsmith',
    avatar: '/assets/images/avatars/avatar-1.jpg',
    coverImage: '/assets/images/covers/cover-1.jpg',
    bio: 'Digital creator and social enthusiast. Sharing moments that matter.',
    location: 'New York, NY',
    website: 'https://johnsmith.com',
    joinDate: '2020-01-15',
    isVerified: true,
    isFollowing: false,
    stats: {
      followers: 2547,
      following: 891,
      posts: 324,
      likes: 12500,
    },
  },
  tabs = [
    { key: 'posts', label: 'Posts', count: 324 },
    { key: 'photos', label: 'Photos', count: 89 },
    { key: 'videos', label: 'Videos', count: 45 },
    { key: 'about', label: 'About' },
  ],
  activeTab = 'posts',
  canPost = true,
  posts = [],
  className,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isFollowing, setIsFollowing] = useState(profileData.isFollowing);
  const [showFullBio, setShowFullBio] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    // Navigate to messages
    console.log('Message user:', profileData.id);
  };

  const getProfileTypeIcon = () => {
    switch (profileType) {
      case 'page':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'group':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        );
      case 'event':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActionButtonText = () => {
    switch (profileType) {
      case 'page':
        return isFollowing ? 'Following' : 'Follow';
      case 'group':
        return isFollowing ? 'Joined' : 'Join Group';
      case 'event':
        return isFollowing ? 'Going' : 'Interested';
      default:
        return isFollowing ? 'Following' : 'Follow';
    }
  };

  const getStatsLabels = () => {
    switch (profileType) {
      case 'page':
        return {
          primary: 'Followers',
          secondary: 'Likes',
          tertiary: 'Posts',
        };
      case 'group':
        return {
          primary: 'Members',
          secondary: 'Posts',
          tertiary: 'Active',
        };
      case 'event':
        return {
          primary: 'Going',
          secondary: 'Interested',
          tertiary: 'Posts',
        };
      default:
        return {
          primary: 'Followers',
          secondary: 'Following',
          tertiary: 'Posts',
        };
    }
  };

  const statsLabels = getStatsLabels();

  return (
    <div className={`timeline-page ${className || ''}`}>
      <Header />
      <Sidebar />

      <MainContentPanel className="pt-16">
        {/* Cover Photo */}
        <div className="cover-section relative h-64 md:h-80 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
          {profileData.coverImage && (
            <img src={profileData.coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/20" />

          {/* Cover Actions */}
          <div className="absolute bottom-4 right-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              Change Cover
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="profile-header bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16 pb-6">
              {/* Profile Avatar */}
              <div className="relative">
                <Avatar
                  src={profileData.avatar}
                  alt={profileData.name}
                  size="2xl"
                  className="ring-4 ring-white dark:ring-gray-800 bg-white dark:bg-gray-800"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2 w-8 h-8 p-0 rounded-full bg-white dark:bg-gray-800"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {profileData.name}
                  </h1>
                  {profileData.isVerified && (
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
                  {getProfileTypeIcon() && (
                    <Badge variant="secondary" size="sm" className="flex items-center space-x-1">
                      {getProfileTypeIcon()}
                      <span className="capitalize">{profileType}</span>
                    </Badge>
                  )}
                </div>

                {profileData.username && (
                  <p className="text-gray-600 dark:text-gray-400">@{profileData.username}</p>
                )}

                {profileData.bio && (
                  <p
                    className={`text-gray-700 dark:text-gray-300 ${!showFullBio ? 'line-clamp-2' : ''}`}
                  >
                    {profileData.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  {profileData.location && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.website && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {profileData.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  {profileData.joinDate && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Joined{' '}
                        {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button variant={isFollowing ? 'outline' : 'primary'} onClick={handleFollow}>
                  {getActionButtonText()}
                </Button>
                {profileType === 'user' && (
                  <Button variant="outline" onClick={handleMessage}>
                    Message
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(profileData.stats?.followers || profileData.stats?.members || 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {statsLabels.primary}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(
                    profileData.stats?.following ||
                      profileData.stats?.likes ||
                      profileData.stats?.attending ||
                      0
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {statsLabels.secondary}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(profileData.stats?.posts || 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {statsLabels.tertiary}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-navigation bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
          <div className="max-w-5xl mx-auto px-4">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCurrentTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    currentTab === tab.key
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {currentTab === 'posts' && (
                <>
                  {canPost && (
                    <CreatePost
                      placeholder={`What's on your mind, ${profileData.name}?`}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow"
                    />
                  )}
                  <PostFeed posts={posts} className="space-y-6" />
                </>
              )}

              {currentTab === 'photos' && (
                <div className="photos-grid grid grid-cols-3 gap-2">
                  {[...Array(12)].map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-300 dark:bg-gray-600 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setShowPhotoGallery(true)}
                    >
                      <img
                        src={`/assets/images/photos/photo-${index + 1}.jpg`}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}

              {currentTab === 'videos' && (
                <div className="videos-grid grid grid-cols-2 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="video-card bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                    >
                      <div className="aspect-video bg-gray-300 dark:bg-gray-600 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white"
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
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                          Video Title {index + 1}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          2 days ago • 1.2K views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentTab === 'about' && (
                <div className="about-section bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <div className="space-y-4">
                    {profileData.bio && (
                      <div>
                        <h4 className="font-medium mb-2">Bio</h4>
                        <p className="text-gray-700 dark:text-gray-300">{profileData.bio}</p>
                      </div>
                    )}
                    {profileData.location && (
                      <div>
                        <h4 className="font-medium mb-2">Location</h4>
                        <p className="text-gray-700 dark:text-gray-300">{profileData.location}</p>
                      </div>
                    )}
                    {profileData.website && (
                      <div>
                        <h4 className="font-medium mb-2">Website</h4>
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {profileData.website}
                        </a>
                      </div>
                    )}
                    {profileData.joinDate && (
                      <div>
                        <h4 className="font-medium mb-2">Joined</h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Profile Views</span>
                    <span className="font-medium">847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Post Impressions</span>
                    <span className="font-medium">12.5K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Search Appearances</span>
                    <span className="font-medium">234</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white">Posted a new photo</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {index + 1} hour{index !== 0 ? 's' : ''} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mutual Connections */}
              {profileType === 'user' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="font-semibold mb-4">Mutual Friends</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="text-center">
                        <Avatar
                          src={`/assets/images/avatars/avatar-${index + 2}.jpg`}
                          alt={`Friend ${index + 1}`}
                          size="md"
                          className="mx-auto mb-1"
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          Friend {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainContentPanel>
    </div>
  );
};

export type { TimelinePageProps };
