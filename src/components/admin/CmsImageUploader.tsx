"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

interface CmsImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  aspectClass?: string;
}

function compressImage(file: File, maxDim = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas error"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function CmsImageUploader({
  label,
  value,
  onChange,
  aspectClass = "h-28",
}: CmsImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setIsProcessing(true);
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-[#211D1A] dark:text-[#F5EFE8]">
        {label}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`border-2 border-dashed rounded-lg p-3.5 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-[#D49542] bg-[#D49542]/10"
            : "border-[#E8DFC8] dark:border-[#3A3128] bg-white/50 dark:bg-[#1E1A16]/60 hover:border-[#D49542]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="hidden"
        />

        {isProcessing ? (
          <div className="py-3 flex items-center justify-center gap-2 text-xs text-[#D49542]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Compressing & preparing image...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs text-[#80644B] dark:text-[#A39789]">
            <UploadCloud className="w-4 h-4 text-[#D49542] shrink-0" />
            <span>ছবি ড্র্যাগ করে দিন অথবা ক্লিক করে আপলোড করুন</span>
          </div>
        )}
      </div>

      {value && (
        <div className={`relative w-full ${aspectClass} bg-black/5 dark:bg-black/30 rounded-lg overflow-hidden border border-[#E8DFC8] dark:border-[#2C2620] group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              title="Remove image from database"
              className="px-2 py-1 bg-red-600/90 hover:bg-red-700 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-sm"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
          <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
            <ImageIcon className="w-2.5 h-2.5 text-[#D49542]" />
            <span>Uploaded</span>
          </span>
        </div>
      )}
    </div>
  );
}
