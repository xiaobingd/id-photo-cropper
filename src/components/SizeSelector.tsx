import React from 'react';
import { PHOTO_SIZES, PhotoSize } from '../utils/photoSizes';
import { Ruler } from 'lucide-react';

interface SizeSelectorProps {
  selected: PhotoSize;
  onChange: (size: PhotoSize) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Ruler className="w-4 h-4 text-pink-400" />
        <span className="text-sm font-medium text-gray-700">证件照尺寸</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PHOTO_SIZES.map((size) => (
          <button
            key={size.id}
            onClick={() => onChange(size)}
            className={`text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
              selected.id === size.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 scale-[1.02]'
                : 'bg-pink-50/60 text-gray-600 hover:bg-pink-100/80 hover:scale-[1.01]'
            }`}
          >
            <div className="font-medium">{size.nameCn}</div>
            <div className={`text-xs mt-0.5 ${selected.id === size.id ? 'text-white/80' : 'text-gray-400'}`}>
              {size.widthMm}x{size.heightMm}mm
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
