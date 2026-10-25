import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  ShieldAlert, 
  Send, 
  ExternalLink, 
  Users,
  Lock,
  Compass,
  GraduationCap
} from 'lucide-react';

export const ShareModal = () => {
  const { shareModalOpen, setShareModalOpen, currentOrg } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalOpen) return null;

  const shareUrl = `${window.location.origin}/?institucion=${currentOrg.id}`;
  const inviteCode = `NEOEDU-${currentOrg.id.toUpperCase().replace(/[^A-Z0-9]/g, '')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const text = `¡Hola! Te comparto el acceso al espacio oficial de ${currentOrg.name} en Senda NeoEdu: ${shareUrl} . Recuerda que para ver los calendarios y materiales deberás ingresar con tu usuario aceptado.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '520px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>
                Compartir Institución
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {currentOrg.name}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShareModalOpen(false)}
            style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
          >
            ×
          </button>
        </div>

        {/* Security Warning Notice */}
        <div style={{
          background: 'var(--bg-input)',
          borderLeft: '4px solid var(--secondary)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <Lock size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
            <strong>Acceso Restringido y Protegido:</strong>
            <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
              Para ver el cronograma, materiales y actividades, los destinatarios deberán <strong>iniciar sesión</strong> y haber sido <strong>aceptados</strong> por los responsables de la institución. Los usuarios sin login ni autorización no podrán ver información interna.
            </div>
          </div>
        </div>

        {/* Share Link Input */}
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            Enlace de Acceso Directo:
          </label>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 1rem',
                background: copied ? 'var(--primary)' : 'var(--bg-input)',
                color: copied ? '#fff' : 'var(--text-main)',
                border: `1px solid ${copied ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.84rem'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Quick QR & Code representation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-input)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Código de Invitación Rápido
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              {inviteCode}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Útil para incorporar familias desde la app móvil
            </div>
          </div>

          <div style={{
            width: '60px',
            height: '60px',
            background: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <QrCode size={44} style={{ color: '#1e293b' }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
          <button
            onClick={shareViaWhatsApp}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1rem',
              background: '#25D366',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Send size={16} />
            <span>Compartir por WhatsApp</span>
          </button>

          <button
            onClick={() => setShareModalOpen(false)}
            style={{
              padding: '0.7rem 1.25rem',
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
