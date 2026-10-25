import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Crown, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  PlusCircle, 
  Compass, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Users, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';

export const SuperAdminPanel = () => {
  const { 
    data, 
    approveInstitutionBySuperAdmin, 
    rejectInstitutionBySuperAdmin, 
    promoteToInstitutionAdmin,
    requestInstitutionCreation,
    selectOrg,
    activeOrgId,
    setCurrentTab,
    isSuperAdmin,
    isAdvancedAdmin,
    canManageAdvancedAdmins,
    promoteToAdvancedAdmin,
    demoteAdvancedAdmin
  } = useApp();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedOrgFilter, setSelectedOrgFilter] = useState(activeOrgId);

  // Form state for creating a new institution request
  const [instName, setInstName] = useState('');
  const [instType, setInstType] = useState('scout');
  const [instCue, setInstCue] = useState('');
  const [instAddress, setInstAddress] = useState('');
  const [instCity, setInstCity] = useState('');
  const [instProvince, setInstProvince] = useState('');
  const [instEmail, setInstEmail] = useState('');
  const [instPhone, setInstPhone] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantDni, setApplicantDni] = useState('');
  const [applicantRole, setApplicantRole] = useState('Jefe de Grupo Scout');
  const [instDescription, setInstDescription] = useState('');

  const pendingRequests = data.pendingInstitutions || [];
  const currentMembers = data.members.filter(m => m.orgId === selectedOrgFilter);
  const selectedOrg = data.organizations.find(o => o.id === selectedOrgFilter) || data.organizations[0];

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!instName.trim() || !applicantName.trim()) return;

    requestInstitutionCreation({
      name: instName.trim(),
      type: instType,
      cue: instCue.trim() || 'REG-PENDIENTE',
      address: instAddress.trim(),
      city: instCity.trim(),
      province: instProvince.trim(),
      officialEmail: instEmail.trim(),
      officialPhone: instPhone.trim(),
      applicantName: applicantName.trim(),
      applicantDni: applicantDni.trim(),
      applicantRole,
      applicantPhone: instPhone.trim(),
      description: instDescription.trim() || 'Institución comprometida con la educación y formación comunitaria.'
    });

    // Reset
    setInstName('');
    setInstCue('');
    setInstAddress('');
    setInstCity('');
    setInstProvince('');
    setInstEmail('');
    setInstPhone('');
    setApplicantName('');
    setApplicantDni('');
    setInstDescription('');
    setIsRequestModalOpen(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Super Admin Identity Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
          }}>
            <Crown size={32} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <span style={{
                background: '#f59e0b',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase'
              }}>
                Super Administrador de la Plataforma
              </span>
              <span style={{ fontSize: '0.85rem', color: '#c7d2fe' }}>
                Acceso Nacional & Auditoría
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#ffffff', margin: 0 }}>Maximiliano Sánchez</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e0e7ff', fontSize: '0.88rem', marginTop: '0.2rem' }}>
              <Mail size={14} />
              <span>maxi0802@gmai.com</span>
              <span style={{ margin: '0 4px' }}>•</span>
              <ShieldCheck size={14} style={{ color: '#4ade80' }} />
              <span>Autoridad máxima para habilitación de jerarquías e instituciones</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: '#ffffff',
            color: '#1e1b4b',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <PlusCircle size={18} style={{ color: '#d97706' }} />
          <span>Registrar Solicitud Institucional</span>
        </button>
      </div>

      {/* SECTION 1: PENDING INSTITUTIONS APPROVAL QUEUE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Solicitudes de Nuevas Instituciones Pendientes</span>
              <span style={{
                fontSize: '0.8rem',
                background: pendingRequests.length > 0 ? 'var(--secondary)' : 'var(--bg-input)',
                color: pendingRequests.length > 0 ? '#fff' : 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700
              }}>
                {pendingRequests.length} en espera
              </span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Solo las instituciones revisadas y aprobadas por Maximiliano Sánchez tendrán acceso para operar en Senda NeoEdu.
            </p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '2.5rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)'
          }}>
            <CheckCircle2 size={40} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              No hay solicitudes pendientes de aprobación
            </h3>
            <p style={{ fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto 1rem' }}>
              Todas las instituciones registradas han sido validadas. Puedes simular el registro de un nuevo colegio o grupo scout para probar el flujo de aprobación.
            </p>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              style={{
                padding: '0.55rem 1rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              + Simular Solicitud de Nueva Institución
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '1.25rem' }}>
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-surface)',
                  border: '1.5px solid rgba(217, 119, 6, 0.4)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${req.type === 'scout' ? 'badge-scout' : 'badge-edu'}`}>
                        {req.type === 'scout' ? <Compass size={13} /> : <GraduationCap size={13} />}
                        {req.type === 'scout' ? 'Grupo Scout' : 'Institución Educativa'}
                      </span>
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                        ⏳ Pendiente de Aprobación
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      📅 {req.dateRequested}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {req.name}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    <span><strong>CUE/Reg:</strong> {req.cue}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={13} />
                      {req.city}, {req.province} ({req.address})
                    </span>
                  </div>

                  {/* Applicant Details Box */}
                  <div style={{
                    padding: '0.85rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserCheck size={14} style={{ color: 'var(--primary)' }} />
                      <span>Responsable Solicitante: {req.applicantName}</span>
                    </div>
                    <div><strong>Cargo / Jerarquía:</strong> {req.applicantRole} (DNI: {req.applicantDni})</div>
                    <div><strong>Contacto:</strong> {req.officialEmail} | {req.applicantPhone}</div>
                  </div>

                  {req.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontStyle: 'italic' }}>
                      "{req.description}"
                    </p>
                  )}
                </div>

                {/* Approval Actions */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <button
                    onClick={() => approveInstitutionBySuperAdmin(req.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1rem',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Aprobar y Habilitar Institución</span>
                  </button>

                  <button
                    onClick={() => rejectInstitutionBySuperAdmin(req.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--bg-input)',
                      color: 'var(--accent-rose)',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <XCircle size={15} />
                    <span>Rechazar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 1.5: ADVANCED ADMINISTRATORS (ADMINISTRADORES AVANZADOS) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} style={{ color: '#f59e0b' }} />
              <span>Cuerpo de Administradores Avanzados (Delegación Nacional)</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Personas de máxima confianza designadas por Maximiliano Sánchez con casi sus mismos permisos operativos.
            </p>
          </div>

          <div style={{
            background: isSuperAdmin ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-input)',
            border: `1px solid ${isSuperAdmin ? '#f59e0b' : 'var(--border-color)'}`,
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: isSuperAdmin ? '#b45309' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {isSuperAdmin ? (
              <>
                <Crown size={14} style={{ color: '#f59e0b' }} />
                <span>Facultad Exclusiva de Maximiliano Sánchez</span>
              </>
            ) : (
              <>
                <Lock size={14} />
                <span>Solo Lectura (Restringido para Administrador Avanzado)</span>
              </>
            )}
          </div>
        </div>

        {/* Security Rule Card */}
        <div className="glass-panel" style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.04), rgba(245, 158, 11, 0.08))',
          border: '1.5px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>
            <ShieldCheck size={18} style={{ color: '#f59e0b' }} />
            <span>Reglas de Seguridad y Límites del Rol de Administrador Avanzado:</span>
          </div>

          <ul style={{ paddingLeft: '1.5rem', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            <li>
              <strong>Permisos Concedidos:</strong> Tienen facultades operativas casi idénticas a Maximiliano Sánchez: aprobar solicitudes de nuevas instituciones, auditar organizaciones, promover directivos y acceder a la Red Interinstitucional completa.
            </li>
            <li>
              <strong style={{ color: '#b91c1c' }}>Restricción Inviolable 1:</strong> <strong>NO pueden borrar ni modificar al Super Administrador Maximiliano Sánchez (`maxi0802@gmai.com`)</strong> bajo ninguna circunstancia.
            </li>
            <li>
              <strong style={{ color: '#b91c1c' }}>Restricción Inviolable 2:</strong> <strong>NO pueden otorgar ni nombrar a nadie como Administrador Avanzado</strong>. Esta jerarquía solo puede ser concedida directamente por Maximiliano Sánchez.
            </li>
          </ul>
        </div>

        {/* List of Current Advanced Admins */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1rem'
        }}>
          {data.members.filter(m => m.role === 'advanced_admin').map(adv => (
            <div
              key={adv.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                background: 'var(--bg-surface)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={adv.avatar}
                    alt={adv.name}
                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    background: '#f59e0b',
                    color: '#000',
                    borderRadius: 'var(--radius-full)',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Star size={11} fill="#000" />
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.96rem' }}>
                    {adv.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>
                    ⭐ Administrador Avanzado Nacional
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {adv.email} • {adv.phone}
                  </div>
                </div>
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => demoteAdvancedAdmin(adv.id)}
                  title="Revocar designación de Administrador Avanzado"
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--accent-rose)',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                >
                  Revocar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: HIERARCHY LEADERSHIP ROLES & INSTITUTION ADMINS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Habilitación de Cargos de Jerarquía y Responsables Institucionales</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Como Super Administrador, Maximiliano Sánchez puede promover a educadores para que ejerzan como Responsables o Administradores de su institución.
            </p>
          </div>

          {/* Org Selector Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Institución:</span>
            <select
              value={selectedOrgFilter}
              onChange={(e) => setSelectedOrgFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.88rem'
              }}
            >
              {data.organizations.map(o => (
                <option key={o.id} value={o.id}>
                  {o.type === 'scout' ? '⚜️ ' : '🏫 '} {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Members Table for Hierarchy Elevation */}
        <div className="glass-panel" style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Miembro / Educador</th>
                <th style={{ padding: '0.75rem 1rem' }}>Contacto Oficial</th>
                <th style={{ padding: '0.75rem 1rem' }}>Cargo Actual</th>
                <th style={{ padding: '0.75rem 1rem' }}>Acción de Jerarquía (Maximiliano Sánchez)</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.map(m => {
                const isInstitutionAdmin = m.role === 'admin';

                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={m.avatar}
                          alt={m.name}
                          style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{m.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {m.id}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div>{m.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.phone}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${isInstitutionAdmin ? 'badge-scout' : 'badge-edu'}`} style={{ fontWeight: 700 }}>
                        {m.roleLabel || m.role}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {m.role === 'advanced_admin' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', fontWeight: 700 }}>
                            <Star size={15} />
                            <span>⭐ Administrador Avanzado Nacional</span>
                          </div>
                        ) : isInstitutionAdmin ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700 }}>
                            <CheckCircle2 size={16} />
                            <span>Habilitado como Responsable Institucional</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => promoteToInstitutionAdmin(m.id)}
                            style={{
                              padding: '0.45rem 0.85rem',
                              background: 'var(--bg-input)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              color: 'var(--primary)',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              width: 'fit-content'
                            }}
                          >
                            <Crown size={14} style={{ color: '#d97706' }} />
                            <span>Nombrar Responsable Institucional</span>
                          </button>
                        )}

                        {/* Exclusive Button for Maximiliano Sánchez to designate Advanced Admin */}
                        {isSuperAdmin && m.role !== 'advanced_admin' && (
                          <button
                            onClick={() => promoteToAdvancedAdmin(m.id)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              background: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid #f59e0b',
                              borderRadius: 'var(--radius-md)',
                              color: '#b45309',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              width: 'fit-content'
                            }}
                          >
                            <Star size={13} style={{ color: '#f59e0b' }} />
                            <span>Designar como Administrador Avanzado</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FOR NEW INSTITUTION REGISTRATION (Datos requeridos) */}
      {isRequestModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '620px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={22} style={{ color: 'var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>
                    Solicitud de Creación de Institución
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Será enviada para la evaluación y aprobación de Maximiliano Sánchez
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: 'var(--primary-light)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: 'var(--primary-text)',
                lineHeight: 1.4
              }}>
                📋 Para dar de alta una institución se recaban los datos oficiales, registro CUE/nacional, sede y el perfil del solicitante que asumirá la responsabilidad civil/pedagógica.
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Nombre Oficial del Grupo Scout o Colegio *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Grupo Scout N° 340 Cruz del Sur / Colegio Secundario Sarmiento"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Tipo de Institución
                  </label>
                  <select
                    value={instType}
                    onChange={(e) => setInstType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="scout">⚜️ Grupo Scout / Movimiento Guía</option>
                    <option value="school">🏫 Institución Educativa / Colegio</option>
                    <option value="community">🤝 Centro Comunitario / Parroquial</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    CUE / Registro Oficial
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: CUE 0601234 / SAAC N° 458"
                    value={instCue}
                    onChange={(e) => setInstCue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Dirección / Sede
                  </label>
                  <input
                    type="text"
                    placeholder="Av. San Martín 1420"
                    value={instAddress}
                    onChange={(e) => setInstAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Rosario"
                    value={instCity}
                    onChange={(e) => setInstCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Provincia
                  </label>
                  <input
                    type="text"
                    placeholder="Santa Fe"
                    value={instProvince}
                    onChange={(e) => setInstProvince(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div style={{
                padding: '0.85rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                  👤 Datos del Solicitante / Futuro Responsable:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Nombre Completo del Responsable *"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    required
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="DNI / Cédula Identidad *"
                    value={applicantDni}
                    onChange={(e) => setApplicantDni(e.target.value)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <select
                    value={applicantRole}
                    onChange={(e) => setApplicantRole(e.target.value)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  >
                    <option value="Jefe de Grupo Scout">Jefe de Grupo Scout</option>
                    <option value="Director Escolar / Rector">Director Escolar / Rector</option>
                    <option value="Coordinador Pedagógico">Coordinador Pedagógico</option>
                    <option value="Subjefe de Grupo">Subjefe de Grupo</option>
                  </select>

                  <input
                    type="tel"
                    placeholder="Teléfono / WhatsApp Oficial"
                    value={instPhone}
                    onChange={(e) => setInstPhone(e.target.value)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Institucional Oficial"
                  value={instEmail}
                  onChange={(e) => setInstEmail(e.target.value)}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Fundamentación / Breve Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve reseña de la institución, cantidad aproximada de alumnos/scouts y ramas que abrirán..."
                  value={instDescription}
                  onChange={(e) => setInstDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.86rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.15rem',
                    background: 'var(--bg-input)',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.88rem'
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
                    fontSize: '0.88rem'
                  }}
                >
                  Enviar a Revisión de Maximiliano Sánchez
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
