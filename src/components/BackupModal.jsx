import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  X, 
  CheckCircle, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export const BackupModal = () => {
  const { 
    backupModalOpen, 
    setBackupModalOpen, 
    exportDataJSON, 
    importDataJSON, 
    resetToSampleData 
  } = useApp();

  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  if (!backupModalOpen) return null;

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!jsonText.trim()) return;
    const res = importDataJSON(jsonText);
    if (res.success) {
      setImportStatus({ success: true, message: '¡Datos restaurados con éxito!' });
      setTimeout(() => {
        setBackupModalOpen(false);
        setImportStatus(null);
        setJsonText('');
      }, 1200);
    } else {
      setImportStatus({ success: false, message: res.error });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '540px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Download size={22} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.3rem' }}>Copia de Seguridad & Datos</h2>
          </div>
          <button
            onClick={() => setBackupModalOpen(false)}
            style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          Exporta todos tus grupos, calendarios, programas y organigramas en formato JSON para respaldarlos o importarlos en otro dispositivo sin perder información.
        </p>

        {/* Section 1: Export */}
        <div style={{
          background: 'var(--bg-input)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ fontSize: '0.95rem' }}>Descargar Respaldo</h4>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Genera un archivo .json completo con toda la base local.
            </div>
          </div>
          <button
            onClick={exportDataJSON}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            <Download size={15} />
            <span>Descargar JSON</span>
          </button>
        </div>

        {/* Section 2: Import */}
        <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.95rem' }}>Restaurar o Importar Respaldo</h4>

          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-main)',
              padding: '0.4rem',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}
          />

          <textarea
            placeholder="O pega aquí directamente el contenido del archivo JSON..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '0.65rem',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              resize: 'vertical'
            }}
          />

          {importStatus && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              background: importStatus.success ? 'var(--primary-light)' : 'var(--accent-rose-light)',
              color: importStatus.success ? 'var(--primary-text)' : 'var(--accent-rose)'
            }}>
              {importStatus.success ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              <span>{importStatus.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!jsonText.trim()}
            style={{
              padding: '0.6rem',
              background: jsonText.trim() ? 'var(--secondary)' : 'var(--bg-input)',
              color: jsonText.trim() ? '#fff' : 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            Importar Datos
          </button>
        </form>

        {/* Section 3: Reset to sample */}
        <div style={{
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Restablecer Datos de Demostración</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Vuelve a cargar los ejemplos de Scouts y Colegios.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('¿Restablecer datos a los ejemplos originales de Scout y Colegio?')) {
                resetToSampleData();
                setBackupModalOpen(false);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <RotateCcw size={14} />
            <span>Restablecer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
