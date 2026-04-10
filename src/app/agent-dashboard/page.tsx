'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  Copy, 
  CheckCircle2, 
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  Download,
  DollarSign,
  TrendingUp,
  BarChart2,
  ArrowUpRight,
  Clock,
  AlertCircle,
  Loader2,
  ExternalLink,
  Calendar,
  Store,
  Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { ADMIN_EMAILS } from '@/lib/constants';

// ─── STAT CARD ────────────────────────────────────────────────────
const EliteStatCard = ({ title, value, icon, sub, trend }: any) => (
  <div className="bg-[#121214] rounded-[32px] border border-white/5 p-8 hover:border-white/10 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 blur-3xl" />
    <div className="relative z-10 flex justify-between items-start mb-8">
      <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:text-black transition-colors">
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{value}</h3>
      {sub && <p className="text-xs text-zinc-400 font-medium">{sub}</p>}
    </div>
  </div>
);

export default function AgentDashboardPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    totalEarnings: 0,
    activeReferrals: 0,
    conversionRate: 0,
    pendingCommissions: 0,
    availableBalance: 0,
    totalCommissions: 0,
  });
  const [commissions, setCommissions] = useState<any[]>([]);
  const [affiliatedRestaurants, setAffiliatedRestaurants] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPayoutLoading, setIsPayoutLoading] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [commissionPage, setCommissionPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const initDashboard = async () => {
      // 1. Get current user
      const { data: userData } = await insforge.auth.getCurrentUser();
      let user = userData?.user;

      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const { data: secondAttempt } = await insforge.auth.getCurrentUser();
        user = secondAttempt?.user;
      }

      if (!user) {
        router.push('/login?as=agent');
        return;
      }
      
      setCurrentUser(user);

      // 2. Fetch Profile — strict agent/admin check
      try {
        const { data: pData } = await insforge.database
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');

        if (pData && (pData.is_agent || isAdmin)) {
          setProfile(pData);
        } else {
          // Not an agent — redirect away
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.error("Failed to load agent profile:", err);
        router.push('/login?as=agent');
        return;
      }

      // 3. Fetch Real Stats via RPC
      try {
        const { data: statsData } = await insforge.database.rpc('get_agent_stats', { p_agent_id: user.id });
        if (statsData) {
          setStats(statsData);
        }
      } catch (err) {
        console.error("Error fetching agent statistics:", err);
      }

      // 4. Fetch Commissions
      try {
        const { data: commData } = await insforge.database
          .from('commissions')
          .select('*, restaurants(name)')
          .eq('agent_id', user.id)
          .order('created_at', { ascending: false });

        if (commData) {
          setCommissions(commData);
        }
      } catch (err) {
        console.error("Error fetching commissions:", err);
      }

      // 5. Fetch Affiliated Restaurants (joined via referral)
      try {
        const { data: afData } = await insforge.database
          .from('profiles')
          .select('id, full_name, username, updated_at')
          .eq('referred_by_agent_id', user.id);

        if (afData && afData.length > 0) {
          // For each affiliated profile, check if they have a restaurant
          const enriched = [];
          for (const af of afData) {
            const { data: rData } = await insforge.database
              .from('restaurants')
              .select('id, name, slug, created_at')
              .eq('owner_id', af.id)
              .maybeSingle();
            
            enriched.push({
              ...af,
              restaurant: rData || null,
              hasRestaurant: !!rData
            });
          }
          setAffiliatedRestaurants(enriched);
        }
      } catch (err) {
        console.error("Error fetching affiliates:", err);
      }

      // 6. Fetch Payout History
      try {
        const { data: pData } = await insforge.database
          .from('payouts')
          .select('*')
          .eq('agent_id', user.id)
          .order('created_at', { ascending: false });

        if (pData) {
          setPayouts(pData);
        }
      } catch (err) {
        console.error("Error fetching payouts:", err);
      }
      
      setIsLoading(false);
    };
    initDashboard();
  }, [router]);

  const referralLink = `https://nickgastroguide.it/signup?ref=${profile?.referral_code || ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestPayout = async (method: 'paypal' | 'bank_transfer') => {
    if (!currentUser) return;
    setIsPayoutLoading(true);
    setPayoutMessage(null);

    try {
      if (method === 'paypal') {
        const res = await fetch('/api/paypal-payout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent_id: currentUser.id }),
        });

        const data = await res.json();

        if (!res.ok) {
          setPayoutMessage({ type: 'error', text: data.error });
          setIsPayoutLoading(false);
          return;
        } else {
          setPayoutMessage({ type: 'success', text: data.message });
        }
      } else {
        // Manual Bank Transfer
        // 1. Get available balance
        const { data: statsData } = await insforge.database.rpc('get_agent_stats', { p_agent_id: currentUser.id });
        const balance = parseFloat(statsData?.availableBalance || 0);
        
        if (balance < 50) {
          setPayoutMessage({ type: 'error', text: 'Saldo insufficiente (min. €50)' });
          setIsPayoutLoading(false);
          return;
        }

        // 2. Create payout record
        const { error } = await insforge.database
          .from('payouts')
          .insert({
            agent_id: currentUser.id,
            amount: balance,
            status: 'requested',
            method: 'bank_transfer'
          });

        if (error) throw error;
        setPayoutMessage({ type: 'success', text: 'Richiesta di bonifico registrata. Sarà elaborata entro 3gg.' });
      }

      // Common Refresh logic
      const { data: newStats } = await insforge.database.rpc('get_agent_stats', { p_agent_id: currentUser.id });
      if (newStats) setStats(newStats);
      
      const { data: newComm } = await insforge.database
        .from('commissions')
        .select('*, restaurants(name)')
        .eq('agent_id', currentUser.id)
        .order('created_at', { ascending: false });
      if (newComm) setCommissions(newComm);

      const { data: newPayouts } = await insforge.database
        .from('payouts')
        .select('*')
        .eq('agent_id', currentUser.id)
        .order('created_at', { ascending: false });
      if (newPayouts) setPayouts(newPayouts);

    } catch (err: any) {
      setPayoutMessage({ type: 'error', text: 'Errore durante la richiesta. Riprova.' });
    } finally {
      setIsPayoutLoading(false);
    }
  };

  const formatCurrency = (val: number) => `€${val.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'revenue', name: 'Revenue', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'affiliates', name: 'Affiliates', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const paginatedCommissions = commissions.slice(
    commissionPage * ITEMS_PER_PAGE, 
    (commissionPage + 1) * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(commissions.length / ITEMS_PER_PAGE);

  // When settings tab is clicked, navigate to settings page
  useEffect(() => {
    if (activeTab === 'settings') {
      router.push('/agent-dashboard/settings');
    }
  }, [activeTab, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── RENDER TAB CONTENT ─────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {

      // ═══════════════════════════════════════════════════
      // TAB: DASHBOARD
      // ═══════════════════════════════════════════════════
      case 'dashboard':
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <EliteStatCard 
                title="Guadagni Totali" 
                value={formatCurrency(parseFloat(stats.totalEarnings) || 0)} 
                sub="Commissioni pagate"
                icon={<Wallet className="w-6 h-6 text-white" />} 
              />
              <EliteStatCard 
                title="Referral Attivi" 
                value={stats.activeReferrals?.toString() || '0'}
                sub="Utenti registrati tramite te" 
                icon={<Users className="w-6 h-6 text-white" />} 
              />
              <EliteStatCard 
                title="Tasso Conversione" 
                value={`${stats.conversionRate || 0}%`}
                sub="Referral che hanno attivato il servizio" 
                icon={<BarChart2 className="w-6 h-6 text-white" />} 
              />
              <div className="bg-zinc-900 border-2 border-primary/20 rounded-[32px] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Commissioni Pending</p>
                <h3 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
                  {formatCurrency(parseFloat(stats.pendingCommissions) || 0)}
                </h3>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-6">
                  {parseFloat(stats.pendingCommissions) >= 50 
                    ? 'Puoi richiedere il payout!' 
                    : `Soglia payout: €50,00`
                  }
                </p>
              </div>
            </div>

            {/* Referral Card */}
            <div className="bg-[#121214] border border-white/5 rounded-[40px] p-10 relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-grow">
                  <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Accesso Esclusivo</span>
                  <h2 className="text-4xl font-black mb-4 tracking-tighter italic">Il Tuo Link Affiliate</h2>
                  <p className="text-zinc-400 text-sm mb-10 max-w-lg leading-relaxed">
                    Condividi questo link con i ristoratori per guadagnare il 40% sulla prima attivazione e il 10% su ogni rinnovo mensile.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/5 border border-white/5 p-2 rounded-2xl group focus-within:border-primary/20 transition-all">
                    <span className="px-6 py-2 text-primary font-mono text-xs select-all truncate max-w-full overflow-hidden">
                      {referralLink}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary/20"
                    >
                      {copied ? (
                        <>Copiato! <CheckCircle2 className="w-4 h-4" /></>
                      ) : (
                        <>Copia <Copy className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>

                <div className="shrink-0 bg-white/5 border border-white/10 p-4 rounded-[32px] text-center backdrop-blur-md group hover:border-primary/50 transition-all">
                  <div className="w-40 h-40 bg-white p-4 rounded-2xl mb-4 group-hover:scale-105 transition-transform">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(referralLink)}`} alt="QR Code" className="w-full h-full grayscale" />
                  </div>
                  <a 
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(referralLink)}&format=png`}
                    download="qr-referral.png"
                    className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mx-auto hover:text-white transition-colors"
                  >
                    <Download className="w-3 h-3" /> Scarica QR Code
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Commissions Preview */}
            <div className="mb-12">
              <div className="flex justify-between items-end gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter italic mb-2">Ultime Commissioni</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    {commissions.length} transazioni totali
                  </p>
                </div>
                {commissions.length > 5 && (
                  <button 
                    onClick={() => setActiveTab('revenue')}
                    className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors"
                  >
                    Vedi tutto <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="bg-[#121214] border border-white/5 rounded-[40px] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ristorante</th>
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Data</th>
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tipo</th>
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Commissione</th>
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {commissions.length > 0 ? commissions.slice(0, 5).map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-[10px] font-black border border-white/5 group-hover:bg-zinc-700">
                              {item.restaurants?.name?.charAt(0) || 'R'}
                            </div>
                            <span className="text-sm font-bold text-white">{item.restaurants?.name || 'Ristorante'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-xs text-zinc-400 font-medium">
                          {new Date(item.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-10 py-6">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            item.type === 'acquisition' 
                              ? 'bg-primary/10 text-primary border border-primary/20' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {item.type === 'acquisition' ? '40% Primo' : '10% Rinnovo'}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-primary font-black text-sm italic">{formatCurrency(parseFloat(item.amount))}</span>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            item.status === 'paid' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {item.status === 'paid' ? 'Pagato' : 'In Attesa'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center text-zinc-500 text-sm font-medium">
                          <div className="flex flex-col items-center gap-4">
                            <Wallet className="w-12 h-12 text-zinc-700" />
                            <p>Nessuna commissione ancora. Condividi il tuo link referral per iniziare a guadagnare!</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      // ═══════════════════════════════════════════════════
      // TAB: REVENUE
      // ═══════════════════════════════════════════════════
      case 'revenue':
        return (
          <>
            {/* Balance & Payout Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Guadagni Totali (Pagati)</p>
                <h3 className="text-4xl font-black text-white tracking-tighter mb-2">
                  {formatCurrency(parseFloat(stats.totalEarnings) || 0)}
                </h3>
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Trasferiti su PayPal
                </p>
              </div>
              
              <div className="bg-zinc-900 border-2 border-primary/20 rounded-[32px] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[40px] rounded-full" />
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Saldo Disponibile</p>
                <h3 className="text-4xl font-black text-white tracking-tighter mb-2 italic relative z-10">
                  {formatCurrency(parseFloat(stats.availableBalance) || 0)}
                </h3>
                <p className="text-xs text-primary font-bold relative z-10">
                  {parseFloat(stats.availableBalance) >= 50 ? '✓ Payout disponibile' : `Min. €50 per payout`}
                </p>
              </div>

              <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between">
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Richiedere il Pagamento</p>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Scegli il metodo preferito. La soglia minima è di **€50,00**.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => handleRequestPayout('paypal')}
                    disabled={isPayoutLoading || !profile?.paypal_email || parseFloat(stats.availableBalance) < 50}
                    className="w-full py-4 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPayoutLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> ...</>
                    ) : (
                      <><DollarSign className="w-4 h-4" /> Payout PayPal</>
                    )}
                  </button>
                  <button
                    onClick={() => handleRequestPayout('bank_transfer')}
                    disabled={isPayoutLoading || !profile?.iban || parseFloat(stats.availableBalance) < 50}
                    className="w-full py-4 bg-zinc-800 text-white border border-white/5 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPayoutLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> ...</>
                    ) : (
                      <><Wallet className="w-4 h-4" /> Bonifico Bancario</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Payout Message */}
            {payoutMessage && (
              <div className={`mb-8 p-6 rounded-3xl flex items-center gap-4 border ${
                payoutMessage.type === 'success' 
                  ? 'bg-emerald-400/5 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-400/5 border-red-500/20 text-red-400'
              }`}>
                {payoutMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="text-sm font-bold">{payoutMessage.text}</p>
              </div>
            )}

            {/* Payout History */}
            {payouts.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-black tracking-tighter italic mb-6">Storico Pagamenti</h3>
                <div className="bg-[#121214] border border-white/5 rounded-[32px] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Data</th>
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Metodo</th>
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Importo</th>
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stato</th>
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Riferimento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payouts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-5 text-sm text-zinc-300 font-medium whitespace-nowrap">
                            {new Date(p.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-8 py-5">
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              {p.method === 'bank_transfer' ? (
                                <><Wallet className="w-3 h-3" /> Bonifico</>
                              ) : (
                                <><DollarSign className="w-3 h-3" /> PayPal</>
                              )}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-black text-white">{formatCurrency(parseFloat(p.amount))}</td>
                          <td className="px-8 py-5">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                              p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              p.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {p.status === 'completed' ? 'Completato' : p.status === 'processing' ? 'In Elaborazione' : 'Richiesto'}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-[10px] text-zinc-500 font-mono truncate max-w-[120px]">{p.paypal_ref || p.method === 'bank_transfer' ? 'In attesa...' : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Full Commission Table */}
            <div>
              <div className="flex justify-between items-end gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic mb-2">Tutte le Commissioni</h3>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    {commissions.length} commissioni totali • 40% primo acquisto + 10% rinnovi
                  </p>
                </div>
              </div>

              <div className="bg-[#121214] border border-white/5 rounded-[40px] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ristorante</th>
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Data</th>
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tipo</th>
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Commissione</th>
                        <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {paginatedCommissions.length > 0 ? paginatedCommissions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center text-[10px] font-black border border-white/5">
                                {item.restaurants?.name?.charAt(0) || 'R'}
                              </div>
                              <span className="text-sm font-bold text-white">{item.restaurants?.name || 'Ristorante'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-xs text-zinc-400 font-medium">
                            {new Date(item.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                              item.type === 'acquisition' 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {item.type === 'acquisition' ? '40%' : '10%'}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-primary font-black text-sm italic">{formatCurrency(parseFloat(item.amount))}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                              item.status === 'paid' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.status === 'paid' ? 'Pagato' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-8 py-16 text-center text-zinc-500 text-sm">
                            Nessuna commissione registrata.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Pagina {commissionPage + 1} di {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCommissionPage(Math.max(0, commissionPage - 1))}
                        disabled={commissionPage === 0}
                        className="px-4 py-2 bg-zinc-800 text-white text-xs font-bold rounded-xl disabled:opacity-30 hover:bg-zinc-700 transition-colors"
                      >
                        ← Prec
                      </button>
                      <button 
                        onClick={() => setCommissionPage(Math.min(totalPages - 1, commissionPage + 1))}
                        disabled={commissionPage >= totalPages - 1}
                        className="px-4 py-2 bg-zinc-800 text-white text-xs font-bold rounded-xl disabled:opacity-30 hover:bg-zinc-700 transition-colors"
                      >
                        Succ →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        );

      // ═══════════════════════════════════════════════════
      // TAB: AFFILIATES
      // ═══════════════════════════════════════════════════
      case 'affiliates':
        return (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <EliteStatCard 
                title="Totale Affiliati" 
                value={affiliatedRestaurants.length.toString()}
                sub="Registrati tramite il tuo link"
                icon={<Users className="w-6 h-6 text-white" />} 
              />
              <EliteStatCard 
                title="Con Ristorante Attivo" 
                value={affiliatedRestaurants.filter(a => a.hasRestaurant).length.toString()}
                sub="Hanno attivato il servizio"
                icon={<Store className="w-6 h-6 text-white" />} 
              />
              <EliteStatCard 
                title="Tasso Conversione" 
                value={`${stats.conversionRate || 0}%`}
                sub="Registrazione → Attivazione"
                icon={<TrendingUp className="w-6 h-6 text-white" />} 
              />
            </div>

            {/* Affiliates List */}
            <div className="bg-[#121214] border border-white/5 rounded-[40px] overflow-hidden">
              <div className="px-10 py-6 border-b border-white/5">
                <h3 className="text-xl font-black tracking-tighter">I Tuoi Affiliati</h3>
              </div>
              
              {affiliatedRestaurants.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {affiliatedRestaurants.map((af, idx) => (
                    <div key={idx} className="px-10 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/5">
                          {af.hasRestaurant ? (
                            <Store className="w-5 h-5 text-primary" />
                          ) : (
                            <Users className="w-5 h-5 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5">
                            {af.restaurant?.name || af.full_name || af.username || 'Utente'}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {af.full_name || af.username || 'Senza nome'} 
                            {af.restaurant && <span className="text-primary ml-2">• {af.restaurant.name}</span>}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">
                            Registrato
                          </p>
                          <p className="text-xs text-zinc-300 font-medium">
                            {new Date(af.restaurant?.created_at || af.updated_at).toLocaleDateString('it-IT', { 
                              day: '2-digit', month: 'short', year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${
                          af.hasRestaurant 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {af.hasRestaurant ? 'Attivo' : 'In Attesa'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-10 py-20 text-center">
                  <Users className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-zinc-400 mb-2">Nessun affiliato ancora</h4>
                  <p className="text-sm text-zinc-600 max-w-md mx-auto mb-6">
                    Condividi il tuo link referral con i ristoratori. Quando si registrano, appariranno qui e guadagnerai commissioni automatiche.
                  </p>
                  <button
                    onClick={() => { setActiveTab('dashboard'); }}
                    className="px-6 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all"
                  >
                    Vai al tuo Link Referral
                  </button>
                </div>
              )}
            </div>
          </>
        );

      // ═══════════════════════════════════════════════════
      // TAB: SETTINGS (redirect)
      // ═══════════════════════════════════════════════════
      case 'settings':
        // Redirect handled on click
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex selection:bg-primary selection:text-black">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#121214] border-r border-white/5 flex flex-col p-8 sticky top-0 h-screen hidden lg:flex">
        <div className="flex items-center gap-3 mb-16">
          <span className="text-xl font-black italic tracking-tighter text-white">Nick GastroGuide</span>
        </div>

        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-3xl mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Elite Agent</p>
              <p className="text-xs font-bold truncate max-w-[120px]">{profile?.full_name || 'Agent'}</p>
            </div>
          </div>
          {profile?.paypal_email && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
              <Mail className="w-3 h-3 text-zinc-500" />
              <p className="text-[10px] text-zinc-500 truncate">{profile.paypal_email}</p>
            </div>
          )}
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
                activeTab === item.id 
                  ? 'bg-zinc-800 text-white border border-white/10 shadow-2xl' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span className={`transition-colors ${activeTab === item.id ? 'text-primary' : ''}`}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/5 pt-8">
          <a 
            href="mailto:info@nickgastroguide.it"
            className="w-full flex items-center gap-4 px-6 py-4 text-zinc-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest mb-2"
          >
            <Mail className="w-4 h-4" /> Contattaci
          </a>
          <button 
            onClick={() => insforge.auth.signOut().then(() => router.push('/login'))}
            className="w-full flex items-center gap-4 px-6 py-4 text-zinc-500 hover:text-red-500 transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
              {activeTab === 'dashboard' && 'Dashboard Agente'}
              {activeTab === 'revenue' && 'Revenue & Pagamenti'}
              {activeTab === 'affiliates' && 'I Tuoi Affiliati'}
            </h1>
            <p className="text-zinc-400 text-sm font-medium">
              {activeTab === 'dashboard' && `Benvenuto, ${profile?.full_name || 'Agente'}. Ecco il riepilogo delle tue performance.`}
              {activeTab === 'revenue' && 'Gestisci le tue commissioni e richiedi pagamenti via PayPal.'}
              {activeTab === 'affiliates' && 'I ristoratori che si sono registrati tramite il tuo link referral.'}
            </p>
          </div>
          
          {/* Mobile menu */}
          <div className="flex gap-2 lg:hidden">
            {navItems.filter(i => i.id !== 'settings').map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-primary text-black' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </header>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest pb-12 mt-12">
          <p>© {new Date().getFullYear()} Nick GastroGuide. Area Agenti.</p>
          <div className="flex gap-8">
            <a href="mailto:info@nickgastroguide.it" className="hover:text-white transition-colors">Contatti</a>
            <a href="/recruiting" className="hover:text-white transition-colors">Info Programma</a>
          </div>
        </footer>

      </main>
    </div>
  );
}
