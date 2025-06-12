/**
 * TableHeader Component (AngularJS)
 * Table header for table layouts using AngularJS
 */

import TableCell from "./TableCell.js";

const TableHeader = ({
  id = "",
  columns = [],
  sortable = false,
  className = "",
  ...props
} = {}) => {
  const baseClasses = [
    "border-b",
    "border-gray-200",
    "dark:border-gray-700",
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

  return `
        <thead class="${baseClasses}">
            <tr ${ngAttrs} ${attrs}>
                <th ng-repeat="column in columns" 
                    class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 text-left"
                    ng-class="{
                        'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none': column.sortable,
                        'text-center': column.align === 'center',
                        'text-right': column.align === 'right'
                    }"
                    ng-click="column.sortable && sort(column.key)"
                >
                    <div class="flex items-center justify-between" ng-if="column.sortable">
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
                    <span ng-if="!column.sortable">{{column.label}}</span>
                </th>
            </tr>
        </thead>
    `;
};

// AngularJS Directive
const TableHeaderDirective = () => {
  return `
        <script>
        // Define AngularJS directive for TableHeader
        if (typeof angular !== 'undefined') {
            angular.module('nexifyApp').directive('tableHeader', function() {
                return {
                    restrict: 'E',
                    scope: {
                        columns: '=',
                        sort: '&',
                        sortField: '=',
                        sortDirection: '='
                    },
                    template: function(element, attrs) {
                        return \`${TableHeader({
                          className: attrs.class || "",
                        })}\`;
                    }
                };
            });
        }
        </script>
    `;
};

// Export both component and directive
TableHeader.directive = TableHeaderDirective;

export default TableHeader;
