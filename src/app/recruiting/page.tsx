'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Percent, CreditCard, Globe2, 
  UserPlus, Share2, Wallet, CheckCircle2,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const benefits = [
  {
    icon: <Percent className="w-8 h-8 text-amber-400" />,
    title: "40% + 10%",
    description: "40% sul primo acquisto e 10% su tutti i rinnovi mensili, per sempre."
  },
  {
    icon: <CreditCard className="w-8 h-8 text-amber-400" />,
    title: "Pagamenti Puntuali",
    description: "Ricevi le tue commissioni ogni mese direttamente sul tuo conto."
  },
  {
    icon: <Globe2 className="w-8 h-8 text-amber-400" />,
    title: "Mercato Enorme",
    description: "Migliaia di ristoranti hanno bisogno di digitalizzarsi. Il mercato è tuo."
  }
];

const steps = [
  { num: "01", title: "Registrati", desc: "Crea il tuo account agente in 30 secondi e ottieni il tuo link referral unico." },
  { num: "02", title: "Promuovi", desc: "Condividi GastroGuide con i ristoratori della tua zona o rete." },
  { num: "03", title: "Guadagna", desc: "Monitora le attivazioni dalla tua dashboard e incassa le commissioni." }
];

const targets = [
  "Agenti di commercio Ho.Re.Ca.",
  "Consulenti digital marketing",
  "Appassionati di tecnologia e food",
  "Imprenditori digitali",
  "Social Media Manager",
  "Chiunque abbia un network nel mondo ristorazione"
];

export default function RecruitingPage() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-400">Diventa Partner GastroGuide</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Trasforma la tua rete in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Rendita Passiva
              </span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Aiuta i ristoranti a digitalizzarsi con l'IA e guadagna commissioni ricorrenti
              su ogni cliente che porti. Nessun limite ai tuoi guadagni.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register-agent">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  Candidati Ora <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/#features">
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
                  Scopri il Prodotto
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className="bg-zinc-900/60 border border-zinc-800/50 p-8 rounded-3xl hover:border-amber-500/30 transition-all duration-500 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mb-6 p-4 bg-zinc-950 rounded-2xl w-fit border border-zinc-800 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Come Funziona</h2>
            <p className="text-zinc-500">Inizia a guadagnare in 3 semplici passaggi</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-8 bg-amber-500/20 border border-amber-500/30 rounded-lg mb-6">
                  <span className="text-xs font-bold text-amber-500">{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we're looking for */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Chi stiamo cercando?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {targets.map((target, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-zinc-300 text-sm font-medium">{target}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto a iniziare?
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto mb-8">
              Non c'è costo di ingresso. Unisciti alla rivoluzione di Nick GastroGuide oggi stesso.
            </p>
            <Link href="/register-agent">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black font-bold rounded-xl transition-all flex items-center gap-2 mx-auto hover:bg-zinc-200"
              >
                Diventa Partner <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
