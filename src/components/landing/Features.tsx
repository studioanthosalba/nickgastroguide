import Image from 'next/image';

export default function Features() {
  return (
    <>
      {/* 3. NARRATIVE FEATURES */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-32" id="features">
        <div className="text-center mb-24">
          <span className="font-label text-[10px] tracking-[0.3em] uppercase text-primary mb-4 block">L'Infrastruttura dell'Ospitalità</span>
          <h2 className="font-headline text-3xl sm:text-5xl">Funzionalità per il futuro</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Zone 1 */}
          <div className="bg-surface-container p-10 flex flex-col justify-between group hover:bg-surface-container-high transition-colors">
            <div>
              <div className="mb-12">
                <span className="material-symbols-outlined text-primary text-4xl">restaurant_menu</span>
              </div>
              <h3 className="font-headline text-3xl mb-6">Menu AI Strutturato</h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Ogni piatto viene analizzato per allergeni, storia e abbinamenti vinicoli, creando un'esperienza di vendita proattiva guidando l'utente a metterti una recenzione positiva
              </p>
            </div>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <li className="flex items-center gap-3 text-primary"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Up-selling Automatico</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Gestione Allergeni</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Storytelling Piatti</li>
            </ul>
          </div>
          
          {/* Zone 2 */}
          <div className="bg-surface-container p-10 flex flex-col justify-between group hover:bg-surface-container-high transition-colors">
            <div>
              <div className="mb-12">
                <span className="material-symbols-outlined text-primary text-4xl">travel_explore</span>
              </div>
              <h3 className="font-headline text-3xl mb-6">Guida Turistica</h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Non solo cibo. Nick consiglia i tesori nascosti del tuo territorio, legando il tuo brand alla bellezza locale.
              </p>
            </div>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <li className="flex items-center gap-3 text-primary"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Partnership Locali</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Itinerari Post-Cena</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Eventi in Tempo Reale</li>
            </ul>
          </div>
          
          {/* Zone 3 */}
          <div className="bg-surface-container p-10 flex flex-col justify-between group hover:bg-surface-container-high transition-colors">
            <div>
              <div className="mb-12">
                <span className="material-symbols-outlined text-primary text-4xl">keyboard_voice</span>
              </div>
              <h3 className="font-headline text-3xl mb-6">Multilingua</h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                I clienti possono conversare con Nick nella loro lingua madre. Una conversazione naturale che abbatte ogni barriera.
              </p>
            </div>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <li className="flex items-center gap-3 text-primary"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 50+ Lingue Supportate</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Interfaccia Vocale</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Dialetti & Slang</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. IMPACT SECTION */}
      <section className="bg-[#0e0e0e] py-32 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="font-headline text-3xl sm:text-5xl mb-8">Social Sustainability & <br />SDG Impact</h2>
              <p className="text-on-surface-variant text-lg mb-12 leading-relaxed">
                Ci impegniamo per un turismo che valorizza le persone e le tradizioni. Nick digitalizza il sapere culinario per non perderlo mai.
              </p>
              
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <div className="font-headline text-5xl text-primary mb-2 italic">1.2M+</div>
                  <div className="font-label text-[10px] tracking-widest uppercase opacity-60">Menu Digitalizzati</div>
                </div>
                <div>
                  <div className="font-headline text-5xl text-primary mb-2 italic">450+</div>
                  <div className="font-label text-[10px] tracking-widest uppercase opacity-60">Territori Promossi</div>
                </div>
                <div>
                  <div className="font-headline text-5xl text-primary mb-2 italic">98%</div>
                  <div className="font-label text-[10px] tracking-widest uppercase opacity-60">Riduzione Sprechi</div>
                </div>
                <div>
                  <div className="font-headline text-5xl text-primary mb-2 italic">24/7</div>
                  <div className="font-label text-[10px] tracking-widest uppercase opacity-60">Supporto Locale</div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-[4/5] bg-surface-container relative overflow-hidden group">
                <img alt="Rustic Italian dinner scene" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2OgGgKQ29UP3cP85LtTWzOp0LCCZ3ibkScTfc1ZfSXUw-xZT9UFMvH8J3E0mYoi18yh8LIxqfUqAgEmDFKBHe3CXzZ_5_ZIm5XRjRJd7BleZimPuhcCSKS2pi9nRQmTHwk79xYuWXdv4lh6Uagwz74tkrMqSNJhNLZIM3PlsJyrMtetlyI3LCf-ytcNrBYGeSJ47OYZETdXIKgANAvmCHmWoMB7i1Vh6aWL5SXfwojHRZbuGc-9RSW7S-hoxxSdFR_dFS63tUyjI" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10">
                  <p className="font-headline text-2xl italic mb-4">"Grazie a Nick, i turisti scoprono il nostro olio direttamente al tavolo del ristorante."</p>
                  <span className="font-label text-xs tracking-widest uppercase">— Giuseppe, Produttore Locale</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 7. TESTIMONIALS SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-32">
        <h2 className="font-headline text-4xl mb-20 text-center italic">Voci dal territorio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 flex-shrink-0 bg-surface-container-high rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <img alt="Customer Marco" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJwTQJD8fI7XPDScQxmfaoHeSr_1K1MblDkKcv0FzbM8fZ36qtoy9vredghuRat3LhgfULYm1c4riIYHiiCJt92CHzLUt4-Pb7-nPcPrFSHVfw2fbomML6C_AB-7C31s20atpPji2y3-N6_JG9b_mek0EIueMUX49f1ceC7c4BhujyHLnWLxg9J_w2HG0ozu7DqjVKF29jkKDYSGXr6PT3oOj4UEwApxbbZd0BlmClpqrkP0BMYci1OS92rQWAE_e4UJ3s-zn3lZk" />
            </div>
            <div>
              <p className="font-headline text-xl mb-6 leading-relaxed">
                "Il tempo che i camerieri risparmiano spiegando gli allergeni lo usano per coccolare il cliente. Lo scontrino medio è aumentato del 15%."
              </p>
              <span className="font-label text-xs font-black tracking-widest uppercase text-primary">— Marco R., Osteria del Borgo</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 flex-shrink-0 bg-surface-container-high rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <img alt="Customer Sofia" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA400u5SROIQTEuMwGq9Qj6VulcRc3LItc1FtpiyiT9xe1fYFEE3bb4vI_3Cx8yEsWuypP48SiolK60B1iglvD5xrhkD8yUtwEKGrRn8m1_omtUtg_ap1INErS2cpgRafIKBJ3XRee7oq5qG201qdIpZp--rEHRqJTDWAiBXO72h9iG8Anu4lq2kp0mruNMjDXDWCZe83Q8QJEb6aQm_L577NIow--RqdwguJewHLqrcUfwAiCzDb--UN8AYCV6TMt5gZCtLmLzZE" />
            </div>
            <div>
              <p className="font-headline text-xl mb-6 leading-relaxed">
                "I turisti americani sono entusiasti: parlano con l'AI e scoprono cantine che non avrebbero mai trovato su Google Maps."
              </p>
              <span className="font-label text-xs font-black tracking-widest uppercase text-primary">— Sofia L., Terrace GastroBar</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
