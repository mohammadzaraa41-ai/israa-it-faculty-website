import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { useLocale } from '../contexts/LocalizationContext';
import { 
  getGeminiUrl, 
  SYSTEM_PROMPT, 
  QUICK_REPLIES_AR, 
  QUICK_REPLIES_EN, 
  getLocalFallback 
} from '../constants/chatbot';
import './Chatbot.css';

const TypingIndicator = () => (
  <div className="chat-bubble bot typing-bubble">
    <span className="dot" />
    <span className="dot" />
    <span className="dot" />
  </div>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { lang } = useLocale();

  const isAr = lang === 'ar';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: isAr
          ? 'مرحباً! 👋 أنا **إسرا**، مساعدك في كلية تكنولوجيا المعلومات. كيف يمكنني مساعدتك اليوم؟'
          : 'Hello! 👋 I\'m **Isra**, your assistant at the IT Faculty. How can I help you today?',
        isBot: true,
      }]);
    }
  }, [isOpen, isAr, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const callGeminiAPI = async (userText) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    // Final attempt with the most explicit model name and JSON flag
    const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
    const finalUrl = `${baseUrl}?key=${apiKey.trim()}&alt=json`;

    console.log('Target URL:', baseUrl); // Diagnostic

    const body = {
      contents: [{
        parts: [{ text: `${SYSTEM_PROMPT}\n\nالمستخدم: ${userText}` }]
      }]
    };

    const res = await fetch(finalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('Gemini API Details:', { status: res.status, data: errData });
      throw new Error(`API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  };

  const handleSend = async (text) => {
    const msgText = (text || input).trim();
    if (!msgText || isLoading) return;

    setShowQuickReplies(false);
    setInput('');
    setMessages(prev => [...prev, { text: msgText, isBot: false }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('No API Key found in Environment');

      console.log('--- Chatbot: Connecting to Gemini ---');
      const reply = await callGeminiAPI(msgText);
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    } catch (err) {
      console.error('Final Error Catch:', err);
      const fallback = getLocalFallback(msgText, lang);
      setMessages(prev => [...prev, { text: fallback, isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = isAr ? QUICK_REPLIES_AR : QUICK_REPLIES_EN;

  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <>
      <motion.button
        className="chatbot-fab"
        onClick={() => setIsOpen(true)}
        style={{ [isAr ? 'left' : 'right']: '2rem' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { scale: 0, opacity: 0, pointerEvents: 'none' } : { scale: 1, opacity: 1 }}
      >
        <Sparkles size={20} className="fab-sparkles" />
        <MessageSquare size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            style={{ [isAr ? 'left' : 'right']: '1.5rem' }}
            dir={isAr ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <Bot size={20} />
                  <span className="online-dot" />
                </div>
                <div>
                  <div className="chatbot-name">
                    {isAr ? 'إسرا — مساعد الطالب' : 'Isra — Student Support'}
                  </div>
                  <div className="chatbot-status">
                    {isAr ? 'متصل الآن' : 'Online'}
                  </div>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {renderText(msg.text)}
                </motion.div>
              ))}

              {isLoading && <TypingIndicator />}

              {showQuickReplies && messages.length === 1 && (
                <div className="quick-replies">
                  {quickReplies.map((q, i) => (
                    <button key={i} className="quick-reply-btn" onClick={() => handleSend(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
              <input
                ref={inputRef}
                className="chatbot-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Ask anything...'}
                disabled={isLoading}
              />
              <button
                className="chatbot-send-btn"
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
