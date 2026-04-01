'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPolicy() {
  return (
    <main className="relative overflow-hidden w-full bg-background min-h-screen">
      <Navbar />
      
      <div className="light-leak top-[-200px] left-[-200px]"></div>
      
      <section className="max-w-[1440px] mx-auto px-8 pt-40 pb-20">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
            Legale
          </span>
          <h1 className="font-headline text-5xl md:text-7xl leading-[1.1] text-on-surface mb-12">
            Privacy <span className="italic text-primary font-light">Policy</span>
          </h1>
          
          <div className="prose prose-invert prose-primary max-w-none space-y-12 text-on-surface-variant font-body">
            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">1. Introduzione</h2>
              <p className="leading-relaxed">
                La presente Privacy Policy descrive come **Studio Anthos Alba** raccoglie, utilizza e protegge le informazioni personali degli utenti che interagiscono con la piattaforma **Nick GastroGuide**. Ci impegniamo a garantire che la tua privacy sia protetta in conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">2. Titolare del Trattamento</h2>
              <p className="leading-relaxed">
                Il titolare del trattamento dei dati è **Studio Anthos Alba**, con sede legale in Italia. 
                <br />
                **Fondatore:** Antonio Magazzù.
                <br />
                **Email di contatto:** [info@nickgastroguide.it](mailto:info@nickgastroguide.it)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">3. Dati Raccolti</h2>
              <p className="leading-relaxed">
                Raccogliamo dati necessari per la fornitura del servizio di concierge AI, tra cui:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Informazioni del ristorante (Nome, indirizzo, menu, orari).</li>
                <li>Dati di contatto del gestore (Email, nome).</li>
                <li>Interazioni degli utenti con l'AI per scopi di miglioramento del servizio e analisi statistica.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">4. Finalità del Trattamento</h2>
              <p className="leading-relaxed">
                I dati vengono trattati esclusivamente per:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Fornire assistenza automatizzata ai clienti del ristorante.</li>
                <li>Ottimizzare le risposte dell'AI basate sui contenuti del territorio e del menu.</li>
                <li>Gestire l'account del ristoratore e le comunicazioni tecniche.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">5. Sicurezza dei Dati</h2>
              <p className="leading-relaxed">
                Utilizziamo tecnologie avanzate e protocolli di sicurezza crittografati per prevenire accessi non autorizzati o la divulgazione dei tuoi dati. La nostra infrastruttura si appoggia a fornitori cloud leader del settore con elevati standard di conformità.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">6. I Tuoi Diritti</h2>
              <p className="leading-relaxed">
                Hai il diritto di richiedere l'accesso, la rettifica o la cancellazione dei tuoi dati personali in qualsiasi momento contattandoci via email.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
