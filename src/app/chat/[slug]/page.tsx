'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Utensils, MapPin, ChevronDown, ChevronUp,
  Sparkles, Bot, Loader2, Clock, Star
} from 'lucide-react';
import { insforge } from '@/lib/insforge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MenuItem {
  name: string;
  description?: string;
  price: string;
  allergens?: string[];
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface RestaurantData {
  name: string;
  slug: string;
  location?: string;
  primary_color?: string;
  logo_url?: string;
  google_review_link?: string;
  persuasion_text?: string;
  menu_text?: string;
  menu_json?: { categories: MenuCategory[] } | any;
}

const quickActions = [
  { emoji: '📋', text: 'Mostrami il menu' },
  { emoji: '⭐', text: 'Consigliami un piatto' },
  { emoji: '📍', text: 'Cosa visitare qui vicino?' },
  { emoji: '💎', text: 'Come vi raggiungo?' },
];

export default function ChatPage({ params }: { params: { slug: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accentColor = restaurant?.primary_color || '#f59e0b';

  // Load restaurant data
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const { data, error } = await insforge.database
          .from('restaurants')
          .select('*')
          .eq('slug', params.slug)
          .single();

        if (data && !error) {
          const rData = data as any;
          setRestaurant({
            ...rData,
            menu_json: typeof rData.menu_json === 'string' ? JSON.parse(rData.menu_json) : rData.menu_json,
          } as RestaurantData);
          
          // Initial greeting
          const greeting: Message = {
            id: 'welcome',
            role: 'assistant',
            content: `Ciao! 👋 Benvenuto da **${data.name}**! Sono il tuo assistente virtuale. Posso aiutarti con il menu, consigliarti piatti o darti informazioni sulla nostra posizione. Come posso aiutarti?`,
            timestamp: new Date(),
          };
          setMessages([greeting]);
        } else {
          // Fallback: create a mock restaurant
          const fallback: RestaurantData = {
            name: params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            slug: params.slug,
          };
          setRestaurant(fallback);
          setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: `Ciao! 👋 Benvenuto da **${fallback.name}**! Sono il tuo assistente virtuale. Come posso aiutarti?`,
            timestamp: new Date(),
          }]);
        }
      } catch (err) {
        console.error('Error loading restaurant:', err);
      } finally {
        setIsLoadingRestaurant(false);
      }
    };

    loadRestaurant();
  }, [params.slug]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build context for the AI
      const menuContext = restaurant?.menu_json 
        ? JSON.stringify(restaurant.menu_json) 
        : 'Menu non disponibile al momento.';

      const systemPrompt = `Sei un cameriere virtuale super cordiale e professionale del ristorante "${restaurant?.name}".
Posizione: ${restaurant?.location || 'Non specificata'}
${restaurant?.google_review_link ? `Link recensioni Google: ${restaurant.google_review_link}` : ''}
${restaurant?.persuasion_text ? `\n[DIRETTIVA VENDITA PERSONALE DAL TITOLARE]: ${restaurant.persuasion_text}` : ''}

Menu del ristorante:
${menuContext}

Rispondi SEMPRE in italiano, in modo naturale e accogliente. Usa emoji con moderazione.
Se ti chiedono del menu, elenca i piatti con prezzi.
Se ti chiedono consigli, suggerisci piatti specifici dal menu.
Se ti chiedono di attrazioni turistiche, usa la posizione del ristorante per dare consigli pertinenti.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
          restaurantSlug: params.slug,
          location: restaurant?.location,
        }),
      });

      const result = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response || 'Mi scuso, si è verificato un errore. Per favore riprova.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Mi scuso, si è verificato un problema tecnico. Per favore riprova tra un momento. 🙏',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (isLoadingRestaurant) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">Caricamento ristorante...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-body text-on-surface overflow-x-hidden min-h-screen bg-[#131313] flex flex-col">
      {/* Top AppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-[0_20px_40px_rgba(229,226,225,0.04)] border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="text-tertiary-container hover:text-primary transition-colors mr-2">
            <Send className="w-5 h-5 rotate-180" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 bg-surface-container">
            {restaurant?.logo_url ? (
              <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Utensils className="w-5 h-5" style={{ color: accentColor }} />
              </div>
            )}
          </div>
          <span className="text-xl font-headline italic text-primary tracking-tight">{restaurant?.name}</span>
        </div>
        
        {/* Menu Toggle Button */}
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${showMenu ? 'bg-primary text-[#4A1800]' : 'text-primary hover:bg-primary/10'}`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-label font-bold uppercase tracking-widest hidden sm:inline">Menu</span>
        </button>
      </nav>

      <main className="pt-24 pb-48 px-4 w-full max-w-2xl mx-auto flex-grow flex flex-col space-y-8">
        {/* Profile Header Block */}
        <motion.header 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-high rounded-lg p-6 flex items-start gap-4 shadow-lg shrink-0"
        >
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container shadow-inner border border-outline-variant/20">
            {restaurant?.logo_url ? (
              <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Utensils className="w-8 h-8 opacity-20" style={{ color: accentColor }} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-label font-medium uppercase tracking-widest text-[10px] text-primary mb-1">OSTE DIGITALE</span>
            <h1 className="text-2xl font-headline italic leading-tight text-on-surface mb-2">Benvenuti da {restaurant?.name}</h1>
            <p className="text-[11px] font-label uppercase tracking-widest text-tertiary-container">
              {restaurant?.location || 'Tradizione e Passione Vera'}
            </p>
          </div>
        </motion.header>

        {/* Chat History */}
        <div className="space-y-6 flex-grow flex flex-col justify-end">
          <AnimatePresence>
            {messages.map((m) => (
              m.role === 'user' ? (
                <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-label uppercase tracking-widest text-tertiary-container mr-2">TU</span>
                  <div className="max-w-[85%] bg-gradient-to-br from-primary to-primary-container rounded-xl rounded-tr-none p-4 text-sm leading-relaxed text-[#4A1800] font-medium shadow-[0_4px_15px_rgba(203,125,96,0.3)] whitespace-pre-wrap">
                    {m.content}
                  </div>
                </motion.div>
              ) : (
                <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-1">
                  <span className="text-[9px] font-label uppercase tracking-widest text-tertiary-container ml-2">L'OSTE</span>
                  <div className="max-w-[85%] bg-gradient-to-br from-surface-container-highest to-surface-container-high rounded-xl rounded-tl-none p-4 text-sm leading-relaxed text-on-surface shadow-md whitespace-pre-wrap">
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

        {/* Menu Panel */}
        <AnimatePresence>
          {showMenu && restaurant?.menu_json?.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-surface-container-low border border-outline-variant/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <h3 className="text-on-surface font-headline italic text-lg mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" /> Il Nostro Menu
                </h3>
                <div className="space-y-3">
                  {restaurant.menu_json.categories.map((cat: MenuCategory, i: number) => (
                    <div key={i} className="bg-surface-container-high/40 rounded-xl overflow-hidden border border-outline-variant/5">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === i ? null : i)}
                        className="w-full flex items-center justify-between px-5 py-3 text-left"
                      >
                        <span className="text-on-surface font-semibold text-sm">{cat.name}</span>
                        <ChevronDown className={`w-4 h-4 text-tertiary-container transition-transform ${expandedCategory === i ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedCategory === i && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 space-y-3">
                              {cat.items.map((item, j) => (
                                <div key={j} className="flex justify-between items-start">
                                  <div>
                                    <p className="text-on-surface text-sm font-medium">{item.name}</p>
                                    {item.description && (
                                      <p className="text-tertiary-container text-xs mt-0.5">{item.description}</p>
                                    )}
                                  </div>
                                  <span className="text-primary text-sm font-bold ml-4 whitespace-nowrap">€{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Quick Actions & Input Section */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <div className="px-4 py-4 bg-[#131313]/95 backdrop-blur-2xl border-t border-outline-variant/10">
          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1 max-w-2xl mx-auto">
              {quickActions.map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => sendMessage(action.text)}
                  className="flex-shrink-0 px-4 py-2 bg-surface-container-high/60 border border-outline-variant/20 rounded-full text-[10px] font-label font-bold text-on-surface uppercase tracking-widest hover:bg-surface-container-highest hover:text-primary transition-colors"
                >
                  {action.emoji} {action.text}
                </button>
              ))}
            </div>
          )}

          {/* Main Input Field */}
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-tertiary-container select-none">add</span>
              </div>
              <input 
                ref={inputRef}
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
