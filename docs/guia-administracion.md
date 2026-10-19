# Guía de administración: qué se modifica y desde dónde

Esta guía explica cómo cambiar cualquier contenido del portfolio, paso a
paso. Para la teoría (qué es un hook, cómo funciona la API, etc.) está
[`defensa-oral.md`](./defensa-oral.md).

## Resumen: cada cosa y dónde se cambia

| Qué querés cambiar | Dónde | ¿Se ve al instante? |
|---|---|---|
| Proyectos (título, descripción, imagen, links, tecnologías, destacado) | Panel `/admin` → pestaña **Proyectos** | Sí, al recargar la web |
| Habilidades | Panel `/admin` → pestaña **Habilidades** | Sí |
| Experiencia y formación | Panel `/admin` → pestaña **Experiencia** | Sí |
| Tecnologías (las etiquetas de los proyectos) | Panel `/admin` → pestaña **Tecnologías** | Sí |
| Mensajes del formulario de contacto | Panel `/admin` → pestaña **Mensajes** (+ te llega un mail) | — |
| Nombre, apodo, rol, frase, bio, "Sobre mí", email, ubicación, redes | Código: [`Front/src/data/profile.js`](../Front/src/data/profile.js) | Después del push (~1-2 min) |
| Foto de perfil | Código: reemplazar [`Front/public/profile.jpg`](../Front/public/profile.jpg) | Después del push |
| Objetivos e intereses | Código: [`Front/src/data/goals.js`](../Front/src/data/goals.js) | Después del push |
| Colores del sitio (modo claro/oscuro) | Código: [`Front/src/styles/variables.css`](../Front/src/styles/variables.css) | Después del push |
| Contraseña del administrador | Dashboard de **Supabase** → Authentication | — |
| A qué mail llegan los avisos de contacto | **Vercel** → proyecto `r4-portfolio` → variable `CONTACT_TO_EMAIL` | Después de Redeploy |

**¿Por qué algunas cosas van por el panel y otras por código?** Lo que
cambia seguido y es una *lista* (proyectos, habilidades, experiencia,
tecnologías, mensajes) vive en la base de datos y se administra desde el
panel. Lo que es un solo bloque de texto y casi nunca cambia (tu nombre,
tu bio, los objetivos) vive en archivos del código: no justificaba crear
tablas y pantallas extra para algo que se edita una vez cada tanto.

---

## 1. Entrar al panel

1. Abrí **https://portfolio-one-swart-54.vercel.app/admin/login**.
2. Email y contraseña del usuario administrador (el que está creado en
   Supabase → Authentication → Users: `erqueagajoaquin@gmail.com`).
3. La sesión dura **1 hora**. Si vence mientras estás en el panel, te
   devuelve al login: volvé a entrar y listo (no se pierde nada guardado).

**¿No te acordás la contraseña?** En Supabase → **Authentication →
Users**, borrá el usuario y creá uno nuevo con **Add user → Create new
user**, con el mismo email, una contraseña nueva y la opción **Auto
Confirm User** tildada. (El sitio no tiene pantalla de "olvidé mi
contraseña": es un sitio de un solo administrador.)

## 2. ABML en el panel (es igual en todas las pestañas)

Arriba hay una pestaña por cada tipo de contenido. En cada una:

- **Listado**: la tabla muestra todo lo cargado, con la cantidad al lado
  del título.
- **Alta**: botón **"Agregar …"** (arriba a la derecha) → completás el
  formulario → **Crear**.
- **Modificación**: ícono del **lápiz** en la fila → cambiás lo que
  quieras → **Guardar cambios**.
- **Baja**: ícono del **tacho** → confirmás en el cuadro que aparece.

Si falta un dato obligatorio o algo está mal (una URL inválida, una fecha
de fin anterior a la de inicio, etc.) el formulario te marca el campo en
rojo y no guarda. Arriba de la tabla aparece un aviso verde cuando algo
se guardó o se borró.

### Detalles de cada pestaña

**Proyectos**
- *Imagen*: botón **"Subir imagen"** (JPG, PNG, WEBP o GIF, hasta 3 MB) o
  pegar una URL. Si no ponés imagen, la web muestra un recuadro con el
  ícono de la categoría.
- *Tecnologías*: tildá las que use el proyecto. Si falta alguna, creala
  primero en la pestaña **Tecnologías** y después volvé a abrir el proyecto.
- *Destacado*: los proyectos destacados aparecen primero y con una
  estrella.
- Los links de repositorio y demo son opcionales: si están vacíos, el
  botón directamente no aparece en la web.

**Habilidades**
- *Categoría*: define en qué grupo aparece (Desarrollo web, Redes, etc.).
- *Nivel (1 a 5)*: **no se muestra** en la web; solo ordena las
  habilidades dentro de su grupo (las de nivel más alto, primero).

**Experiencia**
- *Fecha de fin*: dejala **vacía** si sigue en curso; la web muestra
  "Presente". Cuando termines la secundaria o la práctica en Exceser,
  editá el registro y completá la fecha de fin.
- *Tipo*: Educación, Trabajo o Proyecto (cambia el ícono y la etiqueta).

**Tecnologías**
- Solo tiene nombre. El identificador ("slug") se genera solo.
- Si borrás una tecnología, se quita también de los proyectos que la
  usaban (te lo avisa antes de borrar).

**Mensajes**
- Cada mensaje del formulario de contacto aparece acá (y además te llega
  un mail de aviso).
- Podés marcarlo como **leído / no leído**, **archivarlo** (pasa a la
  vista "Archivados") o **eliminarlo**.
- Para responder, hacé clic en el email de la persona: abre tu programa
  de correo.

## 3. Cambios por código (perfil, foto, objetivos)

1. Editá el archivo correspondiente (ver la tabla del principio). Por
   ejemplo, en `profile.js` cambiá el texto entre comillas.
2. Si querés verlo antes en tu compu: `npm run dev` dentro de `Front/`.
3. Subí el cambio desde una terminal parada en la carpeta `R4`:
   ```bash
   git add -A
   git commit -m "Actualizar bio"
   git push
   ```
4. Vercel detecta el push y vuelve a publicar los dos proyectos solo.
   En 1-2 minutos el cambio está en línea.

> Para la foto: reemplazá `Front/public/profile.jpg` por otra imagen con
> **el mismo nombre**. Conviene que sea cuadrada o vertical, con la cara
> centrada (se recorta en círculo).

## 4. Servicios externos (por si te preguntan "¿dónde está…?")

| Servicio | Para qué se usa | Qué mirar ahí |
|---|---|---|
| **Supabase** (proyecto "Porfolio") | Base de datos PostgreSQL, login del admin y almacenamiento de imágenes | **Table Editor**: las tablas. **Authentication → Users**: el admin. **Storage → imagenes**: las imágenes subidas |
| **Vercel** | Publica la web (proyecto `portfolio`, carpeta `Front`) y la API (proyecto `r4-portfolio`, carpeta `Back`) | **Deployments**: cada publicación. **Settings → Environment Variables**: las claves del backend |
| **GitHub** (`TrofaErqueagaJoaquin/r4-portfolio`) | Guarda el código; cada push dispara la publicación en Vercel | El historial de cambios (commits) |
| **Resend** | Envía el mail de aviso cuando alguien escribe en Contacto | **Emails**: los avisos enviados y si llegaron |

## 5. Problemas comunes

- **"No se pudo conectar con el servidor" en la web**: la API no responde.
  Probá abrir `https://r4-portfolio.vercel.app/api/health`: tiene que decir
  `"supabaseConfigured":true`. Si no, revisá las variables de entorno del
  proyecto `r4-portfolio` en Vercel. Si Supabase pausó el proyecto por
  inactividad (pasa en el plan gratis tras varios días sin uso), entrá al
  dashboard de Supabase y tocá **Restore project**.
- **Me saca del panel a cada rato**: la sesión dura 1 hora; es normal.
- **Subí una imagen y da error**: revisá que sea JPG/PNG/WEBP/GIF y pese
  menos de 3 MB.
- **No me llegan los mails de contacto**: revisá spam. Con el plan gratis
  de Resend, los avisos solo pueden llegar a la casilla con la que te
  registraste en Resend.
- **Cambié `profile.js` y no se ve**: ¿hiciste `git push`? Mirá en Vercel →
  Deployments que la última publicación esté en "Ready".
