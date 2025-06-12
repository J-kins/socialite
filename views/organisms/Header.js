/**
 * Header Component
 * Main application header with navigation and user controls
 */

import SearchBox from "../molecules/SearchBox.js";
import AvatarWithName from "../molecules/AvatarWithName.js";
import Button from "../atoms/Button.js";
import Icon from "../atoms/Icon.js";
import NotificationDot from "../atoms/NotificationDot.js";

const Header = ({
  id = "",
  user = {},
  notifications = 0,
  logo = "/assets/images/logo.png",
  logoMobile = "/assets/images/logo-mobile.png",
  logoLight = "/assets/images/logo-light.png",
  logoMobileLight = "/assets/images/logo-mobile-light.png",
  searchPlaceholder = "Search Friends, videos ..",
  className = "",
  onSearch = "",
  onNotificationClick = "",
  onProfileClick = "",
  onCreatePost = "",
  ...props
} = {}) => {
  const baseClasses = [
    "header",
    "z-[100]",
    "h-16",
    "fixed",
    "top-0",
    "left-0",
    "w-full",
    "flex",
    "items-center",
    "bg-white/80",
    "backdrop-blur-xl",
    "border-b",
    "border-slate-200",
    "dark:bg-gray-900/80",
    "dark:border-slate-800",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const headerId = id || `header-${Math.random().toString(36).substr(2, 9)}`;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Default handlers
  const defaultSearch =
    onSearch ||
    `
        console.log('Search triggered:', event.target.value);
    `;

  const defaultNotificationClick =
    onNotificationClick ||
    `
        console.log('Notifications clicked');
        // Toggle notifications panel
        const panel = document.getElementById('notifications-panel');
        if (panel) {
            panel.classList.toggle('hidden');
        }
    `;

  const defaultProfileClick =
    onProfileClick ||
    `
        console.log('Profile clicked');
        // Toggle profile dropdown
        const dropdown = document.getElementById('profile-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    `;

  const defaultCreatePost =
    onCreatePost ||
    `
        console.log('Create post clicked');
        // Show create post modal or slider
        const createModal = document.getElementById('create-post-modal');
        if (createModal) {
            createModal.classList.remove('hidden');
        }
    `;

  return `
        <header 
            ${id ? `id="${headerId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            <div class="flex items-center w-full xl:px-6 px-2 max-lg:gap-10">
                
                <!-- Left Section: Logo and Menu -->
                <div class="2xl:w-80 lg:w-64">
                    <div class="flex items-center gap-1">
                        
                        <!-- Mobile Menu Button -->
                        <button 
                            type="button"
                            uk-toggle="target: #site__sidebar ; cls :!-translate-x-0"
                            class="flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-gray-100 xl:hidden dark:hover:bg-slate-600 group"
                            aria-label="Toggle menu"
                        >
                            <ion-icon name="menu-outline" class="text-2xl group-aria-expanded:hidden"></ion-icon>
                            <ion-icon name="close-outline" class="hidden text-2xl group-aria-expanded:block"></ion-icon>
                        </button>
                        
                        <!-- Logo -->
                        <div class="logo">
                            <a href="/feed" class="flex items-center">
                                <img src="${logo}" alt="Nexify" class="w-28 md:block hidden dark:!hidden" />
                                <img src="${logoLight}" alt="Nexify" class="dark:md:block hidden" />
                                <img src="${logoMobile}" alt="Nexify" class="hidden max-md:block w-20 dark:!hidden" />
                                <img src="${logoMobileLight}" alt="Nexify" class="hidden dark:max-md:block w-20" />
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Center Section: Search -->
                <div class="flex-1 relative">
                    <div class="max-w-3xl mx-auto flex items-center">
                        ${SearchBox({
                          id: `${headerId}-search`,
                          placeholder: searchPlaceholder,
                          className:
                            "xl:w-[680px] sm:w-96 w-full max-md:hidden",
                          onSearch: defaultSearch,
                          showDropdown: true,
                          recentSearches: [
                            {
                              query: "Jesse Steeve",
                              type: "Friend",
                              avatar: "/assets/images/avatars/avatar-2.jpg",
                            },
                            {
                              query: "Martin Gray",
                              type: "Friend",
                              avatar: "/assets/images/avatars/avatar-3.jpg",
                            },
                            {
                              query: "Delicious Foods",
                              type: "Group",
                              avatar: "/assets/images/group/group-2.jpg",
                            },
                          ],
                        })}
                    </div>
                </div>

                <!-- Right Section: Actions and User -->
                <div class="flex items-center sm:gap-4 gap-2 text-black dark:text-white">
                    
                    <!-- Create Post Button -->
                    <button 
                        type="button"
                        class="sm:p-2 p-1 rounded-full relative sm:bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        onclick="${defaultCreatePost}"
                        aria-label="Create post"
                    >
                        ${Icon({
                          name: "add-circle-outline",
                          type: "ion",
                          size: "lg",
                          className: "sm:hidden",
                        })}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 max-sm:hidden">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                        </svg>
                    </button>

                    <!-- Notifications -->
                    <div class="relative">
                        <button 
                            type="button"
                            class="sm:p-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onclick="${defaultNotificationClick}"
                            aria-label="Notifications"
                        >
                            ${Icon({
                              name: "notifications-outline",
                              type: "ion",
                              size: "lg",
                            })}
                            
                            ${
                              notifications > 0
                                ? `
                                ${NotificationDot({
                                  count: notifications,
                                  showCount: true,
                                  size: "sm",
                                  position: "top-right",
                                })}
                            `
                                : ""
                            }
                        </button>
                    </div>

                    <!-- Messages -->
                    <button 
                        type="button"
                        class="sm:p-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Messages"
                    >
                        ${Icon({
                          name: "chatbubble-ellipses-outline",
                          type: "ion",
                          size: "lg",
                        })}
                    </button>

                    <!-- Profile Dropdown -->
                    <div class="relative">
                        <button 
                            type="button"
                            class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onclick="${defaultProfileClick}"
                            aria-label="Profile menu"
                        >
                            ${AvatarWithName({
                              src: user.avatar,
                              name: user.name,
                              size: "md",
                              className: "sm:block hidden",
                            })}
                            <div class="sm:hidden">
                                ${Icon({
                                  name: "person-circle-outline",
                                  type: "ion",
                                  size: "lg",
                                })}
                            </div>
                        </button>

                        <!-- Profile Dropdown Menu (hidden by default) -->
                        <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <div class="py-1">
                                <a href="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    ${Icon({ name: "person-outline", type: "ion", size: "sm", className: "mr-3" })}
                                    Profile
                                </a>
                                <a href="/settings" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    ${Icon({ name: "settings-outline", type: "ion", size: "sm", className: "mr-3" })}
                                    Settings
                                </a>
                                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <button type="button" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
                                    ${Icon({ name: "log-out-outline", type: "ion", size: "sm", className: "mr-3" })}
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <script>
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(event) {
            const profileDropdown = document.getElementById('profile-dropdown');
            const profileButton = event.target.closest('[aria-label="Profile menu"]');
            
            if (profileDropdown && !profileButton) {
                profileDropdown.classList.add('hidden');
            }
        });

        // Mobile search toggle
        function toggleMobileSearch() {
            const search = document.getElementById('${headerId}-search');
            if (search) {
                search.classList.toggle('max-md:hidden');
            }
        }
        </script>
    `;
};

export default Header;
