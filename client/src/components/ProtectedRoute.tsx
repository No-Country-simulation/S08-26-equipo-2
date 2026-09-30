import { getAuthDestination } from "@/features/auth/getAuthDestination";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";

interface RouteGuardProps {
  children?: React.ReactNode;
}

/**
 * Guard para rutas privadas: si el usuario no está autenticado,
 * lo redirige a /auth recordando la ubicación previa.
 */
export function ProtectedRoute({ children }: RouteGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}

/**
 * Guard para rutas exclusivas de invitados (como /auth o /forgot-password):
 * si el usuario ya tiene sesión activa, lo redirige al panel principal /.
 */
export function PublicOnlyRoute({ children }: RouteGuardProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={getAuthDestination(location.state)} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
