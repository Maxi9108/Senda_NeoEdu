import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  LogIn, 
  Compass, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Crown, 
  Sparkles, 
  UserPlus, 
  Mail, 
  Calendar, 
  Phone, 
  User, 
  FileText,
  Heart,
  CheckCircle2,
  TreePine,
  Lightbulb
} from 'lucide-react';
import { calculateAge } from '../lib/branchAgeHelper';

export const AuthGate = () => {
  const { 
    login,
    registerPersonalAccount
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login form state
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeSessionConflict, setActiveSessionConflict] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Personal Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regAboutMe, setRegAboutMe] = useState('');
  const [regWishes, setRegWishes] = useState('');
  const [regError, setRegError] = useState('');

  const calculatedAge = regBirthDate ? calculateAge(regBirthDate) : null;

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

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Por favor ingresa tu nombre completo y correo electrónico.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }

    const res = registerPersonalAccount({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      birthDate: regBirthDate,
      age: calculatedAge,
      aboutMe: regAboutMe.trim(),
      wishes: regWishes.trim()
    });

    if (!res.success) {
      setRegError(res.error || 'Error al registrar tu cuenta personal.');
    }
  };

  return (
    <div style={{
      height: '100%',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      background: 'radial-gradient(ellipse at top, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.06) 45%, var(--bg-app) 85%)',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        maxWidth: mode === 'register' ? '540px' : '440px',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
        margin: 'auto',
        transition: 'all 0.3s ease'
      }}>
        {/* Header - NeoFaro + Naturaleza + Educación Atmosphere */}
        <div style={{
          padding: '1.75rem 1.5rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(14, 21, 36, 0.95) 100%)',
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Beacon Emblem */}
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--faro-cyan), var(--primary))',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            boxShadow: 'var(--faro-glow)'
          }}>
            <Compass size={30} strokeWidth={2.2} />
          </div>

          {/* Pillars Badges */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-card)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--faro-cyan-light)',
            marginBottom: '0.45rem',
            border: '1px solid var(--border-faro)'
          }}>
            <Sparkles size={12} style={{ color: 'var(--secondary)' }} />
            <span>Naturaleza • Educación • Faro Comunitario</span>
          </div>

          <h1 style={{
            fontSize: '1.45rem',
            color: 'var(--text-main)',
            marginBottom: '0.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}>
            Senda <span style={{ color: 'var(--faro-cyan-light)' }}>Neo</span><span style={{ color: 'var(--primary)' }}>Edu</span>
          </h1>

          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            maxWidth: '380px',
            margin: '0 auto'
          }}>
            {mode === 'login'
              ? 'Portal inteligente de gestión para comunidades educativas y grupos scout.'
              : 'Registrate personalmente para explorar instituciones y solicitar unirte a tu grupo.'}
          </p>
        </div>

        {/* Content Area */}
        <div style={{ padding: '1.5rem' }}>
          {/* ============================================================== */}
          {/* MODE: LOGIN                                                   */}
          {/* ============================================================== */}
          {mode === 'login' ? (
            <div>
              {/* Conflict banner */}
              {activeSessionConflict && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  color: '#fca5a5'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>
                    ⚠️ Sesión activa en otro dispositivo
                  </div>
                  <div style={{ fontSize: '0.75rem', lineHeight: 1.4, marginBottom: '0.6rem' }}>
                    Este usuario ya tiene una sesión abierta iniciada a las {new Date(activeSessionConflict.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleSubmitLogin(e, true)}
                    style={{
                      width: '100%',
                      padding: '0.45rem',
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cerrar otra sesión y acceder aquí
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {loginError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleSubmitLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Correo Electrónico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder="tu.correo@ejemplo.com"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem 0.6rem 2.2rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '0.6rem 2.4rem 0.6rem 2.2rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--gradient-faro)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: 'var(--faro-glow)',
                    cursor: isLoading ? 'wait' : 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  <LogIn size={18} />
                  <span>{isLoading ? 'Verificando...' : 'Iniciar Sesión'}</span>
                </button>
              </form>

              {/* Quick Demo Super Admin Button */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '0.5rem' }}>
                  Acceso directo de administración
                </div>
                <button
                  type="button"
                  onClick={() => handleFillDemo('maxi0802@gmail.com', 'admin123')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    width: '100%',
                    padding: '0.5rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: 'var(--secondary-text)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Crown size={14} style={{ color: 'var(--secondary)' }} />
                  <span>Ingresar como Super Administrador</span>
                </button>
              </div>

              {/* Switch to Register link */}
              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ¿No tenés una cuenta personal aún?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{
                    color: 'var(--faro-cyan-light)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Registrate aquí
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* MODE: REGISTER PERSONAL ACCOUNT (NO INSTITUTION SELECTION)     */
            /* ============================================================== */
            <div>
              {regError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}>
                  {regError}
                </div>
              )}

              <form onSubmit={handleSubmitRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Nombre y Apellido *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ej: Lucía Benítez"
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.5rem 0.5rem 2rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-main)',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Correo Electrónico *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="tu.correo@ejemplo.com"
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.5rem 0.5rem 2rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-main)',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Teléfono de Contacto
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+54 9 11 ..."
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.5rem 0.5rem 2rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-main)',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Fecha de Nacimiento {calculatedAge !== null && `(${calculatedAge} años)`}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                      <input
                        type="date"
                        value={regBirthDate}
                        onChange={(e) => setRegBirthDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.5rem 0.5rem 2rem',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-main)',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Contraseña * (mínimo 6 caracteres)
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Confirmar Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>
                </div>

                {/* Brief Presentation */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Breve presentación personal (opcional):
                  </label>
                  <textarea
                    rows={2}
                    value={regAboutMe}
                    onChange={(e) => setRegAboutMe(e.target.value)}
                    placeholder="Contanos sobre vos, tus intereses o tu vinculación con la educación y el movimiento scout..."
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

                <div style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  fontSize: '0.76rem',
                  color: 'var(--text-main)',
                  lineHeight: 1.35
                }}>
                  🧭 <strong>Vinculación institucional:</strong> Al crear tu cuenta ingresarás a la plataforma y podrás buscar tu colegio o grupo scout para solicitar afiliarte (con autorización de los adultos) o fundar una nueva sede.
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--gradient-nature)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    boxShadow: 'var(--shadow-md)',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  <UserPlus size={18} />
                  <span>Crear Mi Cuenta y Comenzar</span>
                </button>
              </form>

              {/* Back to Login */}
              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ¿Ya tenés una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{
                    color: 'var(--faro-cyan-light)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Iniciar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
