'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';
import { ADMIN_EMAILS } from '@/lib/constants';
import { ShieldCheck, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        setUser(data.user);
        setIsAdmin(ADMIN_EMAILS.includes(data.user.email?.toLowerCase() || ''));
      }
    };
    checkUser();
    
    // Subscribe to auth changes if needed, but for now standard session is fine
  }, []);

  const handleLogout = async () => {
    await insforge.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-[#131313]/98 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="flex justify-between items-center px-8 py-5 max-w-[1440px] mx-auto">
        <Link href="/" className="text-2xl font-headline italic text-[#ffb59e] font-black tracking-tighter">
          Nick GastroGuide
        </Link>
        
        <div className="hidden md:flex gap-10 items-center">
          <Link className="text-[#ffb59e] font-bold font-label text-xs tracking-widest uppercase hover:opacity-80 transition-all" href="/#features">Features</Link>
          <Link className="text-white/60 hover:text-white transition-colors font-label text-xs font-bold tracking-widest uppercase" href="/#how-it-works">How it Works</Link>
          <Link className="text-white/60 hover:text-white transition-colors font-label text-xs font-bold tracking-widest uppercase" href="/#pricing">Pricing</Link>
        </div>

        <div className="flex gap-6 items-center">
          {!user ? (
            <>
              <Link href="/login" className="text-white/70 hover:text-white font-label text-xs font-black uppercase tracking-widest transition-all">
                Sign In
              </Link>
              <Link href="/login" className="hidden sm:inline-block px-7 py-3 bg-primary text-black font-label text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                lavora con noi
              </Link>
            </>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 pl-2 pr-4 py-2 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="w-8 h-8 bg-[#ffb59e]/20 rounded-xl flex items-center justify-center text-[#ffb59e] text-xs font-black">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Account</p>
                   <p className="text-xs font-bold text-white truncate max-w-[100px]">{user.email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-[#1a1a1a] border border-white/10 rounded-[30px] shadow-2xl p-3 overflow-hidden backdrop-blur-xl"
                  >
                     <Link 
                       href="/dashboard"
                       className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/5 text-white/70 hover:text-white transition-all text-sm font-bold group"
                     >
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                           <User className="w-5 h-5" />
                        </div>
                        Area Riservata
                     </Link>

                     <button 
                       onClick={handleLogout}
                       className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-all text-sm font-bold group mt-1"
                     >
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                           <LogOut className="w-5 h-5" />
                        </div>
                        Disconnetti
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
