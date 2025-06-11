import React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  variant?: "default" | "required" | "optional" | "disabled";
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
  error?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  variant = "default",
  size = "md",
  weight = "medium",
  error = false,
  className = "",
  ...props
}) => {
  const getSizeClass = () => {
    const sizes = {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
    };
    return sizes[size];
  };

  const getWeightClass = () => {
    const weights = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    return weights[weight];
  };

  const getVariantClass = () => {
    if (error) {
      return "text-red-700 dark:text-red-400";
    }

    const variants = {
      default: "text-gray-700 dark:text-gray-300",
      required: "text-gray-700 dark:text-gray-300",
      optional: "text-gray-500 dark:text-gray-400",
      disabled: "text-gray-400 dark:text-gray-500",
    };
    return variants[variant];
  };

  const renderLabel = () => {
    if (variant === "required") {
      return (
        <>
          {children}
          <span className="text-red-500 ml-1" aria-label="Required">
            *
          </span>
        </>
      );
    }

    if (variant === "optional") {
      return (
        <>
          {children}
          <span className="text-gray-400 dark:text-gray-500 ml-1 font-normal">
            (optional)
          </span>
        </>
      );
    }

    return children;
  };

  return (
    <label
      className={`
        block mb-2 select-none cursor-pointer
        ${getSizeClass()}
        ${getWeightClass()}
        ${getVariantClass()}
        ${variant === "disabled" ? "cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {renderLabel()}
    </label>
  );
};
