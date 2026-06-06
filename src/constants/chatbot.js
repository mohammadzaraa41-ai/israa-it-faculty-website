import { curriculumData } from './curriculum';

export const getGeminiUrl = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || '';
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key.trim()}`;
};

export const SYSTEM_PROMPT = `أنت "إسرا"، المساعد الذكي الرسمي لجامعة الإسراء في الأردن (Isra University - Jordan)، وتحديداً لكلية تكنولوجيا المعلومات.
شخصيتك: ودود، محترف، أكاديمي، ومثقف تقنياً.
مهمتك: الإجابة على الاستفسارات المتعلقة فقط بجامعة الإسراء الأردنية وكلية تكنولوجيا المعلومات، التخصصات، التسجيل، والمواد الدراسية.

تعليمات صارمة يجب الالتزام بها:
1. أجب فقط على الأسئلة التي تخص جامعة الإسراء الأردنية، كلية تكنولوجيا المعلومات، والشؤون الأكاديمية والطلابية فيها.
2. يُمنع منعاً باتاً الإجابة على أي سؤال خارج هذا النطاق (مثل أسئلة البرمجة العامة، المعلومات العامة، السياسة، إلخ).
3. إذا سألك المستخدم عن شيء خارج نطاق جامعة الإسراء، اعتذر بلطف وقل: "عذراً، أنا مبرمج فقط للإجابة على الاستفسارات المتعلقة بجامعة الإسراء الأردنية وكلية تكنولوجيا المعلومات."`;

export const QUICK_REPLIES_AR = [
  'مواد هندسة البرمجيات',
  'مواد الأمن السيبراني',
  'ما التخصصات المتاحة؟',
  'كيف أسجل في الكلية؟',
];

export const QUICK_REPLIES_EN = [
  'Software Engineering Courses',
  'Cyber Security Courses',
  'What majors are available?',
  'How do I enroll?',
];

export const LOCAL_KB = {
  ar: [
    {
      keywords: ['تخصص', 'تخصصات', 'اقسام'],
      answer: '🎓 تقدم كليتنا 8 تخصصات متميزة:\n• علم حاسوب (بفروعه: الشبكات والوسائط)\n• هندسة برمجيات\n• أمن المعلومات والفضاء الالكتروني\n• الأمن السيبراني\n• نظم المعلومات الحاسوبية\n• علم البيانات والذكاء الاصطناعي'
    },
    {
      keywords: ['مدة', 'كم سنة', 'كم فصل'],
      answer: '📅 مدة الدراسة هي **4 سنوات** (8 فصول دراسية)، وبواقع **132 ساعة معتمدة**.'
    },
    {
      keywords: ['قبول', 'تسجيل', 'التحاق'],
      answer: '📋 التسجيل متاح حالياً لخريجي الثانوية العامة. يرجى زيارة قسم التسجيل في مبنى الجامعة أو صفحة تواصل معنا.'
    }
  ],
  en: []
};

export const getLocalFallback = (text, lang) => {
  const lower = text.toLowerCase();
  const data = curriculumData[lang] || curriculumData.ar;

  // 1. Check if asking for courses of a specific major
  const isAskingForCourses = lower.includes('مواد') || lower.includes('course') || lower.includes('subject');
  
  for (const spec of data.specializations) {
    const matchedKeyword = spec.logicKeywords.some(kw => lower.includes(kw.toLowerCase()));
    
    if (matchedKeyword) {
      if (isAskingForCourses) {
        const majorCourses = data.courses[spec.id] || [];
        if (majorCourses.length > 0) {
          let response = `📚 **أهم المواد في تخصص ${spec.name}:**\n\n`;
          majorCourses.forEach(c => {
            response += `• ${c.name} (${c.credits} ساعات)\n`;
          });
          response += `\n💡 هذه قائمة بأبرز المواد التخصصية، وللحصول على الخطة الكاملة يرجى مراجعة قسم التسجيل.`;
          return response;
        }
      } else {
        // Just asking about the major info
        return `🎯 **تخصص ${spec.name}:**\n${spec.description}\n\n💡 **نصيحة:** ${spec.advice}`;
      }
    }
  }

  // 2. Check Static KB
  const kb = LOCAL_KB[lang] || LOCAL_KB.ar;
  for (const entry of kb) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer;
    }
  }

  return lang === 'ar'
    ? 'يسعدني مساعدتك! يمكنك سؤالي عن تخصصات الكلية، أو كتابة "مواد + اسم التخصص" لمعرفة مساقاته الدراسية. 😊'
    : 'Happy to help! You can ask about our majors, or type "courses + major name" to see its curriculum. 😊';
};
