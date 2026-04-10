'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ChefHat, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Bell,
  Link as LinkIcon,
  Download,
  Sparkles,
  MapPin,
  Star,
  CheckCircle2,
  Image as ImageIcon,
  X,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { insforge } from '@/lib/insforge';
import { ADMIN_EMAILS } from '@/lib/constants';

const StatsCard = ({ title, value, icon, trend }: any) => (
  <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-950 rounded-2xl border border-white/5">
        {icon}
      </div>
      {trend && (
        <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
          {trend}
        </span>
      )}
    </div>
    <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{title}</p>
    <h3 className="text-2xl font-black text-white mt-1 tracking-tight">{value}</h3>
  </div>
);

export default function DashboardPage() {
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'success' | 'saving'>('idle');
  const [menuJson, setMenuJson] = useState<any>(null);
  const [menuText, setMenuText] = useState('');
  const [isPersuasionModalOpen, setPersuasionModalOpen] = useState(false);
  const [persuasionText, setPersuasionText] = useState('Vendi la selezione di Vini Locali (Ricarico +20%) con i piatti di carne ✨');
  const [isAdmin, setIsAdmin] = useState(false);

  // Restaurant Settings State
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState('Ristorante Nick');
  const [slug, setSlug] = useState('nick-ristorante-123');
  const [primaryColor, setPrimaryColor] = useState('#ffb59e');
  const [location, setLocation] = useState('');
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [reviewClickCount, setReviewClickCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error' | 'saving'>('idle');
  
  // Location Autocomplete State
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // QR Modal State
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadQR = async () => {
     if (!cardRef.current) return;
     try {
       const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
       const link = document.createElement('a');
       link.download = `Segnatavolo-${slug}.png`;
       link.href = dataUrl;
       link.click();
     } catch (err) {
       console.error('Error downloading QR:', err);
     }
  };

  useEffect(() => {
    const initDashboard = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      
      if (!data?.user) return;

      const userIsAdmin = data.user.email && ADMIN_EMAILS.includes(data.user.email.toLowerCase());
      if (userIsAdmin) {
        setIsAdmin(true);
      }

      // Guard: if user is an agent (and not admin), redirect to agent dashboard
      if (!userIsAdmin) {
        const { data: userRow } = await insforge.database
          .from('users')
          .select('is_agent')
          .eq('id', data.user.id)
          .single();
        
        if (userRow?.is_agent) {
          window.location.href = '/agent-dashboard';
          return;
        }
      }

      const { data: rData, error: rError } = await insforge.database
        .from('restaurants')
        .select('*')
        .eq('owner_id', data.user.id)
        .maybeSingle();

      if (rData) {
        setRestaurantId(rData.id);
        setRestaurantName(rData.name || 'Il Mio Ristorante');
        setSlug(rData.slug || 'la-mia-chat');
        setPrimaryColor(rData.primary_color || '#ffb59e');
        setLocation(rData.location || '');
        setGoogleReviewLink(rData.google_review_link || '');
        setMenuText(rData.menu_text || ''); 
        if (rData.persuasion_text) setPersuasionText(rData.persuasion_text);
        if (rData.menu_json) setMenuJson(rData.menu_json);

        // Fetch review click count
        const { count } = await insforge.database
          .from('review_clicks')
          .select('*', { count: 'exact', head: true })
          .eq('restaurant_id', rData.id);
        setReviewClickCount(count || 0);
      }
    };
    initDashboard();
  }, []);

  const handleSaveSettings = async () => {
    const { data: userData } = await insforge.auth.getCurrentUser();
    if (!userData?.user) return;

    setSaveStatus('saving');
    
    try {
      const payload = {
        owner_id: userData.user.id,
        name: restaurantName,
        slug: slug,
        primary_color: primaryColor,
        location: location,
        google_review_link: googleReviewLink,
        menu_text: menuText,
        persuasion_text: persuasionText
      };

      let result;
      if (restaurantId) {
        result = await insforge.database
          .from('restaurants')
          .update(payload)
          .eq('id', restaurantId)
          .select()
          .single();
      } else {
        result = await insforge.database
          .from('restaurants')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;
      if (result.data && result.data.id) {
        setRestaurantId(result.data.id);
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error("Save Error:", err);
      setSaveStatus('error');
    }
  };

  // Location Autocomplete Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (location.length > 3 && isSearchingLocation) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&addressdetails=1&limit=5&countrycodes=it`);
          const data = await res.json();
          setLocationSuggestions(data);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Geocoding Error:", err);
        } finally {
          setIsSearchingLocation(false);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [location, isSearchingLocation]);

  const selectSuggestion = (sug: any) => {
    setLocation(sug.display_name);
    setShowSuggestions(false);
    setIsSearchingLocation(false);
  };

  useEffect(() => {
    if (!restaurantId && restaurantName) {
       const newSlug = restaurantName
         .toLowerCase()
         .replace(/[^\w\s-]/g, '')
         .replace(/[\s_-]+/g, '-')
         .replace(/^-+|-+$/g, '') 
         + '-' + Math.random().toString(36).substring(2, 6);
       setSlug(newSlug);
    }
  }, [restaurantName, restaurantId]);


  const handleStructureMenu = async () => {
    if(!menuText.trim() || !restaurantId) {
      alert("Inserisci il testo del menu e assicurati che il locale sia salvato (premi Salva prima).");
      return;
    }
    
    setAiState('loading');
    
    try {
      const res = await fetch('/api/menu-parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: menuText,
          restaurantId: restaurantId
        })
      });

      const jsonResponse = await res.json();
      
      if (!res.ok || !jsonResponse.success) {
        throw new Error(jsonResponse.error || "Errore sconosciuto durante il parsing AI");
      }

      const { error } = await insforge.database
        .from('restaurants')
        .update({ menu_json: jsonResponse.data })
        .eq('id', restaurantId);

      if (error) throw error;
      
      setAiState('success');
      setMenuJson(jsonResponse.data);
      
    } catch (err: any) {
      console.error("Strutturazione Menu Fallita:", err);
      alert("C'è stato un problema: " + err.message);
      setAiState('idle');
    }
  };

  return (

    <div className="min-h-screen bg-black flex flex-col text-white selection:bg-primary/30 selection:text-primary font-sans">
      {/* Main Content */}
      <main className="flex-grow p-10 bg-zinc-950/20 max-w-[1600px] w-full mx-auto overflow-y-auto custom-scrollbar">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-1">Area Ristorante</h1>
            <p className="text-zinc-500 text-sm font-medium">Configura l'AI, il Menu e le azioni di Persuasione</p>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
               <Link href="/admin" className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl hover:bg-emerald-500/20 transition-all flex items-center gap-2 font-bold text-xs">
                 <ShieldCheck className="w-4 h-4" /> Dashboard Admin
               </Link>
            )}
            <button className="p-3 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-colors relative">
              <Bell className="w-5 h-5 text-zinc-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-zinc-900" />
            </button>
            <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 px-4 py-2 rounded-2xl">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: primaryColor }} />
              <span className="text-sm font-bold text-zinc-200">{restaurantName || 'Il mio Ristorante'}</span>
            </div>
            <button 
              className="p-3 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all group"
              title="Esci"
              onClick={async () => { await insforge.auth.signOut(); window.location.href = '/login'; }}
            >
              <LogOut className="w-5 h-5 text-zinc-400 group-hover:text-red-500" />
            </button>
          </div>
        </header>

        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-zinc-900 border border-primary/20 p-6 rounded-3xl mb-8 shadow-[0_0_30px_rgba(255,181,158,0.05)]">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
             <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
             </div>
             <div>
               <h3 className="font-bold text-lg mb-1">Il tuo AI Concierge è attivo!</h3>
               <div className="flex items-center gap-2 text-zinc-400 text-sm">
                 <LinkIcon className="w-4 h-4" />
                 <span className="select-all">https://nickgastroguide.it/chat/{slug}</span>
                 <a 
                   href={`/chat/${slug}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="ml-3 px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-full hover:bg-primary hover:text-black transition-colors"
                 >
                   Testa Chat
                 </a>
               </div>
             </div>
          </div>
          <button 
            onClick={() => setQRModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3 bg-white text-black font-black text-sm rounded-xl hover:bg-zinc-200 transition-all"
          >
            <Download className="w-4 h-4" /> Scarica QR Code Tavoli
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          <div className="w-full max-w-md">
            <StatsCard title="Click Link Recensioni" value={reviewClickCount.toString()} icon={<Star className="w-6 h-6 text-amber-500" />} trend={reviewClickCount > 0 ? `${reviewClickCount} totali` : undefined} />
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid lg:grid-cols-12 gap-8 pb-10">
          
          {/* Left Column: Data Entry Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
             
             {/* Identity, Location & Aesthetics Combined (Section 1) */}
             <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
                      <span className="w-2 h-6 bg-primary rounded-full"></span> 1. Identità, Brand & Localizzazione
                    </h3>
                    {saveStatus === 'success' && (
                      <span className="text-emerald-500 text-[10px] font-black uppercase bg-emerald-500/10 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
                        Salvato ✅
                      </span>
                    )}
                </div>

                <div className="space-y-8 relative z-10">
                    {/* Restaurant Name */}
                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Nome del Locale</label>
                        <input 
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            type="text" 
                            placeholder="Es. Osteria Romana da Nick..." 
                            className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-white focus:ring-1 focus:ring-primary/20" 
                        />
                    </div>

                    {/* Location & Reviews Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="relative">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" /> Indirizzo Locale (Autocomplete)
                          </label>
                          <div className="relative">
                            <input 
                              value={location}
                              onChange={(e) => {
                                setLocation(e.target.value);
                                setIsSearchingLocation(true);
                              }}
                              onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                              type="text" 
                              placeholder="Cerca via e città..." 
                              className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-white pl-12" 
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                            {isSearchingLocation && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                          
                          {/* Suggestions Dropdown */}
                          {showSuggestions && locationSuggestions.length > 0 && (
                            <div className="absolute z-50 mt-2 w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                               {locationSuggestions.map((sug, idx) => (
                                 <button
                                   key={idx}
                                   onClick={() => selectSuggestion(sug)}
                                   className="w-full text-left px-5 py-4 text-xs hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors flex items-start gap-4"
                                 >
                                    <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                    <span className="text-zinc-300 leading-relaxed">{sug.display_name}</span>
                                 </button>
                               ))}
                            </div>
                          )}
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" /> Link Recensioni Google
                          </label>
                          <input 
                            value={googleReviewLink}
                            onChange={(e) => setGoogleReviewLink(e.target.value)}
                            type="text" 
                            placeholder="Incolla il link del profilo Google Business..." 
                            className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all text-white" 
                          />
                       </div>
                    </div>

                    {/* Aesthetics (Colors & Logo) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                       <div>
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Palette Colore AI</label>
                          <div className="flex flex-wrap gap-4">
                             {[ 
                               { h: '#ffb59e', n: 'Arancio Brand' }, 
                               { h: '#10b981', n: 'Emerald' }, 
                               { h: '#3b82f6', n: 'Ocean Blue' }, 
                               { h: '#8b5cf6', n: 'Violet' },
                               { h: '#ef4444', n: 'Red' } 
                             ].map((c) => (
                               <button 
                                 key={c.h}
                                 onClick={() => setPrimaryColor(c.h)}
                                 className={`w-12 h-12 rounded-2xl border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                                   primaryColor === c.h 
                                   ? 'border-white scale-110 shadow-lg shadow-white/5' 
                                   : 'border-white/5 opacity-50'
                                 }`}
                                 style={{ backgroundColor: c.h }}
                               >
                                 {primaryColor === c.h && <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Logo Identità</label>
                          <button className="w-full h-12 border border-dashed border-white/10 rounded-xl hover:border-white/30 hover:bg-white/5 transition-colors flex items-center justify-center gap-3 text-xs font-bold text-zinc-400">
                             <ImageIcon className="w-4 h-4" /> Carica Logo (1:1)
                          </button>
                       </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                   <p className="text-[10px] text-zinc-500 font-bold max-w-[200px] leading-relaxed uppercase tracking-tighter">
                     I cambiamenti saranno visibili istantaneamente sulla tua Chat pubblica.
                   </p>
                   <button 
                     onClick={handleSaveSettings}
                     disabled={saveStatus === 'saving'}
                     className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${
                       saveStatus === 'saving' 
                       ? 'bg-zinc-800 text-zinc-500 cursor-wait' 
                       : 'bg-primary text-black hover:bg-white hover:scale-[1.03] active:scale-95 shadow-xl shadow-primary/20'
                     }`}
                   >
                     {saveStatus === 'saving' ? (
                       <>
                         <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                         Salvataggio...
                       </>
                     ) : (
                       <>
                         <ShieldCheck className="w-5 h-5" /> Salva Configurazione
                       </>
                     )}
                   </button>
                </div>
             </div>

             {/* Raw Menu Input (Section 2) */}
             <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-2 tracking-tight flex items-center gap-3">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full"></span> 2. Database Menu AI
                </h3>
                <p className="text-xs text-zinc-500 mb-8 leading-relaxed">
                  Incolla qui il menu testuale. L'AI estrarrà piatti, allergeni e suggerimenti di vendita.
                </p>
                
                <textarea 
                  value={menuText}
                  onChange={(e) => setMenuText(e.target.value)}
                  placeholder="Incolla il testo del tuo menu qui..."
                  className="w-full h-80 bg-black border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-emerald-500/50 transition-all text-white resize-none font-mono focus:ring-1 focus:ring-emerald-500/20"
                />

                <button 
                  onClick={handleStructureMenu}
                  disabled={aiState === 'loading' || !menuText.trim()}
                  className={`w-full mt-6 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all ${
                    aiState === 'loading' 
                      ? 'bg-emerald-500/20 text-emerald-500/50 cursor-wait'
                      : menuText.trim() 
                        ? 'bg-emerald-500 text-black hover:bg-white hover:scale-[1.01] shadow-xl shadow-emerald-500/10'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {aiState === 'loading' ? (
                     <>
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Elaborazione DeepSeek...
                     </>
                  ) : (
                     <>
                        <Sparkles className="w-6 h-6" /> 
                        Sincronizza Menu con l'AI
                     </>
                  )}
                </button>
             </div>
          </div>

          {/* Right Column: AI Output Preview & Persuasion */}
          <div className="lg:col-span-5 flex flex-col gap-8">
             
             {/* Preview Render */}
             <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col h-[520px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
                <h3 className="text-xl font-bold mb-6 tracking-tight relative z-10 flex items-center gap-3">
                  Preview Menù AI <span className="bg-zinc-800 text-[10px] px-2 py-1 rounded font-black text-zinc-400 uppercase tracking-tighter">Live Monitor</span>
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                   {aiState === 'idle' && !menuJson && (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <ChefHat className="w-16 h-16 mb-4 text-zinc-600" />
                        <p className="text-xs font-bold uppercase tracking-widest">In attesa del testo menu...</p>
                     </div>
                   )}
                   {aiState === 'loading' && (
                     <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 flex gap-2 mb-6">
                           <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                           <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                           <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <p className="text-sm font-bold text-emerald-500 animate-pulse tracking-tight">Analisi molecolare ingredienti,<br/>calcolo allergeni e wine match...</p>
                     </div>
                   )}
                   {menuJson && menuJson.categories && aiState !== 'loading' && (
                     <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                        {menuJson.categories.map((cat: any, i: number) => (
                           <div key={i} className="mb-6">
                              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                 <span className="w-4 h-[1px] bg-primary/30" /> {cat.name}
                              </h4>
                              <div className="space-y-3">
                                 {cat.items?.map((item: any, j: number) => (
                                    <div key={j} className="bg-black border border-white/10 p-4 rounded-xl group hover:border-primary/30 transition-all">
                                       <div className="flex justify-between items-start mb-1">
                                          <h5 className="font-bold text-sm text-zinc-200 group-hover:text-primary transition-colors">{item.name}</h5>
                                          <span className="font-mono text-[11px] text-primary font-black">{item.price}€</span>
                                       </div>
                                       {item.description && (
                                          <p className="text-[10px] text-zinc-500 leading-relaxed mb-3">{item.description}</p>
                                       )}
                                       {item.allergens && item.allergens.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                             {item.allergens.map((al: string, k: number) => (
                                                <span key={k} className="bg-zinc-800 text-zinc-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-white/5">
                                                   {al}
                                                </span>
                                             ))}
                                          </div>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                        
                        {aiState === 'success' && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-center mb-4">
                             <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                             <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest italic">Menu sincronizzato con successo!</p>
                             <button onClick={() => setAiState('idle')} className="mt-2 text-[8px] text-zinc-500 hover:text-white uppercase font-black underline">Chiudi Avviso</button>
                          </div>
                        )}
                     </div>
                   )}
                   {menuJson && (!menuJson.categories || menuJson.categories.length === 0) && aiState !== 'loading' && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                        <Sparkles className="w-12 h-12 mb-4 text-zinc-600" />
                        <p className="text-xs font-bold uppercase tracking-widest">Nessun piatto rilevato.<br/>Riprova con un testo più chiaro.</p>
                     </div>
                   )}
                </div>
             </div>

             {/* Modulo Persuasione */}
             <div className="bg-zinc-900 border border-primary/20 rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full" />
                
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-primary rounded-2xl flex items-center justify-center shadow-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Strategia Attiva</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Sales Persuasion Engine</p>
                  </div>
                </div>
                
                <div className="bg-black/40 border border-white/5 p-5 rounded-2xl mb-8 relative z-10">
                   <p className="text-[10px] uppercase font-black text-primary tracking-widest mb-3 flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" /> Direttiva di Vendita Corrente
                   </p>
                   <p className="text-sm font-bold text-zinc-200 leading-snug italic">"{persuasionText}"</p>
                </div>
                
                <button 
                  onClick={() => setPersuasionModalOpen(true)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all focus:ring-2 focus:ring-primary/50 outline-none">
                  Modifica Strategia di Vendita
                </button>
             </div>
          </div>
        </div>

        {/* Persuasion Strategy Modal */}
        {isPersuasionModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
             <div className="bg-zinc-900 border border-white/10 rounded-[40px] w-full max-w-lg p-10 relative shadow-[0_0_100px_rgba(255,181,158,0.1)]">
                <button 
                  onClick={() => setPersuasionModalOpen(false)}
                  className="absolute top-8 right-8 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
                
                <div className="mb-8">
                   <h3 className="text-2xl font-black tracking-tighter mb-2">Comportamento AI</h3>
                   <p className="text-sm text-zinc-500 font-medium">Istruisci DeepSeek su cosa deve spingere di più durante la chat.</p>
                </div>
                
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Direttiva di Vendita (Up-Selling)</label>
                <textarea 
                  value={persuasionText}
                  onChange={(e) => setPersuasionText(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-primary transition-all text-white resize-none h-40 mb-8 focus:ring-1 focus:ring-primary/20"
                  placeholder="Es. Suggerisci sempre il tagliere di salumi locali come antipasto..."
                />
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPersuasionText('')}
                    className="px-6 py-4 border border-white/10 text-zinc-400 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/5 transition-all"
                  >
                    Resetta
                  </button>
                  <button 
                    onClick={() => {
                        handleSaveSettings();
                        setPersuasionModalOpen(false);
                    }}
                    className="flex-1 py-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20"
                  >
                    Salva Strategia ✨
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* QR Code Modal */}
        {isQRModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setQRModalOpen(false)} />
            
            <div className="relative w-full max-w-xl animate-in zoom-in-95 duration-500">
               <button 
                 onClick={() => setQRModalOpen(false)}
                 className="absolute -top-16 right-0 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="bg-zinc-900 border border-white/10 rounded-[50px] p-10 overflow-hidden shadow-2xl">
                  <div className="text-center mb-10">
                     <h2 className="text-3xl font-black tracking-tighter mb-2">QR Code Segnatavolo</h2>
                     <p className="text-zinc-500 text-sm font-medium">I tuoi clienti scansioneranno questo codice per ordinare.</p>
                  </div>

                  <div className="flex justify-center mb-12">
                     <div 
                        ref={cardRef}
                        className="w-[340px] aspect-[1/1.414] bg-white rounded-[40px] p-10 flex flex-col items-center justify-between text-black shadow-2xl relative border-[3px] border-zinc-100"
                     >
                        <div className="absolute top-0 inset-x-0 h-3" style={{ backgroundColor: primaryColor }} />
                        
                        <div className="text-center pt-4">
                           <div className="w-20 h-20 rounded-3xl mx-auto mb-6 bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                              <ChefHat className="w-12 h-12 text-zinc-900" />
                           </div>
                           <h3 className="font-black text-2xl leading-none tracking-tighter uppercase mb-2">{restaurantName}</h3>
                           <p className="text-[11px] font-black text-zinc-400 tracking-[0.3em] uppercase">Digital Concierge</p>
                        </div>

                        <div className="relative">
                           <div className="absolute -inset-6 bg-zinc-50 rounded-[48px] scale-95" />
                           <div className="relative p-3 bg-white rounded-3xl shadow-md border border-zinc-50">
                              <QRCodeSVG 
                                 value={`https://nickgastroguide.it/chat/${slug}`}
                                 size={200}
                                 level="H"
                                 includeMargin={false}
                                 fgColor="#000000"
                              />
                           </div>
                        </div>

                        <div className="text-center pb-2">
                           <div className="flex items-center gap-3 justify-center mb-5">
                              <div className="w-10 h-[2px] bg-zinc-100" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Inquadra per consultare</span>
                              <div className="w-10 h-[2px] bg-zinc-100" />
                           </div>
                           <div className="flex items-center gap-2 justify-center opacity-80">
                              <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                              <span className="text-sm font-bold tracking-tighter">Powered by <span className="font-black" style={{ color: primaryColor }}>GastroGuide</span></span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <button 
                        onClick={() => setQRModalOpen(false)}
                        className="py-5 bg-zinc-800 text-white font-black rounded-3xl hover:bg-zinc-700 transition-all text-xs uppercase tracking-widest"
                     >
                        Chiudi
                     </button>
                     <button 
                        onClick={handleDownloadQR}
                        className="py-5 bg-white text-black font-black rounded-3xl hover:bg-primary transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-white/5"
                     >
                        <Download className="w-5 h-5" /> HQ Download
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
