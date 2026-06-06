import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { useLocale } from '../contexts/LocalizationContext';
import { 
  QUICK_REPLIES_AR, 
  QUICK_REPLIES_EN, 
  getLocalFallback,
  getGeminiUrl,
  SYSTEM_PROMPT
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
  const { lang } = useLocale();
  const isAr = lang === 'ar';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: isAr
          ? 'مرحباً! 👋 أنا **إسرا**، مساعدك الذكي في كلية تكنولوجيا المعلومات. كيف يمكنني مساعدتك اليوم؟'
          : 'Hello! 👋 I\'m **Isra**, your smart assistant at the IT Faculty. How can I help you today?',
        isBot: true,
      }]);
    }
  }, [isOpen, isAr, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const msgText = (text || input).trim();
    if (!msgText || isLoading) return;

    setShowQuickReplies(false);
    setInput('');
    const userMessage = { text: msgText, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiKeyExists = !!import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKeyExists) {
        // Fallback to local intelligence if no API key
        setTimeout(() => {
          const reply = getLocalFallback(msgText, lang);
          setMessages(prev => [...prev, { text: reply, isBot: true }]);
          setIsLoading(false);
        }, 600);
        return;
      }

      const currentMessages = [...messages, userMessage];
      
      // Gemini API requires the first message in the history to be from 'user'.
      // We need to filter out any leading messages from 'model'.
      let startIndex = 0;
      while (startIndex < currentMessages.length && currentMessages[startIndex].isBot) {
        startIndex++;
      }
      
      const history = currentMessages.slice(startIndex).map(msg => ({
        role: msg.isBot ? "model" : "user",
        parts: [{ text: msg.text }]
      }));

      const payload = {
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: history,
        generationConfig: {
          temperature: 0.7,
        }
      };

      const response = await fetch(getGeminiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!botReply) {
        throw new Error("No response from Gemini");
      }

      setMessages(prev => [...prev, { text: botReply, isBot: true }]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages(prev => [...prev, { text: `⚠️ خطأ في الاتصال بالذكاء الاصطناعي: ${error.message}`, isBot: true }]);
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
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <Bot size={20} />
                  <span className="online-dot" />
                </div>
                <div>
                  <div className="chatbot-name">{isAr ? 'إسرا — مساعد الكلية' : 'Isra — IT Advisor'}</div>
                  <div className="chatbot-status">{isAr ? 'نشط الآن' : 'Active Now'}</div>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                  {renderText(msg.text)}
                </div>
              ))}
              {isLoading && <TypingIndicator />}
              {showQuickReplies && messages.length === 1 && (
                <div className="quick-replies">
                  {(isAr ? QUICK_REPLIES_AR : QUICK_REPLIES_EN).map((q, i) => (
                    <button key={i} className="quick-reply-btn" onClick={() => handleSend(q)}>{q}</button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
              <input
                className="chatbot-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Ask anything...'}
              />
              <button className="chatbot-send-btn" onClick={() => handleSend()} disabled={!input.trim()}>
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
