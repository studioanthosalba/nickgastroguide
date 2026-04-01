'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function SDGImpact() {
  return (
    <main className="relative overflow-hidden w-full bg-background min-h-screen">
      <Navbar />
      
      <div className="light-leak top-[-200px] left-[-200px]"></div>
      
      <section className="max-w-[1440px] mx-auto px-8 pt-40 pb-20">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
            Piattaforma
          </span>
          <h1 className="font-headline text-5xl md:text-7xl leading-[1.1] text-on-surface mb-12">
            SDG <span className="italic text-primary font-light">Impact</span>
          </h1>
          
          <div className="prose prose-invert prose-primary max-w-none space-y-16 text-on-surface-variant font-body">
            <section className="space-y-4">
              <h2 className="text-2xl font-headline text-on-surface italic">Obiettivi di Sviluppo Sostenibile</h2>
              <p className="leading-relaxed">
                Nick GastroGuide si impegna attivamente nel raggiungimento degli SDG delle Nazioni Unite. Attraverso l'innovazione tecnologica, supportiamo la crescita economica inclusiva e la sostenibilità urbana.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4 border-l-2 border-primary/20 pl-8">
                <div className="flex items-center gap-4 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-2">
                   <div className="w-8 h-8 rounded bg-primary text-black flex items-center justify-center font-black">08</div>
                   Lavoro Dignitoso
                </div>
                <p className="text-sm opacity-70">
                  Potenziando il personale di sala con un assistente AI, riduciamo il carico di stress e permettiamo loro di concentrarsi sul servizio di qualità, migliorando il clima lavorativo e la produttività.
                </p>
              </div>

              <div className="space-y-4 border-l-2 border-primary/20 pl-8">
                <div className="flex items-center gap-4 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-2">
                   <div className="w-8 h-8 rounded bg-primary text-black flex items-center justify-center font-black">11</div>
                   Città Sostenibili
                </div>
                <p className="text-sm opacity-70">
                  La scoperta del territorio locale in 50+ lingue promuove un turismo diffuso e consapevole, distribuendo il valore economico oltre le solite rotte affollate.
                </p>
              </div>

              <div className="space-y-4 border-l-2 border-primary/20 pl-8">
                <div className="flex items-center gap-4 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-2">
                   <div className="w-8 h-8 rounded bg-primary text-black flex items-center justify-center font-black">12</div>
                   Consumo Responsabile
                </div>
                <p className="text-sm opacity-70">
                  Consapevolezza alimentare e trasparenza sugli allergeni e la provenienza del cibo guidano i consumatori verso scelte più sane e responsabili.
                </p>
              </div>

              <div className="space-y-4 border-l-2 border-primary/20 pl-8">
                <div className="flex items-center gap-4 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-2">
                   <div className="w-8 h-8 rounded bg-primary text-black flex items-center justify-center font-black">17</div>
                   Partnership
                </div>
                <p className="text-sm opacity-70">
                  Creiamo un ecosistema tra ristorazione, turismo e tecnologia locale per una crescita collaborativa e duratura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
