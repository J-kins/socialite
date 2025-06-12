import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atoms/Button';
import { SearchInput } from '../atoms/SearchInput';
import { Icon } from '../atoms/Icon';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { NotificationButton } from '../atoms/NotificationButton';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationsPanel } from './NotificationsPanel';

export interface HeaderProps {
  /**
   * Current user information
   */
  user?: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  /**
   * Logo image source or text
   */
  logo?: string | React.ReactNode;
  /**
   * Navigation items for main menu
   */
  navItems?: Array<{
    id: string;
    label: string;
    href: string;
    icon?: string;
    isActive?: boolean;
    badge?: number;
  }>;
  /**
   * Search functionality
   */
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  /**
   * Notification functionality
   */
  notificationCount?: number;
  onNotificationClick?: () => void;
  notifications?: Array<{
    id: string;
    type: 'like' | 'comment' | 'share' | 'mention' | 'follow' | 'message';
    title: string;
    description?: string;
    avatar?: string;
    timestamp: string;
    isRead: boolean;
  }>;
  /**
   * Profile dropdown functionality
   */
  onProfileClick?: () => void;
  onLogout?: () => void;
  onSettingsClick?: () => void;
  /**
   * Theme and appearance
   */
  variant?: 'default' | 'transparent' | 'solid' | 'minimal';
  theme?: 'light' | 'dark' | 'auto';
  isSticky?: boolean;
  /**
   * Mobile responsiveness
   */
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
  /**
   * Quick actions
   */
  quickActions?: Array<{
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
    badge?: number;
  }>;
  /**
   * Custom content slots
   */
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  /**
   * Event handlers
   */
  onNavItemClick?: (item: any) => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  logo = 'Nexify',
  navItems = [],
  onSearch,
  searchPlaceholder = 'Search Nexify...',
  searchValue,
  notificationCount = 0,
  onNotificationClick,
  notifications = [],
  onProfileClick,
  onLogout,
  onSettingsClick,
  variant = 'default',
  theme = 'light',
  isSticky = true,
  isMobileMenuOpen = false,
  onMobileMenuToggle,
  quickActions = [],
  leftContent,
  rightContent,
  centerContent,
  onNavItemClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(searchValue || '');
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Handle scroll effect for sticky header
  useEffect(() => {
    if (!isSticky) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky]);

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  // Handle notifications
  const handleNotificationClick = () => {
    setIsNotificationsPanelOpen(!isNotificationsPanelOpen);
    setIsProfileDropdownOpen(false);
    onNotificationClick?.();
  };

  // Handle profile dropdown
  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsNotificationsPanelOpen(false);
    onProfileClick?.();
  };

  // Handle mobile search expand
  const handleMobileSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsNotificationsPanelOpen(false);
        setIsProfileDropdownOpen(false);
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerClasses = [
    'header',
    `header--${variant}`,
    `header--${theme}`,
    isSticky && 'header--sticky',
    scrolled && 'header--scrolled',
    isMobileMenuOpen && 'header--mobile-menu-open',
    isSearchExpanded && 'header--search-expanded',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header ref={headerRef} className={headerClasses}>
      <div className="header__container">
        {/* Left Section */}
        <div className="header__left">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="header__mobile-menu-toggle"
            onClick={onMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size="md" />
          </Button>

          {/* Logo */}
          <div className="header__logo">
            {typeof logo === 'string' ? <h1 className="header__logo-text">{logo}</h1> : logo}
          </div>

          {/* Desktop Navigation */}
          <nav className="header__nav" role="navigation">
            <ul className="header__nav-list">
              {navItems.map((item) => (
                <li key={item.id} className="header__nav-item">
                  <Button
                    variant={item.isActive ? 'primary' : 'ghost'}
                    size="sm"
                    className="header__nav-link"
                    onClick={() => onNavItemClick?.(item)}
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    {item.icon && <Icon name={item.icon} size="sm" />}
                    <span className="header__nav-label">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="notification"
                        size="sm"
                        count={item.badge}
                        className="header__nav-badge"
                      />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {leftContent && <div className="header__left-content">{leftContent}</div>}
        </div>

        {/* Center Section */}
        <div className="header__center">
          {centerContent ? (
            centerContent
          ) : (
            <form onSubmit={handleSearchSubmit} className="header__search-form">
              <SearchInput
                ref={searchRef}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="header__search-input"
                size="md"
                showIcon={true}
                onClear={() => handleSearchChange('')}
              />
            </form>
          )}
        </div>

        {/* Right Section */}
        <div className="header__right">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="header__mobile-search-toggle"
            onClick={handleMobileSearchToggle}
            aria-label="Toggle search"
          >
            <Icon name="search" size="md" />
          </Button>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="header__quick-actions">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  className="header__quick-action"
                  onClick={action.onClick}
                  aria-label={action.label}
                  title={action.label}
                >
                  <Icon name={action.icon} size="md" />
                  {action.badge && action.badge > 0 && (
                    <Badge
                      variant="notification"
                      size="sm"
                      count={action.badge}
                      className="header__quick-action-badge"
                    />
                  )}
                </Button>
              ))}
            </div>
          )}

          {/* Notifications */}
          <div className="header__notifications">
            <NotificationButton
              count={notificationCount}
              onClick={handleNotificationClick}
              isActive={isNotificationsPanelOpen}
              variant="header"
              className="header__notification-button"
            />

            {isNotificationsPanelOpen && (
              <NotificationsPanel
                notifications={notifications}
                onClose={() => setIsNotificationsPanelOpen(false)}
                onNotificationClick={(notification) => {
                  // Handle individual notification click
                  console.log('Notification clicked:', notification);
                }}
                onMarkAllRead={() => {
                  // Handle mark all as read
                  console.log('Mark all notifications as read');
                }}
                onClearAll={() => {
                  // Handle clear all notifications
                  console.log('Clear all notifications');
                }}
                className="header__notifications-panel"
              />
            )}
          </div>

          {/* Profile Dropdown */}
          {user && (
            <div className="header__profile">
              <Button
                variant="ghost"
                size="sm"
                className="header__profile-button"
                onClick={handleProfileClick}
                aria-label="User menu"
                aria-expanded={isProfileDropdownOpen}
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  name={user.name}
                  size="sm"
                  showOnlineStatus={user.isOnline}
                  className="header__profile-avatar"
                />
                <Icon name="chevron-down" size="sm" className="header__profile-arrow" />
              </Button>

              {isProfileDropdownOpen && (
                <ProfileDropdown
                  user={user}
                  onClose={() => setIsProfileDropdownOpen(false)}
                  onLogout={onLogout}
                  onSettingsClick={onSettingsClick}
                  className="header__profile-dropdown"
                />
              )}
            </div>
          )}

          {rightContent && <div className="header__right-content">{rightContent}</div>}
        </div>

        {/* Mobile Search Overlay */}
        {isSearchExpanded && (
          <div className="header__mobile-search-overlay">
            <form onSubmit={handleSearchSubmit} className="header__mobile-search-form">
              <SearchInput
                ref={searchRef}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="header__mobile-search-input"
                size="lg"
                showIcon={true}
                onClear={() => handleSearchChange('')}
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                className="header__mobile-search-close"
                onClick={() => setIsSearchExpanded(false)}
                aria-label="Close search"
              >
                <Icon name="close" size="md" />
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="header__mobile-menu">
          <nav className="header__mobile-nav" role="navigation">
            <ul className="header__mobile-nav-list">
              {navItems.map((item) => (
                <li key={item.id} className="header__mobile-nav-item">
                  <Button
                    variant={item.isActive ? 'primary' : 'ghost'}
                    size="md"
                    className="header__mobile-nav-link"
                    onClick={() => {
                      onNavItemClick?.(item);
                      onMobileMenuToggle?.();
                    }}
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    {item.icon && <Icon name={item.icon} size="md" />}
                    <span className="header__mobile-nav-label">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="notification"
                        size="sm"
                        count={item.badge}
                        className="header__mobile-nav-badge"
                      />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
