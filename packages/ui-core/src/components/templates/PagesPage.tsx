import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface PagesPageProps {
  className?: string;
}

export const PagesPage: React.FC<PagesPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('discover');

  const tabs = [
    { id: 'discover', label: 'Discover', count: 156 },
    { id: 'liked', label: 'Liked', count: 23 },
    { id: 'managed', label: 'Managed', count: 3 },
  ];

  const pages = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      description: 'Leading technology solutions for modern businesses',
      followers: 45678,
      category: 'Technology',
      verified: true,
      image: '/assets/images/pages/page-1.jpg',
      cover: '/assets/images/pages/cover-1.jpg',
      isLiked: false,
      location: 'San Francisco, CA',
    },
    {
      id: '2',
      name: 'Delicious Restaurant',
      description: 'Authentic cuisine and exceptional dining experience since 1995',
      followers: 12543,
      category: 'Restaurant',
      verified: true,
      image: '/assets/images/pages/page-2.jpg',
      cover: '/assets/images/pages/cover-2.jpg',
      isLiked: true,
      location: 'New York, NY',
    },
    {
      id: '3',
      name: 'Adventure Travel Co.',
      description: 'Explore the world with our guided adventure tours and experiences',
      followers: 28901,
      category: 'Travel',
      verified: false,
      image: '/assets/images/pages/page-3.jpg',
      cover: '/assets/images/pages/cover-3.jpg',
      isLiked: false,
      location: 'Colorado, USA',
    },
  ];

  const categories = [
    'All Categories',
    'Business',
    'Technology',
    'Restaurant',
    'Travel',
    'Entertainment',
    'Sports',
    'Education',
    'Health',
    'Fashion',
  ];

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Pages</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover and follow business pages and organizations
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
            Create Page
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
                  placeholder="Search pages..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase().replace(' ', '')}>
                  {category}
                </option>
              ))}
            </select>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">Sort by</option>
              <option value="followers">Most Followers</option>
              <option value="recent">Recently Added</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Page Cover */}
              <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500">
                <img
                  src={page.cover}
                  alt={`${page.name} cover`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Page Info */}
              <div className="p-6">
                {/* Page Avatar and Name */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative -mt-8">
                    <img
                      src={page.image}
                      alt={page.name}
                      className="w-16 h-16 rounded-xl border-4 border-white dark:border-dark3 object-cover"
                    />
                    {page.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black dark:text-white mb-1 flex items-center gap-2">
                      {page.name}
                      {page.verified && (
                        <span className="text-blue-600 dark:text-blue-400">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {page.description}
                    </p>
                  </div>
                </div>

                {/* Page Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{page.followers.toLocaleString()} followers</span>
                  <span>{page.location}</span>
                </div>

                {/* Category and Action */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {page.category}
                  </span>

                  {page.isLiked ? (
                    <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Liked
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
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
                      Like
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
            Load More Pages
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PagesPage;
