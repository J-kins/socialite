import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface ContentModerationProps {
  className?: string;
}

export const ContentModeration: React.FC<ContentModerationProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const tabs = [
    { id: 'pending', label: 'Pending Review', count: 23 },
    { id: 'investigating', label: 'Investigating', count: 8 },
    { id: 'resolved', label: 'Resolved', count: 156 },
    { id: 'escalated', label: 'Escalated', count: 5 },
  ];

  const reports = [
    {
      id: '1',
      type: 'spam',
      priority: 'high',
      status: 'pending',
      content: {
        type: 'post',
        text: 'Buy cheap followers now! Visit our website for amazing deals...',
        image: '/assets/images/posts/spam-post.jpg',
        author: 'SpamAccount123',
        authorAvatar: '/assets/images/avatars/avatar-spam.jpg',
      },
      reporter: {
        name: 'John Doe',
        avatar: '/assets/images/avatars/avatar-1.jpg',
      },
      reason: 'This post contains spam content promoting fake follower services',
      reportedAt: '2024-03-15T14:30:00Z',
      assignedTo: null,
      tags: ['spam', 'promotional', 'fake-services'],
    },
    {
      id: '2',
      type: 'harassment',
      priority: 'critical',
      status: 'investigating',
      content: {
        type: 'comment',
        text: 'You are so stupid and ugly. Nobody likes you. Just kill yourself...',
        author: 'TrollUser456',
        authorAvatar: '/assets/images/avatars/avatar-troll.jpg',
      },
      reporter: {
        name: 'Jane Smith',
        avatar: '/assets/images/avatars/avatar-2.jpg',
      },
      reason: 'Severe bullying and harassment in comments',
      reportedAt: '2024-03-15T12:15:00Z',
      assignedTo: 'Moderator Mike',
      tags: ['harassment', 'bullying', 'threatening'],
    },
    {
      id: '3',
      type: 'misinformation',
      priority: 'medium',
      status: 'pending',
      content: {
        type: 'post',
        text: "COVID vaccines contain microchips to track you. Don't get vaccinated!",
        author: 'ConspiracyTheory99',
        authorAvatar: '/assets/images/avatars/avatar-conspiracy.jpg',
      },
      reporter: {
        name: 'Dr. Sarah Wilson',
        avatar: '/assets/images/avatars/avatar-3.jpg',
      },
      reason: 'Spreading dangerous medical misinformation',
      reportedAt: '2024-03-15T10:45:00Z',
      assignedTo: null,
      tags: ['misinformation', 'health', 'conspiracy'],
    },
    {
      id: '4',
      type: 'inappropriate_content',
      priority: 'high',
      status: 'resolved',
      content: {
        type: 'image',
        text: 'Beach party vibes! 🔥',
        image: '/assets/images/posts/inappropriate.jpg',
        author: 'PartyGirl21',
        authorAvatar: '/assets/images/avatars/avatar-party.jpg',
      },
      reporter: {
        name: 'Parent Concerned',
        avatar: '/assets/images/avatars/avatar-4.jpg',
      },
      reason: 'Inappropriate content visible to minors',
      reportedAt: '2024-03-14T16:20:00Z',
      assignedTo: 'Moderator Lisa',
      resolution: 'Content flagged as 18+ and age-gated',
      tags: ['inappropriate', 'adult-content', 'age-restriction'],
    },
  ];

  const getFilteredReports = () => {
    return reports.filter((report) => report.status === activeTab);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'spam':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'harassment':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'misinformation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'inappropriate_content':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
      case 'copyright':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = getFilteredReports().map((report) => report.id);
    setSelectedReports(selectedReports.length === filteredIds.length ? [] : filteredIds);
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1400px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Content Moderation
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Review and moderate reported content to maintain community standards
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Moderation Settings
            </button>
            <button className="button bg-primary text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              View Reports
            </button>
          </div>
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

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
                <option value="">All Types</option>
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="misinformation">Misinformation</option>
                <option value="inappropriate_content">Inappropriate Content</option>
                <option value="copyright">Copyright</option>
              </select>

              <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
                <option value="">All Moderators</option>
                <option value="mike">Moderator Mike</option>
                <option value="lisa">Moderator Lisa</option>
                <option value="alex">Moderator Alex</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>

            {selectedReports.length > 0 && (
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Approve
                </button>
                <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Remove
                </button>
                <button className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  Escalate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {getFilteredReports().map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedReports.includes(report.id)}
                  onChange={() => handleSelectReport(report.id)}
                  className="mt-1 rounded border-gray-300 dark:border-slate-600"
                />

                {/* Report Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}
                      >
                        {report.type.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}
                      >
                        {report.priority} priority
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Reported {formatTimeAgo(report.reportedAt)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {report.id}</div>
                  </div>

                  {/* Reported Content */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={report.content.authorAvatar}
                        alt={report.content.author}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-black dark:text-white">
                            {report.content.author}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {report.content.type}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-2">
                          {report.content.text}
                        </p>
                        {report.content.image && (
                          <img
                            src={report.content.image}
                            alt="Reported content"
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-black dark:text-white mb-2">Reporter</h4>
                      <div className="flex items-center gap-2">
                        <img
                          src={report.reporter.avatar}
                          alt={report.reporter.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {report.reporter.name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-black dark:text-white mb-2">Assigned To</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {report.assignedTo || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  {/* Report Reason */}
                  <div className="mt-4">
                    <h4 className="font-medium text-black dark:text-white mb-2">Reason</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{report.reason}</p>
                  </div>

                  {/* Tags */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {report.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resolution (for resolved reports) */}
                  {report.resolution && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-400 mb-1">
                        Resolution
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {report.resolution}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {activeTab === 'pending' && (
                    <div className="flex gap-2 mt-6">
                      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Approve Content
                      </button>
                      <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Remove Content
                      </button>
                      <button className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        Warn User
                      </button>
                      <button className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        Escalate
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        Assign to Me
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getFilteredReports().length === 0 && (
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              All caught up! No {activeTab} reports at the moment.
            </p>
          </div>
        )}

        {/* Load More */}
        {getFilteredReports().length > 0 && (
          <div className="text-center mt-8">
            <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
              Load More Reports
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ContentModeration;
