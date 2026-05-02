
export const DB_SCHEMA = {

  departments: [
    { id: "cs", name: { ar: "علم الحاسوب", en: "Computer Science" } },
    { id: "se", name: { ar: "هندسة البرمجيات", en: "Software Engineering" } },
    { id: "cyber", name: { ar: "الأمن السيبراني", en: "Cyber Security" } },
    { id: "dsai", name: { ar: "علم البيانات والذكاء الاصطناعي", en: "Data Science & AI" } }
  ],

  users: [
    {
      id: "u1",
      username: "admin",
      password: "123",
      role: "SUPER_ADMIN",
      name: { ar: "مدير النظام", en: "System Admin" },
      departmentId: "cs",
      permissions: ["EDIT_ALL", "MANAGE_USERS"]
    },
    {
      id: "u2",
      username: "20240001",
      password: "123",
      role: "STUDENT",
      name: { ar: "أحمد علي", en: "Ahmed Ali" },
      departmentId: "se",
      isAlumni: false
    }
  ],

  facultyMembers: [
    { 
      id: 1,
      name: 'أ.د. أحمد محمد', 
      departmentId: "cs",
      role: 'العميد', 
      specialization: 'الذكاء الاصطناعي', 
      office: 'مكتب العميد - الطابق الثاني', 
      officeHours: 'الأحد والثلاثاء (10:00 - 12:00)' 
    },
    { 
      id: 2,
      name: 'د. سارة عيسى', 
      departmentId: "se",
      role: 'رئيس قسم', 
      specialization: 'هندسة البرمجيات', 
      office: 'مكتب 304 - الطابق الثالث', 
      officeHours: 'الاثنين والأربعاء (09:00 - 11:00)' 
    }
  ],

  offeredCourses: [
    { 
      id: 1,
      title: 'معسكر تطوير واجهات الويب (React)', 
      hours: '40 ساعة', 
      instructorId: 1,
      state: 'متاح للتسجيل' 
    },
    { 
      id: 2,
      title: 'دورة الأمن السيبراني المتقدم', 
      hours: '30 ساعة', 
      instructorId: 2,
      state: 'متاح للتسجيل' 
    }
  ],

  projectBank: [
    { 
      id: 1,
      name: { ar: 'نظام إدارة المستشفيات الذكي', en: 'Smart Hospital Management' }, 
      studentIds: ["u2"],
      supervisorId: 2,
      rating: 4.5,
      images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'],
      notes: { ar: 'مشروع متميز جداً يهدف لرقمنة الخدمات الصحية.', en: 'An outstanding project aimed at digitizing healthcare services.' }
    }
  ],

  alumniRequests: [
    {
      id: "ar1",
      userId: "u2",
      status: "pending",
      requestDate: "2024-04-26",
      details: "طلب انضمام لبوابة الخريجين"
    }
  ],

  roadmap: [
    { id: 1, title: { ar: 'السنة الأولى', en: 'Year 1' }, description: { ar: 'أساسيات البرمجة وهياكل البيانات', en: 'Programming Basics & Data Structures' } }
  ],

  facultyInfo: {
    deanMessage: { 
      ar: 'أهلاً بكم في كلية تكنولوجيا المعلومات، حيث نسعى لإعداد جيل مبدع ومتمكن تقنياً لمواجهة تحديات المستقبل.', 
      en: "Welcome to the Faculty of IT, where we strive to prepare a creative and technically skilled generation to face future challenges." 
    }
  },

  careerReadiness: {
    cvTemplates: [
      { id: 1, title: { ar: "نموذج سيرة ذاتية تقني", en: "Technical CV Template" }, url: "#" }
    ],
    interviews: [
      { id: 1, title: { ar: "أسئلة مقابلات البرمجيات", en: "Software Interview Questions" }, url: "#" }
    ],
    linkedinTips: [
      { id: 1, title: { ar: "تحسين ملفك الشخصي", en: "Optimize Your Profile" }, url: "#" }
    ]
  },

  studentTips: [
    { id: 1, text: 'ابدأ بالتعلم الذاتي من اليوم الأول.' },
    { id: 2, text: 'شارك في مسابقات البرمجة المحلية والدولية.' }
  ],
  quests: [
    { id: 1, title: 'إكمال الدورة التدريبية الأولى', xp: 50 },
    { id: 2, title: 'المشاركة في هاكاثون الكلية', xp: 100 }
  ],
  gradTemplates: [
    { id: 1, name: { ar: 'نموذج مشروع تخرج 1', en: 'Graduation Template 1' }, type: 'pdf' }
  ],

  posts: [
    {
      id: 1,
      author: { name: "د. سارة عيسى", role: "FACULTY" },
      content: "أهلاً بكم في الفصل الدراسي الجديد! نتمنى لجميع الطلاب التوفيق والنجاح في مسيرتهم الأكاديمية.",
      image: "",
      date: "2024-04-26",
      likes: [],
      comments: []
    }
  ],
  pendingPosts: [],
  announcements: [
    { id: 1, text: { ar: "إعلان مهم: بدء التسجيل للمواد الاختيارية للفصل الصيفي", en: "Important: Summer course registration has started" }, type: "warning" },
    { id: 2, text: { ar: "مسابقة البرمجة الكبرى يوم الخميس القادم في مختبر 304", en: "Grand Programming Contest next Thursday in Lab 304" }, type: "info" }
  ],
  events: [
    { id: 1, date: "28 APR", text: { ar: "ورشة عمل تطوير الويب", en: "Web Development Workshop" } },
    { id: 2, date: "05 MAY", text: { ar: "يوم الخريجين المفتوح", en: "Alumni Open Day" } }
  ],
  liveLabs: [
    { id: 1, name: { ar: 'مختبر سيسكو 1', en: 'Cisco Lab 1' }, status: 'available', time: '08:00 - 16:00', info: { ar: 'مخصص لمواد الشبكات والاتصالات', en: 'Dedicated to networking and communications courses' } },
    { id: 2, name: { ar: 'مختبر البرمجة 1', en: 'Programming Lab 1' }, status: 'busy', time: '09:00 - 17:00', info: { ar: 'يحتوي على أجهزة حديثة وبيئات تطوير متكاملة', en: 'Features modern machines and full development environments' } }
  ],
  honorRoll: [
    { id: 1, studentName: { ar: 'محمد أحمد', en: 'Mohammad Ahmed' }, major: 'cs', year: '2023/2024', gpa: '3.98' },
    { id: 2, studentName: { ar: 'سارة خالد', en: 'Sara Khalid' }, major: 'se', year: '2023/2024', gpa: '3.95' }
  ],
  achievements: [
    { 
      id: 1, 
      title: { ar: 'الفوز بالمركز الأول في مسابقة البرمجة الوطنية', en: 'First Place in National Programming Contest' }, 
      summary: { ar: 'حقق فريق الكلية المركز الأول في المسابقة التي أقيمت على مستوى الجامعات الأردنية.', en: 'The faculty team won first place in the competition held among Jordanian universities.' },
      report: { ar: 'تم تحقيق هذا الإنجاز بعد تدريبات مكثفة استمرت لمدة 3 أشهر...', en: 'This achievement was reached after 3 months of intensive training...' },
      year: '2024',
      participants: { ar: 'د. سارة عيسى، الطالب محمد أحمد، الطالبة ربا علي', en: 'Dr. Sara Issa, Mohammad Ahmed, Ruba Ali' },
      images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'],
      date: '2024-03-15'
    }
  ]
};

