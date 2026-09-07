# S08-26-equipo-2
# MeetFlow
 
> Plataforma propia de videoconferencia, comunicación y colaboración remota en tiempo real.
 
**Estado del proyecto:** En fase inicial de planificación — aún no se ha comenzado el desarrollo.
 
---
 
## Descripción
 
MeetFlow nace de la necesidad de una organización de contar con una **solución propia** para realizar reuniones de video, sesiones internas y encuentros con clientes, sin depender de herramientas externas.
 
El sistema debe permitir que distintos participantes se conecten de manera remota desde diferentes dispositivos y ubicaciones, gestionando todo el ciclo de una reunión: desde la creación de la sala hasta el historial final.
 
Cada reunión involucra múltiples roles y estados:
 
- Un **anfitrión (host)** crea la sala y comparte un enlace.
- Los **participantes** solicitan ingresar.
- El host **aprueba o rechaza** el acceso.
- Dentro de la reunión, los participantes usan **audio, video, chat y compartición de pantalla**.
El objetivo no es simplemente construir una app de videollamadas, sino una **plataforma de comunicación en tiempo real** que administre correctamente permisos, estados de conexión y todos los componentes de la reunión.
 
## Problema / Dolor del negocio
 
El uso de herramientas externas y fragmentadas para gestionar reuniones genera varios problemas:
 
- **Gestión fragmentada:** la creación de salas, invitaciones y accesos depende de distintas plataformas externas, sin un flujo integrado.
- **Complejidad de la comunicación en tiempo real:** hay que sincronizar audio, video, conexiones/desconexiones/reconexiones, estado de participantes, permisos y compartición de pantalla entre todos los usuarios.
- **Problemas de conexión:** la calidad de red varía por participante; el sistema debe detectar inestabilidad, desconexiones y reconexiones sin perder el contexto de la reunión.
- **Control de acceso limitado:** sin gestión centralizada, es difícil saber quién puede ingresar, quién espera, quién fue aprobado o rechazado.
- **Falta de trazabilidad:** no existe un historial organizado de reuniones, participantes, fechas, duración y estado.
- **Experiencia no integrada:** creación de la reunión, ingreso de participantes, comunicación y cierre deberían ser parte de un mismo flujo continuo.
## Oportunidad
 
Transformar el proceso actual en un **flujo digital integrado**, donde el estado de la reunión se mantenga consistente durante todo el ciclo:
 
```
Creación de sala → Generación de enlace → Solicitud de ingreso →
Aprobación → Reunión → Comunicación → Reconexión →
Finalización → Historial
```
 
## Criterio de éxito del proyecto
 
El proyecto se considerará exitoso si un usuario puede:
 
1. Crear una reunión y compartir el enlace.
2. Permitir el ingreso controlado de participantes.
3. Desarrollar una sesión de video y audio en tiempo real.
4. Mantener correctamente los permisos, estados de conexión, chat y compartición de pantalla.
5. Conservar la continuidad de la reunión ante cambios o interrupciones de conectividad.
## Entidades y estados principales
 
El sistema gestionará, entre otros, los siguientes elementos:
 
- Salas y enlaces de reunión
- Participantes
- Roles de host y participante
- Estado de micrófono y cámara
- Estado de conexión
- Solicitudes de ingreso
- Compartición de pantalla
- Mensajes de chat
- Agenda de reuniones
- Historial de reuniones
## Roadmap (borrador inicial)
 
- [ ] Definición de arquitectura (señalización, WebRTC, backend, base de datos)
- [ ] Modelado de entidades (salas, usuarios, roles, estados)
- [ ] Creación y gestión de salas/enlaces
- [ ] Flujo de solicitud/aprobación de ingreso
- [ ] Comunicación en tiempo real (audio/video)
- [ ] Chat en tiempo real
- [ ] Compartición de pantalla
- [ ] Manejo de reconexión ante caídas de red
- [ ] Historial y agenda de reuniones
## Stack tecnológico
 
_Por definir._
 
## Cómo empezar
 
_Este proyecto aún no tiene código ni instrucciones de instalación — se agregarán a medida que avance el desarrollo._
 
## Contribuir
 
_Sección pendiente. Se documentará el flujo de contribución cuando el proyecto tenga su primera versión base._
 
## Licencia
 
Este proyecto está bajo la licencia MIT.
 
```
MIT License
 
Copyright (c) 2026 No Country Simulation
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
 
