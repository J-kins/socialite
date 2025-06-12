/**
 * Icon Component
 * Displays icons using ion-icons, SVG, or custom icon fonts
 */

const Icon = ({
  id = "",
  name = "",
  type = "ion", // 'ion', 'svg', 'custom'
  size = "md",
  className = "",
  color = "",
  onClick = "",
  customSvg = "",
  ...props
} = {}) => {
  // Size variants
  const sizeClasses = {
    xs: "w-3 h-3 text-xs",
    sm: "w-4 h-4 text-sm",
    md: "w-5 h-5 text-base",
    lg: "w-6 h-6 text-lg",
    xl: "w-8 h-8 text-xl",
    "2xl": "w-10 h-10 text-2xl",
  };

  const baseClasses = [
    "inline-block",
    "flex-shrink-0",
    onClick ? "cursor-pointer hover:opacity-75 transition-opacity" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [baseClasses, sizeClasses[size]].join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const commonProps = `
        ${id ? `id="${id}"` : ""}
        class="${classes}"
        ${color ? `style="color: ${color};"` : ""}
        ${onClick ? `onclick="${onClick}"` : ""}
        ${attrs}
    `;

  switch (type) {
    case "ion":
      return `<ion-icon name="${name}" ${commonProps}></ion-icon>`;

    case "svg":
      if (customSvg) {
        return `<div ${commonProps}>${customSvg}</div>`;
      }
      // Common SVG icons
      const svgIcons = {
        heart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`,
        chat: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>`,
        share: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`,
        search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
      };
      return `<div ${commonProps}>${svgIcons[name] || ""}</div>`;

    case "custom":
    default:
      return `<i class="${name} ${classes}" ${commonProps}></i>`;
  }
};

export default Icon;
