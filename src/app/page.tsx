'use client';

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import PremiumSection from '@/components/landing/PremiumSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="relative overflow-hidden w-full">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <PremiumSection />
      <Footer />
    </main>
  );
}
