import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Palette, 
  Sparkles, 
  Check, 
  Image as ImageIcon, 
  Type, 
  Building2, 
  Layers, 
  Eye, 
  X,
  Compass,
  GraduationCap,
  Link,
  MessageCircle,
  AlertCircle
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
  const [primaryColor, setPrimaryColor] = useState(currentOrg?.color || '#10b981');
  const [motto, setMotto] = useState(currentOrg?.motto || 'Formando personas de bien a través de la educación y el servicio.');
  const [bannerBg, setBannerBg] = useState(currentOrg?.bannerBg || 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.1))');
  const [bgImage, setBgImage] = useState(currentOrg?.bgImage || '');

  // Subgroup State
  const currentSelectedFolder = currentOrg?.folders?.find(f => f.id === selectedFolderId) || currentOrg?.folders[0];
  const [subColor, setSubColor] = useState(currentSelectedFolder?.color || '#10b981');
  const [subBannerBg, setSubBannerBg] = useState(currentSelectedFolder?.bannerBg || '');
  const [subBgImage, setSubBgImage] = useState(currentSelectedFolder?.bgImage || '');
  const [subReminder, setSubReminder] = useState(currentSelectedFolder?.reminderNotice || '');
  const [subWhatsapp, setSubWhatsapp] = useState(currentSelectedFolder?.whatsappLink || '');

  useEffect(() => {
    if (currentOrg) {
      setPrimaryColor(currentOrg.color || '#10b981');
      setMotto(currentOrg.motto || 'Formando personas de bien a través de la educación y el servicio.');
      setBannerBg(currentOrg.bannerBg || 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.1))');
      setBgImage(currentOrg.bgImage || '');
    }
  }, [currentOrg, orgCustomizationModalOpen]);

  useEffect(() => {
    if (currentSelectedFolder) {
      setSubColor(currentSelectedFolder.color || '#10b981');
      setSubBannerBg(currentSelectedFolder.bannerBg || '');
      setSubBgImage(currentSelectedFolder.bgImage || '');
      setSubReminder(currentSelectedFolder.reminderNotice || '');
      setSubWhatsapp(currentSelectedFolder.whatsappLink || '');
    }
  }, [selectedFolderId, currentSelectedFolder]);

  if (!orgCustomizationModalOpen) return null;

  const colorPresets = [
    { name: 'Cian NeoFaro', hex: '#06b6d4' },
    { name: 'Esmeralda Naturaleza', hex: '#10b981' },
    { name: 'Ámbar Sabiduría', hex: '#f59e0b' },
    { name: 'Azul Andino', hex: '#0284c7' },
    { name: 'Púrpura Directivo', hex: '#7c3aed' },
    { name: 'Rojo Rover / Fuerza', hex: '#dc2626' },
    { name: 'Verde Bosque Selva', hex: '#15803d' },
    { name: 'Noche Profunda', hex: '#1e293b' }
  ];

  const bannerPresets = [
    { name: 'NeoFaro Aurora (Cian & Esmeralda)', value: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(16, 185, 129, 0.14))' },
    { name: 'Amanecer Sabiduría (Ámbar & Oro)', value: 'linear-gradient(135deg, rgba(245, 158, 11, 0.20), rgba(251, 191, 36, 0.10))' },
    { name: 'Bosque Profundo (Verde Jade)', value: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(5, 150, 105, 0.12))' },
    { name: 'Crepúsculo Directivo (Azul & Púrpura)', value: 'linear-gradient(135deg, rgba(14, 165, 233, 0.20), rgba(124, 58, 237, 0.15))' }
  ];

  const imagePresets = [
    { name: 'Ninguna (Fondo NeoFaro estándar)', url: '' },
    { name: '🌲 Bosque Nativo & Pinos', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80' },
    { name: '🔥 Fogón Scout Nocturno', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1400&q=80' },
    { name: '🏔️ Cumbre & Cordillera', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80' },
    { name: '📚 Aula Magna & Biblioteca', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80' },
    { name: '🌊 Faro & Costa Marina', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80' }
  ];

  const branchBannerPresets = [
    { name: 'Manada / Lobatos (Ámbar & Sol)', value: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.15))', color: '#d97706' },
    { name: 'Unidad Scout / Guías (Verde Selva)', value: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.15))', color: '#059669' },
    { name: 'Caminantes (Azul Aventura)', value: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(2, 132, 199, 0.15))', color: '#0284c7' },
    { name: 'Rovers (Rojo Fuego & Servicio)', value: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.15))', color: '#dc2626' },
    { name: 'Consejo / Directivos (Púrpura)', value: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(124, 58, 237, 0.15))', color: '#7c3aed' },
    { name: 'Educación & Primaria (Cian & Verde)', value: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(16, 185, 129, 0.15))', color: '#0891b2' }
  ];

  const handleSaveInstitution = (e) => {
    e.preventDefault();
    updateOrgCustomization(currentOrg.id, {
      color: primaryColor,
      motto: motto.trim(),
      bannerBg,
      bgImage: bgImage.trim()
    });
    setOrgCustomizationModalOpen(false);
  };

  const handleSaveSubgroup = (e) => {
    e.preventDefault();
    if (!selectedFolderId) return;
    updateFolderCustomization(selectedFolderId, {
      color: subColor,
      bannerBg: subBannerBg || `linear-gradient(135deg, ${subColor}25, var(--bg-card))`,
      bgImage: subBgImage.trim(),
      reminderNotice: subReminder.trim(),
      whatsappLink: subWhatsapp.trim()
    });
    setOrgCustomizationModalOpen(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 7, 14, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 130,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '700px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-xl)',
        maxHeight: '92vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--faro-cyan), var(--primary))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--faro-glow)',
              flexShrink: 0
            }}>
              <Palette size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
                Personalizar Identidad & Apariencia Visual
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                Elegí colores, imágenes de fondo y portadas tanto para la institución como para cada subgrupo o rama.
              </p>
            </div>
          </div>

          <button
            onClick={() => setOrgCustomizationModalOpen(false)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch between Institution and Subgroup */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          gap: '0.25rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setMode('institution')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.84rem',
              background: mode === 'institution' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'institution' ? 'var(--faro-cyan-light)' : 'var(--text-muted)',
              border: mode === 'institution' ? '1px solid var(--border-faro)' : '1px solid transparent',
              boxShadow: mode === 'institution' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Building2 size={16} />
            <span>Nivel Institución / Grupo (General)</span>
          </button>

          <button
            onClick={() => setMode('subgroup')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.84rem',
              background: mode === 'subgroup' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'subgroup' ? '#34d399' : 'var(--text-muted)',
              border: mode === 'subgroup' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              boxShadow: mode === 'subgroup' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Layers size={16} />
            <span>Nivel Subgrupos / Ramas (Educadores)</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* MODE 1: INSTITUTION CUSTOMIZATION                             */}
        {/* ============================================================== */}
        {mode === 'institution' && (
          <form onSubmit={handleSaveInstitution} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isAdmin && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: 'var(--secondary-text)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                ℹ️ La personalización general está habilitada para Autoridades y Responsables de la sede.
              </div>
            )}

            {/* Color Palette Selector */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>
                Color Distintivo Principal de la Institución:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
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
                      fontSize: '0.76rem',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: 'var(--radius-full)',
                      background: preset.hex,
                      flexShrink: 0
                    }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Color Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>O ingresa un código hexadecimal:</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    background: 'transparent'
                  }}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{
                    padding: '0.35rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    width: '100px'
                  }}
                />
              </div>
            </div>

            {/* Background Image / Texture for Institution */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Imagen de Fondo Institucional (Wallpaper con atmósfera de naturaleza/educación):
              </label>

              {/* Image Presets Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '0.65rem' }}>
                {imagePresets.map(preset => {
                  const isSelected = bgImage === preset.url;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setBgImage(preset.url)}
                      style={{
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-input)',
                        border: `1.5px solid ${isSelected ? 'var(--faro-cyan)' : 'var(--border-color)'}`,
                        color: isSelected ? 'var(--faro-cyan-light)' : 'var(--text-muted)',
                        fontSize: '0.74rem',
                        fontWeight: isSelected ? 700 : 500,
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {preset.name}
                      </span>
                      {isSelected && <Check size={14} style={{ color: 'var(--faro-cyan-light)', flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Image URL */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  type="url"
                  placeholder="O pega la URL de una imagen propia (https://...)"
                  value={bgImage}
                  onChange={(e) => setBgImage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem'
                  }}
                />
                {bgImage && (
                  <button
                    type="button"
                    onClick={() => setBgImage('')}
                    style={{
                      padding: '0.45rem 0.7rem',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.74rem',
                      cursor: 'pointer'
                    }}
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

            {/* Institutional Motto */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                Lema o Frase de Identidad Institucional:
              </label>
              <input
                type="text"
                placeholder="Ej: Siempre Listos para Servir • Educar para la Vida"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            {/* Banner Header Presets */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>
                Degradado de Encabezado Institucional:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
                {bannerPresets.map(bp => (
                  <button
                    key={bp.name}
                    type="button"
                    onClick={() => setBannerBg(bp.value)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: bp.value,
                      border: `1.5px solid ${bannerBg === bp.value ? primaryColor : 'var(--border-color)'}`,
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {bp.name}
                    </span>
                    {bannerBg === bp.value && <Check size={14} style={{ color: primaryColor }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview Card */}
            <div style={{
              background: bgImage ? `linear-gradient(rgba(14, 21, 36, 0.75), rgba(14, 21, 36, 0.9)), url(${bgImage}) center/cover` : bannerBg,
              border: `1px solid ${primaryColor}50`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: primaryColor, letterSpacing: '0.05em' }}>
                Vista Previa en Tiempo Real
              </span>
              <h4 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 800 }}>
                {currentOrg?.name}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#e2e8f0', fontStyle: 'italic', margin: 0 }}>
                "{motto}"
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setOrgCustomizationModalOpen(false)}
                style={{
                  padding: '0.55rem 1rem',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>

              <button
                type="submit"
                style={{
                  padding: '0.55rem 1.25rem',
                  background: 'var(--gradient-faro)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Aplicar a la Institución
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* MODE 2: SUBGROUP / RAMA CUSTOMIZATION (BY EDUCATORS)          */}
        {/* ============================================================== */}
        {mode === 'subgroup' && (
          <form onSubmit={handleSaveSubgroup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              color: 'var(--text-main)'
            }}>
              🎨 Los <strong>Educadores, Docentes y Dirigentes</strong> pueden darle a cada subgrupo o rama su propia identidad: colores distintivos, fotos de fondo/portada, avisos para familias y enlace de WhatsApp.
            </div>

            {/* Select Subgroup */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                Seleccionar Sección / Rama a Personalizar:
              </label>
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {currentOrg?.folders?.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.ageRange})
                  </option>
                ))}
              </select>
            </div>

            {/* Subgroup Preset Banners by Branch */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>
                Estilo Visual por Rama o Grado:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                {branchBannerPresets.map(preset => {
                  const isSelected = subColor === preset.color;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSubColor(preset.color);
                        setSubBannerBg(preset.value);
                      }}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        background: preset.value,
                        border: `1.5px solid ${isSelected ? preset.color : 'var(--border-color)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: 'var(--radius-full)', background: preset.color }} />
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {preset.name}
                        </span>
                      </div>
                      {isSelected && <Check size={14} style={{ color: preset.color }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Input for Subgroup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Color distintivo de la rama:</span>
              <input
                type="color"
                value={subColor}
                onChange={(e) => setSubColor(e.target.value)}
                style={{
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: 'transparent'
                }}
              />
              <input
                type="text"
                value={subColor}
                onChange={(e) => setSubColor(e.target.value)}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  width: '100px'
                }}
              />
            </div>

            {/* Background Image / Photo for this Subgroup */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                Imagen de Portada o Fondo del Subgrupo:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  type="url"
                  placeholder="URL de foto o portada de la rama (https://...)"
                  value={subBgImage}
                  onChange={(e) => setSubBgImage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem'
                  }}
                />
                {subBgImage && (
                  <button
                    type="button"
                    onClick={() => setSubBgImage('')}
                    style={{
                      padding: '0.45rem 0.7rem',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.74rem',
                      cursor: 'pointer'
                    }}
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

            {/* Reminder Notice */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                Cartel de Aviso / Recordatorio para Familias de este Subgrupo:
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Recuerden traer cuaderno de caza, gorra y cantimplora para el próximo campamento..."
                value={subReminder}
                onChange={(e) => setSubReminder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* WhatsApp Group Link */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                Enlace Oficial a Grupo de WhatsApp del Subgrupo:
              </label>
              <div style={{ position: 'relative' }}>
                <MessageCircle size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#25D366' }} />
                <input
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={subWhatsapp}
                  onChange={(e) => setSubWhatsapp(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setOrgCustomizationModalOpen(false)}
                style={{
                  padding: '0.55rem 1rem',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>

              <button
                type="submit"
                style={{
                  padding: '0.55rem 1.25rem',
                  background: subColor,
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Guardar Subgrupo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
