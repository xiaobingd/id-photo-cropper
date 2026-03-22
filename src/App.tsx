import { useState, useCallback, useRef } from 'react';
import { UploadZone } from './components/UploadZone';
import { CropEditor } from './components/CropEditor';
import { SizeSelector } from './components/SizeSelector';
import { OutputSizeControl } from './components/OutputSizeControl';
import { PreviewPanel } from './components/PreviewPanel';
import { PHOTO_SIZES, PhotoSize } from './utils/photoSizes';
import { loadImageFile, generateCroppedPhoto, computeCropArea } from './hooks/useCropper';
import { RotateCcw, Sparkles, Heart, Shield, Crop } from 'lucide-react';
import './App.css';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function App() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [photoSize, setPhotoSize] = useState<PhotoSize>(PHOTO_SIZES[0]);
  const [outputW, setOutputW] = useState(PHOTO_SIZES[0].widthPx);
  const [outputH, setOutputH] = useState(PHOTO_SIZES[0].heightPx);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });

  const handleFileSelect = useCallback(async (file: File) => {
    const { cvW, cvH } = await loadImageFile(file);
    const ratio = PHOTO_SIZES[0].widthPx / PHOTO_SIZES[0].heightPx;
    setCanvasSize({ width: cvW, height: cvH });
    setCropArea(computeCropArea(cvW, cvH, ratio));
    setPreviewUrl(null);
    setImageLoaded(true);
  }, []);

  const hasGeneratedRef = useRef(false);

  const regeneratePreview = useCallback((crop: CropArea, w: number, h: number) => {
    if (!hasGeneratedRef.current) return;
    const url = generateCroppedPhoto(crop, w, h);
    if (url) setPreviewUrl(url);
  }, []);

  const handleSizeChange = useCallback((size: PhotoSize) => {
    setPhotoSize(size);
    setOutputW(size.widthPx);
    setOutputH(size.heightPx);
    if (canvasSize.width > 0) {
      const ratio = size.widthPx / size.heightPx;
      const newCrop = computeCropArea(canvasSize.width, canvasSize.height, ratio);
      setCropArea(newCrop);
      setTimeout(() => regeneratePreview(newCrop, size.widthPx, size.heightPx), 50);
    }
  }, [canvasSize, regeneratePreview]);

  const handleOutputSizeChange = useCallback((w: number, h: number) => {
    setOutputW(w);
    setOutputH(h);
    regeneratePreview(cropArea, w, h);
  }, [cropArea, regeneratePreview]);

  const handleGenerate = useCallback(() => {
    hasGeneratedRef.current = true;
    const url = generateCroppedPhoto(cropArea, outputW, outputH);
    if (url) {
      setPreviewUrl(url);
    }
  }, [cropArea, outputW, outputH]);

  const handleDownload = useCallback(() => {
    hasGeneratedRef.current = true;
    const url = generateCroppedPhoto(cropArea, outputW, outputH);
    if (url) {
      setPreviewUrl(url);
      const a = document.createElement('a');
      a.href = url;
      a.download = `小杨证件照_${photoSize.nameCn}_${outputW}x${outputH}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [photoSize, cropArea, outputW, outputH]);

  const handleReset = useCallback(() => {
    setImageLoaded(false);
    setPreviewUrl(null);
    setCanvasSize({ width: 0, height: 0 });
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    hasGeneratedRef.current = false;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-orange-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200 text-lg">
              📷
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent flex items-center gap-1">
                小杨的证件照处理站
                <Sparkles className="w-4 h-4 text-yellow-400 animate-bounce-soft" />
              </h1>
              <p className="text-xs text-pink-300 hidden sm:block">
                轻松裁剪 · 多种尺寸 · 安全可靠 ~
              </p>
            </div>
          </div>
          {imageLoaded && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">重新选择</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {!imageLoaded ? (
          /* Upload State */
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-500 rounded-full text-sm font-medium mb-4">
                <Heart className="w-3.5 h-3.5" />
                免费好用的小工具
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
                  小杨的证件照处理站
                </span>
              </h2>
              <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                支持一寸、二寸、护照等多种标准尺寸
                <br className="hidden sm:block" />
                所有处理均在浏览器本地完成，保护你的隐私哦~
              </p>
            </div>
            <UploadZone onFileSelect={handleFileSelect} />

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full animate-slide-up">
              <div className="cute-card bg-white rounded-2xl p-5 shadow-sm border border-pink-100/60">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center mb-3">
                  <Crop className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">随心裁剪</h3>
                <p className="text-xs text-gray-400">拖拽裁剪框，轻松调整位置和大小</p>
              </div>
              <div className="cute-card bg-white rounded-2xl p-5 shadow-sm border border-pink-100/60">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">隐私安全</h3>
                <p className="text-xs text-gray-400">照片不上传服务器，放心使用~</p>
              </div>
              <div className="cute-card bg-white rounded-2xl p-5 shadow-sm border border-pink-100/60">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">自由缩放</h3>
                <p className="text-xs text-gray-400">自定义输出照片的宽高像素大小</p>
              </div>
            </div>
          </div>
        ) : (
          /* Editor State */
          <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
            {/* Left: Canvas */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm border border-pink-100/60 p-4">
                <CropEditor
                  photoSize={photoSize}
                  cropArea={cropArea}
                  setCropArea={setCropArea}
                  canvasSize={canvasSize}
                  imageLoaded={imageLoaded}
                />
              </div>
            </div>

            {/* Right: Controls */}
            <div className="w-full lg:w-72 space-y-3 lg:sticky lg:top-20 lg:self-start">
              {/* Preview & Download */}
              <div className="bg-white rounded-2xl shadow-sm border border-pink-100/60 p-4">
                <PreviewPanel
                  previewUrl={previewUrl}
                  photoSize={photoSize}
                  outputW={outputW}
                  outputH={outputH}
                  onDownload={handleDownload}
                  onGenerate={handleGenerate}
                />
              </div>

              {/* Output size control */}
              <div className="bg-white rounded-2xl shadow-sm border border-pink-100/60 p-4">
                <OutputSizeControl
                  photoSize={photoSize}
                  outputW={outputW}
                  outputH={outputH}
                  onChange={handleOutputSizeChange}
                />
              </div>

              {/* Size selector */}
              <div className="bg-white rounded-2xl shadow-sm border border-pink-100/60 p-4">
                <SizeSelector selected={photoSize} onChange={handleSizeChange} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-pink-300">
        <p>Made with <Heart className="w-3 h-3 inline text-pink-400" /> by 小杨 · 所有处理均在浏览器本地完成</p>
      </footer>
    </div>
  );
}

export default App;
