/**
 * GridView Component (AngularJS)
 * Grid layout for displaying items using AngularJS
 */

import GridItem from "../atoms/GridItem.js";

const GridView = ({
  id = "",
  items = [],
  columns = 3,
  gap = 4,
  className = "",
  itemComponent = "",
  onItemClick = "",
  ...props
} = {}) => {
  // Grid column classes
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  // Gap classes
  const gapClasses = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  };

  const baseClasses = [
    "grid",
    columnClasses[columns] || columnClasses[3],
    gapClasses[gap] || gapClasses[4],
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

  const gridId = id || `grid-view-${Math.random().toString(36).substr(2, 9)}`;

  return `
        <div 
            ${id ? `id="${gridId}"` : ""}
            class="${baseClasses}"
            ng-controller="GridViewController"
            ${ngAttrs}
            ${attrs}
        >
            <!-- Empty State -->
            <div ng-if="!items || items.length === 0" class="col-span-full text-center py-12">
                <div class="text-gray-400 dark:text-gray-600">
                    <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-lg font-medium text-gray-500 dark:text-gray-400">No items to display</p>
                    <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Items will appear here when available</p>
                </div>
            </div>

            <!-- Grid Items -->
            <div ng-repeat="item in items track by $index" 
                 class="grid-item-wrapper"
                 ng-click="${onItemClick ? `${onItemClick}(item, $index)` : ""}"
                 ng-class="{'cursor-pointer': ${!!onItemClick}}">
                
                ${
                  itemComponent ||
                  GridItem({
                    ngClick: onItemClick ? `${onItemClick}(item, $index)` : "",
                    clickable: !!onItemClick,
                  })
                }
            </div>
        </div>
    `;
};

// AngularJS Controller
const GridViewController = `
    <script>
    // Define AngularJS controller for GridView
    if (typeof angular !== 'undefined') {
        angular.module('nexifyApp').controller('GridViewController', function($scope) {
            // Initialize items if not provided
            if (!$scope.items) {
                $scope.items = [];
            }

            // Sort function
            $scope.sortItems = function(field, direction = 'asc') {
                if (!$scope.items || !field) return;
                
                $scope.items.sort((a, b) => {
                    let aVal = a[field];
                    let bVal = b[field];
                    
                    // Handle different data types
                    if (typeof aVal === 'string') {
                        aVal = aVal.toLowerCase();
                        bVal = bVal.toLowerCase();
                    }
                    
                    if (direction === 'asc') {
                        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                    } else {
                        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                    }
                });
            };

            // Filter function
            $scope.filterItems = function(filterFn) {
                if (!$scope.originalItems) {
                    $scope.originalItems = [...$scope.items];
                }
                
                if (typeof filterFn === 'function') {
                    $scope.items = $scope.originalItems.filter(filterFn);
                } else {
                    $scope.items = [...$scope.originalItems];
                }
            };

            // Search function
            $scope.searchItems = function(query, fields = ['title', 'name', 'content']) {
                if (!query) {
                    if ($scope.originalItems) {
                        $scope.items = [...$scope.originalItems];
                    }
                    return;
                }
                
                if (!$scope.originalItems) {
                    $scope.originalItems = [...$scope.items];
                }
                
                const lowerQuery = query.toLowerCase();
                $scope.items = $scope.originalItems.filter(item => {
                    return fields.some(field => {
                        const value = item[field];
                        return value && value.toString().toLowerCase().includes(lowerQuery);
                    });
                });
            };
        });
    }
    </script>
`;

// Export both component and controller
GridView.controller = GridViewController;

export default GridView;
