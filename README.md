# R4 — Portfolio Personal y Profesional

Portfolio de una sola página (landing) para un estudiante de secundaria
técnica en informática: presentación personal, habilidades, experiencia,
proyectos (con CRUD real contra base de datos), objetivos y contacto.
Pensado para una entrega escolar y para seguir usándose después como
página personal real.

> **Contenido provisorio**: los datos de "Nombre Apellido", la bio, los
> proyectos de ejemplo, etc. son placeholders explícitamente marcados
> como tales. Ver [¿Qué falta completar?](#qué-falta-completar-datos-reales).

## Índice

- [Tecnologías](#tecnologías)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Variables de entorno](#variables-de-entorno)
- [Configuración de Supabase](#configuración-de-supabase)
- [Componentes principales](#componentes-principales)
- [Hooks utilizados](#hooks-utilizados)
- [Eventos implementados](#eventos-implementados)
- [Animaciones](#animaciones)
- [CRUD de proyectos](#crud-de-proyectos)
- [Arquitectura del backend](#arquitectura-del-backend)
- [Base de datos y normalización](#base-de-datos-y-normalización)
- [Seguridad](#seguridad)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Problemas conocidos](#problemas-conocidos)
- [Próximos pasos](#próximos-pasos)
- [¿Qué falta completar? (datos reales)](#qué-falta-completar-datos-reales)

## Tecnologías

**Frontend**: React 19 + Vite 6, React Router (modo declarativo), Framer
Motion (animaciones), lucide-react (íconos), CSS Modules + variables CSS
(tema claro/oscuro). Sin TypeScript (a propósito, ver
[`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md)).

**Backend**: Node.js + Express 5, `@supabase/supabase-js` (cliente hacia
la base), Resend (email transaccional opcional).

**Base de datos**: PostgreSQL, provista por Supabase (incluye Auth y
Row Level Security).

**Hosting**: Vercel para el frontend (sitio estático) y para el backend
(función serverless que envuelve la app de Express) — ver
[Despliegue en Vercel](#despliegue-en-vercel).

## Estructura de carpetas

```
R4/
  Front/                     App de React (Vite)
    src/
      assets/                 Recursos estáticos propios
      components/
        common/                Button, Badge, Spinner, Modal genérico, etc.
        layout/                Navbar, Footer, menú móvil, toggle de tema
        sections/              Hero, Sobre mí, Habilidades, Experiencia, Objetivos, Contacto
        projects/              Tarjeta, filtro, modal y sección de Proyectos
        contact/               Formulario de contacto y sus piezas
      pages/                  HomePage, NotFoundPage, páginas de /admin
      hooks/                  useTheme, useProjects, useContactForm, useAuth, etc.
      services/               Llamadas HTTP al backend (una por recurso)
      context/                AuthContext / AuthProvider (sesión admin)
      lib/                    apiClient, validadores, constantes, formateo de fechas
      data/                   Datos provisorios (perfil, objetivos)
      styles/                 Reset, variables de tema, estilos globales, animaciones CSS
    vercel.json                Config de despliegue (SPA fallback)

  Back/                      API (Node.js + Express)
    api/[...path].js           Punto de entrada serverless para Vercel
    src/
      app.js / server.js       App de Express / arranque en local
      config/                  Variables de entorno y cliente de Supabase
      controllers/             Reciben la petición HTTP y arman la respuesta
      services/                Lógica de negocio + consultas a Supabase
      routes/                  Definición de endpoints por recurso
      middleware/               requireAuth, 404, manejo de errores
      validators/               Validación de payloads (proyectos, contacto)
      utils/                    slugify

  database/
    schema.sql                 Creación de tablas, restricciones, índices, RLS
    seed.sql                   Datos de ejemplo provisorios
    README.md                  Paso a paso para configurar Supabase

  docs/
    base-de-datos.md           Diagrama ER, relaciones, normalización, seguridad
    defensa-oral.md            Explicaciones simples para la defensa
    decisiones-tecnicas.md     Decisiones tomadas ante puntos ambiguos de la consigna
```

Cada componente vive en su propio archivo junto a su CSS Module
(`Componente.jsx` + `Componente.module.css`), sin componentes gigantes
ni lógica duplicada entre secciones.

## Requisitos previos

- Node.js 20.14 o superior (probado con esa versión exacta) y npm 10+.
- Una cuenta gratuita de [Supabase](https://supabase.com).
- Opcional: una cuenta de [Resend](https://resend.com) para el envío de
  emails del formulario de contacto.

## Instalación y ejecución local

El frontend y el backend son dos proyectos Node independientes, cada
uno con su propio `package.json` — hace falta instalar y correr ambos.

```bash
# 1) Backend
cd R4/Back
npm install
cp .env.example .env      # completar con los datos de Supabase (ver más abajo)
npm run dev                # http://localhost:3001

# 2) Frontend (en otra terminal)
cd R4/Front
npm install
cp .env.example .env      # el valor por defecto ya apunta a localhost:3001
npm run dev                # http://localhost:5173
```

Con ambos corriendo, `http://localhost:5173` muestra la landing y
`http://localhost:5173/admin/login` el acceso al panel de administración.

Si todavía no se configuró Supabase, el sitio igual carga: las
secciones que dependen de datos (Habilidades, Experiencia, Proyectos)
muestran un estado de error con botón "Reintentar", y el backend
responde `503` de forma explícita en vez de romperse — ver
`Back/src/config/env.js`.

## Variables de entorno

**`Front/.env`** (ver `Front/.env.example`):

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend. En local: `http://localhost:3001`. En producción, si el backend es otro proyecto de Vercel, su URL pública (o vacío si se sirven desde el mismo dominio). |

**`Back/.env`** (ver `Back/.env.example`):

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta de Supabase (Service Role). Nunca va en el frontend. |
| `PORT` | Puerto local del backend (default `3001`). |
| `CLIENT_ORIGIN` | Orígenes permitidos por CORS, separados por coma. |
| `RESEND_API_KEY` | Opcional. Sin esto, el formulario sigue guardando mensajes en Supabase, solo no se envía el email de aviso. |
| `CONTACT_TO_EMAIL` | Opcional. A qué dirección llega el aviso de nuevo mensaje. |
| `CONTACT_FROM_EMAIL` | Opcional. Remitente del email (default el de pruebas de Resend). |

Ninguno de los dos `.env` se sube al repositorio (están en `.gitignore`).

## Configuración de Supabase

Paso a paso completo en [`database/README.md`](database/README.md):
crear el proyecto, correr `database/schema.sql` y `database/seed.sql`,
copiar las credenciales, y crear a mano el único usuario administrador
(no hay registro público).

## Componentes principales

- **`Layout`** (`Front/src/components/layout/Layout.jsx`): estructura
  común de la landing (skip-link + navbar + contenido + footer).
- **`Navbar` / `MobileMenu` / `ThemeToggle`**: navegación responsive con
  indicador de sección activa, menú móvil animado y cambio de tema.
- **Secciones** (`Front/src/components/sections/`): `Hero`, `About`,
  `Skills`, `Experience`, `Goals`, `Contact` — una por cada bloque de la
  landing, cada una con su propio estado de carga/error cuando aplica.
- **`ProjectsSection`** (`Front/src/components/projects/`): trae los
  proyectos, permite filtrarlos por categoría y abre `ProjectModal` con
  el detalle. `ProjectThumbnail` decide si muestra una imagen real o un
  placeholder.
- **`ContactForm`** (`Front/src/components/contact/`): formulario
  controlado con validación y estados de envío.
- **Panel admin** (`Front/src/pages/admin/`): `AdminLoginPage`,
  `AdminDashboardPage`, `ProjectsTable`, `ProjectForm` (alta/edición) y
  `ConfirmDialog` (confirmación de borrado).

## Hooks utilizados

Ver la tabla completa con el "para qué" de cada uno en
[`docs/defensa-oral.md`](docs/defensa-oral.md#qué-es-un-hook). Resumen:
`useState` y `useEffect` de React se usan en prácticamente todos los
componentes con estado o con datos remotos; `useRef` se usa para
guardar el id de un `setTimeout` sin disparar renders
(`AdminDashboardPage.jsx`) y para mover el foco en los diálogos
accesibles (`ProjectModal`, `ConfirmDialog`); el resto son hooks propios
con una responsabilidad puntual cada uno (tema, formulario de contacto,
fetching de cada recurso, sesión de admin).

## Eventos implementados

Click (navegación, cambio de tema, abrir/cerrar modal, filtrar
proyectos, editar/eliminar en el panel admin), submit (contacto,
login, alta/edición de proyecto), change (todos los inputs
controlados) y teclado (Escape cierra el menú móvil y los diálogos,
foco visible en toda la app para navegar sin mouse).

## Animaciones

Con Framer Motion: entrada de secciones al hacer scroll
(`ScrollReveal`), apertura/cierre del menú móvil, del modal de
proyecto y del diálogo de confirmación, transición del ícono de
tema, y salida animada de las tarjetas al filtrar proyectos. Detalle
completo en [`docs/defensa-oral.md`](docs/defensa-oral.md#qué-animaciones-se-usaron).

## CRUD de proyectos

Completo y persistido en Supabase (no hay datos simulados en arrays
locales). Rutas del backend: `GET/POST /api/projects` y
`PUT/DELETE /api/projects/:id`. Las tres últimas requieren sesión de
administrador. Ver [`docs/defensa-oral.md`](docs/defensa-oral.md#qué-es-un-crud)
para el detalle de qué dispara cada operación en la interfaz.

## Arquitectura del backend

Express organizado por capas: `routes` (qué URL existe) →
`controllers` (validan la entrada y arman la respuesta HTTP) →
`services` (hablan con Supabase) — sin lógica de negocio mezclada con
el manejo de HTTP. `Back/src/app.js` exporta la app ya armada; la usan
tanto `server.js` (para correr local con `node`/`nodemon`) como
`api/[...path].js` (para desplegarla como función serverless en
Vercel), sin duplicar código. Detalle de esta decisión en
[`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md).

## Base de datos y normalización

Diagrama entidad-relación, explicación de 1FN/2FN/3FN con ejemplos
concretos de este esquema, y por qué las tecnologías están en su
propia tabla: todo en
[`docs/base-de-datos.md`](docs/base-de-datos.md). El script de
creación está en [`database/schema.sql`](database/schema.sql).

## Seguridad

- Credenciales de Supabase solo en `Back/.env` (nunca en el frontend,
  nunca commiteadas).
- Row Level Security activado en las seis tablas: lectura pública solo
  donde corresponde, escritura solo desde el backend (Service Role Key).
- `contact_messages` sin ninguna política pública: ni lectura ni
  escritura directa, por privacidad de quien escribe.
- Rutas de escritura de proyectos protegidas con `requireAuth`
  (verifica el token de Supabase Auth en cada petición).
- Validación de datos en el backend, independiente de la del frontend.

Detalle completo en
[`docs/base-de-datos.md`](docs/base-de-datos.md#seguridad).

## Despliegue en Vercel

Se despliegan **dos proyectos de Vercel** separados a partir del mismo
repositorio (Root Directory distinto en cada uno):

**Backend** (`Root Directory: R4/Back`):
1. Importar el repo en Vercel con esa Root Directory.
2. Cargar las variables de entorno de `Back/.env.example` en
   Project Settings > Environment Variables.
3. Deploy. Vercel detecta `api/[...path].js` automáticamente y expone
   `https://<tu-backend>.vercel.app/api/...`.

**Frontend** (`Root Directory: R4/Front`):
1. Importar el mismo repo como otro proyecto, con esa Root Directory.
2. Framework preset: Vite. Build command `npm run build`, output `dist`
   (Vercel lo detecta solo).
3. Variable de entorno `VITE_API_URL` = la URL del backend ya desplegado.
4. Deploy.

En el proyecto del backend, agregar la URL final del frontend a
`CLIENT_ORIGIN` para que CORS la permita.

## Problemas conocidos

- Vite 8 (versión más nueva al momento de instalar) usa por defecto un
  bundler experimental (Rolldown) cuyo binding nativo para Windows no
  se resolvía en este entorno; se fijó la versión 6 (estable). Ver
  [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md).
- `@supabase/supabase-js` pide Node ≥ 22. En Node 20 el proceso llega a
  **romper al arrancar** (`createClient()` inicializa su cliente de
  Realtime, que exige WebSocket nativo, disponible recién desde Node
  22) — no se veía en desarrollo porque solo ocurre con credenciales de
  Supabase reales cargadas. Se solucionó sin necesitar Node 22:
  `supabaseClient.js` le pasa la librería `ws` como implementación de
  WebSocket (`realtime: { transport: WebSocket }`), algo seguro porque
  este proyecto no usa Supabase Realtime (no hay suscripciones en
  vivo). Igualmente se recomienda Node 22+ si está disponible.
- El envío de email del formulario de contacto no está activo hasta
  configurar `RESEND_API_KEY` y `CONTACT_TO_EMAIL` (el guardado en la
  base funciona igual sin esas variables).

## Próximos pasos

- Cargar datos reales (ver la sección siguiente).
- Agregar administración de habilidades y experiencia desde `/admin`
  (hoy solo se cargan por SQL).
- Subida de imágenes a Supabase Storage en vez de pegar una URL a mano.
- Tests automatizados (no se pidieron para esta entrega).

## ¿Qué falta completar? (datos reales)

Antes de usar este proyecto como página personal real:

1. **Datos personales**: completar `Front/src/data/profile.js` (nombre,
   rol, bio, email, redes).
2. **Objetivos**: revisar `Front/src/data/goals.js` si querés cambiar
   el enfoque.
3. **Foto de perfil**: reemplazar el avatar de iniciales en `Hero.jsx`
   por una imagen real cuando esté disponible.
4. **Habilidades y experiencia**: editar directamente en la tabla
   `skills`/`experiences` desde el SQL Editor de Supabase (o volver a
   correr un `INSERT` con tus datos).
5. **Proyectos reales**: borrar los de ejemplo y cargar los reales
   desde `/admin` (con sus links de repositorio/demo reales).
6. **Variables de entorno de producción**: `RESEND_API_KEY` y
   `CONTACT_TO_EMAIL` si se quiere recibir el aviso por email.
