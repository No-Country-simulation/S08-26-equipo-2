import type { LucideIcon } from "lucide-react";

export type SettingsSectionId =
  | "profile"
  | "account"
  | "notifications"
  | "media"
  | "privacy"
  | "security"
  | "preferences";

export interface SettingsSection {
  id: SettingsSectionId;
  label: string;
  icon: LucideIcon;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  role: string;
  organization: string;
}

export interface NotificationSettingsData {
  email: boolean;
  push: boolean;
  reminders: boolean;
  chat: boolean;
}

export interface MediaSettingsData {
  microphone: string;
  speakers: string;
  camera: string;
}
