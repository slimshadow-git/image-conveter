import React, { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { BlobWriter, ZipWriter } from '@zip.js/zip.js';
import Dropzone from './components/Dropzone';
import ConversionOptions from './components/ConversionOptions';
import ImagePreview from './components/ImagePreview';
import { convertImage, generateFileName } from './utils/imageProcessing';
import type { ImageFile, ConversionOptions as ConversionOptionsType } from './types';

function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [options, setOptions] = useState<ConversionOptionsType>({
    format: 'image/jpeg',
    quality: 80,
    maintainAspectRatio: true,
    stripMetadata: false
  });

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const handleConvert = async () => {
    if (images.length === 0) {
      toast.error('Please add some images first');
      return;
    }

    const updatedImages = [...images];
    const convertedBlobs: Blob[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image.status === 'processing') continue;

      updatedImages[i] = { ...image, status: 'processing' };
      setImages(updatedImages);

      try {
        const convertedBlob = await convertImage(image.file, options);
        convertedBlobs.push(convertedBlob);
        updatedImages[i] = { ...image, status: 'complete' };
      } catch (error) {
        updatedImages[i] = { 
          ...image, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Conversion failed'
        };
        toast.error(`Failed to convert ${image.file.name}`);
      }

      setImages([...updatedImages]);
    }

    if (convertedBlobs.length > 0) {
      if (convertedBlobs.length === 1) {
        const blob = convertedBlobs[0];
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateFileName(images[0].file.name, options.format);
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
        
        await Promise.all(convertedBlobs.map(async (blob, i) => {
          const fileName = generateFileName(images[i].file.name, options.format);
          await zipWriter.add(fileName, new BlobReader(blob));
        }));

        const zipBlob = await zipWriter.close();
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_images.zip';
        a.click();
        URL.revokeObjectURL(url);
      }

      toast.success('Conversion complete!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Image Converter</h1>
          <p className="mt-2 text-gray-600">
            Convert your images to any format with advanced optimization options
          </p>
        </div>

        <Dropzone onDrop={handleDrop} />

        {images.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(image => (
                <ImagePreview
                  key={image.id}
                  image={image}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <ConversionOptions options={options} onChange={setOptions} />

            <button
              onClick={handleConvert}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent 
                text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="mr-2 h-5 w-5" />
              Convert & Download
            </button>
          </>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;