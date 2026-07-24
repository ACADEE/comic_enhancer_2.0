export type FileStatus = 'idle' | 'processing' | 'completed' | 'error' | 'upscaling' | 'upscaled' | 'upscale_error';

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  status: FileStatus;
  resultUrl?: string;
  upscaledUrl?: string;
  taskId?: string;
  upscaleTaskId?: string;
  upscaleModel?: string;
  aspectRatio?: string;
  error?: string;
  progress?: number;
  upscaleRetries?: number;
}
