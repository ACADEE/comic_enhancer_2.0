import { useState, useRef, useCallback, useEffect } from 'react';
import { UploadedFile } from '../types';

export function useImageProcessor() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const filesRef = useRef<UploadedFile[]>([]);
  const [apiMessage, setApiMessage] = useState<string>('En attente de fichiers...');
  const [promptText, setPromptText] = useState("Agis comme le maître mondial des bandes dessinées. Améliore la lisibilité des textes.");
  const [processingMode, setProcessingMode] = useState<'auto' | 'manual'>('auto');
  const [upscaleMode, setUpscaleMode] = useState<'auto' | 'none'>('none');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('kie_api_key') || '');
  const processingRef = useRef(false);
  const upscalingRef = useRef(false);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    localStorage.setItem('kie_api_key', customApiKey);
  }, [customApiKey]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const allowedCount = Math.max(0, 50 - prev.length);
      const filesToAdd = newFiles.slice(0, allowedCount);
      
      const newUploads: UploadedFile[] = filesToAdd.map((file) => ({
        id: Math.random().toString(36).substring(7) + Date.now(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'idle',
      }));
      return [...prev, ...newUploads];
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file && file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const updateFileStatus = useCallback((id: string, updates: Partial<UploadedFile>) => {
    setFiles((prev) => 
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const fileToBase64 = (file: File): Promise<{base64: string, aspectRatio: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const targetRatio = img.width / img.height;
          const allowedRatios = [
            '1:1', '3:2', '2:3', '4:3', '3:4', '5:4', '4:5', '16:9', '9:16', '2:1', '1:2', '3:1', '1:3', '21:9', '9:21'
          ];
          let closest = '1:1';
          let minDiff = Infinity;
          for (const ratio of allowedRatios) {
            const [w, h] = ratio.split(':').map(Number);
            const r = w / h;
            const diff = Math.abs(targetRatio - r);
            if (diff < minDiff) {
              minDiff = diff;
              closest = ratio;
            }
          }
          resolve({ base64, aspectRatio: closest });
        };
        img.onerror = () => resolve({ base64, aspectRatio: 'auto' });
        img.src = base64;
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const upscaleNext = useCallback(async (isManualTrigger = false, fileToUpscale?: UploadedFile) => {
    // If not triggered manually and auto upscale is off, skip
    if (!isManualTrigger && upscaleMode === 'none' && !upscalingRef.current) {
      upscalingRef.current = false;
      return;
    }

    const nextFile = fileToUpscale || filesRef.current.find((f) => 
      ((f.status === 'completed' || f.status === 'idle') && !f.upscaledUrl && f.status !== 'upscaling' && f.status !== 'upscale_error')
    );

    if (!nextFile) {
      upscalingRef.current = false;
      return;
    }

    const targetModel = (nextFile.upscaleRetries || 0) >= 2 ? 'topaz/image-upscale' : 'recraft/crisp-upscale';
    updateFileStatus(nextFile.id, { status: 'upscaling', progress: 0, upscaleModel: targetModel });

    try {
      setApiMessage(`Upscale en cours pour ${nextFile.file.name}... (${targetModel})`);
      
      let base64Data: string | undefined;
      if (!nextFile.resultUrl) {
        const result = await fileToBase64(nextFile.file);
        base64Data = result.base64;
      }
      
      const res = await fetch('/api/upscale-image', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': customApiKey
        },
        body: JSON.stringify({ 
          resultUrl: nextFile.resultUrl, 
          base64: base64Data,
          fileName: nextFile.file.name,
          upscaleModel: targetModel,
          appUrl: window.location.origin
        })
      });

      if (res.status === 401) {
         setShowApiKeyModal(true);
         throw new Error('Clé API KIE manquante ou invalide.');
      }
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la création de la tâche d\'upscale');
      }

      setApiMessage(data.msg || 'Tâche d\'upscale créée avec succès');

      const taskId = data.taskId;
      updateFileStatus(nextFile.id, { upscaleTaskId: taskId });

      let elapsedSeconds = 0;
      const pollInterval = setInterval(() => {
         elapsedSeconds += 1;
         updateFileStatus(nextFile.id, { progress: elapsedSeconds });
      }, 1000);

      const poll = async () => {
        try {
          const pollRes = await fetch(`/api/tasks/${taskId}`, { headers: { 'x-api-key': customApiKey } });
          if (!pollRes.ok) throw new Error('Erreur de polling');
          const pollData = await pollRes.json();

          if (pollData.status === 'completed') {
            clearInterval(pollInterval);
            updateFileStatus(nextFile.id, { 
              status: 'upscaled', 
              upscaledUrl: pollData.resultUrl 
            });
            // Try to upscale next if auto or manual batch
            if (upscaleMode === 'auto' || upscalingRef.current) {
              upscaleNext();
            }
          } else if (pollData.status === 'error') {
            clearInterval(pollInterval);
            const retries = nextFile.upscaleRetries || 0;
            if (retries < 2) {
              const previousStatus = nextFile.resultUrl ? 'completed' : 'idle';
              updateFileStatus(nextFile.id, { upscaleRetries: retries + 1, status: previousStatus });
              setTimeout(() => upscaleNext(true, { ...nextFile, upscaleRetries: retries + 1, status: previousStatus }), 2000);
            } else {
              updateFileStatus(nextFile.id, { 
                status: 'upscale_error', 
                error: pollData.error 
              });
              if (upscaleMode === 'auto' || upscalingRef.current) {
                upscaleNext();
              }
            }
          } else {
            // Check timeout 300s
            if (elapsedSeconds > 300) {
               clearInterval(pollInterval);
               const retries = nextFile.upscaleRetries || 0;
               if (retries < 2) {
                 const previousStatus = nextFile.resultUrl ? 'completed' : 'idle';
                 updateFileStatus(nextFile.id, { upscaleRetries: retries + 1, status: previousStatus });
                 setTimeout(() => upscaleNext(true, { ...nextFile, upscaleRetries: retries + 1, status: previousStatus }), 2000);
               } else {
                 updateFileStatus(nextFile.id, { 
                   status: 'upscale_error', 
                   error: 'Temps de traitement dépassé (300s).' 
                 });
                 if (upscaleMode === 'auto' || upscalingRef.current) {
                   upscaleNext();
                 }
               }
            } else {
               setTimeout(poll, 5000);
            }
          }
        } catch (pollError: any) {
          console.error("Polling error:", pollError);
          clearInterval(pollInterval);
          setApiMessage(`Erreur de polling upscale: ${pollError.message}`);
          const retries = nextFile.upscaleRetries || 0;
          if (retries < 2) {
            const previousStatus = nextFile.resultUrl ? 'completed' : 'idle';
            updateFileStatus(nextFile.id, { upscaleRetries: retries + 1, status: previousStatus });
            setTimeout(() => upscaleNext(true, { ...nextFile, upscaleRetries: retries + 1, status: previousStatus }), 2000);
          } else {
            updateFileStatus(nextFile.id, { status: 'upscale_error', error: pollError.message });
            if (upscaleMode === 'auto' || upscalingRef.current) {
               upscaleNext();
            }
          }
        }
      };

      setTimeout(poll, 5000);

    } catch (error: any) {
      setApiMessage(`Erreur d'upscale: ${error.message}`);
      const retries = nextFile.upscaleRetries || 0;
      if (retries < 2) {
        const previousStatus = nextFile.resultUrl ? 'completed' : 'idle';
        updateFileStatus(nextFile.id, { upscaleRetries: retries + 1, status: previousStatus });
        setTimeout(() => upscaleNext(true, { ...nextFile, upscaleRetries: retries + 1, status: previousStatus }), 2000);
      } else {
        updateFileStatus(nextFile.id, { status: 'upscale_error', error: error.message });
        if (upscaleMode === 'auto' || upscalingRef.current) {
           upscaleNext();
        }
      }
    }
  }, [updateFileStatus, upscaleMode]);

  const processNext = useCallback(async (isManualTrigger = false) => {
    // If we're not triggered manually and mode is manual, do not proceed automatically
    if (!isManualTrigger && processingMode === 'manual') {
      processingRef.current = false;
      return;
    }

    if (processingRef.current && isManualTrigger) return; // Already processing
    
    const nextFile = filesRef.current.find((f) => f.status === 'idle');

    if (!nextFile) {
      processingRef.current = false;
      return;
    }

    processingRef.current = true;
    updateFileStatus(nextFile.id, { status: 'processing', progress: 0 });

    try {
      const { base64: base64Data, aspectRatio } = await fileToBase64(nextFile.file);
      setApiMessage(`Upload en cours pour ${nextFile.file.name}...`);
      
      const res = await fetch('/api/process-image', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': customApiKey
        },
        body: JSON.stringify({ 
          base64Data, 
          aspectRatio,
          fileName: nextFile.file.name,
          appUrl: window.location.origin,
          prompt: promptText
        })
      });

      if (res.status === 401) {
         setShowApiKeyModal(true);
         throw new Error('Clé API KIE manquante ou invalide.');
      }
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la création de la tâche');
      }

      setApiMessage(data.msg || 'Tâche créée avec succès');

      const taskId = data.taskId;
      updateFileStatus(nextFile.id, { taskId });

      let elapsedSeconds = 0;
      const pollInterval = setInterval(() => {
         elapsedSeconds += 1;
         updateFileStatus(nextFile.id, { progress: elapsedSeconds });
      }, 1000);

      const poll = async () => {
        try {
          const pollRes = await fetch(`/api/tasks/${taskId}`, { headers: { 'x-api-key': customApiKey } });
          if (!pollRes.ok) throw new Error('Erreur de polling');
          const pollData = await pollRes.json();

          if (pollData.status === 'completed') {
            clearInterval(pollInterval);
            updateFileStatus(nextFile.id, { 
              status: 'completed', 
              resultUrl: pollData.resultUrl 
            });
            processingRef.current = false;
            
            // Si on est en mode 'auto' pour l'upscale, on peut le lancer tout de suite,
            // ou l'ajouter à la file d'attente d'upscale.
            if (upscaleMode === 'auto') {
               upscaleNext(false, { ...nextFile, resultUrl: pollData.resultUrl, status: 'completed' });
            }

            processNext();
          } else if (pollData.status === 'error') {
            clearInterval(pollInterval);
            updateFileStatus(nextFile.id, { 
              status: 'error', 
              error: pollData.error 
            });
            processingRef.current = false;
            processNext();
          } else {
            // Check timeout 300s
            if (elapsedSeconds > 300) {
               clearInterval(pollInterval);
               updateFileStatus(nextFile.id, { 
                 status: 'error', 
                 error: 'Temps de traitement dépassé (300s).' 
               });
               processingRef.current = false;
               processNext();
            } else {
               setTimeout(poll, 5000);
            }
          }
        } catch (pollError: any) {
          console.error("Polling error:", pollError);
          clearInterval(pollInterval);
          setApiMessage(`Erreur de polling: ${pollError.message}`);
          updateFileStatus(nextFile.id, { status: 'error', error: pollError.message });
          processingRef.current = false;
          processNext();
        }
      };

      setTimeout(poll, 5000);

    } catch (error: any) {
      setApiMessage(`Erreur: ${error.message}`);
      updateFileStatus(nextFile.id, { status: 'error', error: error.message });
      processingRef.current = false;
      processNext();
    }
  }, [updateFileStatus, promptText, processingMode]);

  const startProcessing = useCallback(() => {
    if (!processingRef.current) {
      processNext(true);
    }
  }, [processNext]);

  const startUpscale = useCallback(() => {
    upscalingRef.current = true;
    upscaleNext(true);
  }, [upscaleNext]);

  const retryUpscale = useCallback((file: UploadedFile) => {
    const previousStatus = file.resultUrl ? 'completed' : 'idle';
    updateFileStatus(file.id, { status: previousStatus });
    setTimeout(() => {
       upscaleNext(true, { ...file, status: previousStatus });
    }, 100);
  }, [updateFileStatus, upscaleNext]);

  const retryFile = useCallback((id: string) => {
    const file = filesRef.current.find(f => f.id === id);
    if (!file) return;

    if (file.status === 'error') {
      updateFileStatus(id, { status: 'idle', error: undefined, taskId: undefined });
      if (!processingRef.current) startProcessing();
    } else if (file.status === 'upscale_error') {
      updateFileStatus(id, { status: 'completed', error: undefined, upscaleTaskId: undefined, upscaleRetries: 0 });
      if (!upscalingRef.current) startUpscale();
    }
  }, [updateFileStatus, startProcessing, startUpscale]);

  const clearFiles = useCallback(() => {
    setFiles(prev => {
      prev.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
      return [];
    });
    processingRef.current = false;
    upscalingRef.current = false;
    setApiMessage('Espace de travail nettoyé.');
  }, []);

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    retryFile,
    startProcessing,
    startUpscale,
    retryUpscale,
    upscaleNext,
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
    setCustomApiKey
  };
}
