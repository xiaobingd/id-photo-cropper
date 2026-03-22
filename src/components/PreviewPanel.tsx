import React from 'react';
import { PhotoSize } from '../utils/photoSizes';
import { Download, Eye, Info, Sparkles } from 'lucide-react';

interface PreviewPanelProps {
  previewUrl: string | null;
  photoSize: PhotoSize;
  outputW: number;
  outputH: number;
  onDownload: () => void;
  onGenerate: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  previewUrl,
  photoSize,
  outputW,
  outputH,
  onDownload,
  onGenerate,
}) => {
  return (
    <div className="space-y-3">
      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={onGenerate}
          className="flex-1 py-2.5 px-3 bg-pink-50 hover:bg-pink-100 text-pink-500 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5"
        >
          <Eye className="w-4 h-4" />
          预览
        </button>
        <button
          onClick={onDownload}
          className="flex-1 py-2.5 px-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-pink-200"
        >
          <Download className="w-4 h-4" />
          下载
        </button>
      </div>

      {/* Preview area */}
      {previewUrl ? (
        <div className="flex justify-center animate-fade-in">
          <div
            className="rounded-xl overflow-hidden shadow-md border border-pink-100/60"
            style={{
              width: Math.min(160, photoSize.widthPx / 2.5),
              height: Math.min(224, photoSize.heightPx / 2.5),
            }}
          >
            <img
              src={previewUrl}
              alt="预览"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 text-pink-300">
          <Sparkles className="w-6 h-6 mb-1 animate-bounce-soft" />
          <span className="text-xs">点击预览看看效果吧~</span>
        </div>
      )}

      {/* Spec info */}
      <div className="flex items-start gap-1.5 text-xs text-gray-400">
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>{photoSize.nameCn} | {outputW}x{outputH}px | {photoSize.widthMm}x{photoSize.heightMm}mm</span>
      </div>
    </div>
  );
};
