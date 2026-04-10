'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Store, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Lock,
  Mail,
  Zap,
  ArrowRight,
  Key,
  Trash2,
  LogOut,
  User,
  LayoutDashboard,
  Eye,
  X,
  Link as LinkIcon,
  Copy
} from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { ADMIN_EMAILS } from '@/lib/constants';

export default function SecretAdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  
  // New User Form State
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'ristoratore', // 'ristoratore' | 'agent'
    name: ''
  });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Login Form State for integrated access
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Recovery System State
  const [recoveryStep, setRecoveryStep] = useState<'none' | 'request' | 'verify'>('none');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryPassword, setRecoveryPassword] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        const user = data.user;
        setCurrentUser(user);
        if (ADMIN_EMAILS.includes(user.email?.toLowerCase() || '')) {
          setIsAuthorized(true);
          fetchUsers();
        } else {
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(null); // Explicitly null means show integrated login
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  const fetchUsers = async () => {
    setIsFetchingUsers(true);
    try {
      const { data, error } = await insforge.database.rpc('admin_get_users');
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsFetchingUsers(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setMessage(null);
    try {
      const normalizedEmail = loginForm.email.toLowerCase().trim();
      const { data, error } = await insforge.auth.signInWithPassword({ 
        email: normalizedEmail, 
        password: loginForm.password 
      });
      if (error) throw error;
      
      const user = data.user;
      setCurrentUser(user);
      if (ADMIN_EMAILS.includes(user.email?.toLowerCase() || '')) {
         setIsAuthorized(true);
         fetchUsers();
      } else {
         setIsAuthorized(false);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Accesso negato: credenziali amministrative non valide.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);
    setMessage(null);
    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.toLowerCase().trim(), isAdminRecovery: true })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setRecoveryStep('verify');
      setMessage({ type: 'success', text: 'Codice di sicurezza inviato alla tua email admin.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsRecovering(false);
    }
  };

  const handleVerifyRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);
    setMessage(null);
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: recoveryEmail.toLowerCase().trim(), 
          code: recoveryCode, 
          newPassword: recoveryPassword 
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setRecoveryStep('none');
      setLoginForm({ email: recoveryEmail, password: '' });
      setMessage({ type: 'success', text: 'Password aggiornata! Ora puoi accedere.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsRecovering(false);
    }
  };

  const handleLogout = async () => {
    await insforge.auth.signOut();
    setCurrentUser(null);
    setIsAuthorized(null);
    setUsers([]);
    setRecoveryStep('none');
  };

  const [showRoleSelector, setShowRoleSelector] = useState<{email: string, role: string} | null>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'agent' | 'restaurant' | 'admin'>('all');

  // Computed: filtered users
  const filteredUsers = users.filter(u => {
    // Search filter
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      u.email.toLowerCase().includes(q) || 
      (u.full_name || '').toLowerCase().includes(q) ||
      (u.restaurant_name || '').toLowerCase().includes(q);
    
    // Role filter
    let matchesRole = true;
    if (roleFilter === 'agent') matchesRole = u.is_agent === true;
    else if (roleFilter === 'restaurant') matchesRole = !u.is_agent && !ADMIN_EMAILS.includes(u.email.toLowerCase());
    else if (roleFilter === 'admin') matchesRole = ADMIN_EMAILS.includes(u.email.toLowerCase());
    
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: users.length,
    agents: users.filter(u => u.is_agent).length,
    restaurants: users.filter(u => !u.is_agent && !ADMIN_EMAILS.includes(u.email.toLowerCase())).length,
    admins: users.filter(u => ADMIN_EMAILS.includes(u.email.toLowerCase())).length
  };

  const handleViewUser = async (user: any) => {
    setIsLoadingDetails(true);
    setViewingUser({ ...user, _loading: true });
    try {
      // Fetch profile
      const { data: profileData } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch restaurant (if any)
      const { data: restaurantData } = await insforge.database
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      // Fetch referral stats (if agent)
      let referralStats = null;
      if (user.is_agent && profileData?.referral_code) {
        const { data: referrals } = await insforge.database
          .from('referrals')
          .select('*')
          .eq('agent_id', user.id);
        referralStats = {
          total: referrals?.length || 0,
          active: referrals?.filter((r: any) => r.status === 'active')?.length || 0,
          referralCode: profileData.referral_code
        };
      }

      setViewingUser({
        ...user,
        profile: profileData,
        restaurant: restaurantData,
        referralStats,
        _loading: false
      });
    } catch (err) {
      console.error('Error fetching user details:', err);
      setViewingUser({ ...user, _loading: false, _error: true });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSwitchAccount = async (targetEmail: string, preferredRole: string) => {
    if (confirm(`Vuoi accedere all'account di ${targetEmail}? Verrà impostata una password temporanea per l'accesso.`)) {
      try {
        setIsFetchingUsers(true);
        setShowRoleSelector(null);
        
        // 1. Generate a strong random temp password
        const tempPassword = 'Tmp_' + Math.random().toString(36).substring(2, 10) + '!' + Date.now().toString(36);
        
        // 2. Set temp password via existing admin RPC
        const response = await insforge.functions.invoke('admin-manage-user', {
          body: { 
            action: 'set_password', 
            targetEmail,
            targetPassword: tempPassword
          }
        });

        console.log('Switch response:', JSON.stringify(response));

        // Handle various error formats from InsForge
        if (response.error) {
          const errMsg = typeof response.error === 'string' ? response.error : response.error.message || JSON.stringify(response.error);
          throw new Error(errMsg);
        }
        if (response.data?.error) throw new Error(response.data.error);
        
        // 3. Sign out current admin session
        await insforge.auth.signOut();
        
        // 4. Sign in as target user with temp password
        const { data: loginData, error: loginError } = await insforge.auth.signInWithPassword({
          email: targetEmail,
          password: tempPassword
        });

        if (loginError) throw loginError;
        
        // 5. Redirect to the correct dashboard
        const targetPath = preferredRole === 'agent' ? '/agent-dashboard' : '/dashboard';
        window.location.href = targetPath;

      } catch (err: any) {
        console.error('Switch error details:', err);
        alert("Errore switch: " + (err?.message || err?.toString() || 'Errore sconosciuto'));
        // If we got signed out but login failed, redirect to admin login
        const { data } = await insforge.auth.getCurrentUser();
        if (!data?.user) {
          window.location.href = '/nick-secret-admin';
        }
      } finally {
        setIsFetchingUsers(false);
      }
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (confirm(`Eliminare DEFINITIVAMENTE ${userEmail}?`)) {
      try {
        const { error } = await insforge.database.rpc('admin_delete_user', { p_user_id: userId });
        if (error) throw error;
        setMessage({ type: 'success', text: `Utente eliminato.` });
        fetchUsers();
      } catch (err: any) {
        alert("Errore: " + err.message);
      }
    }
  };

  const handleSetPassword = async (userEmail: string) => {
    const newPassword = prompt(`Nuova password per ${userEmail}:`);
    if (!newPassword) return;
    try {
      const response = await insforge.functions.invoke('admin-manage-user', {
        body: { action: 'set_password', targetEmail: userEmail, targetPassword: newPassword }
      });
      if (response.error) throw new Error(response.error.message);
      alert("Password aggiornata.");
    } catch (err: any) {
      alert("Errore: " + err.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);
    try {
      const { data, error: signUpError } = await insforge.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name, 
      });
      if (signUpError) throw signUpError;
      if (data?.user?.id) {
        await insforge.database.from('profiles').upsert({
          id: data.user.id,
          full_name: newUser.name,
          role: newUser.role,
          is_agent: newUser.role === 'agent'
        });
      }
      setMessage({ type: 'success', text: `Account creato.` });
      setNewUser({ email: '', password: '', role: 'ristoratore', name: '' });
      fetchUsers();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
         <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
         <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest leading-none">Secret Backend Sync...</p>
      </div>
    );
  }

  // Not Logged In - Show Integrated Login/Recovery Forms
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
         <div className="max-w-md w-full bg-zinc-900 border border-white/10 p-12 rounded-[50px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all" />
            
            {recoveryStep === 'none' ? (
              <>
                <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-8" />
                <h1 className="text-2xl font-black mb-2 tracking-tight uppercase italic">Secret Access</h1>
                <p className="text-zinc-500 text-[10px] mb-10 uppercase font-black tracking-widest leading-none">Ingresso Amministrativo</p>
                
                {message && (
                   <div className={`p-4 rounded-2xl mb-8 text-[10px] font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {message.text}
                   </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">Email Super-User</label>
                      <input 
                        type="email" 
                        required 
                        value={loginForm.email} 
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        placeholder="Esempio: nick@gastroguide.it" 
                        className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-primary outline-none transition-all placeholder:text-zinc-800" 
                      />
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between items-center px-4">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Password</label>
                        <button type="button" onClick={() => setRecoveryStep('request')} className="text-[9px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Dimenticata?</button>
                      </div>
                      <input 
                        type="password" 
                        required 
                        value={loginForm.password} 
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-primary outline-none transition-all placeholder:text-zinc-800" 
                      />
                   </div>
                   <button 
                     type="submit" 
                     disabled={isLoggingIn}
                     className="w-full py-5 mt-4 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
                   >
                      {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sblocca Pannello"}
                   </button>
                </form>
              </>
            ) : recoveryStep === 'request' ? (
              <>
                <Mail className="w-16 h-16 text-primary mx-auto mb-8" />
                <h1 className="text-2xl font-black mb-2 tracking-tight uppercase italic">Recupero Password</h1>
                <p className="text-zinc-500 text-[10px] mb-10 uppercase font-black tracking-widest leading-none">Solo per Amministratori</p>
                
                {message && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl mb-8 text-[10px] font-bold flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> {message.text}
                   </div>
                )}

                <form onSubmit={handleRequestRecovery} className="space-y-4 text-left">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">Email Admin da resettare</label>
                      <input 
                        type="email" 
                        required 
                        value={recoveryEmail} 
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="Inserisci email autorizzata" 
                        className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-primary outline-none transition-all placeholder:text-zinc-800" 
                      />
                   </div>
                   <button 
                     type="submit" 
                     disabled={isRecovering}
                     className="w-full py-5 mt-4 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
                   >
                      {isRecovering ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Invia Codice Reset"}
                   </button>
                   <button type="button" onClick={() => setRecoveryStep('none')} className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest py-2 hover:text-white transition-colors">Torna al Login</button>
                </form>
              </>
            ) : (
              <>
                <Key className="w-16 h-16 text-primary mx-auto mb-8" />
                <h1 className="text-2xl font-black mb-2 tracking-tight uppercase italic">Verifica Codice</h1>
                <p className="text-zinc-500 text-[10px] mb-10 uppercase font-black tracking-widest leading-none">Controlla la tua email</p>
                
                {message && (
                   <div className={`p-4 rounded-2xl mb-8 text-[10px] font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {message.text}
                   </div>
                )}

                <form onSubmit={handleVerifyRecovery} className="space-y-4 text-left">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">Codice a 6 cifre</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={6}
                        value={recoveryCode} 
                        onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000" 
                        className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-primary outline-none transition-all placeholder:text-zinc-800 text-center tracking-[0.5em] font-mono" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">Nuova Password Admin</label>
                      <input 
                        type="password" 
                        required 
                        value={recoveryPassword} 
                        onChange={(e) => setRecoveryPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-primary outline-none transition-all placeholder:text-zinc-800" 
                      />
                   </div>
                   <button 
                     type="submit" 
                     disabled={isRecovering}
                     className="w-full py-5 mt-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white transition-all shadow-xl shadow-emerald-500/10 disabled:opacity-50"
                   >
                      {isRecovering ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Aggiorna Password Admin"}
                   </button>
                </form>
              </>
            )}
         </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
         <div className="max-w-md bg-zinc-900 border border-red-500/20 p-12 rounded-[50px] shadow-2xl">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-8 animate-pulse" />
            <h1 className="text-3xl font-black mb-4 tracking-tight">Accesso Negato</h1>
            <p className="text-zinc-400 text-sm mb-10 leading-relaxed">
              L'account <span className="text-white font-bold">{currentUser?.email}</span> non ha i permessi necessari per accedere a questa area super-privata.
            </p>
            
            <div className="flex flex-col gap-4">
               <button 
                 onClick={handleLogout}
                 className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl shadow-red-500/20"
               >
                  Disconnetti e Cambia Account
               </button>
               <button 
                 onClick={() => router.push('/dashboard')}
                 className="w-full py-4 bg-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:text-white transition-all"
               >
                  Torna alla Dashboard Ristoratore
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
      <div className="bg-zinc-900 border-b border-white/5 p-6 sticky top-0 z-50 backdrop-blur-xl">
         <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <ShieldCheck className="w-6 h-6 text-black" />
               </div>
               <div>
                  <h1 className="text-lg font-black tracking-tighter uppercase italic">Secret Admin</h1>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none">Internal Management</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden md:block text-right">
                  <p className="text-xs font-bold">{currentUser?.email}</p>
                  <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em]">Authorized</p>
               </div>
               <button onClick={handleLogout} className="p-2.5 bg-red-500/10 hover:bg-red-500 rounded-xl text-red-500 hover:text-white transition-all"><LogOut className="w-4 h-4" /></button>
            </div>
         </div>
      </div>

      <main className="container mx-auto p-6 md:p-10">
         <div className="grid lg:grid-cols-12 gap-10">
            {/* Form */}
            <div className="lg:col-span-4">
               <div className="bg-zinc-900 border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center"><UserPlus className="w-5 h-5 text-primary" /></div>
                     <h2 className="text-xl font-black">Crea Account</h2>
                  </div>

                  {message && (
                     <div className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {message.text}
                     </div>
                  )}

                  <form onSubmit={handleCreateUser} className="space-y-4">
                     <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setNewUser({...newUser, role: 'ristoratore'})} className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${newUser.role === 'ristoratore' ? 'bg-primary border-primary text-black' : 'bg-black border-white/10 text-zinc-500'}`}><Store className="w-3.5 h-3.5" /> Ristoratore</button>
                        <button type="button" onClick={() => setNewUser({...newUser, role: 'agent'})} className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${newUser.role === 'agent' ? 'bg-amber-500 border-amber-500 text-black' : 'bg-black border-white/10 text-zinc-500'}`}><Zap className="w-3.5 h-3.5" /> Agente</button>
                     </div>
                     <input required value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} placeholder="Nome Completo" className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 text-xs focus:border-primary outline-none transition-all" />
                     <input type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} placeholder="Email" className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 text-xs focus:border-primary outline-none transition-all" />
                     <input type="password" required value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} placeholder="Password" className="w-full bg-black border border-white/10 rounded-xl py-3.5 px-4 text-xs focus:border-primary outline-none transition-all" />
                     <button type="submit" disabled={creating} className="w-full py-4 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white transition-all shadow-lg shadow-primary/10">{creating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Registra Utente"}</button>
                  </form>
               </div>
            </div>

            {/* List */}
            <div className="lg:col-span-8">
               <div className="bg-zinc-900 border border-white/5 rounded-[40px] shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-white/5 bg-black/20">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="flex items-center gap-3 text-lg font-black italic"><LayoutDashboard className="w-5 h-5 text-primary" /> Management Hub</h3>
                        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live DB Sync</div>
                     </div>

                     {/* Stats Counter */}
                     <div className="flex items-center gap-3 mb-5">
                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black text-zinc-300"><Users className="w-3 h-3 inline mr-1.5 -mt-0.5" />{stats.total} totali</span>
                        <span className="bg-amber-500/5 border border-amber-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black text-amber-500"><Zap className="w-3 h-3 inline mr-1.5 -mt-0.5" />{stats.agents} agenti</span>
                        <span className="bg-blue-500/5 border border-blue-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black text-blue-400"><Store className="w-3 h-3 inline mr-1.5 -mt-0.5" />{stats.restaurants} ristoratori</span>
                        <span className="bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-lg text-[10px] font-black text-primary"><ShieldCheck className="w-3 h-3 inline mr-1.5 -mt-0.5" />{stats.admins} admin</span>
                     </div>

                     {/* Search + Filters */}
                     <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                           <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Cerca per email, nome o locale..."
                              className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs focus:border-primary outline-none transition-all text-white placeholder-zinc-600"
                           />
                           {searchQuery && (
                              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors">
                                 <X className="w-3 h-3 text-zinc-500" />
                              </button>
                           )}
                        </div>
                        <div className="flex gap-1.5">
                           <button onClick={() => setRoleFilter('all')} className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${roleFilter === 'all' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/40 border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10'}`}>Tutti</button>
                           <button onClick={() => setRoleFilter('agent')} className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${roleFilter === 'agent' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-black/40 border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10'}`}>Agenti</button>
                           <button onClick={() => setRoleFilter('restaurant')} className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${roleFilter === 'restaurant' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-black/40 border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10'}`}>Ristoratori</button>
                           <button onClick={() => setRoleFilter('admin')} className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${roleFilter === 'admin' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-black/40 border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10'}`}>Admin</button>
                        </div>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-black/40 text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">
                              <th className="px-8 py-5">Utente</th>
                              <th className="px-6 py-5">Ruolo Attivo</th>
                              <th className="px-6 py-5">Business / Locale</th>
                              <th className="px-8 py-5 text-right">Azioni</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                           {isFetchingUsers ? (
                              <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                           ) : filteredUsers.length === 0 ? (
                              <tr><td colSpan={4} className="py-16 text-center">
                                 <Search className="w-6 h-6 text-zinc-700 mx-auto mb-3" />
                                 <p className="text-xs text-zinc-600 font-bold">Nessun utente trovato{searchQuery ? ` per "${searchQuery}"` : ''}</p>
                              </td></tr>
                           ) : filteredUsers.map((u) => (
                              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'bg-primary/20 text-primary' : u.is_agent ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                          {ADMIN_EMAILS.includes(u.email.toLowerCase()) ? <ShieldCheck className="w-4 h-4" /> : u.is_agent ? <Zap className="w-4 h-4 fill-current" /> : <User className="w-4 h-4" />}
                                       </div>
                                       <div>
                                          <p className="font-bold text-zinc-100">{u.email}</p>
                                          <p className="text-[9px] text-zinc-500 uppercase opacity-60 tracking-wider">{u.full_name || 'No Name'}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-5">
                                    <div className="flex gap-2">
                                       <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border ${ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'border-primary/30 text-primary bg-primary/5' : u.is_agent ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 'border-zinc-700 text-zinc-500'}`}>
                                          {ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'SUPER-ADMIN' : u.is_agent ? 'AGENT' : (u.role || 'RISTORATORE')}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-5">
                                    {u.restaurant_name ? (
                                       <div className="flex items-center gap-2 font-bold text-blue-400">
                                          <Store className="w-3.5 h-3.5" /> {u.restaurant_name}
                                       </div>
                                    ) : (
                                       <span className="text-zinc-600 italic">Unassigned</span>
                                    )}
                                 </td>
                                 <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleViewUser(u)} className="p-2 hover:bg-blue-500/10 text-blue-400/60 hover:text-blue-400 rounded-lg transition-all" title="Visualizza Dettagli"><Eye className="w-3.5 h-3.5" /></button>
                                       {currentUser?.email !== u.email && (
                                          <>
                                             <button onClick={() => setShowRoleSelector({ email: u.email, role: u.role })} className="p-2 hover:bg-primary hover:text-black rounded-lg transition-all" title="Switch Account"><Zap className="w-3.5 h-3.5" /></button>
                                             <button onClick={() => handleSetPassword(u.email)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all" title="Reset PW"><Key className="w-3.5 h-3.5" /></button>
                                             <button onClick={() => handleDeleteUser(u.id, u.email)} className="p-2 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 rounded-lg transition-all" title="Elimina"><Trash2 className="w-3.5 h-3.5" /></button>
                                          </>
                                       )}
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
         {/* User Detail Modal */}
         {viewingUser && (
           <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative shadow-2xl">
                 <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-md px-8 py-6 border-b border-white/5 flex justify-between items-center rounded-t-[32px]">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${viewingUser.is_agent ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'}`}>
                          {viewingUser.is_agent ? <Zap className="w-5 h-5 fill-current" /> : <User className="w-5 h-5" />}
                       </div>
                       <div>
                          <h3 className="font-black text-lg">{viewingUser.email}</h3>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{viewingUser.is_agent ? 'AGENTE' : 'RISTORATORE'} • ID: {viewingUser.id?.substring(0, 8)}...</p>
                       </div>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-zinc-400" /></button>
                 </div>

                 {viewingUser._loading ? (
                    <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /><p className="text-xs text-zinc-500 mt-4">Caricamento dati...</p></div>
                 ) : (
                    <div className="p-8 space-y-6">
                       {/* Profile Section */}
                       <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2"><User className="w-3.5 h-3.5 text-primary" /> Profilo</h4>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                             <div><span className="text-zinc-500 block mb-1">Nome</span><span className="text-white font-bold">{viewingUser.profile?.full_name || viewingUser.full_name || '—'}</span></div>
                             <div><span className="text-zinc-500 block mb-1">Username</span><span className="text-white font-bold">{viewingUser.profile?.username || '—'}</span></div>
                             <div><span className="text-zinc-500 block mb-1">Ruolo Profilo</span><span className="text-white font-bold">{viewingUser.profile?.role || '—'}</span></div>
                             <div><span className="text-zinc-500 block mb-1">Is Agent</span><span className={`font-black ${viewingUser.profile?.is_agent ? 'text-amber-500' : 'text-zinc-600'}`}>{viewingUser.profile?.is_agent ? 'SÌ ✓' : 'NO'}</span></div>
                             <div><span className="text-zinc-500 block mb-1">Ruolo Users Table</span><span className="text-white font-bold">{viewingUser.role || '—'}</span></div>
                             <div><span className="text-zinc-500 block mb-1">Is Agent (Users)</span><span className={`font-black ${viewingUser.is_agent ? 'text-amber-500' : 'text-zinc-600'}`}>{viewingUser.is_agent ? 'SÌ ✓' : 'NO'}</span></div>
                          </div>
                       </div>

                       {/* Restaurant Section */}
                       {viewingUser.restaurant ? (
                          <div className="bg-black/40 border border-blue-500/10 rounded-2xl p-6">
                             <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Store className="w-3.5 h-3.5" /> Ristorante</h4>
                             <div className="grid grid-cols-2 gap-4 text-xs">
                                <div><span className="text-zinc-500 block mb-1">Nome</span><span className="text-white font-bold">{viewingUser.restaurant.name || '—'}</span></div>
                                <div><span className="text-zinc-500 block mb-1">Slug</span><span className="text-blue-400 font-bold">{viewingUser.restaurant.slug || '—'}</span></div>
                                <div className="col-span-2"><span className="text-zinc-500 block mb-1">Indirizzo</span><span className="text-white font-bold">{viewingUser.restaurant.location || '—'}</span></div>
                                <div><span className="text-zinc-500 block mb-1">Colore</span><span className="text-white font-bold flex items-center gap-2"><span className="w-4 h-4 rounded" style={{backgroundColor: viewingUser.restaurant.primary_color || '#ccc'}} /> {viewingUser.restaurant.primary_color || '—'}</span></div>
                                <div><span className="text-zinc-500 block mb-1">Menu AI</span><span className={`font-black ${viewingUser.restaurant.menu_json ? 'text-emerald-500' : 'text-zinc-600'}`}>{viewingUser.restaurant.menu_json ? 'Configurato ✓' : 'Non presente'}</span></div>
                                {viewingUser.restaurant.google_review_link && (
                                   <div className="col-span-2"><span className="text-zinc-500 block mb-1">Link Recensioni</span><a href={viewingUser.restaurant.google_review_link} target="_blank" className="text-primary hover:underline font-bold flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Apri</a></div>
                                )}
                                {viewingUser.restaurant.slug && (
                                   <div className="col-span-2"><span className="text-zinc-500 block mb-1">Chat Pubblica</span><a href={`/chat/${viewingUser.restaurant.slug}`} target="_blank" className="text-primary hover:underline font-bold flex items-center gap-1"><LinkIcon className="w-3 h-3" /> /chat/{viewingUser.restaurant.slug}</a></div>
                                )}
                             </div>
                          </div>
                       ) : (
                          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center">
                             <Store className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Nessun ristorante associato</p>
                          </div>
                       )}

                       {/* Agent Section */}
                       {viewingUser.is_agent && viewingUser.referralStats && (
                          <div className="bg-black/40 border border-amber-500/10 rounded-2xl p-6">
                             <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Dati Agente</h4>
                             <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                   <span className="text-zinc-500 block mb-1">Codice Referral</span>
                                   <span className="text-amber-400 font-black text-sm">{viewingUser.referralStats.referralCode}</span>
                                </div>
                                <div>
                                   <span className="text-zinc-500 block mb-1">Link Affiliazione</span>
                                   <span className="text-primary font-bold text-[10px] break-all">nickgastroguide.it/signup?ref={viewingUser.referralStats.referralCode}</span>
                                </div>
                                <div><span className="text-zinc-500 block mb-1">Referral Totali</span><span className="text-white font-black text-lg">{viewingUser.referralStats.total}</span></div>
                                <div><span className="text-zinc-500 block mb-1">Referral Attivi</span><span className="text-emerald-500 font-black text-lg">{viewingUser.referralStats.active}</span></div>
                             </div>
                          </div>
                       )}

                       {viewingUser.is_agent && !viewingUser.referralStats && (
                          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center">
                             <Zap className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Agente senza codice referral configurato</p>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
         )}

      </main>

      {/* Switch Overlay */}
      {showRoleSelector && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-6">
           <div className="bg-zinc-900 border border-white/5 p-10 rounded-[50px] shadow-2xl max-w-sm w-full text-center">
              <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-xl font-black mb-10 tracking-tight">Cambia Prospettiva</h2>
              <div className="grid gap-3">
                 <button onClick={() => handleSwitchAccount(showRoleSelector.email, 'ristoratore')} className="w-full py-4 bg-zinc-800 rounded-2xl hover:bg-primary hover:text-black font-black uppercase text-[10px] tracking-widest flex justify-between px-8 items-center transition-all">Accedi come Ristoratore <ArrowRight className="w-4 h-4" /></button>
                 <button onClick={() => handleSwitchAccount(showRoleSelector.email, 'agent')} className="w-full py-4 bg-zinc-800 rounded-2xl hover:bg-amber-500 hover:text-black font-black uppercase text-[10px] tracking-widest flex justify-between px-8 items-center transition-all">Accedi come Agente <ArrowRight className="w-4 h-4" /></button>
                 <button onClick={() => setShowRoleSelector(null)} className="mt-6 text-[10px] font-black uppercase text-zinc-600 hover:text-white">Annulla</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
