import React from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  name?: string;
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Avatar component that matches the existing Socialite design
 * Supports online indicators and fallback initials
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  name,
  isOnline,
  className = "",
  onClick,
}) => {
  // Size variants matching existing design
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  const onlineIndicatorSizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  };

  const baseClasses = [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "bg-gray-100",
    "dark:bg-gray-700",
    "overflow-hidden",
    "flex-shrink-0",
    onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [baseClasses, sizeClasses[size]].join(" ");

  // Generate initials from name
  const getInitials = (name?: string): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={classes} onClick={handleClick}>
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image on error and show initials
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {getInitials(name)}
        </span>
      )}

      {/* Online indicator */}
      {isOnline && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${onlineIndicatorSizes[size]} bg-green-500 border-2 border-white dark:border-gray-800 rounded-full`}
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default Avatar;
