import React from 'react';
import { Grid3X3, Check, Star } from 'lucide-react';
import { DrawnNumber } from '../types';

interface NumberMatrixBoardProps {
  maxNumber: number;
  drawnNumbers: DrawnNumber[];
  isProjectorMode: boolean;
}

export const NumberMatrixBoard: React.FC<NumberMatrixBoardProps> = ({
  maxNumber,
  drawnNumbers,
  isProjectorMode,
}) => {
  // Map number to DrawnNumber info
  const drawnMap = new Map<number, DrawnNumber>();
  drawnNumbers.forEach((d) => drawnMap.set(d.number, d));

  const drawnCount = drawnNumbers.length;
  const remainingCount = maxNumber - drawnCount;

  return (
    <div
      id="number-matrix-board"
      className="rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-[#E8D4AE] shadow-lg p-5 md:p-6"
    >
      {/* Board Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
            <Grid3X3 className="w-4 h-4" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-[#4A0D18]">
            全號碼總覽看板 (1 ~ {maxNumber})
          </h3>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-amber-800">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 inline-block shadow-xs" />
            已開出: {drawnCount}
          </span>
          <span className="flex items-center gap-1 text-stone-500">
            <span className="w-3 h-3 rounded-full bg-stone-200 inline-block border border-stone-300" />
            未開出: {remainingCount}
          </span>
        </div>
      </div>

      {/* Grid of all numbers */}
      <div className="mt-4 grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2 md:gap-2.5">
        {Array.from({ length: maxNumber }, (_, i) => i + 1).map((num) => {
          const drawnInfo = drawnMap.get(num);
          const isDrawn = !!drawnInfo;
          const isSpecial = drawnInfo?.isSpecial ?? false;

          return (
            <div
              key={`matrix-num-${num}`}
              className={`relative rounded-xl flex flex-col items-center justify-center transition-all duration-300 select-none ${
                isProjectorMode ? 'h-12 md:h-14' : 'h-10 md:h-12'
              } ${
                isDrawn
                  ? isSpecial
                    ? 'bg-gradient-to-br from-[#E60026] to-[#800010] text-white shadow-md border-2 border-rose-300 scale-105 z-10'
                    : 'bg-gradient-to-br from-[#F5D061] via-[#D4AF37] to-[#A07010] text-[#331C02] shadow-md border-2 border-amber-200 scale-105 z-10'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
              }`}
            >
              {/* Special indicator icon */}
              {isSpecial && (
                <div className="absolute -top-1.5 -right-1 bg-yellow-400 text-amber-950 p-0.5 rounded-full shadow-xs">
                  <Star className="w-2.5 h-2.5 fill-current" />
                </div>
              )}

              {/* Order badge if drawn */}
              {isDrawn && !isSpecial && (
                <span className="absolute -top-1.5 -left-1 px-1 py-0.2 rounded-full text-[9px] font-black bg-amber-950 text-amber-200 shadow-2xs">
                  #{drawnInfo.order}
                </span>
              )}

              <span
                className={`font-black tracking-tight ${
                  isProjectorMode ? 'text-lg md:text-xl' : 'text-base md:text-lg'
                }`}
                style={{
                  fontFamily: "'Cinzel', 'Noto Serif TC', serif",
                  textShadow: isDrawn && !isSpecial ? '0 1px 1px rgba(255,255,255,0.7)' : undefined,
                }}
              >
                {num}
              </span>

              {/* Subtle tick checkmark for drawn regular balls */}
              {isDrawn && !isSpecial && (
                <div className="absolute bottom-0.5 right-1 opacity-75">
                  <Check className="w-2.5 h-2.5 text-[#331C02]" strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
