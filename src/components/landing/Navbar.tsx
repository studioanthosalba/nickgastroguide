'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Caratteristiche', 'Come Funziona', 'Prezzi'];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
            <Rocket className="w-6 h-6 text-black fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Nick <span className="text-amber-500">GastroGuide</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-white">
          {navItems.map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link href="/recruiting" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors relative group">
            Lavora con noi
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Accedi
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/login"
              className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              Inizia Ora
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navItems.map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-lg font-medium text-zinc-400" onClick={() => setIsMobileMenuOpen(false)}>
                  {item}
                </Link>
              ))}
              <Link href="/recruiting" className="text-lg font-medium text-amber-500" onClick={() => setIsMobileMenuOpen(false)}>
                Lavora con noi
              </Link>
              <hr className="border-white/10" />
              <Link href="/login" className="text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Accedi
              </Link>
              <Link href="/login" className="px-6 py-4 bg-amber-500 text-black text-center font-bold rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                Inizia Ora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
