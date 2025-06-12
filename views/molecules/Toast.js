/**
 * Toast Component
 * Notification toast with auto-dismiss and actions
 */

import Icon from "../atoms/Icon.js";
import Button from "../atoms/Button.js";
import CloseButton from "../atoms/CloseButton.js";

const Toast = ({
  id = "",
  message = "",
  type = "info", // 'success', 'warning', 'error', 'info'
  duration = 5000,
  position = "top-right", // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
  closable = true,
  actionText = "",
  onAction = "",
  onClose = "",
  className = "",
  ...props
} = {}) => {
  const toastId = id || `toast-${Math.random().toString(36).substr(2, 9)}`;

  // Type configurations
  const typeConfigs = {
    success: {
      icon: "checkmark-circle",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-800 dark:text-green-200",
      iconColor: "text-green-500",
    },
    warning: {
      icon: "warning",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      textColor: "text-yellow-800 dark:text-yellow-200",
      iconColor: "text-yellow-500",
    },
    error: {
      icon: "close-circle",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      textColor: "text-red-800 dark:text-red-200",
      iconColor: "text-red-500",
    },
    info: {
      icon: "information-circle",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-800 dark:text-blue-200",
      iconColor: "text-blue-500",
    },
  };

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  const config = typeConfigs[type] || typeConfigs.info;

  const baseClasses = [
    "toast",
    "fixed",
    "z-50",
    "max-w-sm",
    "w-full",
    "pointer-events-auto",
    "border",
    "rounded-lg",
    "shadow-lg",
    "transition-all",
    "duration-300",
    "ease-in-out",
    config.bgColor,
    config.borderColor,
    positionClasses[position] || positionClasses["top-right"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Auto-dismiss functionality
  const autoDismiss =
    duration > 0
      ? `
        setTimeout(() => {
            dismissToast('${toastId}');
        }, ${duration});
    `
      : "";

  // Close handler
  const closeHandler =
    onClose ||
    `
        console.log('Toast closed: ${toastId}');
    `;

  return `
        <div 
            ${id ? `id="${toastId}"` : ""}
            class="${baseClasses}"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            ${attrs}
        >
            <div class="p-4">
                <div class="flex items-start">
                    <!-- Icon -->
                    <div class="flex-shrink-0">
                        ${Icon({
                          name: config.icon,
                          type: "ion",
                          size: "md",
                          className: config.iconColor,
                        })}
                    </div>

                    <!-- Content -->
                    <div class="ml-3 flex-1">
                        <p class="${config.textColor} text-sm font-medium">
                            ${message}
                        </p>

                        <!-- Action Button -->
                        ${
                          actionText
                            ? `
                            <div class="mt-2">
                                ${Button({
                                  variant: "ghost",
                                  size: "sm",
                                  label: actionText,
                                  onClick: onAction || "",
                                  className:
                                    config.textColor +
                                    " hover:" +
                                    config.bgColor,
                                })}
                            </div>
                        `
                            : ""
                        }
                    </div>

                    <!-- Close Button -->
                    ${
                      closable
                        ? `
                        <div class="ml-4 flex-shrink-0">
                            ${CloseButton({
                              size: "sm",
                              variant: "ghost",
                              className: config.iconColor,
                              onClick: `dismissToast('${toastId}')`,
                            })}
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>

            <!-- Progress Bar (for auto-dismiss) -->
            ${
              duration > 0
                ? `
                <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
                    <div id="${toastId}-progress" class="h-full ${config.iconColor.replace("text-", "bg-")} transition-all ease-linear" style="width: 100%; animation: toast-progress ${duration}ms linear;"></div>
                </div>
            `
                : ""
            }
        </div>

        <script>
        // Toast functionality
        function dismissToast(toastId) {
            const toast = document.getElementById(toastId);
            if (toast) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-20px) scale(0.95)';
                
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                    (${closeHandler})();
                }, 300);
            }
        }

        // Auto-dismiss
        ${autoDismiss}

        // CSS animation for progress bar
        if (!document.getElementById('toast-progress-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-progress-styles';
            style.textContent = \`
                @keyframes toast-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                
                .toast {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                
                .toast-enter {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                
                .toast-enter-active {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    transition: all 300ms ease-in-out;
                }
            \`;
            document.head.appendChild(style);
        }
        </script>
    `;
};

// Toast Manager for creating toasts programmatically
Toast.show = function (message, options = {}) {
  const toastContainer = getOrCreateToastContainer(
    options.position || "top-right",
  );
  const toast = Toast({
    message,
    ...options,
  });

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = toast;
  const toastElement = tempDiv.firstElementChild;

  // Add enter animation
  toastElement.classList.add("toast-enter");
  toastContainer.appendChild(toastElement);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toastElement.classList.remove("toast-enter");
    toastElement.classList.add("toast-enter-active");

    setTimeout(() => {
      toastElement.classList.remove("toast-enter-active");
    }, 300);
  });

  return toastElement.id;
};

// Convenience methods
Toast.success = (message, options = {}) =>
  Toast.show(message, { ...options, type: "success" });
Toast.warning = (message, options = {}) =>
  Toast.show(message, { ...options, type: "warning" });
Toast.error = (message, options = {}) =>
  Toast.show(message, { ...options, type: "error" });
Toast.info = (message, options = {}) =>
  Toast.show(message, { ...options, type: "info" });

function getOrCreateToastContainer(position) {
  const containerId = `toast-container-${position}`;
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = "toast-container fixed z-50 pointer-events-none";
    document.body.appendChild(container);
  }

  return container;
}

export default Toast;
