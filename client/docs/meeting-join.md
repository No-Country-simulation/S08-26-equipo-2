# Ingreso mediante enlace

El cliente abre `/meet/:id`, conserva la ruta durante el inicio de sesión y muestra la sala previa existente. Conserva las restricciones de horario y aprobación del anfitrión. No se habilitó ingreso anónimo.

Al pulsar Entrar, solicita `POST /livekit/token` (bajo el prefijo `/api`) con cuerpo `{ "meetingId": "id de la reunión" }` con el Bearer de MeetFlow mediante el cliente Axios existente. Contrato verificado en el Swagger de Render y en `feature/backend-livekit`. Está disponible en la API desplegada, aunque el backend básico de este checkout y `develop` no lo contienen.

Respuesta esperada:

```json
{
  "url": "wss://tu-proyecto.livekit.cloud",
  "token": "JWT de participante generado por el servidor",
  "room": "meeting_codigo",
  "identity": "id del usuario"
}
```

Si se omite url, el cliente utiliza VITE_LIVEKIT_URL. El token se mantiene en memoria. No se coloca en el enlace compartido ni en almacenamiento persistente.

El backend debe validar la sesión, existencia y estado de la reunión, horario y autorización del participante antes de emitir un token limitado a esa sala. La identidad debe corresponder al usuario autenticado. Las credenciales de firma de LiveKit permanecen exclusivamente en el servidor. El token de sesión de MeetFlow no sustituye al token LiveKit.

Respuestas previstas: 401 sesión inválida; 403 sin admisión; 404 reunión inexistente; 409/410 reunión no disponible. El cliente ya utiliza este contrato. Falta verificar una llamada real con dos participantes autorizados.

La ruta `/livekit` mantiene el formulario manual de diagnóstico. El flujo normal compartido usa `/meet/:id` y no pide URL de servidor ni token. Compartir localhost solo funciona en la misma computadora; para otros dispositivos se necesita una dirección accesible y HTTPS para los dispositivos multimedia.
