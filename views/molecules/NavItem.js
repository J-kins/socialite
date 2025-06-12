/**
 * NavItem Component
 * Navigation menu item with icon for top navigation
 */

import Link from "../atoms/Link.js";
import Icon from "../atoms/Icon.js";

const NavItem = ({
  id,
  href,
  label,
  iconName,
  active = false,
  badge,
  className = "",
}) => `
  <div class="nav-item ${active ? "active" : ""} ${className}" id="${id}">
    ${Link({
      id: `${id}-link`,
      href,
      text: "",
      className:
        "nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 focus:bg-gray-100",
      content: `
        ${iconName ? Icon({ id: `${id}-icon`, name: iconName, className: "w-5 h-5" }) : ""}
        <span class="nav-label">${label || "Nav"}</span>
        ${badge ? `<span class="nav-badge bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">${badge}</span>` : ""}
      `,
    })}
  </div>
`;

// Initialize navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const initNavItem = (id) => {
    const link = document.querySelector(`#${id}-link`);
    const navItem = document.querySelector(`#${id}`);

    if (link && navItem) {
      link.addEventListener("click", (e) => {
        // Remove active from other nav items
        document.querySelectorAll(".nav-item.active").forEach((item) => {
          item.classList.remove("active");
        });

        // Add active to current nav item
        navItem.classList.add("active");

        // Update URL if it's a SPA route
        if (link.href.startsWith("#")) {
          e.preventDefault();
          const route = link.href.substring(link.href.indexOf("#") + 1);

          // Dispatch navigation event for SPA routing
          document.dispatchEvent(
            new CustomEvent("nav:route", {
              detail: {
                route,
                label: navItem.querySelector(".nav-label")?.textContent,
                itemId: id,
              },
            }),
          );
        }

        // Dispatch general navigation event
        document.dispatchEvent(
          new CustomEvent("nav:click", {
            detail: {
              href: link.href,
              label: navItem.querySelector(".nav-label")?.textContent,
              itemId: id,
            },
          }),
        );
      });

      // Keyboard navigation
      link.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          link.click();
        }
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".nav-item").forEach((item) => {
    if (item.id) initNavItem(item.id);
  });
});

export default NavItem;
