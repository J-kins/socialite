/**
 * AccordionItem Component
 * Collapsible accordion item with toggle functionality
 */

import Text from "../atoms/Text.js";
import Icon from "../atoms/Icon.js";
import ToggleButton from "../atoms/ToggleButton.js";

const AccordionItem = ({
  id,
  title,
  content,
  isOpen = false,
  className = "",
}) => `
  <div class="accordion-item ${className}" id="${id}">
    <div class="accordion-header" id="${id}-header">
      ${ToggleButton({
        id: `${id}-toggle`,
        active: isOpen,
        className:
          "w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors",
        ariaExpanded: isOpen,
        ariaControls: `${id}-content`,
      })}
      ${Text({ id: `${id}-title`, content: title || "Title", className: "font-semibold text-gray-900" })}
      ${Icon({
        id: `${id}-chevron`,
        name: "chevron-down",
        className: `w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`,
      })}
    </div>
    <div class="accordion-content ${isOpen ? "" : "hidden"}" id="${id}-content" aria-hidden="${!isOpen}">
      <div class="accordion-body p-4 border-t border-gray-200">
        ${Text({ id: `${id}-content-text`, content: content || "Content", className: "text-gray-700" })}
      </div>
    </div>
  </div>
`;

// Initialize accordion functionality
document.addEventListener("DOMContentLoaded", () => {
  const initAccordionItem = (id) => {
    const toggle = document.querySelector(`#${id}-toggle`);
    const content = document.querySelector(`#${id}-content`);
    const chevron = document.querySelector(`#${id}-chevron`);

    if (toggle && content) {
      toggle.addEventListener("click", () => {
        const isOpen = !content.classList.contains("hidden");

        if (isOpen) {
          // Close
          content.classList.add("hidden");
          content.setAttribute("aria-hidden", "true");
          toggle.setAttribute("aria-expanded", "false");
          if (chevron) chevron.classList.remove("rotate-180");
        } else {
          // Open
          content.classList.remove("hidden");
          content.setAttribute("aria-hidden", "false");
          toggle.setAttribute("aria-expanded", "true");
          if (chevron) chevron.classList.add("rotate-180");
        }

        // Dispatch accordion event
        document.dispatchEvent(
          new CustomEvent("accordion:toggle", {
            detail: { itemId: id, isOpen: !isOpen },
          }),
        );
      });

      // Keyboard support
      toggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle.click();
        }
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".accordion-item").forEach((item) => {
    if (item.id) initAccordionItem(item.id);
  });
});

export default AccordionItem;
