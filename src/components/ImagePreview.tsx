import React from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { ImageFile } from '../types';

interface Props {
  image: ImageFile;
  onRemove: (id: string) => void;
}

export default function ImagePreview({ image, onRemove }: Props) {
  const statusIcon = {
    pending: null,
    processing: <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />,
    complete: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />
  }[image.status];

  return (
    <div className="relative group">
      <img
        src={image.preview}
        alt={image.file.name}
        className="w-full h-32 object-cover rounded-lg"
      />
      <button
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white 
          opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
      {statusIcon && (
        <div className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow">
          {statusIcon}
        </div>
      )}
      {image.error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 rounded-b-lg">
          {image.error}
        </div>
      )}
    </div>
  );
}