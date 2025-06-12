import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const [settings, setSettings] = useState({
    // Push Notifications
    pushEnabled: true,
    pushLikes: true,
    pushComments: true,
    pushShares: true,
    pushFriendRequests: true,
    pushMessages: true,
    pushGroupInvites: true,
    pushEventInvites: true,
    pushMentions: true,
    pushPosts: false,

    // Email Notifications
    emailEnabled: true,
    emailDigest: 'weekly',
    emailLikes: false,
    emailComments: true,
    emailShares: false,
    emailFriendRequests: true,
    emailMessages: true,
    emailGroupInvites: true,
    emailEventInvites: true,
    emailMentions: true,
    emailSecurityAlerts: true,
    emailProductUpdates: false,
    emailNewsletter: false,

    // SMS Notifications
    smsEnabled: false,
    smsSecurityAlerts: true,
    smsLoginAlerts: true,

    // In-App Notifications
    inAppEnabled: true,
    inAppSounds: true,
    inAppDesktop: true,
    inAppBadges: true,

    // Quiet Hours
    quietHours: true,
    quietStart: '22:00',
    quietEnd: '08:00',

    // Notification Frequency
    frequency: 'instant',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const notificationTypes = [
    {
      id: 'likes',
      label: 'Likes',
      description: 'When someone likes your posts or comments',
      icon: '❤️',
    },
    {
      id: 'comments',
      label: 'Comments',
      description: 'When someone comments on your posts',
      icon: '💬',
    },
    {
      id: 'shares',
      label: 'Shares',
      description: 'When someone shares your posts',
      icon: '🔄',
    },
    {
      id: 'friendRequests',
      label: 'Friend Requests',
      description: 'When someone sends you a friend request',
      icon: '👥',
    },
    {
      id: 'messages',
      label: 'Messages',
      description: 'When you receive a new message',
      icon: '✉️',
    },
    {
      id: 'groupInvites',
      label: 'Group Invites',
      description: 'When someone invites you to a group',
      icon: '👥',
    },
    {
      id: 'eventInvites',
      label: 'Event Invites',
      description: 'When someone invites you to an event',
      icon: '📅',
    },
    {
      id: 'mentions',
      label: 'Mentions',
      description: 'When someone mentions you in a post or comment',
      icon: '@',
    },
  ];

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[800px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Notification Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage how and when you receive notifications
            </p>
          </div>

          <button className="button bg-primary text-white">Save Changes</button>
        </div>

        <div className="space-y-8">
          {/* Master Controls */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Master Controls
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Push Notifications</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Enable browser and mobile push notifications
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushEnabled}
                    onChange={(e) => handleSettingChange('pushEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Email Notifications</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications via email
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailEnabled}
                    onChange={(e) => handleSettingChange('emailEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">SMS Notifications</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Receive important alerts via SMS
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsEnabled}
                    onChange={(e) => handleSettingChange('smsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Notification Types
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Type
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Push
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notificationTypes.map((type) => (
                    <tr
                      key={type.id}
                      className="border-b border-slate-100 dark:border-slate-700/50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{type.icon}</span>
                          <div>
                            <div className="font-medium text-black dark:text-white">
                              {type.label}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              settings[
                                `push${type.id.charAt(0).toUpperCase() + type.id.slice(1)}` as keyof typeof settings
                              ] as boolean
                            }
                            onChange={(e) =>
                              handleSettingChange(
                                `push${type.id.charAt(0).toUpperCase() + type.id.slice(1)}`,
                                e.target.checked
                              )
                            }
                            disabled={!settings.pushEnabled}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                        </label>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              settings[
                                `email${type.id.charAt(0).toUpperCase() + type.id.slice(1)}` as keyof typeof settings
                              ] as boolean
                            }
                            onChange={(e) =>
                              handleSettingChange(
                                `email${type.id.charAt(0).toUpperCase() + type.id.slice(1)}`,
                                e.target.checked
                              )
                            }
                            disabled={!settings.emailEnabled}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email Preferences */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Email Preferences
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-3">
                  Email Digest Frequency
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: 'instant',
                      label: 'Instant',
                      description: 'Receive emails immediately when events occur',
                    },
                    {
                      value: 'daily',
                      label: 'Daily',
                      description: 'Receive a daily summary email',
                    },
                    {
                      value: 'weekly',
                      label: 'Weekly',
                      description: 'Receive a weekly summary email',
                    },
                    { value: 'never', label: 'Never', description: "Don't send digest emails" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="emailDigest"
                        value={option.value}
                        checked={settings.emailDigest === option.value}
                        onChange={(e) => handleSettingChange('emailDigest', e.target.value)}
                        disabled={!settings.emailEnabled}
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-black dark:text-white">{option.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <div className="font-medium text-black dark:text-white">Security Alerts</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Important security notifications (always enabled)
                    </div>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-medium">Always On</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <div className="font-medium text-black dark:text-white">Product Updates</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      News about new features and improvements
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailProductUpdates}
                      onChange={(e) => handleSettingChange('emailProductUpdates', e.target.checked)}
                      disabled={!settings.emailEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <div className="font-medium text-black dark:text-white">Newsletter</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Monthly newsletter with tips and community highlights
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNewsletter}
                      onChange={(e) => handleSettingChange('emailNewsletter', e.target.checked)}
                      disabled={!settings.emailEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Quiet Hours</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Enable Quiet Hours</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Pause non-urgent notifications during specified hours
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.quietHours}
                    onChange={(e) => handleSettingChange('quietHours', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {settings.quietHours && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={settings.quietStart}
                      onChange={(e) => handleSettingChange('quietStart', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={settings.quietEnd}
                      onChange={(e) => handleSettingChange('quietEnd', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* In-App Preferences */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              In-App Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Sound Effects</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Play sounds for notifications
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.inAppSounds}
                    onChange={(e) => handleSettingChange('inAppSounds', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">
                    Desktop Notifications
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Show desktop notifications when app is in background
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.inAppDesktop}
                    onChange={(e) => handleSettingChange('inAppDesktop', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Notification Badges</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Show unread count badges on navigation items
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.inAppBadges}
                    onChange={(e) => handleSettingChange('inAppBadges', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationSettings;
