import Image from 'next/image';
import Link from 'next/link';

export default function PremiumSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#030206] text-white py-32 font-body selection:bg-red-500/30 selection:text-red-200">
      {/* Background Grids and Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(220,38,38,0.15),transparent_60%)]"></div>
      
      {/* Top Left/Right Coordinates Background Accents */}
      <span className="absolute top-12 left-12 text-[8px] text-red-500/40 tracking-[0.2em] font-mono">[038_-204]</span>
      <span className="absolute top-12 right-12 text-[8px] text-red-500/40 tracking-[0.2em] font-mono">[15.58_-220V]</span>


      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-8 items-start justify-between">
        
        {/* Left Column: Typography & CTAs & Trust Gallery */}
        <div className="w-full lg:w-[45%] flex flex-col pt-10">
          
          <h2 className="text-4xl md:text-5xl lg:text-[64px] leading-[1.05] font-black tracking-tight mb-8">
            <span className="text-white block mb-2">Nick GastroGuide:</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 opacity-90 italic block">
              L'Intelligenza Artificiale che Rivoluziona la tua Ristorazione
            </span>
          </h2>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-12 max-w-lg font-light">
            Un concierge digitale premium che accoglie i tuoi ospiti e trasforma ogni tavolo in una recensione a 5 stelle.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-24">
            <Link href="/demo-chat" className="px-8 py-4 bg-transparent text-white rounded-lg border border-white/20 hover:border-white/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] transition-all text-sm font-semibold flex items-center justify-center relative overflow-hidden group">
              <span className="relative z-10">Guarda la Demo</span>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-red-400 via-orange-500 to-red-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>

          {/* Trust Gallery Container */}
          <div>
            <div className="flex justify-between items-center mb-6 max-w-lg border-b border-white/10 pb-4">
              <h4 className="text-sm font-semibold text-white/80">Trust Gallery</h4>
              <div className="flex gap-2">
                <button className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-xs text-white/60">chevron_left</span>
                </button>
                <button className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-xs text-white/60">chevron_right</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 sm:grid-rows-2 gap-[1px] bg-white/10 max-w-lg border border-white/10">
              {/* Trust Logos block (using placeholders for logos) */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`bg-[#0a0508] p-4 flex flex-col items-center justify-center text-center aspect-[4/3] relative ${i === 1 ? 'shadow-[inset_0_0_30px_rgba(220,38,38,0.3)] ring-1 ring-red-500 z-10' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
                  {i === 1 && <span className="absolute top-1 right-1 text-[6px] text-red-500 font-mono">D105</span>}
                  <div className={`w-6 h-6 rounded-full mb-2 flex items-center justify-center opacity-70 ${i === 1 ? 'hidden' : 'bg-white/10'}`}>
                    <span className="material-symbols-outlined text-[10px] text-white/50">restaurant</span>
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest font-bold ${i === 1 ? 'text-white' : 'text-white/50'}`}>
                    {i === 1 ? 'Ristorante Belvedere' : i === 0 ? 'Villa Gourmet' : 'Ristorante'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 3D Visualization Placeholder & Features Cards */}
        <div className="w-full lg:w-[55%] flex flex-col items-center">
          
          {/* 3D Visualization Area (Placeholder for the red mesh table) */}
          <div className="relative w-full aspect-[4/3] hidden md:flex items-center justify-center mb-12 group">
            <div className="absolute inset-0 bg-red-500/5 blur-[100px] rounded-full"></div>
            {/* Hologram Box */}
            <div className="w-[80%] aspect-video m-auto relative transform perspective-1000 rotate-x-60 rotate-z-12 hover:rotate-x-[55deg] transition-transform duration-700 pointer-events-none border border-red-500/20 shadow-[0_0_150px_rgba(220,38,38,0.15)] flex items-center justify-center">
              {/* Central Glowing Plate */}
              <div className="w-32 h-32 rounded-full border border-red-500/40 shadow-[0_0_50px_rgba(220,38,38,0.5)] flex items-center justify-center">
                 <div className="w-16 h-16 rounded-full bg-red-500/20 animate-pulse"></div>
              </div>
              
              {/* Decorative Mesh Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            </div>

            {/* Floating DATA HUDs */}
            <div className="absolute top-[20%] right-[10%] text-[8px] font-mono text-red-500/70 border-l border-red-500/30 pl-2">
              <span className="block">+8X.002153300</span>
              <span className="block opacity-50">DATA</span>
            </div>
            <div className="absolute bottom-[20%] left-[10%] text-[8px] font-mono text-red-500/70 border-l border-red-500/30 pl-2">
              <span className="block">+160.0520033</span>
              <span className="block opacity-50">DATA</span>
            </div>
            
            {/* Upload Instruction */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs text-center pointer-events-auto">
              [Area riservata asset 3D Rete Rossa]
            </div>
          </div>

          {/* 3 Features Cards */}
          <div className="w-full flex justify-between gap-4 overflow-x-auto pb-4 custom-scrollbar">
            
            {/* Card 1: Menu AI Strutturato */}
            <div className="min-w-[180px] flex-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/[0.05] hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-12">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/80 text-sm">description</span>
                </div>
                <div className="text-[6px] font-mono text-white/30 text-right leading-tight">
                  <span className="block">R/W</span>
                  <span className="block">40MS</span>
                  <span className="block">LOGS</span>
                </div>
              </div>
              {/* Chart Mock */}
              <div className="w-full h-12 mb-6 flex items-end relative border-b border-white/10">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M0,35 Q10,30 20,25 T40,20 T60,15 T80,10 T100,20 L100,40 L0,40 Z" fill="rgba(220,38,38,0.1)" stroke="none" />
                  <path d="M0,35 Q10,30 20,25 T40,20 T60,15 T80,10 T100,20" fill="none" stroke="rgba(220,38,38,0.8)" strokeWidth="1" />
                  <path d="M0,30 Q10,25 20,35 T40,25 T60,25 T80,30 T100,10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                </svg>
              </div>
              <h5 className="text-sm font-semibold tracking-wide">Menu AI<br/>Strutturato</h5>
            </div>

            {/* Card 2: Guida Turistica Integrata */}
            <div className="min-w-[180px] flex-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/[0.05] hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-12">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/80 text-sm">map</span>
                </div>
                <div className="text-[6px] font-mono text-white/30 text-right leading-tight">
                  <span className="block">N-4E</span>
                  <span className="block">+0.000</span>
                  <span className="block">1.033A</span>
                </div>
              </div>
              {/* Map Mock */}
              <div className="w-full h-12 mb-6 relative">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:8px_8px] rounded border border-white/5 opacity-50"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(220,38,38,1)]"></div>
              </div>
              <h5 className="text-sm font-semibold tracking-wide">Guida Turistica<br/>Integrata</h5>
            </div>

            {/* Card 3: Booster Recensioni Google */}
            <div className="min-w-[180px] flex-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/[0.05] hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-12">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold font-serif italic text-white/80">
                  G
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-white/50 block mb-1">Rating</span>
                  <div className="flex text-red-500 text-[8px]">
                    ★★★★★
                  </div>
                </div>
              </div>
              {/* Chart Mock */}
              <div className="w-full h-12 mb-6 flex items-end relative border-l border-b border-white/10">
                <div className="absolute -left-2 -bottom-2 text-[4px] text-white/20 font-mono">0</div>
                <div className="absolute -left-[10px] top-0 text-[4px] text-white/20 font-mono">100</div>
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M0,35 L20,30 L40,20 L60,30 L80,10 L100,5" fill="none" stroke="rgba(220,38,38,0.8)" strokeWidth="1.5" />
                  <path d="M0,35 L20,30 L40,20 L60,30 L80,10 L100,5 L100,40 L0,40 Z" fill="url(#gradient-chart)" stroke="none" />
                  <defs>
                    <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(220,38,38,0.2)" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h5 className="text-sm font-semibold tracking-wide">Booster<br/>Recensioni Google</h5>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
