# Base de datos — puesta en marcha

Pasos para crear y configurar la base de datos en Supabase desde cero.
Para el diagrama entidad-relación y la explicación de normalización, ver
[`docs/base-de-datos.md`](../docs/base-de-datos.md).

## 1. Crear el proyecto en Supabase

1. Crear una cuenta en [supabase.com](https://supabase.com) e iniciar un proyecto nuevo.
2. Elegir una contraseña de base de datos y guardarla (no hace falta para este proyecto, pero Supabase la pide).
3. Esperar a que termine de aprovisionarse (1-2 minutos).

## 2. Ejecutar el esquema

1. Ir a **SQL Editor** en el panel de Supabase.
2. Pegar el contenido completo de [`schema.sql`](./schema.sql) y ejecutarlo.
3. Pegar el contenido completo de [`seed.sql`](./seed.sql) y ejecutarlo (carga los datos de ejemplo provisorios).

## 3. Obtener las credenciales

En **Project Settings > API**:

- **Project URL** → `SUPABASE_URL` en `Back/.env`.
- **service_role key** (secreta) → `SUPABASE_SERVICE_ROLE_KEY` en `Back/.env`. **Nunca** se usa en el frontend.
- **anon public key**: no se usa en este proyecto (el frontend nunca habla directo con Supabase, solo a través del backend — ver [`docs/base-de-datos.md`](../docs/base-de-datos.md#seguridad)).

## 4. Crear el usuario administrador

El panel `/admin` usa Supabase Auth. Como es un portfolio de una sola persona, no hay registro público:

1. Ir a **Authentication > Providers > Email** y desactivar "Allow new users to sign up" (el nombre exacto puede variar según la versión de Supabase).
2. Ir a **Authentication > Users > Add user** y crear manualmente el usuario administrador (tu email + una contraseña).
3. Ese email/contraseña son los que se usan para entrar a `/admin/login`.

## 5. Verificar

Con `Back/.env` completo, correr el backend (`npm run dev` dentro de `Back/`) y probar:

```bash
curl http://localhost:3001/api/health
```

Debería responder `"supabaseConfigured": true`. Luego `curl http://localhost:3001/api/projects` debería devolver los proyectos de ejemplo cargados por `seed.sql`.
