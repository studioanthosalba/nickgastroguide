'use client';

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />
      <Hero />
      <div className="relative">
        {/* Glow effects for section transitions */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <Features />
      </div>
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
