import React from 'react';

interface LottoBallProps {
  number: number;
  isSpecial?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  orderLabel?: string;
  isNew?: boolean;
  onClick?: () => void;
  className?: string;
}

export const LottoBall: React.FC<LottoBallProps> = ({
  number,
  isSpecial = false,
  size = 'lg',
  orderLabel,
  isNew = false,
  onClick,
  className = '',
}) => {
  // Dimension and font scale maps
  const sizeClasses = {
    sm: 'w-9 h-9 text-sm font-bold',
    md: 'w-12 h-12 text-lg font-bold',
    lg: 'w-16 h-16 text-2xl font-black',
    xl: 'w-24 h-24 text-4xl font-black',
    giant: 'w-36 h-36 md:w-44 md:h-44 text-5xl md:text-7xl font-black',
  }[size];

  // Metallic 3D gradients and inner reflections
  const ballBg = isSpecial
    ? 'bg-gradient-to-br from-[#FF6B6B] via-[#E60026] to-[#800010] shadow-[0_12px_28px_rgba(230,0,38,0.45),inset_0_4px_8px_rgba(255,255,255,0.7),inset_0_-8px_16px_rgba(0,0,0,0.5)] border-2 border-[#FFD2D7]'
    : 'bg-gradient-to-br from-[#FCE8B3] via-[#E5B540] to-[#9E6D08] shadow-[0_12px_24px_rgba(180,125,20,0.35),inset_0_4px_8px_rgba(255,255,255,0.8),inset_0_-8px_16px_rgba(80,50,0,0.55)] border-2 border-[#FFF2CC]';

  const textColor = isSpecial ? 'text-white' : 'text-[#3E2304]';

  // Inner circular badge for official lotto ball look
  const innerDiscSize = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-11 h-11 text-xl',
    xl: 'w-16 h-16 text-3xl',
    giant: 'w-24 h-24 md:w-30 md:h-30 text-4xl md:text-5xl',
  }[size];

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      {orderLabel && (
        <span
          className={`mb-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors ${
            isSpecial
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-amber-100 text-amber-900 border border-amber-200/80'
          }`}
        >
          {orderLabel}
        </span>
      )}

      <div
        onClick={onClick}
        className={`relative rounded-full flex items-center justify-center transition-all duration-300 ${sizeClasses} ${ballBg} ${
          onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        } ${isNew ? 'animate-bounce ring-4 ring-amber-400/50' : ''}`}
        style={{
          boxSizing: 'border-box',
          textShadow: isSpecial ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 1px rgba(255,255,255,0.6)',
        }}
      >
        {/* Top 3D highlight specular gloss */}
        <div className="absolute top-1.5 left-2 w-1/3 h-1/4 rounded-full bg-gradient-to-b from-white/70 to-white/0 pointer-events-none blur-[0.5px]" />

        {/* Center white disc with number for clear contrast */}
        <div
          className={`rounded-full bg-white/95 shadow-inner flex items-center justify-center font-black ${innerDiscSize} ${textColor}`}
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.25), 0 1px 2px rgba(255,255,255,0.8)',
            fontFamily: "'Cinzel', 'Noto Serif TC', serif",
          }}
        >
          {number}
        </div>

        {/* Special star badge */}
        {isSpecial && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-300 to-yellow-500 text-amber-950 text-[10px] md:text-xs font-black px-1.5 py-0.5 rounded-full shadow-md border border-white">
            ★ 特別號
          </div>
        )}
      </div>
    </div>
  );
};
