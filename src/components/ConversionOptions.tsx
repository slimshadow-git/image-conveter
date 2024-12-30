import React from 'react';
import type { ConversionOptions, SupportedFormat } from '../types';
import { supportedOutputFormats } from '../utils/imageProcessing';

interface Props {
  options: ConversionOptions;
  onChange: (options: ConversionOptions) => void;
}

export default function ConversionOptions({ options, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    onChange({
      ...options,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Output Format</label>
        <select
          name="format"
          value={options.format}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {supportedOutputFormats.map(format => (
            <option key={format} value={format}>
              {format.split('/')[1].toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Quality</label>
        <input
          type="range"
          name="quality"
          min="1"
          max="100"
          value={options.quality}
          onChange={handleChange}
          className="w-full"
        />
        <span className="text-sm text-gray-500">{options.quality}%</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Width</label>
          <input
            type="number"
            name="maxWidth"
            value={options.maxWidth || ''}
            onChange={handleChange}
            placeholder="Auto"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Height</label>
          <input
            type="number"
            name="maxHeight"
            value={options.maxHeight || ''}
            onChange={handleChange}
            placeholder="Auto"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="maintainAspectRatio"
            checked={options.maintainAspectRatio}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Maintain aspect ratio</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="stripMetadata"
            checked={options.stripMetadata}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Strip metadata</span>
        </label>
      </div>
    </div>
  );
}