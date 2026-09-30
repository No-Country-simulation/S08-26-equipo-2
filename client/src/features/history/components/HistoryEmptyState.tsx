import { memo } from "react";
import { History, SearchX } from "lucide-react";

export interface HistoryEmptyStateProps {
  isSearch: boolean;
}

export const HistoryEmptyState = memo(function HistoryEmptyState({
  isSearch,
}: HistoryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mb-3.5 text-muted-foreground">
        {isSearch ? (
          <SearchX className="w-6 h-6 text-muted-foreground" />
        ) : (
          <History className="w-6 h-6 text-muted-foreground" />
        )}
      </div>

      <h3
        className="text-base font-semibold text-foreground mb-1"
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
      >
        {isSearch
          ? "No se encontraron reuniones"
          : "Sin reuniones en el historial"}
      </h3>

      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
        {isSearch
          ? "No encontramos ninguna reunión finalizada que coincida con tu búsqueda. Intenta con otros términos."
          : "Aquí aparecerán las reuniones que hayas completado o finalizado junto con el registro de asistentes."}
      </p>
    </div>
  );
});

export default HistoryEmptyState;
