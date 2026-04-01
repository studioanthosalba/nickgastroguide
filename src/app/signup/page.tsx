'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Store, ArrowRight, ArrowLeft,
  Loader2, Mail, Lock, User, ChefHat, CheckCircle2, AlertCircle, ShoppingCart
} from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PAYPAL_PLAN_ID = "P-8K489760U6054462ANGJYJNQ";

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const referralCode = searchParams.get('ref');
  
  const [step, setStep] = useState(1); // 1: Acc datti, 2: Pagamento
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // PayPal options
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AUzlYj02mJRUJTiocag5eAFF27rfdL1XipeVQRHnXLRltaY7Wpi2T4B0MGFJfAwTzbPVDbDjAeSCCkll",
    intent: "subscription",
    vault: true,
    currency: "EUR"
  };

  const validateForm = () => {
    if (!email || !password || !fullName || !restaurantName) {
      setError("Per favore, compila tutti i campi.");
      return false;
    }
    if (password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri.");
      return false;
    }
    return true;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleSubscriptionSuccess = async (data: any) => {
    setIsLoading(true);
    setError(null);
    const subscriptionId = data.subscriptionID;

    try {
      // 1. Signup the user
      const { data: authData, error: authErr } = await insforge.auth.signUp({
        email,
        password,
        name: fullName
      });

      if (authErr) throw authErr;
      const user = authData?.user;

      if (!user) throw new Error("Errore durante la creazione dell'utente");

      // 2. Update Profile & Create Restaurant
      // Using a batch/concurrent update via DB calls
      
      // Update profile role to 'ristoratore'
      const { error: profileErr } = await insforge.database
        .from('profiles')
        .update({ 
          role: 'ristoratore', 
          full_name: fullName,
          username: email.split('@')[0] + Math.floor(Math.random() * 1000)
        })
        .eq('id', user.id);

      if (profileErr) throw profileErr;

      // Create Restaurant record
      const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
      const { data: restaurant, error: restErr } = await insforge.database
        .from('restaurants')
        .insert({
          owner_id: user.id,
          name: restaurantName,
          slug: slug,
          paypal_subscription_id: subscriptionId, // Changed from subscription_id
          subscription_status: 'active'
        })
        .select()
        .single();

      if (restErr) throw restErr;

      // 3. Track Referral if present
      if (referralCode) {
        try {
          await fetch('/api/track-referral', {
            method: 'POST',
            body: JSON.stringify({
              referral_code: referralCode,
              new_user_id: user.id
            })
          });
        } catch (refErr) {
          console.error("Referral tracking failed (non-critical):", refErr);
        }
      }

      setSuccess(true);
      // Auto login or redirect to login with info
      setTimeout(() => {
        router.push('/login?as=ristoratore&email=' + encodeURIComponent(email));
      }, 3000);

    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Si è verificato un errore durante la registrazione.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-emerald-500/30 p-12 rounded-[40px] text-center max-w-lg shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-black mb-4 italic tracking-tighter">Benvenuto in GastroGuide!</h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Abbonamento attivato con successo. Il tuo ristorante <strong>{restaurantName}</strong> è pronto!<br/><br/>
            Ti stiamo reindirizzando al login...
          </p>
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: "100%" }} 
              transition={{ duration: 3 }}
              className="h-full bg-emerald-500" 
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* Left Side: Premium Aesthetic & Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] relative flex-col justify-between p-20 border-r border-white/5">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full -ml-32 -mb-32" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
              <ChefHat className="w-7 h-7 text-black fill-current" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter">Nick GastroGuide</span>
          </div>

          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl font-black leading-[0.9] tracking-tighter italic mb-8"
            >
              PORTA IL TUO <br/> RISTORANTE <br/> <span className="text-primary">NEL FUTURO</span>
            </motion.h2>
            <div className="space-y-6">
              {[
                { icon: <Sparkles className="w-5 h-5" />, t: "Concierge AI 24/7", d: "Sostituisci il vecchio menu con un assistente intelligente." },
                { icon: <Store className="w-5 h-5" />, t: "Gestione Premium", d: "Personalizza brand, colori e persuasione attiva." },
                { icon: <CheckCircle2 className="w-5 h-5" />, t: "Checkout Sicuro", d: "Paga comodamente con PayPal Subscription." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i*0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 shrink-0 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.t}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <span>© 2026 GastroGuide Elite</span>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <span>Supporto prioritario 24h</span>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-20 overflow-y-auto custom-scrollbar">
          <div className="max-w-md mx-auto w-full py-12">
            
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-zinc-800'}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-zinc-800'}`} />
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter mb-2">Piattaforma Ristoratori</h1>
              <p className="text-zinc-500 text-sm">
                {step === 1 ? 'Crea il tuo account e configura il ristorante.' : 'Finalizza l\'abbonamento per attivare l\'AI.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleNextStep}
                  className="space-y-6"
                >
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome Titolare</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm focus:border-primary transition-colors outline-none" 
                        placeholder="Nome e Cognome..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome del Ristorante</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        required
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm focus:border-primary transition-colors outline-none" 
                        placeholder="Il Nome del tuo Locale..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Business</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm focus:border-primary transition-colors outline-none" 
                        placeholder="email@azienda.it"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm focus:border-primary transition-colors outline-none" 
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-[20px] hover:bg-white transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    Procedi al checkout <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-zinc-600 text-xs mt-6">
                    Hai già un account? <button onClick={() => router.push('/login?as=ristoratore')} className="text-white font-bold hover:text-primary transition-colors">Accedi qui</button>
                  </p>
                </motion.form>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Modifica Dati
                  </button>

                  <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">Total GastroGuide Elite</h4>
                          <p className="text-[10px] text-zinc-500 uppercase font-black">Abbonamento Mensile</p>
                        </div>
                      </div>
                      <span className="text-xl font-black">€49,90<span className="text-[10px] text-zinc-500">/mese</span></span>
                    </div>
                    <ul className="space-y-2">
                       <li className="text-xs text-zinc-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Concierge AI Illimitato</li>
                       <li className="text-xs text-zinc-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Branding Personalizzato</li>
                       <li className="text-xs text-zinc-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Analisi Chat & Persuasione</li>
                    </ul>
                  </div>

                  {isLoading ? (
                    <div className="py-20 text-center">
                       <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                       <p className="font-bold text-primary animate-pulse">Configurazione Ristorante in corso...</p>
                    </div>
                  ) : (
                    <div className="relative z-0">
                      <PayPalScriptProvider options={initialOptions}>
                        <PayPalButtons 
                          style={{ 
                            layout: 'vertical',
                            color: 'black',
                            shape: 'pill',
                            label: 'subscribe'
                          }}
                          createSubscription={(data, actions) => {
                            return actions.subscription.create({
                              'plan_id': PAYPAL_PLAN_ID
                            });
                          }}
                          onApprove={handleSubscriptionSuccess}
                          onError={(err) => {
                            console.error("PayPal Error:", err);
                            setError("Errore nel processo di pagamento PayPal. Riprova.");
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </div>
                  )}
                  
                  <p className="text-[10px] text-zinc-600 text-center leading-relaxed italic">
                    Scaricando o utilizzando GastroGuide, accetti i nostri Termini di Servizio. <br/>
                    Puoi annullare l'abbonamento in qualsiasi momento dal tuo pannello PayPal.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
