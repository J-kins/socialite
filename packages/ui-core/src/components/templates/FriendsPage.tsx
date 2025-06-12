import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface FriendsPageProps {
  className?: string;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Friends', count: 1247 },
    { id: 'online', label: 'Online', count: 89 },
    { id: 'requests', label: 'Requests', count: 12 },
    { id: 'suggestions', label: 'Suggestions', count: 24 },
    { id: 'blocked', label: 'Blocked', count: 3 },
  ];

  const friends = [
    {
      id: '1',
      name: 'Sarah Johnson',
      username: '@sarah.johnson',
      avatar: '/assets/images/avatars/avatar-1.jpg',
      cover: '/assets/images/covers/cover-1.jpg',
      bio: 'UX Designer passionate about creating meaningful digital experiences',
      location: 'San Francisco, CA',
      mutualFriends: 23,
      isOnline: true,
      lastSeen: null,
      status: 'friend',
      friendsSince: '2023-06-15',
      workplace: 'TechCorp',
      education: 'Stanford University',
      interests: ['Design', 'Photography', 'Travel'],
    },
    {
      id: '2',
      name: 'Michael Chen',
      username: '@mchen',
      avatar: '/assets/images/avatars/avatar-2.jpg',
      cover: '/assets/images/covers/cover-2.jpg',
      bio: 'Full-stack developer | Coffee enthusiast | Dog lover',
      location: 'New York, NY',
      mutualFriends: 45,
      isOnline: false,
      lastSeen: '2 hours ago',
      status: 'friend',
      friendsSince: '2023-08-22',
      workplace: 'StartupXYZ',
      education: 'MIT',
      interests: ['Programming', 'Gaming', 'Music'],
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      username: '@emily.r',
      avatar: '/assets/images/avatars/avatar-3.jpg',
      cover: '/assets/images/covers/cover-3.jpg',
      bio: 'Marketing strategist helping brands tell their stories',
      location: 'Los Angeles, CA',
      mutualFriends: 18,
      isOnline: true,
      lastSeen: null,
      status: 'request_received',
      friendsSince: null,
      workplace: 'Creative Agency',
      education: 'UCLA',
      interests: ['Marketing', 'Art', 'Fitness'],
    },
    {
      id: '4',
      name: 'David Kim',
      username: '@davidk',
      avatar: '/assets/images/avatars/avatar-4.jpg',
      cover: '/assets/images/covers/cover-4.jpg',
      bio: 'Product manager building the future of social media',
      location: 'Seattle, WA',
      mutualFriends: 12,
      isOnline: false,
      lastSeen: '1 day ago',
      status: 'suggestion',
      friendsSince: null,
      workplace: 'BigTech Corp',
      education: 'University of Washington',
      interests: ['Product Management', 'Hiking', 'Tech'],
    },
  ];

  const formatFriendsSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const getFilteredFriends = () => {
    switch (activeTab) {
      case 'online':
        return friends.filter((friend) => friend.isOnline && friend.status === 'friend');
      case 'requests':
        return friends.filter((friend) => friend.status === 'request_received');
      case 'suggestions':
        return friends.filter((friend) => friend.status === 'suggestion');
      case 'blocked':
        return friends.filter((friend) => friend.status === 'blocked');
      default:
        return friends.filter((friend) => friend.status === 'friend');
    }
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Friends</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your friendships and discover new connections
            </p>
          </div>
          <button className="button bg-primary text-white">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Find Friends
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search friends..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Locations</option>
              <option value="sf">San Francisco</option>
              <option value="ny">New York</option>
              <option value="la">Los Angeles</option>
              <option value="seattle">Seattle</option>
            </select>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">Sort by</option>
              <option value="name">Name A-Z</option>
              <option value="recent">Recently Added</option>
              <option value="online">Online First</option>
              <option value="mutual">Most Mutual Friends</option>
            </select>
          </div>
        </div>

        {/* Friends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredFriends().map((friend) => (
            <div
              key={friend.id}
              className="bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Cover and Avatar */}
              <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500">
                <img
                  src={friend.cover}
                  alt={`${friend.name} cover`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-16 h-16 rounded-xl border-4 border-white dark:border-dark3 object-cover"
                    />
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-dark3 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-10 p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-black dark:text-white mb-1">{friend.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">{friend.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {friend.bio}
                  </p>
                </div>

                {/* Status and Info */}
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {friend.location}
                  </div>

                  {friend.status === 'friend' && (
                    <>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {friend.mutualFriends} mutual friends
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {friend.isOnline ? 'Online now' : `Last seen ${friend.lastSeen}`}
                      </div>
                      {friend.friendsSince && (
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          Friends since {formatFriendsSince(friend.friendsSince)}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {friend.interests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {friend.status === 'friend' && (
                    <>
                      <button className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Message
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {friend.status === 'request_received' && (
                    <>
                      <button className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Accept
                      </button>
                      <button className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        Decline
                      </button>
                    </>
                  )}

                  {friend.status === 'suggestion' && (
                    <>
                      <button className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add Friend
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
            Load More Friends
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FriendsPage;
