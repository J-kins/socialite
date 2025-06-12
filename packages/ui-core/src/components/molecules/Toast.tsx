import React, { useEffect, useState } from "react";
import { Icon, Button, CloseButton } from "../atoms";

export interface ToastProps {
  id?: string;
  title?: string;
  message: string;
  variant?: "success" | "error" | "warning" | "info" | "default";
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  showIcon?: boolean;
  showCloseButton?: boolean;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: (id?: string) => void;
  onMount?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  variant = "default",
  duration = 5000,
  position = "top-right",
  showIcon = true,
  showCloseButton = true,
  persistent = false,
  action,
  onClose,
  onMount,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Mount animation
    setIsVisible(true);
    onMount?.();

    // Auto dismiss
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent, onMount]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Match animation duration
  };

  const getVariantClass = () => {
    const variants = {
      success: {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800",
        icon: "text-green-600 dark:text-green-400",
        text: "text-green-800 dark:text-green-200",
        iconName: "checkmark-circle",
      },
      error: {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        icon: "text-red-600 dark:text-red-400",
        text: "text-red-800 dark:text-red-200",
        iconName: "alert-circle",
      },
      warning: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        icon: "text-yellow-600 dark:text-yellow-400",
        text: "text-yellow-800 dark:text-yellow-200",
        iconName: "warning",
      },
      info: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        icon: "text-blue-600 dark:text-blue-400",
        text: "text-blue-800 dark:text-blue-200",
        iconName: "information-circle",
      },
      default: {
        bg: "bg-white dark:bg-gray-800",
        border: "border-gray-200 dark:border-gray-700",
        icon: "text-gray-600 dark:text-gray-400",
        text: "text-gray-800 dark:text-gray-200",
        iconName: "notifications",
      },
    };
    return variants[variant];
  };

  const getPositionClass = () => {
    const positions = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    };
    return positions[position];
  };

  const getAnimationClass = () => {
    const slideDirection = position.includes("left")
      ? "translate-x-full"
      : position.includes("right")
        ? "-translate-x-full"
        : position.includes("top")
          ? "-translate-y-full"
          : "translate-y-full";

    if (isLeaving) {
      return `transition-all duration-300 ease-in-out transform ${slideDirection} opacity-0 scale-95`;
    }

    return `transition-all duration-300 ease-out transform ${
      isVisible
        ? "translate-x-0 translate-y-0 opacity-100 scale-100"
        : `${slideDirection} opacity-0 scale-95`
    }`;
  };

  const variantClasses = getVariantClass();

  return (
    <div
      className={`
        fixed z-[9999] w-full max-w-sm pointer-events-auto
        ${getPositionClass()}
        ${getAnimationClass()}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`
        ${variantClasses.bg} ${variantClasses.border} 
        border rounded-lg shadow-lg p-4
        backdrop-blur-sm
      `}
      >
        <div className="flex items-start space-x-3">
          {/* Icon */}
          {showIcon && (
            <div className="flex-shrink-0 pt-0.5">
              <Icon
                name={variantClasses.iconName}
                className={`w-5 h-5 ${variantClasses.icon}`}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h3
                className={`text-sm font-semibold ${variantClasses.text} mb-1`}
              >
                {title}
              </h3>
            )}
            <p
              className={`text-sm ${variantClasses.text} ${title ? "" : "font-medium"}`}
            >
              {message}
            </p>

            {/* Action Button */}
            {action && (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={action.onClick}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>

          {/* Close Button */}
          {showCloseButton && (
            <div className="flex-shrink-0">
              <CloseButton size="sm" variant="subtle" onClose={handleClose} />
            </div>
          )}
        </div>

        {/* Progress Bar for Auto-dismiss */}
        {!persistent && duration > 0 && (
          <div className="mt-3 -mb-1 -mx-4">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
              <div
                className={`h-full ${variantClasses.icon.replace("text-", "bg-")} transition-all ease-linear`}
                style={{
                  animation: `toast-progress ${duration}ms linear`,
                  transformOrigin: "left center",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add CSS for progress animation
const style = `
  @keyframes toast-progress {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
`;

// Inject styles if not already present
if (
  typeof document !== "undefined" &&
  !document.getElementById("toast-styles")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "toast-styles";
  styleSheet.textContent = style;
  document.head.appendChild(styleSheet);
}
