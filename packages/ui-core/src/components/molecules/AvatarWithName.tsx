import React from "react";
import { Avatar, type AvatarProps } from "../atoms/Avatar";

export interface AvatarWithNameProps extends Omit<AvatarProps, "name"> {
  name: string;
  subtitle?: string;
  nameSize?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  truncate?: boolean;
  onClick?: () => void;
}

/**
 * AvatarWithName molecule - combines Avatar with name/subtitle text
 * Common pattern in the existing Socialite design for user representations
 */
export const AvatarWithName: React.FC<AvatarWithNameProps> = ({
  name,
  subtitle,
  nameSize = "md",
  layout = "horizontal",
  truncate = true,
  onClick,
  className = "",
  ...avatarProps
}) => {
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const layoutClasses = {
    horizontal: "flex items-center gap-3",
    vertical: "flex flex-col items-center gap-2 text-center",
  };

  const containerClasses = [
    layoutClasses[layout],
    onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={containerClasses} onClick={handleClick}>
      <Avatar
        name={name}
        onClick={onClick ? undefined : avatarProps.onClick} // Avoid double handling
        {...avatarProps}
      />

      <div className={layout === "vertical" ? "text-center" : "flex-1 min-w-0"}>
        <div
          className={`font-medium text-gray-900 dark:text-gray-100 ${textSizeClasses[nameSize]} ${
            truncate ? "truncate" : ""
          }`}
          title={truncate ? name : undefined}
        >
          {name}
        </div>

        {subtitle && (
          <div
            className={`text-gray-600 dark:text-gray-400 ${
              nameSize === "lg" ? "text-sm" : "text-xs"
            } ${truncate ? "truncate" : ""}`}
            title={truncate ? subtitle : undefined}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarWithName;
