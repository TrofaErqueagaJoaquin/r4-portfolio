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

## CRUD de administración: solo proyectos

La consigna pide explícitamente un CRUD de proyectos. `skills` y
`experiences` también viven en Supabase y tienen su endpoint de lectura
pública (`GET /api/skills`, `GET /api/experiences`), pero no tienen
pantalla de administración en esta primera etapa — se cargan por SQL
(`database/seed.sql`) o directo desde el SQL Editor de Supabase. Sumar
una interfaz de administración para esas dos tablas queda anotado como
próximo paso en el `README.md` principal.

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

## Sin subida de imágenes a Supabase Storage

`image_url` es un campo de texto (una URL), no un subida de archivo
binario. Agregar Supabase Storage (bucket, políticas de acceso, subida
desde el formulario) es una funcionalidad real pero no pedida
explícitamente por la consigna, y se documentó como próximo paso en vez
de sumarla "porque se puede".

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
