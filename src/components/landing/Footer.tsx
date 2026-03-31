'use client'
import React from 'react'

export default function Footer() {
  return (
    <footer className="py-16 bg-[#0a0a0a] border-t border-zinc-900/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-violet-500/20">
              G
            </div>
            <div>
              <span className="text-white font-black text-2xl tracking-tighter block leading-none">GastroGuide</span>
              <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">L'AI per il tuo Ristorante</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Termini e Condizioni</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Contatti</a>
            <a href="/recruiting" className="text-amber-500/80 hover:text-amber-500 transition-colors duration-300">Lavora con noi</a>
          </div>
          
          <div className="text-xs text-zinc-600 font-medium">
            © {new Date().getFullYear()} GastroGuide AI. <span className="hidden sm:inline">Tutti i diritti riservati.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
