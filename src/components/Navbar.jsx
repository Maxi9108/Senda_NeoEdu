import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  GraduationCap, 
  Search, 
  Sun, 
  Moon, 
  Trees, 
  Type, 
  Download, 
  FolderOpen, 
  ShieldCheck, 
  Users, 
  Share2, 
  Crown, 
  LogOut, 
  LogIn, 
  Palette, 
  Cloud, 
  RefreshCw, 
  Check, 
  ExternalLink, 
  Star, 
  UserCheck,
  Eye,
  Building2
} from 'lucide-react';

export const Navbar = () => {
  const { 
    data, 
    activeOrgId, 
    selectOrg, 
    availableUserOrgs,
    switchUserOrg,
    currentOrg, 
    activeFolderId, 
    setActiveFolderId,
    theme, 
    setTheme, 
    fontSize, 
    setFontSize,
    searchQuery,
    setSearchQuery,
    setBackupModalOpen,
    setShareModalOpen,
    setOrgCustomizationModalOpen,
    setInstitutionExplorerOpen,
    currentUser,
    currentUserRole,
    isAdmin,
    isSuperAdmin,
    isAdvancedAdmin,
    isLoggedIn,
    logout,
    driveSyncState,
    lastDriveSync,
    syncWithDriveNow,
    setProfileModalOpen,
    previewRole,
    setPreviewRole,
    exitPreviewMode,
    isRealAdult
  } = useApp();

  const [previewMenuOpen, setPreviewMenuOpen] = useState(false);

  const handleFontSizeCycle = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('extra-large');
    else setFontSize('normal');
  };

  const getRoleBadge = () => {
    if (isSuperAdmin) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          padding: '1px 6px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#000',
          fontSize: '0.7rem',
          fontWeight: 800
        }}>
          <Crown size={11} />
          <span>Admin</span>
        </span>
      );
    }
    if (isAdvancedAdmin) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          padding: '1px 6px',
          borderRadius: 'var(--radius-full)',
          background: '#d97706',
          color: '#fff',
          fontSize: '0.7rem',
          fontWeight: 700
        }}>
          <Star size={11} fill="#fff" />
          <span>Avanzado</span>
        </span>
      );
    }
    if (isAdmin) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          padding: '1px 6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--primary-light)',
          color: 'var(--primary-text)',
          fontSize: '0.7rem',
          fontWeight: 700,
          border: '1px solid rgba(21, 128, 61, 0.25)'
        }}>
          <ShieldCheck size={11} />
          <span>Directivo</span>
        </span>
      );
    }
    if (currentUserRole === 'educator') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          padding: '1px 6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--primary-light)',
          color: 'var(--primary-text)',
          fontSize: '0.7rem',
          fontWeight: 700
        }}>
          <Compass size={11} />
          <span>Docente</span>
        </span>
      );
    }
    if (currentUserRole === 'parent') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          padding: '1px 6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--secondary-light)',
          color: 'var(--secondary)',
          fontSize: '0.7rem',
          fontWeight: 700
        }}>
          <Users size={11} />
          <span>Familia</span>
        </span>
      );
    }

    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-input)',
        color: 'var(--text-muted)',
        fontSize: '0.72rem',
        fontWeight: 600
      }}>
        Invitado
      </span>
    );
  };

  const activeFolder = currentOrg?.folders?.find(f => f.id === activeFolderId);

  return (
    <header style={{
      height: '56px',
      maxHeight: '56px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.5rem',
      flexWrap: 'nowrap',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      overflow: 'hidden',
      zIndex: 50,
      flexShrink: 0
    }}>
      {/* Brand & Organization Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}>
            {currentOrg?.type === 'scout' ? <Compass size={18} /> : <GraduationCap size={18} />}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span>Senda</span>
              <span style={{ color: 'var(--primary)' }}>NeoEdu</span>
            </div>
          </div>
        </div>

        {/* Organization Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-input)',
          padding: '0.2rem 0.35rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          maxWidth: '150px',
          gap: '0.25rem'
        }}>
          <select 
            value={activeOrgId} 
            onChange={(e) => (switchUserOrg ? switchUserOrg(e.target.value) : selectOrg(e.target.value))}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              outline: 'none',
              fontSize: '0.76rem',
              maxWidth: '140px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
            title={availableUserOrgs?.length > 1 ? `Tienes acceso a ${availableUserOrgs.length} instituciones` : 'Institución activa'}
          >
            {(availableUserOrgs && availableUserOrgs.length > 0 ? availableUserOrgs : data.organizations).map(org => (
              <option key={org.id} value={org.id}>
                {org.type === 'scout' ? '⚜️ ' : '🏫 '} {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Explorar Instituciones / Grupos button */}
        <button
          type="button"
          onClick={() => setInstitutionExplorerOpen(true)}
          title="Buscar instituciones para unirse o fundar una nueva"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'var(--faro-cyan-bg)',
            border: '1px solid var(--border-faro)',
            color: 'var(--faro-cyan-light)',
            padding: '0.28rem 0.55rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Building2 size={13} />
          <span>Instituciones</span>
        </button>

        {/* Active Folder Tag */}
        {activeFolderId !== 'all' && activeFolder && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: '1px solid var(--border-color)',
            maxWidth: '140px',
            overflow: 'hidden'
          }}>
            <FolderOpen size={12} style={{ color: activeFolder.color || 'var(--primary)', flexShrink: 0 }} />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{activeFolder.name}</span>
            <button 
              onClick={() => setActiveFolderId('all')}
              style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}
              title="Quitar filtro"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Global Search Bar */}
      <div style={{
        flex: 1,
        maxWidth: '170px',
        minWidth: '50px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search size={13} style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)' }} />
        <input 
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.3rem 1.4rem 0.3rem 1.6rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}
          >
            ×
          </button>
        )}
      </div>

      {/* Right Controls: Tools, Theme, User Session */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, paddingRight: '0.25rem' }}>
        {/* Adult Preview Role Toggle */}
        {isRealAdult && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setPreviewMenuOpen(!previewMenuOpen)}
              title="Modo Vista Previa: Ver la aplicación como Alumno o Familia para comprobar que los accesos restringidos queden ocultos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.22rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                background: previewRole ? '#d97706' : 'var(--bg-input)',
                border: `1px solid ${previewRole ? '#b45309' : 'var(--border-color)'}`,
                color: previewRole ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Eye size={13} style={{ color: previewRole ? '#ffffff' : 'var(--secondary)' }} />
              <span>
                {previewRole ? (previewRole === 'parent' ? '👁️ Familia' : '👁️ Alumno') : 'Ver como...'}
              </span>
            </button>

            {previewMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                width: '220px',
                zIndex: 120
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, padding: '2px 6px' }}>
                  Simular vista de participante:
                </div>
                <button
                  onClick={() => { setPreviewRole('parent'); setPreviewMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '4px',
                    background: previewRole === 'parent' ? 'var(--primary-light)' : 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>👨‍👩‍👧</span>
                  <span>Ver como Familia / Padre</span>
                </button>
                <button
                  onClick={() => { setPreviewRole('student'); setPreviewMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '4px',
                    background: previewRole === 'student' ? 'var(--primary-light)' : 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>🎒</span>
                  <span>Ver como Alumno / Protagonista</span>
                </button>
                {previewRole && (
                  <button
                    onClick={() => { exitPreviewMode(); setPreviewMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '4px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#dc2626',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderTop: '1px solid var(--border-color)',
                      marginTop: '2px'
                    }}
                  >
                    <span>✕</span>
                    <span>Salir y Volver al Modo Adulto</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Drive Sync Button */}
        <button
          onClick={syncWithDriveNow}
          disabled={driveSyncState === 'syncing'}
          title={`Sincronización Cloud con Drive / Google Sheets. ${lastDriveSync ? `Última: ${lastDriveSync}` : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-md)',
            background: driveSyncState === 'synced' ? '#dcfce7' : 'var(--bg-input)',
            border: `1px solid ${driveSyncState === 'synced' ? '#16a34a' : 'var(--border-color)'}`,
            color: driveSyncState === 'synced' ? '#166534' : 'var(--text-main)'
          }}
        >
          {driveSyncState === 'syncing' ? (
            <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite', color: '#0284c7' }} />
          ) : driveSyncState === 'synced' ? (
            <Check size={13} style={{ color: '#16a34a' }} />
          ) : (
            <Cloud size={13} style={{ color: '#0284c7' }} />
          )}
        </button>

        {/* Font size button */}
        <button
          onClick={handleFontSizeCycle}
          title={`Tamaño de texto (actual: ${fontSize})`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)'
          }}
        >
          <Type size={13} style={{ color: 'var(--primary)' }} />
        </button>

        {/* Theme cycle */}
        <button
          onClick={() => {
            if (theme === 'neofaro' || theme === 'forest') setTheme('light');
            else setTheme('neofaro');
          }}
          title={`Cambiar tema visual (actual: ${theme})`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)'
          }}
        >
          {theme === 'neofaro' || theme === 'forest' ? (
            <Compass size={13} style={{ color: 'var(--faro-cyan-light)' }} />
          ) : (
            <Sun size={13} style={{ color: '#ea580c' }} />
          )}
        </button>

        {/* Personalizar (Admin only) */}
        {isAdmin && (
          <button
            onClick={() => setOrgCustomizationModalOpen(true)}
            title="Personalizar colores y escudo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)'
            }}
          >
            <Palette size={13} style={{ color: 'var(--primary)' }} />
          </button>
        )}

        {/* Share Button */}
        <button
          onClick={() => setShareModalOpen(true)}
          title="Compartir institución"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-light)',
            border: '1px solid rgba(21, 128, 61, 0.3)',
            color: 'var(--primary-text)'
          }}
        >
          <Share2 size={13} />
        </button>

        {/* Backup / Export */}
        <button
          onClick={() => setBackupModalOpen(true)}
          title="Exportar copia de seguridad JSON"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)'
          }}
        >
          <Download size={13} />
        </button>

        {/* Separator */}
        <div style={{ width: '1px', height: '18px', background: 'var(--border-color)', margin: '0 2px' }} />

        {/* Authenticated User Status & Logout */}
        {isLoggedIn && currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            <button
              onClick={() => setProfileModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-md)',
                background: isSuperAdmin ? 'linear-gradient(135deg, #1e1b4b, #312e81)' : 'var(--bg-input)',
                border: isSuperAdmin ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                color: isSuperAdmin ? '#fff' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }} 
              title={`${currentUser.name} (${currentUser.role}) — Clic para ver Datos Personales o Cambiar Contraseña`}
            >
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  style={{ width: '20px', height: '20px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }} 
                />
              ) : (
                <UserCheck size={13} style={{ color: 'var(--primary)' }} />
              )}
              <span style={{ fontSize: '0.74rem', fontWeight: 700, maxWidth: '65px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name?.split(' ')[0]}
              </span>
              {getRoleBadge()}
            </button>

            <button
              onClick={logout}
              title="Cerrar Sesión Segura"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.3rem 0.55rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#dc2626',
                fontSize: '0.76rem',
                fontWeight: 700,
                flexShrink: 0,
                cursor: 'pointer'
              }}
            >
              <LogOut size={13} />
              <span>Salir</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {}}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            <LogIn size={14} />
            <span>Iniciar Sesión</span>
          </button>
        )}
      </div>
    </header>
  );
};
