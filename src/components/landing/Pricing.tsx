'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: "Base",
    price: "0",
    description: "Per piccoli ristoranti che vogliono iniziare.",
    features: ["Menu AI Digitalizzato", "QR Code Statico", "Supporto 5 Lingue", "Allergeni Base"]
  },
  {
    name: "Pro",
    price: "29",
    description: "La soluzione completa per il tuo business.",
    features: ["Tutto nel piano Base", "Guida Turistica AI", "QR Code Dinamico", "30+ Lingue", "Analisi Visite", "Supporto Prioritario"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Su Misura",
    description: "Per catene e grandi realtà.",
    features: ["Tutto nel piano Pro", "Multi-ristorante", "Integrazione POS", "Account Manager", "SLA Garantita"]
  }
]

export default function Pricing() {
  return (
    <section id="prezzi" className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter">
            Piani <span className="text-violet-500">Semplici</span> e Trasparenti
          </h2>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Scegli il piano più adatto al tuo ristorante. Nessun costo nascosto.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              className={`group flex flex-col p-8 rounded-3xl border transition-all duration-500 ${
                tier.popular 
                  ? 'bg-zinc-900 border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.1)] relative' 
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {tier.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-500 text-white text-xs font-bold rounded-full tracking-widest uppercase">
                  IL PIÙ SCELTO
                </span>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-white">€{tier.price}</span>
                  {tier.price !== "Su Misura" && <span className="text-zinc-500 font-medium">/mese</span>}
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-zinc-300 text-sm">
                    <Check className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform group-hover:scale-[1.02] ${
                tier.popular 
                  ? 'bg-violet-500 hover:bg-violet-600 text-white shadow-lg shadow-violet-500/10' 
                  : 'bg-white hover:bg-zinc-200 text-black'
              }`}>
                Inizia Ora
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
