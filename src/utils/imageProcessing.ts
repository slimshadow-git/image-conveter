import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';
import { jsPDF } from 'jspdf';
import type { ConversionOptions, SupportedFormat } from '../types';

export const supportedInputFormats = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/bmp',
  'image/tiff'
];

export const supportedOutputFormats = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'application/pdf',
  'image/x-icon'
];

export async function convertImage(
  file: File,
  options: ConversionOptions
): Promise<Blob> {
  let processedImage: Blob | File = file;

  // Convert HEIC to JPEG first if needed
  if (file.type === 'image/heic') {
    processedImage = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: options.quality / 100
    });
  }

  // Handle basic image compression and resizing
  const compressedImage = await imageCompression(processedImage as File, {
    maxSizeMB: 25,
    maxWidthOrHeight: Math.max(options.maxWidth || 4096, options.maxHeight || 4096),
    useWebWorker: true,
    fileType: options.format as string,
    quality: options.quality / 100
  });

  // Special handling for PDF conversion
  if (options.format === 'application/pdf') {
    const pdf = new jsPDF();
    const imgData = await blobToBase64(compressedImage);
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  return compressedImage;
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function generateFileName(originalName: string, format: SupportedFormat): string {
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const extension = format.split('/')[1];
  return `${baseName}_converted.${extension}`;
}