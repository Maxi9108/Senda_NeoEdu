import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FoldersView } from './components/FoldersView';
import { NewsView } from './components/NewsView';
import { CalendarView } from './components/CalendarView';
import { DailyProgramView } from './components/DailyProgramView';
import { ProjectsView } from './components/ProjectsView';
import { OrgChartView } from './components/OrgChartView';
import { CommunitySection } from './components/CommunitySection';
import { AdminMembersView } from './components/AdminMembersView';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import { InterInstitutionalHub } from './components/InterInstitutionalHub';
import { OrgCustomizationModal } from './components/OrgCustomizationModal';
import { PollsView } from './components/PollsView';
import { BackupModal } from './components/BackupModal';
import { ShareModal } from './components/ShareModal';
import { AuthGate } from './components/AuthGate';
import { ItemModal } from './components/ItemModal';
import { UserProfileModal } from './components/UserProfileModal';
import { InstitutionExplorerModal } from './components/InstitutionExplorerModal';
import { Lock } from 'lucide-react';

const PrivateAccessModal = () => {
  const { privateAccessModal, setPrivateAccessModal } = useApp();
  if (!privateAccessModal.isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '460px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--secondary-light)',
          color: 'var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <Lock size={28} />
        </div>

        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
          Espacio Privado de Adultos
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          La sección <strong>{privateAccessModal.folderName}</strong> contiene actas de consejo, evaluaciones internas y temas confidenciales reservados exclusivamente para Educadores, Dirigentes y Directivos.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Debes iniciar sesión con una cuenta autorizada de Educador, Dirigente o Responsable Institucional para ver este material.
          </p>
          <button
            onClick={() => setPrivateAccessModal({ isOpen: false, folderName: '' })}
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            Entendido, volver a la vista general
          </button>
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  const { 
    currentTab, 
    setCurrentTab,
    currentOrg,
    currentUser,
    availableUserOrgs,
    setInstitutionExplorerOpen,
    isLoggedIn, 
    previewRole, 
    setPreviewRole, 
    exitPreviewMode,
    orgHasAuthority,
    isSuperAdmin,
    isAdvancedAdmin
  } = useApp();

  // If not logged in, show protected AuthGate landing restriction fitting in single page
  if (!isLoggedIn) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        maxHeight: '100vh',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
        <Navbar />
        <div style={{ flex: 1, height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <AuthGate />
        </div>
        <ShareModal />
      </div>
    );
  }

  const lacksAuthority = currentOrg && orgHasAuthority && !orgHasAuthority(currentOrg.id);
  const hasNoOrgs = isLoggedIn && availableUserOrgs && availableUserOrgs.length === 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      maxHeight: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden',
      backgroundImage: currentOrg?.bgImage ? `linear-gradient(rgba(8, 12, 20, 0.90), rgba(8, 12, 20, 0.94)), url(${currentOrg.bgImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Navbar />

      {/* Unlinked User Onboarding Banner */}
      {hasNoOrgs && (
        <div style={{
          background: 'var(--gradient-hero)',
          borderBottom: '1px solid var(--border-faro)',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          zIndex: 40,
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.1rem' }}>🧭</span>
            <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>
              ¡Bienvenido/a {currentUser?.name || ''}!
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Aún no estás vinculado a una institución o grupo activo. Explorá la red para solicitar tu ingreso con autorización de adultos o fundá tu sede.
            </span>
          </div>
          <button
            onClick={() => setInstitutionExplorerOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              background: 'var(--gradient-faro)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span>🏛️ Explorar o Fundar Institución</span>
          </button>
        </div>
      )}

      {/* Missing Authority Supervision Banner */}
      {lacksAuthority && (
        <div style={{
          background: 'linear-gradient(90deg, #991b1b, #dc2626)',
          color: '#ffffff',
          padding: '0.45rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          fontWeight: 700,
          zIndex: 40,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>⚠️ ATENCIÓN INSTITUCIONAL:</span>
            <span style={{ fontWeight: 500, fontSize: '0.78rem' }}>
              Esta institución ({currentOrg.name}) no cuenta con una autoridad directiva supervisora activa. Se notificó al Super Administrador y Administradores Generales para evaluar su continuidad y designar autoridad.
            </span>
          </div>

          {(isSuperAdmin || isAdvancedAdmin) && (
            <button
              onClick={() => setCurrentTab('superadmin')}
              style={{
                background: '#ffffff',
                color: '#991b1b',
                border: 'none',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🏛️ Designar Autoridad en Panel
            </button>
          )}
        </div>
      )}

      {/* Adult Preview Simulation Banner */}
      {previewRole && (
        <div style={{
          background: 'linear-gradient(90deg, #b45309, #d97706)',
          color: '#ffffff',
          padding: '0.4rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          fontWeight: 700,
          zIndex: 40,
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span>👁️ MODO VISTA PREVIA ACTIVO:</span>
            <span style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '2px 8px', borderRadius: '4px' }}>
              Visualizando como {previewRole === 'parent' ? '👨‍👩‍👧 Familia / Padre' : '🎒 Alumno / Protagonista'}
            </span>
            <span style={{ fontWeight: 500, fontSize: '0.76rem', opacity: 0.9 }}>
              (Los enlaces Drive y fichas técnicas privadas para adultos están ocultos para verificar privacidad)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setPreviewRole(previewRole === 'parent' ? 'student' : 'parent')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cambiar a {previewRole === 'parent' ? '🎒 Alumno' : '👨‍👩‍👧 Familia'}
            </button>

            <button
              onClick={exitPreviewMode}
              style={{
                background: '#ffffff',
                color: '#b45309',
                border: 'none',
                padding: '2px 9px',
                borderRadius: '4px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ✕ Volver al Modo Adulto
            </button>
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', flex: 1, height: previewRole ? 'calc(100vh - 56px - 34px)' : 'calc(100vh - 56px)', overflow: 'hidden' }}>
        <Sidebar />
        
        <main style={{
          flex: 1,
          padding: '1.25rem 1.75rem',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          overflowY: 'auto',
          minWidth: 0
        }}>
          {currentTab === 'folders' && <FoldersView />}
          {currentTab === 'inter_org' && <InterInstitutionalHub />}
          {currentTab === 'news' && <NewsView />}
          {currentTab === 'community' && <CommunitySection />}
          {currentTab === 'calendar' && <CalendarView />}
          {currentTab === 'daily' && <DailyProgramView />}
          {currentTab === 'projects' && <ProjectsView />}
          {currentTab === 'organigram' && <OrgChartView />}
          {currentTab === 'polls' && <PollsView />}
          {currentTab === 'admin_members' && <AdminMembersView />}
          {currentTab === 'superadmin' && <SuperAdminPanel />}
        </main>
      </div>

      <BackupModal />
      <ShareModal />
      <ItemModal />
      <UserProfileModal />
      <OrgCustomizationModal />
      <PrivateAccessModal />
      <InstitutionExplorerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
