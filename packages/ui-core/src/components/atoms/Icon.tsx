import React from "react";

export interface IconProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  color?: string;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

/**
 * Icon component for ionicons used throughout Socialite
 * Matches the existing ion-icon usage in the design
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  color,
  className = "",
  onClick,
  "aria-label": ariaLabel,
  ...props
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const sizeClass = typeof size === "number" ? "" : sizeClasses[size];
  const sizeStyle = typeof size === "number" ? { fontSize: `${size}px` } : {};

  const baseClasses = [
    "inline-block",
    "flex-shrink-0",
    onClick ? "cursor-pointer" : "",
    sizeClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ion-icon
      name={name}
      className={baseClasses}
      style={{
        color,
        ...sizeStyle,
      }}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    />
  );
};

export default Icon;
