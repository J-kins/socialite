import React, { useState } from 'react';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';
import { MainContentPanel } from '../organisms/MainContentPanel';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { StickyTabsNav } from '../organisms/StickyTabsNav';
import '../../../styles/templates/general-settings-page.css';

export interface GeneralSettingsPageProps {
  activeSection?: string;
  sections?: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    badge?: string;
  }>;
  className?: string;
}

export const GeneralSettingsPage: React.FC<GeneralSettingsPageProps> = ({
  activeSection = 'general',
  sections = [
    {
      id: 'general',
      title: 'General',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: 'account',
      title: 'Account',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: 'security',
      title: 'Security',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
      badge: '2FA',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: 'billing',
      title: 'Billing',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: 'advanced',
      title: 'Advanced',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM15 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z" />
        </svg>
      ),
    },
  ],
  className,
}) => {
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC-5');

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      <div className="settings-section">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              defaultValue="John Smith"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              defaultValue="johnsmith"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              defaultValue="Digital creator and social enthusiast. Sharing moments that matter."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred language
              </p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Timezone
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Set your local timezone</p>
            </div>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">GMT (UTC+0)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-8">
      <div className="settings-section">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="text-lg font-semibold mb-4">Account Status</h3>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <Badge variant="success" className="mr-3">
              Verified
            </Badge>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Your account is verified
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                All features are available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">Deactivate Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Temporarily disable your account. You can reactivate it anytime.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                Deactivate Account
              </Button>
            </div>
            <div className="pt-4 border-t border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-800 dark:text-red-200">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Permanently delete your account and all associated data. This action cannot be
                undone.
              </p>
              <Button variant="danger" size="sm" className="mt-2">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-8">
      <div className="settings-section">
        <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
        <div className="space-y-4">
          {[
            {
              label: 'Profile is public',
              description: 'Anyone can see your profile',
              checked: true,
            },
            {
              label: 'Show online status',
              description: "Let others see when you're online",
              checked: false,
            },
            {
              label: 'Show activity status',
              description: 'Let others see your recent activity',
              checked: true,
            },
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {setting.label}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={setting.checked}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="text-lg font-semibold mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Download your data
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get a copy of all your data
              </p>
            </div>
            <Button variant="outline" size="sm">
              Download
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Data portability
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transfer your data to another service
              </p>
            </div>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'general':
        return renderGeneralSettings();
      case 'account':
        return renderAccountSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'security':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Security settings content</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Notification settings content</p>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-8">
            <div className="settings-section">
              <h3 className="text-lg font-semibold mb-4">Theme</h3>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Billing settings content</p>
          </div>
        );
      case 'advanced':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Advanced settings content</p>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className={`general-settings-page ${className || ''}`}>
      <Header />
      <Sidebar />

      <MainContentPanel className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account preferences and privacy settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentSection === section.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      {section.icon}
                      <span className="ml-3">{section.title}</span>
                    </div>
                    {section.badge && (
                      <Badge variant="secondary" size="sm">
                        {section.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {renderContent()}

                {/* Save Actions */}
                <div className="flex justify-end space-x-3 pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="primary">Save Changes</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContentPanel>
    </div>
  );
};

export type { GeneralSettingsPageProps };
