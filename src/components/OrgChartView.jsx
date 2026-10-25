import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Network, 
  UserPlus, 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  Phone, 
  Award, 
  Trash2, 
  Edit, 
  User, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const OrgChartView = () => {
  const { 
    currentOrg, 
    data, 
    deleteOrgNode, 
    setModalConfig,
    searchQuery 
  } = useApp();

  const [collapsedNodes, setCollapsedNodes] = useState({});
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filter nodes for the current organization
  const nodes = data.organigram.filter(n => n.orgId === currentOrg.id);

  // Toggle collapse/expand of children
  const toggleCollapse = (nodeId) => {
    setCollapsedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Find root nodes (no parentId or parent not found)
  const rootNodes = nodes.filter(n => !n.parentId || !nodes.some(p => p.id === n.parentId));

  // Get children of a node
  const getChildren = (parentId) => {
    return nodes.filter(n => n.parentId === parentId);
  };

  // Recursive component to render tree nodes
  const renderTreeNode = (node) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;
    const isCollapsed = !!collapsedNodes[node.id];

    const isMatch = searchQuery 
      ? (node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         node.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
         node.department.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return (
      <div 
        key={node.id} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          margin: '0.75rem 1rem'
        }}
      >
        {/* Node Card */}
        <div
          className="glass-panel"
          style={{
            width: '240px',
            padding: '1rem',
            background: isMatch ? 'var(--bg-card)' : 'var(--bg-input)',
            opacity: isMatch ? 1 : 0.4,
            borderRadius: 'var(--radius-lg)',
            border: selectedPerson?.id === node.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2,
            transition: 'all 0.2s ease',
            textAlign: 'center'
          }}
          onClick={() => setSelectedPerson(node)}
        >
          {/* Avatar with status border */}
          <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 0.6rem' }}>
            <img 
              src={node.avatar} 
              alt={node.name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-full)',
                objectFit: 'cover',
                border: '2px solid var(--primary)'
              }}
              onError={(e) => {
                e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + node.name;
              }}
            />
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollapse(node.id);
                }}
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  border: '2px solid var(--bg-card)'
                }}
                title={isCollapsed ? "Expandir equipo" : "Colapsar equipo"}
              >
                {isCollapsed ? '+' : '−'}
              </button>
            )}
          </div>

          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '0.15rem', color: 'var(--text-main)' }}>
            {node.name}
          </h4>

          <div style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '0.4rem',
            lineHeight: 1.2
          }}>
            {node.role}
          </div>

          <span style={{
            display: 'inline-block',
            fontSize: '0.7rem',
            background: 'var(--bg-input)',
            color: 'var(--text-muted)',
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600
          }}>
            {node.department}
          </span>

          {node.badge && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              marginTop: '0.5rem',
              fontSize: '0.72rem',
              color: 'var(--secondary)',
              fontWeight: 700
            }}>
              <Award size={13} />
              <span>{node.badge}</span>
            </div>
          )}
        </div>

        {/* Children connector lines and recursive render */}
        {hasChildren && !isCollapsed && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            marginTop: '1.25rem',
            width: '100%'
          }}>
            {/* Vertical connector from parent card */}
            <div style={{
              width: '2px',
              height: '20px',
              background: 'var(--border-color)',
              position: 'absolute',
              top: '-20px'
            }} />

            {/* Horizontal branch bar spanning children */}
            {children.length > 1 && (
              <div style={{
                height: '2px',
                background: 'var(--border-color)',
                width: 'calc(100% - 150px)',
                position: 'relative'
              }} />
            )}

            {/* Children container */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              width: '100%'
            }}>
              {children.map(child => renderTreeNode(child))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header and Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-scout">
              <Network size={13} />
              Estructura Viva
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {nodes.length} integrantes en el equipo
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem' }}>Organigrama Dinámico e Interactivo</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Visualiza las responsabilidades y relaciones del Consejo, Educadores y Patrullas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Zoom controls */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.2rem'
          }}>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              style={{ padding: '0.35rem 0.55rem', color: 'var(--text-main)' }}
              title="Reducir zoom"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.35rem 0.5rem' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              style={{ padding: '0.35rem 0.55rem', color: 'var(--text-main)' }}
              title="Aumentar zoom"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              style={{ padding: '0.35rem 0.55rem', color: 'var(--text-muted)' }}
              title="Restablecer zoom"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          <button
            onClick={() => setModalConfig({ isOpen: true, type: 'new_member' })}
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
            <UserPlus size={18} />
            <span>Incorporar Integrante</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas & Detail Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedPerson ? '1fr 320px' : '1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* Interactive Organigram Canvas */}
        <div 
          className="glass-panel" 
          style={{
            minHeight: '340px',
            maxHeight: 'calc(100vh - 210px)',
            padding: '1.5rem 1rem',
            background: 'var(--bg-app)',
            borderRadius: 'var(--radius-lg)',
            overflowX: 'auto',
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            border: '1px solid var(--border-color)',
            position: 'relative'
          }}
        >
          <div style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}>
            {rootNodes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <Network size={44} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                <h3>No hay integrantes en este organigrama</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Comienza agregando al líder principal o directivo del espacio.
                </p>
                <button
                  onClick={() => setModalConfig({ isOpen: true, type: 'new_member' })}
                  style={{
                    padding: '0.55rem 1.2rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700
                  }}
                >
                  + Agregar Primer Líder
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                {rootNodes.map(rootNode => renderTreeNode(rootNode))}
              </div>
            )}
          </div>
        </div>

        {/* Person Inspector Panel */}
        {selectedPerson && (
          <div className="glass-panel" style={{
            padding: '1.5rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="badge badge-scout">Ficha del Integrante</span>
              <button
                onClick={() => setSelectedPerson(null)}
                style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 700 }}
              >
                ×
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src={selectedPerson.avatar}
                alt={selectedPerson.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-full)',
                  margin: '0 auto 0.75rem',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)'
                }}
              />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                {selectedPerson.name}
              </h3>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                {selectedPerson.role}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {selectedPerson.department}
              </div>
            </div>

            {/* Badges / Awards */}
            {selectedPerson.badge && (
              <div style={{
                background: 'var(--secondary-light)',
                color: 'var(--secondary)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                <Award size={18} />
                <span>Distinción: {selectedPerson.badge}</span>
              </div>
            )}

            {/* Bio */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Perfil & Trayectoria
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                {selectedPerson.bio || 'Sin descripción adicional registrada.'}
              </p>
            </div>

            {/* Contact Information */}
            <div style={{
              background: 'var(--bg-input)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} style={{ color: 'var(--accent-blue)' }} />
                <a href={`mailto:${selectedPerson.email}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                  {selectedPerson.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} style={{ color: 'var(--primary)' }} />
                <span>{selectedPerson.phone}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setModalConfig({
                  isOpen: true,
                  type: 'new_member',
                  payload: { defaultParentId: selectedPerson.id }
                })}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-text)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}
              >
                + Añadir Bajo su Cargo
              </button>

              <button
                onClick={() => {
                  if (confirm(`¿Eliminar a ${selectedPerson.name} del organigrama?`)) {
                    deleteOrgNode(selectedPerson.id);
                    setSelectedPerson(null);
                  }
                }}
                style={{
                  padding: '0.6rem 0.85rem',
                  background: 'var(--accent-rose-light)',
                  color: 'var(--accent-rose)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}
                title="Eliminar este integrante"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
