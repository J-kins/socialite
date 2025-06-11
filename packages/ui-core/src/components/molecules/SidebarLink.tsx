import React from "react";
import { Icon } from "../atoms/Icon";
import { Badge } from "../atoms/Badge";

export interface SidebarLinkProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  badge?: number | string;
  onClick?: () => void;
  className?: string;
}

/**
 * SidebarLink molecule - Navigation link for sidebar
 * Matches the sidebar link styling from the existing design
 */
export const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  label,
  active = false,
  badge,
  onClick,
  className = "",
}) => {
  const baseClasses = [
    "flex",
    "items-center",
    "gap-3",
    "px-4",
    "py-3",
    "rounded-lg",
    "transition-colors",
    "duration-200",
    "hover:bg-gray-100",
    "dark:hover:bg-gray-700",
    active
      ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
      : "text-gray-700 dark:text-gray-300",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a href={href} className={baseClasses} onClick={handleClick} data-nav-link>
      <Icon
        name={icon}
        size="lg"
        className={
          active ? "text-blue-600" : "text-gray-500 dark:text-gray-400"
        }
      />

      <span className="flex-1 font-medium">{label}</span>

      {badge && (
        <Badge variant={active ? "primary" : "secondary"} size="sm">
          {badge}
        </Badge>
      )}
    </a>
  );
};

export default SidebarLink;
