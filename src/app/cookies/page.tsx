'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function CookiePolicy() {
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
            Cookie <span className="italic text-primary font-light">Policy</span>
          </h1>
          
          <div className="prose prose-invert prose-primary max-w-none space-y-12 text-on-surface-variant font-body">
            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">1. Cosa sono i Cookie?</h2>
              <p className="leading-relaxed">
                I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Vengono utilizzati per migliorare l'esperienza dell'utente, ricordare le preferenze e analizzare il traffico.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">2. Come Utilizziamo i Cookie?</h2>
              <p className="leading-relaxed">
                **Nick GastroGuide** utilizza cookie tecnici per il corretto funzionamento della piattaforma e cookie analitici (come Google Analytics) per comprendere come gli utenti interagiscono con il nostro sito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">3. Tipi di Cookie Utilizzati</h2>
              <ul className="list-disc pl-6 space-y-4 mt-4">
                <li>**Cookie Tecnici:** Essenziali per navigare e utilizzare le funzionalità della piattaforma.</li>
                <li>**Cookie di Sessione:** Scompaiono alla chiusura del browser per garantire la sicurezza della sessione.</li>
                <li>**Cookie di Analisi:** Ci aiutano a migliorare la nostra offerta monitorando le sezioni più visitate.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">4. Gestione dei Cookie</h2>
              <p className="leading-relaxed">
                Puoi gestire o disattivare i cookie tramite le impostazioni del tuo browser. Tuttavia, la disattivazione dei cookie tecnici potrebbe limitare alcune funzionalità della piattaforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">5. Modifiche a questa Policy</h2>
              <p className="leading-relaxed">
                Questa Cookie Policy può essere aggiornata periodicamente. Si consiglia di consultare questa pagina regolarmente per rimanere informati su eventuali modifiche.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">6. Contatti</h2>
              <p className="leading-relaxed">
                Per informazioni dettagliate sul nostro uso dei cookie, scrivi a [info@nickgastroguide.it](mailto:info@nickgastroguide.it).
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
