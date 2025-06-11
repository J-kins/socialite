import React, { useState } from "react";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "danger";
  label?: string;
  description?: string;
  className?: string;
}

/**
 * Switch component for toggle controls
 * Modern toggle switch with smooth animations
 */
export const Switch: React.FC<SwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  color = "primary",
  label,
  description,
  className = "",
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleChange = () => {
    if (disabled) return;

    const newChecked = !checked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    if (onChange) {
      onChange(newChecked);
    }
  };

  const sizeClasses = {
    sm: {
      track: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      track: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      track: "w-14 h-7",
      thumb: "w-6 h-6",
      translate: "translate-x-7",
    },
  };

  const colorClasses = {
    primary: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  };

  const trackClasses = [
    "relative",
    "inline-flex",
    "items-center",
    "rounded-full",
    "transition-colors",
    "duration-200",
    "ease-in-out",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "focus:ring-blue-500",
    sizeClasses[size].track,
    checked ? colorClasses[color] : "bg-gray-200 dark:bg-gray-700",
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
  ].join(" ");

  const thumbClasses = [
    "absolute",
    "left-0",
    "inline-block",
    "bg-white",
    "rounded-full",
    "shadow",
    "transform",
    "transition-transform",
    "duration-200",
    "ease-in-out",
    sizeClasses[size].thumb,
    checked ? sizeClasses[size].translate : "translate-x-0",
  ].join(" ");

  const switchElement = (
    <button
      type="button"
      className={trackClasses}
      onClick={handleChange}
      disabled={disabled}
      aria-checked={checked}
      role="switch"
      aria-label={label}
    >
      <span className={thumbClasses} />
    </button>
  );

  if (label || description) {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="flex flex-col">{switchElement}</div>
        <div className="flex-1 min-w-0">
          {label && (
            <label
              className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
              onClick={handleChange}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <div className={className}>{switchElement}</div>;
};

export default Switch;
