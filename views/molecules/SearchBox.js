/**
 * SearchBox Component
 * Search input with button and dropdown results
 */

import Input from "../atoms/Input.js";
import Button from "../atoms/Button.js";
import Icon from "../atoms/Icon.js";

const SearchBox = ({
  id = "",
  placeholder = "Search...",
  value = "",
  showButton = true,
  showDropdown = true,
  recentSearches = [],
  className = "",
  onSearch = "",
  onChange = "",
  onFocus = "",
  ...props
} = {}) => {
  const baseClasses = ["relative", "w-full", className]
    .filter(Boolean)
    .join(" ");

  const searchId = id || `search-${Math.random().toString(36).substr(2, 9)}`;
  const inputId = `${searchId}-input`;
  const dropdownId = `${searchId}-dropdown`;

  // Search icon
  const searchIcon = Icon({
    name: "search",
    type: "svg",
    size: "sm",
    className: "text-gray-400",
  });

  // Default search function
  const defaultSearch = `
        const input = document.getElementById('${inputId}');
        const query = input.value.trim();
        if (query) {
            console.log('Searching for:', query);
            // Add to recent searches
            const dropdown = document.getElementById('${dropdownId}');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
    `;

  const handleSearch = onSearch || defaultSearch;

  // Handle input changes and show dropdown
  const handleInputChange = `
        const dropdown = document.getElementById('${dropdownId}');
        const input = this;
        if (input.value.length > 0 && dropdown) {
            dropdown.style.display = 'block';
        } else if (dropdown) {
            dropdown.style.display = 'none';
        }
        ${onChange ? `(${onChange})(event);` : ""}
    `;

  // Handle input focus
  const handleInputFocus = `
        const dropdown = document.getElementById('${dropdownId}');
        if (dropdown && this.value.length === 0) {
            dropdown.style.display = 'block';
        }
        ${onFocus ? `(${onFocus})(event);` : ""}
    `;

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Recent searches dropdown
  const recentSearchesHTML = recentSearches
    .map(
      (search, index) => `
        <a href="#" 
           class="relative px-3 py-2 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
           onclick="document.getElementById('${inputId}').value = '${search.query}'; ${handleSearch}; event.preventDefault();">
            <div class="flex-shrink-0">
                ${
                  search.type === "user"
                    ? `
                    <img src="${search.avatar || ""}" class="w-8 h-8 rounded-full" alt="${search.query}" />
                `
                    : `
                    ${Icon({ name: "search", type: "svg", size: "sm", className: "text-gray-400" })}
                `
                }
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">${search.query}</div>
                ${search.type ? `<div class="text-xs text-gray-500 dark:text-gray-400">${search.type}</div>` : ""}
            </div>
            <button type="button" 
                    class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onclick="event.stopPropagation(); this.closest('a').remove();">
                ${Icon({ name: "close", type: "svg", size: "xs" })}
            </button>
        </a>
    `,
    )
    .join("");

  return `
        <div 
            ${id ? `id="${searchId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            <div class="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <div class="pl-3 flex items-center pointer-events-none">
                    ${searchIcon}
                </div>
                
                ${Input({
                  id: inputId,
                  type: "text",
                  placeholder: placeholder,
                  value: value,
                  className: "border-0 bg-transparent focus:ring-0 pl-2 pr-2",
                  onChange: handleInputChange,
                  onFocus: handleInputFocus,
                  onKeyDown: `if (event.key === 'Enter') { ${handleSearch}; }`,
                })}
                
                ${
                  showButton
                    ? `
                    <div class="pr-2">
                        ${Button({
                          variant: "ghost",
                          size: "sm",
                          label: "Search",
                          onClick: handleSearch,
                          className: "px-3",
                        })}
                    </div>
                `
                    : ""
                }
            </div>

            ${
              showDropdown
                ? `
                <div id="${dropdownId}" 
                     class="hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 max-h-96 overflow-y-auto">
                    
                    ${
                      recentSearches.length > 0
                        ? `
                        <div class="p-2">
                            <div class="flex justify-between items-center px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <span>Recent Searches</span>
                                <button type="button" 
                                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        onclick="this.closest('.p-2').querySelector('.space-y-1').innerHTML = '';">
                                    Clear
                                </button>
                            </div>
                            <div class="space-y-1">
                                ${recentSearchesHTML}
                            </div>
                        </div>
                    `
                        : `
                        <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                            <p>No recent searches</p>
                        </div>
                    `
                    }
                </div>
            `
                : ""
            }
        </div>

        <script>
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const searchBox = document.getElementById('${searchId}');
            const dropdown = document.getElementById('${dropdownId}');
            if (searchBox && dropdown && !searchBox.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
        </script>
    `;
};

export default SearchBox;
