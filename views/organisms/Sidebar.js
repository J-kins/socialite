/**
 * Sidebar Component
 * Main navigation sidebar with collapsible sections
 */

import AvatarWithName from "../molecules/AvatarWithName.js";
import Icon from "../atoms/Icon.js";
import Badge from "../atoms/Badge.js";
import Switch from "../atoms/Switch.js";

const Sidebar = ({
  id = "",
  user = {},
  currentPage = "",
  notifications = {},
  className = "",
  collapsed = false,
  ...props
} = {}) => {
  const sidebarId = id || `sidebar-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    "sidebar",
    "fixed",
    "top-0",
    "left-0",
    "z-[99]",
    "pt-16", // Account for header height
    "overflow-hidden",
    "transition-transform",
    "duration-300",
    "max-lg:-translate-x-full",
    "lg:translate-x-0",
    "w-[280px]",
    "h-screen",
    "bg-white",
    "dark:bg-gray-800",
    "shadow-xl",
    "border-r",
    "border-gray-200",
    "dark:border-gray-700",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Navigation items with their metadata
  const navItems = [
    {
      id: "feed",
      label: "Feed",
      icon: "home-outline",
      href: "/feed",
      badge: notifications.feed || 0,
    },
    {
      id: "messages",
      label: "Messages",
      icon: "chatbubbles-outline",
      href: "/messages",
      badge: notifications.messages || 0,
    },
    {
      id: "friends",
      label: "Friends",
      icon: "people-outline",
      href: "/friends",
      badge: notifications.friends || 0,
    },
    {
      id: "groups",
      label: "Groups",
      icon: "people-circle-outline",
      href: "/groups",
      badge: notifications.groups || 0,
    },
    {
      id: "pages",
      label: "Pages",
      icon: "newspaper-outline",
      href: "/pages",
    },
    {
      id: "events",
      label: "Events",
      icon: "calendar-outline",
      href: "/events",
      badge: notifications.events || 0,
    },
    {
      id: "market",
      label: "Market",
      icon: "storefront-outline",
      href: "/market",
    },
  ];

  const secondaryItems = [
    {
      id: "blog",
      label: "Blog",
      icon: "library-outline",
      href: "/blog",
    },
    {
      id: "funding",
      label: "Funding",
      icon: "heart-outline",
      href: "/funding",
    },
    {
      id: "games",
      label: "Games",
      icon: "game-controller-outline",
      href: "/games",
    },
    {
      id: "video",
      label: "Videos",
      icon: "videocam-outline",
      href: "/video",
    },
  ];

  const settingsItems = [
    {
      id: "settings",
      label: "Settings",
      icon: "settings-outline",
      href: "/settings",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: "help-circle-outline",
      href: "/help",
    },
  ];

  // Render navigation item
  const renderNavItem = (item, isActive = false) => `
        <a href="${item.href}" 
           class="nav-item flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group ${
             isActive
               ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
               : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
           }"
           ${isActive ? 'aria-current="page"' : ""}>
            <div class="flex items-center">
                ${Icon({
                  name: item.icon,
                  type: "ion",
                  size: "md",
                  className: `mr-3 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`,
                })}
                <span>${item.label}</span>
            </div>
            ${
              item.badge && item.badge > 0
                ? `
                ${Badge({
                  text: item.badge > 99 ? "99+" : item.badge.toString(),
                  variant: "primary",
                  size: "sm",
                })}
            `
                : ""
            }
        </a>
    `;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <div 
            ${id ? `id="${sidebarId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            <!-- Sidebar backdrop for mobile -->
            <div class="absolute bg-black/20 backdrop-blur w-screen h-screen lg:hidden" 
                 onclick="closeSidebar()"
                 style="left: 280px; top: -64px;"></div>
            
            <!-- Sidebar content -->
            <div class="flex flex-col h-full">
                
                <!-- Main Navigation -->
                <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
                    
                    <!-- Primary Navigation -->
                    <div class="space-y-1 mb-6">
                        ${navItems
                          .map((item) =>
                            renderNavItem(item, currentPage === item.id),
                          )
                          .join("")}
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    <!-- Secondary Navigation -->
                    <div class="space-y-1 mb-6">
                        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Discover
                        </h3>
                        ${secondaryItems
                          .map((item) =>
                            renderNavItem(item, currentPage === item.id),
                          )
                          .join("")}
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    <!-- Settings & Support -->
                    <div class="space-y-1">
                        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Account
                        </h3>
                        ${settingsItems
                          .map((item) =>
                            renderNavItem(item, currentPage === item.id),
                          )
                          .join("")}
                        
                        <!-- Theme Toggle -->
                        <div class="px-3 py-2">
                            ${Switch({
                              id: "theme-toggle",
                              label: "Dark Mode",
                              checked: false,
                              onChange: "toggleTheme()",
                            })}
                        </div>
                    </div>
                </nav>

                <!-- Sidebar Footer -->
                <div class="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div class="flex items-center space-x-3">
                        ${AvatarWithName({
                          src: user.avatar,
                          name: user.name,
                          subtitle: user.email,
                          size: "md",
                          clickable: true,
                          onClick: "window.location.href='/profile'",
                        })}
                        
                        <!-- User menu trigger -->
                        <button type="button" 
                                class="ml-auto p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                                onclick="toggleUserMenu()"
                                aria-label="User menu">
                            ${Icon({
                              name: "ellipsis-vertical",
                              type: "svg",
                              size: "sm",
                            })}
                        </button>
                    </div>
                    
                    <!-- User dropdown menu -->
                    <div id="user-menu" class="hidden mt-2 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <a href="/profile" class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                            View Profile
                        </a>
                        <a href="/settings/account" class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                            Account Settings
                        </a>
                        <div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                        <button type="button" class="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script>
        // Sidebar functionality
        function closeSidebar() {
            const sidebar = document.getElementById('${sidebarId}');
            if (sidebar) {
                sidebar.classList.add('-translate-x-full');
            }
        }

        function openSidebar() {
            const sidebar = document.getElementById('${sidebarId}');
            if (sidebar) {
                sidebar.classList.remove('-translate-x-full');
            }
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('${sidebarId}');
            if (sidebar) {
                sidebar.classList.toggle('-translate-x-full');
            }
        }

        function toggleUserMenu() {
            const menu = document.getElementById('user-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        }

        // Close user menu when clicking outside
        document.addEventListener('click', function(event) {
            const menu = document.getElementById('user-menu');
            const trigger = event.target.closest('[aria-label="User menu"]');
            
            if (menu && !trigger && !menu.contains(event.target)) {
                menu.classList.add('hidden');
            }
        });

        // Update active state based on current page
        function updateActiveNavItem(pageId) {
            const navItems = document.querySelectorAll('#${sidebarId} .nav-item');
            navItems.forEach(item => {
                const href = item.getAttribute('href');
                const isActive = href === \`/\${pageId}\` || 
                                (pageId === 'feed' && href === '/feed') ||
                                (pageId === '' && href === '/feed');
                
                if (isActive) {
                    item.classList.add('bg-blue-50', 'text-blue-700', 'dark:bg-blue-900/20', 'dark:text-blue-400');
                    item.classList.remove('text-gray-700', 'dark:text-gray-300');
                    item.setAttribute('aria-current', 'page');
                } else {
                    item.classList.remove('bg-blue-50', 'text-blue-700', 'dark:bg-blue-900/20', 'dark:text-blue-400');
                    item.classList.add('text-gray-700', 'dark:text-gray-300');
                    item.removeAttribute('aria-current');
                }
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateActiveNavItem('${currentPage}');
        });
        </script>
    `;
};

export default Sidebar;
