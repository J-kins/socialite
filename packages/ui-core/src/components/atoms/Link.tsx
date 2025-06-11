import React from "react";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "muted" | "danger";
  underline?: "always" | "hover" | "none";
  external?: boolean;
  children: React.ReactNode;
}

/**
 * Link component with consistent styling
 * Matches the link patterns in the existing design
 */
export const Link: React.FC<LinkProps> = ({
  variant = "primary",
  underline = "hover",
  external = false,
  children,
  className = "",
  href,
  target,
  rel,
  ...props
}) => {
  const variantClasses = {
    primary:
      "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
    secondary:
      "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
    muted:
      "text-gray-500 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400",
    danger:
      "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
  };

  const underlineClasses = {
    always: "underline",
    hover: "hover:underline",
    none: "no-underline",
  };

  const baseClasses = [
    "transition-colors",
    "duration-200",
    "cursor-pointer",
    variantClasses[variant],
    underlineClasses[underline],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Handle external links
  const linkTarget = external ? "_blank" : target;
  const linkRel = external ? "noopener noreferrer" : rel;

  return (
    <a
      href={href}
      target={linkTarget}
      rel={linkRel}
      className={baseClasses}
      {...props}
    >
      {children}
      {external && (
        <svg
          className="inline w-3 h-3 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  );
};

export default Link;
