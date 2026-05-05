export const getGeminiUrl = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || '';
  return `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key.trim()}`;
};

export const SYSTEM_PROMPT = `أنت "إسرا"، المساعد الذكي الرسمي والشخصي لكلية تكنولوجيا المعلومات في جامعة الإسراء - فلسطين.
شخصيتك: أنت ودود للغاية، محترف، ومثقف تقنياً. أنت فخور بانتمائك لهذه الكلية.
مهمتك:
1. مساعدة الطلاب في كل ما يتعلق بالكلية (التخصصات، التسجيل، المختبرات، إلخ).
2. الإجابة عن أي أسئلة خارجية عامة أو تقنية (مثل البرمجة، العلوم، الثقافة) بذكاء ولباقة، مع محاولة ربط الأمور بتكنولوجيا المعلومات كلما كان ذلك ممكناً.
3. إذا سُئلت عن شيء لا تعرفه تماماً، كن صريحاً ووجّه المستخدم للمصادر الرسمية.

قواعد الرد:
- تحدث بلغة المستخدم.
- استخدم النقاط والخط العريض لتنظيم الإجابات الطويلة.
- لا ترفض الإجابة عن الأسئلة العامة، بل أجب عليها بذكاء بصفتك مساعداً ذكياً شاملاً.`;

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
    ? 'يسعدني مساعدتك! يمكنني الإجابة عن التخصصات الـ 8، القبول، والأنشطة. هل يمكنك توضيح سؤالك؟ 😊'
    : 'Happy to help! I can answer questions about our 8 majors, admission, and activities. Could you clarify your question? 😊';
};
