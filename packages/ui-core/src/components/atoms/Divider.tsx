import React from "react";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  thickness?: "thin" | "medium" | "thick";
  color?: "default" | "light" | "dark" | "primary" | "secondary";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  variant = "solid",
  thickness = "thin",
  color = "default",
  spacing = "md",
  children,
  className = "",
}) => {
  const getThicknessClass = () => {
    if (orientation === "horizontal") {
      const thicknesses = {
        thin: "border-t",
        medium: "border-t-2",
        thick: "border-t-4",
      };
      return thicknesses[thickness];
    } else {
      const thicknesses = {
        thin: "border-l",
        medium: "border-l-2",
        thick: "border-l-4",
      };
      return thicknesses[thickness];
    }
  };

  const getVariantClass = () => {
    const variants = {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted",
    };
    return variants[variant];
  };

  const getColorClass = () => {
    const colors = {
      default: "border-gray-200 dark:border-gray-700",
      light: "border-gray-100 dark:border-gray-800",
      dark: "border-gray-300 dark:border-gray-600",
      primary: "border-blue-200 dark:border-blue-800",
      secondary: "border-purple-200 dark:border-purple-800",
    };
    return colors[color];
  };

  const getSpacingClass = () => {
    if (orientation === "horizontal") {
      const spacings = {
        none: "",
        sm: "my-2",
        md: "my-4",
        lg: "my-6",
        xl: "my-8",
      };
      return spacings[spacing];
    } else {
      const spacings = {
        none: "",
        sm: "mx-2",
        md: "mx-4",
        lg: "mx-6",
        xl: "mx-8",
      };
      return spacings[spacing];
    }
  };

  const getSizeClass = () => {
    if (orientation === "horizontal") {
      return "w-full";
    } else {
      return "h-full";
    }
  };

  // Text divider (with children)
  if (children) {
    return (
      <div
        className={`relative flex items-center ${getSpacingClass()} ${className}`}
      >
        <div
          className={`flex-grow ${getThicknessClass()} ${getVariantClass()} ${getColorClass()}`}
        />
        <div className="flex-shrink-0 px-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
            {children}
          </span>
        </div>
        <div
          className={`flex-grow ${getThicknessClass()} ${getVariantClass()} ${getColorClass()}`}
        />
      </div>
    );
  }

  // Simple divider
  return (
    <div
      className={`
        ${getSizeClass()}
        ${getThicknessClass()}
        ${getVariantClass()}
        ${getColorClass()}
        ${getSpacingClass()}
        ${className}
      `}
      role="separator"
      aria-orientation={orientation}
    />
  );
};
