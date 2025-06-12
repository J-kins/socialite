/**
 * SliderNav Component
 * Navigation controls for carousels with prev/next buttons
 */

import Button from "../atoms/Button.js";
import Icon from "../atoms/Icon.js";

const SliderNav = ({ id, className = "" }) => `
  <div class="slider-nav ${className}" id="${id}">
    ${Button({
      id: `${id}-prev`,
      label: "",
      className:
        "p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow",
      content: Icon({ name: "chevron-left", className: "w-4 h-4" }),
    })}
    ${Button({
      id: `${id}-next`,
      label: "",
      className:
        "p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow",
      content: Icon({ name: "chevron-right", className: "w-4 h-4" }),
    })}
  </div>
`;

// Initialize slider navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const initSliderNav = (id) => {
    const prevBtn = document.querySelector(`#${id}-prev`);
    const nextBtn = document.querySelector(`#${id}-next`);

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Previous slide");
        // Dispatch custom event for parent sliders to handle
        document.dispatchEvent(
          new CustomEvent("slider:prev", { detail: { sliderId: id } }),
        );
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Next slide");
        // Dispatch custom event for parent sliders to handle
        document.dispatchEvent(
          new CustomEvent("slider:next", { detail: { sliderId: id } }),
        );
      });
    }
  };

  // Auto-initialize
  document.querySelectorAll(".slider-nav").forEach((nav) => {
    if (nav.id) initSliderNav(nav.id);
  });
});

export default SliderNav;
