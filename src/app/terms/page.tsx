'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function TermsOfService() {
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
            Terms of <span className="italic text-primary font-light">Service</span>
          </h1>
          
          <div className="prose prose-invert prose-primary max-w-none space-y-12 text-on-surface-variant font-body">
            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">1. Accettazione dei Termini</h2>
              <p className="leading-relaxed">
                Utilizzando i servizi di **Nick GastroGuide**, l'utente accetta di essere vincolato dai presenti Termini di Servizio. Se non si accettano tali termini, si è invitati a non utilizzare il servizio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">2. Descrizione del Servizio</h2>
              <p className="leading-relaxed">
                **Nick GastroGuide** fornisce un assistente virtuale basato su intelligenza artificiale per la ristorazione. Il servizio è progettato per rispondere a domande sui menu, descrivere il territorio e facilitare l'esperienza del cliente finale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">3. Responsabilità dell'Utente</h2>
              <p className="leading-relaxed">
                Il Ristoratore è responsabile dell'accuratezza delle informazioni fornite (menu, prezzi, allergeni). **Studio Anthos Alba** non è responsabile di eventuali inesattezze derivanti da dati errati caricati dall'utente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">4. Proprietà Intellettuale</h2>
              <p className="leading-relaxed">
                Tutti i contenuti della piattaforma, inclusi il logo, il design e gli algoritmi dell'AI, sono di proprietà esclusiva di **Studio Anthos Alba** e di **Antonio Magazzù**, salvo diversamente indicato.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">5. Limitazione di Responsabilità</h2>
              <p className="leading-relaxed">
                Il servizio AI di Nick è fornito "così com'è". Pur impegnandoci al massimo per garantire risposte corrette, non possiamo garantire l'assenza di errori linguistici o interpretativi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline text-on-surface mb-4 italic">6. Contatti e Supporto</h2>
              <p className="leading-relaxed">
                Per qualsiasi domanda relativa ai termini di servizio, puoi contattarci all'indirizzo [info@nickgastroguide.it](mailto:info@nickgastroguide.it).
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
