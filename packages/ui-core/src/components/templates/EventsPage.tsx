import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface EventsPageProps {
  className?: string;
}

export const EventsPage: React.FC<EventsPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('discover');
  const [viewMode, setViewMode] = useState('grid');

  const tabs = [
    { id: 'discover', label: 'Discover', count: 89 },
    { id: 'going', label: 'Going', count: 12 },
    { id: 'interested', label: 'Interested', count: 24 },
    { id: 'hosting', label: 'Hosting', count: 2 },
  ];

  const events = [
    {
      id: '1',
      title: 'Tech Conference 2024',
      description: 'Join industry leaders for the biggest tech conference of the year',
      date: '2024-03-15',
      time: '09:00 AM',
      location: 'San Francisco Convention Center',
      image: '/assets/images/events/event-1.jpg',
      going: 1247,
      interested: 892,
      category: 'Technology',
      price: 'Paid',
      organizer: 'TechCorp Events',
      status: 'going',
    },
    {
      id: '2',
      title: 'Photography Workshop',
      description: 'Learn advanced photography techniques from professional photographers',
      date: '2024-03-22',
      time: '02:00 PM',
      location: 'Downtown Art Studio',
      image: '/assets/images/events/event-2.jpg',
      going: 45,
      interested: 128,
      category: 'Arts',
      price: 'Free',
      organizer: 'Photo Academy',
      status: 'interested',
    },
    {
      id: '3',
      title: 'Startup Networking Mixer',
      description: 'Connect with entrepreneurs, investors, and innovators in your area',
      date: '2024-03-18',
      time: '06:30 PM',
      location: 'Innovation Hub',
      image: '/assets/images/events/event-3.jpg',
      going: 156,
      interested: 234,
      category: 'Business',
      price: 'Free',
      organizer: 'Startup Community',
      status: null,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1200px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Events</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover exciting events happening around you
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
            Create Event
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
          <div className="flex flex-col lg:flex-row gap-4">
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
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="arts">Arts & Culture</option>
              <option value="sports">Sports</option>
              <option value="education">Education</option>
            </select>
            <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="thisweek">This Week</option>
              <option value="nextweek">Next Week</option>
              <option value="thismonth">This Month</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid/List */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {events.map((event) => (
            <div
              key={event.id}
              className={`bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex gap-4 p-4' : ''
              }`}
            >
              {/* Event Image */}
              <div
                className={`relative ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48'} bg-gradient-to-r from-blue-400 to-purple-500`}
              >
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <div className="bg-white dark:bg-dark3 rounded-lg p-2 text-center shadow-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {formatDate(event.date).split(' ')[0]}
                    </div>
                    <div className="text-lg font-bold text-black dark:text-white">
                      {formatDate(event.date).split(' ')[2]}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(event.date).split(' ')[1]}
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      event.price === 'Free'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {event.price}
                  </span>
                </div>
              </div>

              {/* Event Info */}
              <div className={`${viewMode === 'list' ? 'flex-1' : 'p-6'}`}>
                <div className="mb-3">
                  <h3 className="font-semibold text-black dark:text-white mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {event.time}
                  </div>
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
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{event.going} going</span>
                    <span>•</span>
                    <span>{event.interested} interested</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {event.category}
                  </span>

                  <div className="flex gap-2">
                    {event.status === 'going' ? (
                      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg">
                        Going ✓
                      </button>
                    ) : event.status === 'interested' ? (
                      <button className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg">
                        Interested ⭐
                      </button>
                    ) : (
                      <>
                        <button className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                          Interested
                        </button>
                        <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Going
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
            Load More Events
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventsPage;
