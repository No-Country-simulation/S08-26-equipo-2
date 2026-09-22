import { useNavigate, useLocation } from "react-router-dom";
import {
  Video,
  LayoutDashboard,
  CalendarDays,
  History,
  Settings,
  Plus,
  Users,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth";
import type { Screen } from "@/features/meetings/types/meeting";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  current?: Screen;
  onNav?: (s: Screen) => void;
  className?: string;
}

const items = [
  { id: "dashboard", label: "Inicio", icon: LayoutDashboard, href: "/" },
  { id: "create-meeting", label: "Crear reunión", icon: Plus, href: "/meetings/create" },
  { id: "my-meetings", label: "Mis reuniones", icon: Users, href: "/meetings" },
  { id: "calendar", label: "Calendario", icon: CalendarDays, href: "/meetings" },
  { id: "history", label: "Historial", icon: History, href: "/history" },
  { id: "settings", label: "Configuración", icon: Settings, href: "/settings" },
] as const;

export function Sidebar({ current, onNav, className }: SidebarProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = (item: (typeof items)[number]) => {
    if (onNav) {
      onNav(item.id as Screen);
    } else {
      navigate(item.href);
    }
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isItemActive = (item: (typeof items)[number], index: number) => {
    if (current) {
      return (
        current === item.id ||
        (item.id === "history" && index === 4 && current === "history")
      );
    }
    // Determinar activo según ruta de React Router
    if (item.id === "dashboard") {
      return location.pathname === "/";
    }
    if (item.id === "create-meeting") {
      return location.pathname === "/meetings/create";
    }
    if (item.id === "settings") {
      return location.pathname === "/settings";
    }
    if (item.id === "my-meetings" && location.pathname === "/meetings" && !location.search.includes("tab=history")) {
      return true;
    }
    if (item.id === "history") {
      return (
        location.pathname === "/history" ||
        (location.pathname === "/meetings" && location.search.includes("tab=history"))
      );
    }
    return false;
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AG";

  return (
    <ShadcnSidebar
      collapsible="offcanvas"
      className={cn(
        "border-r border-border bg-card flex flex-col shrink-0 [&_[data-slot=sidebar-inner]]:p-[20px_12px] [&_[data-slot=sidebar-inner]]:bg-card",
        className
      )}
      style={{
        width: "var(--sidebar-width)",
        background: "var(--card)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo Header */}
      <SidebarHeader className="p-0">
        <div className="flex items-center gap-2.5 px-2 mb-6">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
          >
            <Video className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight select-none"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              background: "linear-gradient(135deg, #fff, #93c5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MeetFlow
          </span>
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="p-0">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item, i) => {
                const Icon = item.icon;
                const active = isItemActive(item, i);

                return (
                  <SidebarMenuItem key={`${item.id}-${i}`}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => handleNavigate(item)}
                      tooltip={item.label}
                      className={cn(
                        "h-10 px-3 rounded-xl text-sm transition-all gap-3 cursor-pointer w-full justify-start",
                        active
                          ? "bg-blue-500/15 text-[#93c5fd] border border-blue-500/40 font-semibold shadow-xs"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium border border-transparent"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          active ? "text-[#93c5fd]" : "text-slate-400"
                        )}
                      />
                      <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="p-0 mt-auto">
        <div
          className="p-3 rounded-lg border border-border"
          style={{ background: "rgba(255, 255, 255, 0.03)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 select-none shadow-xs"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              }}
            >
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold truncate text-foreground leading-tight"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {user?.fullName || "Ana García"}
              </p>
              <p className="text-xs truncate text-muted-foreground leading-tight mt-0.5">
                {user?.email || "ana@empresa.com"}
              </p>
            </div>

            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: "#22c55e" }}
              title="En línea"
            />
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}

export default Sidebar;
