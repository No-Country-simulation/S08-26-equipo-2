import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, Video, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth";
import type { Screen } from "@/features/meetings/types/meeting";
import { cn } from "@/lib/utils";

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  "create-meeting": "Crear reunión",
  "my-meetings": "Mis reuniones",
  history: "Historial",
  calendar: "Calendario",
  settings: "Configuración",
};

export interface HeaderProps {
  screen?: Screen;
  onNav?: (s: Screen) => void;
  className?: string;
}

export function Header({ screen, onNav, className }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  const handleNav = (targetScreen: Screen, href: string) => {
    if (onNav) {
      onNav(targetScreen);
    } else {
      navigate(href);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  // Determinar título según prop o ruta actual
  const getScreenTitle = (): string => {
    if (screen && titles[screen]) {
      return titles[screen];
    }
    const path = location.pathname;
    if (path === "/") return titles.dashboard;
    if (path === "/meetings/create") return titles["create-meeting"];
    if (path === "/settings") return titles.settings;
    if (path === "/meetings") {
      if (location.search.includes("tab=history")) return titles.history;
      if (location.search.includes("tab=calendar")) return titles.calendar;
      return titles["my-meetings"];
    }
    return titles.dashboard;
  };

  const currentTitle = getScreenTitle();

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AG";

  return (
    <header
      className={cn(
        "flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-20 transition-all",
        className
      )}
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(6, 13, 31, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        flexShrink: 0,
      }}
    >
      {/* Sidebar toggle for mobile & title */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <SidebarTrigger className="md:hidden h-8 w-8 text-slate-300 hover:text-white shrink-0" />
        <h2
          className="text-base font-bold truncate text-foreground select-none"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {currentTitle}
        </h2>
      </div>

      {/* Search Bar */}
      <div className="relative hidden sm:block">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "var(--muted-foreground)" }}
        />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar reuniones…"
          className="h-9 w-48 lg:w-56 pl-9 pr-3 text-xs md:text-sm bg-secondary/40 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50"
        />
      </div>

      {/* Notifications Button */}
      <button
        type="button"
        aria-label="Notificaciones"
        className="relative w-9 h-9 rounded-lg flex items-center justify-center border border-border bg-card/60 hover:bg-card text-slate-300 hover:text-white transition-colors cursor-pointer shadow-xs"
      >
        <Bell className="w-4 h-4" />
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style={{ background: "var(--primary)" }}
        />
      </button>

      {/* Nueva reunión Button */}
      <Button
        onClick={() => handleNav("create-meeting", "/meetings/create")}
        className="hidden md:flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 cursor-pointer transition-all active:scale-[0.98]"
      >
        <Video className="w-4 h-4" />
        Nueva reunión
      </Button>

      {/* User Avatar with Dropdown & Logout */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/50 transition-colors outline-none cursor-pointer select-none"
          aria-label="Menú de usuario"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            }}
          >
            {initials}
          </div>
          <ChevronDown
            className="w-3.5 h-3.5 transition-transform duration-200"
            style={{ color: "var(--muted-foreground)" }}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 p-1.5 rounded-xl border border-border bg-[#0d1730] text-popover-foreground shadow-xl backdrop-blur-md"
        >
          <div className="px-2.5 py-2 select-none">
            <p
              className="text-xs font-semibold text-foreground truncate"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {user?.fullName || "Ana García"}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {user?.email || "ana@empresa.com"}
            </p>
          </div>

          <DropdownMenuSeparator className="my-1 bg-border/60" />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => handleNav("settings", "/settings")}
              className="flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg cursor-pointer text-slate-200 hover:text-white hover:bg-slate-800/80 focus:bg-slate-800/80 focus:text-white focus:**:!text-white data-highlighted:bg-slate-800/80 data-highlighted:text-white data-highlighted:**:!text-white transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configuración</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg cursor-pointer text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-300 focus:**:!text-rose-300 data-highlighted:bg-rose-500/10 data-highlighted:text-rose-300 data-highlighted:**:!text-rose-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Header;
