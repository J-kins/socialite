/**
 * TableCell Component (AngularJS)
 * Table cell for table layouts using AngularJS
 */

const TableCell = ({
  id = "",
  content = "",
  type = "td", // 'td' or 'th'
  className = "",
  sortable = false,
  sortKey = "",
  align = "left",
  ...props
} = {}) => {
  // Alignment classes
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const baseClasses = [
    "px-4",
    "py-3",
    type === "th"
      ? "font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
      : "text-gray-700 dark:text-gray-300",
    alignClasses[align] || alignClasses.left,
    sortable
      ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
      : "",
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

  const element = type === "th" ? "th" : "td";
  const cellId =
    id ||
    (type === "th"
      ? "header-{{$index}}"
      : "cell-{{$parent.$index}}-{{$index}}");

  // Sort functionality for headers
  const sortClick =
    sortable && type === "th" ? `ng-click="sort('${sortKey}')"` : "";

  return `
        <${element}
            ${id ? `id="${cellId}"` : ""}
            class="${baseClasses}"
            ${sortClick}
            ${ngAttrs}
            ${attrs}
        >
            <div class="${sortable ? "flex items-center justify-between" : ""}">
                <span ng-bind-html="cell.content || '${content}'"></span>
                
                ${
                  sortable && type === "th"
                    ? `
                    <div class="ml-2 flex flex-col">
                        <svg class="w-3 h-3 text-gray-400" ng-class="{'text-blue-600': sortField === '${sortKey}' && sortDirection === 'asc'}" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                        </svg>
                        <svg class="w-3 h-3 text-gray-400 -mt-1" ng-class="{'text-blue-600': sortField === '${sortKey}' && sortDirection === 'desc'}" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </div>
                `
                    : ""
                }
            </div>
        </${element}>
    `;
};

// AngularJS Directive
const TableCellDirective = () => {
  return `
        <script>
        // Define AngularJS directive for TableCell
        if (typeof angular !== 'undefined') {
            angular.module('nexifyApp').directive('tableCell', function() {
                return {
                    restrict: 'E',
                    scope: {
                        cell: '=',
                        type: '@',
                        sortable: '=',
                        sortKey: '@',
                        sort: '&'
                    },
                    template: function(element, attrs) {
                        return \`${TableCell({
                          type: "{{type}}",
                          sortable: "{{sortable}}",
                          sortKey: "{{sortKey}}",
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
TableCell.directive = TableCellDirective;

export default TableCell;
