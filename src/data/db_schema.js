
export const DB_SCHEMA = {

  departments: [
    { id: "cis", name: { ar: "نظم المعلومات الحاسوبية", en: "Computer Information Systems" } },
    { id: "cs", name: { ar: "علم الحاسوب", en: "Computer Science" } },
    { id: "cyber", name: { ar: "أمن المعلومات والفضاء الالكتروني", en: "Information Security and Cyberspace" } },
    { id: "mm", name: { ar: "الوسائط المتعددة", en: "Multimedia" } },
    { id: "ns", name: { ar: "أنظمة شبكات حاسوبية", en: "Computer Networking Systems" } },
    { id: "dsai", name: { ar: "علم البيانات والذكاء الاصطناعي", en: "Data Science and AI" } },
    { id: "se", name: { ar: "هندسة البرمجيات", en: "Software Engineering" } }
  ],

  // All data is now managed via Supabase. These arrays are kept empty for structure reference.
  users: [],
  facultyMembers: [],
  offeredCourses: [],
  projectBank: [],
  alumniRequests: [],
  roadmap: [],
  
  facultyInfo: {
    deanMessage: { 
      ar: 'أهلاً بكم في كلية تكنولوجيا المعلومات، حيث نسعى لإعداد جيل مبدع ومتمكن تقنياً لمواجهة تحديات المستقبل.', 
      en: "Welcome to the Faculty of IT, where we strive to prepare a creative and technically skilled generation to face future challenges." 
    }
  },

  careerReadiness: {
    cvTemplates: [],
    interviews: [],
    linkedinTips: []
  },

  studentTips: [],
  quests: [],
  gradTemplates: [],
  posts: [],
  pendingPosts: [],
  announcements: [],
  events: [],
  liveLabs: [],
  honorRoll: [],
  achievements: []
};
