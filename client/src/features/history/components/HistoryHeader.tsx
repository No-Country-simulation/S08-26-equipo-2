import { memo } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface HistoryHeaderProps {
  totalCount: number;
  isFetching: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onRefresh: () => void;
}

export const HistoryHeader = memo(function HistoryHeader({
  totalCount,
  isFetching,
  searchQuery,
  onSearchChange,
  onRefresh,
}: HistoryHeaderProps) {
  return (
    <div className="space-y-5 mb-6">
      {/* Titulo y Recarga */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Historial de reuniones
            </h1>
            {isFetching && (
              <span className="flex items-center gap-1 text-xs text-primary animate-pulse ml-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Actualizando...
              </span>
            )}
          </div>
          <p className="text-sm mt-1 text-muted-foreground">
            {totalCount === 1
              ? "1 reunión finalizada registrada"
              : `${totalCount} reuniones finalizadas registradas`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            title="Recargar historial"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          className="w-full py-2 pl-9 pr-4 text-sm rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20 transition-colors"
          placeholder="Buscar por título de reunión..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
});

export default HistoryHeader;
