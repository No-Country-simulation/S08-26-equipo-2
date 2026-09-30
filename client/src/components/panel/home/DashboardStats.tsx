import { Video, Clock, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardMetric } from "@/hooks/useDashboardMetrics";

interface DashboardStatsProps {
  stats: DashboardMetric[];
  isLoading?: boolean;
}

const STAT_ICONS = [Video, Clock, TrendingUp, Users];

export function DashboardStats({ stats, isLoading = false }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="p-4 border-border bg-card rounded-xl">
            <div className="flex items-start justify-between mb-3">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 mb-2 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = STAT_ICONS[idx % STAT_ICONS.length];
        return (
          <Card
            key={s.label}
            className="p-4 border-border bg-card rounded-xl shadow-md transition-all hover:border-border/80"
          >
            <div className="flex items-start justify-between mb-3">
              <p
                className="text-xs font-medium text-muted-foreground"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {s.label}
              </p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${s.color}18` }}
              >
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
            </div>
            <p
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {s.value}
            </p>
            <p className="text-xs mt-1 text-emerald-400 font-medium">{s.sub}</p>
          </Card>
        );
      })}
    </div>
  );
}

export default DashboardStats;
