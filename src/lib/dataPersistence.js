/**
 * Senda NeoEdu - Arquitectura de Persistencia Garantizada 24/7
 * 
 * Garantiza que las instituciones, grupos, ramas y datos cargados en la aplicación
 * NUNCA se borren ni se pierdan ante actualizaciones del sistema, cambios de versión
 * de código, despliegues o limpiezas parciales del navegador.
 */

export const STORAGE_PERMANENT_KEY = 'senda_neoedu_data_permanent';
export const STORAGE_VERSION_KEY = 'senda_neoedu_data_v6';
export const INSTITUTIONS_VAULT_KEY = 'senda_24_7_institutions_registry';
export const BACKUP_TIMESTAMP_KEY = 'senda_24_7_last_backup';

export const LEGACY_STORAGE_KEYS = [
  'senda_neoedu_data_v5',
  'senda_neoedu_data_v4',
  'senda_neoedu_data_v3',
  'senda_neoedu_data_v2',
  'senda_neoedu_data_v1',
  'senda_neoedu_data'
];

/**
 * Normaliza una organización y sus carpetas para garantizar contraste visual
 * en modo oscuro y compatibilidad de tipos ('school' / 'edu').
 * @param {Object} org
 * @returns {Object}
 */
export function sanitizeOrganization(org) {
  if (!org || typeof org !== 'object') return org;
  const isScout = org.type === 'scout';
  const defaultColor = org.color || (isScout ? '#15803d' : '#0284c7');
  const rawFolders = Array.isArray(org.folders) && org.folders.length > 0
    ? org.folders
    : [
        {
          id: `f-${org.id}-all`,
          name: isScout ? 'General / Todo el Grupo' : 'Institucional General',
          ageRange: 'Comunidad Completa',
          color: defaultColor,
          bannerBg: `linear-gradient(135deg, ${defaultColor}25, var(--bg-card))`,
          whatsappLink: '',
          isPrivateAdultOnly: false,
          reminderNotice: `¡Bienvenidos al espacio oficial de ${org.name}!`,
          materials: [],
          privateAdultResources: [],
          gallery: []
        },
        {
          id: `f-${org.id}-adultos`,
          name: isScout ? '🎖️ Consejo de Grupo & Dirigentes' : '🏛️ Sala de Profesores & Equipo Directivo',
          ageRange: 'Adultos Responsables y Educadores',
          color: '#7c3aed',
          bannerBg: 'linear-gradient(135deg, #7c3aed25, #0f172a15)',
          whatsappLink: '',
          isPrivateAdultOnly: true,
          reminderNotice: 'Espacio privado exclusivo para educadores, dirigentes y directivos.',
          materials: [],
          privateAdultResources: [],
          gallery: []
        }
      ];

  const sanitizedFolders = rawFolders.map(folder => {
    if (!folder || typeof folder !== 'object') return folder;
    let bannerBg = folder.bannerBg || `linear-gradient(135deg, ${folder.color || defaultColor}25, var(--bg-card))`;
    if (typeof bannerBg === 'string' && /#ffffff|#fff\b/i.test(bannerBg)) {
      bannerBg = bannerBg.replace(/#ffffff|#fff\b/gi, 'var(--bg-card)');
    }
    return {
      ...folder,
      bannerBg
    };
  });

  return {
    ...org,
    status: org.status || 'approved',
    color: defaultColor,
    icon: org.icon || (isScout ? 'Compass' : 'GraduationCap'),
    folders: sanitizedFolders
  };
}

/**
 * Guarda una institución en el Registro Blindado de Instituciones (Vault)
 * Asegura que ninguna institución creada en la aplicación 24/7 sea eliminada.
 * @param {Object} org 
 */
export function persistInstitutionToVault(org) {
  if (!org || !org.id) return;
  try {
    const cleanOrg = sanitizeOrganization(org);
    const raw = localStorage.getItem(INSTITUTIONS_VAULT_KEY);
    const vault = raw ? JSON.parse(raw) : [];
    const index = vault.findIndex(o => o.id === cleanOrg.id);
    if (index >= 0) {
      vault[index] = { ...vault[index], ...cleanOrg, lastSavedAt: new Date().toISOString() };
    } else {
      vault.push({ ...cleanOrg, lastSavedAt: new Date().toISOString() });
    }
    localStorage.setItem(INSTITUTIONS_VAULT_KEY, JSON.stringify(vault));
  } catch (err) {
    console.warn('Advertencia al guardar en Institutions Vault:', err);
  }
}

/**
 * Obtiene todas las instituciones preservadas en el Vault
 * @returns {Array}
 */
export function getInstitutionsFromVault() {
  try {
    const raw = localStorage.getItem(INSTITUTIONS_VAULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Guarda los datos de la aplicación con triple redundancia:
 * 1. Clave permanente (independiente de versión)
 * 2. Clave versionada actual
 * 3. Bóveda dedicada de instituciones
 * @param {Object} data 
 */
export function saveDataSafely(data) {
  if (!data || typeof data !== 'object') return;

  try {
    const serialized = JSON.stringify(data);
    
    // 1. Guardado en clave permanente
    localStorage.setItem(STORAGE_PERMANENT_KEY, serialized);

    // 2. Guardado en clave versionada actual
    localStorage.setItem(STORAGE_VERSION_KEY, serialized);

    // 3. Resguardo de cada institución en el Vault
    if (Array.isArray(data.organizations)) {
      data.organizations.forEach(org => persistInstitutionToVault(org));
    }

    // 4. Marca temporal de respaldo
    localStorage.setItem(BACKUP_TIMESTAMP_KEY, new Date().toISOString());
  } catch (err) {
    console.error('Error al guardar datos de forma segura:', err);
  }
}

/**
 * Carga los datos preservados buscando en todas las fuentes disponibles
 * y migra de versiones previas si es necesario, realizando un merge no destructivo
 * con los datos iniciales de la versión para evitar pérdida de esquemas.
 * @param {Object} fallbackData 
 * @returns {Object}
 */
export function loadDataSafely(fallbackData) {
  let loaded = null;

  // Intento 1: Clave permanente
  try {
    const permRaw = localStorage.getItem(STORAGE_PERMANENT_KEY);
    if (permRaw) {
      loaded = JSON.parse(permRaw);
    }
  } catch (e) {
    console.warn('Error leyendo STORAGE_PERMANENT_KEY:', e);
  }

  // Intento 2: Clave versionada actual si no se encontró en permanente
  if (!loaded || !loaded.organizations || loaded.organizations.length === 0) {
    try {
      const verRaw = localStorage.getItem(STORAGE_VERSION_KEY);
      if (verRaw) {
        loaded = JSON.parse(verRaw);
      }
    } catch (e) {
      console.warn('Error leyendo STORAGE_VERSION_KEY:', e);
    }
  }

  // Intento 3: Búsqueda y migración automática desde versiones legacy
  if (!loaded || !loaded.organizations || loaded.organizations.length === 0) {
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      try {
        const legacyRaw = localStorage.getItem(legacyKey);
        if (legacyRaw) {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (parsedLegacy && parsedLegacy.organizations && parsedLegacy.organizations.length > 0) {
            console.info(`Migrando datos preservados desde versión anterior (${legacyKey})...`);
            loaded = parsedLegacy;
            break;
          }
        }
      } catch (e) {
        // Continuar buscando
      }
    }
  }

  // Si no se encontró nada guardado, se inicia con fallbackData
  if (!loaded || typeof loaded !== 'object') {
    loaded = JSON.parse(JSON.stringify(fallbackData));
  }

  // Merge no destructivo con fallbackData para garantizar integridad de campos nuevos
  const merged = mergeWithSystemDefaults(loaded, fallbackData);

  // Re-hidratar cualquier institución huérfana desde el Vault
  const vaultOrgs = getInstitutionsFromVault();
  if (vaultOrgs.length > 0) {
    const existingIds = new Set(merged.organizations.map(o => o.id));
    vaultOrgs.forEach(vOrg => {
      if (!existingIds.has(vOrg.id)) {
        merged.organizations.push(sanitizeOrganization(vOrg));
        existingIds.add(vOrg.id);
      }
    });
  }

  // Guardar inmediatamente el estado consolidado para asegurar persistencia
  saveDataSafely(merged);

  return merged;
}

/**
 * Mezcla datos guardados por el usuario con valores por defecto del sistema
 * asegurando que si una actualización agrega nuevas tablas/claves, no se pierdan
 * ni las instituciones existentes ni las nuevas funciones.
 * @param {Object} userLoaded 
 * @param {Object} systemDefaults 
 * @returns {Object}
 */
export function mergeWithSystemDefaults(userLoaded, systemDefaults) {
  const result = { ...userLoaded };

  // Garantizar existencia de todas las propiedades base
  for (const key of Object.keys(systemDefaults)) {
    if (result[key] === undefined || result[key] === null) {
      result[key] = systemDefaults[key];
    } else if (Array.isArray(systemDefaults[key]) && !Array.isArray(result[key])) {
      result[key] = systemDefaults[key];
    }
  }

  // Para organizations: asegurar que existan las organizaciones del usuario Y las base
  if (Array.isArray(result.organizations)) {
    const orgMap = new Map();
    // Prioridad a las organizaciones del usuario cargadas
    result.organizations.forEach(o => {
      if (o && o.id) orgMap.set(o.id, sanitizeOrganization(o));
    });
    // Agregar las del sistema solo si no estaban
    if (Array.isArray(systemDefaults.organizations)) {
      systemDefaults.organizations.forEach(sOrg => {
        if (!orgMap.has(sOrg.id)) {
          orgMap.set(sOrg.id, sanitizeOrganization(sOrg));
        }
      });
    }

    result.organizations = Array.from(orgMap.values());
  }

  // Para pendingInstitutions: preservar todas las solicitudes pendientes de aprobación
  // cargadas por usuarios que aún no hayan sido aprobadas en organizations
  if (Array.isArray(result.pendingInstitutions) || Array.isArray(systemDefaults.pendingInstitutions)) {
    const reqMap = new Map();
    const existingOrgNames = new Set(
      (result.organizations || []).map(o => (o.name || '').toLowerCase().trim())
    );
    (result.pendingInstitutions || []).forEach(req => {
      if (req && req.id && req.status !== 'rejected' && !existingOrgNames.has((req.name || '').toLowerCase().trim())) {
        reqMap.set(req.id, req);
      }
    });
    (systemDefaults.pendingInstitutions || []).forEach(sReq => {
      if (sReq && sReq.id && !reqMap.has(sReq.id) && !existingOrgNames.has((sReq.name || '').toLowerCase().trim())) {
        reqMap.set(sReq.id, sReq);
      }
    });
    result.pendingInstitutions = Array.from(reqMap.values());
  }

  // Para members: preservar miembros del usuario y base
  if (Array.isArray(result.members) && Array.isArray(systemDefaults.members)) {
    const memberMap = new Map();
    result.members.forEach(m => {
      if (m && m.id) memberMap.set(m.id, m);
    });
    systemDefaults.members.forEach(sMem => {
      if (!memberMap.has(sMem.id)) {
        memberMap.set(sMem.id, sMem);
      }
    });
    result.members = Array.from(memberMap.values());
  }

  // Para calendarEvents: preservar todos los eventos existentes
  if (Array.isArray(result.calendarEvents) && Array.isArray(systemDefaults.calendarEvents)) {
    const eventMap = new Map();
    result.calendarEvents.forEach(e => {
      if (e && e.id) eventMap.set(e.id, e);
    });
    systemDefaults.calendarEvents.forEach(sEv => {
      if (!eventMap.has(sEv.id)) {
        eventMap.set(sEv.id, sEv);
      }
    });
    result.calendarEvents = Array.from(eventMap.values());
  }

  return result;
}

/**
 * Mezcla los datos provenientes de Google Drive / Sheets (Backend 24/7)
 * con los datos locales sin destruir instituciones creadas localmente ni remotamente.
 * @param {Object} localData 
 * @param {Object} cloudData 
 * @returns {Object}
 */
export function mergeCloudWithLocalData(localData, cloudData) {
  if (!cloudData || typeof cloudData !== 'object') return localData;
  if (!localData || typeof localData !== 'object') return cloudData;

  const merged = { ...localData, ...cloudData };

  // 1. Organizaciones: Unión de organizaciones remotas y locales
  const orgMap = new Map();
  // Cargar primero locales
  (localData.organizations || []).forEach(o => {
    if (o && o.id) orgMap.set(o.id, sanitizeOrganization(o));
  });
  // Superponer / sumar remotas
  (cloudData.organizations || []).forEach(co => {
    if (co && co.id) {
      const existing = orgMap.get(co.id);
      // Conservar la versión con mayor cantidad de ramas o carpetas
      if (existing && Array.isArray(existing.folders) && existing.folders.length > (co.folders?.length || 0)) {
        orgMap.set(co.id, sanitizeOrganization({ ...co, ...existing }));
      } else {
        orgMap.set(co.id, sanitizeOrganization(co));
      }
    }
  });
  merged.organizations = Array.from(orgMap.values());

  // 2. Miembros: Unión sin duplicados por ID
  const memberMap = new Map();
  (localData.members || []).forEach(m => m?.id && memberMap.set(m.id, m));
  (cloudData.members || []).forEach(m => m?.id && memberMap.set(m.id, m));
  merged.members = Array.from(memberMap.values());

  // 3. Eventos de Calendario: Unión sin duplicados
  const eventMap = new Map();
  (localData.calendarEvents || []).forEach(e => e?.id && eventMap.set(e.id, e));
  (cloudData.calendarEvents || []).forEach(e => e?.id && eventMap.set(e.id, e));
  merged.calendarEvents = Array.from(eventMap.values());

  // 4. Programas Diarios: Unión
  const progMap = new Map();
  (localData.dailyPrograms || []).forEach(p => p?.id && progMap.set(p.id, p));
  (cloudData.dailyPrograms || []).forEach(p => p?.id && progMap.set(p.id, p));
  merged.dailyPrograms = Array.from(progMap.values());

  // 5. Proyectos: Unión
  const projMap = new Map();
  (localData.projects || []).forEach(p => p?.id && projMap.set(p.id, p));
  (cloudData.projects || []).forEach(p => p?.id && projMap.set(p.id, p));
  merged.projects = Array.from(projMap.values());

  // 6. Solicitudes de Institución: Unión (excluyendo ya aprobadas o rechazadas)
  const approvedNames = new Set((merged.organizations || []).map(o => (o.name || '').toLowerCase().trim()));
  const reqMap = new Map();
  (cloudData.pendingInstitutions || []).forEach(r => {
    if (r?.id && r.status !== 'rejected' && !approvedNames.has((r.name || '').toLowerCase().trim())) {
      reqMap.set(r.id, r);
    }
  });
  (localData.pendingInstitutions || []).forEach(r => {
    if (r?.id && r.status !== 'rejected' && !approvedNames.has((r.name || '').toLowerCase().trim())) {
      reqMap.set(r.id, r);
    }
  });
  merged.pendingInstitutions = Array.from(reqMap.values());

  return merged;
}

/**
 * Elimina una institución del Vault en caso de eliminación intencional
 * @param {string} orgId 
 */
export function removeInstitutionFromVault(orgId) {
  if (!orgId) return;
  try {
    const raw = localStorage.getItem(INSTITUTIONS_VAULT_KEY);
    if (!raw) return;
    const vault = JSON.parse(raw);
    const updated = vault.filter(o => o.id !== orgId);
    localStorage.setItem(INSTITUTIONS_VAULT_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error al remover del Institutions Vault:', err);
  }
}
