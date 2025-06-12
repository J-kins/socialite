import React, { useState } from "react";
import { MainLayout } from "./MainLayout";
import { MessageThread, ChatSidebar } from "../organisms";
import { Button, Icon, Input } from "../atoms";
import type { MainLayoutProps } from "./MainLayout";
import type { MessageThreadProps, ChatSidebarProps } from "../organisms";

export interface MessagesPageProps extends Omit<MainLayoutProps, "children"> {
  conversations: ChatSidebarProps["contacts"];
  activeConversationId?: string;
  messages: MessageThreadProps["messages"];
  participants: MessageThreadProps["participants"];
  currentUserId: string;
  onConversationSelect?: (conversationId: string) => void;
  onSendMessage?: MessageThreadProps["onSendMessage"];
  onMessageInteraction?: {
    onReactToMessage?: MessageThreadProps["onReactToMessage"];
    onDeleteMessage?: MessageThreadProps["onDeleteMessage"];
    onEditMessage?: MessageThreadProps["onEditMessage"];
  };
  onNewConversation?: () => void;
  onSearchConversations?: (query: string) => void;
  onFileUpload?: (file: File) => void;
  onVoiceMessage?: (audioBlob: Blob) => void;
  isLoading?: boolean;
  className?: string;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  conversations = [],
  activeConversationId,
  messages = [],
  participants = [],
  currentUserId,
  onConversationSelect,
  onSendMessage,
  onMessageInteraction = {},
  onNewConversation,
  onSearchConversations,
  onFileUpload,
  onVoiceMessage,
  isLoading = false,
  className = "",
  ...layoutProps
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );
  const isGroup = participants.length > 2;

  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-sm mx-auto p-8">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon
            name="chatbubble"
            className="w-10 h-10 text-blue-600 dark:text-blue-400"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your messages
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Send private photos and messages to a friend or group.
        </p>
        <Button variant="primary" onClick={onNewConversation}>
          <Icon name="create" className="w-4 h-4 mr-2" />
          Send message
        </Button>
      </div>
    </div>
  );

  const ConversationsList = () => (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Messages
          </h2>
          <Button variant="ghost" onClick={onNewConversation} className="!p-2">
            <Icon name="create" className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchConversations?.(e.target.value);
            }}
            className="pl-10 bg-gray-100 dark:bg-gray-800 border-none"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <Icon
              name="chatbubble-outline"
              className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onConversationSelect?.(conversation.id)}
                className={`
                  w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                  ${
                    activeConversationId === conversation.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600"
                      : ""
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                    {conversation.unreadCount &&
                      conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {conversation.unreadCount > 9
                            ? "9+"
                            : conversation.unreadCount}
                        </div>
                      )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`
                        text-sm font-medium truncate
                        ${
                          conversation.unreadCount
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      `}
                      >
                        {conversation.name}
                      </h3>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {new Date(
                            conversation.lastMessageTime,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {conversation.isTyping ? (
                        <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
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
                      ) : conversation.lastMessage ? (
                        <p
                          className={`
                          text-sm truncate flex-1
                          ${
                            conversation.unreadCount
                              ? "text-gray-900 dark:text-white font-medium"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        `}
                        >
                          {conversation.lastMessage}
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
    </div>
  );

  return (
    <MainLayout {...layoutProps} showChatSidebar={false} className={className}>
      <div className="h-[calc(100vh-4rem)] flex bg-white dark:bg-gray-900">
        {/* Conversations Sidebar */}
        <ConversationsList />

        {/* Message Thread or Empty State */}
        {activeConversationId && activeConversation ? (
          <div className="flex-1 flex flex-col">
            <MessageThread
              threadId={activeConversationId}
              participants={participants}
              messages={messages}
              currentUserId={currentUserId}
              onSendMessage={onSendMessage}
              onReactToMessage={onMessageInteraction.onReactToMessage}
              onDeleteMessage={onMessageInteraction.onDeleteMessage}
              onEditMessage={onMessageInteraction.onEditMessage}
              onFileUpload={onFileUpload}
              onVoiceMessage={onVoiceMessage}
              isGroup={isGroup}
            />
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <Icon
                  name="refresh"
                  className="w-6 h-6 text-blue-600 animate-spin"
                />
                <span className="text-gray-900 dark:text-white">
                  Loading messages...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Message
              </h3>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To:
                </label>
                <Input placeholder="Search people..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message:
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={4}
                  placeholder="Write a message..."
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowNewMessageModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
