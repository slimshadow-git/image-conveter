export type SupportedFormat = 
  | 'image/jpeg' 
  | 'image/png' 
  | 'image/gif' 
  | 'image/webp' 
  | 'image/avif' 
  | 'application/pdf' 
  | 'image/x-icon'
  | 'image/heic';

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface ConversionOptions {
  format: SupportedFormat;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio: boolean;
  stripMetadata: boolean;
}