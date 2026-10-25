import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Palette, 
  Sparkles, 
  Check, 
  Image, 
  Type, 
  Building2, 
  Layers, 
  Eye, 
  X,
  Compass,
  GraduationCap
} from 'lucide-react';

export const OrgCustomizationModal = () => {
  const { 
    currentOrg, 
    updateOrgCustomization, 
    updateFolderCustomization,
    orgCustomizationModalOpen, 
    setOrgCustomizationModalOpen,
    isAdmin,
    canEdit,
    activeFolderId
  } = useApp();

  const [mode, setMode] = useState('institution'); // 'institution' | 'subgroup'
  const [selectedFolderId, setSelectedFolderId] = useState(() => {
    return activeFolderId !== 'all' ? activeFolderId : (currentOrg?.folders[0]?.id || '');
  });

  // Institution State
  const [primaryColor, setPrimaryColor] = useState(currentOrg?.color || '#15803d');
  const [motto, setMotto] = useState(currentOrg?.motto || 'Formando personas de bien a través de la educación y el servicio.');
  const [bannerBg, setBannerBg] = useState(currentOrg?.bannerBg || 'linear-gradient(135deg, rgba(21, 128, 61, 0.12), rgba(217, 119, 6, 0.08))');

  // Subgroup State
  const currentSelectedFolder = currentOrg?.folders?.find(f => f.id === selectedFolderId) || currentOrg?.folders[0];
  const [subColor, setSubColor] = useState(currentSelectedFolder?.color || '#15803d');
  const [subReminder, setSubReminder] = useState(currentSelectedFolder?.reminderNotice || '');
  const [subWhatsapp, setSubWhatsapp] = useState(currentSelectedFolder?.whatsappLink || '');

  useEffect(() => {
    if (currentOrg) {
      setPrimaryColor(currentOrg.color || '#15803d');
      setMotto(currentOrg.motto || 'Formando personas de bien a través de la educación y el servicio.');
      setBannerBg(currentOrg.bannerBg || 'linear-gradient(135deg, rgba(21, 128, 61, 0.12), rgba(217, 119, 6, 0.08))');
    }
  }, [currentOrg, orgCustomizationModalOpen]);

  useEffect(() => {
    if (currentSelectedFolder) {
      setSubColor(currentSelectedFolder.color || '#15803d');
      setSubReminder(currentSelectedFolder.reminderNotice || '');
      setSubWhatsapp(currentSelectedFolder.whatsappLink || '');
    }
  }, [selectedFolderId, currentSelectedFolder]);

  if (!orgCustomizationModalOpen) return null;

  const colorPresets = [
    { name: 'Scout Verde Selva', hex: '#15803d' },
    { name: 'Azul Institucional', hex: '#0284c7' },
    { name: 'Púrpura Directivo', hex: '#7c3aed' },
    { name: 'Rojo Rover / Fuerza', hex: '#dc2626' },
    { name: 'Ámbar Manada', hex: '#d97706' },
    { name: 'Grafito Moderno', hex: '#334155' },
    { name: 'Verde Esmeralda', hex: '#059669' },
    { name: 'Azul Noche', hex: '#1e3a8a' }
  ];

  const bannerPresets = [
    { name: 'Elegante Suave', value: 'linear-gradient(135deg, rgba(21, 128, 61, 0.12), rgba(217, 119, 6, 0.08))' },
    { name: 'Bicolor Amanecer', value: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(124, 58, 237, 0.12))' },
    { name: 'Dorado Cálido', value: 'linear-gradient(135deg, rgba(217, 119, 6, 0.18), rgba(254, 243, 199, 0.6))' },
    { name: 'Bosque Andino', value: 'linear-gradient(135deg, rgba(6, 78, 59, 0.15), rgba(220, 252, 231, 0.6))' }
  ];

  const handleSaveInstitution = (e) => {
    e.preventDefault();
    updateOrgCustomization(currentOrg.id, {
      color: primaryColor,
      motto: motto.trim(),
      bannerBg
    });
    setOrgCustomizationModalOpen(false);
  };

  const handleSaveSubgroup = (e) => {
    e.preventDefault();
    if (!selectedFolderId) return;
    updateFolderCustomization(selectedFolderId, {
      color: subColor,
      reminderNotice: subReminder.trim(),
      whatsappLink: subWhatsapp.trim()
    });
    setOrgCustomizationModalOpen(false);
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
      zIndex: 130,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '640px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-xl)',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
              <Palette size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>
                Personalizar Identidad Visual
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                Adapta colores, fondos y lemas de tu institución y de cada subgrupo educativo.
              </p>
            </div>
          </div>

          <button
            onClick={() => setOrgCustomizationModalOpen(false)}
            style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch between Institution and Subgroup */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          gap: '0.25rem'
        }}>
          <button
            onClick={() => setMode('institution')}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.86rem',
              background: mode === 'institution' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'institution' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: mode === 'institution' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Building2 size={16} />
            <span>Nivel Institución (Autoridades)</span>
          </button>

          <button
            onClick={() => setMode('subgroup')}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.86rem',
              background: mode === 'subgroup' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'subgroup' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: mode === 'subgroup' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Layers size={16} />
            <span>Nivel Subgrupo / Rama (Educadores)</span>
          </button>
        </div>

        {/* MODE 1: INSTITUTION CUSTOMIZATION */}
        {mode === 'institution' && (
          <form onSubmit={handleSaveInstitution} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isAdmin && (
              <div style={{
                background: 'var(--secondary-light)',
                color: 'var(--secondary)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
                ℹ️ La personalización general requiere credenciales de Autoridad o Responsable Institucional.
              </div>
            )}

            {/* Color Palette Selector */}
            <div>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                Color Institucional Principal (Modifica toda la plataforma)
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {colorPresets.map(preset => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setPrimaryColor(preset.hex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: primaryColor === preset.hex ? 'var(--bg-input)' : 'transparent',
                      border: `1.5px solid ${primaryColor === preset.hex ? preset.hex : 'var(--border-color)'}`,
                      fontSize: '0.78rem',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      textAlign: 'left'
                    }}
                  >
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: 'var(--radius-full)',
                      background: preset.hex,
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.1)'
                    }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Hex Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>O ingresa un color personalizado:</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{
                    width: '36px',
                    height: '36px',
                    padding: 0,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    width: '110px'
                  }}
                />
              </div>
            </div>

            {/* Institutional Motto */}
            <div>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Lema o Frase de Identidad Institucional
              </label>
              <input
                type="text"
                placeholder="Ej: Siempre Listos para Servir • Educar para la Vida"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {/* Banner Presets */}
            <div>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                Estilo de Fondo de Encabezado
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                {bannerPresets.map(bp => (
                  <button
                    key={bp.name}
                    type="button"
                    onClick={() => setBannerBg(bp.value)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: bp.value,
                      border: `1.5px solid ${bannerBg === bp.value ? primaryColor : 'var(--border-color)'}`,
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {bp.name}
                    </span>
                    {bannerBg === bp.value && <Check size={16} style={{ color: primaryColor }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview Card */}
            <div style={{
              background: bannerBg,
              border: `1px solid ${primaryColor}40`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: primaryColor, letterSpacing: '0.05em' }}>
                  Vista Previa en Tiempo Real
                </span>
              </div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>
                {currentOrg?.name}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                "{motto}"
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: primaryColor,
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  Botón Primario
                </span>
                <span style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: `${primaryColor}20`,
                  color: primaryColor,
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  Insignia Institucional
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setOrgCustomizationModalOpen(false)}
                style={{
                  padding: '0.65rem 1.15rem',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                Cerrar
              </button>

              <button
                type="submit"
                style={{
                  padding: '0.65rem 1.35rem',
                  background: primaryColor,
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                Aplicar Colores a la Institución
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: SUBGROUP CUSTOMIZATION (BY EDUCATORS) */}
        {mode === 'subgroup' && (
          <form onSubmit={handleSaveSubgroup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              background: 'var(--primary-light)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              color: 'var(--primary-text)'
            }}>
              🎨 Los <strong>Educadores y Docentes</strong> pueden adaptar los colores distintivos de su sección/rama, modificar avisos y configurar el grupo de WhatsApp.
            </div>

            {/* Select Subgroup */}
            <div>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Seleccionar Sección / Subgrupo a Personalizar:
              </label>
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                {currentOrg?.folders?.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.ageRange})
                  </option>
                ))}
              </select>
            </div>

            {/* Subgroup Color */}
            <div>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                Color Distintivo del Subgrupo / Eventos de esta Rama:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {colorPresets.map(preset => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setSubColor(preset.hex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: subColor === preset.hex ? 'var(--bg-input)' : 'transparent',
                      border: `1.5px solid ${subColor === preset.hex ? preset.hex : 'var(--border-color)'}`,
                      fontSize: '0.78rem',
                      color: 'var(--text-main)',
                      fontWeight: 600
                    }}
                  >
                    <span style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: 'var(--radius-full)',
                      background: preset.hex
                    }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reminder Notice */}
            <div>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Aviso Destacado para Familias / Alumnos de este Subgrupo:
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Recuerden traer cuaderno de caza, gorra y cantimplora..."
                value={subReminder}
                onChange={(e) => setSubReminder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.86rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* WhatsApp Group Link */}
            <div>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Enlace a Grupo Oficial de WhatsApp de la Rama / Grado:
              </label>
              <input
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={subWhatsapp}
                onChange={(e) => setSubWhatsapp(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setOrgCustomizationModalOpen(false)}
                style={{
                  padding: '0.65rem 1.15rem',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                Cerrar
              </button>

              <button
                type="submit"
                style={{
                  padding: '0.65rem 1.35rem',
                  background: subColor,
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                Guardar Personalización del Subgrupo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
