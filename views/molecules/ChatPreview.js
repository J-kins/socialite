/**
 * ChatPreview Component
 * Chat conversation preview with avatar, name, message and unread count
 */

import Avatar from "../atoms/Avatar.js";
import Text from "../atoms/Text.js";
import Badge from "../atoms/Badge.js";

const ChatPreview = ({
  id,
  src,
  name,
  message,
  unreadCount,
  className = "",
}) => `
  <div class="chat-preview ${className}" id="${id}">
    ${Avatar({ id: `${id}-avatar`, src, className: "w-10 h-10" })}
    <div class="chat-preview-content flex-1">
      ${Text({ id: `${id}-name`, content: name || "User", className: "font-bold" })}
      ${Text({ id: `${id}-message`, content: message || "Message...", className: "text-sm text-gray-600 truncate" })}
    </div>
    ${unreadCount ? Badge({ id: `${id}-badge`, text: unreadCount, className: "ml-2 bg-red-500 text-white" }) : ""}
  </div>
`;

export default ChatPreview;
