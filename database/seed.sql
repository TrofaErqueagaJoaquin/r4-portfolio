-- ============================================================
-- Datos reales de Joaquín Erqueaga
-- ============================================================
-- Reemplaza los datos de ejemplo iniciales. Ejecutar DESPUÉS de
-- database/schema.sql, una sola vez (los conflictos de slug/nombre se
-- ignoran si se vuelve a correr por accidente).
--
-- OJO — fechas a confirmar: las marcadas con un comentario "estimada"
-- se completaron sin una fecha exacta provista y son una aproximación
-- razonable (temporada de verano en Mar del Plata para el foodtruck,
-- inicio de ciclo lectivo en marzo para la secundaria y la práctica).
-- Corregir en Supabase (tabla `experiences`) apenas se tengan las
-- fechas reales — no afecta al resto del sitio.
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
  ('Arduino', 'arduino'),
  ('MySQL', 'mysql'),
  ('Vercel', 'vercel')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- Habilidades, agrupadas en 7 categorías (ver schema.sql). Reemplazan
-- las 3 categorías genéricas iniciales: el perfil técnico real es más
-- amplio que "tecnologías / herramientas / blandas" (incluye redes,
-- electrónica y mantenimiento como áreas propias de su formación).
-- ------------------------------------------------------------
insert into skills (name, category, level) values
  -- Desarrollo web
  ('HTML y CSS', 'desarrollo-web', 4),
  ('JavaScript', 'desarrollo-web', 3),
  ('React', 'desarrollo-web', 3),
  ('Node.js y Express', 'desarrollo-web', 3),
  ('Diseño de interfaces', 'desarrollo-web', 3),
  -- Bases de datos
  ('SQL', 'bases-de-datos', 3),
  ('MySQL', 'bases-de-datos', 3),
  ('Modelado de bases de datos', 'bases-de-datos', 3),
  -- Redes informáticas
  ('Redes informáticas (fundamentos)', 'redes', 3),
  ('Armado de cables de red (RJ45)', 'redes', 4),
  ('Diagnóstico de conectividad', 'redes', 3),
  -- Electrónica y robótica
  ('Arduino', 'electronica', 4),
  ('Electrónica básica', 'electronica', 3),
  ('Módulos Bluetooth', 'electronica', 3),
  ('Robótica (competencias provinciales)', 'electronica', 4),
  -- Mantenimiento informático
  ('Armado y diagnóstico de PC', 'mantenimiento', 4),
  ('Mantenimiento preventivo', 'mantenimiento', 4),
  ('Instalación y configuración de software', 'mantenimiento', 4),
  -- Herramientas
  ('Git y GitHub', 'herramientas', 4),
  ('Visual Studio Code', 'herramientas', 4),
  ('Figma', 'herramientas', 2),
  ('Power BI', 'herramientas', 2),
  ('Microsoft Office', 'herramientas', 4),
  ('Herramientas de IA para programación y diseño', 'herramientas', 3),
  -- Habilidades personales
  ('Trabajo en equipo', 'blandas', 4),
  ('Comunicación', 'blandas', 4),
  ('Resolución de problemas', 'blandas', 4),
  ('Responsabilidad', 'blandas', 4),
  ('Adaptación a distintas tareas', 'blandas', 4),
  ('Organización', 'blandas', 3),
  ('Trabajo bajo presión', 'blandas', 4),
  ('Atención al cliente', 'blandas', 4),
  ('Aprendizaje autónomo', 'blandas', 3);

-- ------------------------------------------------------------
-- Experiencia (formación + laboral)
-- ------------------------------------------------------------
insert into experiences (title, organization, description, start_date, end_date, type) values
  (
    'Estudiante de Técnico en Informática',
    'Escuela Técnica N°5 "Amancio Williams" (Mar del Plata)',
    'Formación técnica en informática: programación y desarrollo web, bases de datos relacionales, redes (armado de cables RJ45, conexión de dispositivos), mantenimiento de PC y electrónica con Arduino. Participación en competencias provinciales de robótica.',
    '2020-03-01', -- estimada: inicio de ciclo lectivo
    null,
    'educacion'
  ),
  (
    'Construcción, reformas y mantenimiento',
    'Junto a mi papá',
    'Participación en reformas completas y trabajos de mantenimiento: plomería, gas y reparación de calefones. Tareas prácticas de construcción, colaborando en la organización del trabajo y resolviendo problemas concretos durante las obras.',
    '2021-01-01', -- estimada: sin fecha exacta provista, trabajo informal y periódico
    null,
    'trabajo'
  ),
  (
    'Venta al público en foodtruck',
    'Foodtruck de productos dulces',
    'Atención directa a clientes, manejo de caja, cobros y cálculos rápidos en un entorno de trabajo dinámico, durante varias temporadas de verano.',
    '2023-12-01', -- estimada: temporada de verano, sin años exactos provistos
    '2026-02-28', -- estimada
    'trabajo'
  ),
  (
    'Práctica profesionalizante en Exceser',
    'Exceser',
    'Práctica profesionalizante en un entorno de trabajo real, enfocada en el diseño de dashboards y soluciones de visualización de datos. Aprendizaje y uso de Power BI y Figma para organizar y presentar información de forma clara y útil.',
    '2026-03-01', -- estimada: se indicó año 2026, en curso
    null,
    'trabajo'
  );

-- ------------------------------------------------------------
-- Proyecto real destacado: sistema de gestión para el movimiento scout.
-- Se prioriza como featured = true según lo pedido. Sin repositorio ni
-- demo publicados todavía (está en desarrollo) — se completan más
-- adelante desde /admin apenas existan.
-- ------------------------------------------------------------
with nuevo_proyecto as (
  insert into projects (title, slug, description, category, featured)
  values (
    'Sistema de gestión para Scouts — Epicardo',
    'epicardo-sistema-gestion-scouts',
    'Aplicación web para centralizar información de eventos, noticias y actividades dentro de la estructura scout (zona y distritos), con distintos tipos de usuarios y herramientas administrativas. Incluye sistema de usuarios y permisos, panel de administración, gestión de eventos y noticias, y dashboards para organizar los contenidos. En desarrollo.',
    'web',
    true
  )
  on conflict (slug) do nothing
  returning id
)
insert into project_technologies (project_id, technology_id)
select nuevo_proyecto.id, technologies.id
from nuevo_proyecto, technologies
where technologies.slug in ('react', 'mysql', 'vercel');
