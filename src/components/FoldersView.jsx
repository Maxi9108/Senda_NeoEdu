import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderPlus, 
  FolderOpen, 
  Calendar, 
  Rocket, 
  Users, 
  ArrowRight, 
  Building2, 
  Compass, 
  GraduationCap,
  Sparkles,
  Lock,
  ExternalLink,
  FileText,
  ImageIcon,
  Palette
} from 'lucide-react';

export const FoldersView = () => {
  const { 
    currentOrg, 
    data, 
    selectFolder, 
    setCurrentTab, 
    setModalConfig,
    canEdit,
    isAdmin,
    isAdult,
    canAccessFolder,
    setPrivateAccessModal,
    setOrgCustomizationModalOpen
  } = useApp();

  const getFolderStats = (folderId) => {
    const projectsCount = data.projects.filter(p => p.orgId === currentOrg.id && (folderId === 'all' || p.folderId === folderId)).length;
    const eventsCount = data.calendarEvents.filter(e => e.orgId === currentOrg.id && (folderId === 'all' || e.folderId === folderId || e.isGroupWide)).length;
    return { projectsCount, eventsCount };
  };

  const handleOpenFolder = (folder, targetTab = 'community') => {
    if (folder.isPrivateAdultOnly && !canAccessFolder(folder)) {
      setPrivateAccessModal({ isOpen: true, folderName: folder.name });
      return;
    }
    selectFolder(folder.id);
    setCurrentTab(targetTab);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Organization Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        background: `linear-gradient(135deg, ${currentOrg.color}15, var(--bg-card))`,
        borderLeft: `6px solid ${currentOrg.color}`,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className={`badge ${currentOrg.type === 'scout' ? 'badge-scout' : 'badge-edu'}`}>
              {currentOrg.type === 'scout' ? <Compass size={13} /> : <GraduationCap size={13} />}
              {currentOrg.badge}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {currentOrg.folders?.length || 0} Subgrupos activos
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{currentOrg.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '680px' }}>
            {currentOrg.description}
          </p>
        </div>

        {(canEdit || isAdult) && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {canEdit && (
              <button
                onClick={() => setModalConfig({ isOpen: true, type: 'new_folder' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.15rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <FolderPlus size={18} />
                <span>Crear Rama / Grado</span>
              </button>
            )}

            <button
              onClick={() => setModalConfig({ isOpen: true, type: 'new_org' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <Building2 size={17} style={{ color: 'var(--secondary)' }} />
              <span>Nuevo Grupo / Escuela</span>
            </button>
          </div>
        )}
      </div>

      {/* Folders Grid */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Estructura de Secciones, Ramas & Grados</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Accede a cada espacio para consultar materiales compartidos, álbum de fotos, WhatsApp y calendario unificado.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '1.25rem'
        }}>
          {currentOrg.folders?.map(folder => {
            const stats = getFolderStats(folder.id);
            const isRestricted = folder.isPrivateAdultOnly && !canAccessFolder(folder);
            const folderColor = folder.color || currentOrg.color;

            return (
              <div
                key={folder.id}
                className="glass-panel"
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${isRestricted ? 'rgba(217, 119, 6, 0.3)' : 'var(--border-color)'}`,
                  background: folder.bgImage 
                    ? `linear-gradient(rgba(18, 28, 46, 0.85), rgba(18, 28, 46, 0.95)), url(${folder.bgImage}) center/cover`
                    : (folder.bannerBg || 'var(--bg-card)'),
                  borderTop: `4px solid ${folderColor}`
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '0.85rem'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-input)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: folderColor,
                      border: '1px solid var(--border-color)'
                    }}>
                      {folder.isPrivateAdultOnly ? <Lock size={20} /> : <FolderOpen size={22} />}
                    </div>

                    {folder.isPrivateAdultOnly ? (
                      <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                        <Lock size={11} />
                        Solo Adultos
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.75rem',
                        background: 'var(--bg-input)',
                        color: 'var(--text-muted)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600
                      }}>
                        {folder.ageRange || 'Comunidad'}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    {folder.name}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {folder.isPrivateAdultOnly 
                      ? 'Espacio reservado para el Consejo de Dirigentes y Cuerpo Docente.' 
                      : 'Actividades, materiales compartidos, fotos y grupo oficial de WhatsApp.'}
                  </p>
                </div>

                <div>
                  {/* Badges of materials & photos */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    padding: '0.65rem 0',
                    borderTop: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '1rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FileText size={14} style={{ color: 'var(--primary)' }} />
                      <span><strong>{folder.materials?.length || 0}</strong> Materiales</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ImageIcon size={14} style={{ color: 'var(--secondary)' }} />
                      <span><strong>{folder.gallery?.length || 0}</strong> Fotos</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} style={{ color: 'var(--accent-blue)' }} />
                      <span><strong>{stats.eventsCount}</strong> Eventos</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Lock size={14} style={{ color: 'var(--secondary)' }} />
                      <span><strong>{folder.privateAdultResources?.length || 0}</strong> Privados (Drive)</span>
                    </div>
                  </div>

                  {/* Open Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleOpenFolder(folder, 'community')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <Users size={14} />
                      <span>Familias & Fotos</span>
                    </button>

                    <button
                      onClick={() => handleOpenFolder(folder, 'calendar')}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: folderColor,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                      title="Ver calendario específico"
                    >
                      <Calendar size={14} />
                      <span>Calendario</span>
                    </button>

                    {canEdit && (
                      <button
                        onClick={() => {
                          selectFolder(folder.id);
                          setOrgCustomizationModalOpen(true);
                        }}
                        style={{
                          padding: '0.6rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          color: folderColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={`Personalizar colores y avisos de ${folder.name}`}
                      >
                        <Palette size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
