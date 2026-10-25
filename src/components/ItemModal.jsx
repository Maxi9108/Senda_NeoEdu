import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Rocket, 
  Calendar, 
  Clock, 
  UserPlus, 
  FolderPlus, 
  Building2, 
  Globe, 
  Lock, 
  ShieldCheck,
  Tag,
  Compass,
  GraduationCap,
  MapPin,
  UserCheck,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Crown
} from 'lucide-react';

export const ItemModal = () => {
  const { 
    modalConfig, 
    setModalConfig, 
    currentOrg, 
    addProject, 
    addEvent, 
    addDailyBlock, 
    addOrgNode, 
    addFolder, 
    addOrganization,
    createAndActivateInstitution,
    addMember,
    requestInstitutionCreation,
    approveInstitutionBySuperAdmin,
    currentUser,
    isSuperAdmin,
    setCurrentTab,
    data 
  } = useApp();

  const { isOpen, type, payload } = modalConfig;

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    startDate: '2026-11-01',
    endDate: '2026-12-15',
    leadName: '',
    budget: '$50.000',
    tags: 'Campamento, Taller',
    milestone1: 'Planificación inicial',
    milestone2: 'Convocatoria y materiales'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    date: payload?.defaultDate || '2026-10-31',
    startTime: '14:00',
    endTime: '18:00',
    type: 'Reunión Ordinaria',
    location: 'Sede Principal',
    badgeColor: '#15803d',
    notes: '',
    isGroupWide: true, // Defaults to true so general events propagate!
    adultPrivateLink: ''
  });

  const [blockForm, setBlockForm] = useState({
    time: '14:00 - 15:00',
    title: '',
    objective: '',
    responsible: '',
    materials: '',
    location: 'Patio Principal',
    adultGuideUrl: ''
  });

  const [memberForm, setMemberForm] = useState({
    name: '',
    role: 'educator',
    department: 'General',
    badge: '',
    email: '',
    phone: '',
    bio: '',
    parentId: payload?.defaultParentId || '',
    showPublicPhone: true,
    showPublicEmail: true
  });

  const [folderForm, setFolderForm] = useState({
    name: '',
    ageRange: 'Todas las edades',
    color: '#15803d',
    isPrivate: false
  });

  const [orgForm, setOrgForm] = useState({
    name: '',
    type: 'scout',
    badge: '',
    cue: '',
    country: 'Argentina',
    province: 'Buenos Aires',
    department: '',
    city: '',
    address: '',
    officialEmail: '',
    officialPhone: '',
    description: '',
    applicantName: currentUser?.name || '',
    applicantDni: '',
    applicantPhone: currentUser?.phone || '',
    applicantEmail: currentUser?.email || '',
    applicantRole: 'Jefe de Grupo / Responsable',
    needsAuthorityAssignment: false,
    autoApproveIfSuperAdmin: true
  });
  const [orgCreatedSuccess, setOrgCreatedSuccess] = useState(false);
  const [createdOrgSummary, setCreatedOrgSummary] = useState(null);

  if (!isOpen) return null;

  const close = () => {
    setOrgCreatedSuccess(false);
    setCreatedOrgSummary(null);
    setModalConfig({ isOpen: false, type: null, payload: null });
  };

  // Submission handlers
  const handleCreateProject = (e) => {
    e.preventDefault();
    const milestones = [];
    if (projectForm.milestone1) milestones.push({ id: `m-${Date.now()}-1`, title: projectForm.milestone1, done: false });
    if (projectForm.milestone2) milestones.push({ id: `m-${Date.now()}-2`, title: projectForm.milestone2, done: false });

    addProject({
      title: projectForm.title,
      description: projectForm.description,
      status: 'Planificación',
      progress: 0,
      startDate: projectForm.startDate,
      endDate: projectForm.endDate,
      leadName: projectForm.leadName || 'Coordinador',
      budget: projectForm.budget,
      tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      milestones
    });
    close();
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    addEvent({
      ...eventForm
    });
    close();
  };

  const handleCreateBlock = (e) => {
    e.preventDefault();
    addDailyBlock({
      ...blockForm
    });
    close();
  };

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!memberForm.name.trim()) {
      alert('Por favor ingresa el nombre del integrante.');
      return;
    }

    if (addMember) {
      addMember({
        ...memberForm,
        orgId: currentOrg?.id,
        parentId: memberForm.parentId || null
      });
    } else {
      addOrgNode({
        ...memberForm,
        parentId: memberForm.parentId || null
      });
    }
    close();
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!folderForm.name.trim()) {
      alert('Por favor ingresa el nombre de la sección o rama.');
      return;
    }
    if (!currentOrg?.id) {
      alert('Debes seleccionar o crear una institución primero.');
      return;
    }
    addFolder(currentOrg.id, folderForm.name, folderForm.isPrivate, folderForm.color, folderForm.ageRange);
    close();
  };

  const handleCreateOrg = (e) => {
    e.preventDefault();
    if (!orgForm.name.trim()) {
      alert('Por favor completa el nombre de la institución o grupo.');
      return;
    }
    if (!orgForm.applicantName.trim()) {
      alert('Por favor completa el nombre del adulto responsable o solicitante.');
      return;
    }

    const payload = {
      name: orgForm.name.trim(),
      type: orgForm.type,
      badge: orgForm.badge.trim() || (orgForm.type === 'scout' ? 'Grupo Scout' : 'Institución Educativa'),
      cue: orgForm.cue.trim() || 'REG-PENDIENTE',
      country: orgForm.country.trim() || 'Argentina',
      province: orgForm.province.trim() || 'Buenos Aires',
      department: orgForm.department.trim() || 'Sede Central',
      partido: orgForm.department.trim() || 'Sede Central',
      city: orgForm.city.trim() || 'Localidad Principal',
      localidad: orgForm.city.trim() || 'Localidad Principal',
      address: orgForm.address.trim() || 'Sede Institucional',
      officialEmail: orgForm.officialEmail.trim(),
      officialPhone: orgForm.officialPhone.trim(),
      description: orgForm.description.trim() || 'Institución formativa comprometida con la educación y el desarrollo comunitario.',
      applicantName: orgForm.applicantName.trim(),
      applicantDni: orgForm.applicantDni.trim() || 'DNI-REG',
      applicantPhone: orgForm.applicantPhone.trim() || orgForm.officialPhone.trim(),
      applicantEmail: orgForm.applicantEmail.trim() || currentUser?.email || '',
      applicantRole: orgForm.applicantRole.trim() || (orgForm.type === 'scout' ? 'Jefe de Grupo' : 'Director / Responsable'),
      needsAuthorityAssignment: !!orgForm.needsAuthorityAssignment
    };

    const autoApprove = orgForm.autoApproveIfSuperAdmin ?? true;
    let res;
    if (autoApprove && createAndActivateInstitution) {
      res = createAndActivateInstitution(payload);
    } else {
      res = requestInstitutionCreation(payload);
    }

    setCreatedOrgSummary({
      ...payload,
      id: res?.reqId || res?.org?.id,
      autoApproved: autoApprove
    });
    setOrgCreatedSuccess(true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: type === 'new_org' ? '680px' : '560px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem' }}>
            {type === 'selector' && '¿Qué deseas crear?'}
            {type === 'new_project' && 'Nuevo Proyecto o Hito'}
            {type === 'new_event' && 'Programar Evento en Calendario'}
            {type === 'new_block' && 'Agregar Actividad al Programa del Día'}
            {type === 'new_member' && 'Incorporar Integrante a la Institución'}
            {type === 'new_folder' && 'Crear Sección o Carpeta'}
            {type === 'new_org' && 'Crear Nuevo Grupo o Escuela'}
          </h2>
          <button onClick={close} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* 1. Selector Menu */}
        {type === 'selector' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            {[
              { id: 'new_event', label: 'Evento de Calendario', desc: 'Salida, campamento o reunión', icon: Calendar, color: 'var(--accent-blue)' },
              { id: 'new_block', label: 'Actividad del Día', desc: 'Horario, objetivos y materiales', icon: Clock, color: 'var(--secondary)' },
              { id: 'new_project', label: 'Proyecto & Tiempos', desc: 'Cronograma, avance y presupuesto', icon: Rocket, color: 'var(--accent-purple)' },
              { id: 'new_member', label: 'Ficha de Integrante', desc: 'Sumar directivo, educador o familia', icon: UserPlus, color: 'var(--primary)' },
              { id: 'new_folder', label: 'Sección / Rama / Grado', desc: 'Pública o privada de adultos', icon: FolderPlus, color: 'var(--accent-rose)' },
              { id: 'new_org', label: 'Nuevo Grupo / Escuela', desc: 'Crear otro espacio institucional', icon: Building2, color: 'var(--text-main)' }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setModalConfig({ isOpen: true, type: item.id })}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'left',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color
                  }}>
                    <Icon size={20} />
                  </div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{item.label}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Form New Event */}
        {type === 'new_event' && (
          <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nombre del Evento *</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. Campamento Anual, Salida a la Granja, Feria de Ciencias"
                value={eventForm.title}
                onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            {/* General Group Event Checkbox */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-blue-light)',
              border: '1px solid var(--accent-blue)'
            }}>
              <input
                type="checkbox"
                id="isGroupWide"
                checked={eventForm.isGroupWide}
                onChange={e => setEventForm({ ...eventForm, isGroupWide: e.target.checked })}
                style={{ width: '17px', height: '17px' }}
              />
              <label htmlFor="isGroupWide" style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-blue)', cursor: 'pointer' }}>
                🌐 Evento General de Grupo / Escuela (Se mostrará en los calendarios de todas las ramas y grados)
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Fecha *</label>
                <input 
                  type="date"
                  required
                  value={eventForm.date}
                  onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Hora Inicio</label>
                <input 
                  type="time"
                  value={eventForm.startTime}
                  onChange={e => setEventForm({ ...eventForm, startTime: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Hora Fin</label>
                <input 
                  type="time"
                  value={eventForm.endTime}
                  onChange={e => setEventForm({ ...eventForm, endTime: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Tipo de Evento</label>
                <select
                  value={eventForm.type}
                  onChange={e => setEventForm({ ...eventForm, type: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                >
                  <option value="Reunión Ordinaria">Reunión Ordinaria</option>
                  <option value="Campamento General">Campamento General</option>
                  <option value="Salida al Aire Libre">Salida al Aire Libre</option>
                  <option value="Feria Escolar / Comunitaria">Feria Escolar / Comunitaria</option>
                  <option value="Reunión de Dirigentes / Docentes">Reunión de Dirigentes / Docentes</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Color de Identificación</label>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                  {['#15803d', '#0284c7', '#d97706', '#7c3aed', '#dc2626'].map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setEventForm({ ...eventForm, badgeColor: c })}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-full)',
                        background: c,
                        border: eventForm.badgeColor === c ? '3px solid #000' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Lugar</label>
              <input 
                type="text"
                placeholder="Predio Scout, Cancha, Aula Magna..."
                value={eventForm.location}
                onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Notas para los participantes</label>
              <input 
                type="text"
                placeholder="Traer uniforme, autorización firmada, cantimplora..."
                value={eventForm.notes}
                onChange={e => setEventForm({ ...eventForm, notes: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div style={{
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px dashed #0284c7',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <Lock size={13} style={{ color: '#0284c7' }} />
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Enlace de Drive / Planillas (Exclusivo Adultos)
                </label>
              </div>
              <input 
                type="url"
                placeholder="https://drive.google.com/drive/folders/... (Para cargar actividades)"
                value={eventForm.adultPrivateLink || ''}
                onChange={e => setEventForm({ ...eventForm, adultPrivateLink: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                🔒 Solo visible para educadores, dirigentes y autoridades del grupo/escuela.
              </span>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.65rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700
              }}
            >
              Publicar en Calendario
            </button>
          </form>
        )}

        {/* 3. Form New Folder */}
        {type === 'new_folder' && (
          <form onSubmit={handleCreateFolder} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Crea una nueva rama scout o grado escolar dentro de <strong>{currentOrg?.name || 'la institución activa'}</strong>.
            </p>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nombre de la Sección o Carpeta / Rama *</label>
              <input 
                type="text" 
                required 
                placeholder={currentOrg?.type === 'scout' ? "Ej. 🐺 Manada de Lobatos, ⚜️ Unidad Scout, 🏕️ Caminantes..." : "Ej. 🔬 5° Año Ciencias Naturales, 📚 Primaria 3er Grado..."}
                value={folderForm.name}
                onChange={e => setFolderForm({ ...folderForm, name: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Rango de Edad / Ciclo</label>
                <select
                  value={folderForm.ageRange}
                  onChange={e => setFolderForm({ ...folderForm, ageRange: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)', fontSize: '0.82rem' }}
                >
                  <option value="Todas las edades">Todas las edades / General</option>
                  <option value="5 a 7 años">5 a 7 años (Castores / Inicial)</option>
                  <option value="7 a 11 años">7 a 11 años (Manada / Primaria Inicial)</option>
                  <option value="11 a 14 años">11 a 14 años (Unidad Scout / Primaria Superior)</option>
                  <option value="14 a 17 años">14 a 17 años (Caminantes / Secundaria Básica)</option>
                  <option value="17 a 21 años">17 a 21 años (Rovers / Secundaria Superior)</option>
                  <option value="Adultos Educadores">Adultos Educadores / Equipo Directivo</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Color Distintivo</label>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.2rem' }}>
                  {[
                    { color: '#15803d', label: 'Verde' },
                    { color: '#d97706', label: 'Ámbar' },
                    { color: '#0284c7', label: 'Azul' },
                    { color: '#dc2626', label: 'Rojo' },
                    { color: '#7c3aed', label: 'Púrpura' },
                    { color: '#06b6d4', label: 'Cian' }
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setFolderForm({ ...folderForm, color: c.color })}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: 'var(--radius-full)',
                        background: c.color,
                        border: folderForm.color === c.color ? '2.5px solid #fff' : '1px solid transparent',
                        boxShadow: folderForm.color === c.color ? '0 0 0 2px var(--primary)' : 'none',
                        cursor: 'pointer'
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Private adult subfolder toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)'
            }}>
              <input
                type="checkbox"
                id="isPrivateAdult"
                checked={folderForm.isPrivate}
                onChange={e => setFolderForm({ ...folderForm, isPrivate: e.target.checked })}
                style={{ width: '17px', height: '17px' }}
              />
              <label htmlFor="isPrivateAdult" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                🔒 Subgrupo Privado de Adultos (Solo visible para Educadores, Dirigentes y Directivos)
              </label>
            </div>

            <button
              type="submit"
              style={{
                padding: '0.65rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Crear Rama / Sección
            </button>
          </form>
        )}

        {/* 4. Form New Member */}
        {type === 'new_member' && (
          <form onSubmit={handleCreateMember} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nombre Completo *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej. Roberto Sánchez"
                  value={memberForm.name}
                  onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Rol en la Institución *</label>
                <select
                  value={memberForm.role}
                  onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                >
                  <option value="educator">⚜️ Educador / Docente</option>
                  <option value="admin">🏛️ Autoridad / Directivo</option>
                  <option value="parent">👨‍👩‍👧 Familia / Padre / Madre</option>
                  <option value="student">🎒 Protagonista / Alumno / Scout</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Correo Electrónico</label>
                <input 
                  type="email" 
                  placeholder="correo@ejemplo.com"
                  value={memberForm.email}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Teléfono de Contacto</label>
                <input 
                  type="text" 
                  placeholder="+54 9 11 ..."
                  value={memberForm.phone}
                  onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
            </div>

            {/* Public contact info checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'var(--bg-input)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Privacidad de Contacto:</label>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={memberForm.showPublicPhone}
                    onChange={e => setMemberForm({ ...memberForm, showPublicPhone: e.target.checked })}
                  />
                  <span>Publicar teléfono para consultas</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={memberForm.showPublicEmail}
                    onChange={e => setMemberForm({ ...memberForm, showPublicEmail: e.target.checked })}
                  />
                  <span>Publicar correo</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.65rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700
              }}
            >
              Registrar Integrante
            </button>
          </form>
        )}

        {/* 5. Form New Block (Daily Program) */}
        {type === 'new_block' && (
          <form onSubmit={handleCreateBlock} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Horario *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="14:00 - 15:00"
                  value={blockForm.time}
                  onChange={e => setBlockForm({ ...blockForm, time: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nombre de la Actividad *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej. Amarres de Pionerismo, Taller de Robótica"
                  value={blockForm.title}
                  onChange={e => setBlockForm({ ...blockForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Objetivo Pedagógico / Finalidad</label>
              <textarea 
                rows={2}
                placeholder="¿Qué habilidad o valor se busca desarrollar con esta actividad?"
                value={blockForm.objective}
                onChange={e => setBlockForm({ ...blockForm, objective: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Responsable de Conducir</label>
                <input 
                  type="text"
                  placeholder="Docente titular, Guía de Patrulla..."
                  value={blockForm.responsible}
                  onChange={e => setBlockForm({ ...blockForm, responsible: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Lugar / Rincón</label>
                <input 
                  type="text"
                  placeholder="Cancha, Aula 3, Bosquecillo..."
                  value={blockForm.location}
                  onChange={e => setBlockForm({ ...blockForm, location: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Materiales Necesarios</label>
              <input 
                type="text"
                placeholder="Cuerdas, cartulinas, pelota, proyector..."
                value={blockForm.materials}
                onChange={e => setBlockForm({ ...blockForm, materials: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div style={{
              background: 'rgba(217, 119, 6, 0.08)',
              border: '1px dashed #d97706',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <Lock size={13} style={{ color: '#d97706' }} />
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Enlace a Ficha Técnica / Instructivo de Realización (Solo Adultos)
                </label>
              </div>
              <input 
                type="url"
                placeholder="https://docs.google.com/... (Reglas pedagógicas, pasos, dinámica)"
                value={blockForm.adultGuideUrl || ''}
                onChange={e => setBlockForm({ ...blockForm, adultGuideUrl: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                🔒 Solo visible para educadores, dirigentes y adultos responsables.
              </span>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.65rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700
              }}
            >
              Añadir al Cronograma
            </button>
          </form>
        )}

        {/* 6. Form New Project */}
        {type === 'new_project' && (
          <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Título del Proyecto *</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. Campamento Anual, Huerta Comunitaria, Feria de Ciencias"
                value={projectForm.title}
                onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Descripción y Objetivos</label>
              <textarea 
                rows={2}
                placeholder="Resumen del proyecto y metas formativas..."
                value={projectForm.description}
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Fecha Inicio</label>
                <input 
                  type="date"
                  value={projectForm.startDate}
                  onChange={e => setProjectForm({ ...projectForm, startDate: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Fecha Límite</label>
                <input 
                  type="date"
                  value={projectForm.endDate}
                  onChange={e => setProjectForm({ ...projectForm, endDate: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.65rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700
              }}
            >
              Guardar Proyecto
            </button>
          </form>
        )}

        {/* 7. Form New Organization / School / Scout Group */}
        {type === 'new_org' && (
          orgCreatedSuccess ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              textAlign: 'center',
              padding: '1rem 0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(21, 128, 61, 0.15)',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <CheckCircle2 size={38} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  ¡Solicitud de Fundación Registrada con Éxito!
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.45 }}>
                  Todos los adultos registrados pueden iniciar la creación de una institución o grupo. Los datos han sido guardados para la supervisión oficial.
                </p>
              </div>

              {/* Status Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: createdOrgSummary?.autoApproved ? 'rgba(21, 128, 61, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                color: createdOrgSummary?.autoApproved ? '#15803d' : '#d97706',
                border: createdOrgSummary?.autoApproved ? '1px solid #15803d' : '1px solid #d97706',
                fontSize: '0.82rem',
                fontWeight: 700,
                margin: '0 auto'
              }}>
                {createdOrgSummary?.autoApproved ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                <span>
                  {createdOrgSummary?.autoApproved 
                    ? '✅ Habilitada y Activada Inmediatamente' 
                    : '⏳ Pendiente de Aprobación por Autoridades & Super Admin'}
                </span>
              </div>

              {/* Summary Card */}
              {createdOrgSummary && (
                <div style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {createdOrgSummary.type === 'scout' ? '⚜️ ' : '🏫 '}
                      {createdOrgSummary.name}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '0.74rem' }}>
                      CUE/Reg: {createdOrgSummary.cue}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-muted)' }}>📍 Ubicación:</strong>
                      <div style={{ color: 'var(--text-main)' }}>
                        {createdOrgSummary.address ? `${createdOrgSummary.address}, ` : ''}
                        {createdOrgSummary.city}, {createdOrgSummary.department}, {createdOrgSummary.province}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-muted)' }}>👤 Adulto Solicitante:</strong>
                      <div style={{ color: 'var(--text-main)' }}>
                        {createdOrgSummary.applicantName} ({createdOrgSummary.applicantRole})
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        DNI: {createdOrgSummary.applicantDni || 'No informado'} • {createdOrgSummary.applicantPhone}
                      </div>
                    </div>
                  </div>

                  {createdOrgSummary.needsAuthorityAssignment && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(217, 119, 6, 0.1)',
                      border: '1px dashed #d97706',
                      color: '#b45309',
                      fontSize: '0.78rem',
                      marginTop: '0.25rem'
                    }}>
                      <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                      <span>Se ha notificado al Super Administrador para la designación de la autoridad supervisora distrital/regional.</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={close}
                  style={{
                    padding: '0.65rem 1.5rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Entendido y Continuar
                </button>
                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      if (setCurrentTab) setCurrentTab('superadmin');
                    }}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    👑 Ver en Panel Super Admin
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateOrg} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Informative Adult Role Notice */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(21, 128, 61, 0.08)',
                border: '1px solid rgba(21, 128, 61, 0.25)',
                fontSize: '0.78rem',
                color: 'var(--text-main)'
              }}>
                <Sparkles size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                <span>
                  <strong>Habilitación Comunitaria:</strong> Todos los adultos educadores o directivos pueden registrar una nueva institución o grupo completando sus datos geográficos y personales. Luego pasarán a supervisión y aprobación oficial.
                </span>
              </div>

              {/* Institution Identity */}
              <div style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} style={{ color: 'var(--primary)' }} />
                  <span>1. Identidad Institucional</span>
                </div>

                {/* Type Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setOrgForm({ ...orgForm, type: 'scout' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: orgForm.type === 'scout' ? 'rgba(21, 128, 61, 0.15)' : 'var(--bg-surface)',
                      border: orgForm.type === 'scout' ? '2px solid #15803d' : '1px solid var(--border-color)',
                      color: orgForm.type === 'scout' ? '#15803d' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Compass size={16} />
                    <span>⚜️ Grupo Scout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrgForm({ ...orgForm, type: 'school' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: orgForm.type === 'school' ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-surface)',
                      border: orgForm.type === 'school' ? '2px solid #0284c7' : '1px solid var(--border-color)',
                      color: orgForm.type === 'school' ? '#0284c7' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    <GraduationCap size={16} />
                    <span>🏫 Escuela / Colegio</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Nombre de la Institución / Grupo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={orgForm.type === 'scout' ? "Ej: Grupo Scout San Martín de Tours N° 14" : "Ej: Colegio Belgrano Día"}
                      value={orgForm.name}
                      onChange={e => setOrgForm({ ...orgForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      N° Registro / CUE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 0601234-00 o N° 14"
                      value={orgForm.cue}
                      onChange={e => setOrgForm({ ...orgForm, cue: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Insignia, Lema o Subtítulo Institucional
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Distrito 3 - Zona 12 / Nivel Primario y Secundario"
                    value={orgForm.badge}
                    onChange={e => setOrgForm({ ...orgForm, badge: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Geographic Location */}
              <div style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} style={{ color: '#16a34a' }} />
                  <span>2. Ubicación Geográfica Oficial</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      País
                    </label>
                    <input
                      type="text"
                      value={orgForm.country}
                      onChange={e => setOrgForm({ ...orgForm, country: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Provincia *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Buenos Aires, CABA, Córdoba"
                      value={orgForm.province}
                      onChange={e => setOrgForm({ ...orgForm, province: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Partido / Departamento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: La Matanza, Rosario, San Isidro"
                      value={orgForm.department}
                      onChange={e => setOrgForm({ ...orgForm, department: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Localidad / Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: San Justo, Martínez, Santa Fe"
                      value={orgForm.city}
                      onChange={e => setOrgForm({ ...orgForm, city: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Calle y Número (Dirección de Sede) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Av. San Martín 1540"
                      value={orgForm.address}
                      onChange={e => setOrgForm({ ...orgForm, address: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Email Oficial Institucional
                    </label>
                    <input
                      type="email"
                      placeholder="contacto@institucion.org"
                      value={orgForm.officialEmail}
                      onChange={e => setOrgForm({ ...orgForm, officialEmail: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Teléfono Oficial de Sede
                    </label>
                    <input
                      type="tel"
                      placeholder="+54 11 ..."
                      value={orgForm.officialPhone}
                      onChange={e => setOrgForm({ ...orgForm, officialPhone: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Adult Applicant Information */}
              <div style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={16} style={{ color: 'var(--secondary)' }} />
                  <span>3. Datos del Adulto Solicitante & Responsable</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgForm.applicantName}
                      onChange={e => setOrgForm({ ...orgForm, applicantName: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      DNI del Solicitante *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 34123456"
                      value={orgForm.applicantDni}
                      onChange={e => setOrgForm({ ...orgForm, applicantDni: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+54 9 11 ..."
                      value={orgForm.applicantPhone}
                      onChange={e => setOrgForm({ ...orgForm, applicantPhone: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={orgForm.applicantEmail}
                      onChange={e => setOrgForm({ ...orgForm, applicantEmail: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Cargo / Rol en la Institución *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Educador Adulto Fundador / Jefe de Grupo / Maestro de Grado / Directivo"
                      value={orgForm.applicantRole}
                      onChange={e => setOrgForm({ ...orgForm, applicantRole: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Supervision & Authority Checkbox */}
              <div style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--accent-purple)' }} />
                  <span>4. Supervisión y Propósito</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Descripción o Propósito Pedagógico
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Misión, historia o proyecto formativo de la institución..."
                    value={orgForm.description}
                    onChange={e => setOrgForm({ ...orgForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.82rem' }}
                  />
                </div>

                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(217, 119, 6, 0.08)',
                  border: '1px solid rgba(217, 119, 6, 0.25)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={orgForm.needsAuthorityAssignment}
                    onChange={e => setOrgForm({ ...orgForm, needsAuthorityAssignment: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>
                    <strong>Solicitar Asignación de Autoridad Supervisora:</strong> Marcar si no se cuenta aún con una autoridad distrital/regional designada. Se avisará al Super Administrador para evaluar y coordinar el curso correspondiente.
                  </div>
                </label>

                {isSuperAdmin && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={orgForm.autoApproveIfSuperAdmin}
                      onChange={e => setOrgForm({ ...orgForm, autoApproveIfSuperAdmin: e.target.checked })}
                      style={{ marginTop: '3px' }}
                    />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>
                      <strong style={{ color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Crown size={13} /> Habilitar y Activar Inmediatamente:
                      </strong> 
                      Como Super Administrador, podés dar de alta la institución de forma directa sin dejarla en estado pendiente de aprobación.
                    </div>
                  </label>
                )}
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.35rem' }}>
                <button
                  type="button"
                  onClick={close}
                  style={{
                    padding: '0.65rem 1.15rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.35rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <Building2 size={16} />
                  <span>Registrar Solicitud de Fundación</span>
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
};
