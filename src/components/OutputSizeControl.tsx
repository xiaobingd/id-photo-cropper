import React, { useState, useEffect } from 'react';
import { PhotoSize } from '../utils/photoSizes';
import { Maximize2, Lock, Unlock } from 'lucide-react';

interface OutputSizeControlProps {
  photoSize: PhotoSize;
  outputW: number;
  outputH: number;
  onChange: (w: number, h: number) => void;
}

const PRESETS = [
  { label: '50%', scale: 0.5 },
  { label: '原始', scale: 1 },
  { label: '150%', scale: 1.5 },
  { label: '2x', scale: 2 },
];

export const OutputSizeControl: React.FC<OutputSizeControlProps> = ({
  photoSize,
  outputW,
  outputH,
  onChange,
}) => {
  const [lockRatio, setLockRatio] = useState(true);
  const [localW, setLocalW] = useState(String(outputW));
  const [localH, setLocalH] = useState(String(outputH));
  const ratio = photoSize.widthPx / photoSize.heightPx;

  // Sync local inputs when parent values change (e.g. preset or size change)
  useEffect(() => {
    setLocalW(String(outputW));
    setLocalH(String(outputH));
  }, [outputW, outputH]);

  const handleWidthChange = (val: string) => {
    setLocalW(val);
    const w = parseInt(val);
    if (!isNaN(w) && w > 0) {
      if (lockRatio) {
        const h = Math.round(w / ratio);
        setLocalH(String(h));
        onChange(w, h);
      } else {
        onChange(w, outputH);
      }
    }
  };

  const handleHeightChange = (val: string) => {
    setLocalH(val);
    const h = parseInt(val);
    if (!isNaN(h) && h > 0) {
      if (lockRatio) {
        const w = Math.round(h * ratio);
        setLocalW(String(w));
        onChange(w, h);
      } else {
        onChange(outputW, h);
      }
    }
  };

  const handlePreset = (scale: number) => {
    const w = Math.round(photoSize.widthPx * scale);
    const h = Math.round(photoSize.heightPx * scale);
    onChange(w, h);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 mb-2">
        <Maximize2 className="w-4 h-4 text-pink-400" />
        <span className="text-sm font-medium text-gray-700">输出大小</span>
      </div>

      {/* Quick presets */}
      <div className="flex gap-1.5">
        {PRESETS.map((p) => {
          const pw = Math.round(photoSize.widthPx * p.scale);
          const ph = Math.round(photoSize.heightPx * p.scale);
          const isActive = outputW === pw && outputH === ph;
          return (
            <button
              key={p.label}
              onClick={() => handlePreset(p.scale)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-200'
                  : 'bg-pink-50 text-pink-400 hover:bg-pink-100'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom width x height inputs */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1">
          <label className="text-[10px] text-gray-400 mb-0.5 block">宽 (px)</label>
          <input
            type="number"
            min="1"
            value={localW}
            onChange={(e) => handleWidthChange(e.target.value)}
            className="w-full px-2 py-1.5 text-xs text-gray-700 bg-pink-50/60 border border-pink-100 rounded-lg focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-200 transition-all"
          />
        </div>

        <button
          onClick={() => setLockRatio(!lockRatio)}
          className={`mt-3.5 p-1 rounded-md transition-all ${
            lockRatio ? 'text-pink-500 bg-pink-50' : 'text-gray-300 hover:text-gray-400'
          }`}
          title={lockRatio ? '已锁定比例' : '未锁定比例'}
        >
          {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        <div className="flex-1">
          <label className="text-[10px] text-gray-400 mb-0.5 block">高 (px)</label>
          <input
            type="number"
            min="1"
            value={localH}
            onChange={(e) => handleHeightChange(e.target.value)}
            className="w-full px-2 py-1.5 text-xs text-gray-700 bg-pink-50/60 border border-pink-100 rounded-lg focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-200 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
