import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MapPin, 
  Clock, 
  Trash2, 
  Tag, 
  Globe, 
  Lock, 
  Eye, 
  List, 
  Grid,
  Info,
  CalendarDays,
  Sparkles,
  Tent,
  CheckSquare,
  Square,
  Bus,
  Compass,
  CheckCircle2,
  Users
} from 'lucide-react';

export const CalendarView = () => {
  const { 
    currentOrg, 
    activeFolderId, 
    activeFolder,
    setActiveFolderId,
    data, 
    deleteEvent, 
    setModalConfig,
    searchQuery,
    canEdit,
    currentUserRole,
    calendarBranchFilters,
    setCalendarBranchFilters,
    togglePackingItem
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 24)); // October 2026
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [activeCampModal, setActiveCampModal] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeekShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Toggle branch filter checkbox (tilde de rama)
  const toggleBranchFilter = (branchId) => {
    setCalendarBranchFilters(prev => ({
      ...prev,
      [branchId]: !prev[branchId]
    }));
  };

  // Select all or none
  const setAllBranches = (state) => {
    const updated = {};
    currentOrg.folders?.forEach(f => {
      updated[f.id] = state;
    });
    setCalendarBranchFilters(updated);
  };

  // FILTERING LOGIC WITH MULTI-COLOR BRANCH TILDE SELECTION:
  const filteredEvents = data.calendarEvents.filter(ev => {
    if (ev.orgId !== currentOrg.id) return false;

    // Check if branch is enabled by tilde checkbox
    const eventFolderId = ev.folderId || 'all';
    const isBranchEnabled = calendarBranchFilters[eventFolderId] !== false;
    
    // Also check if user is inside a specific subfolder tab
    if (activeFolderId !== 'all') {
      const isSpecificToThisFolder = ev.folderId === activeFolderId;
      const isGeneral = ev.isGroupWide === true || ev.folderId === 'all';
      if (!isSpecificToThisFolder && !isGeneral) return false;
    }

    if (!isBranchEnabled && activeFolderId === 'all') {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) || 
        ev.type.toLowerCase().includes(q) || 
        (ev.location && ev.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate calendar grid metrics
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date(2026, 9, 24));

  const getEventsForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.date === dateStr);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'var(--bg-surface)',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            {activeFolderId !== 'all' && activeFolder ? (
              <span className="badge" style={{ background: `${activeFolder.color}25`, color: activeFolder.color, fontWeight: 800 }}>
                <CalendarDays size={14} />
                Calendario Específico de Rama: {activeFolder.name}
              </span>
            ) : (
              <span className="badge badge-scout">
                <CalendarDays size={14} />
                Calendario General del Grupo
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredEvents.length} actividades programadas
            </span>
            {activeFolderId !== 'all' && (
              <button
                onClick={() => setActiveFolderId('all')}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  background: 'var(--bg-input)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)'
                }}
              >
                Ver Todo el Calendario Grupal
              </button>
            )}
            {!canEdit && (
              <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                <Eye size={12} />
                Solo Consulta (Lectura)
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>
            {activeFolderId !== 'all' && activeFolder 
              ? `Cronograma de Actividades - ${activeFolder.name}` 
              : 'Calendario y Cronogramas de Salidas'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {activeFolderId !== 'all' && activeFolder
              ? `Espacio y calendario exclusivo de ${activeFolder.name} integrado con los eventos generales de la institución.`
              : 'Identifica eventos por el color de cada rama, filtra con tildes y consulta la logística de campamentos.'}
          </p>
        </div>

        {/* View Toggle & Actions */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '0.2rem',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <Grid size={15} />
              <span>Mes</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <List size={15} />
              <span>Lista / Agenda</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.2rem'
          }}>
            <button onClick={prevMonth} style={{ padding: '0.4rem 0.6rem', color: 'var(--text-main)' }} title="Mes Anterior">
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontWeight: 700, padding: '0 0.8rem', minWidth: '140px', textAlign: 'center', fontSize: '0.92rem' }}>
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} style={{ padding: '0.4rem 0.6rem', color: 'var(--text-main)' }} title="Mes Siguiente">
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={goToday}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Hoy
          </button>

          {canEdit && (
            <button
              onClick={() => setModalConfig({ isOpen: true, type: 'new_event' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.88rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Plus size={18} />
              <span>Nuevo Evento</span>
            </button>
          )}
        </div>
      </div>

      {/* BRANCH CHECKBOX FILTERS (Tildes por rama para ver u ocultar) */}
      <div className="glass-panel" style={{
        padding: '0.85rem 1.25rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Filtro de Ramas (Marca con tilde qué eventos ver):
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
          {currentOrg.folders?.map(folder => {
            const isChecked = calendarBranchFilters[folder.id] !== false;
            const branchColor = folder.color || currentOrg.color;

            return (
              <label
                key={folder.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: isChecked ? `${branchColor}18` : 'var(--bg-input)',
                  border: `1.5px solid ${isChecked ? branchColor : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: isChecked ? branchColor : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleBranchFilter(folder.id)}
                  style={{ accentColor: branchColor }}
                />
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: 'var(--radius-full)',
                  background: branchColor
                }} />
                <span>{folder.name.replace(/[^\w\s\u00C0-\u017F]/gi, '').trim()}</span>
              </label>
            );
          })}

          <button
            onClick={() => setAllBranches(true)}
            style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginLeft: '0.5rem' }}
          >
            Todas
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedDayEvents ? 'minmax(0, 1fr) 350px' : '1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}>
          {/* Calendar Grid Table */}
          <div className="glass-panel" style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            {/* Days of week header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-input)',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--border-color)'
            }}>
              {daysOfWeekShort.map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Days cells */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: '1px',
              background: 'var(--border-color)'
            }}>
              {/* Previous Month trailing days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => {
                const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
                return (
                  <div
                    key={`prev-${i}`}
                    style={{
                      minHeight: '110px',
                      padding: '0.5rem',
                      background: 'var(--bg-app)',
                      opacity: 0.35,
                      fontSize: '0.8rem'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{dayNum}</span>
                  </div>
                );
              })}

              {/* Current Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayEvents = getEventsForDate(dayNum);
                const isToday = dayNum === 24 && month === 9 && year === 2026;
                const isSelected = selectedDayEvents?.dateStr === dateStr;

                return (
                  <div
                    key={`cur-${dayNum}`}
                    onClick={() => setSelectedDayEvents({ dateStr, dayNum, events: dayEvents })}
                    style={{
                      minHeight: '110px',
                      padding: '0.55rem',
                      background: isSelected ? 'var(--primary-light)' : (isToday ? 'var(--bg-input)' : 'var(--bg-surface)'),
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      transition: 'background 0.15s ease',
                      border: isSelected ? '2px solid var(--primary)' : 'none'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.82rem'
                    }}>
                      <span style={{
                        fontWeight: isToday ? 800 : 600,
                        width: '26px',
                        height: '26px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isToday ? 'var(--primary)' : 'transparent',
                        color: isToday ? '#fff' : 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}>
                        {dayNum}
                      </span>
                      {dayEvents.length > 0 && (
                        <span style={{
                          fontSize: '0.7rem',
                          background: 'var(--primary-light)',
                          color: 'var(--primary-text)',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700
                        }}>
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Events Mini-Chips with specific branch colors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden' }}>
                      {dayEvents.slice(0, 3).map(ev => {
                        const isCamp = !!ev.campLogistics;
                        const eventColor = ev.badgeColor || '#15803d';

                        return (
                          <div
                            key={ev.id}
                            title={`${ev.title} (${ev.startTime} - ${ev.endTime})`}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 5px',
                              borderRadius: '4px',
                              background: eventColor,
                              color: '#fff',
                              fontWeight: 600,
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                          >
                            {isCamp ? <Tent size={11} style={{ flexShrink: 0 }} /> : (ev.isGroupWide && <Globe size={10} style={{ flexShrink: 0 }} />)}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {ev.title}
                            </span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                          +{dayEvents.length - 3} más...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Drawer & Interactive Checklist */}
          {selectedDayEvents && (
            <div className="glass-panel" style={{
              padding: '1.25rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '750px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>
                    {selectedDayEvents.dayNum} de {monthNames[month]}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {selectedDayEvents.events.length} actividades programadas
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDayEvents(null)}
                  style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.2rem' }}
                >
                  ×
                </button>
              </div>

              {selectedDayEvents.events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '0.88rem', marginBottom: '0.75rem' }}>No hay eventos para esta fecha.</p>
                  {canEdit && (
                    <button
                      onClick={() => setModalConfig({
                        isOpen: true,
                        type: 'new_event',
                        payload: { defaultDate: selectedDayEvents.dateStr }
                      })}
                      style={{
                        padding: '0.45rem 0.85rem',
                        background: 'var(--primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      + Programar en este día
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedDayEvents.events.map(ev => {
                    const isCamp = !!ev.campLogistics;
                    const eventColor = ev.badgeColor || '#15803d';
                    const materials = ev.requiredMaterials || [];
                    const packedCount = materials.filter(m => m.checked).length;

                    return (
                      <div
                        key={ev.id}
                        style={{
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-input)',
                          borderLeft: `5px solid ${eventColor}`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                              <span style={{
                                fontSize: '0.7rem',
                                background: `${eventColor}25`,
                                color: eventColor,
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 700
                              }}>
                                {ev.branchName || 'General'}
                              </span>
                              {isCamp && (
                                <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                                  <Tent size={11} />
                                  Logística de Campamento
                                </span>
                              )}
                            </div>
                            <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{ev.title}</h4>
                          </div>

                          {canEdit && (
                            <button
                              onClick={() => deleteEvent(ev.id)}
                              title="Eliminar evento"
                              style={{ color: 'var(--text-muted)', padding: '2px' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Clock size={13} />
                          <span>{ev.startTime} a {ev.endTime} hs</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <MapPin size={13} />
                          <span>{ev.location}</span>
                        </div>

                        {/* CAMP LOGISTICS BUTTON & PREVIEW */}
                        {isCamp && (
                          <div style={{
                            background: 'var(--bg-surface)',
                            padding: '0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem'
                          }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)' }}>
                              🏕️ Itinerario y Desconcentración de Campamento
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.35 }}>
                              <strong>Encuentro:</strong> {ev.campLogistics.meetingPoint}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.35 }}>
                              <strong>Viaje Ida:</strong> {ev.campLogistics.outboundTrip}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.35 }}>
                              <strong>Regreso:</strong> {ev.campLogistics.returnTrip}
                            </div>
                            <div style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: 'var(--primary)',
                              lineHeight: 1.35,
                              background: 'var(--primary-light)',
                              padding: '0.4rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              🏁 Llegada y Desconcentración: {ev.campLogistics.arrivalAndDismissal}
                            </div>
                          </div>
                        )}

                        {/* MATERIALS CHECKLIST (TACHAR LO QUE YA TIENEN) */}
                        {materials.length > 0 && (
                          <div style={{
                            background: 'var(--bg-surface)',
                            padding: '0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                🎒 Mochila y Materiales (Tacha lo que tengas listo):
                              </span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>
                                {packedCount} de {materials.length} listos
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {materials.map(item => (
                                <div
                                  key={item.id}
                                  onClick={() => togglePackingItem(ev.id, item.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    color: item.checked ? 'var(--text-muted)' : 'var(--text-main)',
                                    textDecoration: item.checked ? 'line-through' : 'none'
                                  }}
                                >
                                  {item.checked ? (
                                    <CheckSquare size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                  ) : (
                                    <Square size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                  )}
                                  <span>{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main List / Agenda View */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredEvents.map(ev => {
            const isCamp = !!ev.campLogistics;
            const eventColor = ev.badgeColor || '#15803d';
            const materials = ev.requiredMaterials || [];
            const packedCount = materials.filter(m => m.checked).length;

            return (
              <div
                key={ev.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  borderLeft: `6px solid ${eventColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge" style={{ background: `${eventColor}25`, color: eventColor, fontWeight: 700 }}>
                        {ev.branchName || 'General'}
                      </span>
                      <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                        {ev.type}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                        📅 {ev.date} ({ev.startTime} a {ev.endTime} hs)
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{ev.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      <MapPin size={14} />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        background: 'var(--bg-input)',
                        color: 'var(--accent-rose)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                {ev.notes && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                    {ev.notes}
                  </p>
                )}

                {/* Camp Logistics in List View */}
                {isCamp && (
                  <div style={{
                    background: 'var(--bg-input)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '0.75rem',
                    fontSize: '0.82rem'
                  }}>
                    <div>
                      <strong>📍 Punto de Encuentro:</strong> {ev.campLogistics.meetingPoint}
                    </div>
                    <div>
                      <strong>🚌 Viaje de Ida:</strong> {ev.campLogistics.outboundTrip}
                    </div>
                    <div>
                      <strong>🏕️ Predio de Acampe:</strong> {ev.campLogistics.campsite}
                    </div>
                    <div>
                      <strong>🔄 Viaje de Retorno:</strong> {ev.campLogistics.returnTrip}
                    </div>
                    <div style={{ gridColumn: '1 / -1', background: 'var(--primary-light)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary-text)', fontWeight: 700 }}>
                      🏁 Llegada & Desconcentración: {ev.campLogistics.arrivalAndDismissal}
                    </div>
                  </div>
                )}

                {/* Checkable Materials in List View */}
                {materials.length > 0 && (
                  <div style={{
                    background: 'var(--bg-input)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                        🎒 Materiales y Equipo que deben llevar (Haz clic para tachar):
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {packedCount} de {materials.length} listos
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: '0.4rem'
                    }}>
                      {materials.map(item => (
                        <div
                          key={item.id}
                          onClick={() => togglePackingItem(ev.id, item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            color: item.checked ? 'var(--text-muted)' : 'var(--text-main)',
                            textDecoration: item.checked ? 'line-through' : 'none'
                          }}
                        >
                          {item.checked ? (
                            <CheckSquare size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          ) : (
                            <Square size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          )}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
