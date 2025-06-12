/**
 * TableRow Component (AngularJS)
 * Table row for data display with AngularJS integration
 */

import TableCell from "../atoms/TableCell.js";

const TableRow = ({ id, cells = [], className = "" }) => `
  <tr class="table-row ${className}" id="${id}" ng-repeat="row in $ctrl.rows track by row.id">
    <td ng-repeat="cell in row.cells track by $index" 
        class="table-cell px-4 py-3 border-b border-gray-200"
        ng-bind-html="cell.content">
    </td>
  </tr>
`;

// AngularJS Directive
if (typeof angular !== "undefined") {
  angular.module("nexifyApp", []).directive("tableRow", function () {
    return {
      restrict: "E",
      scope: {
        id: "@",
        cells: "=",
        row: "=",
      },
      template: function (element, attrs) {
        return `
          <tr class="table-row" id="${attrs.id || "table-row"}">
            <td ng-repeat="cell in cells track by $index" 
                class="table-cell px-4 py-3 border-b border-gray-200 text-sm text-gray-900"
                ng-class="cell.className"
                ng-click="cell.onClick && cell.onClick(cell, $index)">
              <span ng-if="cell.type === 'text'" ng-bind="cell.content"></span>
              <img ng-if="cell.type === 'image'" 
                   ng-src="{{cell.content}}" 
                   alt="{{cell.alt}}"
                   class="w-10 h-10 rounded-full object-cover">
              <button ng-if="cell.type === 'button'" 
                      ng-click="cell.action && cell.action(cell)"
                      class="px-3 py-1 text-xs rounded-full"
                      ng-class="cell.buttonClass || 'bg-blue-100 text-blue-800'">
                {{cell.content}}
              </button>
            </td>
          </tr>
        `;
      },
      link: function (scope, element, attrs) {
        // Handle row selection
        element.on("click", function () {
          if (scope.row && scope.row.selectable) {
            scope.$apply(function () {
              scope.row.selected = !scope.row.selected;

              // Dispatch selection event
              scope.$emit("tableRow:select", {
                rowId: scope.id,
                row: scope.row,
                selected: scope.row.selected,
              });
            });
          }
        });

        // Hover effects
        element.on("mouseenter", function () {
          element.addClass("bg-gray-50");
        });

        element.on("mouseleave", function () {
          element.removeClass("bg-gray-50");
        });
      },
    };
  });
}

export default TableRow;
