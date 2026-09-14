import { memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { filterTabs, type MeetingFilterValue } from '../../types/meeting';

export interface MeetingsFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  filter: MeetingFilterValue;
  onFilterChange: (filter: MeetingFilterValue) => void;
}

export const MeetingsFilters = memo(function MeetingsFilters({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: MeetingsFiltersProps) {
  return (
    <div className="flex items-center gap-3 mb-5 flex-wrap">
      {/* Campo de Búsqueda */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          className="w-full py-2 pl-9 pr-4 text-sm rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20 transition-colors"
          placeholder="Buscar reuniones…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      {/* Tabs de Filtro de Estado */}
      <div className="flex gap-1.5 flex-wrap">
        {filterTabs.map((f) => {
          const isActive = filter === f.value;
          return (
            <Button
              key={f.value}
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange(f.value)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/40 shadow-sm hover:bg-primary/30'
                  : 'bg-card/60 text-muted-foreground border border-border hover:bg-white/[0.04] hover:text-foreground'
              }`}
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {f.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

export default MeetingsFilters;
