import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Layers, Settings, Image as ImageIcon, Download, Sparkles, Key, Loader2 } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface LandingPageProps {
  onStart: (apiKey: string) => void;
  initialApiKey?: string;
  onNavigate?: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, initialApiKey = '', onNavigate }) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!apiKey) {
      setError('Veuillez entrer votre clé API Kie.ai.');
      return;
    }
    
    setIsValidating(true);
    setError('');
    
    try {
      const res = await fetch('/api/credits', {
        headers: { 'x-api-key': apiKey }
      });
      
      if (res.ok) {
        onStart(apiKey);
      } else {
        setError('Clé API invalide. Veuillez vérifier.');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden font-sans">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 5h16M4 12h16m-7 7h7"/></svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-mono uppercase">
            Comic_Enhancer
          </span>
        </div>
        <a 
          href="https://kie.ai?ref=3b936d7970ee7afd4833f087a6c6b2bb"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-bold transition-all border border-slate-700"
        >
          Créer ma clé API
        </a>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3 h-3" /> IA Générative pour BD
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                Le traitement d'images <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">par lot</span> réinventé par l'IA.
              </h1>
              <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                L'outil idéal pour tous les créateurs souhaitant améliorer, upscaler et traiter des centaines d'images automatiquement.
              </p>
              <ul className="mt-4 space-y-2 text-slate-300 text-left max-w-xl mx-auto lg:mx-0">
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-cyan-400 mt-0.5 sm:mt-1">•</span> Améliorez instantanément la lisibilité des textes sur vos planches de BD.
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-cyan-400 mt-0.5 sm:mt-1">•</span> Colorisez automatiquement des croquis ou mangas en noir et blanc.
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-cyan-400 mt-0.5 sm:mt-1">•</span> Supprimez le fond de centaines de photos de produits pour votre e-commerce.
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-cyan-400 mt-0.5 sm:mt-1">•</span> Restaurez et améliorez la qualité de vieilles photographies abîmées.
                </li>
              </ul>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col gap-4 max-w-md mx-auto lg:mx-0">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" /> Connectez-vous avec votre clé API Kie.ai
                </h3>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Saisissez votre clé API Kie.ai..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-3"
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
                {error && <p className="text-red-400 text-xs mb-3 font-bold">{error}</p>}
                
                <button 
                  onClick={handleStart}
                  disabled={isValidating}
                  className="w-full flex justify-center items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all disabled:opacity-50 group"
                >
                  {isValidating ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      Lancer l'App
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <div className="mt-4 text-center">
                   <a href="https://kie.ai?ref=3b936d7970ee7afd4833f087a6c6b2bb" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-cyan-400 underline transition-colors">
                     Je n'ai pas de clé API Kie.ai
                   </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 w-full max-w-2xl"
          >
            <div className="rounded-2xl border border-slate-700 p-2 bg-slate-900/50 shadow-2xl relative overflow-hidden hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-2xl pointer-events-none"></div>
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/contentgenai-2b3d1.firebasestorage.app/o/img%20hp%2Fhomeup.png?alt=media&token=e81c9191-33a3-4107-8f8f-e719c0e7b1fb" 
                alt="App Preview" 
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Traitement par lot puissant et flexible</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
                Une interface conçue pour la productivité avec un contrôle total sur vos traitements.
              </p>
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/contentgenai-2b3d1.firebasestorage.app/o/img%20hp%2Fdemo.png?alt=media&token=49030bb9-c165-4fc8-80cc-7712ef479abc" 
                alt="Workflow de productivité" 
                className="w-full max-w-5xl mx-auto rounded-xl border border-slate-700 shadow-2xl"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
              {[
                {
                  icon: Layers,
                  title: "Traitement Séquentiel par Lot",
                  desc: "Uploadez des dizaines d'images, lancez le mode auto, et laissez l'IA traiter chaque image sans intervention.",
                  color: "text-cyan-400"
                },
                {
                  icon: Settings,
                  title: "Prompt Personnalisable",
                  desc: "Ajustez le prompt envoyé à l'IA pour obtenir le résultat stylistique désiré sur l'ensemble de votre lot.",
                  color: "text-emerald-400"
                },
                {
                  icon: ImageIcon,
                  title: "Upscale 2X Haute Définition",
                  desc: "Passez vos planches à la résolution supérieure grâce au modèle neural spécialisé (Crisp Upscale ou Topaz - image-upscale).",
                  color: "text-purple-400"
                },
                {
                  icon: Download,
                  title: "Export ZIP par Lot",
                  desc: "Téléchargez toutes les images modifiées d'un coup (basse définition ou upscalées).",
                  color: "text-amber-400"
                }
              ].map((feat, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors group">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6 border border-slate-800 group-hover:scale-110 transition-transform ${feat.color}`}>
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Pricing Section */}
            <div className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">💰 SANS ABONNEMENT</h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Modèle BYOK (Bring Your Own Key). Payez uniquement à la requête. Tarif transparent à l'appel API. Aucun frais caché, aucun engagement. Vous ne payez que ce que vous consommez réellement via Kie.ai.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* GPT Image */}
                <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl relative">
                  <h3 className="text-xl font-bold text-white mb-2">🎨 Image Enhancer</h3>
                  <p className="text-slate-400 text-sm mb-6">GPT-4 Image (Image-to-Image)<br/>Amélioration de la qualité, lisibilité des textes, colorisation</p>
                  
                  <ul className="space-y-4 mb-8 text-slate-300">
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>1K résolution</span><span className="font-mono text-cyan-400">$0.03</span></li>
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>2K résolution</span><span className="font-mono text-cyan-400">$0.05</span></li>
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>4K résolution</span><span className="font-mono text-cyan-400">$0.08</span></li>
                  </ul>
                  <p className="text-xs text-amber-400">💡 -10% avec high-tier top-ups</p>
                </div>

                {/* Crisp Upscale */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 p-8 rounded-2xl relative shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAIRE</div>
                  <h3 className="text-xl font-bold text-white mb-2">🔍 Crisp Upscale</h3>
                  <p className="text-slate-400 text-sm mb-6">Recraft Crisp Upscale<br/>Upscaling neural spécialisé haute qualité</p>
                  
                  <ul className="space-y-4 mb-8 text-slate-300">
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>Par upscale</span><span className="font-mono text-purple-400">~$0.0025</span></li>
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>Avec bonus high-tier</span><span className="font-mono text-purple-400">~$0.0023</span></li>
                  </ul>
                  <p className="text-xs text-emerald-400 font-bold">✨ Meilleur rapport qualité/prix</p>
                </div>

                {/* Topaz */}
                <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl relative">
                  <h3 className="text-xl font-bold text-white mb-2">📐 Topaz Upscale</h3>
                  <p className="text-slate-400 text-sm mb-6">Image Upscale Pro<br/>Upscaling professionnel grandes résolutions</p>
                  
                  <ul className="space-y-4 mb-8 text-slate-300">
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>≤2K</span><span className="font-mono text-cyan-400">$0.05</span></li>
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>4K</span><span className="font-mono text-cyan-400">$0.10</span></li>
                    <li className="flex justify-between border-b border-slate-800 pb-2"><span>8K</span><span className="font-mono text-cyan-400">$0.20</span></li>
                  </ul>
                  <p className="text-xs text-amber-400">💡 -10% avec high-tier top-ups</p>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <a href="https://kie.ai?ref=3b936d7970ee7afd4833f087a6c6b2bb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors">
                  Créer mon compte Kie.ai gratuit
                </a>
                <p className="text-slate-400 mt-4 text-sm">💡 Premier crédit offert à l'inscription</p>
              </div>
            </div>

            {/* Guide Rapide */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Guide Rapide</h2>
                <p className="text-lg text-slate-400">Accédez à l'application en 3 étapes</p>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-cyan-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    1
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                    <h3 className="font-bold text-white text-lg mb-2 flex items-center gap-2">📝 Créez votre compte Kie.ai</h3>
                    <p className="text-slate-400 mb-4">Inscription gratuite en moins de 2 minutes. Aucune carte bancaire requise.</p>
                    <a href="https://kie.ai?ref=3b936d7970ee7afd4833f087a6c6b2bb" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 transition-colors">S'inscrire sur Kie.ai →</a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-cyan-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    2
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                    <h3 className="font-bold text-white text-lg mb-2 flex items-center gap-2">🔑 Générez votre clé API</h3>
                    <p className="text-slate-400">Dans votre tableau de bord, accédez à la section API et générez votre clé sécurisée.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-emerald-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    3
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-950 border border-emerald-900/30 rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                    <h3 className="font-bold text-white text-lg mb-2 flex items-center gap-2 relative z-10">🚀 Collez et commencez</h3>
                    <p className="text-slate-400 relative z-10">Collez votre clé dans Comic Enhancer et lancez votre premier traitement par lot.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950 text-center">
        <p className="text-slate-500 text-sm mb-4">
          Cette application vous est offerte avec ❤️ par <a href="https://www.acadee.fr" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">ACADEE</a>
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <button 
            onClick={() => onNavigate?.('mentions')}
            className="text-slate-600 hover:text-cyan-500 transition-colors"
          >
            Mentions légales
          </button>
          <button 
            onClick={() => onNavigate?.('privacy')}
            className="text-slate-600 hover:text-cyan-500 transition-colors"
          >
            Politique de confidentialité
          </button>
        </div>
      </footer>
    </div>
  );
};

