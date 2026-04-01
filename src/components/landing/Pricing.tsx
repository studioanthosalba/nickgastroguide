export default function Pricing() {
  return (
    <>
      {/* 6. PRICING SECTION */}
      <section className="bg-primary-container py-32 px-8" id="pricing">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline text-4xl md:text-5xl text-on-primary-container mb-8">
            Se ti porta anche solo <span className="underline decoration-on-primary-container/30 decoration-4 underline-offset-8">1 tavolo</span> in più al giorno, Nick si ripaga da solo.
          </h2>
          <p className="text-on-primary-container/80 text-xl mb-16 max-w-2xl mx-auto">
            Non è un costo, è l'investimento più redditizio per la tua sala. Scegli il piano adatto alla tua ambizione.
          </p>
          <div className="bg-surface p-12 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 bg-primary text-on-primary font-label text-[10px] font-black uppercase tracking-widest px-8 py-2 transform rotate-45 translate-x-8 translate-y-4">
              Popolare
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-12">
              <div>
                <h3 className="font-headline text-4xl mb-4 text-primary">Piano Excellence</h3>
                <p className="text-on-surface-variant text-sm mb-8">Accesso completo all'ecosistema Nick GastroGuide.</p>
                <ul className="space-y-4 mb-12">
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Menu AI Illimitato</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 50+ Lingue in tempo reale</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Integrazione Guida Locale</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Analytics Avanzate</li>
                </ul>
              </div>
              <div className="md:text-right flex flex-col justify-center">
                <div className="flex flex-col gap-2 mb-8">
                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1 opacity-60">Primo Acquisto</span>
                    <div className="font-headline text-5xl mb-2 text-primary italic">70€</div>
                  </div>
                  <div className="w-full h-px bg-outline-variant/20 my-2"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1 opacity-60">Poi Mensilmente</span>
                    <div className="font-headline text-4xl text-on-surface">22€<span className="text-xl font-normal opacity-60">/mese</span></div>
                  </div>
                </div>
                <button className="w-full md:w-auto px-12 py-5 bg-primary text-on-primary font-label text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,181,158,0.2)]">
                  Sblocca il Potenziale
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
