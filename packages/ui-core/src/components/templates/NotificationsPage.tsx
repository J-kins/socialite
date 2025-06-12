import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface NotificationsPageProps {
  className?: string;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const tabs = [
    { id: 'all', label: 'All', count: 47 },
    { id: 'unread', label: 'Unread', count: 12 },
    { id: 'mentions', label: 'Mentions', count: 5 },
    { id: 'friends', label: 'Friends', count: 8 },
    { id: 'groups', label: 'Groups', count: 3 },
  ];

  const notifications = [
    {
      id: '1',
      type: 'like',
      title: 'Sarah Johnson liked your post',
      description: 'About "The Future of Web Development: Trends to Watch in 2024"',
      avatar: '/assets/images/avatars/avatar-1.jpg',
      timestamp: '2 minutes ago',
      isRead: false,
      actionUrl: '/posts/123',
      category: 'activity',
    },
    {
      id: '2',
      type: 'comment',
      title: 'Michael Chen commented on your post',
      description: '"Great insights! I particularly agree with your point about AI integration..."',
      avatar: '/assets/images/avatars/avatar-2.jpg',
      timestamp: '15 minutes ago',
      isRead: false,
      actionUrl: '/posts/123#comment-456',
      category: 'activity',
    },
    {
      id: '3',
      type: 'friend_request',
      title: 'Emily Rodriguez sent you a friend request',
      description: 'You have 5 mutual friends',
      avatar: '/assets/images/avatars/avatar-3.jpg',
      timestamp: '1 hour ago',
      isRead: false,
      actionUrl: '/friends/requests',
      category: 'friends',
    },
    {
      id: '4',
      type: 'mention',
      title: 'David Kim mentioned you in a comment',
      description: 'In the post "Building Sustainable Communities"',
      avatar: '/assets/images/avatars/avatar-4.jpg',
      timestamp: '3 hours ago',
      isRead: true,
      actionUrl: '/posts/456#mention',
      category: 'mentions',
    },
    {
      id: '5',
      type: 'group_invite',
      title: 'You were invited to join "Web Developers Unite"',
      description: 'Invited by Alex Thompson',
      avatar: '/assets/images/group/group-1.jpg',
      timestamp: '6 hours ago',
      isRead: false,
      actionUrl: '/groups/invites',
      category: 'groups',
    },
    {
      id: '6',
      type: 'event_reminder',
      title: 'Tech Conference 2024 is starting tomorrow',
      description: "Don't forget to check in at 9:00 AM",
      avatar: '/assets/images/events/event-1.jpg',
      timestamp: '1 day ago',
      isRead: true,
      actionUrl: '/events/123',
      category: 'events',
    },
    {
      id: '7',
      type: 'birthday',
      title: 'Jessica Williams has a birthday today',
      description: 'Send her a birthday message!',
      avatar: '/assets/images/avatars/avatar-5.jpg',
      timestamp: '1 day ago',
      isRead: true,
      actionUrl: '/profile/jessica',
      category: 'friends',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return (
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-red-600 dark:text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        );
      case 'friend_request':
        return (
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
        );
      case 'group_invite':
        return (
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-yellow-600 dark:text-yellow-400"
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
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM4 19h11a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter((n) => !n.isRead);
      case 'mentions':
        return notifications.filter((n) => n.category === 'mentions');
      case 'friends':
        return notifications.filter((n) => n.category === 'friends');
      case 'groups':
        return notifications.filter((n) => n.category === 'groups');
      default:
        return notifications;
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = getFilteredNotifications().map((n) => n.id);
    setSelectedNotifications(
      selectedNotifications.length === filteredIds.length ? [] : filteredIds
    );
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[800px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with your latest activities and interactions
            </p>
          </div>
          <div className="flex gap-2">
            <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              Settings
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

        {/* Actions Bar */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === getFilteredNotifications().length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 dark:border-slate-600"
                />
                Select All
              </button>
              {selectedNotifications.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedNotifications.length} selected
                </span>
              )}
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Mark as Read
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {getFilteredNotifications().map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-dark3 rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ${
                !notification.isRead ? 'border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                  className="mt-1 rounded border-gray-300 dark:border-slate-600"
                />

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={notification.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3
                      className={`font-medium ${!notification.isRead ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {notification.description}
                  </p>

                  {/* Actions for specific notification types */}
                  {notification.type === 'friend_request' && (
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Accept
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        Decline
                      </button>
                    </div>
                  )}

                  {notification.type === 'group_invite' && (
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Join Group
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        Decline
                      </button>
                    </div>
                  )}
                </div>

                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getFilteredNotifications().length === 0 && (
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
                  d="M15 17h5l-5 5v-5zM4 19h11a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              You're all caught up! Check back later for new updates.
            </p>
          </div>
        )}

        {/* Load More */}
        {getFilteredNotifications().length > 0 && (
          <div className="text-center mt-8">
            <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
