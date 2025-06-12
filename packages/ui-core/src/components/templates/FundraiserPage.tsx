import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface FundraiserPageProps {
  className?: string;
}

export const FundraiserPage: React.FC<FundraiserPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('discover');

  const tabs = [
    { id: 'discover', label: 'Discover', count: 89 },
    { id: 'donated', label: 'Donated', count: 12 },
    { id: 'created', label: 'Created', count: 3 },
    { id: 'following', label: 'Following', count: 8 },
  ];

  const fundraisers = [
    {
      id: '1',
      title: 'Help Build Schools in Rural Communities',
      description:
        'Supporting education infrastructure in underserved areas to give children access to quality education and better futures.',
      organizer: 'Education Foundation',
      organizerAvatar: '/assets/images/avatars/avatar-1.jpg',
      organizerVerified: true,
      category: 'Education',
      location: 'Global',
      goal: 50000,
      raised: 34750,
      currency: 'USD',
      donors: 423,
      daysLeft: 18,
      image: '/assets/images/fundraisers/education.jpg',
      gallery: [
        '/assets/images/fundraisers/education-1.jpg',
        '/assets/images/fundraisers/education-2.jpg',
      ],
      isDonated: false,
      isFollowing: true,
      createdAt: '2024-02-15',
      featured: true,
    },
    {
      id: '2',
      title: 'Emergency Medical Fund for Local Family',
      description:
        'Supporting the Johnson family with urgent medical expenses after a serious accident. Every contribution helps.',
      organizer: 'Sarah Mitchell',
      organizerAvatar: '/assets/images/avatars/avatar-2.jpg',
      organizerVerified: false,
      category: 'Medical',
      location: 'San Francisco, CA',
      goal: 25000,
      raised: 18920,
      currency: 'USD',
      donors: 156,
      daysLeft: 45,
      image: '/assets/images/fundraisers/medical.jpg',
      gallery: ['/assets/images/fundraisers/medical-1.jpg'],
      isDonated: true,
      isFollowing: false,
      createdAt: '2024-02-10',
      featured: false,
    },
    {
      id: '3',
      title: 'Wildlife Conservation Project',
      description:
        'Protecting endangered species and their habitats through research, education, and conservation efforts.',
      organizer: 'Wildlife Conservation Society',
      organizerAvatar: '/assets/images/avatars/avatar-3.jpg',
      organizerVerified: true,
      category: 'Environment',
      location: 'Africa',
      goal: 100000,
      raised: 67890,
      currency: 'USD',
      donors: 892,
      daysLeft: 32,
      image: '/assets/images/fundraisers/wildlife.jpg',
      gallery: [
        '/assets/images/fundraisers/wildlife-1.jpg',
        '/assets/images/fundraisers/wildlife-2.jpg',
        '/assets/images/fundraisers/wildlife-3.jpg',
      ],
      isDonated: false,
      isFollowing: true,
      createdAt: '2024-01-20',
      featured: true,
    },
  ];

  const categories = [
    'All Categories',
    'Medical',
    'Education',
    'Environment',
    'Emergency',
    'Community',
    'Animals',
    'Sports',
    'Arts',
    'Technology',
  ];

  const calculateProgress = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Fundraisers</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Support causes you care about and make a difference
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
            Start Fundraiser
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
                  placeholder="Search fundraisers..."
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
              <option value="trending">Trending</option>
              <option value="recent">Most Recent</option>
              <option value="ending">Ending Soon</option>
              <option value="funded">Most Funded</option>
            </select>
          </div>
        </div>

        {/* Fundraisers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fundraisers
            .filter((fundraiser) => {
              if (activeTab === 'donated') return fundraiser.isDonated;
              if (activeTab === 'following') return fundraiser.isFollowing;
              return true;
            })
            .map((fundraiser) => (
              <div
                key={fundraiser.id}
                className="bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Fundraiser Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-slate-700">
                  <img
                    src={fundraiser.image}
                    alt={fundraiser.title}
                    className="w-full h-full object-cover"
                  />
                  {fundraiser.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs bg-white/90 text-gray-800 rounded-full">
                      {fundraiser.daysLeft} days left
                    </span>
                  </div>
                </div>

                {/* Fundraiser Content */}
                <div className="p-6">
                  {/* Category and Location */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                      {fundraiser.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {fundraiser.location}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-semibold text-black dark:text-white mb-2 line-clamp-2">
                    {fundraiser.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {fundraiser.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(fundraiser.raised, fundraiser.currency)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        of {formatCurrency(fundraiser.goal, fundraiser.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${calculateProgress(fundraiser.raised, fundraiser.goal)}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        {Math.round(calculateProgress(fundraiser.raised, fundraiser.goal))}% funded
                      </span>
                      <span>{fundraiser.donors} donors</span>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={fundraiser.organizerAvatar}
                      alt={fundraiser.organizer}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black dark:text-white truncate flex items-center gap-1">
                        {fundraiser.organizer}
                        {fundraiser.organizerVerified && (
                          <svg
                            className="w-4 h-4 text-blue-600 dark:text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Created {formatDate(fundraiser.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {fundraiser.isDonated ? (
                      <button className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg">
                        Donated ✓
                      </button>
                    ) : (
                      <button className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Donate Now
                      </button>
                    )}
                    <button
                      className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                        fundraiser.isFollowing
                          ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-400'
                          : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {fundraiser.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
            Load More Fundraisers
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FundraiserPage;
