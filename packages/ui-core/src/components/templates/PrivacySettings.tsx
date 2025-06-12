import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface PrivacySettingsProps {
  className?: string;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ className = '' }) => {
  const [settings, setSettings] = useState({
    profileVisibility: 'friends',
    postsVisibility: 'friends',
    friendsListVisibility: 'friends',
    emailVisibility: 'none',
    phoneVisibility: 'none',
    onlineStatus: true,
    lastSeen: true,
    readReceipts: true,
    allowTagging: true,
    allowSearchByEmail: false,
    allowSearchByPhone: false,
    allowFriendRequests: true,
    allowGroupInvites: true,
    allowEventInvites: true,
    allowMessages: 'friends',
    blockedUsers: ['user123', 'spammer456'],
    dataProcessing: true,
    marketingEmails: false,
    analyticsTracking: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Anyone can see this' },
    { value: 'friends', label: 'Friends Only', description: 'Only your friends can see this' },
    { value: 'none', label: 'Only Me', description: 'Only you can see this' },
  ];

  const messageOptions = [
    { value: 'everyone', label: 'Everyone', description: 'Anyone can message you' },
    { value: 'friends', label: 'Friends Only', description: 'Only friends can message you' },
    { value: 'none', label: 'No One', description: 'Disable messages' },
  ];

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[800px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Privacy Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Control who can see your information and interact with you
            </p>
          </div>

          <button className="button bg-primary text-white">Save Changes</button>
        </div>

        <div className="space-y-8">
          {/* Profile Visibility */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Profile Visibility
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-3">
                  Who can see your profile?
                </label>
                <div className="space-y-3">
                  {visibilityOptions.map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option.value}
                        checked={settings.profileVisibility === option.value}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-3">
                  Who can see your posts?
                </label>
                <div className="space-y-3">
                  {visibilityOptions.map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="postsVisibility"
                        value={option.value}
                        checked={settings.postsVisibility === option.value}
                        onChange={(e) => handleSettingChange('postsVisibility', e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-3">
                  Who can see your friends list?
                </label>
                <div className="space-y-3">
                  {visibilityOptions.map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="friendsListVisibility"
                        value={option.value}
                        checked={settings.friendsListVisibility === option.value}
                        onChange={(e) =>
                          handleSettingChange('friendsListVisibility', e.target.value)
                        }
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
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-3">
                  Who can see your email address?
                </label>
                <div className="space-y-3">
                  {visibilityOptions.map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="emailVisibility"
                        value={option.value}
                        checked={settings.emailVisibility === option.value}
                        onChange={(e) => handleSettingChange('emailVisibility', e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-3">
                  Who can see your phone number?
                </label>
                <div className="space-y-3">
                  {visibilityOptions.map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="phoneVisibility"
                        value={option.value}
                        checked={settings.phoneVisibility === option.value}
                        onChange={(e) => handleSettingChange('phoneVisibility', e.target.value)}
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
            </div>
          </div>

          {/* Activity & Status */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Activity & Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Show Online Status</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Let others know when you're online
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.onlineStatus}
                    onChange={(e) => handleSettingChange('onlineStatus', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Show Last Seen</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Let others see when you were last active
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.lastSeen}
                    onChange={(e) => handleSettingChange('lastSeen', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Read Receipts</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Let others know when you've read their messages
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.readReceipts}
                    onChange={(e) => handleSettingChange('readReceipts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Interactions */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Interactions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Allow Tagging</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Let others tag you in posts and photos
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowTagging}
                    onChange={(e) => handleSettingChange('allowTagging', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Friend Requests</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Allow others to send you friend requests
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowFriendRequests}
                    onChange={(e) => handleSettingChange('allowFriendRequests', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Group Invites</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Allow others to invite you to groups
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowGroupInvites}
                    onChange={(e) => handleSettingChange('allowGroupInvites', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Event Invites</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Allow others to invite you to events
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowEventInvites}
                    onChange={(e) => handleSettingChange('allowEventInvites', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-3">
                  Who can send you messages?
                </label>
                <div className="space-y-3">
                  {messageOptions.map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="allowMessages"
                        value={option.value}
                        checked={settings.allowMessages === option.value}
                        onChange={(e) => handleSettingChange('allowMessages', e.target.value)}
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
            </div>
          </div>

          {/* Search & Discovery */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Search & Discovery
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">
                    Allow Search by Email
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Let others find you using your email address
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowSearchByEmail}
                    onChange={(e) => handleSettingChange('allowSearchByEmail', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">
                    Allow Search by Phone
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Let others find you using your phone number
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowSearchByPhone}
                    onChange={(e) => handleSettingChange('allowSearchByPhone', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Blocked Users */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Blocked Users</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Blocked users cannot see your profile, send you messages, or interact with your
              content.
            </p>
            <div className="space-y-3">
              {settings.blockedUsers.length > 0 ? (
                settings.blockedUsers.map((user) => (
                  <div
                    key={user}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                  >
                    <span className="font-medium text-black dark:text-white">{user}</span>
                    <button className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                      Unblock
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No blocked users
                </p>
              )}
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Data & Privacy
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Data Processing</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Allow processing of your data to improve our services
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dataProcessing}
                    onChange={(e) => handleSettingChange('dataProcessing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Marketing Emails</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Receive emails about new features and promotions
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Analytics Tracking</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Help us improve by sharing anonymous usage data
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.analyticsTracking}
                    onChange={(e) => handleSettingChange('analyticsTracking', e.target.checked)}
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

export default PrivacySettings;
