import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateAge, getSuggestedBranch } from '../lib/branchAgeHelper';
import { 
  X, 
  User, 
  Lock, 
  Key, 
  Calendar, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export const UserProfileModal = () => {
  const { 
    currentUser, 
    currentOrg,
    profileModalOpen, 
    setProfileModalOpen, 
    updateUserProfile, 
    changePassword,
    isSuperAdmin 
  } = useApp();

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'security'
  
  // Personal Info Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [personalMsg, setPersonalMsg] = useState(null);

  // Password Change Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setBirthDate(currentUser.birthDate || '');
      setPersonalMsg(null);
      setPasswordMsg(null);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }
  }, [currentUser, profileModalOpen]);

  if (!profileModalOpen || !currentUser) return null;

  const age = calculateAge(birthDate);
  const suggestedBranch = age !== null ? getSuggestedBranch(age, currentOrg.type) : null;

  const handleSavePersonal = (e) => {
    e.preventDefault();
    const res = updateUserProfile({
      name: name.trim(),
      phone: phone.trim(),
      birthDate,
      age
    });

    if (res.success) {
      setPersonalMsg({ type: 'success', text: '¡Datos personales y fecha de nacimiento actualizados correctamente!' });
      setTimeout(() => setPersonalMsg(null), 4000);
    } else {
      setPersonalMsg({ type: 'error', text: res.error || 'No se pudieron guardar los datos.' });
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPass !== confirmPass) {
      setPasswordMsg({ type: 'error', text: 'La nueva contraseña y su confirmación no coinciden.' });
      return;
    }

    if (newPass.length < 4) {
      setPasswordMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 4 caracteres.' });
      return;
    }

    const res = changePassword(currentPass, newPass);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: '✅ ¡Contraseña cambiada con éxito! Ya puedes usar tu nueva clave.' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPasswordMsg(null), 4500);
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'Error al cambiar contraseña.' });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '520px',
        width: '100%',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>
                Mi Perfil & Seguridad
              </h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {currentUser.roleLabel || currentUser.role} • {currentUser.email}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setProfileModalOpen(false)}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtabs: Datos Personales vs Cambio de Contraseña */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: activeTab === 'personal' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'personal' ? 'var(--primary)' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'personal' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <User size={14} />
            <span>Datos Personales & Edad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: activeTab === 'security' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'security' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Key size={14} />
            <span>Cambiar Contraseña</span>
          </button>
        </div>

        {/* TAB 1: DATOS PERSONALES Y VERIFICACIÓN DE EDAD */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSavePersonal} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {personalMsg && (
              <div style={{
                padding: '0.55rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: personalMsg.type === 'success' ? 'var(--primary-light)' : 'var(--accent-rose-light)',
                color: personalMsg.type === 'success' ? 'var(--primary-text)' : 'var(--accent-rose)',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {personalMsg.text}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                Nombre y Apellido
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                  Correo Institucional (Identificador)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-muted)',
                    fontSize: '0.84rem',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                  Teléfono / Celular
                </label>
                <input
                  type="tel"
                  placeholder="+54 9 11..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.86rem'
                  }}
                />
              </div>
            </div>

            {/* FECHA DE NACIMIENTO Y VERIFICACIÓN DE RAMA */}
            <div style={{
              background: 'var(--bg-input)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              {age !== null && suggestedBranch && (
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Edad verificada:
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {age} años
                    </strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{suggestedBranch.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                        Rama / Grupo correspondiente: {suggestedBranch.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Rango oficial: {suggestedBranch.range} ({suggestedBranch.category})
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.25rem',
                padding: '0.6rem 1rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Guardar Datos Personales
            </button>
          </form>
        )}

        {/* TAB 2: CAMBIO DE CONTRASEÑA */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {passwordMsg && (
              <div style={{
                padding: '0.55rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: passwordMsg.type === 'success' ? 'var(--primary-light)' : 'var(--accent-rose-light)',
                color: passwordMsg.type === 'success' ? 'var(--primary-text)' : 'var(--accent-rose)',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                Contraseña Actual *
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Introduce tu clave actual"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                Nueva Contraseña *
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Mínimo 4 caracteres"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                Confirmar Nueva Contraseña *
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Repite la nueva contraseña"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                id="showPassToggle"
                checked={showPass}
                onChange={e => setShowPass(e.target.checked)}
              />
              <label htmlFor="showPassToggle" style={{ cursor: 'pointer' }}>
                Mostrar contraseñas en texto visible
              </label>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.25rem',
                padding: '0.6rem 1rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Lock size={15} />
              <span>Actualizar Contraseña</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
