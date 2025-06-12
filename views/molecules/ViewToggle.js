/**
 * ViewToggle Component (AngularJS)
 * Toggle between grid and table views
 */

import Button from "../atoms/Button.js";
import Icon from "../atoms/Icon.js";

const ViewToggle = ({
  id = "",
  currentView = "grid", // 'grid' or 'table'
  className = "",
  onViewChange = "",
  ...props
} = {}) => {
  const toggleId =
    id || `view-toggle-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    "view-toggle",
    "inline-flex",
    "items-center",
    "bg-gray-100",
    "dark:bg-gray-800",
    "rounded-lg",
    "p-1",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .filter(([key]) => !key.startsWith("ng"))
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // AngularJS attributes
  const ngAttrs = Object.entries(props)
    .filter(([key]) => key.startsWith("ng"))
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const defaultViewChange = onViewChange || "switchView(view)";

  return `
        <div 
            ${id ? `id="${toggleId}"` : ""}
            class="${baseClasses}"
            ng-controller="ViewToggleController"
            ${ngAttrs}
            ${attrs}
        >
            <!-- Grid View Button -->
            <button 
                type="button"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
                ng-class="{
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm': currentView === 'grid',
                    'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300': currentView !== 'grid'
                }"
                ng-click="setView('grid')"
                title="Grid View"
            >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
            </button>

            <!-- Table View Button -->
            <button 
                type="button"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
                ng-class="{
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm': currentView === 'table',
                    'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300': currentView !== 'table'
                }"
                ng-click="setView('table')"
                title="Table View"
            >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clip-rule="evenodd" />
                </svg>
                Table
            </button>
        </div>
    `;
};

// AngularJS Controller
const ViewToggleController = `
    <script>
    // Define AngularJS controller for ViewToggle
    if (typeof angular !== 'undefined') {
        angular.module('nexifyApp').controller('ViewToggleController', function($scope, $rootScope) {
            // Initialize current view
            $scope.currentView = '${currentView}';

            // Set view function
            $scope.setView = function(view) {
                if ($scope.currentView !== view) {
                    $scope.currentView = view;
                    
                    // Emit view change event
                    $rootScope.$emit('viewChanged', {
                        view: view,
                        previousView: $scope.currentView
                    });

                    // Call custom handler if provided
                    if (typeof ${defaultViewChange} === 'function') {
                        ${defaultViewChange}(view);
                    }

                    // Update URL parameter (optional)
                    if (window.history && window.history.replaceState) {
                        const url = new URL(window.location);
                        url.searchParams.set('view', view);
                        window.history.replaceState({}, '', url);
                    }
                }
            };

            // Listen for external view changes
            $rootScope.$on('setView', function(event, view) {
                $scope.setView(view);
            });

            // Initialize from URL parameter
            $scope.$on('$routeChangeSuccess', function() {
                const urlParams = new URLSearchParams(window.location.search);
                const viewParam = urlParams.get('view');
                if (viewParam && (viewParam === 'grid' || viewParam === 'table')) {
                    $scope.currentView = viewParam;
                }
            });
        });

        // Global function to switch views programmatically
        window.switchView = function(view) {
            const scope = angular.element(document.querySelector('[ng-controller="ViewToggleController"]')).scope();
            if (scope) {
                scope.$apply(function() {
                    scope.setView(view);
                });
            }
        };
    }
    </script>
`;

// Export both component and controller
ViewToggle.controller = ViewToggleController;

export default ViewToggle;
