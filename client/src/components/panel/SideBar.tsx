import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  Calendar,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/features/auth";

const items = [
  {
    label: "Inicio",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Crear reunión",
    href: "/meetings/create",
    icon: PlusCircle,
  },
  {
    label: "Historial",
    href: "/meetings",
    icon: Calendar,
  },
  {
    label: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <aside
      className="
        fixed inset-y-0 left-0
        flex w-[320px] flex-col
        border-r border-slate-800
        bg-[#0d1830]
        px-4 py-6
        text-slate-300
      "
    >
      <div className="mb-10 flex items-center gap-3 px-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600">
          <Video className="size-5 text-white" />
        </div>

        <span className="text-2xl font-semibold text-slate-200">MeetFlow</span>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={({ isActive }) =>
                [
                  "flex h-14 items-center gap-4 rounded-xl px-4",
                  "text-base font-medium transition-colors",
                  isActive
                    ? "border border-blue-500/40 bg-blue-500/15 text-blue-300"
                    : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-200",
                ].join(" ")
              }
            >
              <Icon className="size-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Ocupa el espacio restante */}
      <div className="flex-1" />

      {/* Usuario */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white text-sm shrink-0">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-200 text-sm">
              {user?.fullName || "Usuario"}
            </p>

            <p className="truncate text-xs text-slate-400">
              {user?.email || "Sin correo"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
