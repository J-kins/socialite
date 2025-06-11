import React, { useState, useRef, useEffect } from "react";
import { Avatar, Button, Icon, Input } from "../atoms";
import { AvatarWithName } from "../molecules";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file" | "audio" | "video";
  media?: {
    url: string;
    filename?: string;
    size?: number;
    duration?: number; // for audio/video
  };
  isRead?: boolean;
  reactions?: Array<{
    emoji: string;
    count: number;
    userIds: string[];
  }>;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  isTyping?: boolean;
}

export interface MessageThreadProps {
  threadId: string;
  participants: Participant[];
  messages: Message[];
  currentUserId: string;
  onSendMessage?: (
    content: string,
    type?: Message["type"],
    replyTo?: string,
  ) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onUserClick?: (userId: string) => void;
  onFileUpload?: (file: File) => void;
  onVoiceMessage?: (audioBlob: Blob) => void;
  isGroup?: boolean;
  className?: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  threadId,
  participants,
  messages,
  currentUserId,
  onSendMessage,
  onReactToMessage,
  onDeleteMessage,
  onEditMessage,
  onUserClick,
  onFileUpload,
  onVoiceMessage,
  isGroup = false,
  className = "",
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage?.(newMessage.trim(), "text", replyingTo?.id);
      setNewMessage("");
      setReplyingTo(null);
    }
  };

  const handleEdit = (messageId: string) => {
    if (editContent.trim()) {
      onEditMessage?.(messageId, editContent.trim());
      setEditingMessage(null);
      setEditContent("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload?.(file);
    }
  };

  const getParticipant = (userId: string) => {
    return participants.find((p) => p.id === userId);
  };

  const groupMessagesByDate = () => {
    const grouped: { [date: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = formatDate(message.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });

    return Object.entries(grouped);
  };

  const shouldShowAvatar = (message: Message, index: number) => {
    if (!isGroup) return false;
    const nextMessage = messages[index + 1];
    return !nextMessage || nextMessage.senderId !== message.senderId;
  };

  const MessageBubble: React.FC<{ message: Message; showAvatar: boolean }> = ({
    message,
    showAvatar,
  }) => {
    const isOwnMessage = message.senderId === currentUserId;
    const sender = getParticipant(message.senderId);

    return (
      <div
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`}
        >
          {showAvatar && !isOwnMessage && (
            <button onClick={() => onUserClick?.(message.senderId)}>
              <Avatar src={sender?.avatar} alt={sender?.name} size="sm" />
            </button>
          )}

          <div
            className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
          >
            {isGroup && !isOwnMessage && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-2">
                {sender?.name}
              </span>
            )}

            {/* Reply Preview */}
            {message.replyTo && (
              <div
                className={`
                text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mb-1 border-l-2
                ${isOwnMessage ? "border-blue-500" : "border-gray-400"}
              `}
              >
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {message.replyTo.senderName}
                </div>
                <div className="text-gray-500 dark:text-gray-400 truncate">
                  {message.replyTo.content}
                </div>
              </div>
            )}

            <div
              className={`
                relative px-4 py-2 rounded-2xl
                ${
                  isOwnMessage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                }
              `}
            >
              {editingMessage === message.id ? (
                <div className="space-y-2">
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyPress={(e) =>
                      handleKeyPress(e, () => handleEdit(message.id))
                    }
                    className="min-w-32"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleEdit(message.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingMessage(null);
                        setEditContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {message.type === "text" && (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}

                  {message.type === "image" && message.media && (
                    <div>
                      <img
                        src={message.media.url}
                        alt="Shared image"
                        className="max-w-full h-auto rounded-lg"
                      />
                      {message.content && (
                        <p className="mt-2 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                    </div>
                  )}

                  {message.type === "file" && message.media && (
                    <div className="flex items-center space-x-3 p-2 bg-white/10 rounded-lg">
                      <Icon name="document" className="w-8 h-8" />
                      <div>
                        <div className="font-medium">
                          {message.media.filename}
                        </div>
                        {message.media.size && (
                          <div className="text-sm opacity-75">
                            {(message.media.size / 1024 / 1024).toFixed(1)} MB
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Message Actions */}
              <div className="absolute top-0 right-0 -mr-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setReplyingTo(message)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Icon name="return-up-back" className="w-4 h-4" />
                  </button>

                  {message.senderId === currentUserId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingMessage(message.id);
                          setEditContent(message.content);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Icon name="create" className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteMessage?.(message.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex space-x-1 mt-1">
                {message.reactions.map((reaction, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      onReactToMessage?.(message.id, reaction.emoji)
                    }
                    className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}

            <span
              className={`text-xs mt-1 ${isOwnMessage ? "text-blue-200" : "text-gray-500 dark:text-gray-400"}`}
            >
              {formatTime(message.timestamp)}
              {isOwnMessage && message.isRead && (
                <Icon name="checkmark-done" className="w-3 h-3 ml-1 inline" />
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const typingUsers = participants.filter(
    (p) => p.isTyping && p.id !== currentUserId,
  );

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {isGroup ? (
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participant) => (
                <Avatar
                  key={participant.id}
                  src={participant.avatar}
                  alt={participant.name}
                  size="sm"
                  className="ring-2 ring-white dark:ring-gray-900"
                />
              ))}
            </div>
          ) : (
            <button onClick={() => onUserClick?.(participants[0]?.id)}>
              <Avatar
                src={participants[0]?.avatar}
                alt={participants[0]?.name}
                size="md"
                isOnline={participants[0]?.isOnline}
              />
            </button>
          )}

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {isGroup
                ? `Group (${participants.length})`
                : participants[0]?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {typingUsers.length > 0
                ? `${typingUsers.map((u) => u.name).join(", ")} typing...`
                : isGroup
                  ? `${participants.filter((p) => p.isOnline).length} online`
                  : participants[0]?.isOnline
                    ? "Active now"
                    : `Last seen ${participants[0]?.lastSeen}`}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="videocam" className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="call" className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="information-circle" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupMessagesByDate().map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-500 dark:text-gray-400">
                {date}
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-1 group">
              {dateMessages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showAvatar={shouldShowAvatar(
                    message,
                    messages.indexOf(message),
                  )}
                />
              ))}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Replying to {getParticipant(replyingTo.senderId)?.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {replyingTo.content}
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Icon name="attach" className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => handleKeyPress(e, handleSend)}
              className="border-none bg-gray-100 dark:bg-gray-800 rounded-full"
            />
          </div>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 transition-colors ${
              isRecording
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Icon name="mic" className="w-5 h-5" />
          </button>

          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="rounded-full"
          >
            <Icon name="send" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
