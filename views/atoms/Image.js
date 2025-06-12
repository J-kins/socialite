/**
 * Image Component
 * Responsive image with lazy loading and fallback support
 */

const Image = ({
  id = "",
  src = "",
  alt = "",
  className = "",
  width = "",
  height = "",
  loading = "lazy",
  objectFit = "cover",
  rounded = false,
  shadow = false,
  onClick = "",
  fallbackSrc = "",
  ...props
} = {}) => {
  const baseClasses = [
    "block",
    "max-w-full",
    "h-auto",
    rounded ? "rounded-lg" : "",
    shadow ? "shadow-lg" : "",
    onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    "scale-down": "object-scale-down",
    none: "object-none",
  };

  const classes = [baseClasses, objectFitClass[objectFit] || ""].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const onErrorHandler = fallbackSrc
    ? `onerror="this.src='${fallbackSrc}'; this.onerror=null;"`
    : "";

  return `
        <img
            ${id ? `id="${id}"` : ""}
            src="${src}"
            alt="${alt}"
            class="${classes}"
            ${width ? `width="${width}"` : ""}
            ${height ? `height="${height}"` : ""}
            loading="${loading}"
            ${onClick ? `onclick="${onClick}"` : ""}
            ${onErrorHandler}
            ${attrs}
        />
    `;
};

export default Image;
