'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, ChefHat, ShieldCheck, Star } from 'lucide-react';

const features = [
  {
    icon: <ChefHat className="w-8 h-8 text-amber-400" />,
    title: "Menu AI Strutturato",
    description: "Incolla il testo del tuo menu: l'AI lo analizza, estrae piatti e allergeni, creando una versione digitale interattiva in pochi secondi.",
    colSpan: "lg:col-span-2"
  },
  {
    icon: <MapPin className="w-8 h-8 text-violet-400" />,
    title: "Guida Turistica AI",
    description: "Molto più di un menu: il bot diventa una guida locale che consiglia musei, eventi e attrazioni ai tuoi clienti.",
    colSpan: "lg:col-span-1"
  },
  {
    icon: <Globe className="w-8 h-8 text-indigo-400" />,
    title: "Multilingua Auto",
    description: "Parla con turisti di tutto il mondo. Traduzione istantanea in 30+ lingue senza configurazione.",
    colSpan: "lg:col-span-1"
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
    title: "Esperto di Allergeni",
    description: "Conosce ogni ingrediente. Risponde con precisione a domande su intolleranze ed evita rischi per i clienti.",
    colSpan: "lg:col-span-1"
  },
  {
    icon: <Star className="w-8 h-8 text-rose-400" />,
    title: "Sempre Aggiornato",
    description: "Modifica i piatti o aggiungi specialità del giorno via chat. Il tuo menu si aggiorna in tempo reale.",
    colSpan: "lg:col-span-2"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Potenzialità <span className="text-violet-500">Illimitate</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            La nostra AI non si limita a mostrare piatti, ma crea un'esperienza interattiva completa per i tuoi ospiti.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className={`group relative p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:border-violet-500/50 transition-all duration-500 overflow-hidden ${feature.colSpan}`}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 p-4 bg-zinc-950 rounded-2xl w-fit border border-zinc-800 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
