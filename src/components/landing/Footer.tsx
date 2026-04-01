import Link from 'next/link';

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-[#131313] w-full border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1440px] mx-auto">
          <div className="space-y-6">
            <div className="text-xl font-headline italic text-[#ffb59e]">Nick GastroGuide</div>
            <div className="space-y-2">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">Studio Anthos Alba</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">Founder: Antonio Magazzù</p>
              <a href="mailto:info@nickgastroguide.it" className="text-white/40 hover:text-[#ffb59e] transition-colors text-[10px] uppercase tracking-widest font-black">info@nickgastroguide.it</a>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-[200px]">Social Sustainability & Culinary Excellence. Per un futuro del gusto consapevole.</p>
          </div>
          <div>
            <h4 className="font-label text-sm tracking-wide uppercase text-[#ffb59e] mb-8">Piattaforma</h4>
            <ul className="space-y-4">
              <li><Link className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-xs uppercase tracking-widest" href="/demo-chat">Guarda la demo</Link></li>
              <li><Link className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-xs uppercase tracking-widest" href="/sustainability">Sustainability Report</Link></li>
              <li><Link className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-xs uppercase tracking-widest" href="/sdg-impact">SDG Impact</Link></li>
              <li><Link className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-xs uppercase tracking-widest" href="/affiliation">Affiliazione</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label text-sm tracking-wide uppercase text-[#ffb59e] mb-8">Legale</h4>
            <ul className="space-y-4">
              <li><Link className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-xs uppercase tracking-widest" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-xs uppercase tracking-widest" href="/terms">Terms of Service</Link></li>
              <li><Link className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-xs uppercase tracking-widest" href="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label text-sm tracking-wide uppercase text-[#ffb59e] mb-8">Social</h4>
            <ul className="space-y-4">
              <li><a className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-[10px] uppercase tracking-widest font-black" href="https://www.instagram.com/anthosalba/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className="text-white/40 hover:text-[#ffb59e] transition-all hover:translate-x-1 inline-block text-[10px] uppercase tracking-widest font-black" href="https://www.linkedin.com/company/112474074/admin/dashboard/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-12 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] text-center md:text-left">© 2024 Studio Anthos Alba. Nick GastroGuide Excellence.</p>
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] text-center md:text-right">Made in Italy for the world.</p>
        </div>
      </footer>
    </>
  );
}
