/* 
  RELATIONAL DATABASE SCHEMA - Israa IT Faculty
  --------------------------------------------
  This file implements a Relational Database structure using JSON.
  PK = Primary Key (Unique Identifier)
  FK = Foreign Key (Link to another table's PK)
*/

export const DB_SCHEMA = {
  // --- TABLE: DEPARTMENTS (Majors) ---
  departments: [
    { id: "cs", name: { ar: "علم الحاسوب", en: "Computer Science" } },
    { id: "se", name: { ar: "هندسة البرمجيات", en: "Software Engineering" } },
    { id: "cyber", name: { ar: "الأمن السيبراني", en: "Cyber Security" } },
    { id: "dsai", name: { ar: "علم البيانات والذكاء الاصطناعي", en: "Data Science & AI" } }
  ],

  // --- TABLE: USERS ---
  users: [
    {
      id: "u1", // PK
      username: "admin",
      password: "123",
      role: "SUPER_ADMIN",
      name: { ar: "مدير النظام", en: "System Admin" },
      departmentId: "cs", // FK -> departments.id
      permissions: ["EDIT_ALL", "MANAGE_USERS"]
    },
    {
      id: "u2", // PK
      username: "20240001",
      password: "123",
      role: "STUDENT",
      name: { ar: "أحمد علي", en: "Ahmed Ali" },
      departmentId: "se", // FK -> departments.id
      isAlumni: false
    }
  ],

  // --- TABLE: FACULTY_MEMBERS ---
  facultyMembers: [
    { 
      id: 1, // PK
      name: 'أ.د. أحمد محمد', 
      departmentId: "cs", // FK -> departments.id
      role: 'العميد', 
      specialization: 'الذكاء الاصطناعي', 
      office: 'مكتب العميد - الطابق الثاني', 
      officeHours: 'الأحد والثلاثاء (10:00 - 12:00)' 
    },
    { 
      id: 2, // PK
      name: 'د. سارة عيسى', 
      departmentId: "se", // FK -> departments.id
      role: 'رئيس قسم', 
      specialization: 'هندسة البرمجيات', 
      office: 'مكتب 304 - الطابق الثالث', 
      officeHours: 'الاثنين والأربعاء (09:00 - 11:00)' 
    }
  ],

  // --- TABLE: OFFERED_COURSES ---
  offeredCourses: [
    { 
      id: 1, // PK
      title: 'معسكر تطوير واجهات الويب (React)', 
      hours: '40 ساعة', 
      instructorId: 1, // FK -> facultyMembers.id
      state: 'متاح للتسجيل' 
    },
    { 
      id: 2, // PK
      title: 'دورة الأمن السيبراني المتقدم', 
      hours: '30 ساعة', 
      instructorId: 2, // FK -> facultyMembers.id
      state: 'متاح للتسجيل' 
    }
  ],

  // --- TABLE: PROJECT_BANK (Graduation Projects) ---
  projectBank: [
    { 
      id: 1, // PK
      name: { ar: 'نظام إدارة المستشفيات الذكي', en: 'Smart Hospital Management' }, 
      studentIds: ["u2"], // FK -> Array of users.id
      supervisorId: 2, // FK -> facultyMembers.id
      rating: 4.5,
      images: ['https://placehold.co/600x400?text=Project+1'],
      notes: { ar: 'مشروع متميز جداً.', en: 'Excellent project.' }
    }
  ],

  // --- TABLE: ALUMNI_REQUESTS ---
  alumniRequests: [
    {
      id: "ar1", // PK
      userId: "u2", // FK -> users.id
      status: "pending",
      requestDate: "2026-04-26",
      details: "طلب انضمام لبوابة الخريجين"
    }
  ],

  // --- TABLE: ROADMAP ---
  roadmap: [
    { id: 1, title: { ar: 'السنة الأولى', en: 'Year 1' }, description: { ar: 'أساسيات البرمجة', en: 'Programming Basics' } }
  ],

  // --- TABLE: FACULTY_INFO ---
  facultyInfo: {
    deanMessage: { ar: 'رسالة العميد...', en: "Dean's Message..." }
  },

  // --- ALUMNI CAREER READINESS ---
  careerReadiness: {
    cvTemplates: [],
    interviews: [],
    linkedinTips: []
  },

  // --- EXISTING DATA ---
  studentTips: [
    { id: 1, text: 'نصيحة 1...' },
    { id: 2, text: 'نصيحة 2...' }
  ],
  quests: [
    { id: 1, title: 'مهمة 1', xp: 50 },
    { id: 2, title: 'مهمة 2', xp: 100 }
  ],
  gradTemplates: [
    { id: 1, name: { ar: 'قالب 1', en: 'Template 1' }, type: 'pdf' }
  ],
  // --- NEW TABLES FOR SOCIAL FEED ---
  posts: [
    {
      id: 1,
      author: { name: "د. سارة عيسى", role: "FACULTY" },
      content: "أهلاً بكم في الفصل الدراسي الجديد! نتمنى لجميع الطلاب التوفيق والنجاح في مسيرتهم الأكاديمية.",
      image: "",
      date: "2026-04-26",
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
  ]
};
