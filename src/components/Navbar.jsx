import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  GraduationCap, 
  FolderKanban, 
  Search, 
  Sun, 
  Moon, 
  Trees, 
  Type, 
  Download, 
  PlusCircle,
  FolderOpen,
  UserCheck,
  ShieldCheck,
  Users,
  Backpack,
  Share2,
  Crown,
  LogOut,
  LogIn,
  Palette,
  Star,
  Cloud,
  RefreshCw,
  Check,
  ExternalLink
} from 'lucide-react';

export const Navbar = () => {
  const { 
    data, 
    activeOrgId, 
    selectOrg, 
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
    currentUserRole,
    setCurrentUserRole,
    isAdmin,
    isAdvancedAdmin,
    isLoggedIn,
    setIsLoggedIn,
    driveSyncState,
    lastDriveSync,
    syncWithDriveNow
  } = useApp();

  const handleFontSizeCycle = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('extra-large');
    else setFontSize('normal');
  };

  const getFontSizeLabel = () => {
    if (fontSize === 'large') return 'Texto: Grande';
    if (fontSize === 'extra-large') return 'Texto: Extra Grande';
    return 'Texto: Normal';
  };

  const activeFolder = currentOrg?.folders?.find(f => f.id === activeFolderId);

  return (
    <header className="navbar-container" style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand & Organization Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {currentOrg?.type === 'scout' ? <Compass size={24} /> : <GraduationCap size={24} />}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Senda</span>
              <span style={{ color: 'var(--primary)' }}>NeoEdu</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Gestión Scout & Docente
            </div>
          </div>
        </div>

        {/* Organization Dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-input)',
          padding: '0.3rem 0.6rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Espacio:</span>
          <select 
            value={activeOrgId} 
            onChange={(e) => selectOrg(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              outline: 'none',
              fontSize: '0.88rem'
            }}
          >
            {data.organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.type === 'scout' ? '⚜️ ' : '🏫 '} {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Role Selector (Perfil de Acceso) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: currentUserRole === 'superadmin' ? 'linear-gradient(135deg, #1e1b4b, #312e81)' : (currentUserRole === 'advanced_admin' ? 'linear-gradient(135deg, #451a03, #78350f)' : 'var(--primary-light)'),
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-md)',
          border: currentUserRole === 'superadmin' ? '1px solid #f59e0b' : (currentUserRole === 'advanced_admin' ? '1px solid #d97706' : '1px solid rgba(21, 128, 61, 0.25)'),
          gap: '0.4rem'
        }}>
          {currentUserRole === 'superadmin' ? (
            <Crown size={15} style={{ color: '#f59e0b' }} />
          ) : currentUserRole === 'advanced_admin' ? (
            <Star size={15} style={{ color: '#f59e0b' }} fill="#f59e0b" />
          ) : (
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-text)' }}>Tu Rol:</span>
          )}
          <select
            value={currentUserRole}
            onChange={(e) => setCurrentUserRole(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 700,
              color: (currentUserRole === 'superadmin' || currentUserRole === 'advanced_admin') ? '#ffffff' : 'var(--primary-text)',
              cursor: 'pointer',
              outline: 'none',
              fontSize: '0.86rem'
            }}
          >
            <option value="superadmin" style={{ color: '#000' }}>👑 Super Admin (Maximiliano Sánchez - maxi0802@gmai.com)</option>
            <option value="advanced_admin" style={{ color: '#000' }}>⭐ Administrador Avanzado (Nacional)</option>
            <option value="admin" style={{ color: '#000' }}>🏛️ Responsable Institucional (Jefe de Grupo / Directivo)</option>
            <option value="educator" style={{ color: '#000' }}>⚜️ Educador / Docente / Dirigente</option>
            <option value="parent" style={{ color: '#000' }}>👨‍👩‍👧 Familia / Padres (Aceptado)</option>
            <option value="student" style={{ color: '#000' }}>🎒 Protagonista / Alumno / Scout</option>
          </select>
        </div>

        {/* Active Folder Pill */}
        {activeFolderId !== 'all' && activeFolder && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            border: '1px solid var(--border-color)'
          }}>
            <FolderOpen size={14} style={{ color: activeFolder.color || 'var(--primary)' }} />
            <span>{activeFolder.name}</span>
            <button 
              onClick={() => setActiveFolderId('all')}
              style={{
                marginLeft: '0.25rem',
                color: 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
              title="Quitar filtro de carpeta"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Global Search Bar */}
      <div style={{
        flex: 1,
        maxWidth: '380px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
        <input 
          type="text"
          placeholder="Buscar proyectos, eventos, materiales o personas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.48rem 1rem 0.48rem 2.25rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            fontSize: '0.86rem',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}
          >
            ×
          </button>
        )}
      </div>

      {/* Right Controls: Accessibility, Theme, Backup */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Accessible Text Size Button */}
        <button
          onClick={handleFontSizeCycle}
          title="Ajustar tamaño de letra para lectura cómoda"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.8rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <Type size={16} style={{ color: 'var(--primary)' }} />
          <span>{getFontSizeLabel()}</span>
        </button>

        {/* Theme Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          padding: '0.2rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setTheme('forest')}
            title="Tema Naturaleza / Scout"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: theme === 'forest' ? 'var(--primary)' : 'transparent',
              color: theme === 'forest' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <Trees size={16} />
          </button>
          <button
            onClick={() => setTheme('light')}
            title="Tema Claro"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: theme === 'light' ? 'var(--primary)' : 'transparent',
              color: theme === 'light' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <Sun size={16} />
          </button>
          <button
            onClick={() => setTheme('dark')}
            title="Tema Oscuro"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: theme === 'dark' ? 'var(--primary)' : 'transparent',
              color: theme === 'dark' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <Moon size={16} />
          </button>
        </div>

        {/* Customize Institution & Subgroup Button (Autoridades y Educadores) */}
        {isAdmin && (
          <button
            onClick={() => setOrgCustomizationModalOpen(true)}
            title="Personalizar colores, fondos y lema de la institución o subgrupos"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            <Palette size={15} style={{ color: 'var(--primary)' }} />
            <span>Personalizar</span>
          </button>
        )}

        {/* Google Drive & Sheets 24/7 Cloud Sync Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <button
            onClick={syncWithDriveNow}
            disabled={driveSyncState === 'syncing'}
            title={`Sincronización 24/7 con tu Google Sheets y Drive. ${lastDriveSync ? `Última sincronización: ${lastDriveSync}` : 'Listo para sincronizar.'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: driveSyncState === 'synced' ? '#dcfce7' : '#e0f2fe',
              border: `1px solid ${driveSyncState === 'synced' ? '#16a34a' : '#0284c7'}`,
              color: driveSyncState === 'synced' ? '#166534' : '#0369a1',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: driveSyncState === 'syncing' ? 'wait' : 'pointer'
            }}
          >
            {driveSyncState === 'syncing' ? (
              <>
                <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Guardando en Sheets...</span>
              </>
            ) : driveSyncState === 'synced' ? (
              <>
                <Check size={14} style={{ color: '#16a34a' }} />
                <span>Guardado en Drive</span>
              </>
            ) : (
              <>
                <Cloud size={14} style={{ color: '#0284c7' }} />
                <span>Drive 24/7 {lastDriveSync ? `(${lastDriveSync})` : ''}</span>
              </>
            )}
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/1MEVj2dJIQvTTFX6Z0BM2tMhrIZi4eWQnRIm-tzPQ0tg/edit"
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir tu Hoja de Cálculo en Google Sheets"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)'
            }}
          >
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Share Institution Button */}
        <button
          onClick={() => setShareModalOpen(true)}
          title="Compartir enlace de la institución (con acceso restringido a no logueados)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary)',
            color: 'var(--primary-text)',
            fontSize: '0.85rem',
            fontWeight: 700
          }}
        >
          <Share2 size={15} style={{ color: 'var(--primary)' }} />
          <span>Compartir</span>
        </button>

        {/* Backup / Export Button */}
        <button
          onClick={() => setBackupModalOpen(true)}
          title="Copia de seguridad y exportación JSON"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <Download size={15} />
          <span>Datos</span>
        </button>

        {/* Login / Logout Simulator Button (To test restricted guest view) */}
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          title={isLoggedIn ? "Simular usuario no logueado (pantalla de bienvenida restringida)" : "Iniciar sesión"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: isLoggedIn ? 'var(--bg-input)' : 'var(--primary)',
            border: `1px solid ${isLoggedIn ? 'var(--border-color)' : 'var(--primary)'}`,
            color: isLoggedIn ? 'var(--text-muted)' : '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 600
          }}
        >
          {isLoggedIn ? <LogOut size={14} /> : <LogIn size={14} />}
          <span>{isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión'}</span>
        </button>
      </div>
    </header>
  );
};
