import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface AnalyticsPageProps {
  className?: string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'content', label: 'Content' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'revenue', label: 'Revenue' },
  ];

  const overviewStats = [
    {
      title: 'Total Users',
      value: '124,567',
      change: '+12.5%',
      trend: 'up',
      icon: 'users',
    },
    {
      title: 'Active Users (24h)',
      value: '8,945',
      change: '+5.2%',
      trend: 'up',
      icon: 'activity',
    },
    {
      title: 'Posts Created',
      value: '45,123',
      change: '+18.3%',
      trend: 'up',
      icon: 'posts',
    },
    {
      title: 'Engagement Rate',
      value: '68.4%',
      change: '-2.1%',
      trend: 'down',
      icon: 'engagement',
    },
  ];

  const topContent = [
    {
      id: '1',
      title: 'The Future of Web Development: Trends to Watch in 2024',
      author: 'Sarah Johnson',
      type: 'post',
      views: 15420,
      likes: 892,
      comments: 156,
      shares: 234,
    },
    {
      id: '2',
      title: 'Building Sustainable Communities',
      author: 'Michael Chen',
      type: 'post',
      views: 12850,
      likes: 654,
      comments: 98,
      shares: 187,
    },
    {
      id: '3',
      title: 'Design Systems That Scale',
      author: 'Emily Rodriguez',
      type: 'post',
      views: 9876,
      likes: 445,
      comments: 76,
      shares: 123,
    },
  ];

  const topUsers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/assets/images/avatars/avatar-1.jpg',
      followers: 15420,
      posts: 156,
      engagement: 85.2,
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: '/assets/images/avatars/avatar-2.jpg',
      followers: 12850,
      posts: 89,
      engagement: 78.9,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: '/assets/images/avatars/avatar-3.jpg',
      followers: 9876,
      posts: 234,
      engagement: 92.1,
    },
  ];

  const deviceStats = [
    { device: 'Desktop', percentage: 45.2, color: 'bg-blue-600' },
    { device: 'Mobile', percentage: 38.7, color: 'bg-green-600' },
    { device: 'Tablet', percentage: 16.1, color: 'bg-purple-600' },
  ];

  const trafficSources = [
    { source: 'Direct', percentage: 42.1, visitors: 52847 },
    { source: 'Search', percentage: 28.3, visitors: 35492 },
    { source: 'Social', percentage: 18.9, visitors: 23716 },
    { source: 'Referral', percentage: 10.7, visitors: 13425 },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      case 'activity':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case 'posts':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        );
      case 'engagement':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <div key={stat.title} className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {getIcon(stat.icon)}
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-1">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">User Growth</h3>
          <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart Coming Soon</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Engagement Metrics
          </h3>
          <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart Coming Soon</p>
          </div>
        </div>
      </div>

      {/* Device & Traffic Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Device Usage</h3>
          <div className="space-y-4">
            {deviceStats.map((device) => (
              <div key={device.device} className="flex items-center justify-between">
                <span className="text-black dark:text-white font-medium">{device.device}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-slate-700 rounded-full">
                    <div
                      className={`h-2 rounded-full ${device.color}`}
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <span className="text-black dark:text-white font-medium">{source.source}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-black dark:text-white">
                    {source.visitors.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {source.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-8">
      {/* Top Content */}
      <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-6">
          Top Performing Content
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Author
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Views
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Likes
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Comments
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Shares
                </th>
              </tr>
            </thead>
            <tbody>
              {topContent.map((content) => (
                <tr
                  key={content.id}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-black dark:text-white max-w-xs truncate">
                      {content.title}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {content.author}
                  </td>
                  <td className="py-3 px-4 text-sm text-black dark:text-white">
                    {content.views.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-black dark:text-white">{content.likes}</td>
                  <td className="py-3 px-4 text-sm text-black dark:text-white">
                    {content.comments}
                  </td>
                  <td className="py-3 px-4 text-sm text-black dark:text-white">{content.shares}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-8">
      {/* Top Users */}
      <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-6">Top Contributors</h3>
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-black dark:text-white">{user.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.followers.toLocaleString()} followers
                  </p>
                </div>
              </div>

              <div className="flex gap-8 ml-auto">
                <div className="text-center">
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {user.posts}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {user.engagement}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Engagement</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'content':
        return renderContentTab();
      case 'users':
        return renderUsersTab();
      case 'engagement':
        return (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>Engagement analytics coming soon...</p>
          </div>
        );
      case 'revenue':
        return (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>Revenue analytics coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1400px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track performance and gain insights into your platform's growth
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>

            <button className="button bg-primary text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0-6V4m0 6h6m-6 0H6"
                />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm mb-8">
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
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
