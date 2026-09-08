import * as React from "react";
import {
  VideoIcon,
  MicIcon,
  Share2Icon,
  PhoneOffIcon,
  SettingsIcon,
  UsersIcon,
  ShieldCheckIcon,
  LayoutDashboardIcon,
  HelpCircleIcon,
  SparklesIcon,
  LockIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ComponentShowcase() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [publicStats, setPublicStats] = React.useState(true);
  const [emailNotifs, setEmailNotifs] = React.useState(false);

  // Estados para checkboxes de notificaciones
  const [notifStates, setNotifStates] = React.useState({
    transactions: true,
    security: true,
    milestones: false,
    updates: false,
  });

  const allSelected =
    notifStates.transactions &&
    notifStates.security &&
    notifStates.milestones &&
    notifStates.updates;

  const handleSelectAll = (checked: boolean) => {
    setNotifStates({
      transactions: checked,
      security: checked,
      milestones: checked,
      updates: checked,
    });
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-7xl mx-auto space-y-8 p-4 md:p-8">
        {/* Banner superior de presentación */}
        <div className="glass rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="badge-blue flex items-center gap-1.5 py-1 px-3"
                >
                  <SparklesIcon className="size-3.5" /> Design System MeetFlow
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/10 text-muted-foreground text-xs"
                >
                  Shadcn UI + Figma Tokens
                </Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white m-0">
                Galería de Componentes Integrados
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                Demostración de los componentes UI interactivos configurados con
                la paleta oscura, tipografía y estética extraída del diseño de
                Figma.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="btn-ghost">
                Documentación
              </Button>
              <Button className="btn-primary flex items-center gap-2">
                <VideoIcon className="size-4" /> Probar Reunión
              </Button>
            </div>
          </div>
        </div>

        {/* Bento Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* ================= CARD 1: QR CODE / MOBILE CONNECT ================= */}
          <Card className="bg-card border-white/10 rounded-2xl flex flex-col justify-between shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-white">
                Conectar Dispositivo
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Escanea desde la app móvil para sincronizar tu sesión
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4 space-y-4">
              {/* Contenedor QR Simulado */}
              <div className="bg-white p-4 rounded-xl shadow-lg border border-white/20 flex flex-col items-center justify-center">
                <div className="grid grid-cols-5 gap-1 w-36 h-36 bg-white p-2">
                  <div className="col-span-2 row-span-2 border-4 border-black rounded-sm p-1">
                    <div className="w-full h-full bg-black rounded-xs" />
                  </div>
                  <div className="bg-black col-span-1" />
                  <div className="col-span-2 row-span-2 border-4 border-black rounded-sm p-1">
                    <div className="w-full h-full bg-black rounded-xs" />
                  </div>
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="col-span-2 row-span-2 border-4 border-black rounded-sm p-1">
                    <div className="w-full h-full bg-black rounded-xs" />
                  </div>
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="bg-black col-span-2" />
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground px-4">
                Abre la app de MeetFlow y apunta la cámara a este código.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full btn-primary text-sm py-2">
                Entendido
              </Button>
            </CardFooter>
          </Card>

          {/* ================= CARD 2: PREFERENCES / SETTINGS ================= */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-white">
                  Preferencias
                </CardTitle>
                <Badge variant="outline" className="badge-blue text-[11px]">
                  En Vivo
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Configuración general de sala y notificaciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Tipo de Sala Predeterminada
                </Label>
                <div className="p-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-medium text-foreground flex items-center justify-between">
                  <span>Sala HD — LiveKit Cloud</span>
                  <ChevronRightIcon className="size-4 text-muted-foreground rotate-90" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-foreground block">
                    Estadísticas Públicas
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Permitir ver tiempo en reunión
                  </span>
                </div>
                <Switch
                  checked={publicStats}
                  onCheckedChange={setPublicStats}
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-foreground block">
                    Notificaciones Email
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Resumen diario de llamadas
                  </span>
                </div>
                <Switch
                  checked={emailNotifs}
                  onCheckedChange={setEmailNotifs}
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
              <Button variant="ghost" size="sm" className="btn-ghost text-xs">
                Resetear
              </Button>
              <Button size="sm" className="btn-primary text-xs">
                Guardar
              </Button>
            </CardFooter>
          </Card>

          {/* ================= CARD 3: NAVIGATION MENU / SIDEBAR STYLE ================= */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-white">
                Navegación
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Estructura de menú lateral de MeetFlow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-3">
                  General
                </span>
                <div className="mt-1 space-y-0.5">
                  <div className="sidebar-item active">
                    <LayoutDashboardIcon className="size-4" />
                    <span>Dashboard</span>
                  </div>
                  <div className="sidebar-item">
                    <VideoIcon className="size-4" />
                    <span>Reuniones</span>
                    <Badge
                      variant="outline"
                      className="badge-green ml-auto text-[10px]"
                    >
                      3 hoy
                    </Badge>
                  </div>
                  <div className="sidebar-item">
                    <UsersIcon className="size-4" />
                    <span>Contactos</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-3">
                  Configuración
                </span>
                <div className="mt-1 space-y-0.5">
                  <div className="sidebar-item">
                    <SettingsIcon className="size-4" />
                    <span>Preferencias</span>
                  </div>
                  <div className="sidebar-item">
                    <ShieldCheckIcon className="size-4" />
                    <span>Seguridad</span>
                  </div>
                  <div className="sidebar-item">
                    <HelpCircleIcon className="size-4" />
                    <span>Ayuda y Soporte</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ================= CARD 4: SMART ROOM / LIVE FEED ================= */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-white">
                  Sala Activa
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LockIcon className="size-3.5 text-muted-foreground" />
                  <span>Privada</span>
                </div>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                MeetFlow Pro Room — Host: Ana G.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {/* Visor de llamada con badge LIVE */}
              <div className="relative aspect-video rounded-xl bg-slate-900/80 border border-white/10 overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f615_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Badge Live */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold">
                  <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </div>

                {/* Avatar / Orador */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="size-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 speaking-ring">
                    <Avatar className="size-full">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" />
                      <AvatarFallback>AG</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs font-semibold text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    Ana García (Host)
                  </span>
                </div>

                <span className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-black/40 px-1.5 py-0.5 rounded">
                  01 / 04
                </span>
              </div>

              {/* Barra de Controles de llamada */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <Tooltip>
                  <TooltipTrigger className="control-btn active p-2 rounded-lg">
                    <MicIcon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Silenciar micrófono</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger className="control-btn active p-2 rounded-lg">
                    <VideoIcon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Apagar cámara</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger className="control-btn p-2 rounded-lg">
                    <Share2Icon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Compartir pantalla</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger className="control-btn danger p-2 rounded-lg">
                    <PhoneOffIcon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Finalizar reunión</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* ================= CARD 5: CALENDARIO INTERACTIVO ================= */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-white">
                  Agenda
                </CardTitle>
                <Badge variant="outline" className="badge-purple text-[10px]">
                  Septiembre 2026
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Selecciona una fecha para agendar
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl border border-white/5 bg-transparent"
              />
            </CardContent>
          </Card>

          {/* ================= CARD 6: CHECKBOXES & NOTIFICACIONES ================= */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white">
                Notificaciones
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Elige los avisos de la sala que deseas recibir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
                <Label
                  htmlFor="select-all"
                  className="text-xs font-semibold text-white cursor-pointer"
                >
                  Seleccionar todos
                </Label>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="alerts-trans"
                    checked={notifStates.transactions}
                    onCheckedChange={(checked) =>
                      setNotifStates((prev) => ({
                        ...prev,
                        transactions: !!checked,
                      }))
                    }
                  />
                  <div className="grid gap-0.5 leading-none">
                    <Label
                      htmlFor="alerts-trans"
                      className="text-xs text-foreground cursor-pointer"
                    >
                      Solicitudes de ingreso
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Cuando un participante espera en sala.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="alerts-sec"
                    checked={notifStates.security}
                    onCheckedChange={(checked) =>
                      setNotifStates((prev) => ({
                        ...prev,
                        security: !!checked,
                      }))
                    }
                  />
                  <div className="grid gap-0.5 leading-none">
                    <Label
                      htmlFor="alerts-sec"
                      className="text-xs text-foreground cursor-pointer"
                    >
                      Alertas de seguridad
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Accesos desde nuevos navegadores.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="alerts-milestone"
                    checked={notifStates.milestones}
                    onCheckedChange={(checked) =>
                      setNotifStates((prev) => ({
                        ...prev,
                        milestones: !!checked,
                      }))
                    }
                  />
                  <div className="grid gap-0.5 leading-none">
                    <Label
                      htmlFor="alerts-milestone"
                      className="text-xs text-foreground cursor-pointer"
                    >
                      Recordatorio de reunión
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Aviso 10 minutos antes del inicio.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button size="sm" className="w-full btn-primary text-xs">
                Guardar Preferencias
              </Button>
            </CardFooter>
          </Card>

          {/* ================= CARD 7: FORMULARIO SOCIAL / INPUTS ================= */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white">
                Enlaces de Perfil
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Configura tu presencia pública en llamadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label
                  htmlFor="handle"
                  className="text-xs text-muted-foreground"
                >
                  Usuario / Handle
                </Label>
                <Input
                  id="handle"
                  defaultValue="@anagarcia_meet"
                  className="text-xs bg-white/[0.04] border-white/10"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="meet-link"
                  className="text-xs text-muted-foreground"
                >
                  Enlace Personal
                </Label>
                <Input
                  id="meet-link"
                  defaultValue="meetflow.app/room/ana"
                  className="text-xs bg-white/[0.04] border-white/10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="web" className="text-xs text-muted-foreground">
                  Sitio Web
                </Label>
                <Input
                  id="web"
                  defaultValue="https://empresa.com"
                  className="text-xs bg-white/[0.04] border-white/10"
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
              <Button variant="ghost" size="sm" className="btn-ghost text-xs">
                Descartar
              </Button>
              <Button size="sm" className="btn-primary text-xs">
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>

          {/* ================= CARD 8: ACTIVIDAD / TRANSACCIONES RECIENTES ================= */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-white">
                  Historial Rápido
                </CardTitle>
                <Badge variant="outline" className="badge-blue text-[10px]">
                  3 recientes
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Últimas reuniones realizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    Q4
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Sprint Review Q4
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Ayer, 45 mins
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="badge-green text-[10px]">
                  Exitosa
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    1:1
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Sincronización 1:1
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Lun 14, 30 mins
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="badge-blue text-[10px]">
                  Grabada
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-xs">
                    QA
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Kickoff QA Backlog
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Vie 11, 60 mins
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="badge-yellow text-[10px]">
                  Archivada
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-white flex items-center justify-center gap-1"
              >
                Ver historial completo <ArrowRightIcon className="size-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* ================= SECCIÓN INFERIOR: ACORDEÓN & OBJETIVOS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Acordeón de FAQs */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-white">
                Preguntas Frecuentes & Criterios QA
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Documentación interactiva de funcionalidades de MeetFlow
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <Accordion defaultValue={["item-1"]} className="w-full">
                <AccordionItem value="item-1" className="border-white/10">
                  <AccordionTrigger className="text-xs md:text-sm font-medium text-foreground hover:no-underline">
                    ¿Cómo funciona la sala de espera y aprobación de
                    participantes? (ÉPICA 3)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    Cuando un participante ingresa mediante el enlace único, se
                    ubica en estado pendiente dentro de la sala de espera. El
                    host recibe una alerta interactiva en el panel lateral para
                    aprobar o rechazar la solicitud en tiempo real antes de
                    conceder acceso a la videoconferencia.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-white/10">
                  <AccordionTrigger className="text-xs md:text-sm font-medium text-foreground hover:no-underline">
                    ¿Cómo se gestionan la reconexión y pérdida de señal? (ÉPICA
                    8)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    MeetFlow detecta interrupciones de red automáticamente,
                    muestra un banner con animación pulsante de reconexión
                    temporal y preserva los tokens de sesión de LiveKit para
                    reintegrar al usuario a la llamada sin reiniciar la sesión.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-white/10">
                  <AccordionTrigger className="text-xs md:text-sm font-medium text-foreground hover:no-underline">
                    ¿Qué roles y permisos están habilitados en la plataforma?
                    (ÉPICA 4)
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    El Host posee permisos exclusivos de administración:
                    silenciar a todos, expulsar participantes, iniciar grabación
                    y finalizar la reunión para toda la sala. Los participantes
                    pueden controlar su propio micrófono, cámara, chat y
                    solicitar compartir pantalla.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Tarjeta de Métricas / Progreso Circular */}
          <Card className="bg-card border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-white">
                Objetivo Semanal
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Horas de videollamadas colaborativas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              {/* Medidor circular SVG */}
              <div className="relative size-36 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="50.24"
                    strokeLinecap="round"
                    className="text-blue-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold text-white tracking-tight">
                    80%
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    48h de 60h
                  </span>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                +12% respecto a la semana anterior
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="w-full flex items-center justify-between text-xs text-muted-foreground bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                <span>Participantes activos:</span>
                <span className="font-semibold text-foreground">
                  124 miembros
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
