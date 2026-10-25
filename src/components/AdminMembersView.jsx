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
  Clock
} from 'lucide-react';

export const AdminMembersView = () => {
  const { 
    currentOrg, 
    data, 
    isAdmin, 
    currentUserRole, 
    setCurrentUserRole,
    toggleMemberStatus, 
    updateMemberRole, 
    deleteMember, 
    approveMember,
    setModalConfig,
    setCurrentTab
  } = useApp();

  const [filterRole, setFilterRole] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [approvingMemberId, setApprovingMemberId] = useState(null);
  const [approvalBranch, setApprovalBranch] = useState('');
  const [approvalRole, setApprovalRole] = useState('parent');

  // Members for the current organization
  const orgMembers = data.members.filter(m => m.orgId === currentOrg.id);
  const pendingMembers = orgMembers.filter(m => m.status === 'pending');
  const activeAndBlockedMembers = orgMembers.filter(m => m.status !== 'pending');

  const filteredMembers = activeAndBlockedMembers.filter(m => {
    if (filterRole !== 'all' && m.role !== filterRole) return false;
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.roleLabel && m.roleLabel.toLowerCase().includes(q));
    }
    return true;
  });

  const handleApproveSubmit = (memberId) => {
    approveMember(memberId, approvalBranch || currentOrg.folders[1]?.id, approvalRole);
    setApprovingMemberId(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-purple">
              <ShieldCheck size={14} />
              Gestión de Permisos & Autoridades
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {orgMembers.length} integrantes registrados
            </span>
            {pendingMembers.length > 0 && (
              <span className="badge badge-warning">
                {pendingMembers.length} solicitud(es) pendiente(s)
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>Administración de Miembros y Roles</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Autoriza postulantes, asigna a qué rama o grado pertenecen, cambia categorías o suspende accesos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {!isAdmin && (
            <button
              onClick={() => setCurrentUserRole('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-purple-light)',
                color: 'var(--accent-purple)',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid var(--accent-purple)'
              }}
            >
              <Sparkles size={15} />
              <span>Activar Rol Autoridad</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('polls')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            <BarChart2 size={16} style={{ color: 'var(--accent-blue)' }} />
            <span>Gestionar Encuestas</span>
          </button>

          <button
            onClick={() => setModalConfig({ isOpen: true, type: 'new_member' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Plus size={18} />
            <span>Nuevo Integrante</span>
          </button>
        </div>
      </div>

      {/* SECTION: PENDING MEMBER AUTHORIZATIONS */}
      {pendingMembers.length > 0 && (
        <div className="glass-panel" style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--secondary-light)',
          border: '1.5px solid var(--secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} style={{ color: 'var(--secondary)' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary)' }}>
              Solicitudes Pendientes de Autorización por Adultos ({pendingMembers.length})
            </h3>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', marginTop: '-0.4rem' }}>
            Los padres, alumnos o protagonistas requieren ser autorizados por un dirigente o autoridad asignándolos a su subgrupo correspondiente.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingMembers.map(pending => (
              <div
                key={pending.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={pending.avatar}
                    alt={pending.name}
                    style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.96rem', color: 'var(--text-main)' }}>{pending.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {pending.email} • {pending.phone}
                    </div>
                  </div>
                </div>

                {/* Authorization Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <select
                    defaultValue={pending.branchId || currentOrg.folders[1]?.id}
                    onChange={e => setApprovalBranch(e.target.value)}
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    {currentOrg.folders?.map(f => (
                      <option key={f.id} value={f.id}>
                        Asignar a: {f.name}
                      </option>
                    ))}
                  </select>

                  <select
                    defaultValue={pending.role}
                    onChange={e => setApprovalRole(e.target.value)}
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    <option value="parent">Categoría: Familia / Padre</option>
                    <option value="student">Categoría: Protagonista / Alumno</option>
                    <option value="educator">Categoría: Educador / Docente</option>
                  </select>

                  <button
                    onClick={() => handleApproveSubmit(pending.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.9rem',
                      background: 'var(--primary)',
                      color: '#fff',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.82rem'
                    }}
                  >
                    <UserCheck size={15} />
                    <span>Aprobar e Incorporar</span>
                  </button>

                  <button
                    onClick={() => deleteMember(pending.id)}
                    style={{
                      padding: '0.45rem 0.75rem',
                      background: 'var(--bg-input)',
                      color: 'var(--accent-rose)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Role Filters */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          {[
            { id: 'all', label: 'Todos los Miembros' },
            { id: 'admin', label: 'Autoridades' },
            { id: 'educator', label: 'Educadores' },
            { id: 'parent', label: 'Familias' },
            { id: 'student', label: 'Protagonistas' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterRole(btn.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: filterRole === btn.id ? 'var(--primary)' : 'transparent',
                color: filterRole === btn.id ? '#fff' : 'var(--text-muted)'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
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
          gridTemplateColumns: 'minmax(200px, 1.8fr) 1.2fr 1.2fr 1fr 120px',
          padding: '0.85rem 1.25rem',
          background: 'var(--bg-input)',
          fontWeight: 700,
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>Integrante</div>
          <div>Contacto</div>
          <div>Categoría / Rol</div>
          <div>Estado de Cuenta</div>
          <div style={{ textAlign: 'right' }}>Acciones</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredMembers.map(member => {
            const isBlocked = member.status === 'blocked';

            return (
              <div
                key={member.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(200px, 1.8fr) 1.2fr 1.2fr 1fr 120px',
                  padding: '1rem 1.25rem',
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
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-full)',
                      objectFit: 'cover',
                      border: '2px solid var(--primary)'
                    }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.94rem', color: 'var(--text-main)' }}>{member.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {member.roleLabel || member.role}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={13} />
                    <span>{member.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} />
                    <span>{member.phone}</span>
                  </div>
                </div>

                {/* Role / Category Selector */}
                <div>
                  <select
                    value={member.role}
                    disabled={!isAdmin}
                    onChange={(e) => updateMemberRole(member.id, e.target.value)}
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      fontSize: '0.82rem',
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

                {/* Status Badge */}
                <div>
                  {isBlocked ? (
                    <span className="badge badge-rose">
                      <UserX size={13} />
                      Bloqueado
                    </span>
                  ) : (
                    <span className="badge badge-scout">
                      <CheckCircle size={13} />
                      Activo
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => toggleMemberStatus(member.id)}
                        title={isBlocked ? "Desbloquear miembro" : "Bloquear acceso de este miembro"}
                        style={{
                          padding: '0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          background: isBlocked ? 'var(--primary-light)' : 'var(--bg-input)',
                          color: isBlocked ? 'var(--primary-text)' : 'var(--text-muted)'
                        }}
                      >
                        {isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar a ${member.name} definitivamente de la institución?`)) {
                            deleteMember(member.id);
                          }
                        }}
                        title="Eliminar miembro"
                        style={{
                          padding: '0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--accent-rose-light)',
                          color: 'var(--accent-rose)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Protegido
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
