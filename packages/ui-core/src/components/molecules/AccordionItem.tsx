import React, { useState } from "react";
import { Icon, Badge } from "../atoms";

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  icon?: string;
  badge?: string | number;
  isOpen?: boolean;
  disabled?: boolean;
  onToggle?: (id: string, isOpen: boolean) => void;
  variant?: "default" | "bordered" | "filled";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  children,
  icon,
  badge,
  isOpen: controlledIsOpen,
  disabled = false,
  onToggle,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (disabled) return;

    const newIsOpen = !isOpen;

    if (controlledIsOpen === undefined) {
      setInternalIsOpen(newIsOpen);
    }

    onToggle?.(id, newIsOpen);
  };

  const getSizeClass = () => {
    const sizes = {
      sm: {
        padding: "px-4 py-3",
        text: "text-sm",
        icon: "w-4 h-4",
      },
      md: {
        padding: "px-6 py-4",
        text: "text-base",
        icon: "w-5 h-5",
      },
      lg: {
        padding: "px-8 py-6",
        text: "text-lg",
        icon: "w-6 h-6",
      },
    };
    return sizes[size];
  };

  const getVariantClass = () => {
    const variants = {
      default: {
        container: "border-b border-gray-200 dark:border-gray-700",
        header: "hover:bg-gray-50 dark:hover:bg-gray-800",
        content: "bg-white dark:bg-gray-900",
      },
      bordered: {
        container:
          "border border-gray-200 dark:border-gray-700 rounded-lg mb-2",
        header: "hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg",
        content:
          "bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700",
      },
      filled: {
        container: "bg-gray-50 dark:bg-gray-800 rounded-lg mb-2",
        header: "hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg",
        content:
          "bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700",
      },
    };
    return variants[variant];
  };

  const sizeClasses = getSizeClass();
  const variantClasses = getVariantClass();

  return (
    <div className={`${variantClasses.container} ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full ${sizeClasses.padding} ${sizeClasses.text}
          flex items-center justify-between
          text-left font-medium text-gray-900 dark:text-white
          ${!disabled && variantClasses.header}
          ${disabled ? "opacity-50 cursor-not-allowed" : "transition-colors duration-200"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800
        `}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <Icon
              name={icon}
              className={`${sizeClasses.icon} text-gray-500 dark:text-gray-400`}
            />
          )}
          <span className="flex-1">{title}</span>
          {badge && (
            <Badge variant="secondary" size="sm">
              {badge}
            </Badge>
          )}
        </div>

        <Icon
          name="chevron-down"
          className={`
            ${sizeClasses.icon} text-gray-500 dark:text-gray-400
            transform transition-transform duration-200
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      {/* Content */}
      <div
        id={`accordion-content-${id}`}
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
        `}
        aria-hidden={!isOpen}
      >
        <div className={`${sizeClasses.padding} ${variantClasses.content}`}>
          <div className="text-gray-700 dark:text-gray-300">{children}</div>
        </div>
      </div>
    </div>
  );
};
