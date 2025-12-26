'use client';

import React from 'react';

interface ImagePlaceholderProps {
  width: number;
  height: number;
  label?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export default function ImagePlaceholder({
  width,
  height,
  label = 'Image',
  variant = 'light',
  className = '',
}: ImagePlaceholderProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center ${className}`}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        border: `2px dashed ${isDark ? 'rgba(212, 175, 55, 0.4)' : 'rgba(212, 175, 55, 0.6)'}`,
      }}
    >
      {/* Icon */}
      <svg
        className={`w-12 h-12 mb-3 ${isDark ? 'text-[#d4af37]/40' : 'text-[#d4af37]/60'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>

      {/* Label */}
      <span
        className={`text-sm font-semibold mb-1 ${
          isDark ? 'text-white/60' : 'text-gray-500'
        }`}
        style={{ fontFamily: 'var(--font-ibm)' }}
      >
        {label}
      </span>

      {/* Dimensions */}
      <span
        className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        {width} × {height}px
      </span>
    </div>
  );
}
