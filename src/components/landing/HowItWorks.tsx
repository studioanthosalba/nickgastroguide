export default function HowItWorks() {
  return (
    <>
      {/* 5. PROCESS SECTION */}
      <section className="max-w-[1440px] mx-auto px-8 py-32" id="how-it-works">
        <h2 className="font-headline text-4xl mb-20 text-center">Da zero a AI in <span className="text-primary italic">5 minuti</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/10">
          <div className="bg-surface p-12 group hover:bg-surface-container-low transition-colors w-full h-full block">
            <span className="font-headline text-8xl text-outline-variant/20 mb-8 block group-hover:text-primary/20 transition-colors">01</span>
            <h3 className="font-headline text-2xl mb-4">Registrati</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Crea il tuo account in 30 secondi.</p>
          </div>
          <div className="bg-surface p-12 group hover:bg-surface-container-low transition-colors w-full h-full block">
            <span className="font-headline text-8xl text-outline-variant/20 mb-8 block group-hover:text-primary/20 transition-colors">02</span>
            <h3 className="font-headline text-2xl mb-4">Incolla il menu</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Incolla il testo. Nick estrarrà automaticamente dati, allergeni e storie.</p>
          </div>
          <div className="bg-surface p-12 group hover:bg-surface-container-low transition-colors w-full h-full block">
            <span className="font-headline text-8xl text-outline-variant/20 mb-8 block group-hover:text-primary/20 transition-colors">03</span>
            <h3 className="font-headline text-2xl mb-4">Vai Live</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Ricevi il tuo QR code personalizzato e inizia subito a servire i tuoi ospiti con l'AI.</p>
          </div>
        </div>
      </section>
    </>
  );
}
