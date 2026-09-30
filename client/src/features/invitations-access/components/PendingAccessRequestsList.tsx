import { useState } from "react";
import { UserCheck, UserX, ShieldAlert } from "lucide-react";
import {
  usePendingAccessRequests,
  useApproveAccessRequest,
  useRejectAccessRequest,
} from "../hooks/useAccessRequests";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export interface PendingAccessRequestsListProps {
  meetingId: string;
}

export function PendingAccessRequestsList({
  meetingId,
}: PendingAccessRequestsListProps) {
  const { data: requests, isLoading, isError } = usePendingAccessRequests(meetingId);
  const approveMutation = useApproveAccessRequest();
  const rejectMutation = useRejectAccessRequest();
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    setActionError(null);
    try {
      await approveMutation.mutateAsync({ meetingId, requestId });
    } catch {
      setActionError("No se pudo admitir al participante. Intenta nuevamente.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    setActionError(null);
    try {
      await rejectMutation.mutateAsync({ meetingId, requestId });
    } catch {
      setActionError("No se pudo rechazar la solicitud. Intenta nuevamente.");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingList = requests || [];

  return (
    <div className="space-y-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Solicitudes de acceso
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] px-2 py-0.5 font-medium border-amber-500/30 text-amber-500 bg-amber-500/10"
        >
          {isLoading ? "..." : pendingList.length}
        </Badge>
      </div>

      {(actionError || isError) && <p role="alert" className="text-xs text-rose-300">{actionError || "No se pudieron consultar las solicitudes."}</p>}
      {isLoading ? (
        <div className="space-y-2">
          {[1].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/60"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="w-7 h-7 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-2 w-32 rounded" />
                </div>
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-7 w-14 rounded" />
                <Skeleton className="h-7 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : pendingList.length > 0 ? (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {pendingList.map((req) => {
            const name = req.user?.fullName || "Usuario solicitante";
            const email = req.user?.email || "";
            const initial = (name || email || "U")[0].toUpperCase();
            const isProcessing = processingId !== null;

            return (
              <div
                key={req.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-background border border-border/80 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="font-semibold text-foreground truncate">
                      {name}
                    </p>
                    {email && (
                      <p className="text-[10px] text-muted-foreground truncate">
                        {email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isProcessing}
                    onClick={() => handleApprove(req.id)}
                    className="h-7 px-2 text-[11px] bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3 h-3" />
                    Admitir
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isProcessing}
                    onClick={() => handleReject(req.id)}
                    className="h-7 px-2 text-[11px] bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/30 flex items-center gap-1 cursor-pointer"
                  >
                    <UserX className="w-3 h-3" />
                    Rechazar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic py-1">
          No hay solicitudes de acceso pendientes en este momento.
        </p>
      )}
    </div>
  );
}
