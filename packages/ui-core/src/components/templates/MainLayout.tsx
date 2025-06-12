import React from "react";
import { Header, Sidebar, ChatSidebar, NotificationsPanel } from "../organisms";
import type {
  HeaderProps,
  SidebarProps,
  ChatSidebarProps,
  NotificationsPanelProps,
} from "../organisms";

export interface MainLayoutProps {
  children: React.ReactNode;
  user?: HeaderProps["user"];
  headerProps?: Partial<HeaderProps>;
  sidebarProps?: Partial<SidebarProps>;
  chatSidebarProps?: Partial<ChatSidebarProps>;
  notificationsProps?: Partial<NotificationsPanelProps>;
  showSidebar?: boolean;
  showChatSidebar?: boolean;
  showNotifications?: boolean;
  onNavigate?: (path: string) => void;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  headerProps = {},
  sidebarProps = {},
  chatSidebarProps = {},
  notificationsProps = {},
  showSidebar = true,
  showChatSidebar = true,
  showNotifications = false,
  onNavigate,
  className = "",
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 ${className}`}>
      {/* Header */}
      <Header
        user={user}
        onSearch={headerProps.onSearch}
        onNotificationsClick={headerProps.onNotificationsClick}
        onMessagesClick={headerProps.onMessagesClick}
        onProfileClick={headerProps.onProfileClick}
        {...headerProps}
      />

      <div className="flex">
        {/* Left Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar user={user} onNavigate={onNavigate} {...sidebarProps} />
          </div>
        )}

        {/* Main Content */}
        <main
          className={`
            flex-1 min-h-[calc(100vh-4rem)]
            ${showSidebar ? "lg:ml-80" : ""}
            ${showChatSidebar ? "lg:mr-80" : ""}
          `}
        >
          {children}
        </main>

        {/* Right Chat Sidebar */}
        {showChatSidebar && (
          <div className="hidden lg:block fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <ChatSidebar {...chatSidebarProps} />
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50">
          <NotificationsPanel
            isOpen={showNotifications}
            {...notificationsProps}
          />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => onNavigate?.("/feed")}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Home
            </span>
          </button>

          <button
            onClick={() => onNavigate?.("/search")}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Search
            </span>
          </button>

          <button
            onClick={() => onNavigate?.("/messages")}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Messages
            </span>
          </button>

          <button
            onClick={() => onNavigate?.("/profile")}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Profile
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
