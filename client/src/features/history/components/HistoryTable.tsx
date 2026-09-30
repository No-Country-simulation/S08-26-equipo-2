import { useState } from "react";
import { useHistoryMeetings } from "../hooks/useHistory";
import type { HistoryMeetingUI, HistoryTableProps } from "../types/history";
import { HistoryHeader } from "./HistoryHeader";
import { HistoryRow } from "./HistoryRow";
import { HistoryEmptyState } from "./HistoryEmptyState";
import { HistoryDetailsSheet } from "./HistoryDetailsSheet";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HistoryTable({ className = "" }: HistoryTableProps) {
  const {
    meetings,
    totalCount,
    isLoading,
    isFetching,
    searchQuery,
    setSearchQuery,
    refetch,
  } = useHistoryMeetings();

  const [selectedMeeting, setSelectedMeeting] =
    useState<HistoryMeetingUI | null>(null);

  return (
    <div className={`w-full mx-auto px-4 py-6 ${className}`}>
      {/* Encabezado y buscador */}
      <HistoryHeader
        totalCount={totalCount}
        isFetching={isFetching}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => refetch()}
      />

      {/* Contenedor de la Tabla */}
      <Card className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/80">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Reunión
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fecha
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Horario y Duración
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Participantes
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Estado
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                // Skeletons de carga
                [1, 2, 3, 4].map((i) => (
                  <TableRow key={i} className="border-b border-border/60">
                    <TableCell className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <Skeleton className="h-8 w-24 rounded-md ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : meetings.length > 0 ? (
                // Filas de reuniones finalizadas
                meetings.map((m) => (
                  <HistoryRow
                    key={m.id}
                    meeting={m}
                    onViewDetails={(selected) => setSelectedMeeting(selected)}
                  />
                ))
              ) : (
                // Estado vacio
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="p-0">
                    <HistoryEmptyState isSearch={Boolean(searchQuery.trim())} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Hoja lateral de detalles */}
      <HistoryDetailsSheet
        meeting={selectedMeeting}
        open={Boolean(selectedMeeting)}
        onOpenChange={(open) => {
          if (!open) setSelectedMeeting(null);
        }}
      />
    </div>
  );
}

export default HistoryTable;
