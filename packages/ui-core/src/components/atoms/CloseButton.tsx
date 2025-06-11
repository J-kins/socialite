import React from "react";
import { Icon } from "./Icon";

export interface CloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "subtle";
  position?: "static" | "absolute";
  positionOffset?: "sm" | "md" | "lg";
  onClose?: () => void;
  className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  size = "md",
  variant = "default",
  position = "static",
  positionOffset = "md",
  onClose,
  className = "",
  ...props
}) => {
  const getSizeClass = () => {
    const sizes = {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-10 h-10",
    };
    return sizes[size];
  };

  const getIconSizeClass = () => {
    const sizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };
    return sizes[size];
  };

  const getVariantClass = () => {
    const variants = {
      default: `
        text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        border border-transparent hover:border-gray-200 dark:hover:border-gray-700
      `,
      ghost: `
        text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
      `,
      subtle: `
        text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400
        hover:bg-gray-50 dark:hover:bg-gray-900
      `,
    };
    return variants[variant];
  };

  const getPositionClass = () => {
    if (position === "static") return "";

    const offsets = {
      sm: "top-1 right-1",
      md: "top-2 right-2",
      lg: "top-3 right-3",
    };

    return `absolute ${offsets[positionOffset]} z-10`;
  };

  return (
    <button
      type="button"
      onClick={onClose}
      className={`
        ${getSizeClass()}
        ${getVariantClass()}
        ${getPositionClass()}
        inline-flex items-center justify-center
        rounded-full transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        ${className}
      `}
      aria-label="Close"
      {...props}
    >
      <Icon name="close" className={getIconSizeClass()} />
    </button>
  );
};
