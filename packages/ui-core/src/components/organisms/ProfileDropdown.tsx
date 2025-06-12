import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { Divider } from '../atoms/Divider';

export interface ProfileDropdownProps {
  /**
   * User information
   */
  user: {
    id: string;
    name: string;
    email?: string;
    username?: string;
    avatar?: string;
    role?: string;
    isOnline?: boolean;
    isVerified?: boolean;
    stats?: {
      followers?: number;
      following?: number;
      posts?: number;
    };
  };
  /**
   * Menu items
   */
  menuItems?: Array<{
    id: string;
    label: string;
    icon: string;
    href?: string;
    onClick?: () => void;
    badge?: number | string;
    isDisabled?: boolean;
    variant?: 'default' | 'danger' | 'warning' | 'success';
    description?: string;
  }>;
  /**
   * Quick actions
   */
  quickActions?: Array<{
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  }>;
  /**
   * Theme and appearance
   */
  showUserStats?: boolean;
  showQuickActions?: boolean;
  showThemeToggle?: boolean;
  currentTheme?: 'light' | 'dark' | 'auto';
  onThemeChange?: (theme: 'light' | 'dark' | 'auto') => void;
  /**
   * Dropdown behavior
   */
  isOpen?: boolean;
  onClose?: () => void;
  position?: 'left' | 'right' | 'center';
  variant?: 'default' | 'minimal' | 'compact' | 'detailed';
  /**
   * Event handlers
   */
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  onMenuItemClick?: (item: any) => void;
  /**
   * Status and presence
   */
  showOnlineStatus?: boolean;
  onStatusChange?: (status: 'online' | 'away' | 'busy' | 'offline') => void;
  currentStatus?: 'online' | 'away' | 'busy' | 'offline';
  /**
   * Notifications
   */
  notificationCount?: number;
  onNotificationsClick?: () => void;
  /**
   * Account management
   */
  accounts?: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isActive: boolean;
  }>;
  onAccountSwitch?: (accountId: string) => void;
  onAddAccount?: () => void;
  /**
   * Customization
   */
  customContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  className?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  menuItems = [],
  quickActions = [],
  showUserStats = true,
  showQuickActions = true,
  showThemeToggle = true,
  currentTheme = 'light',
  onThemeChange,
  isOpen = true,
  onClose,
  position = 'right',
  variant = 'default',
  onProfileClick,
  onSettingsClick,
  onLogout,
  onMenuItemClick,
  showOnlineStatus = true,
  onStatusChange,
  currentStatus = 'online',
  notificationCount,
  onNotificationsClick,
  accounts = [],
  onAccountSwitch,
  onAddAccount,
  customContent,
  footerContent,
  className = '',
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAccountsMenu, setShowAccountsMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default menu items if none provided
  const defaultMenuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      onClick: onProfileClick,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      onClick: onSettingsClick,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'bell',
      onClick: onNotificationsClick,
      badge: notificationCount,
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'help-circle',
      onClick: () => console.log('Help clicked'),
    },
    {
      id: 'logout',
      label: 'Sign out',
      icon: 'log-out',
      onClick: onLogout,
      variant: 'danger' as const,
    },
  ].filter((item) => item.onClick);

  const allMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems;

  // Handle status change
  const handleStatusChange = (status: 'online' | 'away' | 'busy' | 'offline') => {
    setSelectedStatus(status);
    onStatusChange?.(status);
    setShowStatusMenu(false);
  };

  // Handle theme change
  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'auto'] as const;
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    onThemeChange?.(nextTheme);
  };

  // Handle account switch
  const handleAccountSwitch = (accountId: string) => {
    onAccountSwitch?.(accountId);
    setShowAccountsMenu(false);
  };

  // Handle menu item click
  const handleMenuItemClick = (item: any) => {
    if (item.isDisabled) return;
    onMenuItemClick?.(item);
    item.onClick?.();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Format user stats
  const formatStat = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      online: 'var(--color-success)',
      away: 'var(--color-warning)',
      busy: 'var(--color-danger)',
      offline: 'var(--color-text-tertiary)',
    };
    return colors[status as keyof typeof colors] || colors.offline;
  };

  // Get theme icon
  const getThemeIcon = (theme: string) => {
    const icons = {
      light: 'sun',
      dark: 'moon',
      auto: 'monitor',
    };
    return icons[theme as keyof typeof icons] || 'monitor';
  };

  if (!isOpen) {
    return null;
  }

  const dropdownClasses = [
    'profile-dropdown',
    `profile-dropdown--${variant}`,
    `profile-dropdown--${position}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={dropdownRef} className={dropdownClasses} role="menu">
      {/* User Header */}
      <div className="profile-dropdown__header">
        <Button
          variant="ghost"
          className="profile-dropdown__user-info"
          onClick={onProfileClick}
          role="menuitem"
        >
          <Avatar
            src={user.avatar}
            alt={user.name}
            name={user.name}
            size={variant === 'compact' ? 'md' : 'lg'}
            showOnlineStatus={showOnlineStatus}
            onlineStatus={selectedStatus}
            className="profile-dropdown__avatar"
          />

          <div className="profile-dropdown__user-details">
            <div className="profile-dropdown__user-name">
              {user.name}
              {user.isVerified && (
                <Icon name="check-circle" size="sm" className="profile-dropdown__verified" />
              )}
            </div>

            {user.username && <div className="profile-dropdown__username">@{user.username}</div>}

            {user.email && variant === 'detailed' && (
              <div className="profile-dropdown__email">{user.email}</div>
            )}

            {user.role && (
              <Badge variant="secondary" size="sm" className="profile-dropdown__role">
                {user.role}
              </Badge>
            )}
          </div>

          <Icon name="external-link" size="sm" className="profile-dropdown__external-icon" />
        </Button>

        {/* Online Status Selector */}
        {showOnlineStatus && onStatusChange && (
          <div className="profile-dropdown__status-selector">
            <Button
              variant="ghost"
              size="sm"
              className="profile-dropdown__status-button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              aria-expanded={showStatusMenu}
            >
              <div
                className="profile-dropdown__status-indicator"
                style={{ backgroundColor: getStatusColor(selectedStatus) }}
              />
              <span className="profile-dropdown__status-text">
                {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              </span>
              <Icon name="chevron-down" size="sm" />
            </Button>

            {showStatusMenu && (
              <div className="profile-dropdown__status-menu">
                {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="sm"
                    className="profile-dropdown__status-option"
                    onClick={() => handleStatusChange(status)}
                  >
                    <div
                      className="profile-dropdown__status-indicator"
                      style={{ backgroundColor: getStatusColor(status) }}
                    />
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    {status === selectedStatus && <Icon name="check" size="sm" />}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Stats */}
      {showUserStats && user.stats && variant !== 'compact' && (
        <div className="profile-dropdown__stats">
          {user.stats.posts !== undefined && (
            <div className="profile-dropdown__stat">
              <span className="profile-dropdown__stat-value">{formatStat(user.stats.posts)}</span>
              <span className="profile-dropdown__stat-label">Posts</span>
            </div>
          )}
          {user.stats.followers !== undefined && (
            <div className="profile-dropdown__stat">
              <span className="profile-dropdown__stat-value">
                {formatStat(user.stats.followers)}
              </span>
              <span className="profile-dropdown__stat-label">Followers</span>
            </div>
          )}
          {user.stats.following !== undefined && (
            <div className="profile-dropdown__stat">
              <span className="profile-dropdown__stat-value">
                {formatStat(user.stats.following)}
              </span>
              <span className="profile-dropdown__stat-label">Following</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {showQuickActions && quickActions.length > 0 && (
        <div className="profile-dropdown__quick-actions">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'secondary'}
              size="sm"
              className="profile-dropdown__quick-action"
              onClick={action.onClick}
              role="menuitem"
            >
              <Icon name={action.icon} size="sm" />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {(showUserStats || showQuickActions) && <Divider />}

      {/* Account Switcher */}
      {accounts.length > 0 && (
        <>
          <div className="profile-dropdown__section">
            <Button
              variant="ghost"
              className="profile-dropdown__section-header"
              onClick={() => setShowAccountsMenu(!showAccountsMenu)}
              aria-expanded={showAccountsMenu}
            >
              <Icon name="users" size="sm" />
              <span>Switch Account</span>
              <Icon name="chevron-down" size="sm" />
            </Button>

            {showAccountsMenu && (
              <div className="profile-dropdown__accounts">
                {accounts.map((account) => (
                  <Button
                    key={account.id}
                    variant="ghost"
                    className="profile-dropdown__account"
                    onClick={() => handleAccountSwitch(account.id)}
                    disabled={account.isActive}
                  >
                    <Avatar src={account.avatar} alt={account.name} name={account.name} size="sm" />
                    <div className="profile-dropdown__account-info">
                      <div className="profile-dropdown__account-name">{account.name}</div>
                      <div className="profile-dropdown__account-email">{account.email}</div>
                    </div>
                    {account.isActive && (
                      <Icon name="check" size="sm" className="profile-dropdown__active-indicator" />
                    )}
                  </Button>
                ))}

                {onAddAccount && (
                  <Button
                    variant="ghost"
                    className="profile-dropdown__add-account"
                    onClick={onAddAccount}
                  >
                    <Icon name="plus" size="sm" />
                    <span>Add Account</span>
                  </Button>
                )}
              </div>
            )}
          </div>
          <Divider />
        </>
      )}

      {/* Custom Content */}
      {customContent && (
        <>
          <div className="profile-dropdown__custom-content">{customContent}</div>
          <Divider />
        </>
      )}

      {/* Menu Items */}
      <div className="profile-dropdown__menu">
        {allMenuItems.map((item, index) => (
          <Button
            key={item.id}
            variant="ghost"
            className={[
              'profile-dropdown__menu-item',
              item.variant && `profile-dropdown__menu-item--${item.variant}`,
              item.isDisabled && 'profile-dropdown__menu-item--disabled',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleMenuItemClick(item)}
            disabled={item.isDisabled}
            role="menuitem"
            title={item.description}
          >
            <Icon name={item.icon} size="sm" />
            <span className="profile-dropdown__menu-label">{item.label}</span>

            {item.badge && (
              <Badge
                variant="notification"
                size="sm"
                count={typeof item.badge === 'string' ? undefined : item.badge}
                className="profile-dropdown__menu-badge"
              >
                {typeof item.badge === 'string' ? item.badge : undefined}
              </Badge>
            )}

            {item.description && variant === 'detailed' && (
              <div className="profile-dropdown__menu-description">{item.description}</div>
            )}
          </Button>
        ))}
      </div>

      {/* Theme Toggle */}
      {showThemeToggle && onThemeChange && (
        <>
          <Divider />
          <div className="profile-dropdown__theme">
            <Button
              variant="ghost"
              className="profile-dropdown__theme-toggle"
              onClick={handleThemeToggle}
              role="menuitem"
            >
              <Icon name={getThemeIcon(currentTheme)} size="sm" />
              <span>Theme: {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</span>
              <Icon name="chevron-right" size="sm" />
            </Button>
          </div>
        </>
      )}

      {/* Footer Content */}
      {footerContent && (
        <>
          <Divider />
          <div className="profile-dropdown__footer">{footerContent}</div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
