import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  disabled?: boolean;
}

export function Dropzone({ onFilesDrop, disabled = false }: DropzoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files) as File[];
      const validFiles = filesArray.filter((f) => f.type.startsWith('image/'));
      onFilesDrop(validFiles);
    }
  }, [onFilesDrop, disabled]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files) as File[];
      const validFiles = filesArray.filter((f) => f.type.startsWith('image/'));
      onFilesDrop(validFiles);
    }
  }, [onFilesDrop, disabled]);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center transition-all duration-300 ${
        disabled 
          ? 'border-slate-800 bg-slate-900/30 opacity-60 cursor-not-allowed' 
          : 'border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)] cursor-pointer'
      }`}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />
      <label htmlFor="file-upload" className={`flex flex-col items-center text-center px-4 ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}>
        <UploadCloud className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 transition-colors duration-300 ${disabled ? 'text-slate-600' : 'text-cyan-500'}`} />
        <p className="text-base sm:text-lg font-medium text-slate-300">Glissez-déposez vos planches ici</p>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2 font-mono">ou cliquez pour sélectionner (max 50)</p>
      </label>
    </div>
  );
}
