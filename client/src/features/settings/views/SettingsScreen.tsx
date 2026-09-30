import { useState } from "react";
import {
  User,
  Bell,
  Mic,
  Shield,
  Lock,
  Sliders,
  KeyRound,
} from "lucide-react";
import type { SettingsSection, SettingsSectionId } from "../types";
import {
  ProfileSettings,
  NotificationsSettings,
  MediaSettings,
  SecuritySettings,
} from "../components";

const sections: SettingsSection[] = [
  { id: "profile", label: "Información personal", icon: User },
  { id: "account", label: "Cuenta", icon: Lock },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "media", label: "Audio y video", icon: Mic },
  { id: "privacy", label: "Privacidad", icon: Shield },
  { id: "security", label: "Seguridad", icon: KeyRound },
  { id: "preferences", label: "Preferencias", icon: Sliders },
];

export function SettingsScreen() {
  const [active, setActive] = useState<SettingsSectionId>("profile");

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-background">
      {/* Settings Sub-Sidebar */}
      <aside className="w-full md:w-64 shrink-0 p-4 md:p-6 border-b md:border-b-0 md:border-r border-border bg-background">
        <p
          className="text-xs font-semibold mb-3 px-3 tracking-wider uppercase text-muted-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Configuración
        </p>
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer whitespace-nowrap md:whitespace-normal shrink-0 mb-0.5 ${
                  isActive
                    ? "bg-blue-500/15 text-[#93c5fd] border border-blue-500/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent font-medium"
                }`}
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-[#93c5fd]" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span
                  className={`transition-colors ${
                    isActive ? "text-[#93c5fd]" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Settings Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {active === "profile" && <ProfileSettings />}
        {active === "notifications" && <NotificationsSettings />}
        {active === "media" && <MediaSettings />}
        {(active === "account" ||
          active === "privacy" ||
          active === "security" ||
          active === "preferences") && (
          <SecuritySettings
            title={sections.find((s) => s.id === active)?.label || "Configuración"}
          />
        )}
      </main>
    </div>
  );
}

export default SettingsScreen;
