/**
 * Utility to calculate age from birth date and verify / suggest appropriate branch/group.
 */

export const calculateAge = (birthDateString) => {
  if (!birthDateString) return null;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
};

export const getSuggestedBranch = (age, orgType = 'scout') => {
  if (age === null || age === undefined) return null;

  if (orgType === 'scout') {
    if (age < 7) {
      return {
        id: 'f-scout-castores',
        name: 'Castores / Colonia',
        range: '5 a 7 años',
        category: 'Protagonista Infantil',
        icon: '🦫'
      };
    } else if (age < 11) {
      return {
        id: 'f-scout-manada',
        name: 'Manada de Lobatos y Lobeznas',
        range: '7 a 11 años',
        category: 'Protagonista de Manada',
        icon: '🐺'
      };
    } else if (age < 14) {
      return {
        id: 'f-scout-unidad',
        name: 'Unidad Scout',
        range: '11 a 14 años',
        category: 'Scout Protagonista',
        icon: '⚜️'
      };
    } else if (age < 17) {
      return {
        id: 'f-scout-caminantes',
        name: 'Comunidad Caminantes',
        range: '14 a 17 años',
        category: 'Caminante',
        icon: '🧭'
      };
    } else if (age < 21) {
      return {
        id: 'f-scout-rover',
        name: 'Comunidad Rover',
        range: '17 a 21 años',
        category: 'Rover en Servicio',
        icon: '🚩'
      };
    } else {
      return {
        id: 'f-scout-jefatura',
        name: 'Consejo de Grupo & Educadores',
        range: '21+ años (Adultos)',
        category: 'Educador Adulto / Dirigente',
        icon: '🏛️'
      };
    }
  } else {
    // Educational / School
    if (age < 6) {
      return {
        id: 'f-edu-inicial',
        name: 'Nivel Inicial / Jardín',
        range: '3 a 5 años',
        category: 'Nivel Inicial',
        icon: '🎨'
      };
    } else if (age < 12) {
      return {
        id: 'f-edu-primaria',
        name: 'Nivel Primario (1° a 6° Grado)',
        range: '6 a 12 años',
        category: 'Estudiante Primaria',
        icon: '📚'
      };
    } else if (age < 18) {
      return {
        id: 'f-edu-secundaria',
        name: 'Nivel Secundario y Bachillerato',
        range: '12 a 18 años',
        category: 'Estudiante Secundaria',
        icon: '🔬'
      };
    } else {
      return {
        id: 'f-edu-directivo',
        name: 'Sala de Profesores & Equipo Directivo',
        range: '18+ años (Docentes)',
        category: 'Cuerpo Docente / Directivo',
        icon: '🏛️'
      };
    }
  }
};
