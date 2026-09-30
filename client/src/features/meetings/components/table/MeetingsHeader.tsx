import { memo } from 'react';
import { Video, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MeetingsHeaderProps {
  title: string;
  count: number;
  isFetching: boolean;
  showCreateButton: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export const MeetingsHeader = memo(function MeetingsHeader({
  title,
  count,
  isFetching,
  showCreateButton,
  onRefresh,
  onCreate,
}: MeetingsHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {title}
          </h1>
          {isFetching && (
            <span className="flex items-center gap-1 text-xs text-primary animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Actualizando...
            </span>
          )}
        </div>
        <p className="text-sm mt-1 text-muted-foreground">
          {count} {count === 1 ? 'reunión encontrada' : 'reuniones encontradas'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          title="Recargar datos"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>

        {showCreateButton && (
          <Button
            onClick={onCreate}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm cursor-pointer shadow-lg shadow-primary/20"
          >
            <Video className="w-4 h-4" />
            Nueva reunión
          </Button>
        )}
      </div>
    </div>
  );
});

export default MeetingsHeader;
