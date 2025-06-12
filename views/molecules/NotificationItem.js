/**
 * NotificationItem Component
 * Individual notification item with avatar, content, and actions
 */

import AvatarWithName from "./AvatarWithName.js";
import Text from "../atoms/Text.js";
import Icon from "../atoms/Icon.js";
import Button from "../atoms/Button.js";

const NotificationItem = ({
  id = "",
  notification = {},
  className = "",
  onRead = "",
  onAction = "",
  onDelete = "",
  ...props
} = {}) => {
  const {
    type = "like",
    user = {},
    content = "",
    timestamp = "",
    read = false,
    actionUrl = "",
    actionText = "",
  } = notification;

  // Notification icons by type
  const notificationIcons = {
    like: { icon: "heart", color: "text-red-500" },
    comment: { icon: "chatbubble", color: "text-blue-500" },
    follow: { icon: "person-add", color: "text-green-500" },
    mention: { icon: "at", color: "text-purple-500" },
    share: { icon: "share-social", color: "text-orange-500" },
    system: { icon: "notifications", color: "text-gray-500" },
  };

  const iconConfig = notificationIcons[type] || notificationIcons.system;

  const baseClasses = [
    "notification-item",
    "flex",
    "items-start",
    "space-x-3",
    "p-4",
    "hover:bg-gray-50",
    "dark:hover:bg-gray-800",
    "transition-colors",
    "duration-200",
    "border-b",
    "border-gray-100",
    "dark:border-gray-700",
    read ? "" : "bg-blue-50 dark:bg-blue-900/20",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  // Create additional attributes string
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const itemId =
    id || `notification-${Math.random().toString(36).substr(2, 9)}`;

  const handleRead =
    onRead ||
    `
        const item = document.getElementById('${itemId}');
        if (item) {
            item.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
        }
    `;

  return `
        <div 
            ${id ? `id="${itemId}"` : ""}
            class="${baseClasses}"
            ${attrs}
        >
            <!-- Notification Icon -->
            <div class="flex-shrink-0 relative">
                ${AvatarWithName({
                  src: user.avatar,
                  name: user.name,
                  size: "md",
                })}
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    ${Icon({
                      name: iconConfig.icon,
                      type: "ion",
                      size: "xs",
                      className: iconConfig.color,
                    })}
                </div>
            </div>

            <!-- Notification Content -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <p class="text-sm text-gray-900 dark:text-gray-100">
                            <span class="font-medium">${user.name}</span>
                            ${content}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ${formatTimestamp(timestamp)}
                        </p>
                    </div>

                    <!-- Read indicator -->
                    ${
                      !read
                        ? `
                        <div class="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                    `
                        : ""
                    }
                </div>

                <!-- Action Button -->
                ${
                  actionUrl && actionText
                    ? `
                    <div class="mt-2">
                        ${Button({
                          variant: "outline",
                          size: "sm",
                          label: actionText,
                          onClick:
                            onAction || `window.location.href='${actionUrl}'`,
                        })}
                    </div>
                `
                    : ""
                }
            </div>

            <!-- Actions -->
            <div class="flex-shrink-0 flex items-center space-x-1">
                ${
                  !read
                    ? `
                    <button 
                        type="button"
                        class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                        onclick="${handleRead}"
                        title="Mark as read"
                    >
                        ${Icon({ name: "checkmark", type: "ion", size: "sm" })}
                    </button>
                `
                    : ""
                }
                
                <button 
                    type="button"
                    class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                    onclick="${onDelete || `document.getElementById('${itemId}').remove()`}"
                    title="Delete notification"
                >
                    ${Icon({ name: "close", type: "ion", size: "sm" })}
                </button>
            </div>
        </div>
    `;
};

export default NotificationItem;
