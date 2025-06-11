import React from "react";
import { TabItem } from "../atoms";
import type { TabItemProps } from "../atoms";

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: TabItemProps["variant"];
  size?: TabItemProps["size"];
  orientation?: TabItemProps["orientation"];
  fullWidth?: boolean;
  showContent?: boolean;
  className?: string;
  contentClassName?: string;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  size = "md",
  orientation = "horizontal",
  fullWidth = false,
  showContent = true,
  className = "",
  contentClassName = "",
}) => {
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const getTabsContainerClass = () => {
    if (orientation === "vertical") {
      return "flex flex-col space-y-1";
    }

    if (fullWidth) {
      return "flex w-full";
    }

    return "flex flex-wrap gap-1";
  };

  const getTabClass = () => {
    if (orientation === "vertical") {
      return "w-full";
    }

    if (fullWidth) {
      return "flex-1";
    }

    return "";
  };

  return (
    <div
      className={`${orientation === "vertical" ? "flex gap-6" : ""} ${className}`}
    >
      {/* Tabs Navigation */}
      <div
        className={`
        ${orientation === "vertical" ? "w-64" : ""}
        ${variant === "pills" ? "bg-gray-100 dark:bg-gray-800 p-1 rounded-lg" : ""}
        ${variant === "bordered" ? "border-b border-gray-200 dark:border-gray-700" : ""}
      `}
      >
        <nav className={getTabsContainerClass()} role="tablist">
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              isActive={activeTab === tab.id}
              icon={tab.icon}
              badge={tab.badge}
              variant={variant}
              size={size}
              orientation={orientation}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              className={getTabClass()}
            >
              {tab.label}
            </TabItem>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {showContent && activeTabData?.content && (
        <div
          className={`
            ${orientation === "vertical" ? "flex-1" : "mt-6"}
            ${contentClassName}
          `}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTabData.content}
        </div>
      )}
    </div>
  );
};
