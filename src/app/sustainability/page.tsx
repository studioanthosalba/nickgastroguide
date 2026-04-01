'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function SustainabilityReport() {
  return (
    <main className="relative overflow-hidden w-full bg-background min-h-screen font-body">
      <Navbar />
      
      <div className="light-leak top-[-200px] left-[-200px]"></div>
      
      <section className="max-w-[1440px] mx-auto px-8 pt-40 pb-20">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
            Piattaforma
          </span>
          <h1 className="font-headline text-5xl md:text-7xl leading-[1.1] text-on-surface mb-12">
            Sustainability <span className="italic text-primary font-light">Report</span>
          </h1>
          
          <div className="prose prose-invert prose-primary max-w-none space-y-12 text-on-surface-variant">
            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">Visione Sociale</h2>
              <p className="leading-relaxed">
                Nick GastroGuide non è solo tecnologia, è un impegno verso la sostenibilità sociale e la valorizzazione del territorio. Crediamo in un futuro in cui l'AI supporti l'eccellenza culinaria riducendo le barriere e promuovendo il rispetto per le tradizioni locali.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="p-8 bg-surface-container-high rounded-[2rem] border border-white/5 shadow-2xl">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">eco</span>
                <h3 className="text-lg font-headline text-on-surface mb-2">Zero Waste</h3>
                <p className="text-xs leading-relaxed opacity-60">
                  Ottimizzazione delle scorte e riduzione degli sprechi alimentari attraverso un'educazione digitale consapevole sui piatti del menu.
                </p>
              </div>
              <div className="p-8 bg-surface-container-high rounded-[2rem] border border-white/5 shadow-2xl">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">groups</span>
                <h3 className="text-lg font-headline text-on-surface mb-2">Impatto sulla Comunità</h3>
                <p className="text-xs leading-relaxed opacity-60">
                  Promozione delle micro-economie locali attraverso consigli territoriali che guidano i turisti verso produttori e attrazioni adiacenti.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">Trasparenza</h2>
              <p className="leading-relaxed">
                Ogni interazione di Nick è guidata da algoritmi etici che privilegiano la stagionalità e l'autenticità. Il nostro obiettivo è ridurre il footprint digitale della ristorazione rendendo la scoperta del cibo un'esperienza umana ed efficiente.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
