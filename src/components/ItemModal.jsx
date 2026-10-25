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
  Tag
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
    isPrivate: false
  });

  const [orgForm, setOrgForm] = useState({
    name: '',
    type: 'scout',
    badge: 'Grupo Scout',
    description: '',
    color: '#15803d'
  });

  if (!isOpen) return null;

  const close = () => setModalConfig({ isOpen: false, type: null, payload: null });

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
    addOrgNode({
      ...memberForm,
      parentId: memberForm.parentId || null
    });
    close();
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!folderForm.name.trim()) return;
    addFolder(currentOrg.id, folderForm.name, folderForm.isPrivate);
    close();
  };

  const handleCreateOrg = (e) => {
    e.preventDefault();
    addOrganization({
      ...orgForm
    });
    close();
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
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '560px',
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
              Crea una nueva rama scout o grado escolar dentro de <strong>{currentOrg.name}</strong>.
            </p>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nombre de la Sección o Carpeta *</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. 🐺 Rama Castores, 🔬 5° Año Ciencias Naturales..."
                value={folderForm.name}
                onChange={e => setFolderForm({ ...folderForm, name: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
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
                fontWeight: 700
              }}
            >
              Crear Sección
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
      </div>
    </div>
  );
};
