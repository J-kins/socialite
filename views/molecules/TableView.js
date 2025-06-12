/**
 * TableView Component (AngularJS)
 * Table layout for displaying data using AngularJS
 */

import TableHeader from "../atoms/TableHeader.js";
import TableCell from "../atoms/TableCell.js";

const TableView = ({
  id = "",
  columns = [],
  data = [],
  sortable = true,
  striped = true,
  bordered = false,
  hover = true,
  className = "",
  ...props
} = {}) => {
  const baseClasses = [
    "w-full",
    "text-sm",
    "text-left",
    "text-gray-500",
    "dark:text-gray-400",
    striped ? "table-striped" : "",
    bordered ? "border border-gray-200 dark:border-gray-700" : "",
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

  const tableId = id || `table-view-${Math.random().toString(36).substr(2, 9)}`;

  return `
        <div class="overflow-x-auto shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <table 
                ${id ? `id="${tableId}"` : ""}
                class="${baseClasses}"
                ng-controller="TableViewController"
                ${ngAttrs}
                ${attrs}
            >
                <!-- Table Header -->
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th ng-repeat="column in columns" 
                            class="px-6 py-3"
                            ng-class="{
                                'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none': column.sortable && ${sortable},
                                'text-center': column.align === 'center',
                                'text-right': column.align === 'right'
                            }"
                            ng-click="column.sortable && ${sortable} && sort(column.key)">
                            
                            <div class="flex items-center justify-between" ng-if="column.sortable && ${sortable}">
                                <span>{{column.label}}</span>
                                <div class="ml-2 flex flex-col">
                                    <svg class="w-3 h-3 text-gray-400" 
                                         ng-class="{'text-blue-600': sortField === column.key && sortDirection === 'asc'}" 
                                         fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                                    </svg>
                                    <svg class="w-3 h-3 text-gray-400 -mt-1" 
                                         ng-class="{'text-blue-600': sortField === column.key && sortDirection === 'desc'}" 
                                         fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <span ng-if="!column.sortable || !${sortable}">{{column.label}}</span>
                        </th>
                    </tr>
                </thead>

                <!-- Table Body -->
                <tbody>
                    <!-- Empty State -->
                    <tr ng-if="!data || data.length === 0">
                        <td ng-attr-colspan="{{columns.length}}" class="px-6 py-12 text-center">
                            <div class="text-gray-400 dark:text-gray-600">
                                <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p class="text-lg font-medium text-gray-500 dark:text-gray-400">No data available</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Data will appear here when available</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Data Rows -->
                    <tr ng-repeat="row in data track by $index" 
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        ng-class="{
                            'hover:bg-gray-50 dark:hover:bg-gray-600': ${hover},
                            'bg-gray-50 dark:bg-gray-700': $even && ${striped}
                        }">
                        
                        <td ng-repeat="column in columns" 
                            class="px-6 py-4"
                            ng-class="{
                                'font-medium text-gray-900 dark:text-white': $first,
                                'text-center': column.align === 'center',
                                'text-right': column.align === 'right'
                            }">
                            
                            <!-- Custom cell renderer -->
                            <div ng-if="column.render" ng-bind-html="column.render(row[column.key], row, $index)"></div>
                            
                            <!-- Default cell content -->
                            <span ng-if="!column.render">{{row[column.key]}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
};

// AngularJS Controller
const TableViewController = `
    <script>
    // Define AngularJS controller for TableView
    if (typeof angular !== 'undefined') {
        angular.module('nexifyApp').controller('TableViewController', function($scope) {
            // Initialize sort state
            $scope.sortField = null;
            $scope.sortDirection = 'asc';

            // Initialize data if not provided
            if (!$scope.data) {
                $scope.data = [];
            }

            if (!$scope.columns) {
                $scope.columns = [];
            }

            // Sort function
            $scope.sort = function(field) {
                if ($scope.sortField === field) {
                    $scope.sortDirection = $scope.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    $scope.sortField = field;
                    $scope.sortDirection = 'asc';
                }

                $scope.data.sort((a, b) => {
                    let aVal = a[field];
                    let bVal = b[field];
                    
                    // Handle null/undefined values
                    if (aVal == null && bVal == null) return 0;
                    if (aVal == null) return 1;
                    if (bVal == null) return -1;
                    
                    // Handle different data types
                    if (typeof aVal === 'string' && typeof bVal === 'string') {
                        aVal = aVal.toLowerCase();
                        bVal = bVal.toLowerCase();
                    }
                    
                    let result = 0;
                    if (aVal < bVal) result = -1;
                    else if (aVal > bVal) result = 1;
                    
                    return $scope.sortDirection === 'asc' ? result : -result;
                });
            };

            // Filter function
            $scope.filterData = function(filterFn) {
                if (!$scope.originalData) {
                    $scope.originalData = [...$scope.data];
                }
                
                if (typeof filterFn === 'function') {
                    $scope.data = $scope.originalData.filter(filterFn);
                } else {
                    $scope.data = [...$scope.originalData];
                }
            };

            // Search function
            $scope.searchData = function(query) {
                if (!query) {
                    if ($scope.originalData) {
                        $scope.data = [...$scope.originalData];
                    }
                    return;
                }
                
                if (!$scope.originalData) {
                    $scope.originalData = [...$scope.data];
                }
                
                const lowerQuery = query.toLowerCase();
                $scope.data = $scope.originalData.filter(row => {
                    return $scope.columns.some(column => {
                        const value = row[column.key];
                        return value && value.toString().toLowerCase().includes(lowerQuery);
                    });
                });
            };
        });
    }
    </script>
`;

// Export both component and controller
TableView.controller = TableViewController;

export default TableView;
