'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);

  // Aggressive watchdog: uses requestAnimationFrame to detect and instantly
  // resume video if the browser pauses it during touch/scroll events.
  // Recovery is sub-16ms, making the pause imperceptible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let active = true;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // RAF loop — runs every frame, checks if video was paused unexpectedly
    const watchdog = () => {
      if (!active) return;
      if (video.paused && !userPausedRef.current && !showPoster) {
        video.play().catch(() => {});
      }
      rafId = requestAnimationFrame(watchdog);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Start watchdog only after first play
    const startWatchdog = () => {
      rafId = requestAnimationFrame(watchdog);
      video.removeEventListener('play', startWatchdog);
    };
    video.addEventListener('play', startWatchdog);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('play', startWatchdog);
    };
  }, [showPoster]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (showPoster) {
      // First play — hide poster, start video
      setShowPoster(false);
      userPausedRef.current = false;
      video.play().catch(() => {});
      return;
    }

    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, [showPoster]);

  const toggleAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = 1;
      // If still showing poster, also start playback
      if (showPoster) {
        setShowPoster(false);
        userPausedRef.current = false;
        video.play().catch(() => {});
      }
    } else {
      video.muted = true;
    }
    setIsMuted(!isMuted);
  }, [isMuted, showPoster]);

  return (
    <>
      <div className="light-leak top-[-200px] left-[-200px]"></div>
      <div className="light-leak bottom-[-200px] right-[-200px]"></div>
      
      {/* 1. HERO SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-20 md:py-32 relative">
        <div className="editorial-grid items-center">
          <div className="md:col-span-7">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
              Studio Anthos Alba
            </span>
            <h1 className="font-headline text-3xl sm:text-5xl md:text-7xl leading-[1.1] text-on-surface mb-8">
              Il concierge AI che <span className="italic text-primary font-light">vende</span> i tuoi piatti e il tuo territorio, 24/7.
            </h1>
            <p className="font-body text-xl text-on-surface-variant max-w-xl mb-12 leading-relaxed">
              Aumenta coperti e scontrino medio con un assistente che spiega menu, allergeni e attrazioni locali in modo umano.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Link href="/login" className="px-8 py-4 bg-primary text-on-primary font-label text-xs justify-center flex font-black uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(255,181,158,0.3)] transition-all">
                entra a bordo
              </Link>
              <Link href="/demo-chat" className="px-8 py-4 bg-surface-container-high text-on-surface font-label flex justify-center text-xs font-black uppercase tracking-[0.15em] border border-outline-variant/20 hover:bg-surface-container-highest transition-all">
                Guarda la demo
              </Link>
            </div>
            
            <div className="flex items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <img alt="Partner Logo 1" className="h-6 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2C2X8QJKbjXegtL38VrzxbIaiNfh7KzUZRsS4dMPsZcFK6Xdy2cHuho7dVUZHAFZJxKgL8IwtiqomwDhPfaqOXf0Z74WokDhKmCjUggfNwWc16ADZ02p-8i5VmHKMx2LSKYRP7iBbau0_T1HLjULZJnDDBONOyD6nmYnH16s1jeNUtrgWJKvLYi9N8Tr0hiazdnHMs3mbkpYTCBhQxBrXIWfBKlJMdZdHZa_GRraoaVGjRFBbt6kD0xh2WYUxBon0TNAsHaYsVc0" />
              <img alt="Partner Logo 2" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxLlgNvoyAuQ1_sQNmJjS0A_G-GpfN3Ehpq3lLaVaJ9IpblCBoTYHHOGhif4_o4bHnmIpo6EVvC2Av7-dAdWzne1xRTo7VElhpCDJcpQ1LkmuqcUqDhE8RcfXhaT6zfKx9Zp23MJ1j7u4LnWwmSGIQoWAkqQMGDsMfrIGjIu6KT2wX4xQE2oVam1sCA04cjU7KBDawD7LujnfrONo4ArWgoym4a3qJKxd6UWph4a7G0l3UPDIXJ4LBZ2q_w5Wl7vFA1cBY9cUbZLI" />
              <span className="font-headline italic text-xl">Elite Ristorazione</span>
            </div>
          </div>
          
          <div className="md:col-span-5 relative mt-20 md:mt-0">
            <div className="relative z-10 aspect-square overflow-hidden bg-surface-container rounded-full shadow-2xl border border-primary/10 group">
              <img alt="AI Chef" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTCRniNopbm8S0tHmSMJNWrhK0x4hgsFc6PQJRxM8zgUS0SHMnqPhanH_UN3aGEFY-6jvwgPcy0dpU8eIkNxQpyIG0czKdlIo1BmjU6UXOLTXR5TyptVC4X0GZdAOPhifb2p8l-vVU_QhTNsEKnpRRQaBMGLn8F3DlXPIwscWLYmr9yMnFK32SwJgACvwflCfgFqSqPnKE2n5GQrVlKA0GwkO4iICDFRKgW7j6Ldgo8fA_ZW713XauwF8QWmc5QSUE3GdsEJfBiOE" />
            </div>
            
            <div className="absolute -bottom-10 -left-10 z-20 w-64 glass-panel rounded-[2.5rem] p-4 shadow-2xl transform rotate-[-5deg] pointer-events-none">
              <div className="bg-surface-container-lowest h-full w-full rounded-[2rem] overflow-hidden border border-white/5">
                <div className="p-4 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">robot_2</span>
                  </div>
                  <div className="bg-primary-container p-3 rounded-xl rounded-tl-none">
                    <p className="text-[10px] text-on-primary-container leading-snug">
                      Il nostro Chianti Classico DOCG si sposa perfettamente con la Bistecca. Desidera sapere la storia di questa cantina locale?
                    </p>
                  </div>
                  <div className="bg-surface-container-high p-3 rounded-xl rounded-tr-none ml-6">
                    <p className="text-[10px] text-on-surface-variant">
                      Sì, grazie! Quali sono le attrazioni vicine dopo cena?
                    </p>
                  </div>
                </div>
                <img alt="Dish detail" className="w-full h-24 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSr0QFS76VMskO2hH3dSaWL4_KeHXsaQWUD5z6kG14xoBaqNcxztzvEDqVAkLbEtTW8RmD7N_gHP-QXlBuvfrEzQJ1rL2fjCd_k8-ngfe7ywueTtnPKq6S6FvU5eVPYD_TJGAySbZAVaO4qMdm8agn7hJZcW_HMi8kErbny78ll0XWvh8IfrBCD4PXXrnXz3DJxYfI-f0C_2vIn0IQY9qEA7ow5DhS5WAlwPYnF1c1GgDy51R-ZFfmU7Am51EZTbGgg5LHbY47RJk" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & TRANSFORMATION SECTION */}
      <section className="bg-surface-container-low py-32" id="demo">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="editorial-grid">
            {/* Text Area */}
            <div className="md:col-span-5 mb-20 lg:mb-0">
              <h2 className="font-headline text-4xl mb-12">
                Il paradosso della <br />
                <span className="italic text-secondary">ristorazione moderna</span>
              </h2>
              <div className="space-y-12">
                <div className="group">
                  <span className="text-secondary font-label text-[10px] tracking-widest uppercase mb-4 block">01. Personale Stressato</span>
                  <p className="text-on-surface text-lg leading-relaxed font-light opacity-90">
                    I camerieri non hanno il tempo di raccontare il territorio o spiegare minuziosamente ogni allergene durante il servizio di punta.
                  </p>
                </div>
                <div className="group">
                  <span className="text-secondary font-label text-[10px] tracking-widest uppercase mb-4 block">02. Barriere Linguistiche</span>
                  <p className="text-on-surface text-lg leading-relaxed font-light opacity-90">
                    Perdere turisti alto-spendenti perché nessuno parla fluentemente la loro lingua è un costo invisibile ma enorme.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Area */}
            <div className="md:col-start-6 md:col-span-7">
              <div className="bg-surface-container-high p-4 sm:p-8 md:p-12 relative overflow-hidden flex flex-col items-center">
                <div className="text-center mb-12 w-full max-w-2xl">
                  <div className="flex justify-center flex-row items-center gap-4 mb-4">
                    <h3 className="font-headline text-3xl md:text-4xl text-center">La trasformazione con Nick</h3>
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
                  </div>
                  <p className="text-xl text-on-surface italic mb-10">&quot;Nick non sostituisce l&apos;umano, gli regala superpoteri.&quot;</p>
                </div>

                <div className="w-full max-w-[500px] mx-auto mb-8 relative">
                  <div className="md:rounded-[3.5rem] p-0 md:p-4 border border-primary/20 bg-black md:bg-black/50 md:glass-panel md:shadow-[0_0_80px_rgba(255,181,158,0.1)]">
                    <div className="absolute inset-x-0 -top-6 flex justify-center z-20">
                      <div className="bg-primary/20 px-6 py-2 rounded-full border border-primary/30 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="font-label text-xs font-bold text-primary tracking-widest uppercase">Live Experience</span>
                      </div>
                    </div>
                    <div className="relative bg-black md:rounded-[3rem]">
                      
                      {/* Poster overlay — shown until user presses Play */}
                      {showPoster && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 md:rounded-[3rem]">
                          <button
                            onClick={handlePlayPause}
                            className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 active:scale-90 transition-transform"
                          >
                            <Play className="w-8 h-8 text-black ml-1" />
                          </button>
                        </div>
                      )}

                      {/* Native HTML5 Video */}
                      <video
                        ref={videoRef}
                        className="w-full block md:rounded-[3rem]"
                        style={{ aspectRatio: '9/16' }}
                        muted
                        loop
                        playsInline
                        preload="auto"
                      >
                        <source src="/nick-demo.mp4" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                  
                  {/* Controls bar under the video */}
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button 
                      onClick={handlePlayPause}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-highest border border-white/10 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all"
                    >
                      {isPlaying ? (
                        <><Pause className="w-4 h-4 text-primary" /> Pausa</>
                      ) : (
                        <><Play className="w-4 h-4 text-primary ml-0.5" /> Play</>
                      )}
                    </button>
                    <button 
                      onClick={toggleAudio}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-highest border border-white/10 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all"
                    >
                      {isMuted ? (
                        <><VolumeX className="w-4 h-4 text-on-surface-variant" /> Audio Off</>
                      ) : (
                        <><Volume2 className="w-4 h-4 text-primary" /> Audio On</>
                      )}
                    </button>
                  </div>

                  {/* Subtitle */}
                  <p className="mt-4 text-center text-sm text-on-surface-variant italic opacity-70 leading-relaxed max-w-xs mx-auto">
                    Scopri come Nick interagisce con i clienti in sala
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 w-full mt-32 border-t border-outline-variant/10 pt-16">
                  <div className="flex flex-col items-center text-center gap-6 group">
                    <div className="w-20 h-20 bg-primary/10 flex items-center justify-center rounded-full group-hover:bg-primary/20 transition-colors duration-500">
                      <span className="material-symbols-outlined text-primary text-3xl">translate</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl uppercase tracking-widest mb-3 text-on-surface">Onnisciente</h4>
                      <p className="text-base text-on-surface-variant leading-relaxed max-w-[320px] opacity-80">
                        Nick parla oltre <span className="text-primary font-bold">50 lingue</span> e conosce profondamente ogni dettaglio del tuo menu.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-6 group">
                    <div className="w-20 h-20 bg-primary/10 flex items-center justify-center rounded-full group-hover:bg-primary/20 transition-colors duration-500">
                      <span className="material-symbols-outlined text-primary text-3xl">map</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl uppercase tracking-widest mb-3 text-on-surface">Territoriale</h4>
                      <p className="text-base text-on-surface-variant leading-relaxed max-w-[320px] opacity-80">
                        Suggerisce ai clienti cosa visitare nei dintorni, trasformandosi in un vero <span className="text-primary font-bold">ufficio turistico</span> digitale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
