'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

export default function AffiliationPage() {
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
            Programma <span className="italic text-primary font-light">Affiliazione</span>
          </h1>
          
          <div className="prose prose-invert prose-primary max-w-none space-y-12 text-on-surface-variant font-body">
            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">Unisciti alla Rivoluzione</h2>
              <p className="leading-relaxed">
                Il programma di affiliazione di **Nick GastroGuide** è pensato per professionisti della ristorazione, consulenti digitali e appassionati di tecnologia che desiderano promuovere l'eccellenza e la sostenibilità digitale.
              </p>
            </section>

            <section className="bg-surface-container-high p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
              <h3 className="text-xl font-headline text-on-surface">Perché diventare partner?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="text-primary font-bold text-sm tracking-widest uppercase">Commissioni Elevate</h4>
                  <p className="text-xs opacity-70">Guadagna il 40% sul primo acquisto e il 10% sui rinnovi ricorrenti di ogni ristorante che attivi.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-primary font-bold text-sm tracking-widest uppercase">Supporto Dedicato</h4>
                  <p className="text-xs opacity-70">Accesso a materiali di marketing, formazione e una dashboard dedicata per monitorare i tuoi successi.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">Come Iniziare</h2>
              <p className="leading-relaxed mb-8">
                Il processo è semplice e trasparente. Non ci sono costi di ingresso o requisiti minimi di vendita. Vogliamo partner che condividano la nostra visione di eccellenza.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/register-agent" className="px-8 py-4 bg-primary text-on-primary font-label text-xs justify-center flex font-black uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(255,181,158,0.3)] transition-all">
                  Candidati Ora
                </Link>
                <Link href="/recruiting" className="px-8 py-4 bg-surface-container-highest text-on-surface font-label flex justify-center text-xs font-black uppercase tracking-[0.15em] border border-white/5 hover:bg-white/5 transition-all">
                  Approfondisci il Programma
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">Contatti Business</h2>
              <p className="leading-relaxed">
                Per collaborazioni strutturate o partnership aziendali, scrivici direttamente a [info@nickgastroguide.it](mailto:info@nickgastroguide.it).
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
