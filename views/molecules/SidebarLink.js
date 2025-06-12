/**
 * SidebarLink Component
 * Sidebar navigation link with icon
 */

import Link from "../atoms/Link.js";
import Icon from "../atoms/Icon.js";

const SidebarLink = ({
  id,
  href,
  label,
  iconName,
  active = false,
  className = "",
}) => `
  <div class="sidebar-link ${active ? "active" : ""} ${className}" id="${id}">
    ${Icon({ id: `${id}-icon`, name: iconName || "home", className: "w-5 h-5 mr-3 flex-shrink-0" })}
    ${Link({
      id: `${id}-link`,
      href,
      text: label || "Link",
      className: "flex-1 truncate",
    })}
  </div>
`;

// Initialize sidebar link functionality
document.addEventListener("DOMContentLoaded", () => {
  const initSidebarLink = (id) => {
    const linkEl = document.querySelector(`#${id}-link`);
    const sidebarLink = document.querySelector(`#${id}`);

    if (linkEl && sidebarLink) {
      linkEl.addEventListener("click", (e) => {
        // Remove active from other sidebar links
        document.querySelectorAll(".sidebar-link.active").forEach((link) => {
          link.classList.remove("active");
        });

        // Add active to current link
        sidebarLink.classList.add("active");

        // Dispatch navigation event
        document.dispatchEvent(
          new CustomEvent("sidebar:navigate", {
            detail: { href: linkEl.href, label: linkEl.textContent },
          }),
        );
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    if (link.id) initSidebarLink(link.id);
  });
});

export default SidebarLink;
