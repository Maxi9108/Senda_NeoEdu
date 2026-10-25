import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart2, 
  Plus, 
  CheckCircle, 
  Users, 
  Lock, 
  Trash2, 
  Vote, 
  Sparkles,
  HelpCircle,
  FileQuestion
} from 'lucide-react';

export const PollsView = () => {
  const { 
    currentOrg, 
    data, 
    currentUserRole, 
    canEdit, 
    isAdmin, 
    isAdult,
    votePoll, 
    addPoll, 
    deletePoll 
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPollForm, setNewPollForm] = useState({
    title: '',
    description: '',
    audience: 'all', // 'all' | 'adults_only'
    option1: '',
    option2: '',
    option3: ''
  });

  const orgPolls = (data.polls || []).filter(p => p.orgId === currentOrg.id);

  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (!newPollForm.title.trim() || !newPollForm.option1.trim() || !newPollForm.option2.trim()) return;

    const options = [
      { id: `opt-${Date.now()}-1`, text: newPollForm.option1.trim(), votes: 0 },
      { id: `opt-${Date.now()}-2`, text: newPollForm.option2.trim(), votes: 0 }
    ];
    if (newPollForm.option3.trim()) {
      options.push({ id: `opt-${Date.now()}-3`, text: newPollForm.option3.trim(), votes: 0 });
    }

    addPoll({
      title: newPollForm.title.trim(),
      description: newPollForm.description.trim(),
      audience: newPollForm.audience,
      author: currentUserRole === 'admin' ? 'Jefatura de Grupo' : 'Educador / Docente',
      options
    });

    setNewPollForm({ title: '', description: '', audience: 'all', option1: '', option2: '', option3: '' });
    setShowCreateModal(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        borderLeft: '6px solid var(--accent-blue)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-edu">
              <BarChart2 size={14} />
              Democracia y Participación
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {orgPolls.length} consultas institucionales
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>Encuestas y Votaciones</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Participa en decisiones institucionales, elecciones de lemas, fechas de acampe y consultas de la comunidad.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowCreateModal(true)}
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
            <span>Crear Encuesta</span>
          </button>
        )}
      </div>

      {/* Create Poll Modal */}
      {showCreateModal && (
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
          <form onSubmit={handleCreatePoll} className="glass-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '540px',
            width: '100%',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h3 style={{ fontSize: '1.25rem' }}>Crear Nueva Consulta / Encuesta</h3>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Pregunta o Título *</label>
              <input
                type="text"
                required
                placeholder="Ej. ¿Qué fecha prefieren para el Campamento de Familias?"
                value={newPollForm.title}
                onChange={e => setNewPollForm({ ...newPollForm, title: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Descripción / Contexto</label>
              <textarea
                rows={2}
                placeholder="Explica el objetivo de la votación..."
                value={newPollForm.description}
                onChange={e => setNewPollForm({ ...newPollForm, description: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Destinatarios / Audiencia *</label>
              <select
                value={newPollForm.audience}
                onChange={e => setNewPollForm({ ...newPollForm, audience: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
              >
                <option value="all">👥 Para Toda la Institución (Familias, Alumnos, Scouts y Docentes)</option>
                <option value="adults_only">🔒 Solo para Miembros Adultos (Familias, Educadores y Directivos)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Opciones de Respuesta *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.3rem' }}>
                <input
                  type="text"
                  required
                  placeholder="Opción 1 *"
                  value={newPollForm.option1}
                  onChange={e => setNewPollForm({ ...newPollForm, option1: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
                <input
                  type="text"
                  required
                  placeholder="Opción 2 *"
                  value={newPollForm.option2}
                  onChange={e => setNewPollForm({ ...newPollForm, option2: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
                <input
                  type="text"
                  placeholder="Opción 3 (Opcional)"
                  value={newPollForm.option3}
                  onChange={e => setNewPollForm({ ...newPollForm, option3: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '0.5rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ padding: '0.5rem 1.15rem', background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 700 }}
              >
                Lanzar Encuesta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Polls Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {orgPolls.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileQuestion size={44} style={{ margin: '0 auto 0.75rem', color: 'var(--accent-blue)' }} />
            <h3>No hay encuestas activas en este momento</h3>
          </div>
        ) : (
          orgPolls.map(poll => {
            const isAdultOnly = poll.audience === 'adults_only';
            const canVote = !isAdultOnly || isAdult;
            const userVoteOptionId = poll.userVotes ? poll.userVotes[currentUserRole] : null;

            const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);

            return (
              <div
                key={poll.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      {isAdultOnly ? (
                        <span className="badge badge-warning" style={{ fontSize: '0.74rem' }}>
                          <Lock size={12} />
                          Solo Miembros Adultos (Familias y Educadores)
                        </span>
                      ) : (
                        <span className="badge badge-edu" style={{ fontSize: '0.74rem' }}>
                          <Users size={12} />
                          Toda la Comunidad (Jóvenes y Adultos)
                        </span>
                      )}
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Creada por {poll.author}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{poll.title}</h3>
                    {poll.description && (
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {poll.description}
                      </p>
                    )}
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => deletePoll(poll.id)}
                      title="Eliminar encuesta"
                      style={{ color: 'var(--text-muted)', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Restricted alert for students if adult poll */}
                {!canVote && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    fontSize: '0.84rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Lock size={16} style={{ color: 'var(--secondary)' }} />
                    <span>Esta consulta está reservada únicamente para votación de adultos responsables.</span>
                  </div>
                )}

                {/* Options and Live Progress Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {poll.options.map(opt => {
                    const isSelected = userVoteOptionId === opt.id;
                    const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => canVote && votePoll(poll.id, opt.id)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          background: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                          border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                          cursor: canVote ? 'pointer' : 'default',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: 'var(--radius-full)',
                              border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`,
                              background: isSelected ? 'var(--primary)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '0.65rem'
                            }}>
                              {isSelected && '✓'}
                            </div>
                            <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.9rem', color: isSelected ? 'var(--primary-text)' : 'var(--text-main)' }}>
                              {opt.text}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            <span>{opt.votes} votos</span>
                            <span style={{ color: 'var(--primary)' }}>({percent}%)</span>
                          </div>
                        </div>

                        {/* Visual background fill bar */}
                        <div style={{
                          height: '6px',
                          background: 'rgba(0,0,0,0.06)',
                          borderRadius: 'var(--radius-full)',
                          overflow: 'hidden',
                          position: 'relative',
                          zIndex: 2
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${percent}%`,
                            background: isSelected ? 'var(--primary)' : 'var(--accent-blue)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <span>Total de votos registrados: <strong>{totalVotes}</strong></span>
                  {userVoteOptionId && (
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      ✓ Has participado de esta votación
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
