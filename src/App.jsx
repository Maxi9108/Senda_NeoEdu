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
import { Lock } from 'lucide-react';

const PrivateAccessModal = () => {
  const { privateAccessModal, setPrivateAccessModal, setCurrentUserRole } = useApp();
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
          <button
            onClick={() => {
              setCurrentUserRole('educator');
              setPrivateAccessModal({ isOpen: false, folderName: '' });
            }}
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            Acceder con Credencial de Educador
          </button>

          <button
            onClick={() => setPrivateAccessModal({ isOpen: false, folderName: '' })}
            style={{
              padding: '0.55rem',
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem'
            }}
          >
            Volver a la vista pública
          </button>
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  const { currentTab, isLoggedIn } = useApp();

  // If not logged in, show protected AuthGate landing restriction
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <AuthGate />
        <ShareModal />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        
        <main style={{
          flex: 1,
          padding: '1.75rem 2rem',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          overflowY: 'auto'
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
      <OrgCustomizationModal />
      <PrivateAccessModal />
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
