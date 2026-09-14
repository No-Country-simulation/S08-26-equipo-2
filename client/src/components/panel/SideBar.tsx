import { NavLink } from "react-router-dom";
import { LayoutDashboard, Video, Calendar, PlusCircle } from "lucide-react";

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
];

export function Sidebar() {
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
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
            AG
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-200">Ana García</p>

            <p className="truncate text-sm text-slate-500">ana@empresa.com</p>
          </div>

          <div className="size-2.5 rounded-full bg-emerald-400" />
        </div>
      </div>
    </aside>
  );
}
