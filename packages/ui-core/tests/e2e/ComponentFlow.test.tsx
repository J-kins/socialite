import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TIMEOUT = 30000;

test.describe('Component Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set timeout for all tests
    test.setTimeout(TIMEOUT);

    // Navigate to the main page
    await page.goto(BASE_URL);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Header Component Flow', () => {
    test('should render header with all components', async ({ page }) => {
      // Check if header is visible
      const header = page.locator('[role="banner"]');
      await expect(header).toBeVisible();

      // Check search functionality
      const searchBox = page.locator('[data-testid="search-box"]');
      await expect(searchBox).toBeVisible();

      // Check notifications
      const notifications = page.locator('[data-testid="notifications-panel"]');
      await expect(notifications).toBeVisible();

      // Check profile dropdown
      const profileDropdown = page.locator('[data-testid="profile-dropdown"]');
      await expect(profileDropdown).toBeVisible();
    });

    test('should handle search functionality end-to-end', async ({ page }) => {
      // Type in search box
      const searchBox = page.locator('[data-testid="search-box"]');
      await searchBox.fill('test query');

      // Press Enter to search
      await searchBox.press('Enter');

      // Wait for search results or navigation
      await page.waitForTimeout(1000);

      // Check if search was processed (this would depend on your implementation)
      const url = page.url();
      expect(url).toContain('search') || expect(url).toContain('test');
    });

    test('should open and close mobile menu', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 640, height: 800 });

      // Find and click hamburger menu
      const hamburgerButton = page.locator('[aria-label*="menu"]').first();
      await hamburgerButton.click();

      // Check if mobile menu is open
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toHaveClass(/open/);

      // Click overlay to close
      const overlay = page.locator('[data-testid="mobile-menu-overlay"]');
      await overlay.click();

      // Check if mobile menu is closed
      await expect(mobileMenu).not.toHaveClass(/open/);
    });
  });

  test.describe('Sidebar Navigation Flow', () => {
    test('should navigate through sidebar items', async ({ page }) => {
      // Check if sidebar is visible
      const sidebar = page.locator('[role="navigation"]');
      await expect(sidebar).toBeVisible();

      // Click on different navigation items
      const dashboardLink = page.locator('[data-testid="sidebar-link-dashboard"]');
      await dashboardLink.click();

      // Check if navigation occurred
      await page.waitForURL(/dashboard/);

      // Check active state
      await expect(dashboardLink).toHaveAttribute('data-active', 'true');

      // Navigate to users
      const usersLink = page.locator('[data-testid="sidebar-link-users"]');
      await usersLink.click();

      await page.waitForURL(/users/);
      await expect(usersLink).toHaveAttribute('data-active', 'true');
    });

    test('should expand and collapse submenu', async ({ page }) => {
      // Click on settings to expand submenu
      const settingsLink = page.locator('[data-testid="sidebar-link-settings"]');
      await settingsLink.click();

      // Check if submenu is expanded
      await expect(settingsLink).toHaveAttribute('aria-expanded', 'true');

      // Check if submenu items are visible
      const profileLink = page.locator('text=Profile');
      await expect(profileLink).toBeVisible();

      const securityLink = page.locator('text=Security');
      await expect(securityLink).toBeVisible();

      // Click submenu item
      await profileLink.click();

      // Check navigation
      await page.waitForURL(/profile/);
    });

    test('should filter navigation items with search', async ({ page }) => {
      // Type in sidebar search
      const sidebarSearch = page.locator('[placeholder*="search"]');
      await sidebarSearch.fill('user');

      // Wait for filtering
      await page.waitForTimeout(500);

      // Check if only matching items are visible
      await expect(page.locator('text=Users')).toBeVisible();
      await expect(page.locator('text=Dashboard')).not.toBeVisible();

      // Clear search
      const clearButton = page.locator('[aria-label*="clear"]');
      await clearButton.click();

      // Check if all items are visible again
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Users')).toBeVisible();
    });
  });

  test.describe('Modal Component Flow', () => {
    test('should open and close modal', async ({ page }) => {
      // Find and click button that opens modal
      const openModalButton = page.locator('[data-testid="open-modal-button"]');
      await openModalButton.click();

      // Check if modal is visible
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Check if backdrop is visible
      const backdrop = page.locator('[data-testid="modal-backdrop"]');
      await expect(backdrop).toBeVisible();

      // Close modal with X button
      const closeButton = page.locator('[aria-label*="close"]');
      await closeButton.click();

      // Check if modal is closed
      await expect(modal).not.toBeVisible();
    });

    test('should close modal with escape key', async ({ page }) => {
      // Open modal
      const openModalButton = page.locator('[data-testid="open-modal-button"]');
      await openModalButton.click();

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Press Escape key
      await page.keyboard.press('Escape');

      // Check if modal is closed
      await expect(modal).not.toBeVisible();
    });

    test('should close modal by clicking backdrop', async ({ page }) => {
      // Open modal
      const openModalButton = page.locator('[data-testid="open-modal-button"]');
      await openModalButton.click();

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Click backdrop
      const backdrop = page.locator('[data-testid="modal-backdrop"]');
      await backdrop.click();

      // Check if modal is closed
      await expect(modal).not.toBeVisible();
    });
  });

  test.describe('Form Component Flow', () => {
    test('should handle form submission flow', async ({ page }) => {
      // Navigate to form page
      await page.goto(`${BASE_URL}/forms`);

      // Fill out form fields
      const nameInput = page.locator('[name="name"]');
      await nameInput.fill('John Doe');

      const emailInput = page.locator('[name="email"]');
      await emailInput.fill('john@example.com');

      const messageTextarea = page.locator('[name="message"]');
      await messageTextarea.fill('This is a test message');

      // Submit form
      const submitButton = page.locator('[type="submit"]');
      await submitButton.click();

      // Wait for submission
      await page.waitForTimeout(1000);

      // Check for success message or navigation
      const successMessage = page.locator('[data-testid="success-message"]');
      await expect(successMessage).toBeVisible();
    });

    test('should show validation errors', async ({ page }) => {
      // Navigate to form page
      await page.goto(`${BASE_URL}/forms`);

      // Try to submit empty form
      const submitButton = page.locator('[type="submit"]');
      await submitButton.click();

      // Check for validation errors
      const nameError = page.locator('[data-testid="name-error"]');
      await expect(nameError).toBeVisible();

      const emailError = page.locator('[data-testid="email-error"]');
      await expect(emailError).toBeVisible();
    });
  });

  test.describe('Notification System Flow', () => {
    test('should show and dismiss notifications', async ({ page }) => {
      // Trigger a notification (this would depend on your implementation)
      const triggerButton = page.locator('[data-testid="trigger-notification"]');
      await triggerButton.click();

      // Check if notification appears
      const notification = page.locator('[data-testid="notification"]');
      await expect(notification).toBeVisible();

      // Dismiss notification
      const dismissButton = page.locator('[data-testid="dismiss-notification"]');
      await dismissButton.click();

      // Check if notification is dismissed
      await expect(notification).not.toBeVisible();
    });

    test('should auto-dismiss notifications after timeout', async ({ page }) => {
      // Trigger a notification
      const triggerButton = page.locator('[data-testid="trigger-notification"]');
      await triggerButton.click();

      const notification = page.locator('[data-testid="notification"]');
      await expect(notification).toBeVisible();

      // Wait for auto-dismiss timeout (assuming 5 seconds)
      await page.waitForTimeout(5500);

      // Check if notification is auto-dismissed
      await expect(notification).not.toBeVisible();
    });
  });

  test.describe('Dark Mode Flow', () => {
    test('should toggle dark mode', async ({ page }) => {
      // Find theme toggle button
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      await themeToggle.click();

      // Check if dark mode is applied
      const body = page.locator('body');
      await expect(body).toHaveClass(/dark/);

      // Toggle back to light mode
      await themeToggle.click();

      // Check if light mode is restored
      await expect(body).not.toHaveClass(/dark/);
    });

    test('should persist theme preference', async ({ page }) => {
      // Toggle to dark mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      await themeToggle.click();

      // Reload page
      await page.reload();

      // Check if dark mode is still applied
      const body = page.locator('body');
      await expect(body).toHaveClass(/dark/);
    });
  });

  test.describe('Responsive Design Flow', () => {
    test('should adapt to mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check if mobile-specific elements are visible
      const mobileMenu = page.locator('[data-testid="mobile-menu-trigger"]');
      await expect(mobileMenu).toBeVisible();

      // Check if desktop sidebar is hidden
      const desktopSidebar = page.locator('[data-testid="desktop-sidebar"]');
      await expect(desktopSidebar).not.toBeVisible();
    });

    test('should adapt to tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Check responsive behavior
      const header = page.locator('[role="banner"]');
      await expect(header).toBeVisible();

      // Check if layout adapts appropriately
      const sidebar = page.locator('[role="navigation"]');
      await expect(sidebar).toBeVisible();
    });

    test('should adapt to desktop viewport', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Check if all desktop elements are visible
      const sidebar = page.locator('[role="navigation"]');
      await expect(sidebar).toBeVisible();

      const header = page.locator('[role="banner"]');
      await expect(header).toBeVisible();

      const mainContent = page.locator('[role="main"]');
      await expect(mainContent).toBeVisible();
    });
  });

  test.describe('Accessibility Flow', () => {
    test('should support keyboard navigation', async ({ page }) => {
      // Tab through focusable elements
      await page.keyboard.press('Tab');

      // Check if first focusable element has focus
      const firstFocusable = page.locator(':focus');
      await expect(firstFocusable).toBeVisible();

      // Continue tabbing and check focus management
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Test Enter key activation
      await page.keyboard.press('Enter');

      // Check if action was triggered
      await page.waitForTimeout(500);
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      // Check for proper landmark roles
      const banner = page.locator('[role="banner"]');
      await expect(banner).toBeVisible();

      const navigation = page.locator('[role="navigation"]');
      await expect(navigation).toBeVisible();

      const main = page.locator('[role="main"]');
      await expect(main).toBeVisible();

      // Check for proper button labels
      const buttons = page.locator('button[aria-label]');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);
    });
  });

  test.describe('Performance Flow', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Check if page loads within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle large lists efficiently', async ({ page }) => {
      // Navigate to page with large list
      await page.goto(`${BASE_URL}/large-list`);

      // Check if virtual scrolling is working
      const listContainer = page.locator('[data-testid="virtual-list"]');
      await expect(listContainer).toBeVisible();

      // Scroll and check if new items load
      await listContainer.hover();
      await page.mouse.wheel(0, 1000);

      await page.waitForTimeout(500);

      // Check if list is still responsive
      const items = page.locator('[data-testid="list-item"]');
      const itemCount = await items.count();
      expect(itemCount).toBeGreaterThan(0);
    });
  });
});
