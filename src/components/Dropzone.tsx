import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { supportedInputFormats } from '../utils/imageProcessing';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
}

export default function Dropzone({ onDrop }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: supportedInputFormats.reduce((acc, format) => ({ ...acc, [format]: [] }), {}),
    maxSize: 25 * 1024 * 1024, // 25MB
    onDrop
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive ? (
          'Drop the files here...'
        ) : (
          <>
            Drag & drop images here, or click to select files
            <br />
            <span className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF, WEBP, HEIC, BMP, TIFF (max 25MB)
            </span>
          </>
        )}
      </p>
    </div>
  );
}