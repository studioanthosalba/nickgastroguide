'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function OsteriaRomanaDemoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Mamma mia che caos in cucina! Ripeti per favore?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePillClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="font-body text-on-surface overflow-x-hidden min-h-screen bg-[#131313] flex flex-col">
      {/* Top AppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-[0_20px_40px_rgba(229,226,225,0.04)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-tertiary-container hover:text-primary transition-colors mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
            <img 
              alt="Osteria Chef" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTCRniNopbm8S0tHmSMJNWrhK0x4hgsFc6PQJRxM8zgUS0SHMnqPhanH_UN3aGEFY-6jvwgPcy0dpU8eIkNxQpyIG0czKdlIo1BmjU6UXOLTXR5TyptVC4X0GZdAOPhifb2p8l-vVU_QhTNsEKnpRRQaBMGLn8F3DlXPIwscWLYmr9yMnFK32SwJgACvwflCfgFqSqPnKE2n5GQrVlKA0GwkO4iICDFRKgW7j6Ldgo8fA_ZW713XauwF8QWmc5QSUE3GdsEJfBiOE" 
            />
          </div>
          <span className="text-xl font-headline italic text-primary tracking-tight">Osteria Romana</span>
        </div>
        <button className="text-primary hover:opacity-80 transition-opacity active:duration-150 scale-95">
          <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 0" }}>restaurant_menu</span>
        </button>
      </nav>

      <main className="pt-24 pb-48 px-4 w-full max-w-2xl mx-auto flex-grow flex flex-col space-y-8">
        {/* Profile Header Block */}
        <motion.header 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-high rounded-lg p-6 flex items-start gap-4 shadow-lg shrink-0"
        >
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              alt="Osteria Chef" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTCRniNopbm8S0tHmSMJNWrhK0x4hgsFc6PQJRxM8zgUS0SHMnqPhanH_UN3aGEFY-6jvwgPcy0dpU8eIkNxQpyIG0czKdlIo1BmjU6UXOLTXR5TyptVC4X0GZdAOPhifb2p8l-vVU_QhTNsEKnpRRQaBMGLn8F3DlXPIwscWLYmr9yMnFK32SwJgACvwflCfgFqSqPnKE2n5GQrVlKA0GwkO4iICDFRKgW7j6Ldgo8fA_ZW713XauwF8QWmc5QSUE3GdsEJfBiOE" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-label font-medium uppercase tracking-widest text-[10px] text-primary mb-1">OSTE DIGITALE</span>
            <h1 className="text-2xl font-headline italic leading-tight text-on-surface mb-2">Benvenuti a Roma</h1>
            <p className="text-[11px] font-label uppercase tracking-widest text-tertiary-container">Tradizione e Passione Vera</p>
          </div>
        </motion.header>

        {/* Chat History */}
        <div className="space-y-6 flex-grow flex flex-col justify-end">
          <AnimatePresence>
            {/* Initial Welcome Message */}
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-1">
                <span className="text-[9px] font-label uppercase tracking-widest text-tertiary-container ml-2">L'OSTE</span>
                <div className="max-w-[85%] bg-gradient-to-br from-surface-container-highest to-surface-container-high rounded-xl rounded-tl-none p-4 text-sm leading-relaxed text-on-surface shadow-md whitespace-pre-wrap">
                  Ao'! Benvenuto all'Osteria Romana. Spero tu abbia fame. Io sono il tuo oste di fiducia, chiedimi cosa bolle in pentola o fatti consigliare er vino bono de li Castelli! 🍷
                </div>
              </motion.div>
            )}

            {messages.map((m, idx) => (
              m.role === 'user' ? (
                <motion.div key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-label uppercase tracking-widest text-tertiary-container mr-2">TU</span>
                  <div className="max-w-[85%] bg-gradient-to-br from-primary to-primary-container rounded-xl rounded-tr-none p-4 text-sm leading-relaxed text-[#4A1800] font-medium shadow-[0_4px_15px_rgba(203,125,96,0.3)] whitespace-pre-wrap">
                    {m.content}
                  </div>
                </motion.div>
              ) : (
                <motion.div key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-1">
                  <span className="text-[9px] font-label uppercase tracking-widest text-tertiary-container ml-2">L'OSTE</span>
                  <div className="max-w-[85%] bg-gradient-to-br from-surface-container-highest to-surface-container-high rounded-xl rounded-tl-none p-4 text-sm leading-relaxed text-on-surface shadow-md whitespace-pre-wrap">
                    {/* Simplified markdown parser for bold tags */}
                    {m.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-primary">{part}</strong> : part)}
                  </div>
                </motion.div>
              )
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 pl-2 mt-4">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-[9px] font-label uppercase tracking-widest text-tertiary-container">L'OSTE STA PENSANDO...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Bottom Input & Navigation Section */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <div className="px-4 py-4 bg-[#131313]/95 backdrop-blur-2xl border-t border-outline-variant/10">
          {/* Quick Actions */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1 max-w-2xl mx-auto">
            {['UN BUON VINO', 'COSA MI CONSIGLI?', 'MENU DELLA TRADIZIONE', 'PASSEGGIATA NEI DINTORNI'].map((pill) => (
              <button 
                key={pill} 
                onClick={() => handlePillClick(pill)}
                className="flex-shrink-0 px-4 py-2 bg-surface-container-high/60 border border-outline-variant/20 rounded-full text-[10px] font-label font-bold text-on-surface uppercase tracking-widest hover:bg-surface-container-highest hover:text-primary transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Main Input Field */}
          <form onSubmit={handleSend} className="relative flex items-center gap-2 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-tertiary-container select-none">add</span>
              </div>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-full py-4 pl-12 pr-4 text-sm text-on-surface placeholder:text-tertiary-container focus:ring-1 focus:ring-primary/20 focus:outline-none focus:border-primary/30 transition-all font-body" 
                placeholder="Chiedi all'oste..." 
                type="text" 
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-container text-[#4A1800] flex items-center justify-center shadow-[0_4px_15px_rgba(203,125,96,0.3)] hover:scale-105 active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
