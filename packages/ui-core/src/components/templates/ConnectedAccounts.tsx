import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface ConnectedAccountsProps {
  className?: string;
}

export const ConnectedAccounts: React.FC<ConnectedAccountsProps> = ({ className = '' }) => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: '1',
      provider: 'google',
      name: 'Google',
      email: 'john@gmail.com',
      connected: true,
      connectedAt: '2024-01-15T10:30:00Z',
      permissions: ['profile', 'email', 'contacts'],
      avatar: 'https://developers.google.com/identity/images/g-logo.png',
    },
    {
      id: '2',
      provider: 'facebook',
      name: 'Facebook',
      email: 'john@example.com',
      connected: true,
      connectedAt: '2024-02-10T14:20:00Z',
      permissions: ['profile', 'email', 'friends_list'],
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
    },
    {
      id: '3',
      provider: 'twitter',
      name: 'X (Twitter)',
      email: null,
      connected: false,
      connectedAt: null,
      permissions: [],
      avatar: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png',
    },
    {
      id: '4',
      provider: 'linkedin',
      name: 'LinkedIn',
      email: null,
      connected: false,
      connectedAt: null,
      permissions: [],
      avatar:
        'https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg',
    },
    {
      id: '5',
      provider: 'github',
      name: 'GitHub',
      email: 'john@users.noreply.github.com',
      connected: true,
      connectedAt: '2024-03-01T09:15:00Z',
      permissions: ['profile', 'email', 'public_repos'],
      avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    },
  ]);

  const [importSettings, setImportSettings] = useState({
    importContacts: false,
    importPosts: false,
    autoShare: false,
    syncProfile: true,
  });

  const handleConnect = (providerId: string) => {
    setConnectedAccounts((prev) =>
      prev.map((account) =>
        account.id === providerId
          ? {
              ...account,
              connected: true,
              connectedAt: new Date().toISOString(),
              email:
                account.provider === 'twitter' ? '@johndoe' : 'john@' + account.provider + '.com',
              permissions: getDefaultPermissions(account.provider),
            }
          : account
      )
    );
  };

  const handleDisconnect = (providerId: string) => {
    setConnectedAccounts((prev) =>
      prev.map((account) =>
        account.id === providerId
          ? {
              ...account,
              connected: false,
              connectedAt: null,
              email: null,
              permissions: [],
            }
          : account
      )
    );
  };

  const getDefaultPermissions = (provider: string) => {
    switch (provider) {
      case 'google':
        return ['profile', 'email', 'contacts'];
      case 'facebook':
        return ['profile', 'email', 'friends_list'];
      case 'twitter':
        return ['profile', 'tweets'];
      case 'linkedin':
        return ['profile', 'email', 'network'];
      case 'github':
        return ['profile', 'email', 'public_repos'];
      default:
        return ['profile', 'email'];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'border-red-200 dark:border-red-800';
      case 'facebook':
        return 'border-blue-200 dark:border-blue-800';
      case 'twitter':
        return 'border-gray-200 dark:border-gray-800';
      case 'linkedin':
        return 'border-blue-200 dark:border-blue-800';
      case 'github':
        return 'border-gray-200 dark:border-gray-800';
      default:
        return 'border-gray-200 dark:border-gray-800';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        );
      case 'twitter':
        return (
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        );
      case 'linkedin':
        return (
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
        );
      case 'github':
        return (
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[800px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Connected Accounts
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your social media connections and integrations
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Connected Accounts */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Social Accounts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your social media accounts to share content and import your network.
            </p>

            <div className="space-y-4">
              {connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`border rounded-xl p-6 ${getProviderColor(account.provider)} ${
                    account.connected
                      ? 'bg-green-50 dark:bg-green-900/10'
                      : 'bg-white dark:bg-dark3'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getProviderIcon(account.provider)}
                      <div>
                        <div className="font-medium text-black dark:text-white flex items-center gap-2">
                          {account.name}
                          {account.connected && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                              Connected
                            </span>
                          )}
                        </div>
                        {account.connected ? (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {account.email} • Connected {formatDate(account.connectedAt!)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Not connected
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {account.connected ? (
                        <>
                          <button className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                            Settings
                          </button>
                          <button
                            onClick={() => handleDisconnect(account.id)}
                            className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(account.id)}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>

                  {account.connected && account.permissions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="text-sm font-medium text-black dark:text-white mb-2">
                        Permissions granted:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {account.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded"
                          >
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Import Settings */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Import & Sync Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Control what data to import from your connected accounts.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Import Contacts</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Import your contacts from connected social accounts
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importSettings.importContacts}
                    onChange={(e) =>
                      setImportSettings((prev) => ({ ...prev, importContacts: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Import Posts</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Import your recent posts from connected accounts
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importSettings.importPosts}
                    onChange={(e) =>
                      setImportSettings((prev) => ({ ...prev, importPosts: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Auto-Share Posts</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically share your posts to connected accounts
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importSettings.autoShare}
                    onChange={(e) =>
                      setImportSettings((prev) => ({ ...prev, autoShare: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <div className="font-medium text-black dark:text-white">Sync Profile Updates</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Keep your profile information synchronized across accounts
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importSettings.syncProfile}
                    onChange={(e) =>
                      setImportSettings((prev) => ({ ...prev, syncProfile: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Data Management
            </h2>

            <div className="space-y-4">
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black dark:text-white">
                      Export Connected Data
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Download all data imported from connected accounts
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    Export Data
                  </button>
                </div>
              </div>

              <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black dark:text-white">
                      Delete Imported Data
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Remove all data imported from connected accounts
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Delete Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ConnectedAccounts;
