import React from "react";
import { Icon } from "./Icon";

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "divided" | "floating";
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  startIcon?: string;
  endIcon?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  variant = "default",
  size = "md",
  interactive = false,
  selected = false,
  disabled = false,
  startIcon,
  endIcon,
  startContent,
  endContent,
  onClick,
  className = "",
  ...props
}) => {
  const getSizeClass = () => {
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
    };
    return sizes[size];
  };

  const getVariantClass = () => {
    const variants = {
      default: "",
      bordered: "border border-gray-200 dark:border-gray-700 rounded-lg mb-2",
      divided: "border-b border-gray-200 dark:border-gray-700 last:border-b-0",
      floating:
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-2",
    };
    return variants[variant];
  };

  const getInteractiveClass = () => {
    if (!interactive && !onClick) return "";

    if (disabled) {
      return "cursor-not-allowed opacity-50";
    }

    let baseClass = "cursor-pointer transition-colors duration-200";

    if (selected) {
      baseClass +=
        " bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300";
    } else {
      baseClass += " hover:bg-gray-50 dark:hover:bg-gray-800";
    }

    if (onClick) {
      baseClass +=
        " focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
    }

    return baseClass;
  };

  const getIconSize = () => {
    const sizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };
    return sizes[size];
  };

  const content = (
    <>
      {/* Start Content */}
      {(startIcon || startContent) && (
        <div className="flex-shrink-0 mr-3">
          {startIcon ? (
            <Icon
              name={startIcon}
              className={`${getIconSize()} text-gray-400 dark:text-gray-500`}
            />
          ) : (
            startContent
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* End Content */}
      {(endIcon || endContent) && (
        <div className="flex-shrink-0 ml-3">
          {endIcon ? (
            <Icon
              name={endIcon}
              className={`${getIconSize()} text-gray-400 dark:text-gray-500`}
            />
          ) : (
            endContent
          )}
        </div>
      )}
    </>
  );

  const commonClasses = `
    ${getSizeClass()}
    ${getVariantClass()}
    ${getInteractiveClass()}
    flex items-center w-full text-left
    text-gray-900 dark:text-white
    ${className}
  `;

  if (onClick) {
    return (
      <li
        className={
          variant === "floating" || variant === "bordered" ? "" : "list-none"
        }
        {...props}
      >
        <button
          onClick={onClick}
          disabled={disabled}
          className={commonClasses}
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li
      className={`
        ${commonClasses}
        ${variant === "floating" || variant === "bordered" ? "" : "list-none"}
      `}
      role={interactive ? "button" : "listitem"}
      tabIndex={interactive && !disabled ? 0 : undefined}
      {...props}
    >
      {content}
    </li>
  );
};
