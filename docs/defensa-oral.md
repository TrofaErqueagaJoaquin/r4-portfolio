# Guía para la defensa oral

Explicaciones simples, con ejemplos y referencias a archivos reales del
proyecto, para poder responder preguntas sobre el R4 sin memorizar
teoría abstracta. La idea es entender el "para qué" de cada cosa.

> **Cómo se carga y modifica cada contenido (paso a paso, desde dónde):**
> está en [`docs/guia-administracion.md`](./guia-administracion.md).
> Al final de este documento hay un **guion para la demo en vivo** y
> **preguntas probables** con su respuesta.

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
| [`useResourceList`](../Front/src/hooks/useResourceList.js) | Traer una lista de la API con su estado (cargando / ok / error) y `reload`. Es uno solo y lo reutilizan la landing y el panel admin |
| `useProjects`, `useSkills`, `useExperiences`, `useTechnologies` | "Atajos" de una línea sobre `useResourceList`, cada uno con su URL |
| [`useTimedMessage`](../Front/src/hooks/useTimedMessage.js) | Avisos de éxito/error del panel que desaparecen solos (usa `useRef` para el temporizador) |
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
envoltorio sobre `fetch`. Los hooks y servicios (`Front/src/hooks/`,
`Front/src/services/`) usan ese cliente para pedirle algo puntual al
backend, por ejemplo:

```js
// hooks/useProjects.js
const loadProjects = () => apiClient.get('/api/projects')
```

Eso dispara un `GET` HTTP a `VITE_API_URL + /api/projects`. El backend
responde con JSON, y el hook (`useProjects`, que usa `useResourceList`)
guarda ese JSON en estado para que el componente lo muestre.

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

## ¿Qué es un CRUD / ABML?

Son las cuatro operaciones básicas sobre un dato. En inglés **CRUD**
(*Create, Read, Update, Delete*); en castellano **ABML**: **A**lta,
**B**aja, **M**odificación y **L**istado. Es lo mismo con otro nombre.

En este proyecto hay ABML completo, desde el panel `/admin`, para
**proyectos, habilidades, experiencia y tecnologías**, y una bandeja para
los **mensajes** del formulario de contacto (esos se listan, se marcan
como leídos/archivados y se borran; el "alta" la hace el visitante).

| Operación | Método HTTP | Ejemplo de ruta | En el panel |
|---|---|---|---|
| Listado | `GET` | `/api/skills` | La tabla de cada pestaña |
| Alta | `POST` | `/api/skills` | Botón "Agregar …" |
| Modificación | `PUT` | `/api/skills/7` | Botón del lápiz |
| Baja | `DELETE` | `/api/skills/7` | Botón del tacho (pide confirmación) |

Lo mismo con `/api/projects`, `/api/experiences` y `/api/technologies`.
Los mensajes usan `/api/messages` (`GET`, `PATCH` para cambiar el estado
y `DELETE`). El listado de proyectos, habilidades, experiencia y
tecnologías es **público** (lo usa la landing); todo lo demás exige estar
logueado.

**¿Cómo se evitó repetir el mismo código cuatro veces?** Con componentes
y funciones **genéricos** que se configuran por recurso:

- Frontend: [`ResourceManager.jsx`](../Front/src/pages/admin/ResourceManager.jsx)
  dibuja la tabla, el botón de alta, el modal de edición y la
  confirmación de baja. [`ResourceForm.jsx`](../Front/src/pages/admin/ResourceForm.jsx)
  arma el formulario a partir de una lista de campos. Lo único distinto
  entre recursos (qué columnas y qué campos tiene cada uno) está en
  [`adminResources.jsx`](../Front/src/pages/admin/adminResources.jsx).
- Backend: [`crud.service.js`](../Back/src/services/crud.service.js)
  (habla con Supabase) y [`crud.controller.js`](../Back/src/controllers/crud.controller.js)
  (valida y responde) son genéricos; cada recurso solo aporta su tabla y
  su validador (`Back/src/validators/`).

Ejemplo para explicarlo: *"es como un formulario de Google: el mismo
programa sirve para cualquier encuesta, lo que cambia es la lista de
preguntas. Acá el mismo panel sirve para cualquier tabla, lo que cambia
es la lista de campos."*

Proyectos tiene su propio service porque, además de la tabla `projects`,
tiene que sincronizar la tabla puente `project_technologies` (relación
muchos a muchos).

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
   header `Authorization: Bearer <token>` en cada pedido del panel
   (altas, bajas, modificaciones, mensajes y subida de imágenes).
4. El backend, antes de tocar la base, revisa ese token con
   `supabase.auth.getUser(token)` en un middleware
   ([`requireAuth.js`](../Back/src/middleware/requireAuth.js)). Si no es
   válido, responde 401 y no ejecuta nada.
5. El token vence a la hora. Si el backend responde 401, el panel cierra
   la sesión solo y te lleva de nuevo al login (no queda "trabado").

No existe un registro público de usuarios: el único usuario admin se
crea a mano desde el dashboard de Supabase (ver
`database/README.md`), así que "estar logueado" y "ser el
administrador" son, en este proyecto, la misma cosa.

## ¿Cómo se suben las imágenes de los proyectos?

1. En el formulario del proyecto, botón **"Subir imagen"** → elegís el archivo.
2. El navegador lo lee y lo convierte a texto (base64) con `FileReader`
   ([`adminService.js`](../Front/src/services/adminService.js)).
3. Lo manda a `POST /api/uploads` junto con el token.
4. El backend valida formato (JPG/PNG/WEBP/GIF) y tamaño (máx. 3 MB) y lo
   guarda en **Supabase Storage**, en el bucket público `imagenes`
   ([`storage.service.js`](../Back/src/services/storage.service.js)).
5. Supabase devuelve una URL pública; esa URL se escribe sola en el campo
   "Imagen" y es lo que se guarda en la columna `image_url`.

En la base **no** se guarda la imagen: se guarda el link a la imagen.

## ¿Cómo funciona el aviso por mail?

Cuando alguien completa el formulario de contacto, el backend: (1) guarda
el mensaje en la tabla `contact_messages` y (2) le pide a **Resend** (un
servicio de envío de mails) que te mande un aviso a tu casilla. Si el
mail fallara, el mensaje igual queda guardado y lo ves en la pestaña
**Mensajes** del panel.

Dato para contar en la defensa (es un buen ejemplo de depuración real):
al principio los mensajes se guardaban pero **ningún mail llegaba**. La
causa: en Vercel cada pedido corre en una función que **se congela apenas
responde**, y el envío del mail se hacía "en segundo plano", después de
responder, así que nunca terminaba. La solución fue **esperar** (`await`)
al envío antes de responder ([`contact.service.js`](../Back/src/services/contact.service.js)).

---

## Guion sugerido para la demo en vivo (5 minutos)

1. **La landing** (`https://portfolio-one-swart-54.vercel.app`): recorré
   las secciones; mostrá el menú, el botón de modo claro/oscuro, el filtro
   de proyectos y el modal de detalle. Achicá la ventana para mostrar que
   es responsive.
2. **El login** (`/admin/login`): mostrá que sin entrar no se puede ver
   el panel (si vas directo a `/admin` te manda al login).
3. **Alta**: en la pestaña Habilidades, "Agregar habilidad" → probá
   guardarla vacía para mostrar las validaciones → completala y guardala.
4. **Ver el cambio**: abrí la landing en otra pestaña, recargá y mostrá
   que la habilidad nueva aparece. *"Esto viene de la base de datos, no
   está escrito en el código."*
5. **Modificación**: editá esa habilidad (por ejemplo, cambiale la
   categoría) y mostrá que se movió de grupo en la landing.
6. **Baja**: borrala con el tacho; mostrá el diálogo de confirmación.
7. **Relación muchos a muchos**: en Tecnologías creá una nueva, después
   editá un proyecto, tildala y mostrá que aparece como etiqueta del
   proyecto en la landing.
8. **Mensajes**: mandá un mensaje desde el formulario de contacto de la
   landing, mostrá que llega a la pestaña Mensajes y el mail a tu casilla.
9. **La base**: si te lo piden, abrí Supabase → Table Editor y mostrá las
   tablas y la tabla puente `project_technologies`.

## Preguntas probables y cómo responderlas

- **¿Por qué no se conecta React directo a la base?** Porque para escribir
  en la base hace falta una clave secreta, y todo lo que está en el
  frontend lo puede ver cualquiera. La clave vive solo en el backend.
- **¿Qué pasa si alguien manda un pedido de borrado sin estar logueado?**
  El middleware `requireAuth` responde 401 antes de tocar la base. Y aunque
  alguien usara la clave pública de Supabase, las políticas RLS no permiten
  escribir.
- **¿Validás en el frontend o en el backend?** En los dos. El frontend
  valida para dar respuesta rápida; el backend vuelve a validar porque el
  frontend se puede saltear (por ejemplo, mandando el pedido a mano).
- **¿Qué es el slug?** Una versión del nombre apta para URLs
  ("Node.js" → `nodejs`). Se genera solo en el backend.
- **¿Por qué hay un componente de clase (`ErrorBoundary`) si todo lo demás
  son funciones?** Porque atrapar errores de render es lo único que React
  todavía no permite hacer con hooks. Gracias a eso, si una sección falla,
  el resto de la página sigue andando.
- **Si mañana querés administrar otra tabla, ¿qué hacés?** La creás en la
  base, agregás su validador y sus rutas en el backend (usando el service y
  controller genéricos) y sumás un objeto con sus campos y columnas en
  `adminResources.jsx`. El panel la muestra sola como pestaña nueva.
