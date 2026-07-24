import React, { useEffect, useState } from 'react';
import { Dropzone } from './components/Dropzone';
import { ImageCard } from './components/ImageCard';
import { useImageProcessor } from './hooks/useImageProcessor';
import { Layers, Download, Loader2, X, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UploadedFile } from './types';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { LandingPage } from './LandingPage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const { 
    files, 
    addFiles, 
    removeFile,
    clearFiles,
    retryFile,
    startProcessing,
    startUpscale,
    apiMessage, 
    promptText, 
    setPromptText,
    processingMode,
    setProcessingMode,
    upscaleMode,
    setUpscaleMode,
    showApiKeyModal,
    setShowApiKeyModal,
    customApiKey,
    setCustomApiKey,
    retryUpscale
  } = useImageProcessor();

  const [isZippingBase, setIsZippingBase] = useState(false);
  const [isZippingUpscale, setIsZippingUpscale] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UploadedFile | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [credits, setCredits] = useState<number | null>(null);
  
  const [emailData, setEmailData] = useState<{ email: string, marketingConsent: boolean, marketingConsentAt: string | null } | null>(null);
  const [pendingAction, setPendingAction] = useState<'processing' | 'upscaling' | null>(null);
  const [batchInfo, setBatchInfo] = useState<any>(null);
  const [tempEmail, setTempEmail] = useState("");
  const [tempConsent, setTempConsent] = useState(false);

  useEffect(() => {
    // Fetch credits
    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/credits', {
          headers: { 'x-api-key': customApiKey }
        });
        if (res.ok) {
           const data = await res.json();
           if (data && data.data !== undefined) {
             setCredits(data.data);
           }
        }
      } catch (err) {
        console.error("Failed to fetch credits", err);
      }
    };
    fetchCredits();
  }, [customApiKey]);

  const hasFiles = files.length > 0;
  
  const isUpscalingPhase = files.some(f => f.status === 'upscaling' || f.status === 'upscaled' || f.status === 'upscale_error');
  let activeCompleted = 0;
  const activeTotal = files.length;
  
  if (isUpscalingPhase) {
     activeCompleted = files.filter(f => ['upscaled', 'upscale_error'].includes(f.status)).length;
  } else {
     activeCompleted = files.filter(f => ['completed', 'error', 'upscaling', 'upscaled', 'upscale_error'].includes(f.status)).length;
  }
  
  const progressPercent = activeTotal > 0 ? Math.round((activeCompleted / activeTotal) * 100) : 0;
  const allFinished = files.length > 0 && files.every(f => ['completed', 'error', 'upscaled', 'upscale_error'].includes(f.status));
  const someCompleted = files.some(f => ['completed', 'upscaled', 'upscale_error'].includes(f.status));
  const someUpscaled = files.some(f => f.status === 'upscaled' && f.upscaledUrl);
  const isProcessing = files.some(f => f.status === 'processing' || f.status === 'upscaling');

  let estimatedCredits = 0;
  let actualCredits = 0;

  files.forEach(f => {
    estimatedCredits += 10; // Gen (10)
    if (upscaleMode === 'auto') estimatedCredits += 0.5; // Upscale (0.5 minimum)
    
    if (f.resultUrl) actualCredits += 10;
    if (f.upscaledUrl) {
       if (f.upscaleModel === 'topaz/image-upscale') actualCredits += 10;
       else actualCredits += 0.5;
    }
  });

  const prevAllFinished = React.useRef(allFinished);
  useEffect(() => {
    if (allFinished && !prevAllFinished.current && batchInfo) {
      // Send webhook
      const successfulImages = files.filter(f => batchInfo.processingType === 'upscale' ? f.status === 'upscaled' : (f.status === 'completed' || f.status === 'upscaled')).length;
      const failedImages = files.filter(f => batchInfo.processingType === 'upscale' ? f.status === 'upscale_error' : f.status === 'error').length;
      const status = failedImages === 0 ? 'completed' : (successfulImages === 0 ? 'failed' : 'completed_with_errors');
      const completedAt = new Date();
      const startedAtDate = new Date(batchInfo.startedAt);
      const durationSeconds = Math.round((completedAt.getTime() - startedAtDate.getTime()) / 1000);
      
      const payload = {
        event: "comic_enhancer.batch.completed",
        batchId: batchInfo.batchId,
        email: emailData?.email,
        processingType: batchInfo.processingType,
        status,
        totalImages: files.length,
        successfulImages,
        failedImages,
        kieCreditsUsed: actualCredits,
        currency: "USD",
        totalCost: actualCredits * 0.005,
        startedAt: batchInfo.startedAt,
        completedAt: completedAt.toISOString(),
        durationSeconds,
        marketingConsent: emailData?.marketingConsent,
        marketingConsentAt: emailData?.marketingConsentAt,
        marketingConsentTextVersion: "acadee-marketing-v1",
        source: "comic-enhancer-v2"
      };

      fetch('https://hook.eu1.make.com/d8byfif5nhr6doa4mdyl9kqn9n9fy9mn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Webhook error:", err));
      
      setBatchInfo(null); // Prevent re-triggering for the same batch
    }
    prevAllFinished.current = allFinished;
  }, [allFinished, batchInfo, emailData, files, actualCredits]);

  const handleStartProcessing = () => {
    if (!emailData) {
      setPendingAction('processing');
    } else {
      setBatchInfo({
        batchId: `batch_${Date.now()}`,
        startedAt: new Date().toISOString(),
        processingType: 'enhancement',
        totalImages: files.length
      });
      startProcessing();
    }
  };

  const handleStartUpscale = () => {
    if (!emailData) {
      setPendingAction('upscaling');
    } else {
      setBatchInfo({
        batchId: `batch_${Date.now()}`,
        startedAt: new Date().toISOString(),
        processingType: 'upscale',
        totalImages: files.length
      });
      startUpscale();
    }
  };

  const estimatedCostEur = (estimatedCredits * 0.0046).toFixed(3);
  const actualCostEur = (actualCredits * 0.0046).toFixed(3);

  const downloadAll = async (upscaled = false) => {
    const targetFiles = files.filter(f => (upscaled ? f.upscaledUrl : f.resultUrl));
    if (targetFiles.length === 0) return;
    
    if (upscaled) setIsZippingUpscale(true);
    else setIsZippingBase(true);
    
    try {
      const zip = new JSZip();
      
      for (const f of targetFiles) {
        try {
          const urlToFetch = upscaled ? f.upscaledUrl! : f.resultUrl!;
          const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(urlToFetch)}`);
          const blob = await response.blob();
          
          const originalName = f.file.name;
          const dotIndex = originalName.lastIndexOf('.');
          const suffix = upscaled ? '_upscaled' : '_enhanced';
          const newName = dotIndex !== -1 
             ? `${originalName.substring(0, dotIndex)}${suffix}${originalName.substring(dotIndex)}`
             : `${originalName}${suffix}.jpg`;

          zip.file(newName, blob);
        } catch (err) {
          console.error("Failed to fetch image for zip", f.file.name, err);
        }
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, upscaled ? 'planches_upscalees.zip' : 'planches_ameliorees.zip');
    } catch (err) {
      console.error("Failed to create zip", err);
    } finally {
      if (upscaled) setIsZippingUpscale(false);
      else setIsZippingBase(false);
    }
  };

  const handleDownloadSingle = async (file: UploadedFile, upscaled = false) => {
    const urlToFetch = upscaled ? file.upscaledUrl : file.resultUrl;
    if (!urlToFetch) return;
    try {
      const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(urlToFetch)}`);
      const blob = await response.blob();
      
      const originalName = file.file.name;
      const dotIndex = originalName.lastIndexOf('.');
      const suffix = upscaled ? '_upscaled' : '_enhanced';
      const newName = dotIndex !== -1 
         ? `${originalName.substring(0, dotIndex)}${suffix}${originalName.substring(dotIndex)}`
         : `${originalName}${suffix}.jpg`;

      saveAs(blob, newName);
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  if (!isStarted) {
    return (
      <LandingPage 
        initialApiKey={customApiKey}
        onStart={(apiKey) => {
          setCustomApiKey(apiKey);
          setIsStarted(true);
        }} 
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Top Navigation / Header */}
      <header className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0 gap-4">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 5h16M4 12h16m-7 7h7"/></svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-mono uppercase hidden sm:block">
              Comic_Enhancer_v2.0
            </h1>
            <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-mono uppercase sm:hidden">
              CE_v2.0
            </h1>
          </div>
          
          <div className="flex lg:hidden flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">API Status</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 max-w-[150px] truncate">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isProcessing ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`}></span> {apiMessage}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">API Status</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 max-w-[300px] truncate">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isProcessing ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`}></span> {apiMessage}
            </span>
          </div>
          <div className="hidden lg:block h-10 w-[1px] bg-slate-800"></div>
          {allFinished && someCompleted && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => downloadAll(false)}
                disabled={isZippingBase || isZippingUpscale}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs sm:text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
              >
                {isZippingBase ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">ZIP Basse Def</span>
                <span className="sm:hidden">ZIP (BD)</span>
              </button>
              {someUpscaled && (
                <button 
                  onClick={() => downloadAll(true)}
                  disabled={isZippingBase || isZippingUpscale}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-900/50 hover:bg-purple-800/80 text-purple-200 rounded-full text-xs sm:text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-purple-800"
                >
                  {isZippingUpscale ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span className="hidden sm:inline">ZIP Upscalé</span>
                  <span className="sm:hidden">ZIP (UP)</span>
                </button>
              )}
            </div>
          )}
          <button 
            onClick={handleStartProcessing}
            disabled={files.length === 0 || allFinished || isProcessing}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all ${
              files.length > 0 && !allFinished && !isProcessing
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
            }`}
          >
            <span className="hidden sm:inline">LANCER LE TRAITEMENT</span>
            <span className="sm:hidden">LANCER</span>
          </button>
          
          <button 
            onClick={handleStartUpscale}
            disabled={files.length === 0 || isProcessing}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all ${
              files.length > 0 && !isProcessing
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
            }`}
          >
            UPSCALER
          </button>
          
          <button 
            onClick={() => {
              setCustomApiKey('');
              setIsStarted(false);
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded-full text-xs sm:text-sm font-bold transition-all border border-slate-700 hover:border-red-800/50"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Sidebar Queue Info */}
        <aside className="w-full lg:w-72 bg-slate-900/50 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 shrink-0 lg:overflow-y-auto max-h-[40vh] lg:max-h-full overflow-y-auto">
          <details className="group" open>
            <summary className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 cursor-pointer list-none select-none">
              <Settings className="w-3 h-3"/> Paramètres du Prompt
              <span className="ml-auto transform group-open:-rotate-180 transition-transform">▼</span>
            </summary>
            <textarea
              className="w-full bg-slate-800/80 rounded-lg p-3 border border-slate-700/50 text-xs leading-relaxed text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500 mt-2"
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              disabled={isProcessing}
            />
          </details>

          <details className="group" open>
            <summary className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-t border-slate-800 pt-4 flex items-center gap-2 cursor-pointer list-none select-none">
              Mode de traitement
              <span className="ml-auto transform group-open:-rotate-180 transition-transform">▼</span>
            </summary>
            <div className="flex flex-col gap-2 mb-6 mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="processingMode" 
                  value="auto"
                  checked={processingMode === 'auto'}
                  onChange={() => setProcessingMode('auto')}
                  className="w-4 h-4 text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500"
                />
                Séquentiel automatique
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="processingMode" 
                  value="manual"
                  checked={processingMode === 'manual'}
                  onChange={() => setProcessingMode('manual')}
                  className="w-4 h-4 text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500"
                />
                Image par image
              </label>
            </div>

            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-t border-slate-800 pt-4 mt-6">Options d'Upscale</h2>
            <div className="flex flex-col gap-2 mb-2">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="upscaleMode" 
                  value="auto"
                  checked={upscaleMode === 'auto'}
                  onChange={() => setUpscaleMode('auto')}
                  className="w-4 h-4 text-purple-500 bg-slate-800 border-slate-700 focus:ring-purple-500"
                />
                Upscale auto (X2)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="upscaleMode" 
                  value="none"
                  checked={upscaleMode === 'none'}
                  onChange={() => setUpscaleMode('none')}
                  className="w-4 h-4 text-purple-500 bg-slate-800 border-slate-700 focus:ring-purple-500"
                />
                Pas d'upscale
              </label>
            </div>
          </details>

          <section className="flex-1 flex flex-col">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Progression Batch</h2>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-black text-white">{activeCompleted} <span className="text-slate-600">/ {activeTotal || 50}</span></span>
              <span className="text-xs font-bold text-cyan-400 italic">{progressPercent}% Traité</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            
            {hasFiles && (
              <ul className="space-y-3 overflow-y-auto max-h-[250px] pr-2">
                {files.map(f => (
                  <li key={f.id} className="flex items-center gap-3 text-xs font-mono truncate">
                    {(f.status === 'completed' || f.status === 'upscaled' || f.status === 'upscale_error') && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="text-slate-400 truncate">{f.file.name}</span>
                        {f.status === 'upscaled' ? (
                          <span className="text-purple-400 ml-auto shrink-0">[UP]</span>
                        ) : (
                          <span className="text-emerald-500 ml-auto shrink-0">[OK]</span>
                        )}
                      </>
                    )}
                    {f.status === 'processing' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                        <span className="text-cyan-400 font-bold truncate">{f.file.name}</span>
                        <span className="text-cyan-400 ml-auto shrink-0">[ACTIVE]</span>
                      </>
                    )}
                    {f.status === 'upscaling' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shrink-0"></span>
                        <span className="text-purple-400 font-bold truncate">{f.file.name}</span>
                        <span className="text-purple-400 ml-auto shrink-0">[UPX2]</span>
                      </>
                    )}
                    {f.status === 'idle' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0"></span>
                        <span className="text-slate-600 truncate">{f.file.name}</span>
                        <span className="text-slate-600 ml-auto shrink-0">[WAIT]</span>
                      </>
                    )}
                    {f.status === 'error' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                        <span className="text-red-400 truncate">{f.file.name}</span>
                        <span className="text-red-500 ml-auto shrink-0">[ERR]</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {hasFiles && (
            <div className="mt-4 pt-4 border-t border-slate-800 shrink-0">
              <button
                onClick={clearFiles}
                className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 text-xs font-bold rounded-xl transition-all mb-3"
              >
                <X className="w-4 h-4" />
                Effacer tout
              </button>
              
              <div className="bg-slate-900 rounded-lg p-3 text-xs space-y-2 border border-slate-800">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Prévisionnel:</span>
                  <span className="font-mono text-cyan-400">{estimatedCredits} crédits (~{estimatedCostEur}€)</span>
                </div>
                {actualCredits > 0 && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Réalisé:</span>
                    <span className="font-mono text-emerald-400">{actualCredits} crédits (~{actualCostEur}€)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl shrink-0">
              <p className="text-[10px] text-emerald-500 font-medium uppercase">Traitement en cours</p>
              <p className="text-sm font-bold text-emerald-400 mt-1">{processingMode === 'auto' ? 'Séquentiel automatique' : 'Image par image'}</p>
            </div>
          )}
        </aside>

        {/* Image Grid Gallery */}
        <div className="flex-1 p-6 bg-slate-950 overflow-y-auto relative">
          <div className="mb-8">
            <Dropzone onFilesDrop={addFiles} disabled={files.length >= 50} />
          </div>

          {hasFiles && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {files.map((file) => (
                  <ImageCard 
                    key={file.id} 
                    file={file} 
                    onClick={() => {
                      if (file.status === 'completed' || file.status === 'upscaled' || file.status === 'upscale_error') {
                        setSelectedImage(file);
                      }
                    }}
                    onRemove={() => removeFile(file.id)}
                    onRetryUpscale={retryUpscale}
                    onRetry={() => retryFile(file.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="h-8 shrink-0 bg-slate-900 border-t border-slate-800 flex items-center px-4 justify-between text-[10px] text-slate-500 font-mono uppercase tracking-tight overflow-hidden">
        <div className="flex gap-2 sm:gap-4 truncate">
          <span className="hidden sm:inline">Session ID: JOB-{Math.floor(Math.random() * 90000) + 10000}-KIE</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="truncate">Model: gpt-image-2-image-to-image</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
          {credits !== null && (
            <a href="https://kie.ai/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-500 font-bold hover:underline cursor-pointer">
              Crédits restants: {credits}
            </a>
          )}
          <span className={processingMode === 'auto' ? 'text-emerald-500' : 'text-slate-500'}>
            Auto-Sequential Processing: {processingMode === 'auto' ? 'ON' : 'OFF'}
          </span>
          <div className={`w-2 h-2 rounded-full ${processingMode === 'auto' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
        </div>
      </footer>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12 bg-slate-950/90 backdrop-blur-sm"
            onClick={() => { setSelectedImage(null); setImageZoom(1); }}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
              onClick={() => { setSelectedImage(null); setImageZoom(1); }}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="overflow-hidden rounded-lg shadow-2xl border border-slate-700 max-w-full max-h-[80vh] shrink-0 cursor-zoom-in"
                onWheel={(e) => {
                  if (e.deltaY < 0) setImageZoom(prev => Math.min(prev + 0.2, 5));
                  else setImageZoom(prev => Math.max(prev - 0.2, 1));
                }}
                style={{ height: '80vh' }}
              >
                <div style={{ transform: `scale(${imageZoom})`, transition: 'transform 0.1s ease-out', width: '100%', height: '100%', transformOrigin: 'center' }}>
                  {selectedImage.upscaledUrl ? (
                    <ReactCompareSlider
                      className="w-full h-full object-contain"
                      itemOne={<ReactCompareSliderImage src={selectedImage.resultUrl || selectedImage.previewUrl} alt="Version 2K" style={{ objectFit: 'contain' }} />}
                      itemTwo={<ReactCompareSliderImage src={selectedImage.upscaledUrl} alt="Upscalé" style={{ objectFit: 'contain' }} />}
                    />
                  ) : (
                    <img 
                      src={selectedImage.resultUrl || selectedImage.previewUrl} 
                      alt={selectedImage.file.name} 
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleDownloadSingle(selectedImage, false)}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  Version 2K
                </button>
                {selectedImage.upscaledUrl && (
                  <button 
                    onClick={() => handleDownloadSingle(selectedImage, true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold shadow-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Upscalé
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-6"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Clé API requise</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Vous devez configurer une clé API Kie.ai valide pour lancer le traitement des images.
                </p>
              </div>
              <a 
                href="https://kie.ai/user/affiliate"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg transition-all"
              >
                Créer ma clé API sur Kie.ai
              </a>
              <div className="w-full">
                <input 
                  type="password" 
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Saisissez votre clé API ici..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
                onClick={() => setPendingAction(null)}
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-2">Votre traitement est en cours</h2>
              <p className="text-sm text-slate-400 mb-4">
                Saisissez votre adresse e-mail pour recevoir un récapitulatif dès que toutes vos images auront été traitées.
              </p>
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-3 mb-6">
                <p className="text-xs text-amber-500 font-medium">
                  Attention : ne fermez pas cette page et ne quittez pas le site pendant le traitement.
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                setEmailData({
                  email: tempEmail,
                  marketingConsent: tempConsent,
                  marketingConsentAt: tempConsent ? new Date().toISOString() : null
                });
                setBatchInfo({
                  batchId: `batch_${Date.now()}`,
                  startedAt: new Date().toISOString(),
                  processingType: pendingAction === 'processing' ? 'enhancement' : 'upscale',
                  totalImages: files.length
                });
                if (pendingAction === 'processing') startProcessing();
                else startUpscale();
                setPendingAction(null);
              }}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Adresse e-mail</label>
                  <input
                    id="email"
                    type="email"
                    required
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    title="Veuillez saisir une adresse e-mail valide."
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="vous@exemple.com"
                  />
                </div>
                
                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input 
                        type="checkbox" 
                        checked={tempConsent}
                        onChange={(e) => setTempConsent(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 border-2 border-slate-600 rounded peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-colors"></div>
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors block mb-1">
                        Je souhaite recevoir par e-mail les actualités, conseils et offres d'ACADEE.
                      </span>
                      <span className="text-xs text-slate-500">
                        Facultatif. Vous pourrez vous désinscrire à tout moment.
                      </span>
                    </div>
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2"
                >
                  Continuer
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
