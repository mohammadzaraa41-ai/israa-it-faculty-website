import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, RefreshCw } from 'lucide-react';
import { curriculumData } from '../constants/curriculum';

const AIAdvisor = () => {
  const { lang } = useLocale();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const data = curriculumData[lang];

  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          { text: data.generalResponses.greeting, isBot: true },
          { text: data.generalResponses.askInterest, isBot: true, showOptions: true }
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
          advice: foundSpec.advice 
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        responseText = data.generalResponses.notFound;
        setMessages(prev => [...prev, { text: responseText, isBot: true, showOptions: true }]);
      }
      
      setIsTyping(false);
    }, 1500);
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
      maxWidth: '900px', 
      margin: '0 auto', 
      height: 'calc(100vh - 150px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '1.5rem' }}
      >
        <h1 className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Sparkles className="accent-color" />
          {lang === 'ar' ? 'الموجه الأكاديمي الذكي' : 'Smart Academic Advisor'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? 'مساعدك الشخصي لاختيار التخصص والمواد الدراسية' : 'Your personal assistant for major and course selection'}
        </p>
      </motion.div>

      <div className="glass-panel" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        position: 'relative'
      }}>
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          style={{ 
            flex: 1, 
            padding: '2rem', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            scrollBehavior: 'smooth'
          }}
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.isBot ? -20 : 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                style={{
                  alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.isBot ? 'flex-start' : 'flex-end',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                  {msg.isBot ? (
                    <>
                      <div style={{ padding: '4px', borderRadius: '50%', background: 'var(--primary-color)' }}>
                        <Bot size={14} color="var(--accent-color)" />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>AI Advisor</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'أنت' : 'You'}</span>
                      <div style={{ padding: '4px', borderRadius: '50%', background: 'var(--accent-color)' }}>
                        <User size={14} color="#000" />
                      </div>
                    </>
                  )}
                </div>

                <div 
                  className={msg.isBot ? "glass-panel-light" : ""}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: msg.isBot 
                      ? (lang === 'ar' ? '0 18px 18px 18px' : '18px 18px 18px 0')
                      : (lang === 'ar' ? '18px 0 18px 18px' : '18px 18px 0 18px'),
                    backgroundColor: msg.isBot ? 'rgba(255,255,255,0.05)' : 'var(--primary-color)',
                    color: msg.isBot ? 'var(--text-primary)' : '#fff',
                    border: msg.isBot ? '1px solid var(--border-color)' : 'none',
                    boxShadow: msg.isBot ? 'none' : '0 4px 15px rgba(0,0,0,0.2)',
                    lineHeight: '1.6'
                  }}
                >
                  {msg.text}

                  {msg.advice && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        marginTop: '1.25rem',
                        padding: '1.25rem', 
                        background: 'rgba(161, 23, 44, 0.15)', 
                        borderLeft: lang === 'ar' ? 'none' : '4px solid var(--accent-color)',
                        borderRight: lang === 'ar' ? '4px solid var(--accent-color)' : 'none',
                        borderRadius: '12px',
                        fontStyle: 'italic',
                        color: '#fff',
                        fontSize: '0.95rem',
                        lineHeight: '1.7',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Sparkles size={18} style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }} />
                      <p>{msg.advice}</p>
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

        {/* Input Area */}
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

export default AIAdvisor;
