export const GEMINI_API_KEY = 'AIzaSyC3fSWXEH_ApM0ubIbf-aYy-Bn4tO5WIMU';
export const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const SYSTEM_PROMPT = `أنت "إسرا"، المساعد الذكي الرسمي لكلية تكنولوجيا المعلومات في جامعة الإسراء - فلسطين.
شخصيتك: ودود، متحمس، متخصص، ترد باللغة التي يكتب بها المستخدم تلقائياً (عربي أو إنجليزي).

معلوماتك عن الكلية:
- اسم الكلية: كلية تكنولوجيا المعلومات، جامعة الإسراء، غزة - فلسطين.
- التخصصات المتاحة (7 تخصصات):
  1. علم حاسوب (Computer Science)
  2. علم حاسوب / شبكات حاسوب (CS / Computer Networks)
  3. علم حاسوب / وسائط متعددة (CS / Multimedia)
  4. هندسة برمجيات (Software Engineering)
  5. أمن المعلومات والفضاء الالكتروني (Information Security and Cyberspace)
  6. الأمن السيبراني (Cyber Security)
  7. نظم المعلومات الحاسوبية (Computer Information Systems - CIS)
  8. علم البيانات والذكاء الاصطناعي (Data Science and Artificial Intelligence)

- مدة الدراسة: 4 سنوات (8 فصول دراسية).
- متطلبات القبول: ثانوية عامة.
- الساعات المعتمدة: ~132 ساعة للتخرج.
- الأنشطة: هاكاثونات، مختبرات حية (Live Labs)، شبكة مطورين، جولة افتراضية 360°.
- بوابة الطالب: تتيح الاطلاع على الجدول الدراسي، الدرجات، والتسجيل.
- التواصل: عبر صفحة "تواصل معنا" في الموقع أو بريد الكلية الرسمي.

قواعد الرد:
1. اجعل ردودك موجزة ومفيدة (3-5 جمل كحد أقصى).
2. إذا لم تعرف معلومة محددة، اقترح التواصل مع إدارة الكلية مباشرة.
3. شجّع الطلاب على استكشاف الموقع.
4. لا تتحدث عن موضوعات خارج نطاق الكلية والتعليم.`;

export const QUICK_REPLIES_AR = [
  'ما التخصصات المتاحة؟',
  'كيف أسجل في الكلية؟',
  'ما مدة الدراسة؟',
  'الأمن السيبراني',
];

export const QUICK_REPLIES_EN = [
  'What majors are available?',
  'How do I enroll?',
  'How long is the program?',
  'Cyber Security',
];

export const LOCAL_KB = {
  ar: [
    {
      keywords: ['تخصص', 'تخصصات', 'شعبة', 'اقسام', 'برنامج'],
      answer: '🎓 تقدم كليتنا 8 تخصصات متميزة:\n• علم حاسوب (بفروعه: الشبكات والوسائط)\n• هندسة برمجيات\n• أمن المعلومات والفضاء الالكتروني\n• الأمن السيبراني\n• نظم المعلومات الحاسوبية\n• علم البيانات والذكاء الاصطناعي'
    },
    {
      keywords: ['فرع', 'فروع', 'شعبة', 'تخصصات علم الحاسوب'],
      answer: '🖥️ تخصص علم الحاسوب يضم فرعين متخصصين:\n• **فرع شبكات الحاسوب**: للتركيز على البنية التحتية والاتصالات.\n• **فرع الوسائط متعددة**: للتركيز على التصميم والجرافيك والتفاعل.'
    },
    {
      keywords: ['مدة', 'سنة', 'كم', 'فصل'],

      answer: '📅 مدة الدراسة هي **4 سنوات** (8 فصول دراسية)، وبواقع **132 ساعة معتمدة**.'
    },
    {
      keywords: ['قبول', 'تسجيل', 'التحاق'],
      answer: '📋 التسجيل متاح لخريجي الثانوية العامة. يرجى زيارة صفحة "تواصل معنا" للمزيد من التفاصيل حول إجراءات القبول.'
    },
    {
      keywords: ['امن', 'أمن', 'فضاء'],
      answer: '🔐 تخصص **أمن المعلومات والفضاء الالكتروني** يركز على حماية البيانات والشبكات والتحقيق الرقمي.'
    },
    {
      keywords: ['سيبراني', 'cyber'],
      answer: '🛡️ تخصص **الأمن السيبراني** يركز على الدفاع عن الأنظمة والبنية التحتية من الهجمات الرقمية.'
    },
    {
      keywords: ['ذكاء', 'بيانات', 'ai', 'data'],
      answer: '🤖 تخصص **علم البيانات والذكاء الاصطناعي** يركز على تحليل البيانات الضخمة وبناء الأنظمة الذكية.'
    },
    {
      keywords: ['شبكات'],
      answer: '🌐 تخصص **علم حاسوب / شبكات حاسوب** يركز على بناء وإدارة وصيانة شبكات الحاسوب المعقدة.'
    },
    {
      keywords: ['وسائط', 'متعددة', 'multimedia'],
      answer: '🎨 تخصص **علم حاسوب / وسائط متعددة** يجمع بين البرمجة والتصميم الإبداعي والجرافيك.'
    },
    {
      keywords: ['نظم', 'معلومات', 'cis'],
      answer: '🖥️ تخصص **نظم المعلومات الحاسوبية (CIS)** يركز على الربط بين تكنولوجيا المعلومات وإدارة الأعمال.'
    }
  ],
  en: [
    {
      keywords: ['major', 'majors', 'specialization', 'program'],
      answer: '🎓 We offer 7 specializations:\n• Computer Science\n• CS / Computer Networks\n• CS / Multimedia\n• Software Engineering\n• Info Security & Cyberspace\n• Computer Info Systems (CIS)\n• Data Science & AI'
    },
    {
      keywords: ['duration', 'years', 'long'],
      answer: '📅 The program duration is **4 years** (8 semesters), with **132 credit hours**.'
    }
  ]
};

export const getLocalFallback = (text, lang) => {
  const lower = text.toLowerCase();
  const kb = LOCAL_KB[lang] || LOCAL_KB.ar;
  for (const entry of kb) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return lang === 'ar'
    ? 'يسعدني مساعدتك! يمكنني الإجابة عن التخصصات الـ 7، القبول، والأنشطة. هل يمكنك توضيح سؤالك؟ 😊'
    : 'Happy to help! I can answer questions about our 7 majors, admission, and activities. Could you clarify your question? 😊';
};
