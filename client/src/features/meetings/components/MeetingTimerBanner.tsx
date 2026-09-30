import { Clock, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MeetingTimerBannerProps {
  formattedRemaining: string;
  isWarningActive: boolean;
  isLastMinute: boolean;
  warningMinutes: number;
  onDismiss: () => void;
  className?: string;
}

export function MeetingTimerBanner({
  formattedRemaining,
  isWarningActive,
  isLastMinute,
  warningMinutes,
  onDismiss,
  className,
}: MeetingTimerBannerProps) {
  if (!isWarningActive && !isLastMinute) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] transition-all duration-300 animate-in fade-in slide-in-from-top-4",
        className
      )}
    >
      <div
        className={cn(
          "rounded-xl p-3 sm:p-3.5 shadow-2xl border flex items-center justify-between gap-3 backdrop-blur-md",
          isLastMinute
            ? "bg-destructive/90 border-destructive text-destructive-foreground animate-pulse"
            : "bg-amber-500/15 border-amber-500/30 text-amber-200"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              isLastMinute ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-400"
            )}
          >
            {isLastMinute ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight font-sans">
              {isLastMinute
                ? "La reunión terminará en segundos"
                : `Tiempo límite: quedan ${formattedRemaining}`}
            </p>
            <p
              className={cn(
                "text-[11px] leading-tight truncate mt-0.5",
                isLastMinute ? "text-white/80" : "text-amber-200/70"
              )}
            >
              {isLastMinute
                ? `Cierre automático en ${formattedRemaining}`
                : `La reunión estaba programada para cerrar pronto (aviso de ${warningMinutes} min).`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onDismiss}
            className={cn(
              "h-7 w-7 rounded-lg",
              isLastMinute
                ? "text-white hover:bg-white/20"
                : "text-amber-300 hover:bg-amber-500/20 hover:text-amber-100"
            )}
            title="Descartar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MeetingTimerBanner;
