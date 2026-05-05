import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { useLocale } from '../contexts/LocalizationContext';
import { 
  SYSTEM_PROMPT, 
  QUICK_REPLIES_AR, 
  QUICK_REPLIES_EN, 
  getLocalFallback 
} from '../constants/chatbot';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  
  const messagesEndRef = useRef(null);
  const { lang } = useLocale();
  const isAr = lang === 'ar';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: isAr ? 'مرحباً! أنا إسرا. كيف أساعدك؟' : 'Hi! I am Isra. How can I help?',
        isBot: true,
      }]);
    }
  }, [isOpen, isAr, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const callGeminiAPI = async (userText) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    // Attempting multiple endpoints to bypass regional/account 404s
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey.trim()}`
    ];

    let lastError = null;
    for (const url of endpoints) {
      try {
        console.log('Trying endpoint:', url.split('?')[0]);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${userText}` }] }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        }
        console.warn(`Endpoint failed with status: ${res.status}`);
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('All endpoints failed');
  };

  const handleSend = async (text) => {
    const msgText = (text || input).trim();
    if (!msgText || isLoading) return;

    setShowQuickReplies(false);
    setInput('');
    setMessages(prev => [...prev, { text: msgText, isBot: false }]);
    setIsLoading(true);

    try {
      const reply = await callGeminiAPI(msgText);
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    } catch (err) {
      console.error('Final Chatbot Error:', err);
      const fallback = getLocalFallback(msgText, lang);
      setMessages(prev => [...prev, { text: fallback, isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderText = (text) => {
    if (!text) return null;
    return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <>
      <motion.button className="chatbot-fab" onClick={() => setIsOpen(true)} style={{ [isAr ? 'left' : 'right']: '2rem' }}>
        <MessageSquare size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="chatbot-window" style={{ [isAr ? 'left' : 'right']: '1.5rem' }} dir={isAr ? 'rtl' : 'ltr'} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
            <div className="chatbot-header">
              <div className="chatbot-name">{isAr ? 'إسرا — مساعد الطالب' : 'Isra — Support'}</div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>{renderText(msg.text)}</div>
              ))}
              {isLoading && <div className="typing">...</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input-area">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="..." />
              <button onClick={() => handleSend()}><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
