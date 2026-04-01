'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Save, 
  LayoutDashboard, 
  Settings as SettingsIcon,
  LogOut,
  Mail,
  Wallet,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge';

export default function AgentSettingsPage() {
  const router = useRouter();
  const [paypalEmail, setPaypalEmail] = useState('');
  const [iban, setIban] = useState('');
  const [bankHolder, setBankHolder] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await insforge.auth.getCurrentUser();
      if (!userData?.user) {
        router.push('/login?as=agent');
        return;
      }

      try {
        const { data: pData, error: pError } = await insforge.database
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();

        if (pError) throw pError;

        if (pData) {
          setProfile(pData);
          setPaypalEmail(pData.paypal_email || '');
          setIban(pData.iban || '');
          setBankHolder(pData.bank_holder || '');
        }
      } catch (err) {
        console.error("Failed to load settings profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await insforge.database
        .from('profiles')
        .update({ 
          paypal_email: paypalEmail,
          iban: iban,
          bank_holder: bankHolder
        })
        .eq('id', profile.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Impostazioni salvate correttamente.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Errore durante il salvataggio.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex selection:bg-primary selection:text-black">
      
      {/* Sidebar (Consistent with Dashboard) */}
      <aside className="w-72 bg-[#121214] border-r border-white/5 flex flex-col p-8 sticky top-0 h-screen hidden lg:flex">
        <div className="flex items-center gap-3 mb-16">
          <span className="text-xl font-black italic tracking-tighter text-white">Nick GastroGuide</span>
        </div>

        <nav className="flex-grow space-y-2">
            <button
              onClick={() => router.push('/agent-dashboard')}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest bg-zinc-800 text-white border border-white/10 shadow-2xl"
            >
              <SettingsIcon className="w-5 h-5 text-primary" /> Settings
            </button>
        </nav>

        <button 
            onClick={() => insforge.auth.signOut().then(() => router.push('/login'))}
            className="w-full flex items-center gap-4 px-6 py-4 text-zinc-500 hover:text-red-500 transition-all font-bold text-[10px] uppercase tracking-widest mt-auto border-t border-white/5 pt-8"
        >
            <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      <main className="flex-grow p-8 lg:p-12 max-w-[1000px] mx-auto w-full">
        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2 italic">Elite Settings</h1>
          <p className="text-zinc-400 text-sm font-medium">Configure your payment details and profile information.</p>
        </header>

        <div className="bg-[#121214] border border-white/5 rounded-[40px] p-10 lg:p-16">
            <form onSubmit={handleSave} className="space-y-12">
                
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Payout Method</h2>
                            <p className="text-zinc-500 text-xs mt-1">Payments are automated when reaching the €50 threshold.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">PayPal Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="email" 
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                    placeholder="your-paypal@email.com"
                                    className="w-full bg-zinc-900/50 border border-white/5 py-5 pl-16 pr-8 rounded-[24px] text-sm font-bold focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-white placeholder:text-zinc-700" 
                                />
                            </div>
                            <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest pl-2">Pagamenti istantanei su PayPal</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Bonifico Bancario (IBAN)</label>
                            <div className="relative group">
                                <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text" 
                                    value={iban}
                                    onChange={(e) => setIban(e.target.value)}
                                    placeholder="IT00 X 00000 00000 000000000000"
                                    className="w-full bg-zinc-900/50 border border-white/5 py-5 pl-16 pr-8 rounded-[24px] text-xs font-mono font-bold focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-white placeholder:text-zinc-700" 
                                />
                            </div>
                            <div className="relative group mt-3">
                                <AlertCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text" 
                                    value={bankHolder}
                                    onChange={(e) => setBankHolder(e.target.value)}
                                    placeholder="Intestatario del Conto"
                                    className="w-full bg-zinc-900/50 border border-white/5 py-5 pl-16 pr-8 rounded-[24px] text-sm font-bold focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-white placeholder:text-zinc-700" 
                                />
                            </div>
                            <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest pl-2">Richiede elaborato manuale (2-3 gg)</p>
                        </div>
                    </div>
                </section>

                <div className="pt-8 border-t border-white/5">
                    {message && (
                        <div className={`mb-8 p-6 rounded-3xl flex items-center gap-4 border ${
                            message.type === 'success' ? 'bg-emerald-400/5 border-emerald-500/20 text-emerald-400' : 'bg-red-400/5 border-red-500/20 text-red-400'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <p className="text-sm font-bold">{message.text}</p>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center justify-center gap-3 bg-primary text-black px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : <>Save Changes <Save className="w-4 h-4" /></>}
                    </button>
                </div>

            </form>
        </div>
      </main>
    </div>
  );
}
