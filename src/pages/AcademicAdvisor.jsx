import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, GraduationCap, RefreshCw, UserCheck, ShieldCheck } from 'lucide-react';
import { curriculumData } from '../constants/curriculum';

const AcademicAdvisor = () => {
  const { lang } = useLocale();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const data = curriculumData[lang] || curriculumData.ar;

  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          { 
            text: data.generalResponses.greeting, 
            isBot: true,
            title: lang === 'ar' ? 'ترحيب أكاديمي' : 'Academic Greeting'
          },
          { 
            text: data.generalResponses.askInterest, 
            isBot: true, 
            showOptions: true 
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [lang, messages.length, data.generalResponses]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const processMessage = (text) => {
    const userMsg = { text: text, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "";
      let foundSpec = null;

      const lowerText = text.toLowerCase();
      foundSpec = data.specializations.find(spec => 
        spec.logicKeywords.some(kw => lowerText.includes(kw))
      );

      if (foundSpec) {
        responseText = data.generalResponses.suggestionPrefix.replace('{name}', foundSpec.name);
        
        const botMsg = { 
          text: responseText, 
          isBot: true, 
          advice: foundSpec.advice,
          specName: foundSpec.name,
          title: lang === 'ar' ? 'توصية المسار الدراسي' : 'Curriculum Recommendation'
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        responseText = data.generalResponses.notFound;
        setMessages(prev => [...prev, { 
          text: responseText, 
          isBot: true, 
          showOptions: true,
          title: lang === 'ar' ? 'تنبيه' : 'Note'
        }]);
      }
      
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    processMessage(input);
    setInput('');
  };

  const handleOptionClick = (spec) => {
    processMessage(spec.name);
  };

  return (
    <div style={{ 
      padding: '1rem', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      height: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '1.5rem' }}
      >
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          background: 'rgba(161, 23, 44, 0.1)', 
          padding: '0.5rem 1.5rem', 
          borderRadius: '50px',
          border: '1px solid rgba(161, 23, 44, 0.3)',
          marginBottom: '1rem'
        }}>
          <GraduationCap className="accent-color" size={24} />
          <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>
            {lang === 'ar' ? 'مركز الإرشاد الأكاديمي' : 'Academic Counseling Center'}
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          {lang === 'ar' 
            ? 'جلسة استشارية متخصصة لمساعدتك في رسم مسارك المهني والأكاديمي بكل ثقة.' 
            : 'A specialized counseling session to help you map your professional and academic path with confidence.'}
        </p>
      </motion.div>

      <div className="glass-panel" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div 
          ref={scrollRef}
          style={{ 
            flex: 1, 
            padding: '2rem', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            background: 'radial-gradient(circle at top right, rgba(161, 23, 44, 0.05), transparent)'
          }}
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.isBot ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  width: msg.advice ? '100%' : 'auto'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '6px', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
                  {msg.isBot ? (
                    <>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-color)' }}>
                        <UserCheck size={18} color="var(--accent-color)" />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {lang === 'ar' ? 'المستشار الأكاديمي' : 'Academic Advisor'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الطالب' : 'Student'}</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="#000" />
                      </div>
                    </>
                  )}
                </div>

                <div 
                  className={msg.isBot ? "glass-panel-light" : ""}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: msg.isBot 
                      ? (lang === 'ar' ? '0 20px 20px 20px' : '20px 20px 20px 0')
                      : (lang === 'ar' ? '20px 0 20px 20px' : '20px 20px 0 20px'),
                    backgroundColor: msg.isBot ? 'rgba(255,255,255,0.03)' : 'var(--primary-color)',
                    color: msg.isBot ? 'var(--text-primary)' : '#fff',
                    border: msg.isBot ? '1px solid var(--border-color)' : 'none',
                    boxShadow: msg.isBot ? 'inset 0 0 20px rgba(0,0,0,0.1)' : '0 10px 25px rgba(161, 23, 44, 0.3)',
                    lineHeight: '1.7',
                    fontSize: '1rem'
                  }}
                >
                  {msg.text}

                  {msg.advice && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ 
                        marginTop: '1.5rem',
                        padding: '1.5rem', 
                        background: 'linear-gradient(145deg, rgba(161, 23, 44, 0.1), rgba(0,0,0,0.3))', 
                        border: '1px solid rgba(161, 23, 44, 0.4)',
                        borderLeft: lang === 'ar' ? '1px solid rgba(161, 23, 44, 0.4)' : '5px solid var(--accent-color)',
                        borderRight: lang === 'ar' ? '5px solid var(--accent-color)' : '1px solid rgba(161, 23, 44, 0.4)',
                        borderRadius: '15px',
                        color: '#fff',
                        fontSize: '1rem',
                        lineHeight: '1.8',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-color)' }}>
                        <ShieldCheck size={20} />
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                          {lang === 'ar' ? 'توصية الخبير' : 'Expert Recommendation'}
                        </span>
                      </div>
                      <p style={{ margin: 0 }}>{msg.advice}</p>
                    </motion.div>
                  )}
                </div>

                {msg.showOptions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {data.specializations.map(spec => (
                      <button 
                        key={spec.id}
                        className="btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => handleOptionClick(spec)}
                      >
                        {spec.name}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ alignSelf: 'flex-start', marginLeft: '2.5rem' }}
              >
                <div style={{ display: 'flex', gap: '4px', padding: '10px 15px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-color)' }} />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-color)' }} />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-color)' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          borderTop: '1px solid var(--border-color)', 
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <button 
            className="btn-outline" 
            style={{ padding: '0.75rem', borderRadius: '12px' }}
            onClick={() => setMessages([])}
            title={lang === 'ar' ? 'إعادة البدء' : 'Restart'}
          >
            <RefreshCw size={20} />
          </button>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'ar' ? 'اكتب استفسارك هنا (مثلاً: أريد التخصص في الأمن السيبراني)' : 'Type your inquiry here (e.g., I want to major in Cyber Security)'}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
          
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="btn-primary"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              opacity: !input.trim() || isTyping ? 0.5 : 1
            }}
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicAdvisor;
