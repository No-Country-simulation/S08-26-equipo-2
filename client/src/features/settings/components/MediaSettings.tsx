import {
  Mic,
  MicOff,
  Volume2,
  Camera,
  CameraOff,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaDevices } from "../hooks/useMediaDevices";

export function MediaSettings() {
  const {
    permissionState,
    errorMessage,
    requestPermissions,
    microphones,
    speakers,
    cameras,
    selectedMic,
    setSelectedMic,
    selectedSpeaker,
    setSelectedSpeaker,
    selectedCamera,
    setSelectedCamera,
    audioLevel,
    isCameraActive,
    setIsCameraActive,
    isMicActive,
    setIsMicActive,
    videoRef,
    playTestSound,
    isPlayingTestSound,
  } = useMediaDevices();

  return (
    <div className="max-w-xl space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Audio y video
          </h2>
        </div>

        {permissionState === "granted" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
          </span>
        )}
      </div>

      {/* Alerta de permisos si no están otorgados o hay error */}
      {permissionState === "denied" && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/10 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs space-y-1">
              <p className="font-semibold text-amber-200">Permisos multimedia requeridos</p>
              <p className="text-amber-300/80">
                {errorMessage ||
                  "Para poder detectar tus micrófonos y cámaras reales, habilita los permisos en la configuración de tu navegador."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={requestPermissions}
                className="mt-2 text-xs h-7 border-amber-500/40 text-amber-200 hover:bg-amber-500/20"
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Reintentar permisos
              </Button>
            </div>
          </div>
        </Card>
      )}

      {permissionState === "requesting" && (
        <Card className="p-3 border-border bg-card/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>Detectando dispositivos de audio y video disponibles...</span>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {/* Vista previa y selección de Cámara */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-primary" /> Cámara web
            </Label>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setIsCameraActive(!isCameraActive)}
              className="h-7 px-2.5 text-[11px] bg-card border-border/80 text-foreground hover:bg-muted transition-colors shadow-xs"
            >
              {isCameraActive ? (
                <>
                  <CameraOff className="w-3 h-3 mr-1.5 text-rose-400" /> Desactivar vista previa
                </>
              ) : (
                <>
                  <Camera className="w-3 h-3 mr-1.5 text-muted-foreground" /> Activar vista previa
                </>
              )}
            </Button>
          </div>

          <Select
            items={cameras}
            value={selectedCamera}
            onValueChange={(val) => val && setSelectedCamera(val)}
          >
            <SelectTrigger className="w-full h-10 bg-card border-border">
              <SelectValue placeholder={cameras.length > 0 ? "Selecciona una cámara" : "No se encontraron cámaras"} />
            </SelectTrigger>
            <SelectContent>
              {cameras.map((cam) => (
                <SelectItem key={cam.value} value={cam.value}>
                  {cam.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Cuadro de Video en Vivo */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-black/60 shadow-inner flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${
                isCameraActive ? "opacity-100" : "opacity-0 absolute"
              }`}
            />

            {!isCameraActive && (
              <div className="flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-secondary/40 flex items-center justify-center">
                  <CameraOff className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-xs font-medium">La vista previa de la cámara está desactivada</p>
                <p className="text-[11px] text-muted-foreground/70 max-w-xs">
                  Haz clic en Activar vista previa para comprobar cómo se verá tu imagen antes de iniciar llamadas.
                </p>
              </div>
            )}

            {isCameraActive && (
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>En vivo</span>
              </div>
            )}
          </div>
        </div>

        {/* Micrófono y Nivel de Audio */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-primary" /> Micrófono
            </Label>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setIsMicActive(!isMicActive)}
              className="h-7 px-2.5 text-[11px] bg-card border-border/80 text-foreground hover:bg-muted transition-colors shadow-xs"
            >
              {isMicActive ? (
                <>
                  <MicOff className="w-3 h-3 mr-1.5 text-rose-400" /> Silenciar prueba
                </>
              ) : (
                <>
                  <Mic className="w-3 h-3 mr-1.5 text-muted-foreground" /> Activar prueba
                </>
              )}
            </Button>
          </div>

          <Select
            items={microphones}
            value={selectedMic}
            onValueChange={(val) => val && setSelectedMic(val)}
          >
            <SelectTrigger className="w-full h-10 bg-card border-border">
              <SelectValue placeholder={microphones.length > 0 ? "Selecciona un micrófono" : "No se encontraron micrófonos"} />
            </SelectTrigger>
            <SelectContent>
              {microphones.map((mic) => (
                <SelectItem key={mic.value} value={mic.value}>
                  {mic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Medidor reactivo de volumen en tiempo real */}
          <Card className="p-4 border-border bg-card shadow-sm">
            <CardContent className="p-0 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Nivel de entrada</span>
                  {isMicActive && audioLevel > 5 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <span className="text-muted-foreground">
                  {!isMicActive
                    ? "Micrófono en pausa"
                    : audioLevel > 5
                    ? "Detectando voz..."
                    : "Habla para probar"}
                </span>
              </div>

              <div className="h-2.5 rounded-full bg-secondary/50 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-75 ease-out"
                  style={{
                    width: isMicActive ? `${audioLevel}%` : "0%",
                    background:
                      audioLevel > 80
                        ? "linear-gradient(90deg, #3b82f6, #eab308, #ef4444)"
                        : "linear-gradient(90deg, #3b82f6, #60a5fa)",
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground/60 px-0.5">
                <span>Silencio</span>
                <span>Óptimo</span>
                <span>Saturado</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Altavoces y Test de Sonido */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-primary" /> Altavoces / Salida de audio
          </Label>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                items={speakers}
                value={selectedSpeaker}
                onValueChange={(val) => val && setSelectedSpeaker(val)}
              >
                <SelectTrigger className="w-full h-10 bg-card border-border">
                  <SelectValue placeholder={speakers.length > 0 ? "Selecciona un altavoz" : "Altavoces del sistema"} />
                </SelectTrigger>
                <SelectContent>
                  {speakers.map((spk) => (
                    <SelectItem key={spk.value} value={spk.value}>
                      {spk.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={playTestSound}
              disabled={isPlayingTestSound}
              className="h-10 px-3 bg-card border-border text-xs shrink-0 hover:bg-secondary"
            >
              <Play
                className={`w-3.5 h-3.5 mr-1.5 ${
                  isPlayingTestSound ? "text-primary animate-bounce" : "text-primary"
                }`}
              />
              {isPlayingTestSound ? "Reproduciendo..." : "Probar sonido"}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Al pulsar en Probar sonido se reproducirá una secuencia armónica para verificar el volumen y la salida.
          </p>
        </div>
      </div>
    </div>
  );
}
