import React, { useState } from "react";
import { Avatar, Button, Icon, Input, Switch } from "../atoms";

export interface SettingsPanelProps {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      posts: boolean;
      comments: boolean;
      likes: boolean;
      follows: boolean;
      mentions: boolean;
      messages: boolean;
    };
    privacy: {
      profileVisibility: "public" | "friends" | "private";
      searchable: boolean;
      showEmail: boolean;
      showPhone: boolean;
      allowMessages: "everyone" | "friends" | "none";
      allowTagging: boolean;
    };
    account: {
      twoFactor: boolean;
      loginAlerts: boolean;
      dataDownload: boolean;
    };
  };
  onUpdateProfile?: (profileData: any) => void;
  onUpdateSettings?: (settingsData: any) => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => void;
  onDeactivateAccount?: () => void;
  onDeleteAccount?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  user,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onChangePassword,
  onDeactivateAccount,
  onDeleteAccount,
  onLogout,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [localSettings, setLocalSettings] = useState(settings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: "person" },
    { id: "privacy", label: "Privacy", icon: "shield-checkmark" },
    { id: "notifications", label: "Notifications", icon: "notifications" },
    { id: "security", label: "Security", icon: "lock-closed" },
    { id: "account", label: "Account", icon: "settings" },
  ];

  const handleProfileUpdate = () => {
    onUpdateProfile?.(profileData);
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match");
      return;
    }
    onChangePassword?.(passwordData.current, passwordData.new);
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleSettingsUpdate = (category: string, key: string, value: any) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings?.[category as keyof typeof localSettings],
        [key]: value,
      },
    };
    setLocalSettings(newSettings);
    onUpdateSettings?.(newSettings);
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Profile Information
        </h3>

        {/* Avatar */}
        <div className="flex items-center space-x-4 mb-6">
          <Avatar src={user?.avatar} alt={user?.name} size="xl" />
          <div>
            <Button variant="outline" size="sm">
              <Icon name="camera" className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              JPG, GIF or PNG. Max size 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <Input
              value={profileData.name}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <Input
              value={profileData.location}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="Enter your location"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <Input
              type="url"
              value={profileData.website}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, website: e.target.value }))
              }
              placeholder="Enter your website URL"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Tell people about yourself..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {profileData.bio.length}/500 characters
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleProfileUpdate}
          className="mt-4"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Privacy Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Profile Visibility
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Who can see your profile
              </p>
            </div>
            <select
              value={localSettings?.privacy?.profileVisibility || "public"}
              onChange={(e) =>
                handleSettingsUpdate(
                  "privacy",
                  "profileVisibility",
                  e.target.value,
                )
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="public">Public</option>
              <option value="friends">Friends only</option>
              <option value="private">Only me</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Searchable
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow people to find you in search
              </p>
            </div>
            <Switch
              checked={localSettings?.privacy?.searchable || false}
              onChange={(checked) =>
                handleSettingsUpdate("privacy", "searchable", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Show Email
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Display email on your profile
              </p>
            </div>
            <Switch
              checked={localSettings?.privacy?.showEmail || false}
              onChange={(checked) =>
                handleSettingsUpdate("privacy", "showEmail", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Show Phone
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Display phone number on your profile
              </p>
            </div>
            <Switch
              checked={localSettings?.privacy?.showPhone || false}
              onChange={(checked) =>
                handleSettingsUpdate("privacy", "showPhone", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Messages
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Who can send you messages
              </p>
            </div>
            <select
              value={localSettings?.privacy?.allowMessages || "friends"}
              onChange={(e) =>
                handleSettingsUpdate("privacy", "allowMessages", e.target.value)
              }
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="everyone">Everyone</option>
              <option value="friends">Friends only</option>
              <option value="none">No one</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Allow Tagging
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Let others tag you in posts
              </p>
            </div>
            <Switch
              checked={localSettings?.privacy?.allowTagging || true}
              onChange={(checked) =>
                handleSettingsUpdate("privacy", "allowTagging", checked)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-6">
          {/* Notification Channels */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Notification Channels
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={localSettings?.notifications?.email || false}
                  onChange={(checked) =>
                    handleSettingsUpdate("notifications", "email", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications
                  </p>
                </div>
                <Switch
                  checked={localSettings?.notifications?.push || false}
                  onChange={(checked) =>
                    handleSettingsUpdate("notifications", "push", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    SMS Notifications
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={localSettings?.notifications?.sms || false}
                  onChange={(checked) =>
                    handleSettingsUpdate("notifications", "sms", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              What to Notify About
            </h4>
            <div className="space-y-3">
              {[
                {
                  key: "posts",
                  label: "New Posts",
                  description: "When friends share new posts",
                },
                {
                  key: "comments",
                  label: "Comments",
                  description: "When someone comments on your posts",
                },
                {
                  key: "likes",
                  label: "Likes",
                  description: "When someone likes your posts",
                },
                {
                  key: "follows",
                  label: "New Followers",
                  description: "When someone follows you",
                },
                {
                  key: "mentions",
                  label: "Mentions",
                  description: "When someone mentions you",
                },
                {
                  key: "messages",
                  label: "Messages",
                  description: "When you receive new messages",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings?.notifications?.[
                        item.key as keyof typeof localSettings.notifications
                      ] || false
                    }
                    onChange={(checked) =>
                      handleSettingsUpdate("notifications", item.key, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Security Settings
        </h3>

        {/* Change Password */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Change Password
          </h4>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Current password"
              value={passwordData.current}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  current: e.target.value,
                }))
              }
            />
            <Input
              type="password"
              placeholder="New password"
              value={passwordData.new}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, new: e.target.value }))
              }
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirm}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirm: e.target.value,
                }))
              }
            />
            <Button
              variant="primary"
              onClick={handlePasswordChange}
              disabled={
                !passwordData.current ||
                !passwordData.new ||
                !passwordData.confirm
              }
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* Security Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add extra security to your account
              </p>
            </div>
            <Switch
              checked={localSettings?.account?.twoFactor || false}
              onChange={(checked) =>
                handleSettingsUpdate("account", "twoFactor", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Login Alerts
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified of new logins
              </p>
            </div>
            <Switch
              checked={localSettings?.account?.loginAlerts || false}
              onChange={(checked) =>
                handleSettingsUpdate("account", "loginAlerts", checked)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const AccountTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Account Management
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Download Your Data
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Get a copy of all your data including posts, photos, and more.
            </p>
            <Button variant="outline">
              <Icon name="download" className="w-4 h-4 mr-2" />
              Download Data
            </Button>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Deactivate Account
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Temporarily disable your account. You can reactivate it anytime.
            </p>
            <Button variant="outline" onClick={onDeactivateAccount}>
              Deactivate Account
            </Button>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h4 className="font-medium text-red-900 dark:text-red-400 mb-2">
              Delete Account
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-900 dark:text-red-400">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex space-x-2">
                  <Button variant="danger" onClick={onDeleteAccount}>
                    Yes, Delete Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onLogout} className="w-full">
              <Icon name="log-out" className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "privacy":
        return <PrivacyTab />;
      case "notifications":
        return <NotificationsTab />;
      case "security":
        return <SecurityTab />;
      case "account":
        return <AccountTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h2>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <Icon name={tab.icon} className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};
