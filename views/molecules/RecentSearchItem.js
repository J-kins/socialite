/**
 * RecentSearchItem Component
 * Recent search result item with clickable functionality
 */

import Link from "../atoms/Link.js";
import Text from "../atoms/Text.js";
import Icon from "../atoms/Icon.js";

const RecentSearchItem = ({ id, query, href, className = "" }) => `
  <div class="recent-search-item ${className}" id="${id}">
    ${Icon({ id: `${id}-icon`, name: "time-outline", className: "w-4 h-4 text-gray-400 flex-shrink-0" })}
    ${Link({
      id: `${id}-link`,
      href: href || `/search?q=${encodeURIComponent(query)}`,
      text: query || "Search",
      className: "flex-1 text-gray-700 hover:text-blue-600 transition-colors",
    })}
    <button class="remove-search" id="${id}-remove" aria-label="Remove from search history">
      ${Icon({ id: `${id}-remove-icon`, name: "close", className: "w-4 h-4 text-gray-400 hover:text-red-500" })}
    </button>
  </div>
`;

// Initialize recent search functionality
document.addEventListener("DOMContentLoaded", () => {
  const initRecentSearchItem = (id) => {
    const link = document.querySelector(`#${id}-link`);
    const removeBtn = document.querySelector(`#${id}-remove`);
    const item = document.querySelector(`#${id}`);

    if (link) {
      link.addEventListener("click", (e) => {
        const query = link.textContent.trim();

        // Dispatch search event
        document.dispatchEvent(
          new CustomEvent("search:recent", {
            detail: { query, href: link.href },
          }),
        );
      });
    }

    if (removeBtn && item) {
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const query = link?.textContent.trim();

        // Remove from DOM with animation
        item.classList.add("opacity-0", "transform", "scale-95");
        setTimeout(() => {
          item.remove();
        }, 150);

        // Dispatch remove event
        document.dispatchEvent(
          new CustomEvent("search:remove", {
            detail: { query, itemId: id },
          }),
        );

        // Remove from localStorage if available
        try {
          const recentSearches = JSON.parse(
            localStorage.getItem("recentSearches") || "[]",
          );
          const updatedSearches = recentSearches.filter(
            (search) => search !== query,
          );
          localStorage.setItem(
            "recentSearches",
            JSON.stringify(updatedSearches),
          );
        } catch (e) {
          console.warn("Could not update recent searches:", e);
        }
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".recent-search-item").forEach((item) => {
    if (item.id) initRecentSearchItem(item.id);
  });
});

export default RecentSearchItem;
