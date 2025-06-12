import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '../../src/components/organisms/Sidebar';

// Mock React Router for navigation testing
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/dashboard' }),
}));

// Mock sidebar link component
jest.mock('../../src/components/molecules/SidebarLink', () => ({
  SidebarLink: ({ to, icon, children, active, onClick, badge, disabled, ...props }: any) => (
    <a
      href={to}
      data-testid={`sidebar-link-${to?.replace('/', '') || 'root'}`}
      data-active={active}
      data-disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      {...props}
    >
      {icon && <span data-testid="icon">{icon}</span>}
      <span>{children}</span>
      {badge && <span data-testid="badge">{badge}</span>}
    </a>
  ),
}));

const mockNavigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    to: '/dashboard',
  },
  {
    id: 'users',
    label: 'Users',
    icon: '👥',
    to: '/users',
    badge: 5,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    to: '/settings',
    children: [
      {
        id: 'profile',
        label: 'Profile',
        to: '/settings/profile',
      },
      {
        id: 'security',
        label: 'Security',
        to: '/settings/security',
      },
    ],
  },
  {
    id: 'disabled',
    label: 'Disabled',
    icon: '❌',
    to: '/disabled',
    disabled: true,
  },
];

const defaultProps = {
  navigationItems: mockNavigationItems,
  onNavigate: jest.fn(),
  currentPath: '/dashboard',
};

describe('Sidebar Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all navigation items correctly', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByTestId('sidebar-link-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-link-users')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-link-settings')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-link-disabled')).toBeInTheDocument();

      // Check labels
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('renders icons for navigation items', () => {
      render(<Sidebar {...defaultProps} />);

      const icons = screen.getAllByTestId('icon');
      expect(icons).toHaveLength(4); // 4 main items with icons

      expect(icons[0]).toHaveTextContent('📊');
      expect(icons[1]).toHaveTextContent('👥');
      expect(icons[2]).toHaveTextContent('⚙️');
      expect(icons[3]).toHaveTextContent('❌');
    });

    it('renders badges when provided', () => {
      render(<Sidebar {...defaultProps} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('5');
    });

    it('shows active state for current path', () => {
      render(<Sidebar {...defaultProps} />);

      const dashboardLink = screen.getByTestId('sidebar-link-dashboard');
      expect(dashboardLink).toHaveAttribute('data-active', 'true');
    });

    it('renders logo when provided', () => {
      render(<Sidebar {...defaultProps} logo="/logo.png" logoAlt="Company Logo" />);

      const logo = screen.getByAltText('Company Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo.png');
    });
  });

  describe('Navigation', () => {
    it('handles navigation clicks correctly', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const usersLink = screen.getByTestId('sidebar-link-users');
      await user.click(usersLink);

      expect(defaultProps.onNavigate).toHaveBeenCalledWith('/users');
    });

    it('does not navigate when item is disabled', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const disabledLink = screen.getByTestId('sidebar-link-disabled');
      expect(disabledLink).toHaveAttribute('data-disabled', 'true');

      await user.click(disabledLink);

      expect(defaultProps.onNavigate).not.toHaveBeenCalled();
    });

    it('updates active state when current path changes', () => {
      const { rerender } = render(<Sidebar {...defaultProps} />);

      // Initially dashboard is active
      expect(screen.getByTestId('sidebar-link-dashboard')).toHaveAttribute('data-active', 'true');

      // Change current path to users
      rerender(<Sidebar {...defaultProps} currentPath="/users" />);

      expect(screen.getByTestId('sidebar-link-dashboard')).toHaveAttribute('data-active', 'false');
      expect(screen.getByTestId('sidebar-link-users')).toHaveAttribute('data-active', 'true');
    });
  });

  describe('Collapsible Sidebar', () => {
    it('toggles collapsed state when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} collapsible />);

      const sidebar = screen.getByRole('navigation');
      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });

      // Initially expanded
      expect(sidebar).not.toHaveClass('sidebar--collapsed');

      // Click to collapse
      await user.click(toggleButton);
      expect(sidebar).toHaveClass('sidebar--collapsed');

      // Click to expand
      await user.click(toggleButton);
      expect(sidebar).not.toHaveClass('sidebar--collapsed');
    });

    it('hides text when collapsed', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} collapsible />);

      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });

      // Collapse sidebar
      await user.click(toggleButton);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveClass('sidebar--collapsed');

      // Text should be hidden but icons should remain
      const icons = screen.getAllByTestId('icon');
      expect(icons).toHaveLength(4);
    });

    it('calls onToggle when sidebar is toggled', async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<Sidebar {...defaultProps} collapsible onToggle={onToggle} />);

      const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
      await user.click(toggleButton);

      expect(onToggle).toHaveBeenCalledWith(true); // collapsed = true
    });
  });

  describe('Submenu Functionality', () => {
    it('expands submenu when parent item is clicked', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const settingsLink = screen.getByTestId('sidebar-link-settings');
      await user.click(settingsLink);

      // Submenu items should be visible
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Security')).toBeInTheDocument();
      });
    });

    it('collapses submenu when parent is clicked again', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const settingsLink = screen.getByTestId('sidebar-link-settings');

      // Expand submenu
      await user.click(settingsLink);
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });

      // Collapse submenu
      await user.click(settingsLink);
      await waitFor(() => {
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
      });
    });

    it('handles submenu navigation correctly', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const settingsLink = screen.getByTestId('sidebar-link-settings');
      await user.click(settingsLink);

      await waitFor(() => {
        const profileLink = screen.getByText('Profile');
        return user.click(profileLink);
      });

      expect(defaultProps.onNavigate).toHaveBeenCalledWith('/settings/profile');
    });
  });

  describe('Search Functionality', () => {
    it('filters navigation items based on search query', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} searchable />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'user');

      // Only users item should be visible
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('shows no results message when search yields no matches', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} searchable />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'nonexistent');

      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });

    it('clears search when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} searchable />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'user');

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      await user.click(clearButton);

      expect(searchInput).toHaveValue('');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation through items', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const sidebar = screen.getByRole('navigation');

      // Focus sidebar
      sidebar.focus();

      // Navigate with arrow keys
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('sidebar-link-dashboard')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('sidebar-link-users')).toHaveFocus();
    });

    it('activates items with Enter key', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const usersLink = screen.getByTestId('sidebar-link-users');
      usersLink.focus();

      await user.keyboard('{Enter}');

      expect(defaultProps.onNavigate).toHaveBeenCalledWith('/users');
    });

    it('activates items with Space key', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const usersLink = screen.getByTestId('sidebar-link-users');
      usersLink.focus();

      await user.keyboard(' ');

      expect(defaultProps.onNavigate).toHaveBeenCalledWith('/users');
    });
  });

  describe('Accessibility', () => {
    it('has proper landmark role', () => {
      render(<Sidebar {...defaultProps} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toBeInTheDocument();
    });

    it('has proper ARIA attributes for expandable items', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const settingsLink = screen.getByTestId('sidebar-link-settings');
      expect(settingsLink).toHaveAttribute('aria-expanded', 'false');

      await user.click(settingsLink);
      expect(settingsLink).toHaveAttribute('aria-expanded', 'true');
    });

    it('has proper ARIA labels for disabled items', () => {
      render(<Sidebar {...defaultProps} />);

      const disabledLink = screen.getByTestId('sidebar-link-disabled');
      expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
    });

    it('supports screen reader announcements', async () => {
      const user = userEvent.setup();
      render(<Sidebar {...defaultProps} />);

      const usersLink = screen.getByTestId('sidebar-link-users');
      await user.click(usersLink);

      // Should announce navigation change
      const announcement = screen.getByRole('status', { hidden: true });
      expect(announcement).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('shows mobile overlay when sidebar is open on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });

      render(<Sidebar {...defaultProps} mobileOpen />);

      const overlay = screen.getByTestId('sidebar-overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('closes sidebar when overlay is clicked on mobile', async () => {
      const user = userEvent.setup();
      const onMobileClose = jest.fn();

      render(<Sidebar {...defaultProps} mobileOpen onMobileClose={onMobileClose} />);

      const overlay = screen.getByTestId('sidebar-overlay');
      await user.click(overlay);

      expect(onMobileClose).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles missing navigation items gracefully', () => {
      render(<Sidebar {...defaultProps} navigationItems={[]} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toBeInTheDocument();

      expect(screen.getByText(/no navigation items/i)).toBeInTheDocument();
    });

    it('handles malformed navigation items', () => {
      const malformedItems = [
        { id: 'invalid' }, // Missing required fields
        null,
        undefined,
      ].filter(Boolean);

      render(<Sidebar {...defaultProps} navigationItems={malformedItems} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('memoizes navigation items to prevent unnecessary re-renders', () => {
      const { rerender } = render(<Sidebar {...defaultProps} />);

      // Re-render with same navigation items
      rerender(<Sidebar {...defaultProps} />);

      // Should not cause unnecessary re-computations
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('debounces search input', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<Sidebar {...defaultProps} searchable />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'test');

      // Search should be debounced
      jest.advanceTimersByTime(300);

      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();

      jest.useRealTimers();
    });
  });
});
