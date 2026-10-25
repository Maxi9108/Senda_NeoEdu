import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Search, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  Compass, 
  GraduationCap, 
  ShieldCheck, 
  PlusCircle, 
  ChevronRight, 
  X, 
  AlertTriangle,
  Send,
  ArrowRight,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Info,
  Layers,
  FileText,
  Rocket
} from 'lucide-react';

export const InstitutionExplorerModal = () => {
  const { 
    institutionExplorerOpen, 
    setInstitutionExplorerOpen,
    data,
    currentUser,
    requestAffiliationToOrg,
    cancelAffiliationRequest,
    requestInstitutionCreation,
    createAndActivateInstitution,
    availableUserOrgs,
    switchUserOrg,
    selectOrg
  } = useApp();

  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'create_org' | 'my_requests'
  
  // Search Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'scout' | 'school'
  const [filterProvince, setFilterProvince] = useState('all');

  // Affiliation Form Inline State
  const [applyingOrgId, setApplyingOrgId] = useState(null);
  const [applyRole, setApplyRole] = useState('educator');
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [applyJurisdiction, setApplyJurisdiction] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // Institution Creation Form State
  const [createSentSuccess, setCreateSentSuccess] = useState(false);
  const [autoActivate, setAutoActivate] = useState(true);
  const [createdOrgData, setCreatedOrgData] = useState(null);
  const [instForm, setInstForm] = useState({
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
    needsAuthorityAssignment: false
  });

  const userEmail = (currentUser?.email || '').toLowerCase().trim();

  // Find all affiliation records for this user in data.members
  const userAffiliations = useMemo(() => {
    if (!currentUser) return [];
    return (data.members || []).filter(m => m.email?.toLowerCase().trim() === userEmail && m.orgId);
  }, [data.members, userEmail, currentUser]);

  // Distinct Provinces for filter
  const provinces = useMemo(() => {
    const list = new Set();
    (data.organizations || []).forEach(o => {
      if (o.province) list.add(o.province);
    });
    return Array.from(list);
  }, [data.organizations]);

  // Filtered Organizations
  const filteredOrgs = useMemo(() => {
    return (data.organizations || []).filter(org => {
      if (org.isBlocked) return false;
      if (filterType !== 'all' && org.type !== filterType) return false;
      if (filterProvince !== 'all' && org.province !== filterProvince) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = org.name.toLowerCase().includes(q);
        const matchCity = org.city?.toLowerCase().includes(q) || org.localidad?.toLowerCase().includes(q);
        const matchProv = org.province?.toLowerCase().includes(q);
        const matchCue = org.cue?.toLowerCase().includes(q);
        const matchBadge = org.badge?.toLowerCase().includes(q);
        return matchName || matchCity || matchProv || matchCue || matchBadge;
      }
      return true;
    });
  }, [data.organizations, filterType, filterProvince, searchQuery]);

  if (!institutionExplorerOpen) return null;

  const handleStartApply = (org) => {
    setApplyingOrgId(org.id);
    const defaultBranch = org.folders?.[1]?.id || org.folders?.[0]?.id || 'f-general';
    setSelectedBranches([defaultBranch]);
    setApplyRole('educator');
    setApplyMessage('');
    setApplyJurisdiction('');
  };

  const handleToggleBranch = (branchId) => {
    setSelectedBranches(prev => 
      prev.includes(branchId) 
        ? prev.filter(b => b !== branchId)
        : [...prev, branchId]
    );
  };

  const handleSubmitAffiliation = (e, org) => {
    e.preventDefault();
    const res = requestAffiliationToOrg({
      orgId: org.id,
      role: applyRole,
      branchIds: selectedBranches,
      jurisdiction: applyJurisdiction,
      message: applyMessage
    });

    if (res.success) {
      setFeedbackNotice({
        type: 'success',
        text: `✅ ${res.message}`
      });
      setApplyingOrgId(null);
    } else {
      setFeedbackNotice({
        type: 'error',
        text: `⚠️ ${res.error}`
      });
    }

    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleCreateOrgSubmit = (e) => {
    e.preventDefault();
    if (!instForm.name.trim()) {
      alert('Por favor completa el nombre de la institución o grupo.');
      return;
    }
    if (!instForm.applicantName.trim()) {
      alert('Por favor completa el nombre del adulto solicitante / responsable.');
      return;
    }

    const payload = {
      ...instForm,
      name: instForm.name.trim(),
      type: instForm.type,
      badge: instForm.badge.trim() || (instForm.type === 'scout' ? 'Grupo Scout' : 'Institución Educativa'),
      cue: instForm.cue.trim() || 'REG-PENDIENTE',
      country: instForm.country.trim() || 'Argentina',
      province: instForm.province.trim() || 'Buenos Aires',
      department: instForm.department.trim() || 'Sede Central',
      partido: instForm.department.trim() || 'Sede Central',
      city: instForm.city.trim() || 'Localidad Principal',
      localidad: instForm.city.trim() || 'Localidad Principal',
      address: instForm.address.trim() || 'Sede Institucional',
      officialEmail: instForm.officialEmail.trim(),
      officialPhone: instForm.officialPhone.trim(),
      description: instForm.description.trim() || 'Institución comprometida con la formación comunitaria.',
      applicantName: instForm.applicantName.trim(),
      applicantDni: instForm.applicantDni.trim() || 'DNI-REG',
      applicantPhone: instForm.applicantPhone.trim() || instForm.officialPhone.trim(),
      applicantEmail: instForm.applicantEmail.trim() || currentUser?.email || '',
      applicantRole: instForm.applicantRole.trim() || (instForm.type === 'scout' ? 'Jefe de Grupo' : 'Director / Responsable'),
      needsAuthorityAssignment: instForm.needsAuthorityAssignment
    };

    if (autoActivate && createAndActivateInstitution) {
      const res = createAndActivateInstitution(payload);
      setCreatedOrgData(res.org);
    } else {
      const res = requestInstitutionCreation(payload);
      setCreatedOrgData({ ...payload, id: res.reqId, pending: true });
    }

    setCreateSentSuccess(true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 7, 14, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '860px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {/* Modal Top Header with NeoFaro gradient */}
        <div style={{
          padding: '1.2rem 1.5rem',
          background: 'var(--gradient-hero)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--faro-cyan), var(--primary))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--faro-glow)',
              flexShrink: 0
            }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
                  Red de Instituciones & Grupos
                </h2>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--faro-cyan-bg)',
                  color: 'var(--faro-cyan-light)',
                  border: '1px solid var(--border-faro)'
                }}>
                  Comunidad Abierta
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Buscá tu institución o grupo para unirte con autorización de adultos, o fundá una nueva sede.
              </p>
            </div>
          </div>

          <button
            onClick={() => setInstitutionExplorerOpen(false)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback Alert Notice */}
        {feedbackNotice && (
          <div style={{
            padding: '0.65rem 1.25rem',
            background: feedbackNotice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            borderBottom: '1px solid var(--border-color)',
            color: feedbackNotice.type === 'success' ? '#34d399' : '#f87171',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>{feedbackNotice.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-sidebar)',
          flexShrink: 0
        }}>
          <button
            onClick={() => { setActiveTab('search'); setCreateSentSuccess(false); }}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: activeTab === 'search' ? 'var(--faro-cyan-light)' : 'var(--text-muted)',
              borderBottom: activeTab === 'search' ? '2px solid var(--faro-cyan)' : '2px solid transparent',
              background: activeTab === 'search' ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <Search size={16} />
            <span>1. Buscar & Solicitar Ingreso</span>
          </button>

          <button
            onClick={() => setActiveTab('create_org')}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: activeTab === 'create_org' ? '#34d399' : 'var(--text-muted)',
              borderBottom: activeTab === 'create_org' ? '2px solid var(--primary)' : '2px solid transparent',
              background: activeTab === 'create_org' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={16} />
            <span>2. Cargar / Fundar Institución</span>
          </button>

          <button
            onClick={() => setActiveTab('my_requests')}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: activeTab === 'my_requests' ? 'var(--secondary-text)' : 'var(--text-muted)',
              borderBottom: activeTab === 'my_requests' ? '2px solid var(--secondary)' : '2px solid transparent',
              background: activeTab === 'my_requests' ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <Clock size={16} />
            <span>3. Mis Solicitudes ({userAffiliations.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {/* ============================================================== */}
          {/* TAB 1: EXPLORAR Y SOLICITAR INGRESO A INSTITUCIÓN EXISTENTE   */}
          {/* ============================================================== */}
          {activeTab === 'search' && (
            <div>
              {/* Filter Controls Bar */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                marginBottom: '1rem',
                background: 'var(--bg-input)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, ciudad, CUE o insignia..."
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem 0.5rem 2.1rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <div style={{ width: '150px' }}>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.5rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <option value="all">Todos los Tipos</option>
                    <option value="scout">⚜️ Grupos Scout</option>
                    <option value="school">🏫 Instituciones Educativas</option>
                  </select>
                </div>

                <div style={{ width: '160px' }}>
                  <select
                    value={filterProvince}
                    onChange={(e) => setFilterProvince(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.5rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <option value="all">Todas las Provincias</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notice regarding Adult Authorization */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                fontSize: '0.78rem',
                color: 'var(--text-main)',
                marginBottom: '1rem'
              }}>
                <Info size={16} style={{ color: 'var(--faro-cyan-light)', flexShrink: 0 }} />
                <span>
                  <strong>Autorización requerida:</strong> Al solicitar unirte a cualquier institución o grupo, los <strong>adultos educadores o directivos ya registrados</strong> de esa sede revisarán tu solicitud para aprobar tu ingreso.
                </span>
              </div>

              {/* Organizations List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {filteredOrgs.length === 0 ? (
                  <div style={{
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <Building2 size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      No se encontraron instituciones con esos filtros
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 1rem' }}>
                      Si tu grupo o colegio aún no figura en la red, podés fundarlo ahora mismo con todos sus datos geográficos.
                    </p>
                    <button
                      onClick={() => setActiveTab('create_org')}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}
                    >
                      🏛️ Cargar / Fundar Nueva Institución
                    </button>
                  </div>
                ) : (
                  filteredOrgs.map(org => {
                    // Check user relationship with this organization
                    const activeAffiliation = (data.members || []).find(m => 
                      m.orgId === org.id && 
                      m.email?.toLowerCase().trim() === userEmail && 
                      m.status === 'active'
                    );
                    const pendingAffiliation = (data.members || []).find(m => 
                      m.orgId === org.id && 
                      m.email?.toLowerCase().trim() === userEmail && 
                      m.status === 'pending'
                    );

                    const isApplyingThis = applyingOrgId === org.id;

                    return (
                      <div
                        key={org.id}
                        className="glass-panel"
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-md)',
                          border: isApplyingThis ? '1px solid var(--faro-cyan)' : '1px solid var(--border-color)',
                          boxShadow: isApplyingThis ? 'var(--faro-glow)' : 'var(--shadow-sm)',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {/* Card Header Bar */}
                        <div style={{
                          padding: '0.9rem 1.15rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: 'var(--radius-md)',
                              background: org.color || (org.type === 'scout' ? '#10b981' : '#0ea5e9'),
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 'var(--shadow-sm)',
                              flexShrink: 0
                            }}>
                              {org.type === 'scout' ? <Compass size={22} /> : <GraduationCap size={22} />}
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <h3 style={{ fontSize: '0.96rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                                  {org.name}
                                </h3>
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'var(--bg-input)',
                                  color: 'var(--text-muted)',
                                  border: '1px solid var(--border-color)'
                                }}>
                                  {org.badge}
                                </span>
                                {org.cue && (
                                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                                    CUE: {org.cue}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                  <MapPin size={12} style={{ color: 'var(--faro-cyan-light)' }} />
                                  {org.city || org.localidad || 'Localidad'}, {org.province || 'Provincia'}
                                </span>
                                <span>•</span>
                                <span>{org.address || 'Sede oficial'}</span>
                                <span>•</span>
                                <span>{(org.folders || []).length} grados/ramas</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button or Membership Status */}
                          <div>
                            {activeAffiliation ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '3px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'rgba(16, 185, 129, 0.15)',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                  color: '#34d399',
                                  fontSize: '0.74rem',
                                  fontWeight: 700
                                }}>
                                  <CheckCircle2 size={12} />
                                  <span>Miembro Activo ({activeAffiliation.role})</span>
                                </span>
                                <button
                                  onClick={() => {
                                    if (switchUserOrg) switchUserOrg(org.id);
                                    else selectOrg(org.id);
                                    setInstitutionExplorerOpen(false);
                                  }}
                                  style={{
                                    padding: '0.35rem 0.65rem',
                                    background: 'var(--faro-cyan-bg)',
                                    border: '1px solid var(--border-faro)',
                                    color: 'var(--faro-cyan-light)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Navegar Sede ➔
                                </button>
                              </div>
                            ) : pendingAffiliation ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '3px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'rgba(245, 158, 11, 0.15)',
                                  border: '1px solid rgba(245, 158, 11, 0.3)',
                                  color: 'var(--secondary-text)',
                                  fontSize: '0.74rem',
                                  fontWeight: 700
                                }}>
                                  <Clock size={12} />
                                  <span>Pendiente de autorización</span>
                                </span>
                                <button
                                  onClick={() => cancelAffiliationRequest(pendingAffiliation.id)}
                                  title="Retirar solicitud"
                                  style={{
                                    padding: '2px 6px',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-muted)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => isApplyingThis ? setApplyingOrgId(null) : handleStartApply(org)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.45rem 0.85rem',
                                  background: isApplyingThis ? 'var(--bg-input)' : 'var(--gradient-faro)',
                                  color: '#ffffff',
                                  borderRadius: 'var(--radius-md)',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  boxShadow: isApplyingThis ? 'none' : 'var(--shadow-sm)'
                                }}
                              >
                                {isApplyingThis ? 'Cerrar' : '🤝 Solicitar Ingreso'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Inline Application Form Drawer */}
                        {isApplyingThis && (
                          <div style={{
                            padding: '1.15rem',
                            background: 'var(--bg-surface)',
                            borderTop: '1px solid var(--border-color)'
                          }}>
                            <form onSubmit={(e) => handleSubmitAffiliation(e, org)} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                              <div style={{
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: 'var(--text-main)',
                                borderBottom: '1px solid var(--border-color)',
                                paddingBottom: '0.35rem'
                              }}>
                                Postulación para unirse a {org.name}
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                                {/* Role to Request */}
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                    ¿En qué categoría te postulas? *
                                  </label>
                                  <select
                                    value={applyRole}
                                    onChange={(e) => setApplyRole(e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      background: 'var(--bg-input)',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: 'var(--radius-sm)',
                                      color: 'var(--text-main)',
                                      fontSize: '0.8rem',
                                      fontWeight: 600
                                    }}
                                  >
                                    <option value="educator">👨‍🏫 Educador / Docente / Dirigente (Adulto)</option>
                                    <option value="parent">👨‍👩‍👧 Familia / Adulto Responsable</option>
                                    <option value="student">🎒 Protagonista / Estudiante</option>
                                    <option value="regional_authority">🏛️ Autoridad Local / Regional / Supervisión</option>
                                  </select>
                                </div>

                                {applyRole === 'regional_authority' && (
                                  <div>
                                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                      Distrito / Jurisdicción supervisada *
                                    </label>
                                    <input
                                      type="text"
                                      value={applyJurisdiction}
                                      onChange={(e) => setApplyJurisdiction(e.target.value)}
                                      placeholder="Ej: Distrito 3 - Zona Norte"
                                      style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.8rem'
                                      }}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Branch Selection (Grados / Ramas) */}
                              <div>
                                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                                  Grado(s) o Rama(s) a los que solicitas pertenecer (un adulto puede estar en 1 o más):
                                </label>
                                <div style={{
                                  display: 'flex',
                                  gap: '0.45rem',
                                  flexWrap: 'wrap',
                                  background: 'var(--bg-input)',
                                  padding: '0.6rem',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--border-color)'
                                }}>
                                  {(org.folders || []).map(f => {
                                    const isSelected = selectedBranches.includes(f.id);
                                    return (
                                      <button
                                        type="button"
                                        key={f.id}
                                        onClick={() => handleToggleBranch(f.id)}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.35rem',
                                          padding: '0.35rem 0.65rem',
                                          borderRadius: 'var(--radius-full)',
                                          background: isSelected ? 'var(--faro-cyan-bg)' : 'var(--bg-card)',
                                          border: isSelected ? '1px solid var(--faro-cyan)' : '1px solid var(--border-color)',
                                          color: isSelected ? 'var(--faro-cyan-light)' : 'var(--text-muted)',
                                          fontSize: '0.75rem',
                                          fontWeight: isSelected ? 700 : 500,
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {isSelected ? <CheckSquare size={13} /> : <Square size={13} />}
                                        <span>{f.name}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Motivation Message */}
                              <div>
                                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                  Mensaje de presentación / motivación para los adultos de la institución (opcional):
                                </label>
                                <textarea
                                  rows={2}
                                  value={applyMessage}
                                  onChange={(e) => setApplyMessage(e.target.value)}
                                  placeholder="Contales a los educadores de esta sede tus expectativas, experiencia o motivos de ingreso..."
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.8rem',
                                    resize: 'vertical'
                                  }}
                                />
                              </div>

                              {/* Action Buttons */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setApplyingOrgId(null)}
                                  style={{
                                    padding: '0.45rem 0.85rem',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-muted)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="submit"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.45rem 1rem',
                                    background: 'var(--gradient-faro)',
                                    color: '#ffffff',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Send size={13} />
                                  <span>Enviar Solicitud a los Adultos</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CARGAR / FUNDAR NUEVA INSTITUCIÓN POR ADULTOS           */}
          {/* ============================================================== */}
          {activeTab === 'create_org' && (
            <div>
              {createSentSuccess ? (
                <div style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {createdOrgData && !createdOrgData.pending 
                      ? `¡${instForm.name} Creada y Habilitada con Éxito!` 
                      : '¡Solicitud de Fundación Enviada!'}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.45 }}>
                    {createdOrgData && !createdOrgData.pending
                      ? 'La institución / grupo ha sido dada de alta y activada en tu cuenta con rol de Responsable Institucional. Ya podés comenzar a cargar integrantes, ramas y planificaciones de inmediato.'
                      : `La institución ${instForm.name} fue enviada con su información geográfica completa al Super Administrador y Administradores Generales para su verificación y activación en la red.`}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {createdOrgData && !createdOrgData.pending ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCreateSentSuccess(false);
                          setInstitutionExplorerOpen(false);
                          if (createdOrgData?.id) {
                            if (switchUserOrg) switchUserOrg(createdOrgData.id);
                            else selectOrg(createdOrgData.id);
                          }
                        }}
                        style={{
                          padding: '0.65rem 1.4rem',
                          background: 'var(--gradient-faro)',
                          color: '#fff',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: 'var(--faro-glow)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Rocket size={16} />
                        <span>Comenzar a Cargar la Institución Ahora</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => { setCreateSentSuccess(false); setActiveTab('search'); }}
                        style={{
                          padding: '0.55rem 1.25rem',
                          background: 'var(--gradient-faro)',
                          color: '#fff',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Volver a Explorar Instituciones
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateOrgSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    fontSize: '0.78rem',
                    color: 'var(--text-main)'
                  }}>
                    <Sparkles size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                    <span>
                      <strong>Alta Institucional:</strong> Como adulto educador o dirigente, podés cargar una nueva institución o grupo completando toda la información geográfica y legal para su alta oficial.
                    </span>
                  </div>

                  {/* Institution Details */}
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building2 size={16} style={{ color: 'var(--faro-cyan-light)' }} />
                      <span>Identidad de la Institución o Grupo</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Nombre de la Institución / Grupo *
                        </label>
                        <input
                          type="text"
                          required
                          value={instForm.name}
                          onChange={(e) => setInstForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Grupo Scout Los Alerces N° 305"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Tipo de Institución *
                        </label>
                        <select
                          value={instForm.type}
                          onChange={(e) => setInstForm(prev => ({ ...prev, type: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        >
                          <option value="scout">⚜️ Grupo Scout / Guía</option>
                          <option value="school">🏫 Institución Educativa / Escuela</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Insignia o Distintivo
                        </label>
                        <input
                          type="text"
                          value={instForm.badge}
                          onChange={(e) => setInstForm(prev => ({ ...prev, badge: e.target.value }))}
                          placeholder="Ej: Distrito 3 - Zona 12"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          CUE / N° Registro Oficial
                        </label>
                        <input
                          type="text"
                          value={instForm.cue}
                          onChange={(e) => setInstForm(prev => ({ ...prev, cue: e.target.value }))}
                          placeholder="Ej: 0604567-00"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Geography & Location */}
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} style={{ color: '#34d399' }} />
                      <span>Ubicación Geográfica y Formal</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          País
                        </label>
                        <input
                          type="text"
                          value={instForm.country}
                          onChange={(e) => setInstForm(prev => ({ ...prev, country: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Provincia *
                        </label>
                        <input
                          type="text"
                          required
                          value={instForm.province}
                          onChange={(e) => setInstForm(prev => ({ ...prev, province: e.target.value }))}
                          placeholder="Ej: Buenos Aires"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Partido / Departamento *
                        </label>
                        <input
                          type="text"
                          required
                          value={instForm.department}
                          onChange={(e) => setInstForm(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="Ej: Vicente López"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Localidad / Ciudad *
                        </label>
                        <input
                          type="text"
                          required
                          value={instForm.city}
                          onChange={(e) => setInstForm(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Ej: Olivos"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Calle y Número (Dirección de Sede) *
                        </label>
                        <input
                          type="text"
                          required
                          value={instForm.address}
                          onChange={(e) => setInstForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Ej: Av. Maipú 1540"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Applicant Details & Authority Check */}
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users size={16} style={{ color: 'var(--secondary-text)' }} />
                      <span>Datos del Adulto Solicitante & Supervisión</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Nombre y Apellido *
                        </label>
                        <input
                          type="text"
                          required
                          value={instForm.applicantName}
                          onChange={(e) => setInstForm(prev => ({ ...prev, applicantName: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          DNI del Solicitante *
                        </label>
                        <input
                          type="text"
                          required
                          value={instForm.applicantDni}
                          onChange={(e) => setInstForm(prev => ({ ...prev, applicantDni: e.target.value }))}
                          placeholder="Ej: 32456789"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Teléfono de Contacto *
                        </label>
                        <input
                          type="tel"
                          required
                          value={instForm.applicantPhone}
                          onChange={(e) => setInstForm(prev => ({ ...prev, applicantPhone: e.target.value }))}
                          placeholder="+54 9 11 ..."
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          Cargo / Rol en la Institución
                        </label>
                        <input
                          type="text"
                          value={instForm.applicantRole}
                          onChange={(e) => setInstForm(prev => ({ ...prev, applicantRole: e.target.value }))}
                          placeholder="Ej: Jefe de Grupo / Educador Fundador"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Needs authority assignment checkbox */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      background: 'var(--bg-input)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <input
                        type="checkbox"
                        id="chkAuthority"
                        checked={instForm.needsAuthorityAssignment}
                        onChange={(e) => setInstForm(prev => ({ ...prev, needsAuthorityAssignment: e.target.checked }))}
                        style={{ marginTop: '3px', cursor: 'pointer' }}
                      />
                      <label htmlFor="chkAuthority" style={{ fontSize: '0.76rem', color: 'var(--text-main)', cursor: 'pointer', lineHeight: 1.35 }}>
                        <strong>Esta institución no cuenta con autoridad directiva inicial designada.</strong><br />
                        <span style={{ color: 'var(--text-muted)' }}>
                          Al marcar esta opción, se emitirá una alerta al Super Administrador / Administradores Generales para evaluar y designar formalmente una autoridad supervisora.
                        </span>
                      </label>
                    </div>
                    {/* Immediate activation toggle */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      background: 'rgba(16, 185, 129, 0.09)',
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      marginTop: '0.65rem'
                    }}>
                      <input
                        type="checkbox"
                        id="chkAutoActivate"
                        checked={autoActivate}
                        onChange={(e) => setAutoActivate(e.target.checked)}
                        style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <label htmlFor="chkAutoActivate" style={{ fontSize: '0.78rem', color: 'var(--text-main)', cursor: 'pointer', lineHeight: 1.4 }}>
                        <strong style={{ color: '#34d399' }}>Habilitar y Activar Inmediatamente (Recomendado):</strong><br />
                        <span style={{ color: 'var(--text-muted)' }}>
                          Crea la institución al instante y te asigna como responsable para que puedas comenzar a cargar integrantes, ramas y cronogramas sin demoras ni trámites de espera.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.7rem 1.6rem',
                        background: 'var(--gradient-faro)',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: 'var(--faro-glow)'
                      }}
                    >
                      <Building2 size={16} />
                      <span>{autoActivate ? 'Crear y Habilitar Institución / Grupo' : 'Registrar y Enviar para Aprobación'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: MIS SOLICITUDES DE AFILIACIÓN                           */}
          {/* ============================================================== */}
          {activeTab === 'my_requests' && (
            <div>
              <div style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '0.75rem'
              }}>
                Historial de Solicitudes y Vinculaciones ({userAffiliations.length})
              </div>

              {userAffiliations.length === 0 ? (
                <div style={{
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Clock size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '0.96rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    Aún no enviaste ninguna solicitud de afiliación
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto 1rem' }}>
                    Explorá las instituciones de la red para unirte como educador, familia o protagonista.
                  </p>
                  <button
                    onClick={() => setActiveTab('search')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--gradient-faro)',
                      color: '#fff',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    🔍 Buscar Instituciones
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {userAffiliations.map(aff => {
                    const org = (data.organizations || []).find(o => o.id === aff.orgId);
                    const isPending = aff.status === 'pending';
                    const isActive = aff.status === 'active';

                    return (
                      <div
                        key={aff.id}
                        className="glass-panel"
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.9rem 1.15rem',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-md)',
                            background: org?.color || '#0ea5e9',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {org?.type === 'scout' ? <Compass size={20} /> : <GraduationCap size={20} />}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                                {org?.name || `Institución ${aff.orgId}`}
                              </h4>
                              <span style={{
                                fontSize: '0.68rem',
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--bg-input)',
                                color: 'var(--text-muted)'
                              }}>
                                Rol: {aff.roleLabel || aff.role}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {aff.presentation?.requestedAt ? `Solicitado el ${aff.presentation.requestedAt}` : 'Solicitud registrada'}
                              {aff.jurisdiction && ` • Jurisdicción: ${aff.jurisdiction}`}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isActive ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                fontSize: '0.74rem',
                                fontWeight: 700
                              }}>
                                <CheckCircle2 size={13} />
                                <span>Aprobado por los adultos</span>
                              </span>
                              <button
                                onClick={() => {
                                  if (switchUserOrg) switchUserOrg(aff.orgId);
                                  else selectOrg(aff.orgId);
                                  setInstitutionExplorerOpen(false);
                                }}
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  background: 'var(--gradient-faro)',
                                  color: '#fff',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Ingresar ➔
                              </button>
                            </div>
                          ) : isPending ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: 'var(--secondary-text)',
                                fontSize: '0.74rem',
                                fontWeight: 700
                              }}>
                                <Clock size={13} />
                                <span>Esperando autorización de adultos</span>
                              </span>
                              <button
                                onClick={() => cancelAffiliationRequest(aff.id)}
                                style={{
                                  padding: '0.3rem 0.55rem',
                                  background: 'var(--bg-input)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-muted)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.7rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: '#f87171' }}>Rechazada</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
