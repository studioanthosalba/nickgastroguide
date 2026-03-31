"use client";

import { useState } from "react";
import { 
  ArrowLeft, Save, Sparkles, QrCode, Globe, MapPin, 
  Trash2, Plus, ChevronRight, Palette, Utensils, 
  Wine, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function RestaurantEditor({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<"profile" | "menu" | "ai">("menu");
  const [rawMenu, setRawMenu] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [structuredMenu, setStructuredMenu] = useState<any>(null);

  const handleAiParse = async () => {
    if (!rawMenu.trim()) return;
    setIsParsing(true);
    try {
      const response = await fetch("/api/menu-parse", {
        method: "POST",
        body: JSON.stringify({ text: rawMenu, restaurantId: params.slug }),
      });
      const result = await response.json();
      if (result.success) {
        setStructuredMenu(result.data);
        setActiveTab("ai");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Editor Header */}
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Da Toni</h1>
            <span className="px-2 py-0.5 bg-blue-100 text-primary text-[10px] font-bold rounded uppercase">Ristoratore</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
            Annulla
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
            <Save className="w-4 h-4" /> Salva modifiche
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all", 
              activeTab === "profile" ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-500 hover:bg-white hover:text-slate-800")}
          >
            <Palette className="w-5 h-5" /> Profilo & Design
          </button>
          <button 
            onClick={() => setActiveTab("menu")}
            className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all", 
              activeTab === "menu" ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-500 hover:bg-white hover:text-slate-800")}
          >
            <Utensils className="w-5 h-5" /> Editor Menù Raw
          </button>
           <button 
            onClick={() => setActiveTab("ai")}
            className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all relative overflow-hidden group", 
              activeTab === "ai" ? "bg-white text-emerald-600 shadow-sm border border-slate-100" : "text-slate-500 hover:bg-white hover:text-slate-800")}
          >
            <Sparkles className="w-5 h-5" /> Anteprima AI
            <div className="absolute top-0 right-0 p-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </button>
          
          <div className="pt-8 space-y-4">
            <div className="p-6 bg-slate-900 rounded-3xl text-white">
              <QrCode className="w-8 h-8 mb-4 text-primary" />
              <h4 className="font-bold mb-2">Vai Online</h4>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">Scarica il QR per i tavoli o condividi il link ai tuoi clienti.</p>
              <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <Globe className="w-3 h-3" /> Copia Link Pubblico
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "menu" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
              <div className="p-8 border-b bg-slate-50/50">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Editor Menù Raw</h2>
                <p className="text-sm text-slate-500 font-medium">Incolla qui tutto il tuo listino. L'AI si occuperà di formattarlo, estrarre allergeni e creare le categorie.</p>
              </div>
              <div className="flex-1 p-8 relative">
                <textarea 
                  value={rawMenu}
                  onChange={(e) => setRawMenu(e.target.value)}
                  placeholder="Esempio: &#10;ANTIPASTI&#10;Tagliere Misto del Contadino - €15 (glutine, lattosio)&#10;Crostini Toscani - €8&#10;&#10;PRIMI... "
                  className="w-full h-full resize-none focus:outline-none text-slate-700 font-medium text-lg placeholder:text-slate-300 leading-relaxed"
                />
                
                {/* AI Trigger */}
                <div className="absolute bottom-8 right-8">
                   <button 
                    onClick={handleAiParse}
                    disabled={isParsing || !rawMenu.trim()}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all border border-slate-700 group ring-4 ring-slate-100"
                   >
                     {isParsing ? (
                        <> <Loader2 className="w-5 h-5 animate-spin" /> Elaborazione Menù... </>
                     ) : (
                        <> <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" /> Structure Menu with AI </>
                     )}
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {!structuredMenu ? (
                <div className="bg-white rounded-3xl p-20 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                   <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                   <h3 className="font-bold text-slate-800 mb-2 text-xl">Nessun menù elaborato</h3>
                   <p className="text-slate-500 max-w-xs">Torna alla scheda Editor Raw e poggia il pulsante magico per vedere il risultato qui.</p>
                </div>
               ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">Anteprima Digitale</h2>
                      <p className="text-slate-500 font-medium">Così apparirà il tuo locale agli utenti.</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4" /> Risultato Ottimale
                       </button>
                    </div>
                  </div>

                  <div className="space-y-12">
                    {structuredMenu.categories.map((cat: any, i: number) => (
                      <div key={i} className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                          <span className="w-8 h-[2px] bg-primary/20" /> {cat.name}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {cat.items.map((item: any, j: number) => (
                            <div key={j} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{item.name}</h5>
                                <span className="text-sm font-bold text-slate-500 italic">€{item.price}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {item.allergens?.map((al: string, k: number) => (
                                  <span key={k} className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[9px] font-bold rounded-md uppercase">
                                    {al}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
               )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 space-y-10">
              <section className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-l-4 border-primary pl-4">Identità & Stile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">URL Logo Ristorante</label>
                    <input type="text" placeholder="https://..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Colore Primario</label>
                    <div className="flex gap-4">
                      {["#3b82f6", "#ef4444", "#10b981", "#8b5cf6"].map((c) => (
                        <button key={c} style={{ backgroundColor: c }} className="w-10 h-10 rounded-full border-4 border-white shadow-sm ring-1 ring-slate-100 hover:scale-110 transition-transform" />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6 pt-4 border-t border-slate-50">
                <h3 className="text-xl font-bold text-slate-800 border-l-4 border-primary pl-4 flex items-center gap-2">
                   Localizzazione <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Il "Cicerone"</span>
                </h3>
                <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-primary" /> Indirizzo Esatto (Via, Comune)
                     </label>
                     <input type="text" placeholder="es: Via Dante 12, Milano" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                     <p className="text-[10px] text-slate-400 font-medium italic">Nota: Questo indirizzo verrà usato dall'AI per consigliare monumenti e attrazioni vicine ai tuoi clienti.</p>
                   </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
