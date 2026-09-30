# S08-26-equipo-2
### MeetFlow

> Plataforma integral de videoconferencia, colaboracion remota y gestion de reuniones en tiempo real.

---

## Descripcion

MeetFlow nace de la necesidad de una organizacion de contar con una **solucion propia** para realizar reuniones de video, sesiones internas y encuentros con clientes, sin depender de herramientas externas.

El sistema permite que distintos participantes se conecten de manera remota desde diferentes dispositivos y ubicaciones, gestionando de forma integral todo el ciclo de una reunion: desde la creacion de la sala hasta el historial final.

Cada reunion involucra multiples roles y estados:
- Un **anfitrion (host)** crea la sala y comparte un enlace.
- Los **participantes** solicitan ingresar.
- El host **aprueba o rechaza** el acceso.
- Dentro de la reunion, los participantes usan **audio, video, chat y comparticion de pantalla**.

El objetivo no es simplemente construir una app de videollamadas, sino una **plataforma de comunicacion en tiempo real** que administre de manera confiable permisos, estados de conexion y todos los componentes de la reunion.

La solucion esta construida como un monorepositorio que separa claramente la interfaz de usuario en el cliente (`client/`) y los servicios de negocio, base de datos y senalizacion en el servidor (`backend/`).

---

## Problema / Dolor del Negocio

El uso de herramientas externas y fragmentadas para gestionar reuniones genera varios problemas:

- **Gestion fragmentada:** la creacion de salas, invitaciones y accesos depende de distintas plataformas externas, sin un flujo integrado.
- **Complejidad de la comunicacion en tiempo real:** necesidad de sincronizar audio, video, conexiones, desconexiones, reconexiones, estado de participantes, permisos y comparticion de pantalla entre todos los usuarios.
- **Problemas de conexion:** la calidad de red varia por participante; el sistema debe detectar inestabilidad, desconexiones y reconexiones sin perder el contexto de la reunion.
- **Control de acceso limitado:** sin gestion centralizada, resulta complejo auditar quien puede ingresar, quien espera, quien fue aprobado o rechazado.
- **Falta de trazabilidad:** ausencia de un historial organizado de reuniones, participantes, fechas, duracion y mensajes.
- **Experiencia no integrada:** creacion de la reunion, ingreso de participantes, comunicacion y cierre deben formar parte de un mismo flujo continuo.

---

## Oportunidad

Transformar el proceso tradicional en un **flujo digital integrado**, donde el estado de la reunion se mantenga consistente durante todo el ciclo:

```text
Creacion de sala -> Generacion de enlace -> Solicitud de ingreso -> Aprobacion -> Reunion en vivo -> Reconexion -> Finalizacion -> Historial y Chat
```

---

## Caracteristicas Principales

### 1. Autenticacion y Perfiles de Usuario
- Registro de nuevos usuarios y autenticacion mediante tokens JWT.
- Renovacion automatica de credenciales y proteccion de rutas.
- Gestion y actualizacion de datos de perfil.

### 2. Gestion de Reuniones
- Creacion y programacion de reuniones con fecha, hora, duracion y descripcion.
- Generacion de enlaces unicos de acceso e invitacion.
- Cancelacion de reuniones programadas por parte del anfitrion.
- Edicion de informacion basica de reuniones.

### 3. Sala de Espera y Control de Acceso (Access Requests)
- Sistema de control de ingreso para participantes no pre-autorizados.
- Aprobacion o rechazo de solicitudes en tiempo real por parte del anfitrion.
- Gestion de cola de espera tanto en la antesala como durante la llamada activa.

### 4. Videoconferencia en Tiempo Real
- Transmision de audio y video de alta definicion mediante LiveKit (WebRTC).
- Controles de silencio de microfono y apagado/encendido de camara.
- Comparticion de pantalla en alta resolucion.
- Diseno dinamico con deteccion automatica del orador principal y cuadricula adaptable.
- Temporizador con alertas visuales de tiempo limite (aviso preventivo a los 5 minutos y conteo en el ultimo minuto).
- Opcion para el anfitrion de salir individualmente o finalizar la reunion para todos.

### 5. Chat en Tiempo Real
- Envio y recepcion instantanea de mensajes durante la sesion mediante WebSockets (Socket.io).
- Contador de mensajes no leidos en el panel de control.
- Persistencia de mensajes en base de datos para consulta posterior.

### 6. Conectividad Resiliente
- Deteccion reactiva del estado de red (En vivo, Reconectando, Conectando).
- Reconexion automatica ante microcortes mediante reinicios ICE de WebRTC sin recargar la pagina.
- Preservacion de admision y roles tras reconexiones o refrescos del navegador.

### 7. Roles y Permisos
- Segregacion estricta de capacidades entre Anfitrion (Host) y Participantes.
- Distintivos visuales de rol en el listado de personas, chat e historial.
- Restriccion en frontend y backend de acciones sensibles (cierre global, admisiones, cancelaciones).

### 8. Agenda e Historial
- Visualizacion en vista mensual y semanal de reuniones programadas.
- Historial detallado con registro de participantes, duracion y transcripcion del chat de sesiones concluidas.

---

## Arquitectura y Stack Tecnologico

### Diagrama de Arquitectura

```mermaid
flowchart LR
  subgraph Cliente["Client (React + Vite)"]
    UI[Interfaz de usuario]
    LK[livekit-client]
    SC[socket.io-client]
  end

  subgraph Backend["Backend (NestJS)"]
    API[API REST + JWT]
    WS[Gateway Socket.io<br/>Chat y solicitudes]
    LKM[Modulo LiveKit<br/>Tokens y webhooks]
    PR[Prisma ORM]
  end

  DB[(PostgreSQL<br/>Supabase)]
  LKS[LiveKit Server<br/>WebRTC]

  UI -->|HTTP + JWT| API
  SC -->|WebSocket| WS
  LK -->|Audio / Video / Pantalla| LKS

  API --> PR
  WS --> PR
  PR --> DB

  API --> LKM
  LKM -->|Genera token de acceso| LKS
  LKS -->|Webhooks de eventos| LKM
```

### Frontend (`client/`)
- **Lenguaje y Entorno:** TypeScript, React 18, Vite.
- **Estilos y Componentes:** Tailwind CSS, Shadcn UI, Radix UI Primitives, Lucide Icons.
- **Gestion de Estado y Consultas:** TanStack Query (React Query), Zustand.
- **Medios en Tiempo Real:** `@livekit/components-react`, `livekit-client`.
- **Comunicacion por Sockets:** `socket.io-client`.
- **Formularios y Validacion:** React Hook Form, Zod.

### Backend (`backend/`)
- **Framework:** NestJS 10, Node.js, TypeScript.
- **Persistencia y ORM:** Prisma ORM conectado a PostgreSQL (Supabase).
- **WebRTC y Media Server:** `livekit-server-sdk`.
- **WebSockets:** `@nestjs/websockets`, `@nestjs/platform-socket.io`.
- **Seguridad y Criptografia:** Passport JWT, Bcrypt.
- **Documentacion API:** OpenAPI con Swagger (`@nestjs/swagger`).
- **Validacion:** `class-validator`, `class-transformer`.

---

## Estructura del Repositorio

```text
S08-26-equipo-2/
|-- backend/                       # Servidor NestJS y logica de negocio
|   |-- prisma/
|   |   `-- schema.prisma          # Definicion del modelo relacional
|   |-- src/
|   |   |-- access-requests/       # Modulo de solicitudes de acceso
|   |   |-- auth/                  # Modulo de autenticacion y JWT
|   |   |-- chat/                  # Gateway WebSocket y servicio de mensajes
|   |   |-- livekit/               # Generacion de tokens y webhooks LiveKit
|   |   |-- meetings/              # CRUD de reuniones, agenda e historial
|   |   |-- prisma/                # Servicio centralizado de base de datos
|   |   |-- rooms/                 # Entidades y logica de salas
|   |   `-- users/                 # Entidades y administracion de usuarios
|   `-- package.json
|
|-- client/                        # Aplicacion web en React + Vite
|   |-- src/
|   |   |-- components/            # Componentes globales y UI compartida
|   |   |-- features/
|   |   |   |-- agenda/            # Calendario semanal y mensual
|   |   |   |-- auth/              # Formularios y contexto de autenticacion
|   |   |   |-- chat/              # Panel de chat y hooks de mensajeria
|   |   |   |-- history/           # Vistas de historial y detalles de llamada
|   |   |   |-- invitations-access/# Sala de espera y listas de solicitudes
|   |   |   |-- meetings/          # Formularios, tablas y hooks de reuniones
|   |   |   `-- settings/          # Configuracion de perfil de usuario
|   |   |-- views/                 # Pantallas principales y sala LiveKit
|   |   `-- App.tsx
|   `-- package.json
|
`-- README.md
```

---

## Requisitos Previos

- **Node.js:** Version 18.x o superior.
- **Gestores de Paquetes:** `pnpm` (recomendado para backend) y `npm` (utilizado en cliente).
- **Base de Datos:** Instancia de PostgreSQL (local o proveida por Supabase).
- **Servidor LiveKit:** Cuenta activa en LiveKit Cloud o servidor LiveKit auto-hospedado.

---

## Guia de Instalacion y Puesta en Marcha

### 1. Clonar el Repositorio
```bash
git clone https://github.com/No-Country-simulation/S08-26-equipo-2.git
cd S08-26-equipo-2
```

### 2. Configuracion del Backend

1. Navegar a la carpeta del servidor:
   ```bash
   cd backend
   ```
2. Instalar dependencias:
   ```bash
   pnpm install
   ```
3. Crear el archivo de variables de entorno `.env` basandose en `.env.example`:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db"
   DIRECT_URL="postgresql://usuario:password@host:5432/nombre_db"
   JWT_SECRET="clave_secreta_jwt"
   JWT_EXPIRES_IN="7d"
   LIVEKIT_URL="wss://tu-servidor-livekit.cloud"
   LIVEKIT_API_KEY="tu_api_key"
   LIVEKIT_API_SECRET="tu_api_secret"
   FRONTEND_URL="http://localhost:5173"
   ```
4. Generar el cliente de Prisma y aplicar migraciones:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```
5. Iniciar el servidor en modo desarrollo:
   ```bash
   pnpm run start:dev
   ```
   La API quedara disponible en `http://localhost:3000`.
   La documentacion interactiva de Swagger estara disponible en `http://localhost:3000/api/docs`.

### 3. Configuracion del Frontend

1. Abrir una nueva terminal y navegar a la carpeta del cliente:
   ```bash
   cd client
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear el archivo `.env` en la raiz de `client/`:
   ```env
   VITE_API_URL="http://localhost:3000"
   VITE_LIVEKIT_URL="wss://tu-servidor-livekit.cloud"
   ```
4. Iniciar el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
   La aplicacion estara accesible en `http://localhost:5173`.

---

## Documentacion de la API (Swagger)

Una vez iniciado el backend, se puede acceder a la especificacion interactiva OpenAPI en:
- Ruta: `http://localhost:3000/api/docs`

Permite probar y consultar los esquemas de:
- Autenticacion (`/auth/register`, `/auth/login`, `/auth/refresh`).
- Reuniones (`/meetings`, `/meetings/agenda`, `/meetings/history`, `/meetings/:id/link`).
- Solicitudes de acceso (`/meetings/:id/access-requests`).
- Emision de credenciales LiveKit (`/livekit/token`).
- Historial de chat (`/meetings/:id/chat/messages`).

---

## Licencia

Este proyecto se distribuye bajo los terminos de la licencia MIT. Consulta el archivo de licencia para mayor detalle.
