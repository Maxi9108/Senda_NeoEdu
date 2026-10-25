import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Rocket, 
  Calendar, 
  User, 
  DollarSign, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Clock, 
  Tag, 
  ArrowUpRight,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const ProjectsView = () => {
  const { 
    currentOrg, 
    activeFolderId, 
    data, 
    updateProject, 
    deleteProject, 
    setModalConfig,
    searchQuery 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = data.projects.filter(p => {
    if (p.orgId !== currentOrg.id) return false;
    if (activeFolderId !== 'all' && p.folderId !== activeFolderId && p.folderId !== 'all') return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.leadName.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleMilestone = (project, milestoneId) => {
    const updatedMilestones = project.milestones.map(m => 
      m.id === milestoneId ? { ...m, done: !m.done } : m
    );
    const completedCount = updatedMilestones.filter(m => m.done).length;
    const newProgress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100) 
      : project.progress;

    const newStatus = newProgress === 100 ? 'Completado' : (newProgress > 0 ? 'En Curso' : 'Planificación');

    updateProject(project.id, {
      milestones: updatedMilestones,
      progress: newProgress,
      status: newStatus
    });
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Completado') return 'badge-scout';
    if (status === 'En Curso') return 'badge-warning';
    return 'badge-edu';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Filter Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-purple">
              <Rocket size={13} />
              Gestión de Proyectos
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredProjects.length} proyectos registrados
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem' }}>Proyectos, Tiempos y Metas</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Control de avances, cronogramas de entrega, hitos y responsables.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Status Filter Buttons */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem'
          }}>
            {['all', 'Planificación', 'En Curso', 'Completado'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: statusFilter === st ? 'var(--primary)' : 'transparent',
                  color: statusFilter === st ? '#fff' : 'var(--text-muted)'
                }}
              >
                {st === 'all' ? 'Todos' : st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setModalConfig({ isOpen: true, type: 'new_project' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Plus size={18} />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Rocket size={44} style={{ margin: '0 auto 1rem', color: 'var(--accent-purple)' }} />
          <h3>No hay proyectos en esta sección</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Comienza planificando un nuevo campamento, feria pedagógica o servicio comunitario.
          </p>
          <button
            onClick={() => setModalConfig({ isOpen: true, type: 'new_project' })}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700
            }}
          >
            + Registrar Proyecto
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProjects.map(proj => {
            return (
              <div
                key={proj.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)',
                  gap: '1.25rem'
                }}
              >
                {/* Card Top */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem'
                  }}>
                    <span className={`badge ${getStatusBadgeClass(proj.status)}`}>
                      {proj.status}
                    </span>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      title="Eliminar proyecto"
                      style={{ color: 'var(--text-muted)', padding: '2px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    {proj.title}
                  </h3>

                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45,
                    marginBottom: '1rem'
                  }}>
                    {proj.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {proj.tags?.map(t => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.74rem',
                          background: 'var(--bg-input)',
                          color: 'var(--text-muted)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>Avance general</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{proj.progress}%</span>
                    </div>
                    <div style={{ height: '7px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${proj.progress}%`,
                        background: proj.progress === 100 ? 'var(--primary)' : 'var(--accent-purple)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  {proj.milestones && proj.milestones.length > 0 && (
                    <div style={{
                      background: 'var(--bg-input)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem'
                      }}>
                        Hitos del Proyecto (Haz clic para marcar)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {proj.milestones.map(m => (
                          <div
                            key={m.id}
                            onClick={() => toggleMilestone(proj, m.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                              color: m.done ? 'var(--text-muted)' : 'var(--text-main)',
                              textDecoration: m.done ? 'line-through' : 'none'
                            }}
                          >
                            {m.done ? (
                              <CheckSquare size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                            ) : (
                              <Square size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            )}
                            <span>{m.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Meta */}
                <div style={{
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} />
                    <span>{proj.startDate} al {proj.endDate}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                    <User size={14} style={{ color: 'var(--primary)' }} />
                    <span style={{ color: 'var(--text-main)' }}>{proj.leadName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
