import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  MapPin, 
  UserCheck, 
  Package, 
  SunMedium, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Printer, 
  Tv, 
  Calendar, 
  Sparkles, 
  Trash2, 
  Edit3,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const DailyProgramView = () => {
  const { 
    currentOrg, 
    activeFolderId, 
    currentDailyProgram, 
    addDailyBlock, 
    updateDailyBlock, 
    deleteDailyBlock,
    updateProgramMeta,
    setModalConfig
  } = useApp();

  const [presentationMode, setPresentationMode] = useState(false);
  const [completedBlocks, setCompletedBlocks] = useState({});
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [metaForm, setMetaForm] = useState({
    theme: currentDailyProgram.theme,
    location: currentDailyProgram.location,
    responsible: currentDailyProgram.responsible,
    weatherAdvice: currentDailyProgram.weatherAdvice,
    date: currentDailyProgram.date
  });

  const toggleBlockCompleted = (id) => {
    setCompletedBlocks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveMeta = (e) => {
    e.preventDefault();
    updateProgramMeta(metaForm);
    setIsEditingMeta(false);
  };

  const blocks = currentDailyProgram.blocks || [];
  const totalCompleted = blocks.filter(b => completedBlocks[b.id]).length;
  const progressPercent = blocks.length > 0 ? Math.round((totalCompleted / blocks.length) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Mode Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-warning">
              <Clock size={13} />
              Cronograma Activo
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {currentDailyProgram.date}
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem' }}>Programa y Actividades del Día</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Secuencia horaria detallada para coordinar educadores, dirigentes y participantes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Presentation Mode Toggle */}
          <button
            onClick={() => setPresentationMode(!presentationMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 0.95rem',
              borderRadius: 'var(--radius-md)',
              background: presentationMode ? 'var(--primary)' : 'var(--bg-surface)',
              color: presentationMode ? '#fff' : 'var(--text-main)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
            title="Vista de alto contraste y letras grandes para proyectar o usar en el campo"
          >
            <Tv size={17} />
            <span>{presentationMode ? 'Modo Normal' : 'Modo Pizarra / Proyector'}</span>
          </button>

          {/* Print Schedule */}
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 0.95rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            <Printer size={16} />
            <span>Imprimir Hoja de Ruta</span>
          </button>

          {/* Add Activity Button */}
          <button
            onClick={() => setModalConfig({ isOpen: true, type: 'new_block' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Plus size={18} />
            <span>Agregar Bloque / Actividad</span>
          </button>
        </div>
      </div>

      {/* Program Summary Card */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)'
      }}>
        {!isEditingMeta ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Eje Temático del Día
                </span>
                <h2 style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>{currentDailyProgram.theme}</h2>
              </div>
              <button
                onClick={() => setIsEditingMeta(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)'
                }}
              >
                <Edit3 size={14} />
                <span>Editar Encabezado</span>
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={18} style={{ color: 'var(--accent-rose)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lugar de Encuentro</div>
                  <strong>{currentDailyProgram.location}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserCheck size={18} style={{ color: 'var(--accent-blue)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Responsables del Programa</div>
                  <strong>{currentDailyProgram.responsible}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <SunMedium size={18} style={{ color: 'var(--secondary)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aviso y Seguridad</div>
                  <span style={{ color: 'var(--text-main)' }}>{currentDailyProgram.weatherAdvice}</span>
                </div>
              </div>
            </div>

            {/* Progress bar of the day */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.4rem' }}>
                <span>Avance del Cronograma: <strong>{totalCompleted} de {blocks.length} actividades realizadas</strong></span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{progressPercent}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveMeta} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Modificar Datos Generales de la Jornada</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Eje / Tema Principal:</label>
                <input 
                  type="text" 
                  value={metaForm.theme}
                  onChange={(e) => setMetaForm({ ...metaForm, theme: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Ubicación / Predio:</label>
                <input 
                  type="text" 
                  value={metaForm.location}
                  onChange={(e) => setMetaForm({ ...metaForm, location: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Responsables:</label>
                <input 
                  type="text" 
                  value={metaForm.responsible}
                  onChange={(e) => setMetaForm({ ...metaForm, responsible: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Aviso meteorológico / Seguridad:</label>
                <input 
                  type="text" 
                  value={metaForm.weatherAdvice}
                  onChange={(e) => setMetaForm({ ...metaForm, weatherAdvice: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setIsEditingMeta(false)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ padding: '0.45rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: '#fff', fontWeight: 600 }}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Timeline Blocks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {blocks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Clock size={40} style={{ margin: '0 auto 1rem', color: 'var(--secondary)' }} />
            <h3>No hay bloques cargados para esta fecha</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Haz clic en "Agregar Bloque / Actividad" para comenzar a diagramar el cronograma del día.
            </p>
            <button
              onClick={() => setModalConfig({ isOpen: true, type: 'new_block' })}
              style={{
                padding: '0.6rem 1.2rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600
              }}
            >
              + Crear Primer Bloque
            </button>
          </div>
        ) : (
          blocks.map((block, index) => {
            const isDone = !!completedBlocks[block.id];
            return (
              <div
                key={block.id}
                className="glass-panel"
                style={{
                  padding: presentationMode ? '1.75rem' : '1.25rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  borderLeft: `5px solid ${isDone ? 'var(--primary)' : 'var(--secondary)'}`,
                  background: isDone ? 'var(--bg-input)' : 'var(--bg-card)',
                  opacity: isDone ? 0.85 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Completed Checkbox */}
                <button
                  onClick={() => toggleBlockCompleted(block.id)}
                  title={isDone ? "Marcar como pendiente" : "Marcar como realizada"}
                  style={{
                    color: isDone ? 'var(--primary)' : 'var(--text-muted)',
                    marginTop: '2px',
                    flexShrink: 0
                  }}
                >
                  {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                {/* Block Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.4rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{
                        fontWeight: 800,
                        fontSize: presentationMode ? '1.2rem' : '0.95rem',
                        background: 'var(--primary-light)',
                        color: 'var(--primary-text)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {block.time}
                      </span>
                      <h3 style={{
                        fontSize: presentationMode ? '1.4rem' : '1.15rem',
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--text-muted)' : 'var(--text-main)'
                      }}>
                        {block.title}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.8rem',
                        background: 'var(--bg-input)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-muted)'
                      }}>
                        Bloque #{index + 1}
                      </span>
                      <button
                        onClick={() => deleteDailyBlock(block.id)}
                        title="Eliminar este bloque"
                        style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Objective */}
                  <div style={{
                    fontSize: presentationMode ? '1.05rem' : '0.9rem',
                    color: 'var(--text-main)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.45
                  }}>
                    <strong>Objetivo:</strong> {block.objective}
                  </div>

                  {/* Metadata Tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    fontSize: presentationMode ? '0.95rem' : '0.82rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-input)',
                    padding: '0.65rem 0.9rem',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserCheck size={15} style={{ color: 'var(--primary)' }} />
                      <span><strong>Responsable:</strong> {block.responsible}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Package size={15} style={{ color: 'var(--secondary)' }} />
                      <span><strong>Materiales:</strong> {block.materials}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} style={{ color: 'var(--accent-rose)' }} />
                      <span><strong>Rincón / Aula:</strong> {block.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
