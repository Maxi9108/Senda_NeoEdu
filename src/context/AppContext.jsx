import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../mockData';
import { syncToGoogleDrive, loadFromGoogleDrive } from '../lib/driveSync';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('senda_neoedu_data_v6');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved data', e);
    }
    return initialData;
  });

  // Google Drive & Sheets 24/7 Cloud Sync State
  const [driveSyncState, setDriveSyncState] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [lastDriveSync, setLastDriveSync] = useState(() => localStorage.getItem('senda_last_drive_sync') || null);

  const [activeOrgId, setActiveOrgId] = useState(() => {
    return initialData.organizations[0]?.id || '';
  });

  const [activeFolderId, setActiveFolderId] = useState('all');
  const [currentTab, setCurrentTab] = useState('folders'); // 'folders', 'inter_org', 'community', 'news', 'calendar', 'daily', 'projects', 'organigram', 'polls', 'admin_members', 'superadmin'
  
  // User Profile / Active Role Simulation
  // 'superadmin' (Maximiliano Sánchez - maxi0802@gmai.com), 'advanced_admin' (Administrador Avanzado), 'admin' (Jefe de Grupo / Directivo), 'educator' (Docente), 'parent' (Familia), 'student' (Protagonista)
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    return localStorage.getItem('senda_user_role') || 'superadmin';
  });

  // Login session state (for sharing and access gate)
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Calendar Branch Tilde Filters
  const [calendarBranchFilters, setCalendarBranchFilters] = useState(() => {
    const initialChecked = {};
    initialData.organizations[0]?.folders?.forEach(f => {
      initialChecked[f.id] = true;
    });
    return initialChecked;
  });

  // Accessibility & Visual settings
  const [theme, setTheme] = useState(() => localStorage.getItem('senda_theme') || 'forest');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('senda_font_size') || 'normal');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, payload: null });
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [orgCustomizationModalOpen, setOrgCustomizationModalOpen] = useState(false);
  const [privateAccessModal, setPrivateAccessModal] = useState({ isOpen: false, folderName: '' });

  // Load from Google Sheets on startup if available
  useEffect(() => {
    async function checkCloudData() {
      try {
        setDriveSyncState('syncing');
        const cloudData = await loadFromGoogleDrive();
        if (cloudData && cloudData.organizations && cloudData.organizations.length > 0) {
          setData(cloudData);
          setDriveSyncState('synced');
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastDriveSync(nowStr);
          localStorage.setItem('senda_last_drive_sync', nowStr);
        } else {
          setDriveSyncState('idle');
        }
      } catch (err) {
        console.error('Error fetching initial cloud data:', err);
        setDriveSyncState('idle');
      }
    }
    checkCloudData();
  }, []);

  // Method to manually or automatically sync with Google Drive / Google Sheets
  const syncWithDriveNow = async () => {
    setDriveSyncState('syncing');
    const result = await syncToGoogleDrive(data);
    if (result.success) {
      setDriveSyncState('synced');
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastDriveSync(nowStr);
      localStorage.setItem('senda_last_drive_sync', nowStr);
      setTimeout(() => setDriveSyncState('idle'), 4000);
      return true;
    } else {
      setDriveSyncState('error');
      setTimeout(() => setDriveSyncState('idle'), 5000);
      return false;
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('senda_neoedu_data_v6', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('senda_user_role', currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('senda_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('senda_font_size', fontSize);
  }, [fontSize]);

  // Current Organization & Folder
  const currentOrg = data.organizations.find(o => o.id === activeOrgId) || data.organizations[0];
  const activeFolder = currentOrg?.folders?.find(f => f.id === activeFolderId);

  // Dynamic Institution Theme Injection (Custom Color per Institution)
  useEffect(() => {
    if (currentOrg?.color) {
      document.documentElement.style.setProperty('--primary', currentOrg.color);
      document.documentElement.style.setProperty('--border-focus', currentOrg.color);
    }
  }, [currentOrg?.color, activeOrgId]);

  // Role Permissions
  const isSuperAdmin = currentUserRole === 'superadmin';
  const isAdvancedAdmin = currentUserRole === 'advanced_admin';
  const hasSuperOrAdvancedAccess = isSuperAdmin || isAdvancedAdmin;
  const isAdmin = currentUserRole === 'admin' || isAdvancedAdmin || isSuperAdmin;
  const canEdit = currentUserRole === 'admin' || currentUserRole === 'educator' || isAdvancedAdmin || isSuperAdmin;
  const isAdult = currentUserRole === 'admin' || currentUserRole === 'educator' || currentUserRole === 'parent' || isAdvancedAdmin || isSuperAdmin;

  // Rule: Only Super Administrator Maximiliano Sánchez can appoint or revoke Advanced Admins
  const canManageAdvancedAdmins = isSuperAdmin;

  const canAccessFolder = (folder) => {
    if (!folder) return true;
    if (!folder.isPrivateAdultOnly) return true;
    return currentUserRole === 'admin' || currentUserRole === 'educator' || isAdvancedAdmin || isSuperAdmin;
  };

  // Dedicated check for the Subgroup's Private Adult Section (Drive, documents, links)
  // Visible to adult members of that branch AND ALWAYS visible to institution authorities/responsibles
  const canAccessSubgroupPrivateAdults = (folder) => {
    if (isSuperAdmin || isAdvancedAdmin || isAdmin) return true; // Responsables o autoridades de la institución siempre tienen acceso
    if (currentUserRole === 'educator') return true; // Educadores del subgrupo
    if (currentUserRole === 'student') return false; // Protagonistas / alumnos no tienen acceso
    return isAdult;
  };

  const selectFolder = (folderId) => {
    if (folderId === 'all') {
      setActiveFolderId('all');
      return;
    }
    const targetFolder = currentOrg?.folders?.find(f => f.id === folderId);
    if (targetFolder && targetFolder.isPrivateAdultOnly && !canAccessFolder(targetFolder)) {
      setPrivateAccessModal({ isOpen: true, folderName: targetFolder.name });
      return;
    }
    setActiveFolderId(folderId);
  };

  const selectOrg = (orgId) => {
    setActiveOrgId(orgId);
    setActiveFolderId('all');
  };

  // SUPER ADMINISTRATOR POWERS (Maximiliano Sánchez - maxi0802@gmai.com)
  const requestInstitutionCreation = (formData) => {
    const newReq = {
      ...formData,
      id: `req-inst-${Date.now()}`,
      dateRequested: new Date().toISOString().slice(0, 10),
      status: 'pending_approval'
    };
    setData(prev => ({
      ...prev,
      pendingInstitutions: [newReq, ...(prev.pendingInstitutions || [])]
    }));
    return { success: true };
  };

  const approveInstitutionBySuperAdmin = (reqId) => {
    const req = (data.pendingInstitutions || []).find(r => r.id === reqId);
    if (!req) return;

    const newOrg = {
      id: `org-${Date.now()}`,
      name: req.name,
      type: req.type || 'scout',
      badge: req.badge || 'Nueva Institución Aprobada',
      description: req.description,
      color: req.type === 'scout' ? '#15803d' : '#0284c7',
      icon: req.type === 'scout' ? 'Compass' : 'GraduationCap',
      status: 'approved',
      folders: [
        {
          id: `f-${Date.now()}-all`,
          name: 'General / Todo el Grupo',
          ageRange: 'Todas las edades',
          color: req.type === 'scout' ? '#15803d' : '#0284c7',
          bannerBg: 'linear-gradient(135deg, #15803d25, #ffffff)',
          whatsappLink: '',
          isPrivateAdultOnly: false,
          reminderNotice: '¡Bienvenidos al nuevo espacio habilitado!',
          materials: [],
          gallery: []
        },
        {
          id: `f-${Date.now()}-dirigentes`,
          name: req.type === 'scout' ? '🎖️ Consejo de Grupo & Dirigentes' : '🏛️ Equipo Directivo',
          ageRange: 'Adultos Educadores',
          color: '#7c3aed',
          bannerBg: 'linear-gradient(135deg, #7c3aed25, #ffffff)',
          whatsappLink: '',
          isPrivateAdultOnly: true,
          reminderNotice: 'Espacio de gestión institucional reservado.',
          materials: [],
          gallery: []
        }
      ]
    };

    // Also register the applicant as institution admin
    const newAdmin = {
      id: `mem-${Date.now()}`,
      orgId: newOrg.id,
      name: req.applicantName,
      email: req.officialEmail || 'responsable@institucion.org',
      phone: req.applicantPhone,
      role: 'admin',
      roleLabel: `${req.applicantRole} (Responsable Habilitado)`,
      branchId: newOrg.folders[1].id,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      showPublicPhone: true,
      showPublicEmail: true
    };

    setData(prev => ({
      ...prev,
      organizations: [...prev.organizations, newOrg],
      members: [...prev.members, newAdmin],
      pendingInstitutions: prev.pendingInstitutions.filter(r => r.id !== reqId)
    }));

    setActiveOrgId(newOrg.id);
  };

  const rejectInstitutionBySuperAdmin = (reqId) => {
    setData(prev => ({
      ...prev,
      pendingInstitutions: prev.pendingInstitutions.filter(r => r.id !== reqId)
    }));
  };

  // Assign Co-Administrators or hierarchy roles within an institution
  const promoteToInstitutionAdmin = (memberId) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === memberId ? { ...m, role: 'admin', roleLabel: 'Responsable Institucional (Co-Administrador)' } : m)
    }));
  };

  // ADVANCED ADMINISTRATOR DESIGNATION (Exclusively by Super Administrator Maximiliano Sánchez)
  // Advanced Admins have almost all Super Admin permissions, but CANNOT delete Maximiliano Sánchez nor appoint other Advanced Admins
  const promoteToAdvancedAdmin = (memberId) => {
    if (!isSuperAdmin) {
      alert('Solo el Super Administrador Maximiliano Sánchez (maxi0802@gmai.com) puede designar Administradores Avanzados.');
      return false;
    }
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            role: 'advanced_admin',
            roleLabel: 'Administrador Avanzado (Designado por Maximiliano Sánchez)'
          };
        }
        return m;
      })
    }));
    return true;
  };

  const demoteAdvancedAdmin = (memberId) => {
    if (!isSuperAdmin) {
      alert('Solo el Super Administrador Maximiliano Sánchez puede revocar la designación de Administrador Avanzado.');
      return false;
    }
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            role: 'educator',
            roleLabel: 'Educador / Docente'
          };
        }
        return m;
      })
    }));
    return true;
  };

  // INSTITUTION CUSTOMIZATION (Autoridades / Responsables can adapt app color, background, motto)
  const updateOrgCustomization = (orgId, updates) => {
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === orgId) {
          return {
            ...org,
            ...updates
          };
        }
        return org;
      })
    }));

    // If active org color is updated, update CSS variables immediately
    if (orgId === activeOrgId && updates.color) {
      document.documentElement.style.setProperty('--primary', updates.color);
      document.documentElement.style.setProperty('--border-focus', updates.color);
    }
  };

  // RED INTERINSTITUCIONAL (Shared folder, metrics, forum among all institution responsibles)
  const addInterOrgResource = (resource) => {
    const newRes = {
      ...resource,
      id: `sh-res-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      downloads: 0,
      author: isSuperAdmin ? 'Maximiliano Sánchez (Super Admin)' : (currentOrg?.name ? `${currentOrg.name} (Responsable)` : 'Autoridad Institucional')
    };

    setData(prev => {
      const currentHub = prev.interInstitutionalHub || { sharedResources: [], statisticsComparison: [], coordinationPosts: [] };
      return {
        ...prev,
        interInstitutionalHub: {
          ...currentHub,
          sharedResources: [newRes, ...(currentHub.sharedResources || [])]
        }
      };
    });
  };

  const deleteInterOrgResource = (resId) => {
    setData(prev => {
      const currentHub = prev.interInstitutionalHub || { sharedResources: [], statisticsComparison: [], coordinationPosts: [] };
      return {
        ...prev,
        interInstitutionalHub: {
          ...currentHub,
          sharedResources: (currentHub.sharedResources || []).filter(r => r.id !== resId)
        }
      };
    });
  };

  const addInterOrgPost = (content) => {
    const newPost = {
      id: `post-${Date.now()}`,
      author: isSuperAdmin ? 'Maximiliano Sánchez' : (isAdvancedAdmin ? 'Scouter Hernán Valenzuela' : 'Guillermo Navarro'),
      authorRole: isSuperAdmin 
        ? 'Super Administrador Nacional' 
        : (isAdvancedAdmin ? 'Administrador Avanzado (Nacional)' : `Responsable (${currentOrg?.name || 'Institución'})`),
      authorAvatar: isSuperAdmin 
        ? data.superAdmin?.avatar 
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      date: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      content,
      repliesCount: 0
    };

    setData(prev => {
      const currentHub = prev.interInstitutionalHub || { sharedResources: [], statisticsComparison: [], coordinationPosts: [] };
      return {
        ...prev,
        interInstitutionalHub: {
          ...currentHub,
          coordinationPosts: [newPost, ...(currentHub.coordinationPosts || [])]
        }
      };
    });
  };

  // NEWS FEED (Noticias & Novedades)
  const addNews = (newsItem) => {
    const newItem = {
      ...newsItem,
      id: `news-${Date.now()}`,
      orgId: activeOrgId,
      branchId: activeFolderId,
      branchName: activeFolder ? activeFolder.name : 'Todo el Grupo',
      date: new Date().toISOString().slice(0, 10),
      likes: 0
    };
    setData(prev => ({
      ...prev,
      news: [newItem, ...(prev.news || [])]
    }));
  };

  const deleteNews = (newsId) => {
    setData(prev => ({
      ...prev,
      news: prev.news.filter(n => n.id !== newsId)
    }));
  };

  const toggleNewsLike = (newsId) => {
    setData(prev => ({
      ...prev,
      news: prev.news.map(n => n.id === newsId ? { ...n, likes: (n.likes || 0) + 1 } : n)
    }));
  };

  // Toggle packing checklist item
  const togglePackingItem = (eventId, itemId) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map(ev => {
        if (ev.id === eventId && ev.requiredMaterials) {
          return {
            ...ev,
            requiredMaterials: ev.requiredMaterials.map(item => 
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          };
        }
        return ev;
      })
    }));
  };

  // Polls Voting & Management
  const votePoll = (pollId, optionId) => {
    setData(prev => ({
      ...prev,
      polls: prev.polls.map(p => {
        if (p.id === pollId) {
          const previousVote = p.userVotes ? p.userVotes[currentUserRole] : null;
          if (previousVote === optionId) return p;

          const updatedOptions = p.options.map(opt => {
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            if (previousVote && opt.id === previousVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
            return opt;
          });

          return {
            ...p,
            options: updatedOptions,
            userVotes: { ...(p.userVotes || {}), [currentUserRole]: optionId }
          };
        }
        return p;
      })
    }));
  };

  const addPoll = (poll) => {
    const newPoll = {
      ...poll,
      id: `poll-${Date.now()}`,
      orgId: activeOrgId,
      status: 'active',
      userVotes: {}
    };
    setData(prev => ({
      ...prev,
      polls: [newPoll, ...(prev.polls || [])]
    }));
  };

  const deletePoll = (pollId) => {
    setData(prev => ({
      ...prev,
      polls: prev.polls.filter(p => p.id !== pollId)
    }));
  };

  // Authorize Pending Member & Assign Branch & Role
  const approveMember = (memberId, branchId, newRole) => {
    const roleLabels = {
      admin: 'Responsable Institucional',
      educator: 'Educador / Docente',
      parent: 'Familia / Padre',
      student: 'Protagonista / Alumno'
    };
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            status: 'active',
            branchId: branchId || m.branchId,
            role: newRole || m.role,
            roleLabel: roleLabels[newRole] || m.roleLabel
          };
        }
        return m;
      })
    }));
  };

  // Announcements Management
  const addAnnouncement = (ann) => {
    const newAnn = {
      ...ann,
      id: `ann-${Date.now()}`,
      orgId: activeOrgId,
      date: new Date().toISOString().slice(0, 10),
      active: true
    };
    setData(prev => ({
      ...prev,
      announcements: [newAnn, ...(prev.announcements || [])]
    }));
  };

  const dismissAnnouncement = (annId) => {
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.map(a => a.id === annId ? { ...a, active: false } : a)
    }));
  };

  // Folder Customization (colors, whatsapp, banner)
  const updateFolderCustomization = (folderId, updates) => {
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === activeOrgId) {
          return {
            ...org,
            folders: org.folders.map(f => f.id === folderId ? { ...f, ...updates } : f)
          };
        }
        return org;
      })
    }));
  };

  const addFolderMaterial = (folderId, material) => {
    const newMat = { ...material, id: `mat-${Date.now()}`, date: new Date().toISOString().slice(0, 10) };
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === activeOrgId) {
          return {
            ...org,
            folders: org.folders.map(f => {
              if (f.id === folderId || (folderId === 'all' && f.id === org.folders[0]?.id)) {
                return { ...f, materials: [newMat, ...(f.materials || [])] };
              }
              return f;
            })
          };
        }
        return org;
      })
    }));
  };

  const addFolderPhoto = (folderId, photo) => {
    const newPhoto = { ...photo, id: `gal-${Date.now()}`, date: new Date().toISOString().slice(0, 10) };
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === activeOrgId) {
          return {
            ...org,
            folders: org.folders.map(f => {
              if (f.id === folderId || (folderId === 'all' && f.id === org.folders[0]?.id)) {
                return { ...f, gallery: [newPhoto, ...(f.gallery || [])] };
              }
              return f;
            })
          };
        }
        return org;
      })
    }));
  };

  // Private Subgroup Adult Resources (Google Drive folders, websites, documents, files)
  const addFolderPrivateResource = (folderId, resource) => {
    const newRes = {
      ...resource,
      id: `par-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      author: isSuperAdmin ? 'Maximiliano Sánchez (Super Admin)' : (isAdmin ? 'Responsable Institucional' : 'Educador del Subgrupo')
    };
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === activeOrgId) {
          return {
            ...org,
            folders: org.folders.map(f => {
              if (f.id === folderId || (folderId === 'all' && f.id === org.folders[0]?.id)) {
                return { ...f, privateAdultResources: [newRes, ...(f.privateAdultResources || [])] };
              }
              return f;
            })
          };
        }
        return org;
      })
    }));
  };

  const deleteFolderPrivateResource = (folderId, resourceId) => {
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === activeOrgId) {
          return {
            ...org,
            folders: org.folders.map(f => {
              if (f.id === folderId || (folderId === 'all' && f.id === org.folders[0]?.id)) {
                return {
                  ...f,
                  privateAdultResources: (f.privateAdultResources || []).filter(r => r.id !== resourceId)
                };
              }
              return f;
            })
          };
        }
        return org;
      })
    }));
  };

  // Member Management & Administration (Jefe de grupo / Directivo)
  const toggleMemberStatus = (memberId) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          const nextStatus = m.status === 'active' ? 'blocked' : 'active';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    }));
  };

  const updateMemberRole = (memberId, newRole) => {
    // Restriction: Cannot elevate someone to advanced_admin unless currentUserRole is superadmin
    if (newRole === 'advanced_admin' && !isSuperAdmin) {
      alert('Acceso denegado: Solo el Super Administrador Maximiliano Sánchez puede asignar la categoría de Administrador Avanzado.');
      return;
    }

    // Protection: Cannot demote or modify Maximiliano Sánchez
    const target = data.members.find(m => m.id === memberId);
    if (target && (target.email === 'maxi0802@gmai.com' || target.id === 'superadmin-1')) {
      alert('Operación Bloqueada: El Super Administrador Maximiliano Sánchez no puede ser modificado ni degradado.');
      return;
    }

    // Protection: Advanced Admins cannot demote other Advanced Admins
    if (target && target.role === 'advanced_admin' && !isSuperAdmin) {
      alert('Operación Bloqueada: Solo Maximiliano Sánchez puede modificar el rol de un Administrador Avanzado.');
      return;
    }

    const roleLabels = {
      advanced_admin: 'Administrador Avanzado (Nacional)',
      admin: 'Responsable Institucional',
      educator: 'Educador / Docente',
      parent: 'Familia / Padre',
      student: 'Protagonista / Alumno'
    };
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === memberId ? { ...m, role: newRole, roleLabel: roleLabels[newRole] || newRole } : m)
    }));
  };

  const deleteMember = (memberId) => {
    // Protection: Cannot delete Maximiliano Sánchez
    const target = data.members.find(m => m.id === memberId);
    if (target && (target.email === 'maxi0802@gmai.com' || target.id === 'superadmin-1')) {
      alert('Operación Bloqueada: Es imposible eliminar al Super Administrador Maximiliano Sánchez.');
      return;
    }

    // Protection: Advanced Admins cannot delete other Advanced Admins
    if (target && target.role === 'advanced_admin' && !isSuperAdmin) {
      alert('Operación Bloqueada: Los Administradores Avanzados no pueden eliminar a otros Administradores Avanzados.');
      return;
    }

    setData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    }));
  };

  // Messaging & Notifications
  const sendMessage = (content) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      orgId: activeOrgId,
      senderName: isSuperAdmin ? 'Maximiliano Sánchez (Super Admin)' : (isAdmin ? 'Jefatura de Grupo' : (canEdit ? 'Docente / Dirigente' : 'Familia')),
      senderRole: currentUserRole,
      branchName: activeFolder ? activeFolder.name : 'General',
      timestamp: 'Recién',
      content
    };
    setData(prev => ({
      ...prev,
      messages: [newMsg, ...(prev.messages || [])]
    }));
  };

  const addFolder = (orgId, folderName, isPrivate = false) => {
    if (!folderName.trim()) return;
    const newFolder = {
      id: `f-${Date.now()}`,
      name: folderName.trim(),
      color: '#15803d',
      ageRange: 'Personalizado',
      bannerBg: 'linear-gradient(135deg, #15803d25, #ffffff)',
      whatsappLink: '',
      isPrivateAdultOnly: isPrivate,
      reminderNotice: '¡Bienvenidos a esta nueva sección! Recuerden revisar las actividades programadas.',
      materials: [],
      gallery: []
    };
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === orgId) {
          return {
            ...org,
            folders: [...(org.folders || []), newFolder]
          };
        }
        return org;
      })
    }));
  };

  // Projects CRUD
  const addProject = (project) => {
    const newProj = {
      ...project,
      id: `proj-${Date.now()}`,
      orgId: activeOrgId,
      folderId: activeFolderId === 'all' ? (currentOrg.folders[0]?.id || '') : activeFolderId,
      progress: Number(project.progress) || 0,
      milestones: project.milestones || []
    };
    setData(prev => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
  };

  const updateProject = (id, updated) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updated } : p)
    }));
  };

  const deleteProject = (id) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Events CRUD
  const addEvent = (event) => {
    const targetFolder = currentOrg.folders.find(f => f.id === event.folderId) || currentOrg.folders[0];
    const newEv = {
      ...event,
      id: `ev-${Date.now()}`,
      orgId: activeOrgId,
      branchName: targetFolder ? targetFolder.name.replace(/[^\w\s\u00C0-\u017F]/gi, '').trim() : 'General',
      badgeColor: event.badgeColor || targetFolder?.color || '#15803d',
      folderId: event.isGroupWide ? 'all' : (event.folderId || activeFolderId || 'all'),
      requiredMaterials: event.requiredMaterials || []
    };
    setData(prev => ({
      ...prev,
      calendarEvents: [newEv, ...prev.calendarEvents]
    }));
  };

  const updateEvent = (id, updated) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map(e => e.id === id ? { ...e, ...updated } : e)
    }));
  };

  const deleteEvent = (id) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter(e => e.id !== id)
    }));
  };

  // Daily Program Block CRUD
  const currentDailyProgram = data.dailyPrograms.find(p => p.orgId === activeOrgId) || {
    id: `prog-${activeOrgId}`,
    orgId: activeOrgId,
    folderId: 'all',
    date: new Date().toISOString().slice(0, 10),
    dayName: 'Día de Actividades',
    theme: 'Programa General',
    location: 'Sede Principal',
    responsible: 'Coordinador General',
    weatherAdvice: 'Revisar condiciones meteorológicas.',
    blocks: []
  };

  const addDailyBlock = (block) => {
    const newBlock = { ...block, id: `b-${Date.now()}` };
    setData(prev => {
      const exists = prev.dailyPrograms.some(p => p.orgId === activeOrgId);
      if (!exists) {
        return {
          ...prev,
          dailyPrograms: [...prev.dailyPrograms, { ...currentDailyProgram, blocks: [newBlock] }]
        };
      }
      return {
        ...prev,
        dailyPrograms: prev.dailyPrograms.map(p => {
          if (p.orgId === activeOrgId) {
            return { ...p, blocks: [...(p.blocks || []), newBlock] };
          }
          return p;
        })
      };
    });
  };

  const updateDailyBlock = (blockId, updated) => {
    setData(prev => ({
      ...prev,
      dailyPrograms: prev.dailyPrograms.map(p => {
        if (p.orgId === activeOrgId) {
          return { ...p, blocks: p.blocks.map(b => b.id === blockId ? { ...b, ...updated } : b) };
        }
        return p;
      })
    }));
  };

  const deleteDailyBlock = (blockId) => {
    setData(prev => ({
      ...prev,
      dailyPrograms: prev.dailyPrograms.map(p => {
        if (p.orgId === activeOrgId) {
          return { ...p, blocks: p.blocks.filter(b => b.id !== blockId) };
        }
        return p;
      })
    }));
  };

  const updateProgramMeta = (meta) => {
    setData(prev => ({
      ...prev,
      dailyPrograms: prev.dailyPrograms.map(p => {
        if (p.orgId === activeOrgId) {
          return { ...p, ...meta };
        }
        return p;
      })
    }));
  };

  // Organigram CRUD
  const addOrgNode = (node) => {
    const newNode = {
      ...node,
      id: `node-${Date.now()}`,
      orgId: activeOrgId,
      avatar: node.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      organigram: [...prev.organigram, newNode]
    }));
  };

  const updateOrgNode = (id, updated) => {
    setData(prev => ({
      ...prev,
      organigram: prev.organigram.map(n => n.id === id ? { ...n, ...updated } : n)
    }));
  };

  const deleteOrgNode = (id) => {
    setData(prev => ({
      ...prev,
      organigram: prev.organigram
        .filter(n => n.id !== id)
        .map(n => n.parentId === id ? { ...n, parentId: null } : n)
    }));
  };

  // Export / Import
  const exportDataJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `senda_neoedu_respaldo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.organizations && parsed.projects) {
        setData(parsed);
        if (parsed.organizations[0]) {
          setActiveOrgId(parsed.organizations[0].id);
        }
        return { success: true };
      }
      return { success: false, error: 'Estructura de archivo no válida.' };
    } catch (e) {
      return { success: false, error: 'Error al procesar el archivo JSON.' };
    }
  };

  const resetToSampleData = () => {
    setData(initialData);
    setActiveOrgId(initialData.organizations[0].id);
    setActiveFolderId('all');
  };

  return (
    <AppContext.Provider
      value={{
        data,
        activeOrgId,
        selectOrg,
        activeFolderId,
        activeFolder,
        selectFolder,
        setActiveFolderId,
        currentOrg,
        currentTab,
        setCurrentTab,
        // Role & Permissions
        currentUserRole,
        setCurrentUserRole,
        isSuperAdmin,
        canEdit,
        isAdmin,
        isAdult,
        isLoggedIn,
        setIsLoggedIn,
        canAccessFolder,
        canAccessSubgroupPrivateAdults,
        addFolderPrivateResource,
        deleteFolderPrivateResource,
        privateAccessModal,
        setPrivateAccessModal,
        // Super Admin & Advanced Admin Permissions
        isAdvancedAdmin,
        hasSuperOrAdvancedAccess,
        canManageAdvancedAdmins,
        promoteToAdvancedAdmin,
        demoteAdvancedAdmin,
        // Super Admin & Institution Workflow
        requestInstitutionCreation,
        approveInstitutionBySuperAdmin,
        rejectInstitutionBySuperAdmin,
        promoteToInstitutionAdmin,
        // Organization Customization
        updateOrgCustomization,
        orgCustomizationModalOpen,
        setOrgCustomizationModalOpen,
        // Red Interinstitucional
        addInterOrgResource,
        deleteInterOrgResource,
        addInterOrgPost,
        // News Feed
        addNews,
        deleteNews,
        toggleNewsLike,
        // Sharing Modal
        shareModalOpen,
        setShareModalOpen,
        // Branch Filters for Calendar
        calendarBranchFilters,
        setCalendarBranchFilters,
        // Checklists, Polls, Announcements, Approvals
        togglePackingItem,
        votePoll,
        addPoll,
        deletePoll,
        approveMember,
        addAnnouncement,
        dismissAnnouncement,
        // Visual & Accessibility
        theme,
        setTheme,
        fontSize,
        setFontSize,
        searchQuery,
        setSearchQuery,
        modalConfig,
        setModalConfig,
        backupModalOpen,
        setBackupModalOpen,
        // Google Drive 24/7 Cloud Sync
        driveSyncState,
        lastDriveSync,
        syncWithDriveNow,
        // Methods
        updateFolderCustomization,
        addFolderMaterial,
        addFolderPhoto,
        toggleMemberStatus,
        updateMemberRole,
        deleteMember,
        sendMessage,
        addFolder,
        addProject,
        updateProject,
        deleteProject,
        addEvent,
        updateEvent,
        deleteEvent,
        currentDailyProgram,
        addDailyBlock,
        updateDailyBlock,
        deleteDailyBlock,
        updateProgramMeta,
        addOrgNode,
        updateOrgNode,
        deleteOrgNode,
        exportDataJSON,
        importDataJSON,
        resetToSampleData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
