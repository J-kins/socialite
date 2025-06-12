import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

interface UserManagementProps {
  className?: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const tabs = [
    { id: 'all', label: 'All Users', count: 124567 },
    { id: 'active', label: 'Active', count: 89234 },
    { id: 'inactive', label: 'Inactive', count: 12456 },
    { id: 'banned', label: 'Banned', count: 234 },
    { id: 'pending', label: 'Pending', count: 567 },
  ];

  const users = [
    {
      id: '1',
      name: 'Sarah Johnson',
      username: '@sarah.johnson',
      email: 'sarah.j@example.com',
      avatar: '/assets/images/avatars/avatar-1.jpg',
      status: 'active',
      role: 'user',
      joinedAt: '2023-06-15T10:30:00Z',
      lastActive: '2024-03-15T14:30:00Z',
      posts: 156,
      friends: 234,
      reports: 0,
      location: 'San Francisco, CA',
      verified: true,
    },
    {
      id: '2',
      name: 'Michael Chen',
      username: '@mchen',
      email: 'm.chen@example.com',
      avatar: '/assets/images/avatars/avatar-2.jpg',
      status: 'active',
      role: 'moderator',
      joinedAt: '2023-08-22T15:45:00Z',
      lastActive: '2024-03-15T12:15:00Z',
      posts: 89,
      friends: 145,
      reports: 2,
      location: 'New York, NY',
      verified: false,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      username: '@emily.r',
      email: 'emily.r@example.com',
      avatar: '/assets/images/avatars/avatar-3.jpg',
      status: 'banned',
      role: 'user',
      joinedAt: '2024-01-10T09:20:00Z',
      lastActive: '2024-03-10T08:45:00Z',
      posts: 23,
      friends: 67,
      reports: 5,
      location: 'Los Angeles, CA',
      verified: false,
    },
    {
      id: '4',
      name: 'David Kim',
      username: '@davidk',
      email: 'david.k@example.com',
      avatar: '/assets/images/avatars/avatar-4.jpg',
      status: 'inactive',
      role: 'user',
      joinedAt: '2023-12-05T16:10:00Z',
      lastActive: '2024-02-28T20:30:00Z',
      posts: 45,
      friends: 89,
      reports: 1,
      location: 'Seattle, WA',
      verified: true,
    },
  ];

  const getFilteredUsers = () => {
    switch (activeTab) {
      case 'active':
        return users.filter((user) => user.status === 'active');
      case 'inactive':
        return users.filter((user) => user.status === 'inactive');
      case 'banned':
        return users.filter((user) => user.status === 'banned');
      case 'pending':
        return users.filter((user) => user.status === 'pending');
      default:
        return users;
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = getFilteredUsers().map((user) => user.id);
    setSelectedUsers(selectedUsers.length === filteredIds.length ? [] : filteredIds);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'banned':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <MainLayout className={className}>
      <div className="main-container max-w-[1400px] mx-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">User Management</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage user accounts, permissions, and moderation
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="button bg-secondery dark:bg-slate-700 text-black dark:text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0-6V4m0 6h6m-6 0H6"
                />
              </svg>
              Export Users
            </button>
            <button className="button bg-primary text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Add User
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
                  {tab.count.toLocaleString()}
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
                  placeholder="Search users by name, email, or username..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>

            <select className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">All Locations</option>
              <option value="sf">San Francisco</option>
              <option value="ny">New York</option>
              <option value="la">Los Angeles</option>
              <option value="seattle">Seattle</option>
            </select>

            <select className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-dark3 text-black dark:text-white">
              <option value="">Sort by</option>
              <option value="name">Name A-Z</option>
              <option value="joined">Join Date</option>
              <option value="active">Last Active</option>
              <option value="posts">Post Count</option>
              <option value="reports">Report Count</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Activate
                </button>
                <button className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  Suspend
                </button>
                <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Ban
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Export
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-dark3 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === getFilteredUsers().length &&
                        getFilteredUsers().length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-slate-600"
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                    Activity
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                    Reports
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                    Joined
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredUsers().map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 dark:border-slate-600"
                      />
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-black dark:text-white">
                              {user.name}
                            </span>
                            {user.verified && (
                              <svg
                                className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <div className="text-black dark:text-white">{user.posts} posts</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {user.friends} friends
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last: {formatDate(user.lastActive)}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.reports === 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : user.reports < 3
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {user.reports}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.joinedAt)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="View Details"
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
                          title="Edit User"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Suspend/Ban User"
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
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 dark:bg-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1 to {getFilteredUsers().length} of {getFilteredUsers().length} users
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                2
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
