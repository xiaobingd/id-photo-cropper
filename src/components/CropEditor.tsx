import React from 'react';
import { PhotoSize } from '../utils/photoSizes';
import { useCropper } from '../hooks/useCropper';
import { Move, ZoomIn } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropEditorProps {
  photoSize: PhotoSize;
  cropArea: CropArea;
  setCropArea: (area: CropArea) => void;
  canvasSize: { width: number; height: number };
  imageLoaded: boolean;
}

export const CropEditor: React.FC<CropEditorProps> = ({
  photoSize,
  cropArea,
  setCropArea,
  canvasSize,
  imageLoaded,
}) => {
  const { canvasRef, handlePointerDown, handlePointerMove, handlePointerUp } =
    useCropper(photoSize, cropArea, setCropArea, canvasSize);

  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      {/* Tips */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Move className="w-3.5 h-3.5" />
          <span>拖拽移动裁剪框</span>
        </div>
        <div className="flex items-center gap-1">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>拖拽角落缩放</span>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="canvas-container bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center"
        style={{
          minHeight: imageLoaded ? undefined : 300,
          minWidth: imageLoaded ? undefined : 400,
        }}
      >
        {!imageLoaded && (
          <div className="flex items-center justify-center text-gray-400 text-sm">
            加载中...
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={{
            display: imageLoaded ? 'block' : 'none',
            maxWidth: '100%',
            maxHeight: '65vh',
            touchAction: 'none',
          }}
        />
      </div>
    </div>
  );
};
