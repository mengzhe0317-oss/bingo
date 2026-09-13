import React from 'react';
import { ArrowUpDown, Trash2, CheckCircle2, Award } from 'lucide-react';
import { DrawnNumber, SortMode } from '../types';
import { LottoBall } from './LottoBall';

interface DrawnBallsListProps {
  drawnNumbers: DrawnNumber[];
  sortMode: SortMode;
  onToggleSortMode: () => void;
  onRemoveNumber: (id: string) => void;
  targetCount: number;
  hasSpecialNumber: boolean;
  isProjectorMode: boolean;
}

export const DrawnBallsList: React.FC<DrawnBallsListProps> = ({
  drawnNumbers,
  sortMode,
  onToggleSortMode,
  onRemoveNumber,
  targetCount,
  hasSpecialNumber,
  isProjectorMode,
}) => {
  // Separate regular balls and special balls
  const regularBalls = drawnNumbers.filter((n) => !n.isSpecial);
  const specialBalls = drawnNumbers.filter((n) => n.isSpecial);

  // Sorting regular balls if requested
  const displayRegularBalls = [...regularBalls].sort((a, b) => {
    if (sortMode === 'value') {
      return a.number - b.number;
    }
    return a.order - b.order;
  });

  // Calculate remaining empty slots
  const remainingRegularSlots = Math.max(0, targetCount - regularBalls.length);

  return (
    <div
      id="drawn-balls-list-section"
      className="rounded-3xl bg-white/90 backdrop-blur-sm border-2 border-[#E8D4AE] shadow-lg p-5 md:p-6 transition-all"
    >
      {/* Header bar of drawn list */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#4A0D18] flex items-center gap-2">
              <span>已開出號碼獎號區</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                {regularBalls.length}/{targetCount}
                {hasSpecialNumber && specialBalls.length > 0 ? ` + ${specialBalls.length}特別號` : ''}
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              現場核對請以本區域顯示的號碼為準
            </p>
          </div>
        </div>

        {/* Sort toggle */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-sort"
            onClick={onToggleSortMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 hover:border-amber-300 transition-colors cursor-pointer"
            title="切換排序規則"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortMode === 'order' ? '目前：開獎順序' : '目前：由小到大'}</span>
          </button>
        </div>
      </div>

      {/* Balls Tray / Showcase */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 min-h-[110px]">
        {drawnNumbers.length === 0 ? (
          <div className="text-center py-6 text-stone-400 font-medium">
            暫無開出號碼，請在下方錄入首個幸運號
          </div>
        ) : (
          <>
            {/* Regular Balls */}
            {displayRegularBalls.map((item, idx) => (
              <div key={item.id} className="group relative flex flex-col items-center">
                <LottoBall
                  number={item.number}
                  isSpecial={false}
                  size={isProjectorMode ? 'xl' : 'lg'}
                  orderLabel={sortMode === 'order' ? `第${item.order}球` : `#${idx + 1}`}
                />
                {/* Remove button (hidden in pure projector mode, visible on hover) */}
                {!isProjectorMode && (
                  <button
                    onClick={() => onRemoveNumber(item.id)}
                    className="mt-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title={`刪除號碼 ${item.number}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: remainingRegularSlots }).map((_, idx) => (
              <div
                key={`empty-slot-${idx}`}
                className="flex flex-col items-center justify-center"
              >
                <span className="mb-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-stone-400 bg-stone-100">
                  待開出
                </span>
                <div
                  className={`rounded-full border-2 border-dashed border-amber-300/80 bg-amber-50/50 flex items-center justify-center text-amber-400 font-bold ${
                    isProjectorMode ? 'w-24 h-24 text-2xl' : 'w-16 h-16 text-lg'
                  }`}
                >
                  ?
                </div>
              </div>
            ))}

            {/* Special Number Divider & Balls */}
            {hasSpecialNumber && (
              <div className="flex items-center gap-3 pl-2 md:pl-4 border-l-2 border-stone-200">
                {specialBalls.length > 0 ? (
                  specialBalls.map((item) => (
                    <div key={item.id} className="group relative flex flex-col items-center">
                      <LottoBall
                        number={item.number}
                        isSpecial={true}
                        size={isProjectorMode ? 'xl' : 'lg'}
                        orderLabel="特別號"
                      />
                      {!isProjectorMode && (
                        <button
                          onClick={() => onRemoveNumber(item.id)}
                          className="mt-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title={`刪除特別號 ${item.number}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="mb-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200">
                      特別號
                    </span>
                    <div
                      className={`rounded-full border-2 border-dashed border-rose-300 bg-rose-50/40 flex items-center justify-center text-rose-300 font-bold ${
                        isProjectorMode ? 'w-24 h-24 text-2xl' : 'w-16 h-16 text-lg'
                      }`}
                    >
                      ★
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Completion congratulations banner if all target balls drawn */}
      {regularBalls.length >= targetCount && (
        <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-400/40 flex items-center justify-center gap-2 text-[#6B1222] font-bold text-sm md:text-base animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-amber-600" />
          <span>本輪大樂透號碼全部開出！請各位貴賓核對手中號碼！</span>
        </div>
      )}
    </div>
  );
};
