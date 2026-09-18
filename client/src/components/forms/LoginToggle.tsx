import { NavLink } from "react-router-dom";

export function LoginToggle() {
  return (
    <div className="flex w-full rounded-3xl border border-slate-700 bg-slate-900/70 p-1">
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `
          flex-1 rounded-2xl px-4 py-2 text-center text-lg font-medium
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-900 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.35)]"
              : "text-slate-500 hover:text-slate-300"
          }
          `
        }
      >
        Iniciar sesión
      </NavLink>

      <NavLink
        to="/signup"
        className={({ isActive }) =>
          `
          flex-1 rounded-2xl px-4 py-2 text-center text-lg font-medium
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-900 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.35)]"
              : "text-slate-500 hover:text-slate-300"
          }
          `
        }
      >
        Registrarse
      </NavLink>
    </div>
  );
}