'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ChefHat, 
  MessageSquare, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  PlusCircle,
  QrCode,
  Bell
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', name: 'Panoramica', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'menu', name: 'Menu AI', icon: <ChefHat className="w-5 h-5" /> },
    { id: 'chat', name: 'Chat Bot', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'settings', name: 'Impostazioni', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-black flex text-white selection:bg-amber-500/30">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 flex flex-col p-6 sticky top-0 h-screen bg-[#0a0a0a]">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-black fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter">GastroGuide</span>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm ${
                activeTab === item.id 
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10 scale-[1.02]' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-4 px-4 py-3.5 text-zinc-500 hover:text-red-500 transition-colors font-bold text-sm mt-auto">
          <LogOut className="w-5 h-5" />
          Esci
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 bg-zinc-950/20">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-1">Dashboard</h1>
            <p className="text-zinc-500 text-sm font-medium">Benvenuto nel tuo centro di comando AI</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-3 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-colors relative">
              <Bell className="w-5 h-5 text-zinc-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-zinc-900" />
            </button>
            <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 px-4 py-2 rounded-2xl">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg" />
              <span className="text-sm font-bold text-zinc-200">Ristorante Nick</span>
            </div>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard title="Ordini Totali" value="1,284" trend="+12%" icon={<ShoppingCart className="w-6 h-6 text-amber-500" />} />
          <StatsCard title="Visitatori Unici" value="8,420" trend="+5.4%" icon={<Users className="w-6 h-6 text-violet-500" />} />
          <StatsCard title="Entrate AI" value="€4,520" trend="+18%" icon={<TrendingUp className="w-6 h-6 text-emerald-500" />} />
          <StatsCard title="Chat Attive" value="42" icon={<MessageSquare className="w-6 h-6 text-indigo-500" />} />
        </div>

        {/* Action Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">Stato del Menu Digitale</h3>
                <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-white/5 rounded-2xl mb-6">
                  <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center rounded-xl">
                    <QrCode className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-white">Menu Online ✨</p>
                    <p className="text-xs text-zinc-500">Ultimo aggiornamento: 2 ore fa</p>
                  </div>
                  <button className="px-4 py-2 bg-white text-black text-xs font-black rounded-lg hover:bg-zinc-200 transition-colors">
                    Sincronizza Ora
                  </button>
                </div>
                <div className="flex gap-4">
                  <button className="flex-grow py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Aggiungi Piatto
                  </button>
                  <button className="flex-grow py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                    <Settings className="w-4 h-4" /> Gestisci Menu
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
               <h3 className="text-xl font-bold mb-6 tracking-tight">Attività Recente</h3>
               <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/5">
                        <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center border border-white/5">
                           <ShoppingCart className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div className="flex-grow">
                           <p className="text-sm font-bold text-white">Nuovo Ordine Tavolo {Math.floor(Math.random() * 10) + 1}</p>
                           <p className="text-xs text-zinc-500">Pizza Margherita, Coca Cola Zero...</p>
                        </div>
                        <p className="text-xs font-bold text-zinc-400">12:30</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 h-fit">
            <h3 className="text-xl font-bold mb-6 tracking-tight">Istruzioni AI</h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6 italic">
              "Il tuo bot sta attualmente istruendo i clienti sulle opzioni senza glutine disponibili e suggerendo il vino della casa."
            </p>
            <div className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-2xl mb-6">
                <p className="text-[10px] uppercase font-bold text-violet-400 tracking-widest mb-1">PROMOZIONE ATTIVA</p>
                <p className="text-sm font-bold text-white">Sconto 10% sui dolci se chiesti via chat ✨</p>
            </div>
            <button className="w-full py-3 border border-white/10 hover:border-white/20 text-white font-bold rounded-xl text-sm transition-all">
              Modifica Persuasione
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
