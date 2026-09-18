import { useState } from "react";
import { Copy, Share2, Calendar, Clock, Users, Check } from "lucide-react";
import type { Meeting, Screen } from "../../types/meeting";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface MeetingSuccessProps {
  meeting: Partial<Meeting>;
  isEdit?: boolean;
  onNav?: (screen: Screen) => void;
}

export function MeetingSuccess({
  meeting,
  isEdit = false,
  onNav,
}: MeetingSuccessProps) {
  const [copied, setCopied] = useState(false);

  const meetLink = meeting.roomUrl || "meetflow.app/meet/sprint-q4-abc123";

  const handleCopy = () => {
    navigator.clipboard?.writeText(meetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: meeting.name || "Reunión MeetFlow",
          text: `Únete a mi reunión en MeetFlow: ${meeting.name}`,
          url: `https://${meetLink}`,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
      <Card className="p-8 max-w-lg w-full text-center border-border bg-card rounded-2xl shadow-2xl">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "2px solid rgba(34,197,94,0.3)",
          }}
        >
          <Check className="w-8 h-8 text-green-500" />
        </div>

        <h2
          className="text-xl font-bold text-foreground mb-2"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {isEdit ? "¡Reunión actualizada!" : "¡Reunión creada!"}
        </h2>
        <p className="text-sm mb-6 text-muted-foreground">
          {meeting.name || "Mi Reunión"} · {meeting.date || "10 sep"} ·{" "}
          {meeting.time || "10:00"} · {meeting.duration || "60 min"}
        </p>

        {/* Link box */}
        <div
          className="p-4 rounded-xl mb-4 border"
          style={{
            background: "rgba(59,130,246,0.08)",
            borderColor: "rgba(59,130,246,0.2)",
          }}
        >
          <p
            className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Enlace de reunión
          </p>
          <p className="text-sm font-mono break-all mb-3 text-blue-300 select-all">
            {meetLink}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copiado" : "Copiar enlace"}
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          {[
            { icon: Calendar, label: meeting.date || "10 sep 2026" },
            { icon: Clock, label: meeting.time || "10:00 AM" },
            {
              icon: Users,
              label: meeting.duration ? `${meeting.duration}` : "60 min",
            },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="p-3 rounded-lg border border-border bg-white/[0.02]"
            >
              <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p
                className="text-xs font-semibold text-foreground"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onNav?.("dashboard")}
            className="btn-ghost flex-1 py-2.5 text-sm cursor-pointer"
          >
            Ir al dashboard
          </Button>
          <Button
            onClick={() => onNav?.("video-room")}
            className="btn-primary flex-1 py-2.5 text-sm cursor-pointer shadow-lg shadow-primary/20"
          >
            Iniciar reunión
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default MeetingSuccess;
