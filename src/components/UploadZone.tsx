import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in">
      <div
        className={`drop-zone w-full max-w-lg border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging ? 'active border-pink-400 bg-pink-50' : 'border-pink-200 hover:border-pink-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center mb-6">
          {isDragging ? (
            <ImageIcon className="w-10 h-10 text-pink-400 animate-pulse" />
          ) : (
            <Upload className="w-10 h-10 text-pink-400" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {isDragging ? '松开就好啦~' : '上传你的照片'}
        </h3>
        <p className="text-sm text-gray-400 text-center mb-4">
          拖拽照片到这里，或者点击选择文件
        </p>
        <div className="flex gap-2 text-xs text-pink-300">
          <span className="px-2.5 py-1 bg-pink-50 rounded-full">JPG</span>
          <span className="px-2.5 py-1 bg-pink-50 rounded-full">PNG</span>
          <span className="px-2.5 py-1 bg-pink-50 rounded-full">WEBP</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-300"></div>
          <span>本地处理，不上传服务器</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-300"></div>
          <span>支持多种证件照尺寸</span>
        </div>
      </div>
    </div>
  );
};
