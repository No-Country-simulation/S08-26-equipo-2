import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface SecuritySettingsProps {
  title: string;
  options?: string[];
}

const defaultOptionsMap: Record<string, string[]> = {
  account: [
    "Cambiar correo electrónico",
    "Cambiar contraseña",
    "Sesiones activas y dispositivos conectados",
    "Eliminar cuenta permanentemente",
  ],
  privacy: [
    "Visibilidad del perfil en reuniones",
    "Compartir estado en línea",
    "Historial de actividad",
    "Descargar copia de mis datos",
  ],
  security: [
    "Autenticación de dos factores (2FA)",
    "Preguntas de seguridad",
    "Registro de accesos recientes",
    "Claves de acceso de seguridad",
  ],
  preferences: [
    "Idioma de la interfaz",
    "Tema oscuro / claro",
    "Zona horaria predeterminada",
    "Atajos de teclado en videollamada",
  ],
};

export function SecuritySettings({ title, options }: SecuritySettingsProps) {
  const items = options || defaultOptionsMap[title.toLowerCase()] || [
    "Cambiar contraseña",
    "Autenticación de dos factores",
    "Sesiones activas",
    "Exportar datos",
    "Eliminar cuenta",
  ];

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {title}
        </h2>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <Card
            key={item}
            className="p-4 border-border bg-card shadow-sm hover:border-primary/40 hover:bg-white/[0.02] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {item}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
