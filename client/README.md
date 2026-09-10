# MeetFlow — Client

Cliente web para la plataforma de reuniones virtuales **MeetFlow**, desarrollado con **React 19**, **TypeScript**, **Vite**, **TailwindCSS v4**, **LiveKit**, **Zustand** y **TanStack Query**.

---

## 🏛️ Arquitectura: Screaming Architecture (Feature-Driven)

Este proyecto implementa el patrón **Screaming Architecture** (Arquitectura Orientada a Funcionalidades o Dominio).

### ¿Qué es Screaming Architecture?
En una arquitectura tradicional por capas técnicas, la estructura del proyecto solo muestra conceptos de framework (como `components`, `reducers`, `services`), ocultando el propósito del negocio. 

Con **Screaming Architecture**, la estructura de carpetas **"grita" de inmediato qué hace la aplicación** (en nuestro caso: reuniones, videoconferencias, chat, salas de espera, autenticación, etc.). Cada funcionalidad de negocio relevante se encapsula en un módulo autónomo dentro del directorio `src/features/`, facilitando:
- **Alta cohesión y bajo acoplamiento**: Cada módulo contiene todo lo necesario para su funcionamiento.
- **Escalabilidad y mantenibilidad**: Los equipos pueden trabajar en épicas independientes sin colisiones de código.
- **Trazabilidad directa con las Historias de Usuario (Backlog QA)**: Cada carpeta en `features` se mapea directamente con las épicas del proyecto.

---

## 📁 Estructura del Proyecto

```text
client/
├── public/
├── src/
│   ├── assets/              # Recursos estáticos globales (imágenes, iconos, SVGs)
│   ├── components/          # Componentes visuales genéricos y compartidos (UI / Layout)
│   ├── constants/           # Constantes globales, configuración de rutas y entorno
│   ├── features/            # Módulos de dominio (Screaming Architecture)
│   │   ├── agenda/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── connectivity/
│   │   ├── history/
│   │   ├── invitations-access/
│   │   ├── meetings/
│   │   ├── roles-permissions/
│   │   ├── screen-share/
│   │   └── video-conference/
│   ├── hooks/               # Hooks de React genéricos y transversales
│   ├── lib/                 # Configuración de librerías de terceros (QueryClient, utilidades)
│   ├── services/            # Servicios centrales globales (API client base, sockets globales)
│   ├── stores/              # Stores globales de estado con Zustand
│   ├── tests/               # Pruebas generales, integración global y setup transversal (con .gitkeep)
│   ├── types/               # Tipos e interfaces globales de TypeScript
│   ├── views/               # Páginas o vistas principales de la aplicación
│   ├── App.tsx              # Componente raíz y orquestador
│   ├── index.css            # Estilos globales con TailwindCSS
│   └── main.tsx             # Punto de entrada de la aplicación
├── package.json
└── vite.config.ts
```

---

## 📂 Carpetas Generales de la Raíz (`src/`)

Estas carpetas alojan elementos transversales o compartidos por múltiples funcionalidades de la aplicación:

| Carpeta | Propósito |
|---|---|
| `assets/` | Recursos gráficos y multimedia globales (logos, íconos, ilustraciones). |
| `components/` | Componentes visuales reutilizables en cualquier parte de la aplicación (ej. componentes base de Shadcn UI como botones, diálogos, layouts generales). |
| `constants/` | Constantes transversales, rutas de navegación, mensajes fijos y configuración general. |
| `features/` | Contenedor principal de los módulos de negocio según Screaming Architecture. |
| `hooks/` | Custom hooks utilitarios y transversales no ligados a una sola funcionalidad (ej. `useWebsocket`, hooks de responsive, debounce). |
| `lib/` | Inicializaciones e integraciones de librerías externas (ej. cliente de TanStack Query, función `cn` para clases de Tailwind). |
| `services/` | Servicios globales y capa base de comunicación externa (cliente HTTP base, manejador general de WebSocket). |
| `stores/` | Stores globales con Zustand para gestionar estado transversal a toda la aplicación. |
| `tests/` | Pruebas de integración global, smoke tests transversales y utilidades compartidas de testing. |
| `types/` | Definiciones globales de TypeScript, modelos compartidos y tipos de utilidad general. |
| `views/` | Vistas / páginas que ensamblan y componen las diferentes features para ser consumidas por el router. |

---

## 🧩 Carpetas Internas en cada Feature (`src/features/<feature>/`)

Cada funcionalidad dentro de `src/features/` actúa como un micro-módulo autónomo. Para mantener la consistencia con la raíz pero delimitar su alcance exclusivamente a esa épica, cada carpeta contiene:

```text
src/features/<feature-name>/
├── components/   # Componentes visuales específicos y exclusivos de esta funcionalidad
├── hooks/        # Custom hooks con la lógica y ciclo de vida propios de la feature
├── services/     # Servicios, endpoints y llamadas a APIs/WebSockets exclusivos de la feature
├── store/        # Estado local o store de Zustand acotado a la funcionalidad
└── types/        # Tipos, interfaces y esquemas TypeScript propios de la funcionalidad
```

### Explicación por Carpeta Interna:
- **`components/`**: Aloja componentes visuales que solo tienen sentido dentro de esta funcionalidad (por ejemplo, el panel de chat en `chat`, el selector de cámara en `video-conference`, o el formulario de login en `auth`).
- **`hooks/`**: Encapsula la lógica de negocio, manejo de eventos y efectos locales de la funcionalidad en hooks de React reutilizables dentro de la feature.
- **`services/`**: Funciones encargadas de interactuar con el backend, endpoints REST, eventos de WebSocket o SDKs (como LiveKit) necesarios para cumplir con la épica.
- **`store/`**: Gestión de estado reactivo local con Zustand (o slices de estado) que solo le competen a esta funcionalidad (ej. estado de los mensajes en chat, cola de espera en invitaciones).
- **`types/`**: Modelos de datos, DTOs, enums e interfaces de TypeScript que definen la estructura de datos utilizada dentro de la feature.

---

## 🗺️ Mapeo de Funcionalidades (Épicas de MeetFlow)

La carpeta `src/features/` está organizada según las **11 Épicas** del Backlog Funcional de MeetFlow:

| Carpeta de Feature | Épica Asociada | Historias de Usuario | Descripción |
|---|---|---|---|
| `auth/` | **ÉPICA 1: Autenticación y acceso** | US-001 a US-003 | Registro de usuario, inicio de sesión y cierre de sesión. |
| `meetings/` | **ÉPICA 2: Gestión de reuniones**<br>**ÉPICA 9: Finalización** | US-004 a US-007<br>US-031 a US-032 | Creación, programación, edición, cancelación, abandono (participante) y finalización de la reunión (host). |
| `invitations-access/` | **ÉPICA 3: Invitaciones y acceso** | US-008 a US-012 | Compartir enlace, solicitud de ingreso, sala de espera, aprobación y rechazo de participantes. |
| `roles-permissions/` | **ÉPICA 4: Roles y permisos** | US-013 a US-015 | Identificación de rol (Host / Participante), administración de participantes y restricción de acciones. |
| `video-conference/` | **ÉPICA 5: Videoconferencia** | US-016 a US-020 | Control de micrófono, cámara y visualización de participantes en sala mediante LiveKit. |
| `chat/` | **ÉPICA 6: Chat** | US-021 a US-023 | Envío, recepción de mensajes e identificación del remitente en tiempo real. |
| `screen-share/` | **ÉPICA 7: Compartición de pantalla** | US-024 a US-026 | Iniciar, detener y visualizar transmisiones de pantalla compartida. |
| `connectivity/` | **ÉPICA 8: Conectividad y reconexión** | US-027 a US-030 | Detección de pérdida de conexión, visualización de estado, reconexión automática y recuperación de sesión. |
| `agenda/` | **ÉPICA 10: Agenda** | US-033 a US-034 | Visualización de reuniones programadas y consulta de próximas reuniones. |
| `history/` | **ÉPICA 11: Historial** | US-035 a US-036 | Consulta de reuniones pasadas y detalle de información histórica (fechas, duración, asistentes). |

> **Nota para Git**: Cada subcarpeta contiene un archivo `.gitkeep` para asegurar que las carpetas vacías sean rastreadas y subidas correctamente al repositorio remoto.

---

## 🧪 Estrategia de Testing

MeetFlow organiza las pruebas automatizadas en dos niveles según **Screaming Architecture**:

1. **Co-localización (Colocation) en `src/`**:
   - **Dónde va**: Las pruebas unitarias y de componentes se colocan **al lado del archivo fuente** que evalúan (ej. `LoginForm.test.tsx` junto a `LoginForm.tsx`, o `useAuth.test.ts` junto a `useAuth.ts`), tanto dentro de `src/features/<feature>/` como en `src/components/`.
   - **Propósito**: Garantizar la autonomía de cada módulo. Si se traslada, refactoriza o elimina una funcionalidad o componente, sus pruebas se mueven o eliminan con él sin dejar código huérfano.

2. **Carpeta General `src/tests/`**:
   - **Dónde va**: En `src/tests/` (inicializada con `.gitkeep`).
   - **Propósito**: Pruebas transversales y globales que no pertenecen a una sola feature (smoke tests de la aplicación completa, pruebas de integración entre múltiples módulos, configuración global de entorno y utilidades de prueba compartidas).

---

## ⚡ Alias de Importación (Path Aliases)

Para evitar rutas relativas complejas (`../../..`) y mantener un código limpio, están configurados los siguientes alias en Vite y TypeScript:

| Alias | Apunta a | Ejemplo de uso |
|---|---|---|
| `@/*` | `src/*` | `import App from "@/App"` |
| `@features/*` | `src/features/*` | `import { useAuth } from "@features/auth/hooks/useAuth"` |
| `@components/*` | `src/components/*` | `import { Button } from "@components/ui/button"` |
| `@hooks/*` | `src/hooks/*` | `import { useWebsocket } from "@hooks/useWebsocket"` |
| `@services/*` | `src/services/*` | `import { socketService } from "@services/websocket"` |
| `@stores/*` | `src/stores/*` | `import { useGlobalStore } from "@stores/useGlobalStore"` |
| `@types/*` | `src/types/*` | `import type { User } from "@types/user"` |
| `@lib/*` | `src/lib/*` | `import { queryClient } from "@lib/queryClient"` |
| `@views/*` | `src/views/*` | `import Home from "@views/Home"` |

---

## 🎨 Sistema de Diseño (Design System — Figma & Shadcn UI)

La interfaz de **MeetFlow** está construida sobre un sistema de diseño oscuro (*Dark Theme*), moderno y envolvente, extraído e inspirado directamente en el prototipo y diseño oficial de **Figma** ([notice-reader-34962570.figma.site](https://notice-reader-34962570.figma.site/)), integrando la suite completa de componentes de **Shadcn UI** con **Tailwind CSS v4**.

### 1. 🌈 Paleta de Colores y Tokens Principales

Los tokens globales residen en `src/index.css` y se mapean automáticamente a través de `@theme inline` de Tailwind v4:

| Token / Variable | Valor HEX / CSS | Uso en la Aplicación |
|---|---|---|
| `--background` | `#060d1f` | Fondo general de la plataforma (azul noche profundo). |
| `--card` / `--popover` | `#0d1730` | Superficies de tarjetas, paneles modales y barras laterales. |
| `--primary` | `#3b82f6` | Acciones principales, botones primarios y enlaces destacados. |
| `--primary-foreground`| `#ffffff` | Texto sobre elementos de color primario. |
| `--secondary` | `#1a2845` | Botones secundarios y elementos de contraste suave. |
| `--muted` | `#111f3a` | Fondos atenuados para elementos inactivos o filas alternadas. |
| `--muted-foreground` | `#64748b` | Texto secundario, subtítulos y placeholders. |
| `--destructive` | `#ef4444` | Acciones críticas (colgar, salir, rechazar participante). |
| `--border` | `rgba(255, 255, 255, 0.08)` | Bordes sutiles y divisores translúcidos. |
| `--input` | `rgba(255, 255, 255, 0.10)` | Bordes y fondos de inputs de texto y selectores. |
| `--ring` | `#3b82f6` | Anillo de foco accesible para teclado en cualquier control. |
| `--radius` | `10px` | Radio de curvatura estándar para tarjetas, inputs y botones. |

---

### 2. 🔤 Tipografía

Se utilizan dos familias tipográficas complementarias cargadas con optimización `preconnect` en `index.html`:

* **`Plus Jakarta Sans`** (`var(--font-heading)`): Diseñada para encabezados (`h1` a `h6`), títulos de reuniones, botones y badges de estado. Proporciona una identidad moderna y geométrica.
* **`Inter`** (`var(--font-sans)`): Fuente de lectura por excelencia para el cuerpo de texto, inputs, mensajes de chat y datos tabulares.

---

### 3. ✨ Clases de Utilidad y Efectos Especiales de Figma

El archivo `src/index.css` incluye utilidades diseñadas específicamente para videollamadas y dashboards:

* **`.glass`**: Efecto *glassmorphism* con desenfoque de fondo (`backdrop-filter: blur(16px)`), borde translúcido y fondo semitransparente. Ideal para modales y paneles flotantes.
* **`.glow-blue`**: Sombra con resplandor azul sutil (`box-shadow: 0 0 20px rgba(59, 130, 246, 0.2)`).
* **`.btn-primary`**: Botón con gradiente fluido de `#3b82f6` a `#2563eb`, hover animado y elevación.
* **`.btn-danger`**: Botón de llamada destructivo con gradiente rojo de `#ef4444` a `#dc2626`.
* **`.control-btn`**: Botón vertical para la barra de control de la sala (micrófono, cámara, pantalla compartida) con estados normal, activo y peligro.
* **`.speaking-ring` & `.speaking`**: Animación de pulso concéntrico (`pulse-ring`) para resaltar en tiempo real al participante que está hablando.
* **`.reconnect-pulse`**: Animación para avisos de pérdida o reconexión de red en vivo.
* **Badges de Estado (`.badge-*`)**: `.badge-blue` (general), `.badge-green` (en vivo / exitosa), `.badge-yellow` (pendiente / advertencia), `.badge-red` (rechazado / desconectado), `.badge-purple` (agenda).

---

## 🚀 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

- `npm run dev` / `pnpm dev`: Inicia el servidor de desarrollo local con Vite.
- `npm run build` / `pnpm build`: Compila TypeScript y genera el bundle de producción en `dist/`.
- `npm run lint` / `pnpm lint`: Ejecuta ESLint para verificar calidad de código.
- `npm run preview` / `pnpm preview`: Previsualiza el bundle de producción localmente.
- `npm run test` / `pnpm test`: Ejecuta Vitest para verificar tests.
- `npm run test:ui` / `pnpm test:ui`: Ejecuta Vitest para verificar tests en modo UI.
- `npm run coverage` / `pnpm coverage`: Ejecuta Vitest para verificar cobertura de tests.
