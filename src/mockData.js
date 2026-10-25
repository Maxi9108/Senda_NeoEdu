export const initialData = {
  // Platform Super Administrator
  superAdmin: {
    id: "superadmin-1",
    name: "Maximiliano Sánchez",
    email: "maxi0802@gmail.com",
    role: "superadmin",
    roleLabel: "Super Administrador (Control Total de Plataforma)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },

  // Institution Creation Requests pending approval by Super Admin
  pendingInstitutions: [
    {
      id: "req-inst-1",
      name: "Grupo Scout N° 99 Nuestra Señora de Luján",
      type: "scout",
      badge: "Distrito 4 - Zona Norte",
      description: "Comunidad scout con 15 años de trayectoria barrial, con secciones desde Castores hasta Rovers.",
      location: "San Isidro, Buenos Aires",
      officialEmail: "contacto@scout99lujan.org",
      officialPhone: "+54 9 11 4742-9988",
      applicantName: "Scouter Carlos Méndez",
      applicantDni: "28.455.120",
      applicantPhone: "+54 9 11 5566-7788",
      applicantRole: "Jefe de Grupo Postulante",
      dateRequested: "2026-10-23",
      status: "pending_approval" // 'pending_approval' | 'approved' | 'rejected'
    },
    {
      id: "req-inst-2",
      name: "Instituto Secundario Dr. René Favaloro",
      type: "edu",
      badge: "Bachillerato en Ciencias y Salud",
      description: "Escuela secundaria de gestión social con orientación en salud comunitaria y robótica.",
      location: "Córdoba Capital",
      officialEmail: "secretaria@favaloro-cba.edu.ar",
      officialPhone: "+54 351 489-1122",
      applicantName: "Prof. Mariana Castro",
      applicantDni: "26.890.334",
      applicantPhone: "+54 351 988-2233",
      applicantRole: "Directora Pedagógica",
      dateRequested: "2026-10-24",
      status: "pending_approval"
    }
  ],

  // News and Articles Feed (Noticias & Novedades)
  news: [
    {
      id: "news-1",
      orgId: "org-scout-1",
      branchId: "f-scout-all",
      branchName: "Todo el Grupo",
      title: "Gran Campamento de Verano 2027: Apertura de Inscripciones y Logística",
      summary: "Comienza la reserva de pasajes y asignación de parcelas para nuestro campamento en Valle de Calamuchita, Córdoba.",
      content: "Queridas familias, dirigentes y scouts: les informamos que ya se encuentra habilitada la descarga de fichas médicas y la reserva del transporte de larga distancia. Contaremos con seguro médico integral, guardavidas permanente en el río Santa Rosa y un cronograma cargado de aventuras y mística scout. Por favor revisar el itinerario detallado en el calendario y tachar los materiales de la mochila a medida que armen su equipaje.",
      author: "Guillermo Navarro (Jefe de Grupo)",
      date: "2026-10-24",
      category: "Campamentos",
      coverImage: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
      likes: 34
    },
    {
      id: "news-2",
      orgId: "org-scout-1",
      branchId: "f-scout-unidad",
      branchName: "Unidad Scout",
      title: "Torneo de Amarres y Construcción de Trípodes de Cocina",
      summary: "Las patrullas Halcones, Cóndores y Zorros demostraron gran destreza en amarres y pionerismo técnico.",
      content: "Durante la tarde del último sábado, los jóvenes de la Unidad Scout completaron con éxito el taller de nudos de unión y amarres diagonales. Las patrullas construyeron trípodes estables utilizando varas y sisal ecológico. Felicitaciones a todos por el orden y el espíritu de equipo.",
      author: "Scouter Mariano Gómez",
      date: "2026-10-22",
      category: "Técnica Scout",
      coverImage: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80",
      likes: 21
    },
    {
      id: "news-3",
      orgId: "org-scout-1",
      branchId: "f-scout-rover",
      branchName: "Comunidad Rover",
      title: "Impacto Comunitario: Inauguración de la Huerta Agroecológica Barrial",
      summary: "Servicio solidario de los jóvenes Rovers en conjunto con vecinos del Comedor Los Bajitos.",
      content: "Con gran orgullo compartimos el avance del proyecto 'Tierra y Vida'. Se instalaron 6 canteros elevados con sistema de riego por goteo y se plantaron más de 120 plantines de tomate, lechuga y aromáticas. ¡Siempre Listos para Servir!",
      author: "Martina Silva (Líder Rover)",
      date: "2026-10-20",
      category: "Servicio Social",
      coverImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80",
      likes: 47
    },
    {
      id: "news-4",
      orgId: "org-edu-1",
      branchId: "f-edu-all",
      branchName: "Institucional",
      title: "Muestra Anual STEAM: Robótica, Arte y Ciencias Ciudadanas",
      summary: "Los estudiantes de primaria y secundaria expusieron proyectos interdisciplinarios abiertos a las familias.",
      content: "Agradecemos la entusiasta participación de toda la comunidad en nuestra Feria STEAM 2026. Se presentaron maquetas con sensores solares, bitácoras de cuentos ilustrados y experimentos de física aplicada.",
      author: "Dra. Beatriz Domínguez (Directora General)",
      date: "2026-10-19",
      category: "Académico",
      coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
      likes: 52
    }
  ],

  // Organizations
  organizations: [
    {
      id: "org-scout-1",
      type: "scout",
      name: "Grupo Scout San Martín N° 142",
      badge: "Scout de Argentina",
      description: "Grupo tradicional con más de 30 años formando jóvenes mediante el método scout, aire libre y servicio comunitario.",
      color: "#15803d",
      icon: "Compass",
      status: "approved",
      folders: [
        { 
          id: "f-scout-all", 
          name: "General / Todo el Grupo", 
          ageRange: "Todas las edades (7 a 21 años)",
          color: "#15803d",
          bannerBg: "linear-gradient(135deg, #15803d22, #d9770615)",
          whatsappLink: "https://chat.whatsapp.com/GscoutSanMartin142General",
          isPrivateAdultOnly: false,
          reminderNotice: "¡Atención a toda la comunidad! Recuerden presentar la ficha médica actualizada y la autorización de campamento firmada.",
          materials: [
            { id: "mat-1", title: "Ficha Médica Anual 2026-2027", category: "Salud y Seguridad", size: "240 KB", date: "2026-10-15", url: "#" },
            { id: "mat-2", title: "Reglamento y Código de Convivencia Scout", category: "Institucional", size: "1.2 MB", date: "2026-09-01", url: "#" }
          ],
          privateAdultResources: [
            {
              id: "par-all-1",
              title: "Carpeta Drive: Legajos y Fichas Médicas Generales",
              type: "drive",
              url: "https://drive.google.com/drive/folders/1GeneralHealthFilesScoutSanMartin142",
              description: "Carpeta centralizada con fichas de salud de todos los integrantes, fichas de seguro y antecedentes médicos de emergencia.",
              author: "Jefatura de Grupo",
              date: "2026-10-15"
            },
            {
              id: "par-all-2",
              title: "Sitio Web: Portal de Gestión Scout Argentina (SAAC)",
              type: "web",
              url: "https://scouts.org.ar/sistema-gestion-nacional",
              description: "Acceso al sistema nacional de carga de afiliados, seguros y validación de educadores.",
              author: "Secretaría de Grupo",
              date: "2026-09-10"
            }
          ],
          gallery: [
            { id: "gal-1", title: "Apertura de Año en Plaza de Banderas", url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80", date: "2026-10-10", eventTag: "Acto Inaugural" },
            { id: "gal-2", title: "Jornada de Padres y Reparación de Carpas", url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80", date: "2026-10-18", eventTag: "Comunidad" }
          ]
        },
        { 
          id: "f-scout-manada", 
          name: "🐺 Manada de Lobatos y Lobeznas", 
          ageRange: "7 a 11 años",
          color: "#f59e0b",
          bannerBg: "linear-gradient(135deg, #f59e0b25, #ffffff)",
          whatsappLink: "https://chat.whatsapp.com/ManadaSeeonee142Padres",
          isPrivateAdultOnly: false,
          reminderNotice: "🐺 ¡Aviso para Familias de Lobatos! Recuerden armar la mochila con cantimplora, gorra y plato hondo marcado con nombre.",
          materials: [
            { id: "mat-m1", title: "Cuaderno de Caza y Cancionero de Mowgli", category: "Pedagógico", size: "850 KB", date: "2026-10-12", url: "#" },
            { id: "mat-m2", title: "Autorización Salida a la Granja Educativa", category: "Autorizaciones", size: "180 KB", date: "2026-10-20", url: "#" }
          ],
          privateAdultResources: [
            {
              id: "par-m-1",
              title: "Carpeta Drive: Planificaciones y Consejos de Roca de Manada",
              type: "drive",
              url: "https://drive.google.com/drive/folders/1ManadaSeeoneePlanning2026Drive",
              description: "Carpeta de Google Drive con los ciclos de programa de la Manada, fichas de progresión personal de cada lobato y actas de consejo de Akela y Baloo.",
              author: "Scouter Romina Varela (Akela)",
              date: "2026-10-18"
            },
            {
              id: "par-m-2",
              title: "Documento: Planilla de Seguimiento de Progresión y Cazas",
              type: "document",
              url: "https://docs.google.com/spreadsheets/d/1SeguimientoLobatosProgresionSeeonee/edit",
              description: "Matriz pedagógica de especialidades, huellas y progresión en la selva (Pata Tierna, Saltador, Rastreador y Cazador).",
              author: "Scouter Andrés Morales (Baloo)",
              date: "2026-10-14"
            },
            {
              id: "par-m-3",
              title: "Página Web: Manual Metodológico Oficial de la Rama Lobatos",
              type: "web",
              url: "https://scouts.org.ar/recursos/manual-manada-argentina",
              description: "Fondo motivacional del Libro de las Tierras Vírgenes, dinámicas de selva y juegos de acecho.",
              author: "Jefatura de Grupo",
              date: "2026-09-22"
            }
          ],
          gallery: [
            { id: "gal-m1", title: "Ronda de Lobeznas: Danza de Baloo", url: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=600&q=80", date: "2026-10-17", eventTag: "Juegos" }
          ]
        },
        { 
          id: "f-scout-unidad", 
          name: "⚜️ Unidad Scout (Patrullas)", 
          ageRange: "11 a 14 años",
          color: "#16a34a",
          bannerBg: "linear-gradient(135deg, #16a34a25, #ffffff)",
          whatsappLink: "https://chat.whatsapp.com/UnidadScout142Comunidad",
          isPrivateAdultOnly: false,
          reminderNotice: "⚜️ ¡Scouts y Familias! Tienen cargada la lista de materiales para la salida de campo. Revisen y tachen lo que ya tengan listo.",
          materials: [
            { id: "mat-u1", title: "Manual de Pionerismo, Nudos y Amarres", category: "Técnica Scout", size: "3.4 MB", date: "2026-10-05", url: "#" },
            { id: "mat-u2", title: "Planilla de Menú y Equipo de Patrulla", category: "Campamento", size: "310 KB", date: "2026-10-22", url: "#" }
          ],
          privateAdultResources: [
            {
              id: "par-u-1",
              title: "Carpeta Drive: Actas de Consejo de Patrullas y Evaluaciones Técnicas",
              type: "drive",
              url: "https://drive.google.com/drive/folders/1UnidadScoutPatrullasDriveRecords",
              description: "Actas de corte de honor de dirigentes, fichas individuales de pistas y registro confidencial de evaluaciones de campamento.",
              author: "Scouter Mariano Gómez",
              date: "2026-10-16"
            },
            {
              id: "par-u-2",
              title: "Documento: Inventario y Estado del Depósito de Carpas y Cajones",
              type: "document",
              url: "https://docs.google.com/spreadsheets/d/1InventarioUnidadCajonesHachasCarpas/edit",
              description: "Planilla de control de material técnico: hachas, machetes, palas, ollas y carpas de patrulla.",
              author: "Scouter Sofía Martínez",
              date: "2026-10-10"
            }
          ],
          gallery: [
            { id: "gal-u1", title: "Construcción de Puente Colgante con Sisal", url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80", date: "2026-10-21", eventTag: "Pionerismo" },
            { id: "gal-u2", title: "Gran Juego Nocturno de Orientación", url: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80", date: "2026-10-14", eventTag: "Naturaleza" }
          ]
        },
        { 
          id: "f-scout-caminantes", 
          name: "🌲 Comunidad Caminantes", 
          ageRange: "14 a 17 años",
          color: "#0284c7",
          bannerBg: "linear-gradient(135deg, #0284c725, #ffffff)",
          whatsappLink: "https://chat.whatsapp.com/Caminantes142Oficial",
          isPrivateAdultOnly: false,
          reminderNotice: "🌲 ¡Atención Caminantes! No olvidar llevar aislante térmico, botiquín personal y linterna frontal con pilas nuevas.",
          materials: [
            { id: "mat-c1", title: "Guía de Primeros Auxilios y RCP en Montaña", category: "Seguridad", size: "1.8 MB", date: "2026-10-11", url: "#" }
          ],
          privateAdultResources: [
            {
              id: "par-c-1",
              title: "Carpeta Drive: Hojas de Ruta, Cartografía y Senderos GPS",
              type: "drive",
              url: "https://drive.google.com/drive/folders/1CaminantesCartografiaGPSTreks",
              description: "Archivos KML/GPX de rutas de montaña, contactos de Defensa Civil y protocolos de evacuación médica.",
              author: "Scouter Lucas Herrera",
              date: "2026-10-12"
            }
          ],
          gallery: [
            { id: "gal-c1", title: "Caminata de Ascenso al Cerro La Ventana", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", date: "2026-10-02", eventTag: "Trekking" }
          ]
        },
        { 
          id: "f-scout-rover", 
          name: "⛵ Comunidad Rover 'Servir'", 
          ageRange: "17 a 21 años",
          color: "#dc2626",
          bannerBg: "linear-gradient(135deg, #dc262625, #ffffff)",
          whatsappLink: "https://chat.whatsapp.com/RoverComunidad142",
          isPrivateAdultOnly: false,
          reminderNotice: "⛵ ¡Rovers! Confirmar asistencia para la jornada comunitaria de pintura y llevar herramientas de trabajo.",
          materials: [
            { id: "mat-r1", title: "Guía Metodológica para Proyectos Comunitarios", category: "Servicio Social", size: "750 KB", date: "2026-09-28", url: "#" }
          ],
          privateAdultResources: [
            {
              id: "par-r-1",
              title: "Carpeta Drive: Proyectos Solidarios y Presupuestos de Servicio",
              type: "drive",
              url: "https://drive.google.com/drive/folders/1RoversCommunityServiceBudgetAndPlans",
              description: "Documentación de convenios con comedores barriales, cotizaciones de insumos y rendición de cuentas.",
              author: "Martina Silva (Líder Rover)",
              date: "2026-10-19"
            }
          ],
          gallery: [
            { id: "gal-r1", title: "Construcción de Huerta en Comedor Barrial", url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=600&q=80", date: "2026-10-19", eventTag: "Servicio" }
          ]
        },
        { 
          id: "f-scout-jefatura", 
          name: "🎖️ Consejo de Grupo & Dirigentes", 
          ageRange: "Adultos Educadores (18+ años)",
          color: "#7c3aed",
          bannerBg: "linear-gradient(135deg, #7c3aed25, #0f172a15)",
          whatsappLink: "https://chat.whatsapp.com/ConsejoDirigentes142Privado",
          isPrivateAdultOnly: true, // SUBGRUPO PRIVADO DE ADULTOS
          reminderNotice: "🎖️ Dirigentes: Tener preparadas las carpetas de ciclo de programa y balance de víveres para la reunión.",
          materials: [
            { id: "mat-j1", title: "Acta de Consejo y Balance Económico Trimestral", category: "Confidencial", size: "920 KB", date: "2026-10-20", url: "#" },
            { id: "mat-j2", title: "Pólizas de Seguros de Accidentes Personales", category: "Legal & Seguros", size: "2.1 MB", date: "2026-10-01", url: "#" }
          ],
          privateAdultResources: [
            {
              id: "par-j-1",
              title: "Carpeta Drive: Legajos de Educadores, Certificados de Antecedentes y Pólizas",
              type: "drive",
              url: "https://drive.google.com/drive/folders/1ConsejoDirigentesLegalAndInsuranceDrive",
              description: "Documentación reservada de máxima confidencialidad: certificados de reincidencia, títulos habilitantes y pólizas bancarias.",
              author: "Guillermo Navarro (Jefe de Grupo)",
              date: "2026-10-20"
            },
            {
              id: "par-j-2",
              title: "Documento: Libro de Actas Oficiales del Consejo de Grupo",
              type: "document",
              url: "https://docs.google.com/document/d/1LibroActasConsejoGrupoSanMartin142/edit",
              description: "Actas rubricadas de asambleas ordinarias y extraordinarias.",
              author: "Guillermo Navarro",
              date: "2026-10-05"
            }
          ],
          gallery: [
            { id: "gal-j1", title: "Capacitación Anual de Liderazgo y Protección de Menores", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80", date: "2026-09-15", eventTag: "Formación de Adultos" }
          ]
        }
      ]
    },
    {
      id: "org-edu-1",
      type: "edu",
      name: "Colegio Integral Los Robles",
      badge: "Institución Educativa",
      description: "Comunidad pedagógica enfocada en el aprendizaje basado en proyectos, la convivencia y la ciencia ciudadana.",
      color: "#0284c7",
      icon: "GraduationCap",
      status: "approved",
      folders: [
        { 
          id: "f-edu-all", 
          name: "Institucional General", 
          ageRange: "Comunidad Educativa Completa",
          color: "#0284c7",
          bannerBg: "linear-gradient(135deg, #0284c725, #ffffff)",
          whatsappLink: "https://chat.whatsapp.com/LosRoblesComunidadGeneral",
          isPrivateAdultOnly: false,
          reminderNotice: "📚 Recordatorio: Presentar cuadernos de comunicados firmados y autorización para salidas pedagógicas.",
          materials: [
            { id: "mat-e1", title: "Reglamento Interno y Convivencia Escolar 2026", category: "Institucional", size: "1.4 MB", date: "2026-03-01", url: "#" }
          ],
          gallery: [
            { id: "gal-e1", title: "Feria de Ciencias y Arte 2026", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80", date: "2026-10-18", eventTag: "Feria de Ciencias" }
          ]
        },
        { 
          id: "f-edu-primaria", 
          name: "📚 Nivel Primario (1° a 6° Grado)", 
          ageRange: "6 a 12 años",
          color: "#16a34a",
          bannerBg: "linear-gradient(135deg, #16a34a25, #ffffff)",
          whatsappLink: "https://chat.whatsapp.com/PrimariaLosRoblesPadres",
          isPrivateAdultOnly: false,
          reminderNotice: "🎒 Familias de Primaria: Recuerden enviar la cartuchera completa, tijera de punta roma y la merienda saludable.",
          materials: [
            { id: "mat-ep1", title: "Guía de Lecturas Sugeridas y Plan Lector", category: "Lengua y Literatura", size: "620 KB", date: "2026-09-10", url: "#" }
          ],
          gallery: [
            { id: "gal-ep1", title: "Muestra de Proyectos del Sistema Solar", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80", date: "2026-10-12", eventTag: "Primaria" }
          ]
        },
        { 
          id: "f-edu-secundaria", 
          name: "🔬 Nivel Secundario y Bachillerato", 
          ageRange: "12 a 18 años",
          color: "#7c3aed",
          bannerBg: "linear-gradient(135deg, #7c3aed25, #ffffff)",
          whatsappLink: "https://chat.whatsapp.com/SecundariaLosRoblesAvisos",
          isPrivateAdultOnly: false,
          reminderNotice: "🔬 Estudiantes: Traer guardapolvo blanco para el laboratorio de química y calculadora científica.",
          materials: [
            { id: "mat-es1", title: "Rúbricas de Evaluación de Monografía", category: "Evaluación", size: "480 KB", date: "2026-10-05", url: "#" }
          ],
          gallery: [
            { id: "gal-es1", title: "Prácticas en Laboratorio de Química", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80", date: "2026-10-15", eventTag: "Laboratorio" }
          ]
        },
        { 
          id: "f-edu-directivo", 
          name: "🏛️ Sala de Profesores & Equipo Directivo", 
          ageRange: "Cuerpo Docente y Directivos",
          color: "#b91c1c",
          bannerBg: "linear-gradient(135deg, #b91c1c25, #0f172a15)",
          whatsappLink: "https://chat.whatsapp.com/DocentesLosRoblesPrivado",
          isPrivateAdultOnly: true, // SUBGRUPO PRIVADO DE ADULTOS
          reminderNotice: "🏛️ Docentes: Fecha límite para cargar calificaciones trimestrales en el sistema institucional.",
          materials: [
            { id: "mat-ed1", title: "Actas de Reuniones Plenarias", category: "Confidencial", size: "1.1 MB", date: "2026-10-15", url: "#" }
          ],
          gallery: [
            { id: "gal-ed1", title: "Jornada de Capacitación Docente", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80", date: "2026-09-29", eventTag: "Capacitación Docente" }
          ]
        }
      ]
    }
  ],

  // Institutional Announcements
  announcements: [
    {
      id: "ann-1",
      orgId: "org-scout-1",
      title: "📢 AVISO DE JEFATURA: Cierre de Inscripción y Pago de Campamento",
      message: "Se recuerda a todas las familias que el plazo final para la entrega de fichas médicas autenticadas y reserva de plazas en los micros de larga distancia vence el próximo viernes 6 de noviembre.",
      author: "Guillermo Navarro (Jefe de Grupo)",
      date: "2026-10-24",
      audience: "all",
      isImportant: true,
      active: true
    },
    {
      id: "ann-2",
      orgId: "org-scout-1",
      title: "🔒 COMUNICADO INTERNO PARA ADULTOS: Asamblea Anual de Padres y Balance",
      message: "Estimados adultos responsables y dirigentes: el sábado 14 a las 18:30 hs se celebrará la Asamblea Extraordinaria para la aprobación de memoria y balance 2026.",
      author: "Consejo de Grupo",
      date: "2026-10-22",
      audience: "adults_only",
      isImportant: false,
      active: true
    }
  ],

  // Interactive Polls
  polls: [
    {
      id: "poll-1",
      orgId: "org-scout-1",
      title: "Encuesta de Adultos: Fecha para el Campamento de Padres y Familias 2027",
      description: "Queremos definir democráticamente con todas las familias el fin de semana más conveniente para compartir el acampe de integración familiar.",
      audience: "adults_only",
      author: "Jefatura de Grupo",
      status: "active",
      options: [
        { id: "p1-opt-1", text: "Opción A: Primer fin de semana de Marzo (6 y 7 de Marzo)", votes: 19 },
        { id: "p1-opt-2", text: "Opción B: Fin de semana largo de Semana Santa", votes: 28 },
        { id: "p1-opt-3", text: "Opción C: Mediados de Abril (17 y 18 de Abril)", votes: 11 }
      ],
      userVotes: {}
    },
    {
      id: "poll-2",
      orgId: "org-scout-1",
      title: "Votación Abierta (Todos los Miembros): Elección de la Canción y Lema del Grupo 2027",
      description: "¡Participan todos los lobatos, scouts, caminantes, rovers y educadores para elegir el lema que bordaremos en la insignia anual!",
      audience: "all",
      author: "Consejo Juvenil",
      status: "active",
      options: [
        { id: "p2-opt-1", text: "'Caminando Juntos Hacia Nuevas Cumbres' (Pionerismo y Montaña)", votes: 42 },
        { id: "p2-opt-2", text: "'Huellas de Servicio en Nuestra Comunidad' (Impacto Social)", votes: 56 },
        { id: "p2-opt-3", text: "'Guardianes de la Naturaleza y el Fuego' (Cuidado Ambiental)", votes: 38 }
      ],
      userVotes: {}
    }
  ],

  // Registered Members
  members: [
    {
      id: "mem-adv-1",
      orgId: "org-scout-1",
      name: "Scouter Hernán Valenzuela",
      email: "hernan.valenzuela@scout-nacional.org",
      phone: "+54 9 11 9988-7711",
      role: "advanced_admin",
      roleLabel: "Administrador Avanzado (Designado por Maximiliano Sánchez)",
      branchId: "f-scout-jefatura",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      showPublicPhone: true,
      showPublicEmail: true
    },
    {
      id: "mem-1",
      orgId: "org-scout-1",
      name: "Guillermo Navarro",
      email: "jefatura@scout142.org",
      phone: "+54 9 11 4589-2231",
      birthDate: "1982-04-12",
      age: 44,
      role: "admin",
      roleLabel: "Jefe de Grupo (Responsable Institucional)",
      branchId: "f-scout-jefatura",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      showPublicPhone: true,
      showPublicEmail: true
    },
    {
      id: "mem-2",
      orgId: "org-scout-1",
      name: "Scouter Mariano Gómez",
      email: "unidad@scout142.org",
      phone: "+54 9 11 7789-4455",
      birthDate: "1991-08-20",
      age: 35,
      role: "educator",
      roleLabel: "Jefe de Unidad Scout (Educador)",
      branchId: "f-scout-unidad",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      showPublicPhone: true,
      showPublicEmail: true
    },
    {
      id: "mem-3",
      orgId: "org-scout-1",
      name: "Akela Sofia Peralta",
      email: "manada@scout142.org",
      phone: "+54 9 11 6578-1122",
      birthDate: "1995-11-03",
      age: 31,
      role: "educator",
      roleLabel: "Jefa de Manada (Educadora)",
      branchId: "f-scout-manada",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      showPublicPhone: true,
      showPublicEmail: true
    },
    {
      id: "mem-4",
      orgId: "org-scout-1",
      name: "Patricia Herrera",
      email: "patricia.herrera@email.com",
      phone: "+54 9 11 8844-3321",
      birthDate: "1985-02-18",
      age: 41,
      role: "parent",
      roleLabel: "Familia / Madre de Mateo (Unidad)",
      branchId: "f-scout-unidad",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      showPublicPhone: false,
      showPublicEmail: false
    },
    {
      id: "mem-5",
      orgId: "org-scout-1",
      name: "Mateo Rinaldi",
      email: "mateo.scout@email.com",
      phone: "+54 9 11 1122-3344",
      birthDate: "2013-06-15",
      age: 13,
      role: "student",
      roleLabel: "Scout Protagonista (Patrulla Halcones)",
      branchId: "f-scout-unidad",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      showPublicPhone: false,
      showPublicEmail: false
    },
    {
      id: "mem-6",
      orgId: "org-scout-1",
      name: "Esteban Quiroga",
      email: "esteban.q@test.com",
      phone: "+54 9 11 2233-9988",
      birthDate: "1984-09-10",
      age: 42,
      role: "parent",
      roleLabel: "Padre Solicitante",
      branchId: "f-scout-manada",
      status: "pending",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      showPublicPhone: false,
      showPublicEmail: false,
      presentation: {
        aboutMe: "Soy papá de Lucas Quiroga (7 años). Nos mudamos recientemente al barrio y buscamos un espacio con valores y actividades al aire libre para que haga amigos.",
        wishes: "Deseo colaborar en la comisión de padres, ayudar en la logística de campamento y aprender sobre la mística scout junto a mi hijo.",
        interests: "Carpintería básica, primeros auxilios, cocina de campaña.",
        specialNotes: "Lucas es alérgico leve a las picaduras de abeja (lleva antihistamínico en la mochila).",
        registeredAt: "24/10/2026"
      }
    },
    {
      id: "mem-7",
      orgId: "org-scout-1",
      name: "Agustina Beltrán",
      email: "agustina.b@test.com",
      phone: "+54 9 11 3344-5566",
      birthDate: "2011-03-22",
      age: 15,
      role: "student",
      roleLabel: "Protagonista Aspirante",
      branchId: "f-scout-caminantes",
      status: "pending",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      showPublicPhone: false,
      showPublicEmail: false,
      presentation: {
        aboutMe: "Tengo 15 años y voy a 3er año. Me encanta la naturaleza, la fotografía y el senderismo. Quiero sumarme a la Comunidad Caminantes.",
        wishes: "Deseo participar del campamento volante en Los Gigantes, aprender técnicas de orientación y proponer un proyecto de huerta comunitaria con el equipo.",
        interests: "Trekking, edición de video para redes del grupo, cocina y astronomía.",
        specialNotes: "Dieta vegetariana.",
        registeredAt: "25/10/2026"
      }
    }
  ],

  // Calendar Events
  calendarEvents: [
    {
      id: "ev-1",
      orgId: "org-scout-1",
      folderId: "f-scout-all",
      branchName: "Todo el Grupo",
      badgeColor: "#15803d",
      isGroupWide: true,
      title: "Reunión de Grupo: Gran Juego de Primavera",
      date: "2026-10-31",
      startTime: "14:00",
      endTime: "18:00",
      type: "Evento General de Grupo",
      location: "Predio Central Scout",
      notes: "Actividad unificada con todas las ramas (Lobatos, Unidad, Caminantes y Rover). Familias invitadas a las 17:30 hs.",
      adultPrivateLink: "https://drive.google.com/drive/folders/1PlanificacionPrimavera2026_Adultos",
      activities: [
        {
          id: "act-ev1-1",
          day: "Sábado 31 de Octubre",
          time: "14:15 - 15:30",
          title: "Gran Juego Interramas: El Enigma de los Cuatro Vientos",
          objective: "Fomentar la cooperación de patrullas mixtas resolviendo pistas con brújula y claves morse.",
          responsible: "Scouter Mariano Gómez",
          materials: "Banderines, silbato, tarjetas con pistas encriptadas, tiza",
          adultGuideUrl: "https://docs.google.com/document/d/1GuiaJuegoCuatroVientos_FichaTecnica/edit"
        },
        {
          id: "act-ev1-2",
          day: "Sábado 31 de Octubre",
          time: "15:45 - 17:00",
          title: "Talleres Simultáneos de Pionerismo & Primeros Auxilios",
          objective: "Construcción de trípodes de cocina y práctica de vendajes compresivos.",
          responsible: "Akela Sofia Peralta & Guillermo Navarro",
          materials: "Coligues de 2m, bobinas de hilo sisal, botiquín de demostración",
          adultGuideUrl: "https://docs.google.com/document/d/1FichaTecnicaAmarresYVendajes2026/edit"
        },
        {
          id: "act-ev1-3",
          day: "Sábado 31 de Octubre",
          time: "17:15 - 18:00",
          title: "Fogón de Merienda y Cierre con Familias",
          objective: "Compartir vivencias, canciones tradicionales y entrega de insignias de progresión.",
          responsible: "Jefatura de Grupo",
          materials: "Guitarra, cancionero scout, diplomas de bienvenida",
          adultGuideUrl: ""
        }
      ],
      requiredMaterials: [
        { id: "req-1", name: "Uniforme Scout completo con pañuelo de grupo", checked: true },
        { id: "req-2", name: "Cantimplora con 1 litro de agua fresca", checked: true },
        { id: "req-3", name: "Gorra o sombrero para sol", checked: false },
        { id: "req-4", name: "Cuaderno de notas y lapicera", checked: false },
        { id: "req-5", name: "Merienda saludable para compartir", checked: false }
      ]
    },
    {
      id: "ev-2",
      orgId: "org-scout-1",
      folderId: "f-scout-unidad",
      branchName: "Unidad Scout",
      badgeColor: "#16a34a",
      isGroupWide: false,
      title: "Salida de Campo: Práctica de Cartografía y Brújula",
      date: "2026-11-07",
      startTime: "09:00",
      endTime: "17:00",
      type: "Salida al Aire Libre",
      location: "Parque Reserva Natural Norte",
      notes: "Específica para la Unidad Scout. Llevar libreta topográfica y almuerzo frío.",
      requiredMaterials: [
        { id: "req-u1", name: "Brújula tipo Silva o cartográfica", checked: true },
        { id: "req-u2", name: "Regla milimetrada y lápiz 2B", checked: false },
        { id: "req-u3", name: "Vianda de almuerzo fría (sándwich / fruta)", checked: false },
        { id: "req-u4", name: "Botiquín personal de patrulla", checked: false },
        { id: "req-u5", name: "Repelente de mosquitos y protector solar", checked: false }
      ]
    },
    {
      id: "ev-manada-1",
      orgId: "org-scout-1",
      folderId: "f-scout-manada",
      branchName: "Manada de Lobatos",
      badgeColor: "#f59e0b",
      isGroupWide: false,
      title: "Cacería de Otoño: Gran Juego en el Parque Botánico",
      date: "2026-11-14",
      startTime: "10:00",
      endTime: "16:00",
      type: "Salida de Rama",
      location: "Jardín Botánico Municipal",
      notes: "Salida con Akela y Viejos Lobos. Descubrimiento de huellas y hojas.",
      requiredMaterials: [
        { id: "req-m1", name: "Cuaderno de caza de Mowgli", checked: true },
        { id: "req-m2", name: "Lupa de mano para observar hojas", checked: false },
        { id: "req-m3", name: "Plato plástico y vaso irrompible marcado", checked: false },
        { id: "req-m4", name: "Muda de medias de repuesto", checked: false }
      ]
    },
    {
      id: "ev-caminantes-1",
      orgId: "org-scout-1",
      folderId: "f-scout-caminantes",
      branchName: "Comunidad Caminantes",
      badgeColor: "#0284c7",
      isGroupWide: false,
      title: "Travesía y Campamento Volante de Montaña",
      date: "2026-11-21",
      startTime: "08:00",
      endTime: "18:00",
      type: "Campamento de Rama",
      location: "Sierras Chicas - Base Los Gigantes",
      notes: "Ascenso con mochilas de montaña y armado de vivac.",
      adultPrivateLink: "https://drive.google.com/drive/folders/1CampamentoVolanteGigantes_AdultosPrivado",
      activities: [
        {
          id: "act-cam-1",
          day: "Día 1 - Sábado 21",
          time: "08:30 - 12:00",
          title: "Ascenso Técnico por Quebrada del Batán",
          objective: "Caminata de aclimatación con mochila técnica y descansos pautados.",
          responsible: "Guillermo Navarro",
          materials: "Bastones de trekking, botiquín de montaña, radio VHF",
          adultGuideUrl: "https://docs.google.com/document/d/1RutaAscensoQuebradaBatanProtocolo/edit"
        },
        {
          id: "act-cam-2",
          day: "Día 1 - Sábado 21",
          time: "14:30 - 17:30",
          title: "Armado de Vivac y Evaluación Meteorológica",
          objective: "Instalación de refugios de emergencia con toldos impermeables.",
          responsible: "Mariano Gómez",
          materials: "Polietileno de 200 micrones, vientos de paracord, estacas de aluminio",
          adultGuideUrl: "https://docs.google.com/document/d/1ManualVivacAltaMontana/edit"
        },
        {
          id: "act-cam-3",
          day: "Día 2 - Domingo 22",
          time: "09:00 - 12:30",
          title: "Práctica de Rescate y Primeros Auxilios en Terreno Agreste",
          objective: "Inmovilización y camilla de circunstancias con cuerdas y varas.",
          responsible: "Valeria Montero",
          materials: "Férulas SAM, manta térmica aluminizada, vendajes elásticos",
          adultGuideUrl: "https://docs.google.com/document/d/1SimulacroRescateMontanaEducadores/edit"
        }
      ],
      campLogistics: {
        startDate: "2026-11-21",
        endDate: "2026-11-22",
        meetingPoint: "Sede Scout Central (07:30 hs) - Carga de equipo pesado",
        outboundTrip: "Partida 08:00 hs en combi contratada. Parada en Villa Serrana 10:30 hs. Inicio de caminata 11:30 hs.",
        campsite: "Campamento Base 'Los Aromos' - Valle de los Gigantes",
        returnTrip: "Descenso 13:00 hs. Partida de combi 15:30 hs.",
        arrivalAndDismissal: "Llegada a Sede Scout: 18:00 hs. Desconcentración y retiro por familias: 18:30 hs."
      },
      requiredMaterials: [
        { id: "req-c1", name: "Mochila de trekking (60 litros o similar)", checked: true },
        { id: "req-c2", name: "Bolsa de dormir (confort 0°C a 5°C)", checked: true },
        { id: "req-c3", name: "Aislante térmico", checked: false },
        { id: "req-c4", name: "Calzado de trekking previamente ablandado", checked: false },
        { id: "req-c5", name: "Linterna frontal con pilas nuevas", checked: false },
        { id: "req-c6", name: "Campera impermeable o cortavientos", checked: false }
      ]
    },
    {
      id: "ev-rover-1",
      orgId: "org-scout-1",
      folderId: "f-scout-rover",
      branchName: "Comunidad Rover",
      badgeColor: "#dc2626",
      isGroupWide: false,
      title: "Jornada Solidaria: Construcción de Huerta Comunitaria",
      date: "2026-11-28",
      startTime: "09:30",
      endTime: "16:30",
      type: "Servicio Comunitario",
      location: "Comedor Los Bajitos, Barrio Obrero",
      notes: "Instalación de riego por goteo y siembra de plantines de huerta orgánica.",
      requiredMaterials: [
        { id: "req-r1", name: "Guantes de trabajo de descarne", checked: true },
        { id: "req-r2", name: "Pala de punta o rastrillo (si tienen)", checked: false },
        { id: "req-r3", name: "Ropa resistente para trabajo de tierra", checked: false }
      ]
    },
    {
      id: "ev-4",
      orgId: "org-scout-1",
      folderId: "f-scout-all",
      branchName: "Todo el Grupo",
      badgeColor: "#15803d",
      isGroupWide: true,
      title: "Gran Campamento Anual de Verano 'Sierras Vivas'",
      date: "2027-01-08",
      startTime: "06:30",
      endTime: "20:00",
      type: "Campamento Anual General",
      location: "Valle de Calamuchita, Córdoba",
      notes: "Duración de 7 días. Toda la institución participa con sectores de acampe diferenciados por rama.",
      campLogistics: {
        startDate: "2027-01-08",
        endDate: "2027-01-14",
        meetingPoint: "Sede Scout Central (Av. Belgrano 1240) - 06:30 hs Concentración de patrullas, verificación de mochilas y carga en bodega.",
        outboundTrip: "Partida de ómnibus de larga distancia: 07:15 hs puntuales. Parada técnica para almuerzo vianda: 12:00 hs en Marcos Juárez. Llegada al predio: 15:30 hs.",
        campsite: "Predio 'Sierras Vivas', Río Santa Rosa, Valle de Calamuchita, Córdoba (Área con guardavidas y enfermería 24hs).",
        returnTrip: "Desarme general y limpieza de parcelas: 10:00 hs. Almuerzo de despedida 12:00 hs. Partida de regreso: 13:30 hs.",
        arrivalAndDismissal: "Llegada estimada a la Sede Scout: 19:30 hs. Desconcentración, entrega de equipaje y retiro por parte de los padres: 20:00 hs."
      },
      requiredMaterials: [
        { id: "req-camp-1", name: "Mochila de viaje grande debidamente rotulada con nombre", checked: true },
        { id: "req-camp-2", name: "Bolsa de dormir adecuada y aislante térmico", checked: true },
        { id: "req-camp-3", name: "Ficha médica original firmada por médico matriculado", checked: true },
        { id: "req-camp-4", name: "Muda completa para 7 días en bolsas impermeables identificadas", checked: false },
        { id: "req-camp-5", name: "Juego de cubiertos de plástico, plato hondo, jarro y servilleta en bolsa de tela", checked: false },
        { id: "req-camp-6", name: "Elementos de higiene: toalla de secado rápido, jabón con jabonera, cepillo y dentífrico", checked: false },
        { id: "req-camp-7", name: "Protector solar FPS 50+ y repelente para insectos", checked: false },
        { id: "req-camp-8", name: "Linterna con pilas de repuesto y silbato de seguridad", checked: false },
        { id: "req-camp-9", name: "Zapatillas deportivas cómodas + par de calzado de repuesto", checked: false }
      ]
    }
  ],

  projects: [
    {
      id: "proj-1",
      orgId: "org-scout-1",
      folderId: "f-scout-unidad",
      title: "Campamento Anual de Verano 'Sierras Vivas'",
      description: "Planificación integral de 7 días: logística de acampe, menú de campamento, programa educativo de pionerismo y seguridad en montaña.",
      status: "En Curso",
      progress: 68,
      startDate: "2026-11-01",
      endDate: "2027-01-15",
      leadName: "Scouter Mariano Gómez",
      budget: "$420.000",
      tags: ["Campamento", "Pionerismo", "Supervivencia"],
      milestones: [
        { id: "m1", title: "Reserva del predio y habilitación municipal", done: true },
        { id: "m2", title: "Ficha médica y autorizaciones de padres", done: true },
        { id: "m3", title: "Cálculo de menú y compra de víveres secos", done: false },
        { id: "m4", title: "Revisión técnica de carpas y herramientas", done: false }
      ]
    }
  ],

  dailyPrograms: [
    {
      id: "prog-scout-sabado",
      orgId: "org-scout-1",
      folderId: "f-scout-unidad",
      date: "2026-10-31",
      dayName: "Sábado de Actividad Ordinaria",
      theme: "Pionerismo, Nudos y Trabajo en Equipo",
      location: "Campo de Deportes / Sede Scout Central",
      responsible: "Mariano Gómez & Clara Ríos",
      weatherAdvice: "Día soleado (24°C). Requerir protector solar y cantimplora cargada.",
      blocks: [
        {
          id: "b1",
          time: "14:00 - 14:20",
          title: "Izamiento de Pabellón y Mística de Apertura",
          objective: "Afianzar el sentido de pertenencia y valores de la Ley Scout.",
          responsible: "Consejo de Guías de Patrulla",
          materials: "Bandera nacional, bandera de grupo, libro de oraciones.",
          location: "Plaza de Banderas"
        },
        {
          id: "b2",
          time: "14:20 - 15:00",
          title: "Juego Rompehielos: 'La Red del Rescate'",
          objective: "Activación física, coordinación y espíritu alegre en patrullas.",
          responsible: "Dirigente Lucas Fontana",
          materials: "4 cuerdas de 10m, 12 conos plásticos, silbato.",
          location: "Cancha exterior"
        },
        {
          id: "b3",
          time: "15:00 - 16:30",
          title: "Taller Técnico: Amarres y Construcción de Trípode de Cocina",
          objective: "Dominar nudos cuadrado y diagonal para estructuras de campamento.",
          responsible: "Mariano Gómez",
          materials: "Coligues/maderas de 2m, bobinas de hilo sisal, navajas seguras.",
          location: "Rincón de Patrullas"
        },
        {
          id: "b4",
          time: "16:30 - 17:15",
          title: "Merienda de Patrulla y Rincón de Reflexión",
          objective: "Compartir alimentos y planificar el menú del próximo campamento.",
          responsible: "Guías de Patrulla",
          materials: "Cantimploras, galletitas saludables, libreta de patrulla.",
          location: "Sombra de los Robles"
        },
        {
          id: "b5",
          time: "17:15 - 18:00",
          title: "Gran Juego Final y Ceremonia de Cierre",
          objective: "Evaluación del día, entrega de insignias de progresión y arriamiento.",
          responsible: "Jefatura de Grupo",
          materials: "Insignias de especialidades, estandartes.",
          location: "Plaza de Banderas"
        }
      ]
    }
  ],

  organigram: [
    {
      id: "node-1",
      orgId: "org-scout-1",
      parentId: null,
      name: "Guillermo Navarro",
      role: "Jefe de Grupo Scout",
      badge: "Insignia de Madera",
      department: "Consejo de Grupo",
      email: "jefatura@scout142.org",
      phone: "+54 9 11 4589-2231",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      bio: "22 años en el movimiento. Responsable institucional y legal ante Scouts de Argentina."
    },
    {
      id: "node-2",
      orgId: "org-scout-1",
      parentId: "node-1",
      name: "Valeria Montero",
      role: "Subjefa de Grupo & Tesorería",
      badge: "Formadora Scout",
      department: "Administración",
      email: "administracion@scout142.org",
      phone: "+54 9 11 3211-9844",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      bio: "Coordinación de logística, seguros y vínculo con familias y comunidad."
    },
    {
      id: "node-3",
      orgId: "org-scout-1",
      parentId: "node-1",
      name: "Akela Sofia Peralta",
      role: "Jefa de Manada (Lobatos y Lobeznas)",
      badge: "Rama Menor",
      department: "Manada Seeonee",
      email: "manada@scout142.org",
      phone: "+54 9 11 6578-1122",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      bio: "Especialista en pedagogía del juego, mística de Kipling y primeros pasos scout."
    },
    {
      id: "node-4",
      orgId: "org-scout-1",
      parentId: "node-1",
      name: "Scouter Mariano Gómez",
      role: "Jefe de Unidad Scout",
      badge: "Insignia de Madera",
      department: "Unidad Scout",
      email: "unidad@scout142.org",
      phone: "+54 9 11 7789-4455",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      bio: "Guía de campamentos, pionerismo, sistema de patrullas y vida al aire libre."
    }
  ],

  messages: [
    {
      id: "msg-1",
      orgId: "org-scout-1",
      senderName: "Patricia Herrera",
      senderRole: "parent",
      branchName: "Unidad Scout",
      timestamp: "Hoy 11:20",
      content: "¡Hola Mariano! Ya envié la ficha médica de Mateo firmada por el pediatra. ¿Hace falta llevar fotocopia de la vacuna antitetánica?"
    },
    {
      id: "msg-2",
      orgId: "org-scout-1",
      senderName: "Scouter Mariano Gómez",
      senderRole: "educator",
      branchName: "Unidad Scout",
      timestamp: "Hoy 11:45",
      content: "¡Hola Patricia! Sí, con tener la foto o copia pegada en la ficha médica es suficiente. ¡Muchas gracias por avisar!"
    }
  ],

  notifications: [
    {
      id: "notif-1",
      orgId: "org-scout-1",
      branchId: "f-scout-all",
      title: "Confirmación de Seguro para Campamento de Verano",
      message: "Se completó la verificación de pólizas para el campamento 'Sierras Vivas'. Ya pueden enviar las fichas médicas finales firmadas.",
      date: "2026-10-24 10:30",
      author: "Jefatura de Grupo",
      isImportant: true
    }
  ],

  // Red Interinstitucional: Espacio Compartido para Responsables y Autoridades
  interInstitutionalHub: {
    sharedResources: [
      {
        id: "sh-res-1",
        title: "Protocolo Federal de Pólizas y Seguros de Campamento 2026/2027",
        category: "Seguridad y Legal",
        institutionName: "Grupo Scout San Martín N° 142",
        author: "Guillermo Navarro (Jefe de Grupo)",
        type: "document",
        url: "https://docs.google.com/document/d/1ProtocoloFederalSegurosScout2026/edit",
        description: "Modelo unificado de póliza de responsabilidad civil, cobertura para transporte de media y larga distancia, y actas de deslinde validadas por asesores legales.",
        downloads: 87,
        date: "2026-10-20"
      },
      {
        id: "sh-res-2",
        title: "Carpeta Drive: Guías de Campismo Sostenible y Basura Cero",
        category: "Medio Ambiente & Técnicas",
        institutionName: "Colegio Integral Los Robles",
        author: "Dra. Beatriz Domínguez",
        type: "drive",
        url: "https://drive.google.com/drive/folders/1CampismoSostenibleBasuraCero2026",
        description: "Materiales didácticos, fichas de separación de residuos en vivac, recetas de cocina solar y tratamiento de aguas grises en campamentos agrestes.",
        downloads: 142,
        date: "2026-10-18"
      },
      {
        id: "sh-res-3",
        title: "Matriz Excel de Presupuestos Compartidos y Costo por Acampante",
        category: "Finanzas & Administración",
        institutionName: "Grupo Scout San Martín N° 142",
        author: "Guillermo Navarro",
        type: "document",
        url: "https://docs.google.com/spreadsheets/d/1MatrizPresupuestoCostoAcampante2026/edit",
        description: "Planilla automatizada para calcular menúes por ración, combustible, botiquines y amortización de carpas comunitarias.",
        downloads: 65,
        date: "2026-10-12"
      },
      {
        id: "sh-res-4",
        title: "Convenio Marco de Transporte Interurbano para Salidas Juveniles",
        category: "Logística y Transporte",
        institutionName: "Red Nacional de Responsables",
        author: "Maximiliano Sánchez (Super Admin)",
        type: "web",
        url: "https://sendaneoedu.org/convenios-transporte-2026",
        description: "Tarifas preferenciales acordadas con empresas de buses de larga distancia para contingentes juveniles con descuento institucional.",
        downloads: 210,
        date: "2026-10-05"
      }
    ],
    statisticsComparison: [
      {
        orgId: "org-scout-1",
        name: "Grupo Scout San Martín N° 142",
        type: "scout",
        totalEnrolled: 185,
        activeEducators: 22,
        ratioYouthPerEducator: "8.4",
        retentionRate: "94%",
        campAttendance: "96%",
        communityProjects: 6
      },
      {
        orgId: "org-edu-1",
        name: "Colegio Integral Los Robles",
        type: "edu",
        totalEnrolled: 420,
        activeEducators: 38,
        ratioYouthPerEducator: "11.0",
        retentionRate: "98%",
        campAttendance: "89%",
        communityProjects: 11
      }
    ],
    coordinationPosts: [
      {
        id: "post-1",
        author: "Guillermo Navarro",
        authorRole: "Responsable Institucional (Grupo Scout San Martín N° 142)",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        date: "2026-10-24 12:15",
        content: "Estimados directivos y jefes de grupo: estamos armando el contingente para la salida a Córdoba en enero. Si alguna institución vecina desea coordinar la contratación de micros en conjunto para abaratar costos de traslado, por favor contáctennos.",
        repliesCount: 4
      },
      {
        id: "post-2",
        author: "Dra. Beatriz Domínguez",
        authorRole: "Directora General (Colegio Integral Los Robles)",
        authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        date: "2026-10-23 16:40",
        content: "Compartimos en la carpeta el modelo de ficha médica digital que implementamos este año. Nos redujo un 70% los tiempos administrativos en secretaría y los padres lo completan desde el celular.",
        repliesCount: 7
      }
    ]
  }
};
