import React from "react";
import { MainLayout } from "./MainLayout";
import { SettingsPanel } from "../organisms";
import type { MainLayoutProps } from "./MainLayout";
import type { SettingsPanelProps } from "../organisms";

export interface SettingsPageProps extends Omit<MainLayoutProps, "children"> {
  user: SettingsPanelProps["user"];
  settings: SettingsPanelProps["settings"];
  onUpdateProfile?: SettingsPanelProps["onUpdateProfile"];
  onUpdateSettings?: SettingsPanelProps["onUpdateSettings"];
  onChangePassword?: SettingsPanelProps["onChangePassword"];
  onDeactivateAccount?: SettingsPanelProps["onDeactivateAccount"];
  onDeleteAccount?: SettingsPanelProps["onDeleteAccount"];
  onLogout?: SettingsPanelProps["onLogout"];
  className?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onChangePassword,
  onDeactivateAccount,
  onDeleteAccount,
  onLogout,
  className = "",
  ...layoutProps
}) => {
  return (
    <MainLayout {...layoutProps} showChatSidebar={false} className={className}>
      <div className="max-w-6xl mx-auto py-6 px-4">
        <SettingsPanel
          user={user}
          settings={settings}
          onUpdateProfile={onUpdateProfile}
          onUpdateSettings={onUpdateSettings}
          onChangePassword={onChangePassword}
          onDeactivateAccount={onDeactivateAccount}
          onDeleteAccount={onDeleteAccount}
          onLogout={onLogout}
        />
      </div>
    </MainLayout>
  );
};
