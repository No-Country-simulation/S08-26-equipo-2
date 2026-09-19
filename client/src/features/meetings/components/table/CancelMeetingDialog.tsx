import { AlertTriangle, RefreshCw } from "lucide-react";
import type { Meeting } from "../../types/meeting";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface CancelMeetingDialogProps {
  meeting: Meeting | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function CancelMeetingDialog({
  meeting,
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: CancelMeetingDialogProps) {
  if (!meeting) return null;

  const displayTitle = meeting.title || meeting.name || "Reunión";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border border-border text-foreground max-w-md rounded-2xl shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/15 text-destructive rounded-full size-12 mx-auto sm:mx-0 flex items-center justify-center">
            <AlertTriangle className="size-6 text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-bold text-foreground">
            ¿Finalizar reunión?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
            ¿Estás seguro de que deseas finalizar la reunión{" "}
            <span className="font-semibold text-foreground">"{displayTitle}"</span>?
            Esta acción concluirá la reunión y desconectará a los participantes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 pt-4 border-t border-border/40">
          <AlertDialogCancel
            disabled={isPending}
            className="cursor-pointer"
          >
            No, mantener
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={onConfirm}
            className="cursor-pointer flex items-center gap-2"
          >
            {isPending ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                Finalizando...
              </>
            ) : (
              "Sí, finalizar reunión"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CancelMeetingDialog;
