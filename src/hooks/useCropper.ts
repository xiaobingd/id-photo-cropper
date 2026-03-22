import { useCallback, useRef, useEffect } from 'react';
import { PhotoSize } from '../utils/photoSizes';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragState {
  isDragging: boolean;
  dragType: 'move' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br' | null;
  startX: number;
  startY: number;
  startCrop: CropArea;
}

// Singleton state to share image data between hook instances
let sharedImage: HTMLImageElement | null = null;
let sharedScale = 1;
//let sharedCanvasW = 0;
//let sharedCanvasH = 0;

export function loadImageFile(file: File): Promise<{ img: HTMLImageElement; cvW: number; cvH: number; scale: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxW = 700;
      const maxH = 500;
      const imgScale = Math.min(maxW / img.width, maxH / img.height, 1);
      const cvW = Math.floor(img.width * imgScale);
      const cvH = Math.floor(img.height * imgScale);

      sharedImage = img;
      sharedScale = imgScale;
      sharedCanvasW = cvW;
      sharedCanvasH = cvH;

      URL.revokeObjectURL(url);
      resolve({ img, cvW, cvH, scale: imgScale });
    };
    img.src = url;
  });
}

export function generateCroppedPhoto(
  cropArea: CropArea,
  outW: number,
  outH: number
): string | null {
  const img = sharedImage;
  if (!img || outW <= 0 || outH <= 0) return null;

  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = outW;
  resultCanvas.height = outH;
  const ctx = resultCanvas.getContext('2d');
  if (!ctx) return null;

  const scale = sharedScale;
  const srcX = cropArea.x / scale;
  const srcY = cropArea.y / scale;
  const srcW = cropArea.width / scale;
  const srcH = cropArea.height / scale;

  ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

  return resultCanvas.toDataURL('image/png');
}

export function computeCropArea(cvWidth: number, cvHeight: number, ratio: number): CropArea {
  const cropH = Math.min(cvHeight * 0.75, (cvWidth * 0.75) / ratio);
  const cropW = cropH * ratio;
  const cropX = (cvWidth - cropW) / 2;
  const cropY = (cvHeight - cropH) / 2;
  return { x: cropX, y: cropY, width: cropW, height: cropH };
}

export function useCropper(
  photoSize: PhotoSize,
  cropArea: CropArea,
  setCropArea: (area: CropArea) => void,
  canvasSize: { width: number; height: number }
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    dragType: null,
    startX: 0,
    startY: 0,
    startCrop: { x: 0, y: 0, width: 0, height: 0 },
  });

  const aspectRatio = photoSize.widthPx / photoSize.heightPx;

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = sharedImage;
    if (!canvas || !ctx || !img || canvasSize.width === 0) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Draw image
    ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);

    // Draw overlay (darken outside crop)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasSize.width, cropArea.y);
    ctx.fillRect(0, cropArea.y + cropArea.height, canvasSize.width, canvasSize.height - cropArea.y - cropArea.height);
    ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.height);
    ctx.fillRect(cropArea.x + cropArea.width, cropArea.y, canvasSize.width - cropArea.x - cropArea.width, cropArea.height);

    // Draw crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw dashed guidelines (rule of thirds)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 1; i <= 2; i++) {
      const y = cropArea.y + (cropArea.height * i) / 3;
      ctx.beginPath();
      ctx.moveTo(cropArea.x, y);
      ctx.lineTo(cropArea.x + cropArea.width, y);
      ctx.stroke();
    }
    for (let i = 1; i <= 2; i++) {
      const x = cropArea.x + (cropArea.width * i) / 3;
      ctx.beginPath();
      ctx.moveTo(x, cropArea.y);
      ctx.lineTo(x, cropArea.y + cropArea.height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw corner handles
    const handleSize = 12;
    const handleOffset = 2;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;

    const corners = [
      { x: cropArea.x - handleOffset, y: cropArea.y - handleOffset },
      { x: cropArea.x + cropArea.width - handleSize + handleOffset, y: cropArea.y - handleOffset },
      { x: cropArea.x - handleOffset, y: cropArea.y + cropArea.height - handleSize + handleOffset },
      { x: cropArea.x + cropArea.width - handleSize + handleOffset, y: cropArea.y + cropArea.height - handleSize + handleOffset },
    ];

    corners.forEach((c) => {
      ctx.beginPath();
      ctx.roundRect(c.x, c.y, handleSize, handleSize, 3);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Draw size label
    const labelText = `${photoSize.nameCn} ${photoSize.widthPx}×${photoSize.heightPx}`;
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    const textW = ctx.measureText(labelText).width + 12;
    const labelX = cropArea.x + (cropArea.width - textW) / 2;
    const labelY = cropArea.y + cropArea.height + 8;
    ctx.beginPath();
    ctx.roundRect(labelX, labelY, textW, 22, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, cropArea.x + cropArea.width / 2, labelY + 11);
  }, [canvasSize, cropArea, photoSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getInteractionType = (x: number, y: number): DragState['dragType'] => {
    const hs = 20;
    const { x: cx, y: cy, width: cw, height: ch } = cropArea;

    if (Math.abs(x - cx) < hs && Math.abs(y - cy) < hs) return 'resize-tl';
    if (Math.abs(x - (cx + cw)) < hs && Math.abs(y - cy) < hs) return 'resize-tr';
    if (Math.abs(x - cx) < hs && Math.abs(y - (cy + ch)) < hs) return 'resize-bl';
    if (Math.abs(x - (cx + cw)) < hs && Math.abs(y - (cy + ch)) < hs) return 'resize-br';
    if (x >= cx && x <= cx + cw && y >= cy && y <= cy + ch) return 'move';
    return null;
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getEventPos(e);
    const type = getInteractionType(pos.x, pos.y);
    if (!type) return;
    dragStateRef.current = {
      isDragging: true,
      dragType: type,
      startX: pos.x,
      startY: pos.y,
      startCrop: { ...cropArea },
    };
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const state = dragStateRef.current;
    if (!state.isDragging) {
      const pos = getEventPos(e);
      const type = getInteractionType(pos.x, pos.y);
      const canvas = canvasRef.current;
      if (canvas) {
        if (type === 'move') canvas.style.cursor = 'move';
        else if (type?.startsWith('resize')) canvas.style.cursor = type.includes('tl') || type.includes('br') ? 'nwse-resize' : 'nesw-resize';
        else canvas.style.cursor = 'crosshair';
      }
      return;
    }

    const pos = getEventPos(e);
    const dx = pos.x - state.startX;
    const dy = pos.y - state.startY;
    const sc = state.startCrop;

    if (state.dragType === 'move') {
      let newX = sc.x + dx;
      let newY = sc.y + dy;
      newX = Math.max(0, Math.min(canvasSize.width - sc.width, newX));
      newY = Math.max(0, Math.min(canvasSize.height - sc.height, newY));
      setCropArea({ ...sc, x: newX, y: newY });
    } else if (state.dragType?.startsWith('resize')) {
      const newCrop = { ...sc };
      const minSize = 40;

      if (state.dragType === 'resize-br') {
        let newW = Math.max(minSize, sc.width + dx);
        let newH = newW / aspectRatio;
        newW = Math.min(newW, canvasSize.width - sc.x);
        newH = Math.min(newH, canvasSize.height - sc.y);
        if (newH * aspectRatio < newW) newW = newH * aspectRatio;
        else newH = newW / aspectRatio;
        newCrop.width = newW;
        newCrop.height = newH;
      } else if (state.dragType === 'resize-tl') {
        let newW = Math.max(minSize, sc.width - dx);
        let newH = newW / aspectRatio;
        newW = Math.min(newW, sc.x + sc.width);
        newH = Math.min(newH, sc.y + sc.height);
        if (newH * aspectRatio < newW) newW = newH * aspectRatio;
        else newH = newW / aspectRatio;
        newCrop.x = sc.x + sc.width - newW;
        newCrop.y = sc.y + sc.height - newH;
        newCrop.width = newW;
        newCrop.height = newH;
      } else if (state.dragType === 'resize-tr') {
        let newW = Math.max(minSize, sc.width + dx);
        let newH = newW / aspectRatio;
        newW = Math.min(newW, canvasSize.width - sc.x);
        newH = Math.min(newH, sc.y + sc.height);
        if (newH * aspectRatio < newW) newW = newH * aspectRatio;
        else newH = newW / aspectRatio;
        newCrop.y = sc.y + sc.height - newH;
        newCrop.width = newW;
        newCrop.height = newH;
      } else if (state.dragType === 'resize-bl') {
        let newW = Math.max(minSize, sc.width - dx);
        let newH = newW / aspectRatio;
        newW = Math.min(newW, sc.x + sc.width);
        newH = Math.min(newH, canvasSize.height - sc.y);
        if (newH * aspectRatio < newW) newW = newH * aspectRatio;
        else newH = newW / aspectRatio;
        newCrop.x = sc.x + sc.width - newW;
        newCrop.width = newW;
        newCrop.height = newH;
      }

      setCropArea(newCrop);
    }
  };

  const handlePointerUp = () => {
    dragStateRef.current.isDragging = false;
    dragStateRef.current.dragType = null;
  };

  return {
    canvasRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
