import React from "react";
import { Icon, Badge, Divider } from "../atoms";

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "primary";
  size?: "sm" | "md" | "lg";
  leftIcon?: string;
  rightIcon?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  badge?: string | number;
  isDivider?: boolean;
  isHeader?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  variant = "default",
  size = "md",
  leftIcon,
  rightIcon,
  leftContent,
  rightContent,
  badge,
  isDivider = false,
  isHeader = false,
  disabled = false,
  className = "",
  ...props
}) => {
  if (isDivider) {
    return <Divider className="my-1" />;
  }

  if (isHeader) {
    return (
      <div
        className={`px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
      >
        {children}
      </div>
    );
  }

  const getSizeClass = () => {
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };
    return sizes[size];
  };

  const getVariantClass = () => {
    if (disabled) {
      return "text-gray-400 dark:text-gray-500 cursor-not-allowed";
    }

    const variants = {
      default:
        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
      destructive:
        "text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-800 dark:hover:text-red-300",
      primary:
        "text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-800 dark:hover:text-blue-300",
    };
    return variants[variant];
  };

  const getIconSize = () => {
    const sizes = {
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };
    return sizes[size];
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        ${getSizeClass()}
        ${getVariantClass()}
        w-full flex items-center gap-3 transition-colors duration-150
        focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800
        ${className}
      `}
      {...props}
    >
      {/* Left Icon or Content */}
      {leftIcon && (
        <Icon name={leftIcon} className={`${getIconSize()} flex-shrink-0`} />
      )}
      {leftContent && <div className="flex-shrink-0">{leftContent}</div>}

      {/* Main Content */}
      <div className="flex-1 text-left">{children}</div>

      {/* Badge */}
      {badge && (
        <Badge
          variant={variant === "primary" ? "primary" : "secondary"}
          size="sm"
          className="flex-shrink-0"
        >
          {badge}
        </Badge>
      )}

      {/* Right Content */}
      {rightContent && <div className="flex-shrink-0">{rightContent}</div>}

      {/* Right Icon */}
      {rightIcon && (
        <Icon name={rightIcon} className={`${getIconSize()} flex-shrink-0`} />
      )}
    </button>
  );
};
