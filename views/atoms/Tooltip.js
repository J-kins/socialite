/**
 * Tooltip Component
 * Hover tooltip using UIKit framework
 */

const Tooltip = ({
  id = "",
  text = "",
  content = "",
  position = "top",
  trigger = "hover",
  className = "",
  ...props
} = {}) => {
  const baseClasses = ["inline-block", "cursor-help", className]
    .filter(Boolean)
    .join(" ");

  // UIKit tooltip positions
  const positions = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
    "top-left": "top-left",
    "top-right": "top-right",
    "bottom-left": "bottom-left",
    "bottom-right": "bottom-right",
  };

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <span
            ${id ? `id="${id}"` : ""}
            class="${baseClasses}"
            uk-tooltip="title: ${text}; pos: ${positions[position] || "top"}; trigger: ${trigger}"
            ${attrs}
        >
            ${content}
        </span>
    `;
};

export default Tooltip;
