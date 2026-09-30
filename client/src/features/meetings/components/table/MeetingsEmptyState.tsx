import { Video } from 'lucide-react';

export interface MeetingsEmptyStateProps {
  title?: string;
  description?: string;
}

export function MeetingsEmptyState({
  title = 'No se encontraron reuniones',
  description = 'Prueba cambiando los filtros de búsqueda o programa una nueva reunión.',
}: MeetingsEmptyStateProps) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <Video className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs mt-1 text-muted-foreground/70">{description}</p>
    </div>
  );
}

export default MeetingsEmptyState;
