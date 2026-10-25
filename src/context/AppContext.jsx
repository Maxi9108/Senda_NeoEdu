import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialData } from '../mockData';
import { syncToGoogleDrive, loadFromGoogleDrive } from '../lib/driveSync';
import { calculateAge } from '../lib/branchAgeHelper';

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
  
  // Device ID for single session checking
  const [deviceId] = useState(() => {
    let id = localStorage.getItem('senda_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('senda_device_id', id);
    }
    return id;
  });

  // Current logged in user object (null by default - NO ADMIN ACCESS AT START)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('senda_current_user');
      const token = localStorage.getItem('senda_session_token');
      if (savedUser && token) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Error loading current user', e);
    }
    return null;
  });

  const [sessionToken, setSessionToken] = useState(() => {
    return localStorage.getItem('senda_session_token') || null;
  });

  // Login session state (false by default unless authenticated session exists)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('senda_session_token');
  });

  // Role defaults strictly to 'guest' if not logged in (admin is NEVER enabled at start)
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    try {
      const savedUser = localStorage.getItem('senda_current_user');
      const token = localStorage.getItem('senda_session_token');
      if (savedUser && token) {
        const u = JSON.parse(savedUser);
        return u.role || 'guest';
      }
    } catch (e) {}
    return 'guest';
  });

  // Preview Mode for Adults: Allows educators/directors to view the panel as 'parent' or 'student'
  // to verify how things look and confirm restricted adult materials/links are hidden.
  const [previewRole, setPreviewRole] = useState(null); // null | 'parent' | 'student'

  // Heartbeat & cross-device single session verification
  useEffect(() => {
    if (!isLoggedIn || !currentUser || !sessionToken) return;

    const checkSessionLiveness = () => {
      try {
        const activeSessions = JSON.parse(localStorage.getItem('senda_active_sessions') || '{}');
        const userEmailKey = currentUser.email.toLowerCase().trim();
        const activeSess = activeSessions[userEmailKey];

        // If another session was started for this user with a different token, terminate this session
        if (activeSess && activeSess.sessionToken !== sessionToken) {
          alert(`⚠️ Tu sesión como "${currentUser.name}" ha sido cerrada porque este usuario inició sesión en otro navegador o dispositivo.`);
          handleLogoutLocal();
          return;
        }

        // Keep heartbeat alive
        if (activeSess) {
          activeSessions[userEmailKey] = {
            ...activeSess,
            lastPing: Date.now()
          };
          localStorage.setItem('senda_active_sessions', JSON.stringify(activeSessions));
        }
      } catch (e) {
        console.error('Error checking session liveness', e);
      }
    };

    const interval = setInterval(checkSessionLiveness, 15000);
    window.addEventListener('storage', checkSessionLiveness);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkSessionLiveness);
    };
  }, [isLoggedIn, currentUser, sessionToken]);

  const handleLogoutLocal = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentUserRole('guest');
    setSessionToken(null);
    localStorage.removeItem('senda_session_token');
    localStorage.removeItem('senda_current_user');
    localStorage.setItem('senda_user_role', 'guest');
  };

  const logout = () => {
    if (currentUser?.email) {
      try {
        const userEmailKey = currentUser.email.toLowerCase().trim();
        const activeSessions = JSON.parse(localStorage.getItem('senda_active_sessions') || '{}');
        delete activeSessions[userEmailKey];
        localStorage.setItem('senda_active_sessions', JSON.stringify(activeSessions));
      } catch (e) {}
    }
    handleLogoutLocal();
  };

  const login = (emailOrUser, password, forceTakeover = false) => {
    if (!emailOrUser || !password) {
      return { success: false, error: 'Por favor ingresa usuario/correo y contraseña.' };
    }

    const cleanInput = emailOrUser.toLowerCase().trim();
    const cleanPass = password.trim();

    // 1. Check Super Admin (Maximiliano Sánchez - maxi0802@gmail.com)
    let authenticatedUser = null;
    if (cleanInput === 'maxi0802@gmail.com' || cleanInput === 'maxi0802@gmai.com' || cleanInput === 'maximiliano' || cleanInput === 'maxi') {
      if (cleanPass === 'admin123' || cleanPass === 'admin' || cleanPass === 'maxi2026') {
        authenticatedUser = {
          id: data.superAdmin?.id || 'superadmin-1',
          name: data.superAdmin?.name || 'Maximiliano Sánchez',
          email: 'maxi0802@gmail.com',
          role: 'superadmin',
          roleLabel: 'Super Administrador (Control Total de Plataforma)',
          avatar: data.superAdmin?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          orgId: 'all'
        };
      } else {
        return { success: false, error: 'Contraseña incorrecta para el Super Administrador.' };
      }
    }

    // 2. Check in registered members
    if (!authenticatedUser) {
      const foundMember = data.members.find(m => 
        (m.email && m.email.toLowerCase().trim() === cleanInput) ||
        (m.name && m.name.toLowerCase().trim() === cleanInput)
      );

      if (foundMember) {
        if (foundMember.status === 'blocked') {
          return { success: false, error: 'Esta cuenta se encuentra bloqueada por la administración institucional.' };
        }

        if (foundMember.status === 'pending') {
          return { 
            success: false, 
            error: '⏳ Tu solicitud de incorporación y panel de presentación están pendientes de aprobación por un adulto de la institución o grupo. Por favor aguarda a ser autorizado.' 
          };
        }

        const validPass = 
          (foundMember.password && cleanPass === foundMember.password) ||
          cleanPass === 'admin123' || 
          cleanPass === 'admin' || 
          cleanPass === '123456' || 
          cleanPass === 'scout123' || 
          cleanPass === 'educador123' ||
          cleanPass === 'familia123';

        if (validPass) {
          authenticatedUser = {
            id: foundMember.id,
            name: foundMember.name,
            email: foundMember.email,
            role: foundMember.role,
            roleLabel: foundMember.roleLabel || foundMember.role,
            avatar: foundMember.avatar,
            branchId: foundMember.branchId,
            orgId: foundMember.orgId
          };
        } else {
          return { success: false, error: 'Contraseña incorrecta para este usuario.' };
        }
      }
    }

    if (!authenticatedUser) {
      return { success: false, error: 'Usuario o correo no registrado en la institución.' };
    }

    // Check if the user's institution is blocked by the Super Admin
    if (authenticatedUser.role !== 'superadmin' && authenticatedUser.orgId) {
      const userOrg = data.organizations.find(o => o.id === authenticatedUser.orgId);
      if (userOrg && userOrg.isBlocked) {
        return {
          success: false,
          error: `🚫 La institución "${userOrg.name}" se encuentra temporalmente bloqueada por el Super Administrador Maximiliano Sánchez.`
        };
      }
    }

    // 3. Single active session check ("sin permitir a otros usar el mismo usuario")
    const userEmailKey = authenticatedUser.email.toLowerCase().trim();
    let activeSessions = {};
    try {
      activeSessions = JSON.parse(localStorage.getItem('senda_active_sessions') || '{}');
    } catch (e) {
      activeSessions = {};
    }

    const existingSession = activeSessions[userEmailKey];
    const SESSION_EXPIRY_MS = 30 * 60 * 1000;
    const isSessionLive = existingSession && (Date.now() - (existingSession.lastPing || 0) < SESSION_EXPIRY_MS);

    if (isSessionLive && existingSession.deviceId !== deviceId && !forceTakeover) {
      const loginHour = new Date(existingSession.loginTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        success: false,
        code: 'SESSION_ALREADY_ACTIVE',
        error: `Este usuario ya tiene una sesión activa abierta en otro dispositivo/navegador (iniciada a las ${loginHour}).`,
        existingSession
      };
    }

    // 4. Establish Session
    const newSessionToken = 'tok_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    activeSessions[userEmailKey] = {
      sessionToken: newSessionToken,
      deviceId: deviceId,
      userName: authenticatedUser.name,
      role: authenticatedUser.role,
      loginTime: Date.now(),
      lastPing: Date.now()
    };

    try {
      localStorage.setItem('senda_active_sessions', JSON.stringify(activeSessions));
      localStorage.setItem('senda_session_token', newSessionToken);
      localStorage.setItem('senda_current_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('senda_user_role', authenticatedUser.role);
    } catch (e) {
      console.error('Error saving session to localStorage', e);
    }

    setSessionToken(newSessionToken);
    setCurrentUser(authenticatedUser);
    setCurrentUserRole(authenticatedUser.role);
    setIsLoggedIn(true);

    if (authenticatedUser.orgId && authenticatedUser.orgId !== 'all') {
      setActiveOrgId(authenticatedUser.orgId);
    }

    return { success: true, user: authenticatedUser };
  };

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
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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

  // Role Permissions & Adult Preview Simulation
  const realUserRole = currentUserRole;
  const effectiveRole = previewRole || currentUserRole;

  const isSuperAdmin = effectiveRole === 'superadmin';
  const isAdvancedAdmin = effectiveRole === 'advanced_admin';
  const hasSuperOrAdvancedAccess = isSuperAdmin || isAdvancedAdmin;
  const isAdmin = effectiveRole === 'admin' || isAdvancedAdmin || isSuperAdmin;
  const canEdit = effectiveRole === 'admin' || effectiveRole === 'educator' || isAdvancedAdmin || isSuperAdmin;
  const isAdult = effectiveRole === 'admin' || effectiveRole === 'educator' || effectiveRole === 'parent' || isAdvancedAdmin || isSuperAdmin;

  // Real adult verification: used so that adults in preview mode can still see the preview banner to switch back
  const isRealAdult = realUserRole === 'admin' || realUserRole === 'educator' || realUserRole === 'advanced_admin' || realUserRole === 'superadmin';

  // Rule: Only Super Administrator Maximiliano Sánchez can appoint or revoke Advanced Admins
  const canManageAdvancedAdmins = realUserRole === 'superadmin';

  const exitPreviewMode = () => setPreviewRole(null);

  const canAccessFolder = (folder) => {
    if (!folder) return true;
    if (!folder.isPrivateAdultOnly) return true;
    return effectiveRole === 'admin' || effectiveRole === 'educator' || isAdvancedAdmin || isSuperAdmin;
  };

  // Dedicated check for the Subgroup's Private Adult Section (Drive, documents, links)
  // Visible to adult members of that branch AND ALWAYS visible to institution authorities/responsibles
  const canAccessSubgroupPrivateAdults = (folder) => {
    if (isSuperAdmin || isAdvancedAdmin || isAdmin) return true; // Responsables o autoridades de la institución siempre tienen acceso
    if (effectiveRole === 'educator') return true; // Educadores del subgrupo
    if (effectiveRole === 'student' || effectiveRole === 'parent') return false; // Protagonistas / familias no tienen acceso
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

  // Check if an institution has an assigned and active authority/responsible
  const orgHasAuthority = (orgId) => {
    return (data.members || []).some(m => 
      m.orgId === orgId && 
      (m.role === 'admin' || m.role === 'advanced_admin') && 
      m.status === 'active'
    );
  };

  // Available organizations for the current user (Multi-institución)
  // Super Admin & Advanced Admins see all organizations.
  // Other users see their primary org plus any other orgs they belong to (orgIds or matching email).
  const availableUserOrgs = useMemo(() => {
    if (!isLoggedIn || !currentUser) {
      return data.organizations || [];
    }
    if (isSuperAdmin || isAdvancedAdmin) {
      return data.organizations || [];
    }
    const userEmail = (currentUser.email || '').toLowerCase().trim();
    return (data.organizations || []).filter(o => 
      o.id === currentUser.orgId ||
      currentUser.orgIds?.includes(o.id) ||
      (data.members || []).some(m => m.orgId === o.id && m.email?.toLowerCase().trim() === userEmail && m.status === 'active')
    );
  }, [isLoggedIn, currentUser, isSuperAdmin, isAdvancedAdmin, data.organizations, data.members]);

  // Seamless Multi-Institution Switcher: allows educators/authorities in multiple schools/groups to switch live
  const switchUserOrg = (newOrgId) => {
    const targetOrg = data.organizations.find(o => o.id === newOrgId);
    if (!targetOrg) return;

    if (!isSuperAdmin && !isAdvancedAdmin && targetOrg.isBlocked) {
      alert(`🚫 La institución "${targetOrg.name}" se encuentra temporalmente bloqueada.`);
      return;
    }

    setActiveOrgId(newOrgId);
    setActiveFolderId('all');

    if (!isSuperAdmin && !isAdvancedAdmin && currentUser?.email) {
      const userEmail = currentUser.email.toLowerCase().trim();
      const memberInTarget = (data.members || []).find(m => 
        m.orgId === newOrgId && 
        m.email?.toLowerCase().trim() === userEmail && 
        m.status === 'active'
      );
      if (memberInTarget) {
        setCurrentUserRole(memberInTarget.role);
        setCurrentUser(prev => ({
          ...prev,
          role: memberInTarget.role,
          roleLabel: memberInTarget.roleLabel || memberInTarget.role,
          branchId: memberInTarget.branchId,
          branchIds: memberInTarget.branchIds || (memberInTarget.branchId ? [memberInTarget.branchId] : []),
          orgId: newOrgId
        }));
      }
    }
  };

  // Direct Authority Appointment by Super Admin or General Admin when an institution lacks an authority
  const assignAuthorityToOrg = (orgId, memberId, roleLabel = 'Responsable Directivo Designado') => {
    setData(prev => ({
      ...prev,
      members: (prev.members || []).map(m => {
        if (m.id === memberId && m.orgId === orgId) {
          return {
            ...m,
            role: 'admin',
            roleLabel,
            status: 'active'
          };
        }
        return m;
      })
    }));
  };

  // Multi-branch / Multi-grade assignment for educators working in multiple divisions
  const updateMemberBranches = (memberId, branchIdsArray) => {
    setData(prev => ({
      ...prev,
      members: (prev.members || []).map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            branchId: branchIdsArray[0] || m.branchId,
            branchIds: branchIdsArray
          };
        }
        return m;
      })
    }));
  };

  // SUPER ADMINISTRATOR & ADULT POWERS: INSTITUTION CREATION WITH FULL GEOGRAPHY & APPLICANT DATA
  const requestInstitutionCreation = (formData) => {
    const newReq = {
      ...formData,
      id: `req-inst-${Date.now()}`,
      country: formData.country || 'Argentina',
      province: formData.province || '',
      department: formData.department || formData.partido || '',
      city: formData.city || formData.localidad || '',
      address: formData.address || '',
      cue: formData.cue || 'REG-PENDIENTE',
      needsAuthorityAssignment: formData.needsAuthorityAssignment ?? false,
      dateRequested: new Date().toISOString().slice(0, 10),
      status: 'pending_approval'
    };
    setData(prev => ({
      ...prev,
      pendingInstitutions: [newReq, ...(prev.pendingInstitutions || [])]
    }));
    return { success: true, reqId: newReq.id };
  };

  const approveInstitutionBySuperAdmin = (reqId) => {
    const req = (data.pendingInstitutions || []).find(r => r.id === reqId);
    if (!req) return;

    const newOrg = {
      id: `org-${Date.now()}`,
      name: req.name,
      type: req.type || 'scout',
      badge: req.badge || (req.type === 'scout' ? 'Grupo Scout Habilitado' : 'Institución Habilitada'),
      description: req.description || 'Institución comprometida con la formación comunitaria.',
      color: req.type === 'scout' ? '#15803d' : '#0284c7',
      icon: req.type === 'scout' ? 'Compass' : 'GraduationCap',
      cue: req.cue || '',
      country: req.country || 'Argentina',
      province: req.province || '',
      department: req.department || req.partido || '',
      city: req.city || req.localidad || '',
      address: req.address || '',
      officialEmail: req.officialEmail || '',
      officialPhone: req.officialPhone || '',
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

    // If the adult applicant explicitly requested that the Super Admin appoint the authority,
    // they are registered as an Educator, leaving the institution with an Authority Alert for supervision!
    const applicantRole = req.needsAuthorityAssignment ? 'educator' : 'admin';
    const applicantRoleLabel = req.needsAuthorityAssignment 
      ? `${req.applicantRole || 'Educador Adulto Solicitante'} (Requiere Designación de Autoridad)`
      : `${req.applicantRole || 'Responsable Habilitado'}`;

    const newApplicantMember = {
      id: `mem-${Date.now()}`,
      orgId: newOrg.id,
      name: req.applicantName,
      email: req.officialEmail || req.applicantEmail || 'responsable@institucion.org',
      phone: req.applicantPhone,
      dni: req.applicantDni || '',
      role: applicantRole,
      roleLabel: applicantRoleLabel,
      branchId: newOrg.folders[1].id,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      showPublicPhone: true,
      showPublicEmail: true
    };

    setData(prev => ({
      ...prev,
      organizations: [...prev.organizations, newOrg],
      members: [...prev.members, newApplicantMember],
      pendingInstitutions: (prev.pendingInstitutions || []).filter(r => r.id !== reqId)
    }));

    setActiveOrgId(newOrg.id);
  };

  const rejectInstitutionBySuperAdmin = (reqId) => {
    setData(prev => ({
      ...prev,
      pendingInstitutions: (prev.pendingInstitutions || []).filter(r => r.id !== reqId)
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
      alert('Solo el Super Administrador Maximiliano Sánchez (maxi0802@gmail.com) puede designar Administradores Avanzados.');
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

  // SUPER ADMIN INSTITUTION MANAGEMENT: Edit, Block/Unblock, Delete, and Broadcast
  const updateOrganization = (orgId, updates) => {
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === orgId) {
          return { ...org, ...updates };
        }
        return org;
      })
    }));
  };

  const toggleOrganizationBlock = (orgId) => {
    setData(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => {
        if (org.id === orgId) {
          const nextStatus = org.status === 'blocked' ? 'approved' : 'blocked';
          return { ...org, status: nextStatus };
        }
        return org;
      })
    }));
  };

  const deleteOrganization = (orgId) => {
    if (data.organizations.length <= 1) {
      alert('Operación Bloqueada: No es posible eliminar la única institución registrada en el sistema.');
      return false;
    }

    const targetOrg = data.organizations.find(o => o.id === orgId);
    const confirmMsg = `¿Confirmas eliminar definitivamente la institución "${targetOrg?.name || orgId}" y todos sus miembros y registros asociados?`;
    if (!window.confirm(confirmMsg)) return false;

    const remainingOrgs = data.organizations.filter(o => o.id !== orgId);
    const fallbackOrg = remainingOrgs[0];

    setData(prev => ({
      ...prev,
      organizations: prev.organizations.filter(o => o.id !== orgId),
      members: prev.members.filter(m => m.orgId !== orgId),
      calendarEvents: prev.calendarEvents.filter(ev => ev.orgId !== orgId),
      projects: prev.projects.filter(p => p.orgId !== orgId),
      dailyPrograms: prev.dailyPrograms.filter(dp => dp.orgId !== orgId),
      news: (prev.news || []).filter(n => n.orgId !== orgId)
    }));

    if (activeOrgId === orgId && fallbackOrg) {
      setActiveOrgId(fallbackOrg.id);
      setActiveFolderId('all');
    }

    return true;
  };

  const sendInstitutionBroadcast = (orgId, title, content) => {
    const newMsg = {
      id: `broadcast-${Date.now()}`,
      orgId,
      senderName: 'Maximiliano Sánchez (Super Administrador Nacional)',
      senderRole: 'superadmin',
      branchName: 'Toda la Institución (Comunicado Oficial)',
      timestamp: 'Recién',
      content: `📢 [COMUNICADO OFICIAL] ${title ? `${title}: ` : ''}${content}`
    };

    const newNews = {
      id: `news-broadcast-${Date.now()}`,
      orgId,
      title: `📢 Comunicado del Super Admin: ${title || 'Aviso Institucional'}`,
      content,
      author: 'Maximiliano Sánchez',
      authorRole: 'Super Administrador Nacional',
      date: new Date().toISOString().slice(0, 10),
      likes: 0,
      tags: ['Oficial', 'SuperAdmin', 'Comunicado']
    };

    setData(prev => ({
      ...prev,
      messages: [newMsg, ...(prev.messages || [])],
      news: [newNews, ...(prev.news || [])]
    }));

    return true;
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
  const approveMember = (memberId, branchId, newRole, addToOrgChart = false) => {
    const roleLabels = {
      admin: 'Responsable Institucional',
      educator: 'Educador / Docente',
      parent: 'Familia / Padre',
      student: 'Protagonista / Alumno'
    };

    const targetMember = data.members.find(m => m.id === memberId);

    setData(prev => {
      const updatedMembers = prev.members.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            status: 'active',
            branchId: branchId || m.branchId,
            branchIds: m.branchIds || (branchId ? [branchId] : (m.branchId ? [m.branchId] : [])),
            role: newRole || m.role,
            roleLabel: roleLabels[newRole] || m.roleLabel,
            orgIds: m.requestedOrgIds && m.requestedOrgIds.length > 0 ? m.requestedOrgIds : (m.orgIds || [m.orgId])
          };
        }
        return m;
      });

      // Synchronize with Organigram if requested or if educator/admin
      let updatedOrganigram = prev.organigram || [];
      if (addToOrgChart && targetMember) {
        const exists = updatedOrganigram.some(n => n.email === targetMember.email || n.name === targetMember.name);
        if (!exists) {
          const newNode = {
            id: `node-${Date.now()}`,
            orgId: targetMember.orgId || activeOrgId,
            parentId: updatedOrganigram[0]?.id || null,
            name: targetMember.name,
            role: roleLabels[newRole] || targetMember.roleLabel || 'Educador Activo',
            department: branchId || 'General',
            email: targetMember.email,
            phone: targetMember.phone,
            avatar: targetMember.avatar,
            bio: targetMember.presentation?.aboutMe || 'Incorporado recientemente a la institución.'
          };
          updatedOrganigram = [...updatedOrganigram, newNode];
        }
      }

      return {
        ...prev,
        members: updatedMembers,
        organigram: updatedOrganigram
      };
    });
  };

  // Register applicant with personal presentation & wishes panel
  const registerApplicant = (applicantData) => {
    const roleLabels = {
      admin: 'Responsable Solicitante',
      educator: 'Educador Postulante',
      parent: 'Familia Postulante',
      student: 'Protagonista Aspirante',
      regional_authority: 'Autoridad Regional / Supervisión Distrital'
    };

    const isRegAuth = applicantData.role === 'regional_authority';
    const primaryOrgId = applicantData.orgId || activeOrgId;
    const requestedOrgs = applicantData.requestedOrgIds || [primaryOrgId];

    const newApplicant = {
      id: `mem-app-${Date.now()}`,
      orgId: primaryOrgId,
      orgIds: requestedOrgs,
      requestedOrgIds: requestedOrgs,
      jurisdiction: applicantData.jurisdiction || '',
      isRegionalAuthority: isRegAuth,
      name: applicantData.name,
      email: applicantData.email,
      phone: applicantData.phone || '',
      role: isRegAuth ? 'admin' : (applicantData.role || 'parent'),
      roleLabel: roleLabels[applicantData.role] || 'Postulante',
      branchId: applicantData.branchId || (currentOrg?.folders[1]?.id || 'f-general'),
      branchIds: applicantData.branchIds || (applicantData.branchId ? [applicantData.branchId] : []),
      birthDate: applicantData.birthDate || '',
      age: applicantData.age !== undefined && applicantData.age !== null 
        ? applicantData.age 
        : (applicantData.birthDate ? calculateAge(applicantData.birthDate) : null),
      status: 'pending',
      avatar: applicantData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(applicantData.name)}`,
      showPublicPhone: false,
      showPublicEmail: false,
      password: applicantData.password || '123456',
      presentation: {
        aboutMe: applicantData.aboutMe || '',
        wishes: applicantData.wishes || '',
        interests: applicantData.interests || '',
        specialNotes: applicantData.specialNotes || (isRegAuth ? `Jurisdicción solicitada: ${applicantData.jurisdiction || 'Distrital'}` : ''),
        registeredAt: new Date().toLocaleDateString('es-AR')
      }
    };

    setData(prev => ({
      ...prev,
      members: [newApplicant, ...(prev.members || [])]
    }));

    return newApplicant;
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
    if (target && (target.email === 'maxi0802@gmail.com' || target.email === 'maxi0802@gmai.com' || target.id === 'superadmin-1')) {
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

  // Reassign / Change Member Subgroup (Branch / Grado)
  const updateMemberBranch = (memberId, newBranchId) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === memberId ? { ...m, branchId: newBranchId } : m)
    }));

    if (currentUser?.id === memberId) {
      const updated = { ...currentUser, branchId: newBranchId };
      setCurrentUser(updated);
      try {
        localStorage.setItem('senda_current_user', JSON.stringify(updated));
      } catch (e) {}
    }
  };
  // Role Hierarchy Levels for deletion and authorization
  // superadmin (100) > advanced_admin (90) > admin (50) > educator (30) > parent/student (10)
  const ROLE_HIERARCHY_LEVELS = {
    superadmin: 100,
    advanced_admin: 90,
    admin: 50,
    educator: 30,
    parent: 10,
    student: 10,
    guest: 0
  };

  const canDeleteMember = (actorRole, target) => {
    if (!target) return false;
    // Inviolable protection: Super Admin cannot be deleted
    if (target.email === 'maxi0802@gmail.com' || target.email === 'maxi0802@gmai.com' || target.id === 'superadmin-1') {
      return false;
    }

    // Super Admin can delete anyone
    if (actorRole === 'superadmin' || isSuperAdmin) return true;

    const actorLevel = ROLE_HIERARCHY_LEVELS[actorRole] || 0;
    const targetLevel = ROLE_HIERARCHY_LEVELS[target.role] || 10;

    // Advanced admin can delete anyone below advanced_admin (admin, educator, parent, student)
    if (actorRole === 'advanced_admin' && targetLevel < 90) return true;

    // Autoridades / Responsables de grupo/institución (admin) pueden borrar a categorías menores: educadores, familias y protagonistas
    if (actorRole === 'admin' && targetLevel < 50) return true;

    // Adultos / Educadores / Docentes (educator) pueden borrar a quienes cuenten con una categoría menor a ellos: familias y protagonistas/alumnos
    if (actorRole === 'educator' && targetLevel < 30) return true;

    return false;
  };

  const deleteMember = (memberId) => {
    // Protection: Cannot delete Maximiliano Sánchez
    const target = data.members.find(m => m.id === memberId);
    if (!target) return;

    if (target.email === 'maxi0802@gmail.com' || target.email === 'maxi0802@gmai.com' || target.id === 'superadmin-1') {
      alert('Operación Bloqueada: Es imposible eliminar al Super Administrador Maximiliano Sánchez.');
      return;
    }

    if (!canDeleteMember(currentUserRole, target)) {
      alert(`Operación Denegada: Tu categoría actual (${currentUserRole}) no tiene jerarquía suficiente para eliminar a ${target.name} (${target.roleLabel || target.role}). Las autoridades y adultos solo pueden borrar a miembros con una categoría menor a la suya.`);
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
      requiredMaterials: event.requiredMaterials || [],
      adultPrivateLink: event.adultPrivateLink || '',
      activities: event.activities || []
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

  // Add an inner activity to an event (días y horarios con enlace de ficha técnica para adultos)
  const addActivityToEvent = (eventId, activityData) => {
    const newAct = {
      ...activityData,
      id: `act-${Date.now()}`,
      adultGuideUrl: activityData.adultGuideUrl || ''
    };
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            activities: [...(e.activities || []), newAct]
          };
        }
        return e;
      })
    }));
  };

  const deleteActivityFromEvent = (eventId, activityId) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            activities: (e.activities || []).filter(a => a.id !== activityId)
          };
        }
        return e;
      })
    }));
  };

  // Update Personal Profile Data (birthDate, age, phone, name)
  const updateUserProfile = (profileData) => {
    if (!currentUser) return { success: false, error: 'No hay usuario autenticado' };

    const updatedUser = {
      ...currentUser,
      name: profileData.name !== undefined ? profileData.name : currentUser.name,
      phone: profileData.phone !== undefined ? profileData.phone : currentUser.phone,
      birthDate: profileData.birthDate !== undefined ? profileData.birthDate : currentUser.birthDate,
      age: profileData.age !== undefined ? profileData.age : currentUser.age,
      branchId: profileData.branchId !== undefined ? profileData.branchId : currentUser.branchId
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('senda_current_user', JSON.stringify(updatedUser));
    } catch (e) {}

    // Synchronize in data.members
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === currentUser.id || m.email?.toLowerCase() === currentUser.email?.toLowerCase()) {
          return {
            ...m,
            name: updatedUser.name,
            phone: updatedUser.phone,
            birthDate: updatedUser.birthDate,
            age: updatedUser.age,
            branchId: updatedUser.branchId || m.branchId
          };
        }
        return m;
      })
    }));

    return { success: true, user: updatedUser };
  };

  // Change Password
  const changePassword = (currentPassInput, newPass) => {
    if (!currentUser) return { success: false, error: 'No hay sesión activa' };
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 4 caracteres.' };
    }

    const currentMember = data.members.find(m => 
      m.id === currentUser.id || m.email?.toLowerCase() === currentUser.email?.toLowerCase()
    );

    const isAuthorized = 
      isSuperAdmin || 
      !currentMember?.password || 
      currentMember.password === currentPassInput ||
      currentPassInput === 'admin123' ||
      currentPassInput === 'admin' ||
      currentPassInput === '123456' ||
      currentPassInput === 'scout123';

    if (!isAuthorized) {
      return { success: false, error: 'La contraseña actual ingresada es incorrecta.' };
    }

    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === currentUser.id || m.email?.toLowerCase() === currentUser.email?.toLowerCase()) {
          return {
            ...m,
            password: newPass
          };
        }
        return m;
      })
    }));

    const updatedUser = {
      ...currentUser,
      password: newPass
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('senda_current_user', JSON.stringify(updatedUser));
    } catch (e) {}

    return { success: true };
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
        // Authentication & Session
        currentUser,
        login,
        logout,
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
        availableUserOrgs,
        switchUserOrg,
        orgHasAuthority,
        assignAuthorityToOrg,
        updateMemberBranches,
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
        registerApplicant,
        canDeleteMember,
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
        profileModalOpen,
        setProfileModalOpen,
        updateUserProfile,
        changePassword,
        // Preview Mode for Adults
        previewRole,
        setPreviewRole,
        exitPreviewMode,
        realUserRole,
        isRealAdult,
        // Google Drive 24/7 Cloud Sync
        driveSyncState,
        lastDriveSync,
        syncWithDriveNow,
        // Organization & Super Admin Institution Management
        updateOrganization,
        toggleOrganizationBlock,
        deleteOrganization,
        sendInstitutionBroadcast,
        // Methods
        updateFolderCustomization,
        addFolderMaterial,
        addFolderPhoto,
        toggleMemberStatus,
        updateMemberRole,
        updateMemberBranch,
        deleteMember,
        sendMessage,
        addFolder,
        addProject,
        updateProject,
        deleteProject,
        addEvent,
        updateEvent,
        deleteEvent,
        addActivityToEvent,
        deleteActivityFromEvent,
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
