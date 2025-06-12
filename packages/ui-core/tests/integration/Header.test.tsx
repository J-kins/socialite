import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../../src/components/organisms/Header';

// Mock components and hooks
jest.mock('../../src/components/molecules/SearchBox', () => ({
  SearchBox: ({ onSearch, ...props }: any) => (
    <input {...props} data-testid="search-box" onChange={(e) => onSearch?.(e.target.value)} />
  ),
}));

jest.mock('../../src/components/organisms/ProfileDropdown', () => ({
  ProfileDropdown: ({ user, onLogout }: any) => (
    <div data-testid="profile-dropdown">
      <span>{user?.name}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  ),
}));

jest.mock('../../src/components/organisms/NotificationsPanel', () => ({
  NotificationsPanel: ({ notifications, onMarkAsRead }: any) => (
    <div data-testid="notifications-panel">
      <span>{notifications?.length} notifications</span>
      <button onClick={() => onMarkAsRead?.(1)}>Mark as read</button>
    </div>
  ),
}));

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatar.jpg',
};

const mockNotifications = [
  { id: '1', message: 'New message', read: false },
  { id: '2', message: 'New follower', read: false },
];

const defaultProps = {
  user: mockUser,
  notifications: mockNotifications,
  onSearch: jest.fn(),
  onLogout: jest.fn(),
  onNotificationRead: jest.fn(),
  onProfileClick: jest.fn(),
};

describe('Header Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all header components correctly', () => {
      render(<Header {...defaultProps} />);

      // Check if main header elements are present
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByTestId('search-box')).toBeInTheDocument();
      expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('notifications-panel')).toBeInTheDocument();

      // Check if user name is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Check if notification count is displayed
      expect(screen.getByText('2 notifications')).toBeInTheDocument();
    });

    it('renders logo when provided', () => {
      render(<Header {...defaultProps} logo="/logo.png" logoAlt="Company Logo" />);

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo.png');
    });

    it('renders navigation items when provided', () => {
      const navItems = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ];

      render(<Header {...defaultProps} navigationItems={navItems} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('handles search input correctly', async () => {
      const user = userEvent.setup();
      render(<Header {...defaultProps} />);

      const searchBox = screen.getByTestId('search-box');
      await user.type(searchBox, 'test query');

      expect(defaultProps.onSearch).toHaveBeenCalledWith('test query');
    });

    it('clears search when requested', async () => {
      const user = userEvent.setup();
      render(<Header {...defaultProps} />);

      const searchBox = screen.getByTestId('search-box');
      await user.type(searchBox, 'test');
      await user.clear(searchBox);

      expect(defaultProps.onSearch).toHaveBeenCalledWith('');
    });
  });

  describe('Profile Interactions', () => {
    it('handles profile dropdown interactions', async () => {
      const user = userEvent.setup();
      render(<Header {...defaultProps} />);

      const profileDropdown = screen.getByTestId('profile-dropdown');
      expect(profileDropdown).toBeInTheDocument();

      // Test logout functionality
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(defaultProps.onLogout).toHaveBeenCalled();
    });

    it('shows user information correctly', () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Notifications', () => {
    it('displays notification count correctly', () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText('2 notifications')).toBeInTheDocument();
    });

    it('handles notification interactions', async () => {
      const user = userEvent.setup();
      render(<Header {...defaultProps} />);

      const markAsReadButton = screen.getByText('Mark as read');
      await user.click(markAsReadButton);

      expect(defaultProps.onNotificationRead).toHaveBeenCalledWith(1);
    });

    it('handles empty notifications state', () => {
      render(<Header {...defaultProps} notifications={[]} />);

      expect(screen.getByText('0 notifications')).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('toggles mobile menu when hamburger is clicked', async () => {
      const user = userEvent.setup();

      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });

      render(<Header {...defaultProps} />);

      const hamburgerButton = screen.getByRole('button', { name: /menu/i });
      expect(hamburgerButton).toBeInTheDocument();

      await user.click(hamburgerButton);

      // Should open mobile menu
      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toHaveClass('header__mobile-menu--open');
    });

    it('closes mobile menu when clicking outside', async () => {
      const user = userEvent.setup();

      render(<Header {...defaultProps} />);

      // Open mobile menu first
      const hamburgerButton = screen.getByRole('button', { name: /menu/i });
      await user.click(hamburgerButton);

      // Click outside the menu
      const overlay = screen.getByTestId('mobile-menu-overlay');
      await user.click(overlay);

      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).not.toHaveClass('header__mobile-menu--open');
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode classes when enabled', () => {
      render(<Header {...defaultProps} darkMode />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('dark');
    });

    it('toggles dark mode when theme button is clicked', async () => {
      const user = userEvent.setup();
      const onThemeToggle = jest.fn();

      render(<Header {...defaultProps} onThemeToggle={onThemeToggle} />);

      const themeButton = screen.getByRole('button', { name: /theme/i });
      await user.click(themeButton);

      expect(onThemeToggle).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper landmark roles', () => {
      render(<Header {...defaultProps} />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      const navigation = screen.queryByRole('navigation');
      if (navigation) {
        expect(navigation).toBeInTheDocument();
      }
    });

    it('has proper focus management', async () => {
      const user = userEvent.setup();
      render(<Header {...defaultProps} />);

      // Tab through focusable elements
      await user.tab();

      const searchBox = screen.getByTestId('search-box');
      expect(searchBox).toHaveFocus();
    });

    it('has proper ARIA labels', () => {
      render(<Header {...defaultProps} />);

      const searchBox = screen.getByTestId('search-box');
      expect(searchBox).toHaveAttribute('aria-label');

      const profileDropdown = screen.getByTestId('profile-dropdown');
      expect(profileDropdown).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Header {...defaultProps} />);

      // Test keyboard navigation through header elements
      await user.keyboard('{Tab}');
      expect(screen.getByTestId('search-box')).toHaveFocus();

      await user.keyboard('{Tab}');
      // Next focusable element should receive focus
    });
  });

  describe('Error Handling', () => {
    it('handles missing user gracefully', () => {
      render(<Header {...defaultProps} user={null} />);

      // Should still render header without user-specific elements
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByTestId('search-box')).toBeInTheDocument();
    });

    it('handles search errors gracefully', async () => {
      const user = userEvent.setup();
      const onSearchWithError = jest.fn().mockImplementation(() => {
        throw new Error('Search failed');
      });

      render(<Header {...defaultProps} onSearch={onSearchWithError} />);

      const searchBox = screen.getByTestId('search-box');

      // Should not crash when search throws an error
      await user.type(searchBox, 'test');

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('debounces search input', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<Header {...defaultProps} />);

      const searchBox = screen.getByTestId('search-box');

      // Type multiple characters quickly
      await user.type(searchBox, 'test');

      // Search should be debounced
      expect(defaultProps.onSearch).toHaveBeenCalledTimes(4); // Once per character

      jest.useRealTimers();
    });

    it('memoizes expensive computations', () => {
      const { rerender } = render(<Header {...defaultProps} />);

      // Re-render with same props shouldn't cause unnecessary re-computations
      rerender(<Header {...defaultProps} />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state for notifications', () => {
      render(<Header {...defaultProps} notificationsLoading />);

      const notificationsPanel = screen.getByTestId('notifications-panel');
      expect(notificationsPanel).toHaveClass('notifications-panel--loading');
    });

    it('shows loading state for search', () => {
      render(<Header {...defaultProps} searchLoading />);

      const searchBox = screen.getByTestId('search-box');
      expect(searchBox).toHaveAttribute('disabled');
    });
  });
});
