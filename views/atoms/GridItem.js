/**
 * GridItem Component (AngularJS)
 * Grid item for grid layouts using AngularJS
 */

const GridItem = ({
  id = "",
  content = "",
  imageUrl = "",
  title = "",
  subtitle = "",
  metadata = "",
  clickable = false,
  className = "",
  ngClick = "",
  ...props
} = {}) => {
  const baseClasses = [
    "grid-item",
    "bg-white",
    "dark:bg-gray-800",
    "rounded-lg",
    "shadow-sm",
    "border",
    "border-gray-200",
    "dark:border-gray-700",
    "overflow-hidden",
    "transition-all",
    "duration-200",
    clickable ? "cursor-pointer hover:shadow-md hover:scale-105" : "",
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

  const itemId = id || "grid-item-{{$index}}";

  return `
        <div
            ${id ? `id="${itemId}"` : ""}
            class="${baseClasses}"
            ${ngClick ? `ng-click="${ngClick}"` : ""}
            ${ngAttrs}
            ${attrs}
        >
            <div ng-if="item.imageUrl || '${imageUrl}'" class="aspect-video bg-gray-100 dark:bg-gray-700">
                <img 
                    ng-src="{{item.imageUrl || '${imageUrl}'}}" 
                    alt="{{item.title || '${title}'}}"
                    class="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
            
            <div class="p-4">
                <h3 ng-if="item.title || '${title}'" class="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {{item.title || '${title}'}}
                </h3>
                
                <p ng-if="item.subtitle || '${subtitle}'" class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {{item.subtitle || '${subtitle}'}}
                </p>
                
                <div ng-if="item.metadata || '${metadata}'" class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {{item.metadata || '${metadata}'}}
                </div>
                
                <div ng-if="item.content || '${content}'" class="mt-2" ng-bind-html="item.content || '${content}'">
                </div>
            </div>
        </div>
    `;
};

// AngularJS Directive
const GridItemDirective = () => {
  return `
        <script>
        // Define AngularJS directive for GridItem
        if (typeof angular !== 'undefined') {
            angular.module('nexifyApp', []).directive('gridItem', function() {
                return {
                    restrict: 'E',
                    scope: {
                        item: '=',
                        onClick: '&',
                        ngClick: '&'
                    },
                    template: function(element, attrs) {
                        return \`${GridItem({
                          ngClick: "{{onClick()}}",
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
GridItem.directive = GridItemDirective;

export default GridItem;
