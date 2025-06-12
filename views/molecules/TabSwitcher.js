/**
 * TabSwitcher Component
 * Tab switcher navigation with active state management
 */

import TabItem from "../atoms/TabItem.js";

const TabSwitcher = ({ id, tabs = [], activeTab, className = "" }) => `
  <div class="tab-switcher ${className}" id="${id}" role="tablist">
    ${tabs
      .map(
        (tab, index) => `
      ${TabItem({
        id: `${id}-${index}`,
        label: tab.label || tab,
        active: (tab.label || tab) === activeTab,
        className: "tab-item",
        tabIndex: index,
        ariaControls: `${id}-panel-${index}`,
      })}
    `,
      )
      .join("")}
  </div>
`;

// Initialize tab switcher functionality
document.addEventListener("DOMContentLoaded", () => {
  const initTabSwitcher = (id) => {
    const tabSwitcher = document.querySelector(`#${id}`);
    const tabButtons = tabSwitcher?.querySelectorAll(".tab-item");

    if (tabButtons) {
      tabButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
          // Remove active from all tabs
          tabButtons.forEach((tab) => {
            tab.classList.remove("active");
            tab.setAttribute("aria-selected", "false");
          });

          // Add active to clicked tab
          button.classList.add("active");
          button.setAttribute("aria-selected", "true");

          // Hide all tab panels
          const panels = document.querySelectorAll(`[id^="${id}-panel-"]`);
          panels.forEach((panel) => {
            panel.classList.add("hidden");
            panel.setAttribute("aria-hidden", "true");
          });

          // Show corresponding panel
          const targetPanel = document.querySelector(`#${id}-panel-${index}`);
          if (targetPanel) {
            targetPanel.classList.remove("hidden");
            targetPanel.setAttribute("aria-hidden", "false");
          }

          // Dispatch tab change event
          document.dispatchEvent(
            new CustomEvent("tab:changed", {
              detail: {
                tabId: button.id,
                index,
                label: button.textContent.trim(),
                panelId: `${id}-panel-${index}`,
              },
            }),
          );
        });

        // Keyboard navigation
        button.addEventListener("keydown", (e) => {
          const currentIndex = Array.from(tabButtons).indexOf(button);
          let newIndex = currentIndex;

          switch (e.key) {
            case "ArrowLeft":
              newIndex =
                currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
              break;
            case "ArrowRight":
              newIndex =
                currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
              break;
            case "Home":
              newIndex = 0;
              break;
            case "End":
              newIndex = tabButtons.length - 1;
              break;
            default:
              return;
          }

          e.preventDefault();
          tabButtons[newIndex].focus();
        });
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".tab-switcher").forEach((switcher) => {
    if (switcher.id) initTabSwitcher(switcher.id);
  });
});

export default TabSwitcher;
