# Decisiones técnicas

La consigna de R4 deja varios puntos abiertos a criterio de
implementación. Este documento explica qué se decidió en cada caso y
por qué, para poder defenderlo oralmente si se pregunta "¿por qué lo
hiciste así y no de otra forma?".

## Estructura de carpetas: `Front/` y `Back/` separados

El resto del repositorio (`R1/`) ya usa la convención de una carpeta
`Front/` por proyecto, y su README aclara que un ejercicio que necesite
persistencia sumaría una carpeta `Back/` al lado. Se mantuvo esa misma
convención en `R4/` en vez de inventar una estructura nueva (por ejemplo,
un único `package.json` en la raíz con todo junto), para que el
repositorio completo se vea coherente entre entregas.

## Un repositorio Git propio para R4

Se inicializó Git dentro de `R4/` (no en la raíz del repositorio de
ejercicios) para que el proyecto sea autocontenido y se pueda subir a su
propio repositorio de GitHub y desplegar en Vercel de forma
independiente, sin mezclarlo con los ejercicios de R1.

## Estilos: CSS Modules, sin librería de UI

Se usaron archivos `Componente.module.css` en vez de Tailwind o una
librería de componentes (Material UI, Chakra, etc.). Motivo: la consigna
pide "CSS modular o una solución de estilos mantenible" sin exigir una
librería puntual, y CSS Modules no agrega dependencias nuevas, es más
fácil de explicar en la defensa oral ("cada componente tiene su propio
CSS, con nombres de clase que no chocan entre sí") y da control total
sobre el diseño visual pedido (oscuro, moderno, no genérico).

## Animaciones: Framer Motion

Se usó por ser la opción sugerida explícitamente en la consigna si no
hay una razón técnica para otra. Se aplicó en las secciones (entrada al
hacer scroll), el menú móvil, el modal de proyecto, el diálogo de
confirmación del panel admin y el ícono de tema.

## Sin foto de perfil ni capturas de proyecto reales

En vez de usar imágenes de stock o inventadas, el Hero muestra un avatar
circular con las iniciales del nombre (`Hero.jsx`), y las tarjetas de
proyecto sin `image_url` muestran un placeholder con degradé + ícono +
categoría (`ProjectThumbnail.jsx`). Ambos se reemplazan solos apenas
haya una foto real o capturas reales: alcanza con completar
`profile.js` o el campo `image_url` de cada proyecto.

## Sin íconos de marca en `lucide-react`

La versión instalada de `lucide-react` ya no incluye íconos de marcas
(`Github`, `Linkedin`, `Instagram` no existen en el paquete). Se
reemplazaron por íconos genéricos equivalentes (`Code2`, `Briefcase`,
`Camera`) manteniendo el nombre real de la red en el `aria-label`, así
que la información para lectores de pantalla no se pierde. Ver
`Footer.jsx` y los links de proyecto en `ProjectCard.jsx`/`ProjectModal.jsx`.

## Vite fijado en la versión 6, no la 8 (más nueva)

Al instalar dependencias, npm resolvió Vite 8, que por defecto usa un
bundler experimental (Rolldown) cuyo binding nativo para Windows no se
pudo resolver en este entorno (`Cannot find module
'@rolldown/binding-win32-x64-msvc'`), lo que rompía `npm run build`. Se
bajó a Vite 6 (basado en Rollup clásico, probado y estable, y ya usado
en otro ejercicio de este mismo repositorio) en vez de perder tiempo
depurando un bundler experimental para un proyecto escolar.

## Un único `package.json` por proyecto (sin monorepo)

`Front/` y `Back/` tienen cada uno su propio `package.json` y
`node_modules`, sin usar npm workspaces ni Lerna/Turborepo. Son dos
aplicaciones Node independientes (una es un sitio estático, la otra una
API), se despliegan por separado, y para un proyecto de este tamaño un
monorepo agregaría complejidad de configuración sin un beneficio real.

## Backend Express reexportado como función serverless

En vez de reescribir la lógica del backend como funciones sueltas de
Vercel, se construyó una app de Express normal (`Back/src/app.js`) que:

- Se ejecuta con `node src/server.js` en desarrollo local (como
  cualquier servidor Express).
- Se reexporta tal cual desde `Back/api/[...path].js` para Vercel, que
  la puede invocar directamente como función serverless porque una app
  de Express ya tiene la firma `(req, res)` que Vercel espera.

Esto evita mantener dos versiones de la misma lógica y cumple con la
consigna ("Node.js + Express" y, a la vez, "una arquitectura de
funciones de servidor, según convenga" — la consigna deja esta
combinación abierta explícitamente).

## Frontend y Supabase nunca se hablan directo

El frontend no incluye ninguna credencial de Supabase, ni siquiera la
`anon key` (que Supabase considera segura para el navegador). Se decidió
que **todas** las operaciones —lectura incluida— pasen por el backend,
para tener una sola forma de acceder a los datos, un único lugar donde
agregar validaciones o lógica futura, y una arquitectura más simple de
explicar: "React solo le habla a la API propia; la API le habla a
Supabase".

## Panel de administración genérico (ABML de todas las tablas)

En la primera etapa solo proyectos tenía pantalla de administración.
Después se pidió ABML de todo, y en vez de copiar el mismo código para
cada tabla se armó un panel **configurable**: `ResourceManager` (tabla,
alta, modificación, baja) y `ResourceForm` (formulario) son genéricos, y
lo específico de cada tabla (columnas, campos, cómo se arma el payload)
es un objeto en `Front/src/pages/admin/adminResources.jsx`. En el backend
pasa lo mismo con `crud.service.js` y `crud.controller.js`. Sumar una
tabla nueva al panel es agregar un objeto de configuración, no escribir
otra pantalla.

El **perfil** (nombre, bio, objetivos) sigue en `Front/src/data/`: es un
solo bloque de texto que casi no cambia, y pasarlo al panel implicaba
tablas y formularios nuevos para algo que se edita muy de vez en cuando.
Quedó como próximo paso.

## Categorías de proyecto: `CHECK` en vez de tabla aparte

`projects.category` usa una restricción `CHECK` con cuatro valores fijos
en vez de una tabla `categories` separada. A diferencia de las
tecnologías (una lista abierta y creciente, reutilizada en una relación
muchos a muchos), las categorías son un conjunto chico y estable que no
necesita atributos propios ni de relacionarse de forma independiente —
una tabla aparte sería sobre-ingeniería para este caso.

## Slug automático, no editable

El `slug` de cada proyecto se genera en el backend a partir del título
al crearlo (`Back/src/utils/slugify.js`) y no se vuelve a calcular si el
título cambia en una edición. Esto evita que la URL/identificador de un
proyecto cambie solo porque se corrigió una palabra del título.

## Subida de imágenes: a Supabase Storage, pasando por el backend

Las imágenes de proyectos se suben desde el panel a un bucket público de
Supabase Storage (`imagenes`) y en `projects.image_url` se guarda su URL.
El archivo viaja al backend en base64 dentro de un JSON (en vez de
`multipart/form-data`) para no sumar una librería de subida de archivos:
el frontend no tiene credenciales de Supabase, así que la subida tiene que
pasar por el backend, que valida formato (JPG/PNG/WEBP/GIF) y tamaño
(3 MB, por el límite de ~4.5 MB por pedido de Vercel).

## URL del backend en `Front/.env.production`

La URL pública de la API (`VITE_API_URL`) está versionada en
`Front/.env.production` en vez de cargarse solo en el dashboard de
Vercel. No es un secreto (el navegador la ve en cada pedido) y así el
deploy no depende de acordarse de configurar una variable a mano: eso
fue justamente lo que dejó el sitio sin datos en el primer deploy. Si se
define la variable en Vercel, tiene prioridad sobre el archivo.

## El mail de contacto se espera antes de responder

En Vercel la función se congela apenas envía la respuesta: un envío de
mail "en segundo plano" nunca terminaba (los mensajes se guardaban, pero
ningún aviso llegaba). Ahora `contact.service.js` hace `await` del envío
—con su propio try/catch, para que un fallo del mail no le muestre error
a quien escribió— y `email.service.js` convierte en excepción el error que
el SDK de Resend devuelve sin lanzar.

## Regla de ESLint desactivada a propósito

`react-hooks/set-state-in-effect` (parte del set "recomendado" del
plugin) marca como error el patrón `useEffect(() => { load() }, [load])`
usado para pedir datos al montar un componente — exactamente el patrón
que la consigna pide demostrar con `useState`/`useEffect`. Esa regla
empuja hacia librerías de fetching (React Query, SWR) que serían una
dependencia nueva e innecesaria para este proyecto. Se desactivó de
forma explícita y documentada en `Front/eslint.config.js`, no por
descuido.

## Sin `ThemeContext`

El tema (claro/oscuro) se maneja con el hook `useTheme` llamado
directamente en `ThemeToggle.jsx`, sin un Context. Ningún otro
componente de la app necesita leer el tema actual, así que un Context
sería una capa extra sin un problema real que resolver (no hay
"prop drilling" que evitar). Distinto es el caso de la sesión de
administrador (`AuthContext`), que sí necesitan varios componentes en
puntos distintos del árbol (`ProtectedRoute`, `AdminLoginPage`,
`AdminDashboardPage`) — ahí un Context sí se justifica.
