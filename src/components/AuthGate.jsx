import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  ShieldCheck, 
  LogIn, 
  Compass, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  EyeOff,
  Crown,
  KeyRound,
  Users,
  Info,
  Calendar,
  Building2,
  MapPin,
  Clock,
  CheckSquare,
  Square
} from 'lucide-react';
import { calculateAge, getSuggestedBranch } from '../lib/branchAgeHelper';

export const AuthGate = () => {
  const { 
    currentOrg, 
    login,
    registerApplicant,
    requestInstitutionCreation,
    setIsLoggedIn, 
    setCurrentUserRole,
    data
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'request' | 'create_org'
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeSessionConflict, setActiveSessionConflict] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Request mode state & Presentation Panel
  const [requestSent, setRequestSent] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantBirthDate, setApplicantBirthDate] = useState('');
  const [applicantPassword, setApplicantPassword] = useState('');
  const [applicantRole, setApplicantRole] = useState('parent');
  const [targetBranch, setTargetBranch] = useState(currentOrg.folders[0]?.id || '');
  const [applicantAboutMe, setApplicantAboutMe] = useState('');
  const [applicantWishes, setApplicantWishes] = useState('');
  const [applicantInterests, setApplicantInterests] = useState('');
  const [applicantNotes, setApplicantNotes] = useState('');
  // Regional authority jurisdiction and multi-org selection
  const [regionalJurisdiction, setRegionalJurisdiction] = useState('');
  const [selectedRegionalOrgs, setSelectedRegionalOrgs] = useState([currentOrg.id]);

  // Institution Creation Mode State
  const [createOrgSent, setCreateOrgSent] = useState(false);
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
    applicantName: '',
    applicantDni: '',
    applicantPhone: '',
    applicantEmail: '',
    applicantRole: 'Educador Adulto Fundador',
    needsAuthorityAssignment: false
  });

  const applicantAge = applicantBirthDate ? calculateAge(applicantBirthDate) : null;
  const suggestedBranch = applicantAge !== null ? getSuggestedBranch(applicantAge, currentOrg?.type) : null;

  const handleSubmitLogin = (e, forceTakeover = false) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    const res = login(emailOrUser, password, forceTakeover);
    setIsLoading(false);

    if (!res.success) {
      if (res.code === 'SESSION_ALREADY_ACTIVE') {
        setActiveSessionConflict(res.existingSession);
      } else {
        setLoginError(res.error || 'Credenciales inválidas');
      }
    } else {
      setActiveSessionConflict(null);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmailOrUser(demoEmail);
    setPassword(demoPass);
    setLoginError('');
    setActiveSessionConflict(null);
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim()) return;

    registerApplicant({
      name: applicantName.trim(),
      email: applicantEmail.trim(),
      phone: applicantPhone.trim(),
      birthDate: applicantBirthDate,
      age: applicantAge,
      role: applicantRole,
      branchId: targetBranch,
      password: applicantPassword || '123456',
      aboutMe: applicantAboutMe.trim(),
      wishes: applicantWishes.trim(),
      interests: applicantInterests.trim(),
      specialNotes: applicantNotes.trim(),
      jurisdiction: applicantRole === 'regional_authority' ? regionalJurisdiction.trim() : '',
      requestedOrgIds: applicantRole === 'regional_authority' ? selectedRegionalOrgs : [currentOrg.id]
    });

    setRequestSent(true);
  };

  const handleCreateOrgSubmit = (e) => {
    e.preventDefault();
    if (!instForm.name.trim() || !instForm.applicantName.trim() || !instForm.applicantEmail.trim()) {
      alert('Por favor completa el nombre de la institución y los datos del adulto solicitante.');
      return;
    }

    requestInstitutionCreation({
      ...instForm,
      name: instForm.name.trim(),
      type: instForm.type,
      badge: instForm.badge.trim() || (instForm.type === 'scout' ? 'Grupo Scout' : 'Institución Educativa'),
      cue: instForm.cue.trim() || 'REG-PENDIENTE',
      country: instForm.country.trim() || 'Argentina',
      province: instForm.province.trim(),
      department: instForm.department.trim(),
      city: instForm.city.trim(),
      address: instForm.address.trim(),
      officialEmail: instForm.officialEmail.trim(),
      officialPhone: instForm.officialPhone.trim(),
      description: instForm.description.trim() || 'Institución comprometida con la formación comunitaria.',
      applicantName: instForm.applicantName.trim(),
      applicantDni: instForm.applicantDni.trim(),
      applicantPhone: instForm.applicantPhone.trim(),
      applicantEmail: instForm.applicantEmail.trim(),
      applicantRole: instForm.applicantRole.trim(),
      needsAuthorityAssignment: instForm.needsAuthorityAssignment
    });

    setCreateOrgSent(true);
  };

  return (
    <div style={{
      height: '100%',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'var(--bg-app)',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        maxWidth: mode === 'create_org' ? '680px' : '520px',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
        margin: 'auto'
      }}>
        {/* Top Header Card */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: `linear-gradient(135deg, ${currentOrg.color}25, var(--bg-card))`,
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: currentOrg.color,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.6rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {currentOrg.type === 'scout' ? <Compass size={28} /> : <GraduationCap size={28} />}
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-surface)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.74rem',
            fontWeight: 700,
            color: currentOrg.color,
            marginBottom: '0.35rem',
            border: '1px solid var(--border-color)'
          }}>
            <span>{currentOrg.badge}</span>
          </div>

          <h1 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {currentOrg.name}
          </h1>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.35, maxWidth: '400px', margin: '0 auto' }}>
            {currentOrg.description}
          </p>
        </div>

        {/* Content Area */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {mode === 'login' ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(217, 119, 6, 0.08)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                color: 'var(--text-main)',
                fontSize: '0.78rem'
              }}>
                <Lock size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                <span>
                  <strong>Acceso restringido:</strong> Inicia sesión con tus credenciales asignadas. No se permite compartir sesiones simultáneas.
                </span>
              </div>

              {/* Active Session Conflict Alert */}
              {activeSessionConflict && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1.5px solid #ef4444',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.84rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <AlertTriangle size={18} />
                    <span>Usuario ya en uso en otra sesión</span>
                  </div>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    Existe una sesión activa para este usuario iniciada a las {new Date(activeSessionConflict.loginTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Por motivos de seguridad y privacidad institucional, no se permite que dos personas usen la misma cuenta al mismo tiempo.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleSubmitLogin(null, true)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        background: '#dc2626',
                        color: '#fff',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}
                    >
                      Cerrar sesión previa e ingresar aquí
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSessionConflict(null)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        background: 'var(--bg-input)',
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Login Error Display */}
              {loginError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid #ef4444',
                  color: '#b91c1c',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertTriangle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Credentials Form */}
              <form onSubmit={(e) => handleSubmitLogin(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                    Usuario o Correo Institucional
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: maxi0802@gmail.com o jefatura@scout142.org"
                    value={emailOrUser}
                    onChange={(e) => { setEmailOrUser(e.target.value); setLoginError(''); }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                    Contraseña / PIN de Seguridad
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Introduce tu contraseña"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                      style={{
                        width: '100%',
                        padding: '0.55rem 2.2rem 0.55rem 0.8rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        color: 'var(--text-muted)',
                        padding: '2px'
                      }}
                      title={showPassword ? 'Ocultar' : 'Mostrar'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    marginTop: '0.35rem',
                    padding: '0.65rem 1rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: isLoading ? 'wait' : 'pointer'
                  }}
                >
                  <LogIn size={18} />
                  <span>{isLoading ? 'Verificando...' : 'Identificarse e Iniciar Sesión'}</span>
                </button>
              </form>

              {/* Demo Accounts Helper Accordion */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <KeyRound size={13} style={{ color: 'var(--primary)' }} />
                    <span>Cuentas institucionales para prueba de acceso</span>
                  </span>
                  <span>{showDemoAccounts ? '▲ Ocultar' : '▼ Ver'}</span>
                </button>

                {showDemoAccounts && (
                  <div style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    background: 'var(--bg-input)',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem'
                  }}>
                    <div
                      onClick={() => handleFillDemo('maxi0802@gmail.com', 'admin123')}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)'
                      }}
                      title="Haz clic para cargar credenciales de Super Admin"
                    >
                      <div>
                        <strong>👑 Super Admin:</strong> maxi0802@gmail.com
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Clave: admin123</div>
                      </div>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Cargar</span>
                    </div>

                    <div
                      onClick={() => handleFillDemo('jefatura@scout142.org', 'admin123')}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)'
                      }}
                      title="Haz clic para cargar credenciales de Directivo"
                    >
                      <div>
                        <strong>🏛️ Directivo / Resp.:</strong> jefatura@scout142.org
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Clave: admin123</div>
                      </div>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Cargar</span>
                    </div>

                    <div
                      onClick={() => handleFillDemo('unidad@scout142.org', 'educador123')}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)'
                      }}
                      title="Haz clic para cargar credenciales de Educador"
                    >
                      <div>
                        <strong>⚜️ Educador:</strong> unidad@scout142.org
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Clave: educador123</div>
                      </div>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Cargar</span>
                    </div>

                    <div
                      onClick={() => handleFillDemo('patricia.herrera@email.com', 'familia123')}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)'
                      }}
                      title="Haz clic para cargar credenciales de Familia"
                    >
                      <div>
                        <strong>👨‍👩‍👧 Familia:</strong> patricia.herrera@email.com
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Clave: familia123</div>
                      </div>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Cargar</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Solicitar incorporación & Fundar Institución */}
              <div style={{ textAlign: 'center', marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ¿Aún no tienes cuenta en este grupo?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMode('request')}
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Solicitar Incorporación
                  </button>
                </div>

                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('create_org');
                      setCreateOrgSent(false);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.82rem',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      background: 'var(--primary-light)',
                      border: '1.5px solid var(--primary)',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Building2 size={16} />
                    <span>🏛️ Fundar / Registrar Nueva Institución o Grupo</span>
                  </button>
                </div>
              </div>
            </div>
          ) : mode === 'request' ? (
            <div>
              {requestSent ? (
                <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      ¡Ficha de Presentación Enviada!
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.4, maxWidth: '420px', margin: '0 auto' }}>
                      Hola <strong>{applicantName}</strong>, tu postulación y panel de presentación han sido registrados en estado <strong>PENDIENTE</strong>.
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--secondary-light)',
                    border: '1px solid var(--secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    width: '100%'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={15} />
                      <span>Revisión Obligatoria por Adultos del Grupo</span>
                    </div>
                    <div>
                      Para proteger la seguridad y el cuidado de los integrantes, <strong>un educador adulto o autoridad de {currentOrg.name}</strong> revisará tu panel de deseos y aprobará tu incorporación.
                    </div>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Podrás iniciar sesión con tu correo (<strong>{applicantEmail}</strong>) en cuanto tu cuenta sea habilitada.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRequestSent(false);
                      setMode('login');
                      setEmailOrUser(applicantEmail);
                    }}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.65rem 1rem',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    ← Volver a la Pantalla de Ingreso
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Ficha de Registro & Panel de Presentación
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Completa tus datos personales y preséntate para que los adultos del grupo o escuela evalúen tu ingreso.
                    </p>
                  </div>

                  {/* Datos Básicos */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Sofía Herrera"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+54 9 11 1234-5678"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tu_email@ejemplo.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                        Contraseña de acceso *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 6 caracteres"
                        value={applicantPassword}
                        onChange={(e) => setApplicantPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Datos Personales: Fecha de Nacimiento y Verificación de Grupo por Edad */}
                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          📅 Fecha de Nacimiento
                        </label>
                        <input
                          type="date"
                          value={applicantBirthDate}
                          onChange={(e) => setApplicantBirthDate(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.4rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-input)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          🎂 Edad & Verificación de Rama
                        </label>
                        <div style={{
                          padding: '0.4rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          background: applicantAge !== null ? 'var(--primary-light)' : 'var(--bg-input)',
                          border: `1px solid ${applicantAge !== null ? 'var(--primary-border)' : 'var(--border-color)'}`,
                          color: applicantAge !== null ? 'var(--primary-text)' : 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          minHeight: '32px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {applicantAge !== null ? (
                            <span>{applicantAge} años • {suggestedBranch?.branchName}</span>
                          ) : (
                            <span style={{ fontSize: '0.74rem' }}>Ingresa fecha para verificar</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {suggestedBranch && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                        ⚜️ Por rango etario ({suggestedBranch.ageRange}), tu grupo o rama correspondiente es <strong>{suggestedBranch.branchName}</strong>.
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                        Categoría / Rol *
                      </label>
                      <select
                        value={applicantRole}
                        onChange={(e) => setApplicantRole(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem',
                          fontWeight: 600
                        }}
                      >
                        <option value="parent">👨‍👩‍👧 Familia / Padre o Madre</option>
                        <option value="student">🎒 Protagonista / Alumno</option>
                        <option value="educator">⚜️ Educador / Docente</option>
                        <option value="regional_authority">🏛️ Autoridad Local / Regional / Supervisión Distrital</option>
                      </select>
                    </div>

                    {applicantRole !== 'regional_authority' && (
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Sección o Rama de Interés
                        </label>
                        <select
                          value={targetBranch}
                          onChange={(e) => setTargetBranch(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-input)',
                            color: 'var(--text-main)',
                            fontSize: '0.84rem',
                            fontWeight: 600
                          }}
                        >
                          {currentOrg.folders?.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Panel Especial para Autoridad Local / Regional */}
                  {applicantRole === 'regional_authority' && (
                    <div style={{
                      background: 'rgba(124, 58, 237, 0.08)',
                      border: '1.5px solid #7c3aed',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7c3aed', fontWeight: 700, fontSize: '0.84rem' }}>
                        <Building2 size={16} />
                        <span>Ámbito de Supervisión de Autoridad Regional / Distrital</span>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Distrito, Zona o Jurisdicción *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Distrito Scout 4 - Zona Norte o Supervisión Escolar Región 1"
                          value={regionalJurisdiction}
                          onChange={(e) => setRegionalJurisdiction(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                          Instituciones o Grupos a Supervisar (selecciona las sedes solicitadas):
                        </label>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                          background: 'var(--bg-surface)',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          maxHeight: '130px',
                          overflowY: 'auto'
                        }}>
                          {data.organizations.map(org => {
                            const isSelected = selectedRegionalOrgs.includes(org.id);
                            return (
                              <label
                                key={org.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                  fontSize: '0.78rem',
                                  color: 'var(--text-main)',
                                  cursor: 'pointer',
                                  padding: '0.25rem 0.35rem',
                                  borderRadius: 'var(--radius-sm)',
                                  background: isSelected ? 'var(--primary-light)' : 'transparent'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedRegionalOrgs(prev => [...prev, org.id]);
                                    } else {
                                      if (selectedRegionalOrgs.length > 1) {
                                        setSelectedRegionalOrgs(prev => prev.filter(id => id !== org.id));
                                      }
                                    }
                                  }}
                                  style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                                <span style={{ fontWeight: isSelected ? 700 : 500 }}>
                                  {org.type === 'scout' ? '⚜️ ' : '🏫 '} {org.name}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                        ℹ️ <em>Una vez aprobada tu acreditación por el Super Administrador o Directivos, podrás navegar y supervisar cada una de estas instituciones, así como fundar/cargar nuevas dentro de tu jurisdicción.</em>
                      </div>
                    </div>
                  )}

                  {/* PANEL DE PRESENTACIÓN Y DESEOS */}
                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1.5px dashed var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>
                      <Users size={15} />
                      <span>Panel de Presentación & Deseos para la Institución</span>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                        Preséntate brevemente (¿Quién eres y qué te motiva a unirte?) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder={applicantRole === 'student' 
                          ? "Ej: Tengo 14 años, me gusta la aventura, acampar y aprender sobre naturaleza y fogones..." 
                          : "Ej: Soy mamá/papá de... Nos mudamos al barrio y queremos que participe de un espacio formativo..."}
                        value={applicantAboutMe}
                        onChange={(e) => setApplicantAboutMe(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.82rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                        ¿Qué cosas deseas realizar o esperas lograr en el grupo? *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Ej: Deseo aprender nudos, ir al campamento de verano, colaborar en las rifas, etc."
                        value={applicantWishes}
                        onChange={(e) => setApplicantWishes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.82rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                          Intereses / Habilidades
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Música, cocina, deportes"
                          value={applicantInterests}
                          onChange={(e) => setApplicantInterests(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.35rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-input)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                          Alergias o notas especiales
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Alergia al polen, celiaquía"
                          value={applicantNotes}
                          onChange={(e) => setApplicantNotes(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.35rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-input)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      style={{
                        padding: '0.55rem 0.9rem',
                        background: 'var(--bg-input)',
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '0.55rem 1rem',
                        background: 'var(--primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      Enviar Ficha para Aprobación
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div>
              {createOrgSent ? (
                <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      ¡Solicitud de Fundación Registrada con Éxito!
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.45, maxWidth: '480px', margin: '0 auto' }}>
                      La institución <strong>"{instForm.name}"</strong> ha sido registrada en el sistema y remitida a la mesa de auditoría del Super Administrador Maximiliano Sánchez (<code>maxi0802@gmail.com</code>) y Administradores Generales.
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    width: '100%'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700 }}>
                      <Building2 size={16} />
                      <span>Resumen de la Nueva Institución:</span>
                    </div>
                    <div>
                      📍 <strong>Ubicación:</strong> {[instForm.address, instForm.city, instForm.department, instForm.province, instForm.country].filter(Boolean).join(', ')}
                    </div>
                    <div>
                      👤 <strong>Adulto Solicitante:</strong> {instForm.applicantName} (DNI: {instForm.applicantDni || 'No informado'}) — {instForm.applicantRole}
                    </div>
                    <div>
                      🏛️ <strong>Supervisión de Autoridad:</strong> {instForm.needsAuthorityAssignment ? (
                        <span style={{ color: '#b45309', fontWeight: 700 }}>
                          ⚠️ Solicitada designación de autoridad supervisora por la plataforma (se emitirá alerta al Super Admin).
                        </span>
                      ) : (
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                          El solicitante asumirá la responsabilidad directiva inicial tras la aprobación.
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCreateOrgSent(false);
                      setMode('login');
                    }}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.65rem 1rem',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    ← Volver a la Pantalla de Ingreso
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateOrgSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Building2 size={20} style={{ color: 'var(--primary)' }} />
                      <span>Fundar / Solicitar Alta de Nueva Institución o Grupo</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                      Completa la información formal, geográfica y de la persona adulta que solicita la habilitación para someterla a evaluación del Super Administrador.
                    </p>
                  </div>

                  {/* Bloque 1: Datos Institucionales */}
                  <div style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Compass size={15} />
                      <span>1. Identidad Institucional</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Tipo de Sede *
                        </label>
                        <select
                          value={instForm.type}
                          onChange={(e) => setInstForm(prev => ({ ...prev, type: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem',
                            fontWeight: 700
                          }}
                        >
                          <option value="scout">⚜️ Grupo Scout</option>
                          <option value="edu">🏫 Colegio / Escuela</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Nombre Oficial de la Institución o Grupo *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={instForm.type === 'scout' ? "Ej: Grupo Scout Ceferino Namuncurá N° 88" : "Ej: Instituto Secundario Manuel Belgrano"}
                          value={instForm.name}
                          onChange={(e) => setInstForm(prev => ({ ...prev, name: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Distintivo / Lema / Distrito
                        </label>
                        <input
                          type="text"
                          placeholder={instForm.type === 'scout' ? "Ej: Distrito 2 - Zona Oeste" : "Ej: Orientación en Ciencias Sociales"}
                          value={instForm.badge}
                          onChange={(e) => setInstForm(prev => ({ ...prev, badge: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          CUE / Registro Oficial
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: 0601244-0 o REG-SCOUT-88"
                          value={instForm.cue}
                          onChange={(e) => setInstForm(prev => ({ ...prev, cue: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bloque 2: Ubicación Geográfica Completa */}
                  <div style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} />
                      <span>2. Ubicación Geográfica & Domicilio</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          País *
                        </label>
                        <input
                          type="text"
                          required
                          value={instForm.country}
                          onChange={(e) => setInstForm(prev => ({ ...prev, country: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Provincia *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Buenos Aires, Córdoba, Santa Fe..."
                          value={instForm.province}
                          onChange={(e) => setInstForm(prev => ({ ...prev, province: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Partido / Departamento *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: San Isidro, Rosario, Capital..."
                          value={instForm.department}
                          onChange={(e) => setInstForm(prev => ({ ...prev, department: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Localidad / Ciudad *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Boulogne, Olivos, Alta Gracia..."
                          value={instForm.city}
                          onChange={(e) => setInstForm(prev => ({ ...prev, city: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                        Calle y Número (Domicilio Institucional) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Av. Santa Fe 1234"
                        value={instForm.address}
                        onChange={(e) => setInstForm(prev => ({ ...prev, address: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-main)',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Teléfono Oficial
                        </label>
                        <input
                          type="tel"
                          placeholder="+54 11 4742-1234"
                          value={instForm.officialPhone}
                          onChange={(e) => setInstForm(prev => ({ ...prev, officialPhone: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Correo Oficial de la Sede
                        </label>
                        <input
                          type="email"
                          placeholder="contacto@institucion.org"
                          value={instForm.officialEmail}
                          onChange={(e) => setInstForm(prev => ({ ...prev, officialEmail: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bloque 3: Datos del Adulto Solicitante */}
                  <div style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShieldCheck size={15} />
                      <span>3. Datos del Adulto Solicitante del Alta</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Nombre Completo del Adulto *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Marcelo Benítez"
                          value={instForm.applicantName}
                          onChange={(e) => setInstForm(prev => ({ ...prev, applicantName: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          DNI / Documento *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: 29.883.120"
                          value={instForm.applicantDni}
                          onChange={(e) => setInstForm(prev => ({ ...prev, applicantDni: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Teléfono de Contacto *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+54 9 11 5566-7788"
                          value={instForm.applicantPhone}
                          onChange={(e) => setInstForm(prev => ({ ...prev, applicantPhone: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="marcelo@ejemplo.com"
                          value={instForm.applicantEmail}
                          onChange={(e) => setInstForm(prev => ({ ...prev, applicantEmail: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                        Cargo / Rol actual en la institución postulada
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Jefe de Grupo Postulante, Director Pedagógico, Educador Adulto Fundador"
                        value={instForm.applicantRole}
                        onChange={(e) => setInstForm(prev => ({ ...prev, applicantRole: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-main)',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Bloque 4: Alerta y Designación de Autoridades */}
                  <div style={{
                    background: instForm.needsAuthorityAssignment ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-input)',
                    border: `1.5px solid ${instForm.needsAuthorityAssignment ? '#d97706' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={instForm.needsAuthorityAssignment}
                        onChange={(e) => setInstForm(prev => ({ ...prev, needsAuthorityAssignment: e.target.checked }))}
                        style={{ marginTop: '3px', accentColor: '#d97706', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          🏛️ Solicitar que el Super Administrador / Administradores Generales designen una autoridad supervisora
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.35, marginTop: '2px' }}>
                          Al marcar esta casilla, serás registrado como Educador Adulto y la institución quedará con una <strong>alerta institucional de falta de directivo</strong> para que el Super Administrador o una autoridad distrital evalúe el curso y designe la supervisión directiva oficial. Si no la marcas, asumirás como Responsable Institucional directo tras la aprobación.
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Botones de acción */}
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      style={{
                        padding: '0.55rem 0.9rem',
                        background: 'var(--bg-input)',
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '0.55rem 1rem',
                        background: 'var(--primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      Enviar Solicitud de Fundación al Super Administrador
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
