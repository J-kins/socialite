/**
 * MainLayout Template
 * Base layout for the main application with header, sidebar, and content area
 */

import Header from "../organisms/Header.js";

const MainLayout = ({
  id = "",
  title = "Nexify",
  user = {},
  children = "",
  sidebarContent = "",
  headerProps = {},
  className = "",
  showSidebar = true,
  ...props
} = {}) => {
  const layoutId =
    id || `main-layout-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    "min-h-screen",
    "bg-gray-50",
    "dark:bg-gray-900",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Default sidebar content
  const defaultSidebar =
    sidebarContent ||
    `
        <div id="site__sidebar" class="fixed top-0 left-0 z-[99] pt-[--m-top] overflow-hidden transition-transform duration-300 max-lg:-translate-x-full lg:translate-x-0 w-[--w-side] h-screen">
            <!-- Sidebar backdrop for mobile -->
            <div class="absolute bg-slate-100/40 backdrop-blur w-screen h-screen dark:bg-slate-800/40 lg:hidden" uk-toggle="target: #site__sidebar ; cls :!-translate-x-0"></div>
            
            <!-- Sidebar panel -->
            <div class="flex flex-col h-full bg-white shadow-xl dark:bg-slate-800">
                
                <!-- Sidebar Navigation -->
                <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
                    
                    <!-- Main Navigation -->
                    <div class="space-y-1">
                        <a href="/feed" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="home-outline" class="mr-3 text-lg"></ion-icon>
                            Feed
                        </a>
                        
                        <a href="/messages" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="chatbubbles-outline" class="mr-3 text-lg"></ion-icon>
                            Messages
                        </a>
                        
                        <a href="/groups" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="people-outline" class="mr-3 text-lg"></ion-icon>
                            Groups
                        </a>
                        
                        <a href="/pages" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="newspaper-outline" class="mr-3 text-lg"></ion-icon>
                            Pages
                        </a>
                        
                        <a href="/events" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="calendar-outline" class="mr-3 text-lg"></ion-icon>
                            Events
                        </a>
                        
                        <a href="/market" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="storefront-outline" class="mr-3 text-lg"></ion-icon>
                            Market
                        </a>
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    <!-- Secondary Navigation -->
                    <div class="space-y-1">
                        <a href="/blog" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="library-outline" class="mr-3 text-lg"></ion-icon>
                            Blog
                        </a>
                        
                        <a href="/funding" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="heart-outline" class="mr-3 text-lg"></ion-icon>
                            Funding
                        </a>
                        
                        <a href="/games" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="game-controller-outline" class="mr-3 text-lg"></ion-icon>
                            Games
                        </a>
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    <!-- Account Section -->
                    <div class="space-y-1">
                        <a href="/settings" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group">
                            <ion-icon name="settings-outline" class="mr-3 text-lg"></ion-icon>
                            Settings
                        </a>
                        
                        <button type="button" onclick="toggleTheme()" class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group text-left">
                            <ion-icon name="moon-outline" class="mr-3 text-lg dark:hidden"></ion-icon>
                            <ion-icon name="sunny-outline" class="mr-3 text-lg hidden dark:block"></ion-icon>
                            <span class="dark:hidden">Dark Mode</span>
                            <span class="hidden dark:block">Light Mode</span>
                        </button>
                    </div>
                </nav>

                <!-- Sidebar Footer -->
                <div class="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div class="flex items-center">
                        <img src="${user.avatar || "/assets/images/avatars/default.jpg"}" alt="${user.name}" class="w-8 h-8 rounded-full" />
                        <div class="ml-3 flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">${user.name || "User"}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${user.email || ""}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  return `
        <!DOCTYPE html>
        <html lang="en" class="${localStorage.getItem("theme") === "dark" ? "dark" : ""}">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
            <!-- Favicon -->
            <link href="/assets/images/favicon.png" rel="icon" type="image/png">
            
            <title>${title}</title>
            <meta name="description" content="Nexify - Social sharing network">
            
            <!-- CSS -->
            <link rel="stylesheet" href="/assets/css/tailwind.css">
            <link rel="stylesheet" href="/assets/css/style.css">
            
            <!-- Google Fonts -->
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
            
            <!-- CSS Variables -->
            <style>
                :root {
                    --m-top: 64px;
                    --w-side: 280px;
                    --w-side-sm: 240px;
                }
            </style>
        </head>
        <body class="font-inter">
            
            <div 
                ${id ? `id="${layoutId}"` : ""}
                class="${baseClasses}"
                ${attrs}
            >
                <!-- Header -->
                ${Header({
                  id: `${layoutId}-header`,
                  user: user,
                  ...headerProps,
                })}

                <!-- Sidebar -->
                ${showSidebar ? defaultSidebar : ""}

                <!-- Main Content -->
                <main class="${showSidebar ? "lg:ml-[--w-side]" : ""} pt-[--m-top]">
                    <div class="min-h-screen">
                        ${children}
                    </div>
                </main>
            </div>

            <!-- Scripts -->
            <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
            <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
            <script src="/assets/js/uikit.min.js"></script>
            <script src="/assets/js/script.js"></script>
            <script src="/assets/js/simplebar.js"></script>

            <!-- jQuery -->
            <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

            <!-- AngularJS for grid/table components -->
            <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>

            <!-- Theme Toggle Function -->
            <script>
                function toggleTheme() {
                    const html = document.documentElement;
                    const isDark = html.classList.contains('dark');
                    
                    if (isDark) {
                        html.classList.remove('dark');
                        localStorage.setItem('theme', 'light');
                    } else {
                        html.classList.add('dark');
                        localStorage.setItem('theme', 'dark');
                    }
                }

                // Initialize theme
                function initTheme() {
                    const stored = localStorage.getItem('theme');
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    
                    if (stored === 'dark' || (!stored && prefersDark)) {
                        document.documentElement.classList.add('dark');
                    }
                }

                // Initialize on load
                initTheme();
            </script>

            <!-- Nexify Views Library -->
            <script type="module">
                import { initializeViews } from '/views/index.js';
                initializeViews();
            </script>
        </body>
        </html>
    `;
};

export default MainLayout;
