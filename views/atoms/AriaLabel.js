/**
 * AriaLabel Component
 * Screen reader accessible label component
 */

const AriaLabel = ({ id = "", text = "", className = "", ...props } = {}) => {
  const baseClasses = ["aria-label", "sr-only", className]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
        <span
            ${id ? `id="${id}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            ${text}
        </span>
    `;
};

export default AriaLabel;
