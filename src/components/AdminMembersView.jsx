import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Trash2, 
  Plus, 
  Search, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Mail,
  Phone,
  FolderOpen,
  Sparkles,
  BarChart2,
  UserPlus,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Heart,
  TrendingUp,
  CheckCircle2,
  Network,
  Eye,
  X
} from 'lucide-react';
import { getSuggestedBranch } from '../lib/branchAgeHelper';

export const AdminMembersView = () => {
  const { 
    currentOrg, 
    data, 
    isAdmin, 
    isSuperAdmin,
    currentUser,
    currentUserRole, 
    toggleMemberStatus, 
    updateMemberRole, 
    updateMemberBranch,
    updateMemberBranches,
    deleteMember, 
    approveMember,
    canDeleteMember,
    setModalConfig,
    setCurrentTab
  } = useApp();

  const [filterRole, setFilterRole] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');
  
  // Per-member form states for pending approvals to avoid cross-card contamination
  const [pendingSelections, setPendingSelections] = useState({});
  // Toggle presentation panel per applicant
  const [expandedPresentations, setExpandedPresentations] = useState({});
  // Inline feedback notification
  const [feedbackNotice, setFeedbackNotice] = useState(null);
  // Full profile inspection modal
  const [inspectedMember, setInspectedMember] = useState(null);

  // Members for the current organization
  const orgMembers = data.members.filter(m => m.orgId === currentOrg.id);
  const pendingMembers = orgMembers.filter(m => m.status === 'pending');
  const activeAndBlockedMembers = orgMembers.filter(m => m.status !== 'pending');

  // Counts for visual graphics
  const countAdmin = orgMembers.filter(m => m.role === 'admin' || m.role === 'advanced_admin').length;
  const countEducator = orgMembers.filter(m => m.role === 'educator').length;
  const countParent = orgMembers.filter(m => m.role === 'parent').length;
  const countStudent = orgMembers.filter(m => m.role === 'student').length;
  const totalCount = orgMembers.length || 1;

  const pctAdmin = Math.round((countAdmin / totalCount) * 100);
  const pctEducator = Math.round((countEducator / totalCount) * 100);
  const pctParent = Math.round((countParent / totalCount) * 100);
  const pctStudent = Math.round((countStudent / totalCount) * 100);

  const isAuthority = isAdmin || isSuperAdmin;
  const isAdultEducator = currentUserRole === 'educator';

  const filteredMembers = activeAndBlockedMembers.filter(m => {
    // Permisos de visualización:
    // Autoridades o Superadmin ven todos los perfiles de la institución.
    // Educadores de rama tienen acceso a los perfiles de padres, alumnos/protagonistas y pares educadores.
    if (!isAuthority && isAdultEducator) {
      if (m.role !== 'parent' && m.role !== 'student' && m.role !== 'educator') {
        return false;
      }
    }
    if (filterRole !== 'all' && m.role !== filterRole) return false;
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.roleLabel && m.roleLabel.toLowerCase().includes(q));
    }
    return true;
  });

  const getPendingForm = (pending) => {
    return pendingSelections[pending.id] || {
      branchId: pending.branchId || currentOrg.folders[1]?.id || '',
      role: pending.role || 'parent',
      addToOrgChart: pending.role === 'educator' || pending.role === 'admin'
    };
  };

  const updatePendingField = (memberId, field, value) => {
    setPendingSelections(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value
      }
    }));
  };

  const handleApproveSubmit = (pending) => {
    const form = getPendingForm(pending);
    approveMember(pending.id, form.branchId, form.role, form.addToOrgChart);
    
    setFeedbackNotice({
      type: 'success',
      text: `✅ ${pending.name} fue aprobado/a e incorporado/a con éxito en la categoría ${form.role}.`
    });

    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4500);
  };

  const handleRejectSubmit = (pending) => {
    if (confirm(`¿Rechazar y descartar la postulación de ${pending.name}?`)) {
      deleteMember(pending.id);
      setFeedbackNotice({
        type: 'info',
        text: `ℹ️ Solicitud de ${pending.name} rechazada.`
      });
      setTimeout(() => {
        setFeedbackNotice(null);
      }, 4000);
    }
  };

  const togglePresentation = (memberId) => {
    setExpandedPresentations(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        borderLeft: '6px solid var(--accent-purple)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-purple">
              <ShieldCheck size={14} />
              Gestión de Permisos & Autoridades
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {orgMembers.length} integrantes registrados
            </span>
            {pendingMembers.length > 0 && (
              <span className="badge badge-warning" style={{ fontWeight: 700 }}>
                ⏳ {pendingMembers.length} esperando aprobación
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '0 0 0.2rem' }}>
            Administración de Miembros y Roles
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
            Autoriza postulantes, revisa su panel de deseos y administra bajas jerárquicas según tu rango.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentTab('organigram')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <Network size={15} style={{ color: 'var(--primary)' }} />
            <span>Ver Organigrama</span>
          </button>

          <button
            onClick={() => setModalConfig({ isOpen: true, type: 'new_member' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.84rem',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>Nuevo Integrante</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK NOTICE BANNER (Evita saltos de foco) */}
      {feedbackNotice && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: feedbackNotice.type === 'success' ? 'var(--primary-light)' : 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          fontSize: '0.86rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <span>{feedbackNotice.text}</span>
        </div>
      )}

      {/* VISUAL METRICS & COMPOSITION GRAPHIC (Siempre en foco y ordenado) */}
      <div className="glass-panel" style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
            <BarChart2 size={16} style={{ color: 'var(--primary)' }} />
            <span>Distribución de Miembros por Categoría</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Total en {currentOrg.name}: <strong>{orgMembers.length} integrantes</strong>
          </span>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div style={{
          height: '10px',
          width: '100%',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-input)',
          display: 'flex',
          overflow: 'hidden'
        }}>
          <div style={{ width: `${pctAdmin}%`, background: '#7c3aed' }} title={`Autoridades: ${countAdmin} (${pctAdmin}%)`} />
          <div style={{ width: `${pctEducator}%`, background: '#15803d' }} title={`Educadores: ${countEducator} (${pctEducator}%)`} />
          <div style={{ width: `${pctParent}%`, background: '#0284c7' }} title={`Familias: ${countParent} (${pctParent}%)`} />
          <div style={{ width: `${pctStudent}%`, background: '#f59e0b' }} title={`Protagonistas: ${countStudent} (${pctStudent}%)`} />
        </div>

        {/* Legend Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.6rem'
        }}>
          <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #7c3aed' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>🏛️ Autoridades</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{countAdmin}</div>
          </div>
          <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #15803d' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>⚜️ Educadores</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{countEducator}</div>
          </div>
          <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #0284c7' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>👨‍👩‍👧 Familias</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{countParent}</div>
          </div>
          <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #f59e0b' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>🎒 Protagonistas</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{countStudent}</div>
          </div>
        </div>
      </div>

      {/* SECTION: PENDING MEMBER AUTHORIZATIONS WITH PRESENTATION & WISHES PANEL */}
      {pendingMembers.length > 0 && (
        <div className="glass-panel" style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--secondary-light)',
          border: '1.5px solid var(--secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '1.08rem', color: 'var(--secondary)', margin: 0 }}>
                Solicitudes Pendientes de Aprobación por Adultos ({pendingMembers.length})
              </h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600 }}>
              Revisar ficha de presentación y asignar rama antes de aprobar
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {pendingMembers.map(pending => {
              const form = getPendingForm(pending);
              const isExpanded = !!expandedPresentations[pending.id];
              const pres = pending.presentation;

              return (
                <div
                  key={pending.id}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  {/* Top Row: Applicant identity & details */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={pending.avatar}
                        alt={pending.name}
                        style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--secondary)' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{pending.name}</strong>
                          <span className="badge badge-warning" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                            Solicitó: {pending.roleLabel || pending.role}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {pending.email} • {pending.phone || 'Sin teléfono'}
                          {pending.birthDate && (
                            <span style={{ marginLeft: '0.4rem', color: 'var(--primary)', fontWeight: 700 }}>
                              • 🎂 {pending.birthDate} ({pending.age !== undefined && pending.age !== null ? `${pending.age} años` : ''})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {canDeleteMember(currentUserRole, pending) && (
                        <button
                          onClick={() => handleRejectSubmit(pending)}
                          style={{
                            padding: '0.45rem 0.8rem',
                            background: 'var(--bg-input)',
                            color: 'var(--accent-rose)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer'
                          }}
                          title="Rechazar y borrar solicitud"
                        >
                          Rechazar Solicitud
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PROMINENT CATEGORY & SUBGROUP ASSIGNMENT CONTROLS */}
                  <div style={{
                    background: 'var(--bg-input)',
                    border: '1.5px solid var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Sparkles size={15} />
                        Configurar Categoría / Nivel de Acceso y Subgrupo para Otorgar:
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Puedes modificar el rol solicitado antes de confirmar la aprobación
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
                      {/* Category selector */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                          1. Cambiar Categoría a Otorgar:
                        </label>
                        <select
                          value={form.role}
                          onChange={e => updatePendingField(pending.id, 'role', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '2px solid var(--primary)',
                            background: 'var(--bg-surface)',
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="parent">👨‍👩‍👧 Familia / Padre / Tutor</option>
                          <option value="student">🎒 Protagonista / Alumno</option>
                          <option value="educator">⚜️ Educador / Docente de Rama</option>
                          {isAuthority && <option value="admin">🏛️ Autoridad / Directivo</option>}
                        </select>
                      </div>

                      {/* Subgroup / Branch selector */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                          2. Asignar Subgrupo / Rama:
                        </label>
                        <select
                          value={form.branchId}
                          onChange={e => updatePendingField(pending.id, 'branchId', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1.5px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            fontWeight: 600,
                            fontSize: '0.86rem',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                          }}
                        >
                          {currentOrg.folders?.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.name} {f.ageRange ? `(${f.ageRange})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Age Suggestion if birthDate is available */}
                    {pending.age !== null && pending.age !== undefined && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span>💡 Sugerencia por edad ({pending.age} años):</span>
                        {(() => {
                          const sug = getSuggestedBranch(pending.age, currentOrg.type);
                          return sug ? (
                            <button
                              type="button"
                              onClick={() => {
                                const matchingFolder = currentOrg.folders?.find(f => f.name.toLowerCase().includes(sug.name.toLowerCase()) || sug.name.toLowerCase().includes(f.name.toLowerCase()));
                                if (matchingFolder) {
                                  updatePendingField(pending.id, 'branchId', matchingFolder.id);
                                }
                              }}
                              style={{
                                padding: '0.2rem 0.55rem',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--primary-light)',
                                color: 'var(--primary-text)',
                                border: '1px solid var(--primary)',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {sug.icon} Asignar recomendada: {sug.name}
                            </button>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* Bottom action row */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)' }}>
                      <button
                        onClick={() => handleApproveSubmit(pending)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.55rem 1.25rem',
                          background: 'var(--primary)',
                          color: '#fff',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          boxShadow: 'var(--shadow-sm)',
                          cursor: 'pointer'
                        }}
                        title="Aprobar e incorporar con la categoría y subgrupo seleccionados"
                      >
                        <UserCheck size={16} />
                        <span>Aprobar e Incorporar con esta Categoría</span>
                      </button>
                    </div>
                  </div>

                  {/* Toggle Button for Presentation & Wishes Panel */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => togglePresentation(pending.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <FileText size={14} />
                      <span>{isExpanded ? 'Ocultar Panel de Presentación y Deseos' : '📋 Ver Panel de Presentación y Deseos del Postulante'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.addToOrgChart}
                        onChange={e => updatePendingField(pending.id, 'addToOrgChart', e.target.checked)}
                      />
                      <span>Vincular también en Organigrama institucional</span>
                    </label>
                  </div>

                  {/* EXPANDED PRESENTATION & WISHES PANEL */}
                  {isExpanded && (
                    <div style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-input)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      borderLeft: '3px solid var(--primary)',
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Presentación personal (Sobre mí):</strong>
                        <div style={{ color: 'var(--text-main)', marginTop: '2px', fontStyle: 'italic' }}>
                          "{pres?.aboutMe || 'No completó presentación inicial.'}"
                        </div>
                      </div>

                      <div>
                        <strong style={{ color: 'var(--primary)' }}>Cosas que desea / Expectativas para el grupo:</strong>
                        <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                          🎯 {pres?.wishes || 'No especificó deseos particulares.'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {pres?.interests && (
                          <span><strong>Intereses / Habilidades:</strong> {pres.interests}</span>
                        )}
                        {pres?.specialNotes && (
                          <span style={{ color: 'var(--accent-rose)' }}><strong>Notas / Alergias:</strong> {pres.specialNotes}</span>
                        )}
                        {pres?.registeredAt && (
                          <span><strong>Fecha de envío:</strong> {pres.registeredAt}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        {/* Role Filters */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: '0.2rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'admin', label: '🏛️ Autoridades' },
            { id: 'educator', label: '⚜️ Educadores' },
            { id: 'parent', label: '👨‍👩‍👧 Familias' },
            { id: 'student', label: '🎒 Protagonistas' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterRole(btn.id)}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: filterRole === btn.id ? 'var(--primary)' : 'transparent',
                color: filterRole === btn.id ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem 0.45rem 2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.82rem'
            }}
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(180px, 1.6fr) 1fr 1fr 1.3fr 85px 125px',
          padding: '0.75rem 1.25rem',
          background: 'var(--bg-input)',
          fontWeight: 700,
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>Integrante</div>
          <div>Contacto</div>
          <div>Categoría / Rol</div>
          <div>Subgrupo / Rama</div>
          <div>Estado</div>
          <div style={{ textAlign: 'right' }}>Acciones</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredMembers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              No se encontraron integrantes que coincidan con los filtros.
            </div>
          ) : (
            filteredMembers.map(member => {
              const isBlocked = member.status === 'blocked';
              const canDeleteThis = canDeleteMember(currentUserRole, member);
              // Autoridades pueden cambiar rama a todos; los educadores pueden cambiar rama a familias y estudiantes
              const canChangeBranch = isAuthority || (isAdultEducator && (member.role === 'parent' || member.role === 'student'));

              return (
                <div
                  key={member.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(180px, 1.6fr) 1fr 1fr 1.3fr 85px 125px',
                    padding: '0.85rem 1.25rem',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    background: isBlocked ? 'var(--accent-rose-light)' : 'transparent',
                    opacity: isBlocked ? 0.75 : 1
                  }}
                >
                  {/* Member Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-full)',
                        objectFit: 'cover',
                        border: '2px solid var(--primary)'
                      }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{member.name}</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {member.roleLabel || member.role}
                      </div>
                      {member.birthDate && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                          🎂 {member.birthDate} ({member.age !== undefined && member.age !== null ? `${member.age} años` : ''})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Mail size={12} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</span>
                    </div>
                    {member.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={12} style={{ flexShrink: 0 }} />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Role / Category Selector */}
                  <div>
                    <select
                      value={member.role}
                      disabled={!isAdmin}
                      onChange={(e) => updateMemberRole(member.id, e.target.value)}
                      style={{
                        padding: '0.3rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface)',
                        fontSize: '0.78rem',
                        color: 'var(--text-main)',
                        fontWeight: 600,
                        cursor: isAdmin ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <option value="admin">🏛️ Autoridad / Directivo</option>
                      <option value="educator">⚜️ Educador / Docente</option>
                      <option value="parent">👨‍👩‍👧 Familia / Padre</option>
                      <option value="student">🎒 Protagonista / Alumno</option>
                    </select>
                  </div>

                  {/* Subgroup / Branch Designation with live selector */}
                  <div>
                    {member.role === 'educator' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {(member.branchIds && member.branchIds.length > 0 ? member.branchIds : [member.branchId]).filter(Boolean).map(bId => {
                            const bFolder = currentOrg.folders?.find(f => f.id === bId);
                            if (!bFolder) return null;
                            return (
                              <span
                                key={bId}
                                style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  background: bFolder.color ? `${bFolder.color}20` : 'var(--primary-light)',
                                  color: bFolder.color || 'var(--primary-text)',
                                  fontWeight: 700,
                                  border: `1px solid ${bFolder.color ? `${bFolder.color}50` : 'var(--primary)'}`
                                }}
                              >
                                {bFolder.name}
                              </span>
                            );
                          })}
                        </div>
                        {canChangeBranch && (
                          <select
                            value=""
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const currentBranches = member.branchIds || (member.branchId ? [member.branchId] : []);
                              const newBranches = currentBranches.includes(e.target.value)
                                ? (currentBranches.length > 1 ? currentBranches.filter(id => id !== e.target.value) : currentBranches)
                                : [...currentBranches, e.target.value];
                              updateMemberBranches(member.id, newBranches);
                              setFeedbackNotice({
                                type: 'success',
                                text: `✅ Grados/ramas actualizados para ${member.name}.`
                              });
                              setTimeout(() => setFeedbackNotice(null), 3500);
                            }}
                            style={{
                              padding: '2px 4px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px dashed var(--secondary)',
                              background: 'transparent',
                              fontSize: '0.72rem',
                              color: 'var(--text-muted)',
                              cursor: 'pointer'
                            }}
                            title="Asignar o quitar grado/rama de trabajo para este educador"
                          >
                            <option value="">+ Grado/Rama (1 o más)</option>
                            {currentOrg.folders?.map(f => {
                              const isAssigned = (member.branchIds || [member.branchId]).includes(f.id);
                              return (
                                <option key={f.id} value={f.id}>
                                  {isAssigned ? `✓ ${f.name} (Quitar)` : `+ ${f.name} (Asignar)`}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      </div>
                    ) : canChangeBranch ? (
                      <select
                        value={member.branchId || currentOrg.folders[0]?.id || ''}
                        onChange={(e) => {
                          updateMemberBranch(member.id, e.target.value);
                          setFeedbackNotice({
                            type: 'success',
                            text: `✅ ${member.name} fue reasignado/a al subgrupo seleccionado con éxito.`
                          });
                          setTimeout(() => setFeedbackNotice(null), 3500);
                        }}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--secondary)',
                          background: 'var(--bg-surface)',
                          fontSize: '0.78rem',
                          color: 'var(--text-main)',
                          fontWeight: 600,
                          width: '100%',
                          cursor: 'pointer'
                        }}
                        title="Designar a qué subgrupo o rama pertenece este integrante"
                      >
                        {currentOrg.folders?.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="badge badge-scout" style={{ fontSize: '0.74rem' }}>
                        {currentOrg.folders?.find(f => f.id === member.branchId)?.name || 'General'}
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isBlocked ? (
                      <span className="badge badge-rose" style={{ fontSize: '0.72rem' }}>
                        <UserX size={12} />
                        Bloqueado
                      </span>
                    ) : (
                      <span className="badge badge-scout" style={{ fontSize: '0.72rem' }}>
                        <CheckCircle size={12} />
                        Activo
                      </span>
                    )}
                  </div>

                  {/* Actions (View Profile, Status Toggle, Hierarchical Deletion) */}
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {/* Full profile button */}
                    <button
                      onClick={() => setInspectedMember(member)}
                      title="Ver ficha completa con presentación, edad y deseos"
                      style={{
                        padding: '0.35rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary-text)',
                        border: '1px solid var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={13} />
                      <span>Ficha</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => toggleMemberStatus(member.id)}
                        title={isBlocked ? "Desbloquear miembro" : "Bloquear acceso"}
                        style={{
                          padding: '0.35rem',
                          borderRadius: 'var(--radius-sm)',
                          background: isBlocked ? 'var(--primary-light)' : 'var(--bg-input)',
                          color: isBlocked ? 'var(--primary-text)' : 'var(--text-muted)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {isBlocked ? <UserCheck size={15} /> : <UserX size={15} />}
                      </button>
                    )}

                    {canDeleteThis ? (
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar definitivamente a ${member.name} (${member.roleLabel || member.role}) de la institución?`)) {
                            deleteMember(member.id);
                          }
                        }}
                        title="Eliminar integrante (Permitido por contar con categoría menor a la tuya)"
                        style={{
                          padding: '0.35rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--accent-rose-light)',
                          color: 'var(--accent-rose)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    ) : (
                      <span 
                        style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }} 
                        title="Protegido: Solo usuarios con una jerarquía mayor pueden dar de baja este perfil"
                      >
                        <Lock size={11} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FULL MEMBER PROFILE INSPECTION MODAL */}
      {inspectedMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '560px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={inspectedMember.avatar}
                  alt={inspectedMember.name}
                  style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 2px' }}>
                    {inspectedMember.name}
                  </h3>
                  <span className="badge badge-purple" style={{ fontSize: '0.74rem' }}>
                    {inspectedMember.roleLabel || inspectedMember.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectedMember(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Personal Data & Contact */}
            <div style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              fontSize: '0.84rem'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                👤 Información de Contacto y Datos Personales:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} style={{ color: 'var(--primary)' }} />
                <span>{inspectedMember.email}</span>
              </div>
              {inspectedMember.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} style={{ color: 'var(--primary)' }} />
                  <span>{inspectedMember.phone}</span>
                </div>
              )}
              {inspectedMember.birthDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎂</span>
                  <span>
                    Fecha de nacimiento: <strong>{inspectedMember.birthDate}</strong>
                    {inspectedMember.age !== undefined && inspectedMember.age !== null ? ` (${inspectedMember.age} años)` : ''}
                  </span>
                </div>
              )}
              {inspectedMember.age !== undefined && inspectedMember.age !== null && (
                <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                  {(() => {
                    const sug = getSuggestedBranch(inspectedMember.age, currentOrg.type);
                    return sug ? `💡 Rama/Grado sugerido por edad: ${sug.icon} ${sug.name} (${sug.range})` : null;
                  })()}
                </div>
              )}
            </div>

            {/* Subgroup / Branch Management inside modal */}
            <div style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                📍 Subgrupo / Rama Asignada:
              </label>
              {(isAuthority || (isAdultEducator && (inspectedMember.role === 'parent' || inspectedMember.role === 'student'))) ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    value={inspectedMember.branchId || currentOrg.folders[0]?.id || ''}
                    onChange={(e) => {
                      updateMemberBranch(inspectedMember.id, e.target.value);
                      setInspectedMember({
                        ...inspectedMember,
                        branchId: e.target.value
                      });
                      setFeedbackNotice({
                        type: 'success',
                        text: `✅ Rama actualizada para ${inspectedMember.name}`
                      });
                      setTimeout(() => setFeedbackNotice(null), 3000);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--secondary)',
                      background: 'var(--bg-surface)',
                      fontWeight: 600,
                      fontSize: '0.86rem',
                      color: 'var(--text-main)'
                    }}
                  >
                    {currentOrg.folders?.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} {f.ageRange ? `(${f.ageRange})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.86rem' }}>
                  {currentOrg.folders?.find(f => f.id === inspectedMember.branchId)?.name || 'General'}
                </div>
              )}
            </div>

            {/* Presentation & Wishes */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.84rem'
            }}>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                  📋 Presentación personal (Sobre mí):
                </strong>
                <p style={{ margin: 0, color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{inspectedMember.presentation?.aboutMe || 'No ingresó presentación inicial.'}"
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '2px' }}>
                  🎯 Cosas que desea / Expectativas:
                </strong>
                <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.4 }}>
                  {inspectedMember.presentation?.wishes || 'No especificó deseos o expectativas especiales.'}
                </p>
              </div>

              {inspectedMember.presentation?.interests && (
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                    🎨 Intereses y Habilidades:
                  </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{inspectedMember.presentation.interests}</span>
                </div>
              )}

              {inspectedMember.presentation?.specialNotes && (
                <div style={{ background: 'var(--accent-rose-light)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ color: 'var(--accent-rose)', display: 'block', marginBottom: '2px' }}>
                    ⚠️ Notas Médicas / Alergias:
                  </strong>
                  <span style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}>{inspectedMember.presentation.specialNotes}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setInspectedMember(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
