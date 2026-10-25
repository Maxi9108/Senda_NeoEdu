import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Share2, 
  FolderPlus, 
  ExternalLink, 
  Copy, 
  Check, 
  BarChart3, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Globe, 
  Users, 
  TrendingUp, 
  Compass, 
  GraduationCap, 
  Building2, 
  PlusCircle, 
  Trash2, 
  Lock,
  DownloadCloud,
  Sparkles,
  Send
} from 'lucide-react';

export const InterInstitutionalHub = () => {
  const { 
    data, 
    isAdmin, 
    isSuperAdmin, 
    isAdvancedAdmin, 
    currentUserRole, 
    setCurrentUserRole,
    currentOrg,
    addInterOrgResource,
    deleteInterOrgResource,
    addInterOrgPost
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('resources'); // 'resources' | 'stats' | 'forum'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  // New Resource Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Seguridad y Legal');
  const [newType, setNewType] = useState('drive');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const hubData = data.interInstitutionalHub || {
    sharedResources: [],
    statisticsComparison: [],
    coordinationPosts: []
  };

  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateResource = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    addInterOrgResource({
      title: newTitle.trim(),
      category: newCategory,
      institutionName: currentOrg?.name || 'Institución Participante',
      type: newType,
      url: newUrl.trim(),
      description: newDescription.trim() || 'Recurso compartido para la red interinstitucional.'
    });

    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
    setIsAddResourceModalOpen(false);
  };

  const handleSendPost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addInterOrgPost(newPostContent.trim());
    setNewPostContent('');
  };

  // If user is not in the authority category, show restricted access banner
  if (!isAdmin) {
    return (
      <div className="glass-panel animate-fade-in" style={{
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        textAlign: 'center',
        maxWidth: '680px',
        margin: '2rem auto',
        border: '1.5px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.15), rgba(217, 119, 6, 0.15))',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
        }}>
          <Lock size={32} />
        </div>

        <h2 style={{ fontSize: '1.45rem', color: 'var(--text-main)', margin: 0 }}>
          Carpeta Interinstitucional Reservada para Autoridades
        </h2>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
          Esta sección es un espacio de trabajo colaborativo exclusivo entre <strong>Jefes de Grupo, Equipos Directivos y Administradores</strong> de todas las instituciones adheridas a Senda NeoEdu. Permite intercambiar actas, estadísticas confidenciales, convenios y carpetas de Google Drive.
        </p>

        <div style={{
          background: 'var(--bg-input)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.84rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
          <span>Tu rol actual: <strong>{currentUserRole}</strong></span>
        </div>

        <button
          onClick={() => setCurrentUserRole('admin')}
          style={{
            padding: '0.75rem 1.4rem',
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          Acceder como Responsable Institucional (Jefe de Grupo / Directivo)
        </button>
      </div>
    );
  }

  // Filter resources
  const filteredResources = (hubData.sharedResources || []).filter(res => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch = !searchFilter.trim() || 
      res.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      res.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      res.institutionName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    'all',
    'Seguridad y Legal',
    'Medio Ambiente & Técnicas',
    'Finanzas & Administración',
    'Logística y Transporte',
    'Pedagógico'
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, #064e3b, #0f172a)',
        color: '#ffffff',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
          }}>
            <Building2 size={30} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <span style={{
                background: '#10b981',
                color: '#064e3b',
                fontWeight: 800,
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase'
              }}>
                Red Federada de Autoridades
              </span>
              <span style={{ fontSize: '0.84rem', color: '#a7f3d0' }}>
                Acceso Compartido entre Directivos & Jefes de Grupo
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', color: '#ffffff', margin: 0 }}>
              Espacio Interinstitucional de Trabajo
            </h1>
            <p style={{ color: '#d1fae5', fontSize: '0.86rem', margin: '0.25rem 0 0', maxWidth: '720px' }}>
              Carpeta compartida donde todas las instituciones intercambian datos, estadísticas, protocolos de campamento, carpetas de Drive y convenios comunes.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddResourceModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.25rem',
            background: '#ffffff',
            color: '#064e3b',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '0.88rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <FolderPlus size={18} style={{ color: '#059669' }} />
          <span>+ Compartir Material o Carpeta Drive</span>
        </button>
      </div>

      {/* Sub-tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.25rem'
      }}>
        <button
          onClick={() => setActiveSubTab('resources')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.2rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            background: activeSubTab === 'resources' ? 'var(--primary-light)' : 'transparent',
            color: activeSubTab === 'resources' ? 'var(--primary-text)' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'resources' ? 700 : 500,
            fontSize: '0.9rem',
            borderBottom: activeSubTab === 'resources' ? '2.5px solid var(--primary)' : '2.5px solid transparent'
          }}
        >
          <FileText size={17} style={{ color: activeSubTab === 'resources' ? 'var(--primary)' : 'var(--text-muted)' }} />
          <span>Materiales & Carpetas Compartidas ({hubData.sharedResources?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stats')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.2rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            background: activeSubTab === 'stats' ? 'var(--primary-light)' : 'transparent',
            color: activeSubTab === 'stats' ? 'var(--primary-text)' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'stats' ? 700 : 500,
            fontSize: '0.9rem',
            borderBottom: activeSubTab === 'stats' ? '2.5px solid var(--primary)' : '2.5px solid transparent'
          }}
        >
          <BarChart3 size={17} style={{ color: activeSubTab === 'stats' ? 'var(--primary)' : 'var(--text-muted)' }} />
          <span>Estadísticas & Métricas Comparativas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('forum')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.2rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            background: activeSubTab === 'forum' ? 'var(--primary-light)' : 'transparent',
            color: activeSubTab === 'forum' ? 'var(--primary-text)' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'forum' ? 700 : 500,
            fontSize: '0.9rem',
            borderBottom: activeSubTab === 'forum' ? '2.5px solid var(--primary)' : '2.5px solid transparent'
          }}
        >
          <MessageSquare size={17} style={{ color: activeSubTab === 'forum' ? 'var(--primary)' : 'var(--text-muted)' }} />
          <span>Foro de Coordinación & Convenios ({hubData.coordinationPosts?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: SHARED RESOURCES */}
      {activeSubTab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Filters & Search */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-input)',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {cat === 'all' ? 'Todas las Categorías' : cat}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Buscar material compartido..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                minWidth: '240px'
              }}
            />
          </div>

          {/* Resources Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredResources.map(res => {
              const isDrive = res.type === 'drive';
              const isDoc = res.type === 'document';
              const isWeb = res.type === 'web';

              return (
                <div
                  key={res.id}
                  className="glass-panel"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.4rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: isDrive ? '#e0f2fe' : (isDoc ? '#dcfce7' : '#fef3c7'),
                        color: isDrive ? '#0369a1' : (isDoc ? '#15803d' : '#b45309'),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        {isDrive ? '📁 Carpeta Google Drive' : (isDoc ? '📄 Documento / Matriz' : '🌐 Portal Web')}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          📅 {res.date}
                        </span>
                        {(isSuperAdmin || isAdvancedAdmin) && (
                          <button
                            onClick={() => deleteInterOrgResource(res.id)}
                            title="Eliminar recurso compartido (Administración)"
                            style={{ color: 'var(--text-muted)', padding: '2px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0.35rem 0' }}>
                      {res.title}
                    </h3>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                      {res.description}
                    </p>

                    <div style={{
                      background: 'var(--bg-input)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        <Building2 size={14} style={{ color: 'var(--primary)' }} />
                        <span>Aportado por: {res.institutionName}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        Autor: {res.author} • Categoría: <strong>{res.category}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 0.85rem',
                        background: 'var(--primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>{isDrive ? 'Abrir en Google Drive' : 'Acceder al Material'}</span>
                    </a>

                    <button
                      onClick={() => handleCopyLink(res.id, res.url)}
                      title="Copiar enlace directo"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 0.75rem',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        color: 'var(--text-main)',
                        fontWeight: 600
                      }}
                    >
                      {copiedId === res.id ? <Check size={14} style={{ color: 'var(--primary)' }} /> : <Copy size={14} />}
                      <span>{copiedId === res.id ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: STATISTICS & BENCHMARKING */}
      {activeSubTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Metrics summary cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <Users size={16} style={{ color: 'var(--primary)' }} />
                <span>Total Jóvenes en la Red</span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
                605
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '0.2rem', fontWeight: 600 }}>
                ↑ 14% de crecimiento anual conjunto
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <ShieldCheck size={16} style={{ color: '#0284c7' }} />
                <span>Educadores & Dirigentes</span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
                60
              </div>
              <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '0.2rem', fontWeight: 600 }}>
                100% con legajos y seguro activo
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <TrendingUp size={16} style={{ color: '#f59e0b' }} />
                <span>Tasa de Retención Promedio</span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
                96%
              </div>
              <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '0.2rem', fontWeight: 600 }}>
                Alto compromiso comunitario
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <Sparkles size={16} style={{ color: '#7c3aed' }} />
                <span>Proyectos de Servicio Social</span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
                17
              </div>
              <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '0.2rem', fontWeight: 600 }}>
                Huertas, comedores y reforestación
              </div>
            </div>
          </div>

          {/* Benchmark comparison table */}
          <div className="glass-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-input)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>
                Tablero Comparativo de Desempeño Interinstitucional
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Métricas anonimizadas y compartidas entre autoridades para identificar buenas prácticas y sinergias logísticas.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Institución</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Tipo</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Matrícula Activa</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Educadores</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Ratio Jóvenes/Adulto</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Retención</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Asistencia a Campamentos</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Proyectos Activos</th>
                  </tr>
                </thead>
                <tbody>
                  {(hubData.statisticsComparison || []).map(stat => (
                    <tr key={stat.orgId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {stat.name}
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span className={`badge ${stat.type === 'scout' ? 'badge-scout' : 'badge-edu'}`}>
                          {stat.type === 'scout' ? <Compass size={12} /> : <GraduationCap size={12} />}
                          {stat.type === 'scout' ? 'Scout' : 'Colegio'}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: 700 }}>
                        {stat.totalEnrolled} jóvenes
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {stat.activeEducators} docentes/dirigentes
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--primary)', fontWeight: 700 }}>
                        1 educador c/ {stat.ratioYouthPerEducator}
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>{stat.retentionRate}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{ color: '#0284c7', fontWeight: 700 }}>{stat.campAttendance}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span className="badge badge-purple">{stat.communityProjects} proyectos</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COORDINATION FORUM */}
      {activeSubTab === 'forum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Post Form */}
          <form
            onSubmit={handleSendPost}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
              <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
              <span>Publicar propuesta de coordinación o convenio entre instituciones</span>
            </div>

            <textarea
              rows={3}
              placeholder="Ej: Estamos reservando micros de larga distancia para el campamento de enero en Córdoba y nos sobran 15 butacas; o si alguna institución desea compartir compra comunitaria de botiquines..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.86rem'
                }}
              >
                <Send size={15} />
                <span>Publicar en la Red de Autoridades</span>
              </button>
            </div>
          </form>

          {/* Posts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(hubData.coordinationPosts || []).map(post => (
              <div
                key={post.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                        {post.author}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {post.authorRole}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    🕒 {post.date}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, margin: '0.35rem 0' }}>
                  {post.content}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MessageSquare size={14} />
                    {post.repliesCount} respuestas de autoridades
                  </span>
                  <button style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>
                    Responder al responsable
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: SHARE NEW RESOURCE / DRIVE FOLDER */}
      {isAddResourceModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '560px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderPlus size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>
                  Compartir Material con la Red Interinstitucional
                </h3>
              </div>
              <button
                onClick={() => setIsAddResourceModalOpen(false)}
                style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Título del Material o Carpeta *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Protocolo de Emergencias Climáticas 2027"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  >
                    <option value="Seguridad y Legal">Seguridad y Legal</option>
                    <option value="Medio Ambiente & Técnicas">Medio Ambiente & Técnicas</option>
                    <option value="Finanzas & Administración">Finanzas & Administración</option>
                    <option value="Logística y Transporte">Logística y Transporte</option>
                    <option value="Pedagógico">Pedagógico</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                    Tipo de Enlace
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  >
                    <option value="drive">📁 Carpeta Google Drive</option>
                    <option value="document">📄 Documento / Matriz (Docs / Sheets)</option>
                    <option value="web">🌐 Sitio Web / Portal Oficial</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Enlace URL (Google Drive / Docs / Web) *
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
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
                  Descripción y Utilidad para otras instituciones
                </label>
                <textarea
                  rows={2}
                  placeholder="Explica qué contiene este archivo y cómo puede ayudar a otros jefes de grupo o directivos..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
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

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddResourceModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.15rem',
                    background: 'var(--bg-input)',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.86rem'
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.35rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.86rem'
                  }}
                >
                  Compartir en la Red
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
