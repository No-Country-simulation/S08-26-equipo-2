import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import {
  DashboardStats,
  FeaturedMeetingCard,
  TodayMeetingsList,
  RecentMeetingsGrid,
} from "@/components/panel/home";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats, todayMeetings, featuredMeeting, recentHistory, isLoading } =
    useDashboardMetrics();

  // Saludo dinámico según la hora actual
  const now = new Date();
  const hour = now.getHours();
  let greeting = "Buenos días";
  if (hour >= 12 && hour < 19) {
    greeting = "Buenas tardes";
  } else if (hour >= 19 || hour < 6) {
    greeting = "Buenas noches";
  }

  const userName = user?.fullName
    ? user.fullName.trim().split(" ")[0]
    : user?.email
      ? user.email.split("@")[0]
      : "Usuario";

  const todayCount = todayMeetings.length;
  const countText =
    todayCount === 0
      ? "No tienes reuniones programadas para hoy"
      : todayCount === 1
        ? "Tienes 1 reunión programada para hoy"
        : `Tienes ${todayCount} reuniones programadas para hoy`;

  return (
    <div className="min-h-full bg-background text-foreground flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 fade-in max-w-7xl mx-auto w-full">
        {/* 1. Header con Saludo y Botón de Nueva Reunión */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {greeting}, {userName}
            </h1>
            <p className="text-sm mt-1 text-muted-foreground">{countText}</p>
          </div>
          <Button
            type="button"
            onClick={() => navigate("/meetings/create")}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer shadow-lg shadow-primary/20"
          >
            <Video className="w-4 h-4" />
            Nueva reunión
          </Button>
        </div>

        {/* 2. Cuadrícula de 4 Métricas principales */}
        <DashboardStats stats={stats} isLoading={isLoading} />

        {/* 3. Sección central: Reunión destacada + Reuniones de hoy */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <FeaturedMeetingCard
              meeting={featuredMeeting}
              onJoinMeeting={(m) =>
                m.id ? navigate(`/meet/${m.id}`) : navigate("/livekit")
              }
              onCreateMeeting={() => navigate("/meetings/create")}
            />
          </div>
          <div className="lg:col-span-3">
            <TodayMeetingsList
              meetings={todayMeetings}
              onJoinMeeting={(m) =>
                m.id ? navigate(`/meet/${m.id}`) : navigate("/livekit")
              }
              onViewAll={() => navigate("/meetings")}
            />
          </div>
        </div>

        {/* 4. Sección inferior: Reuniones recientes del historial */}
        <RecentMeetingsGrid
          meetings={recentHistory}
          onViewHistory={() => navigate("/history")}
        />
      </div>
    </div>
  );
}
