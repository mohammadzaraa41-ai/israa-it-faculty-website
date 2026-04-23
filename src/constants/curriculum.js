export const curriculumData = {
  ar: {
    specializations: [
      { 
        id: 'cs', 
        name: 'علم الحاسوب', 
        isParent: true,
        description: 'الأساس المتين للبرمجيات والخوارزميات وحل المشكلات المعقدة.',
        advice: 'نصيحة الموجه: ركز على فهم المنطق البرمجي والخوارزميات قبل لغات البرمجة. علم الحاسوب هو فن حل المشكلات، وإتقانك للأساسيات سيجعلك قادراً على تعلم أي تقنية جديدة في أيام.',
        icon: 'Code2',
        logicKeywords: ['برمجة', 'خوارزميات', 'أساسيات', 'حاسوب', 'computer science'] 
      },
      { 
        id: 'cs_net', 
        name: 'علم الحاسوب - فرع الشبكات', 
        parentId: 'cs',
        description: 'بناء وإدارة البنية التحتية للشبكات والاتصالات الحديثة.',
        advice: 'نصيحة الموجه: عالم الشبكات هو العمود الفقري للإنترنت. اهتم بالشهادات المهنية مثل CCNA بجانب دراستك الأكاديمية، وركز على فهم بروتوكولات الأمان السحابي.',
        icon: 'Network',
        logicKeywords: ['شبكات', 'سيرفرات', 'اتصالات', 'networks'] 
      },
      { 
        id: 'cs_multi', 
        name: 'علم الحاسوب - فرع الوسائط', 
        parentId: 'cs',
        description: 'دمج الفن بالتكنولوجيا عبر التصميم الجرافيكي والوسائط التفاعلية.',
        advice: 'نصيحة الموجه: الإبداع هو مفتاحك. لا تكتفِ بتعلم الأدوات (مثل Photoshop)، بل افهم تجربة المستخدم (UX) وكيفية بناء واجهات تفاعلية تخدم احتياجات الناس.',
        icon: 'Palette',
        logicKeywords: ['تصميم', 'جرافيك', 'فيديو', 'وسائط', 'multimedia'] 
      },
      { 
        id: 'se', 
        name: 'هندسة البرمجيات', 
        description: 'تصميم وبناء أنظمة برمجية ضخمة وموثوقة بجودة عالمية.',
        advice: 'نصيحة الموجه: المهندس لا يكتب الكود فقط، بل يصممه. تعلم أنماط التصميم (Design Patterns) وكيفية العمل ضمن فريق برمجى، فالأنظمة الضخمة تُبنى بالتعاون لا بالفردية.',
        icon: 'Cpu',
        logicKeywords: ['هندسة', 'نظام', 'مشروع', 'software engineering'] 
      },
      { 
        id: 'sec', 
        name: 'أمن المعلومات والفضاء الالكتروني', 
        description: 'حماية الأصول الرقمية والتحقيق في الجرائم المعلوماتية.',
        advice: 'نصيحة الموجه: الأمن هو رحلة لا تنتهي. كن دائماً مطلعاً على أحدث الثغرات، وتذكر أن التفكير بعقلية "المخترق الأخلاقي" هو أفضل وسيلة لحماية الأنظمة.',
        icon: 'ShieldAlert',
        logicKeywords: ['أمن', 'اختراق', 'تشفير', 'cybersecurity'] 
      },
      { 
        id: 'cyber', 
        name: 'الأمن السيبراني', 
        description: 'خط الدفاع الأول ضد التهديدات والهجمات السيبرانية المتطورة.',
        advice: 'نصيحة الموجه: الدقة هي كل شيء. في الأمن السيبراني، خطأ واحد قد يكلف الكثير. تدرب كثيراً في بيئات معزولة (CTFs) لتطوير مهاراتك في الصد والهجوم.',
        icon: 'Lock',
        logicKeywords: ['سيبراني', 'هجوم', 'دفاع', 'cyber security'] 
      },
      { 
        id: 'cis', 
        name: 'نظم المعلومات الحاسوبية', 
        description: 'الربط الذكي بين تكنولوجيا المعلومات واحتياجات قطاع الأعمال.',
        advice: 'نصيحة الموجه: أنت المترجم بين التكنولوجيا والبزنس. ركز على فهم كيفية تحويل البيانات إلى قرارات ذكية تخدم الشركات، وكن ملماً بلغة المال والأعمال.',
        icon: 'Database',
        logicKeywords: ['نظم', 'بيانات', 'إدارة', 'cis'] 
      },
      { 
        id: 'ds_ai', 
        name: 'علم البيانات والذكاء الاصطناعي', 
        description: 'استخراج المعرفة من البيانات وبناء أنظمة تحاكي الذكاء البشري.',
        advice: 'نصيحة الموجه: الرياضيات هي لغة الذكاء الاصطناعي. قوّي مهاراتك في الإحصاء والجبر، وتعلم كيف تجعل البيانات "تحكي قصة" مفيدة للمستخدم النهائي.',
        icon: 'BrainCircuit',
        logicKeywords: ['ذكاء', 'بيانات', 'تعلم الآلة', 'ai', 'data science'] 
      }
    ],
    courses: {
      cs: [
        { id: 1, name: 'برمجة 1', credits: 3 },
        { id: 2, name: 'هياكل البيانات', credits: 3 },
        { id: 3, name: 'خوارزميات', credits: 3 }
      ],
      cs_net: [
        { id: 4, name: 'أساسيات الشبكات', credits: 3 },
        { id: 5, name: 'بروتوكولات الإنترنت', credits: 3 }
      ],
      cs_multi: [
        { id: 6, name: 'الرسوم الحاسوبية', credits: 3 },
        { id: 7, name: 'الوسائط المتعددة', credits: 3 }
      ],
      se: [
        { id: 8, name: 'إدارة مشاريع البرمجيات', credits: 3 },
        { id: 9, name: 'هندسة المتطلبات', credits: 3 }
      ],
      sec: [
        { id: 10, name: 'أمن الشبكات', credits: 3 },
        { id: 11, name: 'التشفير وحماية البيانات', credits: 3 }
      ],
      cyber: [
        { id: 16, name: 'مقدمة في الأمن السيبراني', credits: 3 },
        { id: 17, name: 'الاختراق الأخلاقي', credits: 3 }
      ],
      cis: [
        { id: 12, name: 'تحليل وتصميم النظم', credits: 3 },
        { id: 13, name: 'قواعد البيانات المتقدمة', credits: 3 }
      ],
      ds_ai: [
        { id: 14, name: 'تعلم الآلة', credits: 3 },
        { id: 15, name: 'علم البيانات', credits: 3 }
      ]
    },
    generalResponses: {
      greeting: "مرحباً بك! أنا مستشارك الذكي في الكلية. كيف يمكنني مساعدتك اليوم؟",
      askInterest: "ما هو التخصص الذي تود الاستفسار عنه؟",
      suggestionPrefix: "بناءً على تخصص {name}، إليك نصيحة الموجه:",
      notFound: "عذراً، لم أفهم طلبك. هل يمكنك تحديد التخصص؟"
    }
  },
  en: {
    specializations: [
      { 
        id: 'cs', 
        name: 'Computer Science', 
        isParent: true,
        description: 'Solid foundation in software, algorithms, and problem solving.',
        advice: 'Advisor Tip: Focus on understanding programming logic and algorithms before specific languages. CS is the art of problem-solving.',
        icon: 'Code2',
        logicKeywords: ['programming', 'algorithms', 'cs', 'coding'] 
      },
      { 
        id: 'cs_net', 
        name: 'CS - Networking Branch', 
        parentId: 'cs',
        description: 'Building and managing modern network infrastructures.',
        advice: 'Advisor Tip: Networks are the backbone of the internet. Aim for professional certs like CCNA alongside your degree.',
        icon: 'Network',
        logicKeywords: ['networks', 'servers', 'communication', 'internet'] 
      },
      { 
        id: 'cs_multi', 
        name: 'CS - Multimedia Branch', 
        parentId: 'cs',
        description: 'Blending art with technology through interactive design.',
        advice: 'Advisor Tip: Creativity is key. Focus on User Experience (UX) and how interactive interfaces serve human needs.',
        icon: 'Palette',
        logicKeywords: ['design', 'graphic', 'video', 'multimedia', 'animation'] 
      },
      { 
        id: 'se', 
        name: 'Software Engineering', 
        description: 'Designing and building large-scale, reliable software systems.',
        advice: 'Advisor Tip: Engineers don\'t just write code, they design it. Learn Design Patterns and team collaboration.',
        icon: 'Cpu',
        logicKeywords: ['engineering', 'system', 'software', 'sdlc'] 
      },
      { 
        id: 'sec', 
        name: 'Info Security & Cyberspace', 
        description: 'Protecting digital assets and investigating cyber crimes.',
        advice: 'Advisor Tip: Security is an endless journey. Stay updated on the latest vulnerabilities and think like an ethical hacker.',
        icon: 'ShieldAlert',
        logicKeywords: ['security', 'hacking', 'cyber', 'cryptography'] 
      },
      { 
        id: 'cyber', 
        name: 'Cyber Security', 
        description: 'First line of defense against advanced cyber threats.',
        advice: 'Advisor Tip: Accuracy is everything. Practice in isolated environments (CTFs) to build your defense/attack skills.',
        icon: 'Lock',
        logicKeywords: ['cybersecurity', 'attack', 'defense', 'protection'] 
      },
      { 
        id: 'cis', 
        name: 'Computer Info Systems', 
        description: 'Bridging the gap between IT and business management.',
        advice: 'Advisor Tip: You are the translator between IT and Business. Focus on data-driven decision making.',
        icon: 'Database',
        logicKeywords: ['systems', 'data', 'cis', 'business'] 
      },
      { 
        id: 'ds_ai', 
        name: 'Data Science & AI', 
        description: 'Extracting knowledge from data and building intelligent systems.',
        advice: 'Advisor Tip: Math is the language of AI. Strengthen your stats and algebra skills.',
        icon: 'BrainCircuit',
        logicKeywords: ['ai', 'data science', 'learning', 'intelligence'] 
      }
    ],
    courses: {
      cs: [
        { id: 1, name: 'Programming 1', credits: 3 },
        { id: 2, name: 'Data Structures', credits: 3 }
      ],
      cs_net: [
        { id: 4, name: 'Network Fundamentals', credits: 3 }
      ],
      cs_multi: [
        { id: 6, name: 'Computer Graphics', credits: 3 }
      ],
      se: [
        { id: 8, name: 'Software Project Management', credits: 3 }
      ],
      sec: [
        { id: 10, name: 'Network Security', credits: 3 }
      ],
      cyber: [
        { id: 16, name: 'Intro to Cyber Security', credits: 3 },
        { id: 17, name: 'Ethical Hacking', credits: 3 }
      ],
      cis: [
        { id: 12, name: 'Systems Analysis & Design', credits: 3 }
      ],
      ds_ai: [
        { id: 14, name: 'Machine Learning', credits: 3 },
        { id: 15, name: 'Data Science', credits: 3 }
      ]
    },
    generalResponses: {
      greeting: "Hello! I am your AI Advisor. How can I assist you today?",
      askInterest: "Which specialization would you like to inquire about?",
      suggestionPrefix: "Based on {name} major, here is the Advisor tip:",
      notFound: "Sorry, I didn't catch that. Could you specify a major?"
    }
  }
};
