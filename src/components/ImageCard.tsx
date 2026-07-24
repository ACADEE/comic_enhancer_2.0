import React from 'react';
import { UploadedFile } from '../types';
import { Loader2, CheckCircle2, AlertCircle, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveAs } from 'file-saver';

interface ImageCardProps {
  key?: React.Key;
  file: UploadedFile;
  onClick?: () => void;
  onRemove?: () => void;
  onRetryUpscale?: (file: UploadedFile) => void;
  onRetry?: () => void;
}

export function ImageCard({ file, onClick, onRemove, onRetryUpscale, onRetry }: ImageCardProps) {
  // Compute classes based on status
  const baseCardClass = "relative group aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden shadow-xl border-2 transition-all duration-300 cursor-pointer";

  
  let statusClasses = "";
  if (file.status === 'completed') {
    statusClasses = "border-emerald-500/50";
  } else if (file.status === 'upscaled') {
    statusClasses = "border-purple-500/80 ring-2 ring-purple-500/30";
  } else if (file.status === 'processing') {
    statusClasses = "border-cyan-400 ring-4 ring-cyan-400/10";
  } else if (file.status === 'upscaling') {
    statusClasses = "border-purple-400 ring-4 ring-purple-400/10";
  } else if (file.status === 'idle') {
    statusClasses = "border-slate-800 opacity-60 hover:opacity-100";
  } else if (file.status === 'error' || file.status === 'upscale_error') {
    statusClasses = "border-red-500/50";
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!file.resultUrl) return;
    try {
      const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(file.resultUrl)}`);
      const blob = await response.blob();
      
      const originalName = file.file.name;
      const dotIndex = originalName.lastIndexOf('.');
      const newName = dotIndex !== -1 
         ? `${originalName.substring(0, dotIndex)}_enhanced${originalName.substring(dotIndex)}`
         : `${originalName}_enhanced.jpg`;
         
      saveAs(blob, newName);
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${baseCardClass} ${statusClasses}`}
      onClick={() => onClick && onClick()}
    >
      <img
        src={file.upscaledUrl || file.resultUrl || file.previewUrl}
        alt={file.file.name}
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${file.status === 'idle' ? 'grayscale opacity-50 group-hover:grayscale-0' : ''}`}
      />
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

      {/* Status Indicators */}
      <AnimatePresence>
        {(file.status === 'processing' || file.status === 'upscaling') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center backdrop-blur-sm gap-3"
          >
            <div className="w-[80%] h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${file.status === 'upscaling' ? 'bg-purple-400' : 'bg-cyan-400'}`}
                style={{ width: `${Math.min(100, ((file.progress || 0) / 300) * 100)}%` }}
              ></div>
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-tighter ${file.status === 'upscaling' ? 'text-purple-400' : 'text-cyan-400'}`}>
               {file.status === 'upscaling' ? 'Upscale en cours...' : 'Traitement API...'}
            </p>
            {typeof file.progress === 'number' && (
              <p className={`text-[10px] font-bold uppercase tracking-tighter ${file.status === 'upscaling' ? 'text-purple-400' : 'text-cyan-400'}`}>{Math.max(0, 300 - file.progress)}s</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {(file.status === 'completed' || file.status === 'upscaled') && (
        <>
          <div className={`absolute top-2 right-2 ${file.status === 'upscaled' ? 'bg-purple-500' : 'bg-emerald-500'} text-slate-950 rounded-full p-1 shadow-lg`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          </div>
        </>
      )}

      {file.status === 'idle' && (
         <>
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
           </div>
           <button 
             onClick={handleRemove}
             className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
             title="Retirer l'image"
           >
             <X className="w-4 h-4" />
           </button>
         </>
      )}

      {(file.status === 'error' || file.status === 'upscale_error') && (
        <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm z-10">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <span className="text-white font-medium text-sm">Erreur {file.status === 'upscale_error' ? "d'upscale" : ""}</span>
          <span className="text-slate-400 text-[10px] mt-1 leading-tight line-clamp-3">{file.error}</span>
          {onRetry && (
             <button 
                onClick={(e) => { e.stopPropagation(); onRetry(); }}
                className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-full transition-colors"
             >
                Réessayer
             </button>
          )}
          {file.status === 'upscale_error' && onRetryUpscale && !onRetry && (
             <button 
                onClick={(e) => { e.stopPropagation(); onRetryUpscale(file); }}
                className="mt-3 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-full transition-colors"
             >
                Relancer Upscale
             </button>
          )}
        </div>
      )}

      {/* File Name & Task Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent">
        <p className="text-white font-mono font-bold text-[10px] truncate">
          {file.file.name}
        </p>
        {file.taskId && (
          <div className="mt-1 flex flex-col gap-0.5">
             <p className="text-cyan-400 font-mono text-[9px] truncate">ID: {file.taskId}</p>
             <p className="text-slate-400 font-mono text-[9px]">
               Statut: <span className={file.status === 'completed' ? 'text-emerald-400' : file.status === 'error' ? 'text-red-400' : 'text-cyan-300 animate-pulse'}>{file.status}</span>
             </p>
          </div>
        )}
        {file.upscaleModel && (
          <div className="mt-0.5">
             <p className="text-purple-400 font-mono text-[9px]">
               Modèle IA: {file.upscaleModel === 'topaz/image-upscale' ? 'Topaz' : 'Recraft'}
             </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
