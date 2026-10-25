import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  Phone, 
  Mail, 
  Download, 
  Plus, 
  ExternalLink, 
  Palette, 
  Send, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Share2,
  CheckCircle,
  Eye,
  Settings,
  AlertCircle,
  Megaphone,
  CalendarDays,
  X,
  Globe,
  FolderOpen,
  Copy,
  Check,
  Trash2,
  Crown,
  FolderPlus
} from 'lucide-react';

export const CommunitySection = () => {
  const { 
    currentOrg, 
    activeFolderId, 
    activeFolder,
    data, 
    canEdit, 
    isAdmin, 
    isAdult,
    isSuperAdmin,
    currentUserRole,
    setCurrentUserRole,
    setCurrentTab,
    updateFolderCustomization,
    addFolderMaterial,
    addFolderPhoto,
    sendMessage,
    addAnnouncement,
    dismissAnnouncement,
    canAccessSubgroupPrivateAdults,
    addFolderPrivateResource,
    deleteFolderPrivateResource
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('materials'); // 'materials' | 'gallery' | 'educators' | 'messaging' | 'private_adults'
  const [isEditingCustomization, setIsEditingCustomization] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAddPrivateResourceModal, setShowAddPrivateResourceModal] = useState(false);
  const [privateResourceFilter, setPrivateResourceFilter] = useState('all'); // 'all' | 'drive' | 'document' | 'web' | 'other'
  const [copiedResourceId, setCopiedResourceId] = useState(null);
  const [privateResourceForm, setPrivateResourceForm] = useState({
    title: '',
    type: 'drive',
    url: '',
    description: ''
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    audience: 'all' // 'all' | 'adults_only'
  });

  const [customForm, setCustomForm] = useState({
    color: activeFolder?.color || currentOrg.color,
    whatsappLink: activeFolder?.whatsappLink || '',
    ageRange: activeFolder?.ageRange || '',
    reminderNotice: activeFolder?.reminderNotice || ''
  });

  // Forms for new material, photo, message
  const [newMaterialForm, setNewMaterialForm] = useState({ title: '', category: 'Pedagógico', size: '500 KB' });
  const [showAddMaterial, setShowAddMaterial] = useState(false);

  const [newPhotoForm, setNewPhotoForm] = useState({ title: '', url: '', eventTag: 'Actividad' });
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  const [messageText, setMessageText] = useState('');

  // Target folder to display
  const folder = activeFolder || currentOrg.folders[0] || {};
  const materials = folder.materials || [];
  const gallery = folder.gallery || [];

  // Filter educators belonging to this branch or organization
  const branchEducators = data.members.filter(m => 
    m.orgId === currentOrg.id && 
    (m.role === 'educator' || m.role === 'admin') &&
    (activeFolderId === 'all' || m.branchId === activeFolderId || m.role === 'admin')
  );

  // Filter messages for this organization
  const orgMessages = (data.messages || []).filter(m => m.orgId === currentOrg.id);

  // Filter announcements for current audience (all or adults)
  const activeAnnouncements = (data.announcements || []).filter(a => {
    if (a.orgId !== currentOrg.id || a.active === false) return false;
    if (a.audience === 'adults_only' && !isAdult) return false;
    return true;
  });

  const handleSaveCustomization = (e) => {
    e.preventDefault();
    updateFolderCustomization(folder.id, customForm);
    setIsEditingCustomization(false);
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.message.trim()) return;
    addAnnouncement({
      title: announcementForm.title.trim(),
      message: announcementForm.message.trim(),
      audience: announcementForm.audience,
      author: currentUserRole === 'admin' ? 'Jefatura de Grupo / Directivo' : 'Educador Responsable'
    });
    setAnnouncementForm({ title: '', message: '', audience: 'all' });
    setShowAnnouncementModal(false);
  };

  const handleAddMaterialSubmit = (e) => {
    e.preventDefault();
    if (!newMaterialForm.title.trim()) return;
    addFolderMaterial(folder.id, newMaterialForm);
    setNewMaterialForm({ title: '', category: 'Pedagógico', size: '500 KB' });
    setShowAddMaterial(false);
  };

  const handleAddPhotoSubmit = (e) => {
    e.preventDefault();
    if (!newPhotoForm.title.trim()) return;
    addFolderPhoto(folder.id, {
      ...newPhotoForm,
      url: newPhotoForm.url || 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=600&q=80'
    });
    setNewPhotoForm({ title: '', url: '', eventTag: 'Actividad' });
    setShowAddPhoto(false);
  };

  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(messageText.trim());
    setMessageText('');
  };

  const handleCopyLink = (resId, url) => {
    navigator.clipboard.writeText(url);
    setCopiedResourceId(resId);
    setTimeout(() => setCopiedResourceId(null), 2500);
  };

  const handleAddPrivateResourceSubmit = (e) => {
    e.preventDefault();
    if (!privateResourceForm.title.trim() || !privateResourceForm.url.trim()) return;
    addFolderPrivateResource(folder.id, privateResourceForm);
    setPrivateResourceForm({
      title: '',
      type: 'drive',
      url: '',
      description: ''
    });
    setShowAddPrivateResourceModal(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* INSTITUTIONAL ANNOUNCEMENT CARDS (CARTEL DE AVISO DE AUTORIDADES) */}
      {activeAnnouncements.map(ann => {
        const isAdultOnly = ann.audience === 'adults_only';
        return (
          <div
            key={ann.id}
            style={{
              padding: '1.15rem 1.35rem',
              borderRadius: 'var(--radius-lg)',
              background: isAdultOnly ? 'var(--secondary-light)' : 'var(--primary-light)',
              border: `2px solid ${isAdultOnly ? 'var(--secondary)' : 'var(--primary)'}`,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: isAdultOnly ? 'var(--secondary)' : 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Megaphone size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isAdultOnly ? 'var(--secondary)' : 'var(--primary-text)'
                  }}>
                    {isAdultOnly ? '🔒 Comunicado para Adultos' : '📢 Aviso General Institucional'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    • {ann.date} • {ann.author}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {ann.title}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {ann.message}
                </p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => dismissAnnouncement(ann.id)}
                title="Descartar este aviso"
                style={{ color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        );
      })}

      {/* CARTEL RECORDATORIO AL ENTRAR AL SUBGRUPO */}
      {folder.reminderNotice && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          borderLeft: `5px solid ${folder.color || 'var(--secondary)'}`,
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={22} style={{ color: folder.color || 'var(--secondary)', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                🎒 Recordatorio Importante para Familias y Protagonistas:
              </strong>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {folder.reminderNotice}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-light)',
              color: 'var(--primary-text)',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <CalendarDays size={14} />
            <span>Ver Mochila & Materiales</span>
          </button>
        </div>
      )}

      {/* Customizable Branch Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        background: folder.bannerBg || `linear-gradient(135deg, ${folder.color}25, var(--bg-card))`,
        borderLeft: `6px solid ${folder.color || currentOrg.color}`,
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge" style={{ background: `${folder.color}20`, color: folder.color, fontWeight: 700 }}>
              {folder.isPrivateAdultOnly ? '🔒 Espacio Privado de Adultos' : '👨‍👩‍👧 Espacio Familiar & Protagonistas'}
            </span>
            {folder.ageRange && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {folder.ageRange}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>{folder.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Portal de comunicación, materiales descargables, avisos oficiales y fotografías de actividades.
          </p>
        </div>

        {/* Action Controls & WhatsApp Link */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* WhatsApp Group Link */}
          {folder.whatsappLink && (
            <a
              href={folder.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                background: '#25D366',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>Grupo de WhatsApp</span>
              <ExternalLink size={16} />
            </a>
          )}

          {/* New Official Announcement Button for Authorities */}
          {isAdmin && (
            <button
              onClick={() => setShowAnnouncementModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--secondary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.88rem'
              }}
            >
              <Megaphone size={16} />
              <span>Publicar Aviso</span>
            </button>
          )}

          {/* Edit Customization (Teachers / Admins) */}
          {canEdit && (
            <button
              onClick={() => setIsEditingCustomization(!isEditingCustomization)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.88rem'
              }}
              title="Personalizar color distintivo, fondo y enlace a WhatsApp"
            >
              <Palette size={16} style={{ color: folder.color }} />
              <span>Personalizar Sección</span>
            </button>
          )}
        </div>
      </div>

      {/* New Announcement Modal */}
      {showAnnouncementModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '1rem'
        }}>
          <form onSubmit={handleAddAnnouncement} className="glass-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '520px',
            width: '100%',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h3 style={{ fontSize: '1.25rem' }}>Publicar Cartel de Aviso Oficial</h3>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Título del Aviso *</label>
              <input
                type="text"
                required
                placeholder="Ej. Recordatorio de Cuota de Campamento, Horarios..."
                value={announcementForm.title}
                onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Destinatarios *</label>
              <select
                value={announcementForm.audience}
                onChange={e => setAnnouncementForm({ ...announcementForm, audience: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              >
                <option value="all">📢 Para Toda la Comunidad (Familias y Protagonistas)</option>
                <option value="adults_only">🔒 Solo para Miembros Adultos (Familias y Educadores)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Mensaje Detallado *</label>
              <textarea
                rows={4}
                required
                placeholder="Escribe la información importante que verán todos los integrantes..."
                value={announcementForm.message}
                onChange={e => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAnnouncementModal(false)}
                style={{ padding: '0.5rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ padding: '0.5rem 1.15rem', background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 700 }}
              >
                Publicar Cartel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customization Drawer / Form */}
      {isEditingCustomization && (
        <form onSubmit={handleSaveCustomization} className="glass-panel" style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h3 style={{ fontSize: '1.1rem' }}>Personalizar Apariencia y Canales de {folder.name}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Color Distintivo:</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                {['#f59e0b', '#16a34a', '#0284c7', '#7c3aed', '#dc2626', '#b91c1c'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCustomForm({ ...customForm, color: c })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-full)',
                      background: c,
                      border: customForm.color === c ? '3px solid #000' : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Enlace al Grupo de WhatsApp Oficial:</label>
              <input
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={customForm.whatsappLink}
                onChange={e => setCustomForm({ ...customForm, whatsappLink: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Rango de Edades o Año Escolar:</label>
              <input
                type="text"
                placeholder="Ej. 11 a 14 años, 4° Grado Primaria..."
                value={customForm.ageRange}
                onChange={e => setCustomForm({ ...customForm, ageRange: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Texto de Recordatorio para Miembros al Entrar a su Subgrupo:
              </label>
              <input
                type="text"
                placeholder="Ej. Recuerden llevar plato plástico, cantimplora y autorización firmada..."
                value={customForm.reminderNotice}
                onChange={e => setCustomForm({ ...customForm, reminderNotice: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsEditingCustomization(false)}
              style={{ padding: '0.45rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ padding: '0.45rem 1rem', background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      )}

      {/* Sub Tabs Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'materials', label: 'Materiales & Circulares', icon: FileText, count: materials.length },
          { id: 'gallery', label: 'Galería de Actividades & Fotos', icon: ImageIcon, count: gallery.length },
          { id: 'educators', label: 'Educadores a Cargo', icon: Users, count: branchEducators.length },
          { id: 'messaging', label: 'Mensajería de Adultos', icon: MessageSquare, count: orgMessages.length },
          { 
            id: 'private_adults', 
            label: 'Espacio Privado de Adultos', 
            icon: Lock, 
            count: (folder.privateAdultResources || []).length, 
            isPrivateBadge: true 
          }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.15rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? (tab.isPrivateBadge ? 'var(--secondary)' : 'var(--primary)') : 'var(--text-muted)',
                borderBottom: isActive ? `3px solid ${tab.isPrivateBadge ? 'var(--secondary)' : 'var(--primary)'}` : '3px solid transparent',
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                background: isActive && tab.isPrivateBadge ? 'rgba(217, 119, 6, 0.08)' : 'transparent'
              }}
            >
              <Icon size={17} style={{ color: tab.isPrivateBadge ? 'var(--secondary)' : undefined }} />
              <span>{tab.label}</span>
              {tab.isPrivateBadge && (
                <span style={{
                  fontSize: '0.65rem',
                  background: 'var(--secondary)',
                  color: '#fff',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  Privado
                </span>
              )}
              <span style={{
                fontSize: '0.75rem',
                background: isActive ? (tab.isPrivateBadge ? 'rgba(217, 119, 6, 0.2)' : 'var(--primary-light)') : 'var(--bg-input)',
                color: isActive ? (tab.isPrivateBadge ? 'var(--secondary)' : 'var(--primary-text)') : 'var(--text-muted)',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: MATERIALES & CIRCULARES */}
      {activeSubTab === 'materials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Documentos y Fichas para Familias y Miembros</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Fichas médicas, autorizaciones de salida, manuales y reglamentos.
              </p>
            </div>
            {canEdit && (
              <button
                onClick={() => setShowAddMaterial(!showAddMaterial)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                <Plus size={16} />
                <span>Subir Material</span>
              </button>
            )}
          </div>

          {showAddMaterial && (
            <form onSubmit={handleAddMaterialSubmit} className="glass-panel" style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                required
                placeholder="Nombre del documento (ej. Autorización Parque)"
                value={newMaterialForm.title}
                onChange={e => setNewMaterialForm({ ...newMaterialForm, title: e.target.value })}
                style={{ flex: 1, minWidth: '220px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
              />
              <input
                type="text"
                placeholder="Categoría (Salud, Pedagógico, etc.)"
                value={newMaterialForm.category}
                onChange={e => setNewMaterialForm({ ...newMaterialForm, category: e.target.value })}
                style={{ width: '180px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
              />
              <button
                type="submit"
                style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}
              >
                Publicar
              </button>
            </form>
          )}

          {materials.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={36} style={{ margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
              <p>No hay documentos compartidos en esta carpeta todavía.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {materials.map(mat => (
                <div
                  key={mat.id}
                  className="glass-panel"
                  style={{
                    padding: '1.15rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.94rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                        {mat.title}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {mat.category} • {mat.size} • {mat.date}
                      </div>
                    </div>
                  </div>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Descargando documento: ${mat.title}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-input)',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <Download size={14} />
                    <span>Bajar</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: GALERÍA DE FOTOS & EVENTOS */}
      {activeSubTab === 'gallery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Fotografías de Actividades y Salidas</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Recuerdos de campamentos, talleres y jornadas compartidas con las familias.
              </p>
            </div>
            {canEdit && (
              <button
                onClick={() => setShowAddPhoto(!showAddPhoto)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                <Plus size={16} />
                <span>Añadir Foto</span>
              </button>
            )}
          </div>

          {showAddPhoto && (
            <form onSubmit={handleAddPhotoSubmit} className="glass-panel" style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                required
                placeholder="Título o pie de foto..."
                value={newPhotoForm.title}
                onChange={e => setNewPhotoForm({ ...newPhotoForm, title: e.target.value })}
                style={{ flex: 1, minWidth: '220px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
              />
              <input
                type="text"
                placeholder="Etiqueta (Campamento, Juego, etc.)"
                value={newPhotoForm.eventTag}
                onChange={e => setNewPhotoForm({ ...newPhotoForm, eventTag: e.target.value })}
                style={{ width: '180px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
              />
              <button
                type="submit"
                style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}
              >
                Subir
              </button>
            </form>
          )}

          {gallery.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ImageIcon size={36} style={{ margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
              <p>Aún no hay fotos cargadas en este álbum.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {gallery.map(item => (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '190px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '0.85rem' }}>
                    <span className="badge badge-warning" style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                      {item.eventTag}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      {item.title}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: EDUCADORES & INFORMACIÓN PÚBLICA / PRIVADA */}
      {activeSubTab === 'educators' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Dirigentes y Docentes a Cargo</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Información de contacto institucional para familias y consultas pedagógicas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {branchEducators.map(edu => (
              <div
                key={edu.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <img
                  src={edu.avatar}
                  alt={edu.name}
                  style={{
                    width: '65px',
                    height: '65px',
                    borderRadius: 'var(--radius-full)',
                    objectFit: 'cover',
                    border: '2px solid var(--primary)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                    {edu.name}
                  </h4>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                    {edu.roleLabel || edu.role}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.82rem' }}>
                    {edu.showPublicEmail ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                        <Mail size={13} style={{ color: 'var(--accent-blue)' }} />
                        <a href={`mailto:${edu.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {edu.email}
                        </a>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Correo no publicado
                      </div>
                    )}

                    {edu.showPublicPhone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                        <Phone size={13} style={{ color: 'var(--primary)' }} />
                        <span>{edu.phone}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Teléfono reservado para emergencias
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MENSAJERÍA PARA ADULTOS */}
      {activeSubTab === 'messaging' && (
        <div className="glass-panel" style={{
          padding: '1.5rem',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Bandeja de Mensajes de Adultos</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Comunicación directa entre educadores, directivos y familias.
            </p>
          </div>

          {/* Post Message Input (Adults only) */}
          {isAdult ? (
            <form onSubmit={handleSendMessageSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Escribe una consulta o aviso para los adultos..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              />
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                <Send size={15} />
                <span>Enviar</span>
              </button>
            </form>
          ) : (
            <div style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              🔒 Solo adultos (familias y docentes) pueden enviar mensajes en este canal.
            </div>
          )}

          {/* Messages list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {orgMessages.map(msg => (
              <div
                key={msg.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: msg.senderRole === 'educator' || msg.senderRole === 'admin' ? 'var(--primary-light)' : 'var(--bg-input)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{msg.senderName}</strong>
                    <span className="badge" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                      {msg.branchName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: ESPACIO PRIVADO DE ADULTOS DEL SUBGRUPO */}
      {activeSubTab === 'private_adults' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!canAccessSubgroupPrivateAdults(folder) ? (
            /* ACCESS RESTRICTED GATE FOR NON-ADULT OR UNAUTHORIZED USERS */
            <div className="glass-panel" style={{
              padding: '3rem 2rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface)',
              border: '2px solid rgba(217, 119, 6, 0.4)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(217, 119, 6, 0.15)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Lock size={32} />
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(217, 119, 6, 0.15)',
                color: 'var(--secondary)',
                padding: '3px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 800
              }}>
                <ShieldCheck size={14} />
                <span>Sección Privada Reservada</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>
                Espacio Reservado para Miembros Adultos y Autoridades
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '520px', lineHeight: 1.5 }}>
                Esta sección de <strong>{folder.name}</strong> contiene carpetas compartidas de Google Drive, documentos internos, actas y planificaciones pedagógicas reservadas exclusivamente para los educadores a cargo de este subgrupo y las autoridades o responsables de la institución.
              </p>

              <div style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-input)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                Tu rol de navegación actual: <strong>{currentUserRole === 'student' ? '🎒 Protagonista / Alumno' : currentUserRole}</strong>.
              </div>

              <button
                onClick={() => setCurrentUserRole('educator')}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Cambiar a Perfil de Educador / Dirigente
              </button>
            </div>
          ) : (
            /* AUTHORIZED ADULT VIEW: DRIVE FOLDERS, WEBSITES, PRIVATE DOCS */
            <>
              {/* Header Banner */}
              <div className="glass-panel" style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1), var(--bg-surface))',
                border: '1.5px solid rgba(217, 119, 6, 0.35)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-warning" style={{ fontWeight: 800 }}>
                      <Lock size={12} />
                      Espacio Privado de Adultos: {folder.name}
                    </span>
                    <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-main)', fontWeight: 600 }}>
                      <Crown size={12} style={{ color: '#d97706' }} />
                      Visible para Autoridades & Responsables
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {(folder.privateAdultResources || []).length} recursos vinculados
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    Carpetas de Drive, Documentos & Sitios del Equipo
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '680px' }}>
                    Centraliza aquí los accesos directos a Google Drive, matrices de evaluación, actas de consejo de rama y sitios web de referencia pedagógica de {folder.name}.
                  </p>
                </div>

                {canEdit && (
                  <button
                    onClick={() => setShowAddPrivateResourceModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.25rem',
                      background: 'var(--secondary)',
                      color: '#fff',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Plus size={18} />
                    <span>Añadir Enlace o Carpeta</span>
                  </button>
                )}
              </div>

              {/* Resource Type Filters */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  { id: 'all', label: 'Todos los Recursos' },
                  { id: 'drive', label: '📁 Carpetas Google Drive' },
                  { id: 'document', label: '📄 Documentos y Actas' },
                  { id: 'web', label: '🌐 Páginas y Enlaces' },
                  { id: 'other', label: '🔗 Otros' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setPrivateResourceFilter(filter.id)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      background: privateResourceFilter === filter.id ? 'var(--secondary)' : 'var(--bg-input)',
                      color: privateResourceFilter === filter.id ? '#fff' : 'var(--text-main)',
                      border: `1px solid ${privateResourceFilter === filter.id ? 'var(--secondary)' : 'var(--border-color)'}`,
                      fontSize: '0.82rem',
                      fontWeight: privateResourceFilter === filter.id ? 700 : 500,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Grid of Private Resources */}
              {(folder.privateAdultResources || []).filter(res => privateResourceFilter === 'all' || res.type === privateResourceFilter).length === 0 ? (
                <div className="glass-panel" style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--text-muted)'
                }}>
                  <FolderOpen size={40} style={{ opacity: 0.35, margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    No hay recursos cargados en esta categoría
                  </h4>
                  <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Puedes vincular carpetas de Google Drive, documentos de actas o páginas de consulta para los educadores de {folder.name}.
                  </p>
                  {canEdit && (
                    <button
                      onClick={() => setShowAddPrivateResourceModal(true)}
                      style={{
                        padding: '0.55rem 1rem',
                        background: 'var(--primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      + Añadir Primer Recurso Privado
                    </button>
                  )}
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {(folder.privateAdultResources || [])
                    .filter(res => privateResourceFilter === 'all' || res.type === privateResourceFilter)
                    .map(res => {
                      const isDrive = res.type === 'drive';
                      const isDoc = res.type === 'document';
                      const isWeb = res.type === 'web';
                      
                      const typeBadge = isDrive 
                        ? { label: 'Carpeta Google Drive', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.15)', icon: FolderOpen }
                        : isDoc 
                        ? { label: 'Documento / Acta Privada', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: FileText }
                        : isWeb 
                        ? { label: 'Página Web Oficial', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.15)', icon: Globe }
                        : { label: 'Recurso Enlazado', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.15)', icon: ExternalLink };

                      const TypeIcon = typeBadge.icon;
                      const isCopied = copiedResourceId === res.id;

                      return (
                        <div
                          key={res.id}
                          className="glass-panel"
                          style={{
                            padding: '1.35rem',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderTop: `4px solid ${typeBadge.color}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.75rem',
                                background: typeBadge.bg,
                                color: typeBadge.color,
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 700
                              }}>
                                <TypeIcon size={13} />
                                {typeBadge.label}
                              </span>

                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                📅 {res.date}
                              </span>
                            </div>

                            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                              {res.title}
                            </h3>

                            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                              {res.description}
                            </p>

                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              background: 'var(--bg-input)',
                              padding: '0.35rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              <ExternalLink size={12} style={{ flexShrink: 0 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.url}</span>
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                              Cargado por: <strong>{res.author}</strong>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.4rem',
                                  padding: '0.55rem 0.85rem',
                                  background: typeBadge.color,
                                  color: '#fff',
                                  borderRadius: 'var(--radius-md)',
                                  fontWeight: 700,
                                  fontSize: '0.84rem',
                                  textDecoration: 'none',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <ExternalLink size={14} />
                                <span>{isDrive ? 'Abrir en Drive' : 'Abrir Enlace'}</span>
                              </a>

                              <button
                                onClick={() => handleCopyLink(res.id, res.url)}
                                title="Copiar enlace al portapapeles"
                                style={{
                                  padding: '0.55rem 0.75rem',
                                  borderRadius: 'var(--radius-md)',
                                  background: 'var(--bg-input)',
                                  border: '1px solid var(--border-color)',
                                  color: isCopied ? 'var(--primary)' : 'var(--text-main)',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                <span>{isCopied ? '¡Listo!' : 'Copiar'}</span>
                              </button>

                              {canEdit && (
                                <button
                                  onClick={() => deleteFolderPrivateResource(folder.id, res.id)}
                                  title="Eliminar este enlace privado"
                                  style={{
                                    padding: '0.55rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--accent-rose)'
                                  }}
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* MODAL: AÑADIR ENLACE O DOCUMENTO PRIVADO AL SUBGRUPO */}
      {showAddPrivateResourceModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '1rem'
        }}>
          <form
            onSubmit={handleAddPrivateResourceSubmit}
            className="glass-panel"
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} style={{ color: 'var(--secondary)' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>
                  Añadir Enlace Privado a {folder.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPrivateResourceModal(false)}
                style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
              >
                ×
              </button>
            </div>

            <div style={{
              background: 'rgba(217, 119, 6, 0.1)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              lineHeight: 1.4
            }}>
              🔒 <strong>Privacidad del subgrupo:</strong> Este recurso estará visible únicamente para los miembros adultos de {folder.name} y las autoridades o directivos de la institución.
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Tipo de Recurso *
              </label>
              <select
                value={privateResourceForm.type}
                onChange={e => setPrivateResourceForm({ ...privateResourceForm, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              >
                <option value="drive">📁 Carpeta de Google Drive (Planificaciones, Actas, Fichas)</option>
                <option value="document">📄 Documento Privado / Hoja de Cálculo</option>
                <option value="web">🌐 Página Web / Portal Oficial de Consulta</option>
                <option value="other">🔗 Otro Recurso Externo / Formulario</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Título Identificatorio *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Carpeta Drive: Actas y Seguimiento Pedagógico 2026"
                value={privateResourceForm.title}
                onChange={e => setPrivateResourceForm({ ...privateResourceForm, title: e.target.value })}
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

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Enlace / URL de Destino *
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/drive/folders/... o https://..."
                value={privateResourceForm.url}
                onChange={e => setPrivateResourceForm({ ...privateResourceForm, url: e.target.value })}
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

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                Descripción o Indicaciones para el Equipo Adulto
              </label>
              <textarea
                rows={3}
                placeholder="Indica qué información contiene y quiénes deben completarla o revisarla..."
                value={privateResourceForm.description}
                onChange={e => setPrivateResourceForm({ ...privateResourceForm, description: e.target.value })}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAddPrivateResourceModal(false)}
                style={{
                  padding: '0.65rem 1rem',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.65rem 1.35rem',
                  background: 'var(--secondary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Vincular Recurso Privado
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
