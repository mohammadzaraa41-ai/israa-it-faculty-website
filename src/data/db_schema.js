/**
 * DB_SCHEMA: المخطط الهيكلي للبيانات الأولية (Initial Data)
 * يستخدم هذا الملف كمرجع للبيانات في حال عدم توفر اتصال بقاعدة بيانات Supabase
 * أو لتزويد التطبيق بالقيم الافتراضية.
 */

export const DB_SCHEMA = {

  // --- التخصصات الأكاديمية (Majors) ---
  departments: [
    { id: "cs", name: { ar: "علم الحاسوب", en: "Computer Science" } },
    { id: "se", name: { ar: "هندسة البرمجيات", en: "Software Engineering" } },
    { id: "cis", name: { ar: "نظم المعلومات الحاسوبية", en: "Computer Info Systems" } },
    { id: "cyber", name: { ar: "الأمن السيبراني", en: "Cyber Security" } },
    { id: "sec", name: { ar: "أمن المعلومات والفضاء الإلكتروني", en: "Info Security & Cyberspace" } },
    { id: "dsai", name: { ar: "علم البيانات والذكاء الاصطناعي", en: "Data Science & AI" } },
    { id: "multi", name: { ar: "الوسائط المتعددة", en: "Multimedia" } },
    { id: "net", name: { ar: "أنظمة الشبكات الحاسوبية", en: "Computer Networks" } }
  ],

  // --- المستخدمين الافتراضيين ---
  users: [
    {
      id: "u1",
      username: "admin",
      password: "123",
      role: "SUPER_ADMIN",
      name: { ar: "مدير النظام", en: "System Admin" },
      departmentId: "cs"
    },
    {
      id: "u2",
      username: "20240001",
      password: "123",
      role: "STUDENT",
      name: { ar: "أحمد علي", en: "Ahmed Ali" },
      departmentId: "se"
    }
  ],

  // --- الهيئة التدريسية ---
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

  // --- الدورات المطروحة ---
  offeredCourses: [
    { 
      id: 1,
      title: 'معسكر تطوير واجهات الويب (React)', 
      hours: '40 ساعة', 
      instructorId: 1,
      state: 'متاح للتسجيل' 
    }
  ],

  // --- الإعلانات والفعاليات ---
  announcements: [
    { id: 1, text: { ar: "إعلان مهم: بدء التسجيل للمواد الاختيارية للفصل الصيفي", en: "Important: Summer course registration has started" }, type: "warning" },
    { id: 2, text: { ar: "مسابقة البرمجة الكبرى يوم الخميس القادم في مختبر 304", en: "Grand Programming Contest next Thursday in Lab 304" }, type: "info" }
  ],

  events: [
    { id: 1, date: "28 APR", text: { ar: "ورشة عمل تطوير الويب", en: "Web Development Workshop" } },
    { id: 2, date: "05 MAY", text: { ar: "يوم الخريجين المفتوح", en: "Alumni Open Day" } }
  ],

  // --- المختبرات الحية ---
  liveLabs: [
    { id: 1, name: { ar: 'مختبر سيسكو 1', en: 'Cisco Lab 1' }, status: 'available', time: '08:00 - 16:00', info: { ar: 'مخصص لمواد الشبكات والاتصالات', en: 'Dedicated to networking and communications courses' } },
    { id: 2, name: { ar: 'مختبر البرمجة 1', en: 'Programming Lab 1' }, status: 'busy', time: '09:00 - 17:00', info: { ar: 'يحتوي على أجهزة حديثة وبيئات تطوير متكاملة', en: 'Features modern machines and full development environments' } }
  ],

  // --- لوحة الشرف ---
  honorRoll: [
    { id: 1, studentName: { ar: 'محمد أحمد', en: 'Mohammad Ahmed' }, major: 'cs', year: '2023/2024', gpa: '3.98' },
    { id: 2, studentName: { ar: 'سارة خالد', en: 'Sara Khalid' }, major: 'se', year: '2023/2024', gpa: '3.95' }
  ],

  // --- إنجازات الكلية ---
  achievements: [
    { 
      id: 1, 
      title: { ar: 'المركز الأول في مسابقة البرمجة الوطنية', en: 'First Place in National Programming Contest' }, 
      summary: { ar: 'حقق فريق الكلية المركز الأول في المسابقة التي أقيمت على مستوى الجامعات الأردنية.', en: 'The faculty team won first place in the competition held among Jordanian universities.' },
      report: { ar: 'تم تحقيق هذا الإنجاز بعد تدريبات مكثفة استمرت لمدة 3 أشهر، حيث أظهر الطلاب مهارات استثنائية في حل المشكلات البرمجية المعقدة...', en: 'This achievement was reached after 3 months of intensive training, where students showed exceptional problem-solving skills...' },
      year: '2024',
      participants: { ar: 'د. سارة عيسى، الطالب محمد أحمد، الطالبة ربا علي', en: 'Dr. Sara Issa, Mohammad Ahmed, Ruba Ali' },
      images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'],
      date: '2024-03-15'
    }
  ],

  // --- نصائح وتحديات ---
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
  ]
};
