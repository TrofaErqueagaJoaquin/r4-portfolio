-- ============================================================
-- Datos de ejemplo (PROVISORIOS)
-- ============================================================
-- Pensados para que la landing tenga contenido real durante el
-- desarrollo y la defensa oral. Reemplazar por datos reales antes de
-- usar el portfolio como página personal. Ejecutar DESPUÉS de
-- database/schema.sql, una sola vez (los conflictos de slug/nombre se
-- ignoran si se vuelve a correr por accidente).
-- ============================================================

insert into technologies (name, slug) values
  ('JavaScript', 'javascript'),
  ('React', 'react'),
  ('Node.js', 'nodejs'),
  ('Express', 'express'),
  ('PostgreSQL', 'postgresql'),
  ('Supabase', 'supabase'),
  ('Python', 'python'),
  ('HTML5', 'html5'),
  ('CSS3', 'css3'),
  ('Arduino', 'arduino')
on conflict (slug) do nothing;

insert into skills (name, category, level) values
  ('JavaScript', 'tecnologias', 4),
  ('React', 'tecnologias', 3),
  ('Node.js', 'tecnologias', 3),
  ('SQL', 'tecnologias', 3),
  ('Python', 'tecnologias', 3),
  ('Git y GitHub', 'herramientas', 4),
  ('VS Code', 'herramientas', 4),
  ('Supabase', 'herramientas', 3),
  ('Resolución de problemas', 'blandas', 4),
  ('Trabajo en equipo', 'blandas', 4),
  ('Comunicación', 'blandas', 3);

insert into experiences (title, organization, description, start_date, end_date, type) values
  (
    'Estudiante de Técnico en Informática',
    'Escuela técnica (nombre provisorio)',
    'Formación en programación, redes, bases de datos y electrónica. Último año en curso.',
    '2022-03-01',
    null,
    'educacion'
  ),
  (
    'Proyecto integrador R4',
    'Escuela técnica (nombre provisorio)',
    'Diseño y desarrollo de este portfolio: frontend en React, backend en Node/Express y base de datos en Supabase.',
    '2026-08-01',
    null,
    'proyecto'
  );

-- Proyectos de ejemplo + sus tecnologías (relación muchos a muchos).
-- Cada bloque inserta el proyecto y, con su id recién generado, las
-- filas correspondientes en project_technologies.
with nuevo_proyecto as (
  insert into projects (title, slug, description, category, featured)
  values (
    'Aplicación web de ejemplo',
    'aplicacion-web-de-ejemplo',
    'Proyecto de ejemplo (dato provisorio). Landing page con formulario de contacto y panel de administración.',
    'web',
    true
  )
  returning id
)
insert into project_technologies (project_id, technology_id)
select nuevo_proyecto.id, technologies.id
from nuevo_proyecto, technologies
where technologies.slug in ('react', 'nodejs', 'postgresql');

with nuevo_proyecto as (
  insert into projects (title, slug, description, category, featured)
  values (
    'Sistema de gestión de ejemplo',
    'sistema-de-gestion-de-ejemplo',
    'Proyecto de ejemplo (dato provisorio). Alta, listado, edición y borrado de registros simples.',
    'web',
    false
  )
  returning id
)
insert into project_technologies (project_id, technology_id)
select nuevo_proyecto.id, technologies.id
from nuevo_proyecto, technologies
where technologies.slug in ('javascript', 'express');

with nuevo_proyecto as (
  insert into projects (title, slug, description, category, featured)
  values (
    'Script de automatización de ejemplo',
    'script-de-automatizacion-de-ejemplo',
    'Proyecto de ejemplo (dato provisorio). Automatiza una tarea repetitiva, como ordenar archivos o generar un reporte.',
    'automatizacion',
    false
  )
  returning id
)
insert into project_technologies (project_id, technology_id)
select nuevo_proyecto.id, technologies.id
from nuevo_proyecto, technologies
where technologies.slug in ('python');

with nuevo_proyecto as (
  insert into projects (title, slug, description, category, featured)
  values (
    'Proyecto de electrónica de ejemplo',
    'proyecto-de-electronica-de-ejemplo',
    'Proyecto de ejemplo (dato provisorio). Prototipo con microcontrolador y sensores.',
    'electronica',
    false
  )
  returning id
)
insert into project_technologies (project_id, technology_id)
select nuevo_proyecto.id, technologies.id
from nuevo_proyecto, technologies
where technologies.slug in ('arduino');
