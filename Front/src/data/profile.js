// Datos personales reales. Este es el único archivo que hace falta tocar
// para actualizar nombre, rol, bio o enlaces de contacto/redes.
export const profile = {
  name: 'Joaquín Erqueaga',
  nickname: 'Joaco',
  // Foto real en Front/public/profile.jpg. Si se deja vacío ('' o null),
  // el Hero vuelve a mostrar automáticamente el avatar con iniciales.
  photo: '/profile.jpg',
  role: 'Estudiante de Técnico en Informática · Desarrollo web y soluciones tecnológicas',
  tagline:
    'Estoy terminando mi formación técnica en informática y me interesa crear soluciones prácticas que combinen tecnología, automatización y resolución de problemas reales.',
  location: 'Mar del Plata, Buenos Aires, Argentina',
  email: 'erqueagajoaquin@gmail.com',
  bio: [
    'Soy estudiante de secundaria técnica con orientación en informática, interesado en el desarrollo de sistemas, la automatización y el uso de la tecnología para resolver problemas concretos. Me gusta aprender cómo funcionan las cosas, crear soluciones desde cero y mejorar procesos para que sean más simples, útiles y eficientes.',
    'Además de mi formación técnica, tengo experiencia laboral en atención al público, construcción y mantenimiento: trabajé varias temporadas en un foodtruck y participé junto a mi papá en reformas, plomería, gas y otras tareas prácticas. Esas experiencias me ayudaron a desarrollar responsabilidad, capacidad de adaptación, trabajo en equipo y resolución de problemas.',
    'Actualmente busco seguir sumando experiencia en tecnología, participar en proyectos reales y desarrollar soluciones que combinen conocimientos informáticos con necesidades prácticas de personas, organizaciones y empresas.',
  ],
  // Se muestran en "Sobre mí" como highlights. A diferencia de "Objetivos e
  // intereses" (data/goals.js), acá el foco está en la forma de encarar
  // el trabajo, no en los temas que le interesan.
  highlights: [
    'Entre lo técnico y lo manual: además de programar, trabajé en construcción, plomería y gas junto a mi papá — ahí aprendí a resolver problemas con lo que hay a mano.',
    'Varias temporadas atendiendo un foodtruck me enseñaron a moverme bajo presión y a tratar bien a quien tengo enfrente.',
    'Prefiero un proyecto chico que funcione y le sirva a alguien real (como Epicardo, para mi grupo scout) antes que uno grande que se quede en la teoría.',
  ],
  social: {
    github: 'https://github.com/TrofaErqueagaJoaquin',
    linkedin: '',
    instagram: 'https://instagram.com/joaco.trofa',
  },
}
