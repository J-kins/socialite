import React, { useState } from "react";
import { Avatar, Badge, Icon, Input } from "../atoms";
import { SearchBox, AvatarWithName } from "../molecules";

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isTyping?: boolean;
}

export interface ChatSidebarProps {
  contacts?: ChatContact[];
  activeContactId?: string;
  onContactClick?: (contactId: string) => void;
  onSearchContacts?: (query: string) => void;
  onNewChat?: () => void;
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts = [],
  activeContactId,
  onContactClick,
  onSearchContacts,
  onNewChat,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearchContacts?.(query);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const time = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24) {
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return time.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <aside
      className={`
      w-80 bg-white dark:bg-gray-900 
      border-l border-gray-200 dark:border-gray-700
      h-full flex flex-col
      ${className}
    `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Messages
          </h2>
          <button
            onClick={onNewChat}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="New message"
          >
            <Icon name="create" className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <SearchBox
          placeholder="Search messages..."
          onSearch={handleSearch}
          className="w-full"
        />
      </div>

      {/* Online Friends Quick Access */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {contacts
            .filter((c) => c.isOnline)
            .slice(0, 6)
            .map((contact) => (
              <button
                key={contact.id}
                onClick={() => onContactClick?.(contact.id)}
                className="flex-shrink-0 flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Avatar
                  src={contact.avatar}
                  alt={contact.name}
                  size="sm"
                  isOnline={contact.isOnline}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[60px] truncate">
                  {contact.name.split(" ")[0]}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Icon
              name="chatbubble-outline"
              className="w-12 h-12 mx-auto mb-3 opacity-50"
            />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onContactClick?.(contact.id)}
                className={`
                  w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                  ${activeContactId === contact.id ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600" : ""}
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar
                      src={contact.avatar}
                      alt={contact.name}
                      size="md"
                      isOnline={contact.isOnline}
                    />
                    {contact.unreadCount && contact.unreadCount > 0 && (
                      <Badge
                        variant="primary"
                        size="sm"
                        className="absolute -top-1 -right-1"
                      >
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`
                        text-sm font-medium truncate
                        ${contact.unreadCount ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}
                      `}
                      >
                        {contact.name}
                      </h3>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatTime(contact.lastMessageTime)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {contact.isTyping ? (
                        <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                          <div className="flex space-x-1">
                            <div
                              className="w-1 h-1 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-1 h-1 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-1 h-1 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                          <span className="text-xs italic">typing...</span>
                        </div>
                      ) : contact.lastMessage ? (
                        <p
                          className={`
                          text-sm truncate flex-1
                          ${contact.unreadCount ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}
                        `}
                        >
                          {contact.lastMessage}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                          No messages yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
