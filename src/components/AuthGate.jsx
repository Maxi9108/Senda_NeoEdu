import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  Compass, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Crown,
  Users
} from 'lucide-react';

export const AuthGate = () => {
  const { 
    currentOrg, 
    setIsLoggedIn, 
    setCurrentUserRole,
    data
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'request'
  const [requestSent, setRequestSent] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantRole, setApplicantRole] = useState('parent');
  const [targetBranch, setTargetBranch] = useState(currentOrg.folders[0]?.id || '');

  const handleLogin = (role) => {
    setCurrentUserRole(role);
    setIsLoggedIn(true);
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!applicantName.trim()) return;
    setRequestSent(true);
    setTimeout(() => {
      // Auto login as newly registered pending/parent
      setCurrentUserRole(applicantRole);
      setIsLoggedIn(true);
    }, 2000);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'var(--bg-app)'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '580px',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }}>
        {/* Top Institution Presentation Card */}
        <div style={{
          padding: '2rem 2rem 1.5rem 2rem',
          background: `linear-gradient(135deg, ${currentOrg.color}25, var(--bg-card))`,
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-lg)',
            background: currentOrg.color,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            {currentOrg.type === 'scout' ? <Compass size={36} /> : <GraduationCap size={36} />}
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-surface)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: currentOrg.color,
            marginBottom: '0.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <span>{currentOrg.badge}</span>
          </div>

          <h1 style={{ fontSize: '1.65rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            {currentOrg.name}
          </h1>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45, maxWidth: '440px', margin: '0 auto' }}>
            {currentOrg.description}
          </p>
        </div>

        {/* Restricted Access Explanation */}
        <div style={{ padding: '1.75rem 2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(217, 119, 6, 0.12)',
            border: '1.5px solid rgba(217, 119, 6, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            color: 'var(--text-main)',
            fontSize: '0.86rem',
            lineHeight: 1.45
          }}>
            <Lock size={22} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            <div>
              <strong>Acceso Reservado a la Comunidad</strong>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                Para proteger la seguridad de los jóvenes y familias, el calendario, actividades, fotos y listas de materiales están restringidos para miembros logueados y autorizados.
              </div>
            </div>
          </div>

          {mode === 'login' ? (
            <div>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.85rem',
                textAlign: 'center'
              }}>
                Selecciona tu perfil de acceso para ingresar
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  onClick={() => handleLogin('superadmin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Crown size={20} style={{ color: '#f59e0b' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div>Maximiliano Sánchez</div>
                      <div style={{ fontSize: '0.72rem', color: '#c7d2fe', fontWeight: 500 }}>
                        Super Administrador (maxi0802@gmai.com)
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                    Ingresar
                  </span>
                </button>

                <button
                  onClick={() => handleLogin('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.8rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-text)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: '1px solid rgba(21, 128, 61, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <ShieldCheck size={19} style={{ color: 'var(--primary)' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div>Responsable Institucional / Directivo</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Acceso total de administración y autorizaciones
                      </div>
                    </div>
                  </div>
                  <LogIn size={16} />
                </button>

                <button
                  onClick={() => handleLogin('educator')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Compass size={18} style={{ color: 'var(--primary)' }} />
                    <span>Educador / Docente / Dirigente</span>
                  </div>
                  <LogIn size={16} style={{ color: 'var(--text-muted)' }} />
                </button>

                <button
                  onClick={() => handleLogin('parent')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Users size={18} style={{ color: 'var(--secondary)' }} />
                    <span>Familia / Padre / Madre (Aceptado)</span>
                  </div>
                  <LogIn size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ¿Aún no tienes autorización en este grupo?{' '}
                </span>
                <button
                  onClick={() => setMode('request')}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Solicitar Acceso a la Institución
                </button>
              </div>
            </div>
          ) : (
            <div>
              {requestSent ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle2 size={44} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem' }} />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    ¡Solicitud Enviada con Éxito!
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    El responsable de la institución evaluará tu solicitud. Redirigiéndote...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Solicitar Incorporación
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Marcelo Benítez"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.8rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="tu_email@ejemplo.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.8rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                        Rol que ocupas
                      </label>
                      <select
                        value={applicantRole}
                        onChange={(e) => setApplicantRole(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.8rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem'
                        }}
                      >
                        <option value="parent">Familia / Padre o Madre</option>
                        <option value="student">Protagonista / Alumno</option>
                        <option value="educator">Educador / Docente</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                        Sección o Rama
                      </label>
                      <select
                        value={targetBranch}
                        onChange={(e) => setTargetBranch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.8rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem'
                        }}
                      >
                        {currentOrg.folders?.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      style={{
                        padding: '0.6rem 1rem',
                        background: 'var(--bg-input)',
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '0.6rem 1rem',
                        background: 'var(--primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      Enviar Solicitud
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
