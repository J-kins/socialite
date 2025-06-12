import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface GroupsPageProps {
  className?: string;
}

export const GroupsPage: React.FC<GroupsPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('discover');

  const tabs = [
    { id: 'discover', label: 'Discover', count: 24 },
    { id: 'joined', label: 'Joined', count: 8 },
    { id: 'managed', label: 'Managed', count: 2 },
    { id: 'invites', label: 'Invites', count: 3 },
  ];

  const groups = [
    {
      id: '1',
      name: 'Photography Enthusiasts',
      description: 'Share your best shots and learn from fellow photographers',
      members: 12543,
      posts: 892,
      image: '/assets/images/group/group-1.jpg',
      category: 'Photography',
      privacy: 'Public',
      isJoined: false,
    },
    {
      id: '2',
      name: 'Web Developers Unite',
      description: 'Latest trends, tips, and discussions about web development',
      members: 8921,
      posts: 1247,
      image: '/assets/images/group/group-2.jpg',
      category: 'Technology',
      privacy: 'Public',
      isJoined: true,
    },
    {
      id: '3',
      name: 'Healthy Living',
      description: 'Tips for a healthier lifestyle, recipes, and fitness motivation',
      members: 15632,
      posts: 2156,
      image: '/assets/images/group/group-3.jpg',
      category: 'Health',
      privacy: 'Private',
      isJoined: false,
    },
  ];

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Groups</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover and join communities of like-minded people
            </p>
          </div>
          <button className="button bg-primary text-white">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Group
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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
                  placeholder="Search groups..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="photography">Photography</option>
              <option value="health">Health & Fitness</option>
              <option value="business">Business</option>
              <option value="arts">Arts & Culture</option>
            </select>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Privacy</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Group Cover */}
              <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500">
                <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      group.privacy === 'Public'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {group.privacy}
                  </span>
                </div>
              </div>

              {/* Group Info */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="font-semibold text-black dark:text-white mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {group.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{group.members.toLocaleString()} members</span>
                  <span>{group.posts} posts</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {group.category}
                  </span>

                  {group.isJoined ? (
                    <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                      Joined ✓
                    </button>
                  ) : (
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Join Group
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
            Load More Groups
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default GroupsPage;
