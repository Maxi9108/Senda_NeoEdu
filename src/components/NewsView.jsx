import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Newspaper, 
  Plus, 
  Heart, 
  Share2, 
  Tag, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  PackageCheck, 
  Sparkles, 
  MessageSquare,
  Layers,
  Filter,
  Send,
  Image as ImageIcon
} from 'lucide-react';

export const NewsView = () => {
  const { 
    data, 
    currentOrg, 
    activeFolderId, 
    activeFolder, 
    addNews, 
    deleteNews, 
    toggleNewsLike, 
    canEdit, 
    currentUserRole 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pledgedMaterials, setPledgedMaterials] = useState({}); // itemKey -> pledged boolean

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Novedades Generales');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [materialsNeededInput, setMaterialsNeededInput] = useState('');
  const [targetBranchId, setTargetBranchId] = useState(activeFolderId !== 'all' ? activeFolderId : 'all');

  const categories = [
    'all',
    'Novedades Generales',
    'Materiales & Equipamiento',
    'Campamento',
    'Proyectos & Servicio'
  ];

  // News filtering
  const orgNews = (data.news || []).filter(item => {
    if (item.orgId !== currentOrg.id) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (activeFolderId !== 'all') {
      const matchesBranch = item.branchId === activeFolderId || item.branchId === 'all';
      if (!matchesBranch) return false;
    }
    return true;
  });

  const handleCreateNews = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const materialsArray = materialsNeededInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const branch = currentOrg.folders?.find(f => f.id === targetBranchId);

    const newArticle = {
      title: title.trim(),
      category,
      content: content.trim(),
      author: currentUserRole === 'superadmin' ? 'Maximiliano Sánchez' : 'Jefatura / Docentes',
      authorRole: currentUserRole === 'superadmin' ? 'Super Administrador' : (canEdit ? 'Equipo Educador' : 'Miembro'),
      imageUrl: imageUrl.trim() || null,
      materialsNeeded: materialsArray,
      branchId: targetBranchId,
      branchName: targetBranchId === 'all' ? 'Todo el Grupo' : (branch?.name || 'Sección')
    };

    addNews(newArticle);
    setTitle('');
    setContent('');
    setImageUrl('');
    setMaterialsNeededInput('');
    setIsModalOpen(false);
  };

  const togglePledge = (itemKey) => {
    setPledgedMaterials(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        background: `linear-gradient(135deg, ${currentOrg.color}15, var(--bg-card))`,
        borderLeft: `6px solid ${currentOrg.color}`,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-scout">
              <Newspaper size={14} />
              Sección de Noticias & Novedades
            </span>
            {activeFolderId !== 'all' && activeFolder && (
              <span className="badge" style={{ background: `${activeFolder.color}25`, color: activeFolder.color, fontWeight: 700 }}>
                {activeFolder.name}
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {orgNews.length} publicaciones
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>Novedades, Comunicados & Pedidos</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '680px' }}>
            Espacio informativo unificado para compartir anuncios institucionales, listas de materiales que se precisan y fotos de actividades.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.92rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Plus size={18} />
            <span>Publicar Noticia</span>
          </button>
        )}
      </div>

      {/* Categories Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '0.5rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700, marginRight: '0.5rem' }}>
          <Filter size={15} />
          <span>Filtrar por:</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: categoryFilter === cat ? 'var(--primary)' : 'var(--bg-input)',
              color: categoryFilter === cat ? '#fff' : 'var(--text-main)',
              border: `1px solid ${categoryFilter === cat ? 'var(--primary)' : 'var(--border-color)'}`,
              fontSize: '0.84rem',
              fontWeight: categoryFilter === cat ? 700 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            {cat === 'all' ? 'Todas las Categorías' : cat}
          </button>
        ))}
      </div>

      {/* News Feed Grid */}
      {orgNews.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-muted)'
        }}>
          <Newspaper size={44} style={{ opacity: 0.35, margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No hay publicaciones en esta categoría
          </h3>
          <p style={{ fontSize: '0.9rem' }}>
            Sé el primero en compartir novedades, listas de materiales necesarios o fotos de actividades.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          gap: '1.5rem'
        }}>
          {orgNews.map(item => {
            const hasMaterials = item.materialsNeeded && item.materialsNeeded.length > 0;

            return (
              <article
                key={item.id}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  {/* Optional Image Banner */}
                  {item.imageUrl && (
                    <div style={{
                      width: '100%',
                      height: '210px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {item.category}
                      </span>
                    </div>
                  )}

                  {/* Header info */}
                  <div style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.4rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem'
                        }}>
                          {item.author.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {item.author}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.authorRole} • 📅 {item.date}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          background: 'var(--bg-input)',
                          color: 'var(--text-muted)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600
                        }}>
                          {item.branchName || 'Todo el Grupo'}
                        </span>
                        {canEdit && (
                          <button
                            onClick={() => deleteNews(item.id)}
                            title="Eliminar publicación"
                            style={{ color: 'var(--text-muted)', padding: '3px' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.65rem', lineHeight: 1.35 }}>
                      {item.title}
                    </h2>

                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                      lineHeight: 1.55,
                      whiteSpace: 'pre-line'
                    }}>
                      {item.content}
                    </p>
                  </div>

                  {/* Materials Needed Interactive Box */}
                  {hasMaterials && (
                    <div style={{
                      margin: '1rem 1.25rem',
                      padding: '1rem',
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--secondary)' }}>
                        <PackageCheck size={16} />
                        <span>Materiales que se precisan (Haz clic para confirmar tu aporte):</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {item.materialsNeeded.map((mat, idx) => {
                          const itemKey = `${item.id}-mat-${idx}`;
                          const isPledged = pledgedMaterials[itemKey];

                          return (
                            <div
                              key={idx}
                              onClick={() => togglePledge(itemKey)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.45rem 0.75rem',
                                background: isPledged ? 'var(--primary-light)' : 'var(--bg-surface)',
                                borderRadius: 'var(--radius-sm)',
                                border: `1px solid ${isPledged ? 'var(--primary)' : 'var(--border-color)'}`,
                                cursor: 'pointer',
                                fontSize: '0.84rem',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isPledged ? 'var(--primary-text)' : 'var(--text-main)' }}>
                                <CheckCircle size={15} style={{ color: isPledged ? 'var(--primary)' : 'var(--text-muted)' }} />
                                <span>{mat}</span>
                              </div>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: isPledged ? 'var(--primary)' : 'var(--text-muted)'
                              }}>
                                {isPledged ? '✓ Yo lo aporto' : '+ Ofrecer aporte'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Interaction Bar */}
                <div style={{
                  padding: '0.85rem 1.25rem',
                  borderTop: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => toggleNewsLike(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: (item.likes || 0) > 0 ? 'var(--accent-rose)' : 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      <Heart size={16} fill={(item.likes || 0) > 0 ? 'currentColor' : 'none'} />
                      <span>{item.likes || 0} Apoyos</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <MessageSquare size={16} />
                      <span>Comunidad</span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Senda NeoEdu
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Create News Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '560px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Newspaper size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Publicar en Senda NeoEdu</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateNews} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Título de la Publicación *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Materiales para el campamento de verano / Taller de nudos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                    <option value="Novedades Generales">Novedades Generales</option>
                    <option value="Materiales & Equipamiento">Materiales & Equipamiento</option>
                    <option value="Campamento">Campamento</option>
                    <option value="Proyectos & Servicio">Proyectos & Servicio</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Destino / Rama
                  </label>
                  <select
                    value={targetBranchId}
                    onChange={(e) => setTargetBranchId(e.target.value)}
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
                    <option value="all">Todo el Grupo (General)</option>
                    {currentOrg.folders?.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Contenido / Mensaje *
                </label>
                <textarea
                  rows={4}
                  placeholder="Detalla la novedad, fecha límite, instrucciones para las familias o educadores..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Materiales Necesarios (Opcional - uno por línea)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Ej:\n5 Cuerdas de algodón de 3 metros\n1 Botiquín de campaña portátil\nCartulinas de colores y marcadores`}
                  value={materialsNeededInput}
                  onChange={(e) => setMaterialsNeededInput(e.target.value)}
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

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  URL de Imagen de Portada (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
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

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.15rem',
                    background: 'var(--bg-input)',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.88rem'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.35rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Send size={15} />
                  <span>Publicar Ahora</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
