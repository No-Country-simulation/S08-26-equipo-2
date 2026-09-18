import { useState } from "react";
import type { NotificationSettingsData } from "../types";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const notificationItems: {
  key: keyof NotificationSettingsData;
  label: string;
  sub: string;
}[] = [
  {
    key: "email",
    label: "Notificaciones por email",
    sub: "Recibe recordatorios e invitaciones por correo electrónico",
  },
  {
    key: "push",
    label: "Notificaciones push",
    sub: "Alertas y avisos en tiempo real en el navegador",
  },
  {
    key: "reminders",
    label: "Recordatorios de reunión",
    sub: "Aviso previo 15 minutos antes del inicio de cada reunión",
  },
  {
    key: "chat",
    label: "Mensajes de chat",
    sub: "Notificaciones emergentes de nuevos mensajes durante reuniones",
  },
];

export function NotificationsSettings() {
  const [notifs, setNotifs] = useState<NotificationSettingsData>({
    email: true,
    push: true,
    reminders: true,
    chat: false,
  });

  const handleToggle = (key: keyof NotificationSettingsData, checked: boolean) => {
    setNotifs((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Notificaciones
        </h2>
      </div>

      <div className="space-y-3">
        {notificationItems.map((item) => (
          <Card
            key={item.key}
            className="p-4 border-border bg-card shadow-sm hover:border-border/80 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor={item.key}
                  className="text-sm font-semibold text-foreground cursor-pointer"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  {item.label}
                </Label>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>

              <Switch
                id={item.key}
                checked={notifs[item.key]}
                onCheckedChange={(checked) => handleToggle(item.key, checked)}
                className="cursor-pointer shrink-0"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
