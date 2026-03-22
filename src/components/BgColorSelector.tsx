import React from 'react';
import { BG_COLORS, BgColor } from '../utils/photoSizes';
import { Palette, Check } from 'lucide-react';

interface BgColorSelectorProps {
  selected: BgColor;
  onChange: (color: BgColor) => void;
}

export const BgColorSelector: React.FC<BgColorSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-gray-700">背景颜色</span>
      </div>
      <div className="flex gap-3">
        {BG_COLORS.map((bg) => (
          <button
            key={bg.id}
            onClick={() => onChange(bg)}
            className="flex flex-col items-center gap-1.5 group"
            title={bg.name}
          >
            <div
              className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                bg.id === 'transparent' ? 'checkerboard' : ''
              } ${
                selected.id === bg.id
                  ? 'ring-2 ring-primary ring-offset-2 scale-110'
                  : 'ring-1 ring-gray-200 group-hover:ring-gray-300 group-hover:scale-105'
              }`}
              style={bg.id !== 'transparent' ? { backgroundColor: bg.color } : {}}
            >
              {selected.id === bg.id && (
                <Check className={`w-4 h-4 ${bg.id === 'white' || bg.id === 'gray' || bg.id === 'transparent' ? 'text-primary' : 'text-white'}`} />
              )}
            </div>
            <span className="text-xs text-gray-500">{bg.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
