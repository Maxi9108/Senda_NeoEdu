import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderKanban, 
  Calendar, 
  Clock, 
  Newspaper, 
  Menu
} from 'lucide-react';

export const BottomNav = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    mobileMenuOpen, 
    setMobileMenuOpen 
  } = useApp();

  const navItems = [
    { id: 'folders', label: 'Ramas', icon: FolderKanban },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'daily', label: 'Programa', icon: Clock },
    { id: 'news', label: 'Noticias', icon: Newspaper },
    { id: 'more', label: 'Menú', icon: Menu, isMenuToggle: true }
  ];

  const handleTabClick = (item) => {
    if (item.isMenuToggle) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setCurrentTab(item.id);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className="bottom-nav-mobile"
      aria-label="Navegación Móvil Principal"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'rgba(10, 16, 28, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-color)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.6), 0 0 1px rgba(6, 182, 212, 0.2)',
        zIndex: 9998,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.25rem',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxSizing: 'border-box'
      }}
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = !item.isMenuToggle && currentTab === item.id;
        const isMenuOpenActive = item.isMenuToggle && mobileMenuOpen;

        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              height: '100%',
              background: 'transparent',
              border: 'none',
              color: (isActive || isMenuOpenActive) ? 'var(--faro-cyan-light)' : 'var(--text-muted)',
              cursor: 'pointer',
              position: 'relative',
              padding: '4px 0',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Top Indicator Line */}
            {(isActive || isMenuOpenActive) && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '22%',
                right: '22%',
                height: '3px',
                borderRadius: '0 0 3px 3px',
                background: 'var(--gradient-faro)',
                boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)'
              }} />
            )}

            <div style={{
              width: '32px',
              height: '26px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: (isActive || isMenuOpenActive) ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              transition: 'background 0.2s ease'
            }}>
              <Icon 
                size={20} 
                strokeWidth={(isActive || isMenuOpenActive) ? 2.4 : 1.8}
                style={{ 
                  color: (isActive || isMenuOpenActive) ? 'var(--faro-cyan-light)' : 'var(--text-muted)',
                  filter: (isActive || isMenuOpenActive) ? 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.4))' : 'none'
                }} 
              />
            </div>

            <span style={{
              fontSize: '0.68rem',
              fontWeight: (isActive || isMenuOpenActive) ? 800 : 500,
              letterSpacing: '-0.01em',
              lineHeight: 1
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
