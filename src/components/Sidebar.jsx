import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderKanban, 
  Calendar, 
  Clock, 
  Rocket, 
  Network, 
  Plus, 
  Folder,
  Layers,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Users,
  Lock,
  BarChart2,
  Tent,
  Newspaper,
  Crown,
  Building2,
  Star
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    currentOrg, 
    activeFolderId, 
    selectFolder,
    setModalConfig,
    canEdit,
    isAdmin,
    isSuperAdmin,
    isAdvancedAdmin,
    hasSuperOrAdvancedAccess,
    currentUserRole,
    canAccessFolder
  } = useApp();

  const navItems = [
    { id: 'folders', label: 'Carpetas & Secciones', icon: FolderKanban },
    { id: 'inter_org', label: 'Red Interinstitucional', icon: Building2, adminOnly: true, highlightText: 'Líderes' },
    { id: 'news', label: 'Noticias & Novedades', icon: Newspaper, highlightText: 'Feed' },
    { id: 'community', label: 'Portal Familias & Materiales', icon: Users },
    { id: 'calendar', label: 'Calendario & Logística', icon: Calendar, highlightText: 'Tildes' },
    { id: 'daily', label: 'Programa del Día', icon: Clock },
    { id: 'projects', label: 'Proyectos & Tiempos', icon: Rocket },
    { id: 'organigram', label: 'Organigrama Interactivo', icon: Network },
    { id: 'polls', label: 'Encuestas & Votación', icon: BarChart2 },
    { id: 'admin_members', label: 'Gestión de Miembros', icon: ShieldCheck, adminOnly: true },
    { id: 'superadmin', label: 'Panel Super Admin & Auditoría', icon: Crown, superAdminOnly: true, highlightText: isSuperAdmin ? 'Maxi' : 'Avanzado' }
  ];

  return (
    <aside style={{
      width: '275px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.85rem',
      gap: '1.25rem',
      flexShrink: 0,
      height: 'calc(100vh - 65px)',
      position: 'sticky',
      top: '65px',
      overflowY: 'auto'
    }}>
      {/* Quick Action Button (if canEdit) */}
      {canEdit ? (
        <button
          onClick={() => setModalConfig({ isOpen: true, type: 'selector' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'var(--primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.92rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Crear Nuevo...</span>
        </button>
      ) : (
        <div style={{
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-input)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          👀 Navegando como Familia / Protagonista
        </div>
      )}

      {/* Main Navigation */}
      <div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '0 0.5rem 0.5rem 0.5rem'
        }}>
          Navegación Principal
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {navItems.map(item => {
            if (item.adminOnly && !isAdmin) return null;
            if (item.superAdminOnly && !hasSuperOrAdvancedAccess) return null;

            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? (item.id === 'superadmin' ? 'linear-gradient(135deg, #1e1b4b, #312e81)' : 'var(--primary-light)') : 'transparent',
                  color: isActive ? (item.id === 'superadmin' ? '#ffffff' : 'var(--primary-text)') : 'var(--text-main)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={19} style={{ color: isActive ? (item.id === 'superadmin' ? '#f59e0b' : 'var(--primary)') : 'var(--text-muted)' }} />
                  <span>{item.label}</span>
                </div>
                {item.highlightText && (
                  <span style={{
                    fontSize: '0.68rem',
                    background: item.id === 'superadmin' ? '#f59e0b' : 'var(--secondary)',
                    color: item.id === 'superadmin' ? '#000' : '#fff',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700
                  }}>
                    {item.highlightText}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Folders / Units Quick Selector */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.5rem 0.5rem 0.5rem'
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Carpetas ({currentOrg?.type === 'scout' ? 'Ramas' : 'Grados'})
          </span>
          {canEdit && (
            <button
              onClick={() => setModalConfig({ isOpen: true, type: 'new_folder' })}
              title="Añadir nueva sección o subgrupo"
              style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}
            >
              + Nueva
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <button
            onClick={() => selectFolder('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: activeFolderId === 'all' ? 'var(--bg-input)' : 'transparent',
              color: activeFolderId === 'all' ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: activeFolderId === 'all' ? 700 : 500,
              fontSize: '0.86rem',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} />
              <span>Ver Todo el Espacio</span>
            </div>
          </button>

          {currentOrg?.folders?.map(f => {
            const isFolderActive = activeFolderId === f.id;
            const isRestricted = f.isPrivateAdultOnly && !canAccessFolder(f);
            const branchColor = f.color || 'var(--primary)';

            return (
              <button
                key={f.id}
                onClick={() => selectFolder(f.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isFolderActive ? 'var(--bg-input)' : 'transparent',
                  color: isFolderActive ? branchColor : (isRestricted ? 'var(--text-muted)' : 'var(--text-main)'),
                  fontWeight: isFolderActive ? 700 : 500,
                  fontSize: '0.84rem',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  {f.isPrivateAdultOnly ? (
                    <Lock size={14} style={{ flexShrink: 0, color: 'var(--secondary)' }} />
                  ) : (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: 'var(--radius-full)',
                      background: branchColor,
                      flexShrink: 0
                    }} />
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Helpful Info Tip */}
      <div style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        lineHeight: 1.4
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          <Sparkles size={14} style={{ color: 'var(--secondary)' }} />
          <span>Control de Campamentos</span>
        </div>
        Itinerarios completos desde el punto de encuentro hasta la desconcentración final.
      </div>
    </aside>
  );
};
