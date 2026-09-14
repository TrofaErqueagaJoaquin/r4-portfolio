-- ============================================================
-- R4 - Portfolio Personal y Profesional
-- Esquema de base de datos (PostgreSQL / Supabase)
-- ============================================================
-- Cómo ejecutar: pegar este archivo completo en Supabase > SQL Editor
-- y correrlo una vez. Ver database/README.md para el paso a paso
-- completo (crear proyecto, variables de entorno, usuario admin, etc.).
-- ============================================================

-- ------------------------------------------------------------
-- 1) technologies
-- Catálogo de tecnologías (React, Node.js, PostgreSQL, etc.). Se separa
-- de "projects" para no repetir nombres de tecnología en cada fila de
-- proyecto (evita duplicación e inconsistencias como "React" vs "react")
-- y porque una misma tecnología se usa en muchos proyectos: es una
-- relación muchos a muchos real (ver punto 3, project_technologies).
-- ------------------------------------------------------------
create table if not exists technologies (
  id          bigint generated always as identity primary key,
  name        text not null,
  slug        text not null,
  created_at  timestamptz not null default now(),
  constraint technologies_name_unique unique (name),
  constraint technologies_slug_unique unique (slug)
);

-- ------------------------------------------------------------
-- 2) projects
-- ------------------------------------------------------------
create table if not exists projects (
  id               bigint generated always as identity primary key,
  title            text not null,
  slug             text not null,
  description      text not null,
  image_url        text,
  repository_url   text,
  live_url         text,
  category         text not null default 'otro',
  featured         boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint projects_slug_unique unique (slug),
  constraint projects_title_not_empty check (char_length(trim(title)) > 0),
  constraint projects_category_valid check (category in ('web', 'automatizacion', 'electronica', 'otro'))
);

create index if not exists idx_projects_category  on projects (category);
create index if not exists idx_projects_featured   on projects (featured);
create index if not exists idx_projects_created_at on projects (created_at desc);

-- Mantiene updated_at al día en cada UPDATE automáticamente, sin
-- depender de que el backend se acuerde de setearlo a mano.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on projects;
create trigger trg_projects_updated_at
  before update on projects
  for each row
  execute function set_updated_at();

-- ------------------------------------------------------------
-- 3) project_technologies (tabla puente: relación muchos a muchos)
-- Un proyecto puede usar muchas tecnologías y una tecnología puede
-- aparecer en muchos proyectos. La clave primaria compuesta evita
-- duplicar la misma combinación proyecto+tecnología dos veces.
-- ------------------------------------------------------------
create table if not exists project_technologies (
  project_id     bigint not null references projects (id) on delete cascade,
  technology_id  bigint not null references technologies (id) on delete cascade,
  primary key (project_id, technology_id)
);

create index if not exists idx_project_technologies_project_id    on project_technologies (project_id);
create index if not exists idx_project_technologies_technology_id on project_technologies (technology_id);

-- ------------------------------------------------------------
-- 4) skills
-- ------------------------------------------------------------
create table if not exists skills (
  id          bigint generated always as identity primary key,
  name        text not null,
  category    text not null,
  level       smallint not null,
  created_at  timestamptz not null default now(),
  constraint skills_level_range check (level between 1 and 5),
  constraint skills_category_valid check (category in ('tecnologias', 'herramientas', 'blandas'))
);

create index if not exists idx_skills_category on skills (category);

-- ------------------------------------------------------------
-- 5) experiences
-- ------------------------------------------------------------
create table if not exists experiences (
  id            bigint generated always as identity primary key,
  title         text not null,
  organization  text not null,
  description   text not null,
  start_date    date not null,
  end_date      date,
  type          text not null default 'proyecto',
  created_at    timestamptz not null default now(),
  constraint experiences_type_valid check (type in ('trabajo', 'educacion', 'proyecto')),
  constraint experiences_dates_valid check (end_date is null or end_date >= start_date)
);

create index if not exists idx_experiences_start_date on experiences (start_date desc);

-- ------------------------------------------------------------
-- 6) contact_messages
-- ------------------------------------------------------------
create table if not exists contact_messages (
  id          bigint generated always as identity primary key,
  name        text not null,
  email       text not null,
  message     text not null,
  status      text not null default 'new',
  created_at  timestamptz not null default now(),
  constraint contact_messages_status_valid check (status in ('new', 'read', 'archived')),
  constraint contact_messages_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index if not exists idx_contact_messages_status     on contact_messages (status);
create index if not exists idx_contact_messages_created_at on contact_messages (created_at desc);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
-- El backend siempre usa la Service Role Key de Supabase, que ignora RLS
-- por diseño — por eso el CRUD funciona igual de bien con RLS activado.
-- Estas políticas son una segunda capa de defensa: si alguien intentara
-- leer/escribir estas tablas directamente contra Supabase con la clave
-- pública (anon), solo podría LEER lo que se lista abajo como público,
-- y no podría escribir nada (sin policy de insert/update/delete, RLS
-- deniega por defecto). Más detalle en docs/base-de-datos.md.

alter table technologies         enable row level security;
alter table projects             enable row level security;
alter table project_technologies enable row level security;
alter table skills               enable row level security;
alter table experiences          enable row level security;
alter table contact_messages     enable row level security;

create policy "Lectura publica de tecnologias"          on technologies         for select using (true);
create policy "Lectura publica de proyectos"            on projects             for select using (true);
create policy "Lectura publica de proyecto_tecnologia"  on project_technologies for select using (true);
create policy "Lectura publica de habilidades"          on skills               for select using (true);
create policy "Lectura publica de experiencia"          on experiences          for select using (true);

-- contact_messages NO tiene ninguna policy de lectura ni escritura para
-- anon/authenticated: los mensajes son privados (contienen datos
-- personales de quien escribe) y solo el backend, con la Service Role
-- Key, puede insertarlos o leerlos.
