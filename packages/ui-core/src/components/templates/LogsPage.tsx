import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface LogsPageProps {
  className?: string;
}

export const LogsPage: React.FC<LogsPageProps> = ({ className = '' }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');

  const logTypes = [
    { id: 'all', label: 'All Logs', count: 1247 },
    { id: 'error', label: 'Errors', count: 23 },
    { id: 'warning', label: 'Warnings', count: 156 },
    { id: 'info', label: 'Info', count: 892 },
    { id: 'auth', label: 'Authentication', count: 234 },
    { id: 'admin', label: 'Admin Actions', count: 67 },
  ];

  const logs = [
    {
      id: '1',
      timestamp: '2024-03-15T14:30:15.123Z',
      level: 'error',
      category: 'authentication',
      message: 'Failed login attempt for user john@example.com',
      details: {
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        endpoint: '/api/auth/login',
        errorCode: 'INVALID_CREDENTIALS',
      },
      user: 'john@example.com',
    },
    {
      id: '2',
      timestamp: '2024-03-15T14:28:42.456Z',
      level: 'warning',
      category: 'rate_limiting',
      message: 'Rate limit exceeded for IP 10.0.0.15',
      details: {
        ip: '10.0.0.15',
        endpoint: '/api/posts/create',
        rateLimit: '100 requests per hour',
        currentCount: 105,
      },
      user: null,
    },
    {
      id: '3',
      timestamp: '2024-03-15T14:25:18.789Z',
      level: 'info',
      category: 'user_action',
      message: 'User created new post',
      details: {
        userId: 'user_123',
        postId: 'post_456',
        contentType: 'text_with_image',
        ip: '192.168.1.50',
      },
      user: 'sarah@example.com',
    },
    {
      id: '4',
      timestamp: '2024-03-15T14:20:33.012Z',
      level: 'error',
      category: 'database',
      message: 'Database connection timeout',
      details: {
        database: 'primary',
        query: 'SELECT * FROM users WHERE id = ?',
        timeout: '5000ms',
        retryAttempt: 3,
      },
      user: null,
    },
    {
      id: '5',
      timestamp: '2024-03-15T14:15:07.345Z',
      level: 'info',
      category: 'admin_action',
      message: 'Admin user banned user account',
      details: {
        adminId: 'admin_001',
        targetUserId: 'user_789',
        reason: 'Spam content violation',
        duration: 'permanent',
      },
      user: 'admin@nexify.com',
    },
  ];

  const getFilteredLogs = () => {
    if (activeFilter === 'all') return logs;
    return logs.filter((log) => {
      switch (activeFilter) {
        case 'error':
          return log.level === 'error';
        case 'warning':
          return log.level === 'warning';
        case 'info':
          return log.level === 'info';
        case 'auth':
          return log.category === 'authentication';
        case 'admin':
          return log.category === 'admin_action';
        default:
          return true;
      }
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'debug':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'database':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'admin_action':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'user_action':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'rate_limiting':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1400px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">System Logs</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor system activity and troubleshoot issues
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Logs
            </button>

            <button className="button bg-primary text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {logTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeFilter === type.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {type.label}
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 rounded-full">
                  {type.count}
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
                  placeholder="Search logs by message, user, or IP address..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Levels</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>

            <select className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Categories</option>
              <option value="authentication">Authentication</option>
              <option value="database">Database</option>
              <option value="admin_action">Admin Actions</option>
              <option value="user_action">User Actions</option>
              <option value="rate_limiting">Rate Limiting</option>
            </select>
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-4">
          {getFilteredLogs().map((log) => (
            <div
              key={log.id}
              className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Timestamp and Level */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm font-mono text-gray-500 dark:text-gray-400 mb-1">
                    {formatTimestamp(log.timestamp)}
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}
                  >
                    {log.level.toUpperCase()}
                  </span>
                </div>

                {/* Log Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(log.category)}`}
                    >
                      {log.category.replace('_', ' ')}
                    </span>
                    {log.user && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {log.user}
                      </span>
                    )}
                  </div>

                  <p className="text-black dark:text-white font-medium mb-3">{log.message}</p>

                  {/* Log Details */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-black dark:text-white mb-2">Details</h4>
                    <div className="space-y-1">
                      {Object.entries(log.details).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="text-sm text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (str) => str.toUpperCase())}
                            :
                          </span>
                          <span className="text-sm text-black dark:text-white font-mono">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View Full Log"
                    >
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>

                    <button
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      title="Copy Log"
                    >
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>

                    {log.level === 'error' && (
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Create Alert"
                      >
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getFilteredLogs().length === 0 && (
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No logs found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No logs match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}

        {/* Load More */}
        {getFilteredLogs().length > 0 && (
          <div className="text-center mt-8">
            <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
              Load More Logs
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LogsPage;
