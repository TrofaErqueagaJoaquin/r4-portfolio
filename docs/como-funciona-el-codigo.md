# Cómo funciona el código (explicado simple)

Este documento recorre el proyecto sin tecnicismos: qué parte hace qué,
dónde está cada cosa y cómo viaja la información. Cada archivo del
código empieza además con un comentario `QUÉ HACE:` que resume para qué
sirve.

---

## La idea general: tres partes

El portfolio tiene tres partes que trabajan juntas. Una forma fácil de
pensarlo es un **restaurante**:

| Parte | En el restaurante | Qué es | Carpeta |
|---|---|---|---|
| **Frontend** | El salón y la carta: lo que ve el cliente | La página web que se ve en el navegador (React) | `Front/` |
| **Backend** | El mozo y la cocina: reciben pedidos, controlan y preparan | Un programa que recibe pedidos de la web, revisa que estén bien y habla con la base (Node + Express) | `Back/` |
| **Base de datos** | La despensa: donde se guarda todo | Las tablas con proyectos, habilidades, experiencia, etc. (Supabase / PostgreSQL) | `database/` (la estructura) |

La regla más importante: **el cliente nunca entra a la despensa**. La
página web nunca toca la base directamente; siempre le pide las cosas al
backend, y el backend es el único que tiene la llave (la clave secreta
de Supabase).

---

## El viaje de un dato, paso a paso

### Cuando alguien entra a ver el portfolio

1. El navegador carga la página (React arma todas las secciones).
2. La sección **Habilidades** necesita datos: le pide al backend
   `GET /api/skills` ("dame las habilidades").
3. El backend recibe el pedido, lo busca en Supabase y devuelve la lista.
4. React la recibe y dibuja las etiquetas en pantalla.
5. Mientras espera muestra "Cargando…", y si algo falla muestra un aviso
   con un botón "Reintentar".

### Cuando editás algo en el panel `/admin`

1. Cambiás un dato en el formulario y tocás **Guardar**.
2. El formulario revisa que no falte nada (si falta, marca el campo en rojo).
3. Le manda al backend el cambio **junto con tu token** (el "pase" que
   recibiste al iniciar sesión).
4. El backend revisa en orden:
   - ¿el token es válido? Si no → "no autorizado", y no hace nada.
   - ¿los datos están bien? Si no → devuelve qué está mal.
   - Si todo está bien → lo guarda en Supabase.
5. El panel muestra "Cambios guardados" y vuelve a cargar la tabla.
6. La próxima vez que alguien abra el portfolio, ya ve el dato nuevo.

---

## El frontend (`Front/src/`), carpeta por carpeta

| Carpeta | Qué hay | Ejemplo |
|---|---|---|
| `main.jsx` y `App.jsx` | El arranque y la lista de páginas del sitio | `App.jsx` dice: "/" es el portfolio, "/admin" es el panel |
| `pages/` | Las páginas completas | `HomePage.jsx` (el portfolio), `NotFoundPage.jsx` (error 404) |
| `pages/admin/` | Todo el panel de administración | Login, pestañas, tablas, formularios |
| `components/sections/` | Cada sección del portfolio | `Hero.jsx` (la portada), `Skills.jsx`, `Experience.jsx` |
| `components/projects/` | Todo lo de la sección Proyectos | Tarjeta, filtro, ventana de detalle |
| `components/layout/` | Lo que aparece en todas las páginas | Barra de arriba, pie de página, botón de tema |
| `components/common/` | Piezas chicas que se reutilizan | Botón, etiqueta, "cargando…", mensaje de error |
| `components/contact/` | El formulario de contacto | Campos, mensaje de enviado/error |
| `hooks/` | "Ayudantes" con lógica que usan varios componentes | `useTheme` (modo oscuro), `useResourceList` (traer datos) |
| `services/` y `lib/apiClient.js` | Los que hablan con el backend | `apiClient.get('/api/skills')` |
| `data/` | Textos fijos que se editan a mano | `profile.js` (tu nombre y bio), `goals.js` (objetivos) |
| `lib/` | Herramientas generales | Validaciones, formato de fechas, listas de opciones |
| `styles/` | Estilos de todo el sitio | Colores del modo claro y oscuro en `variables.css` |

**Cada componente tiene su archivo de estilos al lado**: `Hero.jsx` y
`Hero.module.css`. Así, los estilos de una sección no pisan los de otra.

### Cómo leer un componente

Un componente es una función que devuelve lo que se ve en pantalla. Por
ejemplo, `Badge.jsx` (la etiqueta redondeada):

```jsx
export function Badge({ children, tone = 'neutral' }) {
  return <span className={...}>{children}</span>
}
```

- `Badge` es el nombre; se usa como si fuera una etiqueta HTML: `<Badge>React</Badge>`.
- `children` es lo que va adentro ("React").
- `tone` es una opción (el color); si no se indica, usa `'neutral'`.

Las cosas que se le pasan a un componente (como `tone`) se llaman
**props**. Lo que un componente recuerda y puede cambiar (por ejemplo, si
el menú está abierto) se llama **estado** y se guarda con `useState`.

---

## El backend (`Back/src/`), carpeta por carpeta

Un pedido atraviesa las carpetas en este orden:

```
pedido → routes → middleware → controllers → validators → services → Supabase
```

| Carpeta | Qué hace | En el restaurante |
|---|---|---|
| `routes/` | Lista de direcciones que existen (`/api/skills`, `/api/auth/login`…) | La carta: qué se puede pedir |
| `middleware/` | Controles que se hacen antes de atender: ¿hay sesión? ¿está configurada la base? | El que revisa la reserva en la puerta |
| `controllers/` | Reciben el pedido y arman la respuesta | El mozo |
| `validators/` | Reglas de cada dato (obligatorio, largo, formato) | Revisar que el pedido tenga sentido |
| `services/` | Hablan con Supabase (buscar, guardar, borrar) y mandan el mail | La cocina |
| `config/` | Las claves y la conexión a Supabase | Las llaves de la despensa |
| `utils/` | Herramientas chicas | `slugify` ("Node.js" → `nodejs`) |
| `app.js` | Arma todo junto | El restaurante abierto |
| `server.js` | Arranca el backend en tu compu | — |
| `../api/index.js` | La "puerta" por donde entra Vercel | — |

**Por qué hay archivos "genéricos" (`crud.service.js`, `crud.controller.js`):**
habilidades, experiencia, tecnologías y mensajes se manejan igual (ver,
crear, editar, borrar). En vez de escribir lo mismo cuatro veces, hay un
solo código que sirve para todos, y cada uno solo dice "mi tabla es tal"
y "mis reglas son tales". Lo mismo pasa en el panel con
`ResourceManager.jsx`.

---

## La base de datos (`database/`)

| Tabla | Qué guarda |
|---|---|
| `projects` | Tus proyectos |
| `technologies` | La lista de tecnologías (React, MySQL…) |
| `project_technologies` | Qué tecnologías usa cada proyecto (une las dos anteriores) |
| `skills` | Tus habilidades |
| `experiences` | Formación y trabajos |
| `contact_messages` | Los mensajes del formulario de contacto (privados) |

- `schema.sql` crea las tablas y sus reglas.
- `seed.sql` carga los datos iniciales.
- Las imágenes de proyectos no van en una tabla: se guardan en Supabase
  Storage (carpeta `imagenes`) y en la tabla queda solo el link.

---

## Las claves y la seguridad, en dos líneas

- Las claves secretas están en `Back/.env` (en tu compu) y en las
  variables de entorno de Vercel. **Nunca se suben a GitHub.**
- Ver el portfolio es público; cambiar cualquier cosa exige iniciar
  sesión. El backend lo controla en cada pedido.

---

## "Quiero cambiar X, ¿dónde miro?"

| Quiero… | Archivo |
|---|---|
| Cambiar mi nombre, bio o redes | `Front/src/data/profile.js` |
| Cambiar los objetivos | `Front/src/data/goals.js` |
| Cambiar los colores | `Front/src/styles/variables.css` |
| Cambiar los links del menú | `Front/src/lib/constants.js` (`NAV_LINKS`) |
| Cambiar qué campos tiene un formulario del panel | `Front/src/pages/admin/adminResources.jsx` |
| Cambiar una regla de validación | `Back/src/validators/` (y en el panel, `adminResources.jsx`) |
| Cambiar el texto del mail de aviso | `Back/src/services/email.service.js` |
| Cambiar cómo se ve una sección | `Front/src/components/sections/<Sección>.jsx` y su `.module.css` |

Cargar o editar proyectos, habilidades, experiencia y tecnologías **no**
requiere tocar código: se hace desde el panel (ver
[`guia-administracion.md`](./guia-administracion.md)).

---

## Mini glosario

- **Componente**: una pieza de la pantalla escrita como función (un botón, una sección).
- **Props**: los datos que se le pasan a un componente para configurarlo.
- **Estado (`useState`)**: lo que un componente recuerda y que, al cambiar, actualiza la pantalla.
- **Hook**: función que empieza con `use` y agrega una capacidad a un componente (recordar, traer datos, etc.).
- **API**: el conjunto de direcciones que ofrece el backend (`/api/...`).
- **Endpoint / ruta**: una de esas direcciones, por ejemplo `/api/skills`.
- **GET / POST / PUT / DELETE**: el tipo de pedido: ver, crear, modificar, borrar.
- **JSON**: el formato de texto en que viajan los datos entre la web y el backend.
- **Token**: el "pase" que da el login; demuestra que sos el administrador.
- **Deploy**: publicar una versión nueva del sitio (lo hace Vercel solo con cada `git push`).
- **Variable de entorno**: una configuración (como una clave) que se guarda fuera del código.
