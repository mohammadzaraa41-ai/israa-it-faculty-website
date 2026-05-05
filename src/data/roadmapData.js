export const majorRoadmaps = {
  se: {
    title: { ar: 'هندسة البرمجيات', en: 'Software Engineering' },
    color: '#3498db',
    nodes: [
      { id: 'p1', name: { ar: 'أساسيات هندسة البرمجيات', en: 'SE Fundamentals' }, level: 0 },
      { id: 'req', name: { ar: 'هندسة متطلبات البرمجيات', en: 'Software Requirements' }, level: 1 },
      { id: 'arch', name: { ar: 'تصميم بنية البرمجيات', en: 'Software Architecture' }, level: 2 },
      { id: 'dev', name: { ar: 'هندسة الويب', en: 'Web Engineering' }, level: 3 },
      { id: 'qa', name: { ar: 'جودة البرمجيات', en: 'Software Quality' }, level: 4 },
      { id: 'test', name: { ar: 'فحص البرمجيات', en: 'Software Testing' }, level: 5 },
      { id: 'maint', name: { ar: 'صيانة البرمجيات والهندسة العكسية', en: 'Maintenance & Reverse Eng' }, level: 6 },
      { id: 'pm', name: { ar: 'إدارة مشاريع البرمجيات', en: 'Software PM' }, level: 3 },
    ],
    links: [
      { from: 'p1', to: 'req' },
      { from: 'req', to: 'arch' },
      { from: 'arch', to: 'dev' },
      { from: 'dev', to: 'qa' },
      { from: 'qa', to: 'test' },
      { from: 'test', to: 'maint' },
      { from: 'req', to: 'pm' },
    ]
  },
  dsai: {
    title: { ar: 'الذكاء الاصطناعي وعلم البيانات', en: 'AI & Data Science' },
    color: '#e74c3c',
    nodes: [
      { id: 'py', name: { ar: 'البرمجة بلغة بايثون', en: 'Python Programming' }, level: 0 },
      { id: 'ai', name: { ar: 'ذكاء اصطناعي', en: 'AI' }, level: 1 },
      { id: 'ml_intro', name: { ar: 'أساسيات تعلم الآلة', en: 'ML Intro' }, level: 2 },
      { id: 'robot', name: { ar: 'الروبوتات', en: 'Robotics' }, level: 2 },
      { id: 'big_data', name: { ar: 'البيانات الضخمة', en: 'Big Data' }, level: 3 },
      { id: 'mining', name: { ar: 'تنقيب البيانات', en: 'Data Mining' }, level: 2 },
      { id: 'nlp', name: { ar: 'معالجة اللغات الطبيعية', en: 'NLP' }, level: 3 },
      { id: 'ds', name: { ar: 'علم البيانات', en: 'Data Science' }, level: 2 },
    ],
    links: [
      { from: 'py', to: 'ai' },
      { from: 'ai', to: 'ml_intro' },
      { from: 'ai', to: 'robot' },
      { from: 'ml_intro', to: 'big_data' },
      { from: 'ml_intro', to: 'nlp' },
      { from: 'ai', to: 'ds' },
      { from: 'ds', to: 'mining' },
    ]
  },
  cyber: {
    title: { ar: 'أمن المعلومات والفضاء الإلكتروني', en: 'Cyber Security' },
    color: '#2ecc71',
    nodes: [
      { id: 'sec_intro', name: { ar: 'مقدمة في أمن المعلومات', en: 'Info Security Intro' }, level: 0 },
      { id: 'net_sec', name: { ar: 'أمنية الشبكات', en: 'Network Security' }, level: 1 },
      { id: 'sec_proto', name: { ar: 'بروتوكولات أمن المعلومات', en: 'Security Protocols' }, level: 2 },
      { id: 'ids', name: { ar: 'أنظمة كشف التسلل', en: 'IDS' }, level: 2 },
      { id: 'risk', name: { ar: 'إدارة مخاطر أمن المعلومات', en: 'Risk Management' }, level: 1 },
      { id: 'eh', name: { ar: 'الاختراق الأخلاقي', en: 'Ethical Hacking' }, level: 2 },
      { id: 'cloud_sec', name: { ar: 'أمن الحوسبة السحابية', en: 'Cloud Security' }, level: 2 },
      { id: 'df', name: { ar: 'التحقيقات وتحليل الأدلة الجنائية', en: 'Forensics' }, level: 3 },
    ],
    links: [
      { from: 'sec_intro', to: 'net_sec' },
      { from: 'net_sec', to: 'sec_proto' },
      { from: 'net_sec', to: 'ids' },
      { from: 'sec_intro', to: 'risk' },
      { from: 'net_sec', to: 'eh' },
      { from: 'net_sec', to: 'cloud_sec' },
      { from: 'eh', to: 'df' },
    ]
  },
  multimedia: {
    title: { ar: 'الوسائط المتعددة', en: 'Multimedia' },
    color: '#9b59b6',
    nodes: [
      { id: 'mm_intro', name: { ar: 'أنظمة وسائط متعددة', en: 'Multimedia Systems' }, level: 0 },
      { id: 'av', name: { ar: 'إنتاج صوت وصورة', en: 'AV Production' }, level: 1 },
      { id: '2d', name: { ar: 'الرسوم المتحركة ثنائية الأبعاد', en: '2D Animation' }, level: 2 },
      { id: '3d', name: { ar: 'الرسوم المتحركة ثلاثية الأبعاد', en: '3D Animation' }, level: 3 },
      { id: 'game', name: { ar: 'تصميم ألعاب', en: 'Game Design' }, level: 4 },
      { id: 'vr', name: { ar: 'الرؤية الافتراضية', en: 'Virtual Reality' }, level: 2 },
      { id: 'ip', name: { ar: 'معالجة الصور', en: 'Image Processing' }, level: 2 },
    ],
    links: [
      { from: 'mm_intro', to: 'av' },
      { from: 'av', to: '2d' },
      { from: '2d', to: '3d' },
      { from: '3d', to: 'game' },
      { from: 'mm_intro', to: 'vr' },
      { from: 'mm_intro', to: 'ip' },
    ]
  },
  cis: {
    title: { ar: 'نظم المعلومات الحاسوبية', en: 'CIS' },
    color: '#f39c12',
    nodes: [
      { id: 'sad', name: { ar: 'تحليل وتصميم نظم المعلومات', en: 'SAD' }, level: 0 },
      { id: 'db_admin', name: { ar: 'إدارة نظم قواعد البيانات', en: 'DB Management' }, level: 1 },
      { id: 'dwh', name: { ar: 'مستودعات البيانات', en: 'Data Warehouse' }, level: 2 },
      { id: 'dm', name: { ar: 'تنقيب البيانات', en: 'Data Mining' }, level: 3 },
      { id: 'ir', name: { ar: 'نظم استرجاع المعلومات', en: 'Info Retrieval' }, level: 1 },
      { id: 'e_com', name: { ar: 'معاملات الكترونية', en: 'E-Transactions' }, level: 2 },
    ],
    links: [
      { from: 'sad', to: 'db_admin' },
      { from: 'db_admin', to: 'dwh' },
      { from: 'dwh', to: 'dm' },
      { from: 'sad', to: 'ir' },
      { from: 'ir', to: 'e_com' },
    ]
  },
  cs: {
    title: { ar: 'علم الحاسوب', en: 'Computer Science' },
    color: '#7f8c8d',
    nodes: [
      { id: 'prog1', name: { ar: 'أساسيات البرمجة', en: 'Programming Fundamentals' }, level: 0 },
      { id: 'oop', name: { ar: 'أساليب كائنية المنحى', en: 'OOP' }, level: 1 },
      { id: 'ds', name: { ar: 'هياكل البيانات', en: 'Data Structures' }, level: 2 },
      { id: 'algo', name: { ar: 'خوارزميات', en: 'Algorithms' }, level: 3 },
      { id: 'os', name: { ar: 'نظم تشغيل', en: 'Operating Systems' }, level: 3 },
      { id: 'net', name: { ar: 'شبكات حاسوب', en: 'Computer Networks' }, level: 2 },
      { id: 'web1', name: { ar: 'تصميم مواقع انترنت (1)', en: 'Web Design (1)' }, level: 1 },
    ],
    links: [
      { from: 'prog1', to: 'oop' },
      { from: 'oop', to: 'ds' },
      { from: 'ds', to: 'algo' },
      { from: 'ds', to: 'os' },
      { from: 'oop', to: 'web1' },
      { from: 'oop', to: 'net' },
    ]
  }
};
