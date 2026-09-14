# Guía para la defensa oral

Explicaciones simples, con ejemplos y referencias a archivos reales del
proyecto, para poder responder preguntas sobre el R4 sin memorizar
teoría abstracta. La idea es entender el "para qué" de cada cosa.

---

## ¿Qué es React?

Una librería de JavaScript para construir interfaces. En vez de escribir
HTML fijo y andar manipulándolo a mano con `document.getElementById(...)`,
en React se describe **cómo se ve la pantalla según el estado actual**, y
React se encarga de actualizar el HTML real cuando ese estado cambia.

Ejemplo simple: el botón de tema (`Front/src/components/layout/ThemeToggle.jsx`)
no dice "buscá el ícono y cambiale el dibujo". Dice "si el tema es oscuro,
mostrá el sol; si no, la luna" — y React se encarga de redibujar el ícono
correcto solo.

## ¿Qué es un componente?

Una función de JavaScript que devuelve JSX (HTML "aumentado") y se puede
reutilizar. Un componente es una pieza independiente de la interfaz con
una responsabilidad concreta.

Ejemplo: [`Button.jsx`](../Front/src/components/common/Button.jsx) es un
componente. Se usa en más de 15 lugares distintos del proyecto (el hero,
el formulario de contacto, el panel de admin...) y en todos se ve y se
comporta igual, porque es el mismo componente reutilizado con distintas
props (`variant`, `size`, `href`, etc.).

## ¿Qué es un hook?

Una función que empieza con `use` y permite "engancharse" a
funcionalidades de React (estado, efectos secundarios, contexto) desde un
componente de función. Antes de los hooks, eso solo se podía hacer con
clases; los hooks lo simplificaron mucho.

Este proyecto usa hooks nativos de React (`useState`, `useEffect`,
`useRef`, `useContext`) y varios **hooks propios**, cada uno con una
responsabilidad concreta (no se crearon "porque sí"):

| Hook propio | Para qué sirve |
|---|---|
| [`useTheme`](../Front/src/hooks/useTheme.js) | Estado del tema claro/oscuro + persistencia |
| [`useToggle`](../Front/src/hooks/useToggle.js) | Abrir/cerrar (menú móvil, modal) |
| [`useActiveSection`](../Front/src/hooks/useActiveSection.js) | Detectar qué sección está en pantalla (navbar) |
| [`useProjects`](../Front/src/hooks/useProjects.js), `useSkills`, `useExperiences`, `useTechnologies` | Traer datos del backend + loading/error |
| [`useContactForm`](../Front/src/hooks/useContactForm.js) | Estado y validación del formulario de contacto |
| [`useAuth`](../Front/src/hooks/useAuth.js) | Sesión del panel admin |
| [`useLocalStorage`](../Front/src/hooks/useLocalStorage.js) | Guardar un valor en el navegador (lo usan `useTheme` y la sesión admin) |

## ¿Qué hace `useState`?

Guarda un valor que, cuando cambia, hace que el componente se vuelva a
dibujar con el valor nuevo. Ejemplo bien directo: el menú móvil
(`useToggle`, usado en `Navbar.jsx`) guarda `isOpen` (true/false). Al
tocar el botón hamburguesa, `isOpen` pasa a `true` y React vuelve a
dibujar el menú, esta vez visible.

## ¿Qué hace `useEffect`?

Ejecuta código **después** de que el componente se dibujó, y opcionalmente
lo vuelve a ejecutar cuando cambian ciertos valores. Se usa para cosas que
no son "dibujar la interfaz": pedir datos a una API, escuchar el teclado,
sincronizar con `localStorage`.

Ejemplo: en [`useProjects.js`](../Front/src/hooks/useProjects.js), un
`useEffect` llama a `load()` apenas el componente aparece en pantalla,
para traer los proyectos desde el backend. Otro ejemplo:
[`MobileMenu.jsx`](../Front/src/components/layout/MobileMenu.jsx) usa
`useEffect` para escuchar la tecla Escape solo mientras el menú está
abierto, y dejar de escucharla cuando se cierra (la función que devuelve
el `useEffect` es la "limpieza").

## ¿Cómo funciona el formulario de contacto?

1. [`ContactForm.jsx`](../Front/src/components/contact/ContactForm.jsx)
   usa el hook `useContactForm`, que guarda los valores de cada campo en
   estado (`useState`) y los actualiza en cada tecla (`onChange`).
2. Al enviar (`onSubmit`), se valida todo en el navegador primero
   ([`validators.js`](../Front/src/lib/validators.js)): si falta algo o
   está mal, se muestra el error debajo del campo y no se envía nada.
3. Si pasa la validación, se llama a `contactService.send(...)`, que le
   hace un `POST /api/contact` al backend.
4. El backend **vuelve a validar** los datos (nunca se confía en lo que
   manda el navegador), guarda el mensaje en la tabla `contact_messages`
   de Supabase, e intenta mandar un email de aviso (si está configurado).
5. El formulario muestra un mensaje de éxito o de error según la
   respuesta, y si salió bien, limpia los campos.

## ¿Cómo se conecta React con el backend?

React nunca habla directo con la base de datos. Todas las peticiones
pasan por [`apiClient.js`](../Front/src/lib/apiClient.js), que es un
envoltorio sobre `fetch`. Cada "servicio" (`projectsService.js`,
`contactService.js`, etc., en `Front/src/services/`) usa ese cliente para
pedirle algo puntual al backend, por ejemplo:

```js
// projectsService.js
getAll: () => apiClient.get('/api/projects')
```

Eso dispara un `GET` HTTP a `VITE_API_URL + /api/projects`. El backend
responde con JSON, y un hook (`useProjects`) guarda ese JSON en estado
para que el componente lo muestre.

## ¿Cómo se conecta el backend con Supabase?

El backend (Express) tiene un único cliente de Supabase
([`supabaseClient.js`](../Back/src/config/supabaseClient.js)), creado con
la **Service Role Key** (la clave secreta, que nunca sale del backend).
Cada "service" del backend (`Back/src/services/*.js`) usa ese cliente
para hacer consultas SQL sin escribir SQL a mano — Supabase ofrece un
cliente JavaScript que arma la consulta:

```js
// projects.service.js
const { data, error } = await supabase.from('projects').select('*')
```

Eso es, en el fondo, un `SELECT * FROM projects`. El flujo completo para
"ver los proyectos" es: **React pide `/api/projects` → Express recibe la
petición → el service le pregunta a Supabase → Supabase consulta
PostgreSQL → la respuesta vuelve por la misma cadena hasta la pantalla**.

## ¿Qué es un CRUD?

Las cuatro operaciones básicas sobre un dato: **C**rear, **R**eer (leer),
**U**pdate (actualizar) y **D**elete (borrar). En este proyecto, el CRUD
completo existe para **proyectos**:

| Operación | Ruta del backend | Dónde se dispara en el frontend |
|---|---|---|
| Crear | `POST /api/projects` | Botón "Nuevo proyecto" en `/admin` |
| Leer | `GET /api/projects` | Sección "Proyectos" de la landing y la tabla de `/admin` |
| Actualizar | `PUT /api/projects/:id` | Botón de lápiz en la tabla de `/admin` |
| Eliminar | `DELETE /api/projects/:id` | Botón de tacho, con confirmación |

Crear/actualizar/eliminar están protegidos: exigen estar logueado (ver
más abajo). Leer es público, porque es lo que ve cualquier visitante.

## ¿Cómo funcionan las relaciones entre tablas?

Un proyecto puede tener varias tecnologías, y una tecnología (por
ejemplo "React") la pueden usar varios proyectos. Eso es una relación
**muchos a muchos**, y en una base relacional se resuelve con una tabla
intermedia: `project_technologies`. Cada fila de esa tabla dice
"el proyecto X usa la tecnología Y". Para traer un proyecto con sus
tecnologías, se le pide a Supabase que junte las tres tablas en una sola
consulta (ver `PROJECT_SELECT` en
[`projects.service.js`](../Back/src/services/projects.service.js)).

## ¿Qué significa normalizar una base de datos?

Organizar las tablas para no repetir información y evitar
inconsistencias. El ejemplo más claro de este proyecto: en vez de una
columna `projects.technologies` con texto tipo `"React, Node.js"` (que
sería difícil de consultar y fácil de escribir mal), cada tecnología
existe una sola vez en la tabla `technologies`, y se referencia por id.
El detalle completo (1FN, 2FN, 3FN con ejemplos) está en
[`docs/base-de-datos.md`](./base-de-datos.md).

## ¿Qué animaciones se usaron?

Con la librería **Framer Motion**. Algunos ejemplos concretos:

- Las secciones aparecen con un fade + desplazamiento hacia arriba
  cuando entran en pantalla al hacer scroll (`ScrollReveal.jsx`,
  usa la prop `whileInView` de Framer Motion).
- El menú móvil se despliega con una animación de alto (`MobileMenu.jsx`).
- El modal de detalle de un proyecto aparece con fade + escala
  (`ProjectModal.jsx`), igual que el diálogo de confirmación antes de
  borrar (`ConfirmDialog.jsx`).
- El ícono de sol/luna rota al cambiar de tema (`ThemeToggle.jsx`).
- Las tarjetas de proyecto tienen una salida animada cuando se filtran
  por categoría (`AnimatePresence` en `ProjectsSection.jsx`).

## ¿Cómo funciona el modo claro/oscuro?

Toda la paleta de colores está definida como **variables CSS**
(`Front/src/styles/variables.css`): una vez con los valores del tema
claro y otra vez, bajo el selector `[data-theme='dark']`, con los
valores oscuros. El resto del CSS del proyecto usa esas variables
(`var(--color-bg)`, etc.) en vez de colores fijos.

Cambiar de tema es, en el fondo, cambiar un atributo:
`document.documentElement.setAttribute('data-theme', 'dark')`. Eso lo
hace el hook `useTheme`, que además:

- Guarda la elección en `localStorage` para que se mantenga al recargar.
- Si no hay una elección guardada, respeta `prefers-color-scheme` del
  sistema operativo.
- Un script chico en `index.html` fija el tema **antes** de que React
  cargue, para que no se vea un flash del tema equivocado al abrir la
  página.

## ¿Cómo se protege la administración?

El panel `/admin` usa **Supabase Auth**. El flujo es:

1. En `/admin/login`, el email y la contraseña se mandan a
   `POST /api/auth/login`.
2. El backend le pide a Supabase que valide esas credenciales
   (`supabase.auth.signInWithPassword`). Si son correctas, Supabase
   devuelve un **token** de sesión.
3. El frontend guarda ese token (`AuthProvider.jsx`) y lo manda como
   header `Authorization: Bearer <token>` en cada pedido de
   crear/editar/eliminar un proyecto.
4. El backend, antes de tocar la base, revisa ese token con
   `supabase.auth.getUser(token)` en un middleware
   ([`requireAuth.js`](../Back/src/middleware/requireAuth.js)). Si no es
   válido, responde 401 y no ejecuta nada.

No existe un registro público de usuarios: el único usuario admin se
crea a mano desde el dashboard de Supabase (ver
`database/README.md`), así que "estar logueado" y "ser el
administrador" son, en este proyecto, la misma cosa.
