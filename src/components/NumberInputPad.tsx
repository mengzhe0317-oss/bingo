import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Dices,
  RotateCcw,
  Star,
  AlertCircle,
  HelpCircle,
  Hash,
  EyeOff,
} from 'lucide-react';
import { DrawnNumber } from '../types';

interface NumberInputPadProps {
  maxNumber: number;
  drawnNumbers: DrawnNumber[];
  onAddNumber: (num: number, isSpecial: boolean) => boolean;
  onRandomRoll: (isSpecial: boolean) => void;
  onUndoLast: () => void;
  isRolling: boolean;
  hasSpecialNumber: boolean;
  targetCount: number;
  onOpenSettings?: () => void;
  onHidePad?: () => void;
}

export const NumberInputPad: React.FC<NumberInputPadProps> = ({
  maxNumber,
  drawnNumbers,
  onAddNumber,
  onRandomRoll,
  onUndoLast,
  isRolling,
  hasSpecialNumber,
  targetCount,
  onOpenSettings,
  onHidePad,
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [isSpecial, setIsSpecial] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'quickpad'>('input');
  const inputRef = useRef<HTMLInputElement>(null);

  const drawnSet = new Set(drawnNumbers.map((d) => d.number));
  const regularCount = drawnNumbers.filter((d) => !d.isSpecial).length;
  const hasDrawnSpecial = drawnNumbers.some((d) => d.isSpecial);

  // Auto-switch isSpecial checkbox if regular quota is filled but special ball is needed
  useEffect(() => {
    if (regularCount >= targetCount && hasSpecialNumber && !hasDrawnSpecial) {
      setIsSpecial(true);
    }
  }, [regularCount, targetCount, hasSpecialNumber, hasDrawnSpecial]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const num = parseInt(inputVal.trim(), 10);
    if (isNaN(num)) {
      setErrorMessage('請輸入有效數字');
      return;
    }

    if (num < 1 || num > maxNumber) {
      setErrorMessage(`請輸入 1 至 ${maxNumber} 之間的號碼`);
      return;
    }

    if (drawnSet.has(num)) {
      setErrorMessage(`號碼 ${num} 已經開出過了，不能重複錄入！`);
      return;
    }

    const success = onAddNumber(num, isSpecial);
    if (success) {
      setInputVal('');
      setErrorMessage(null);
      // keep focus on input for fast consecutive typing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleQuickTapNumber = (num: number) => {
    if (drawnSet.has(num) || isRolling) return;
    setErrorMessage(null);
    onAddNumber(num, isSpecial);
  };

  return (
    <div
      id="number-input-controller"
      className="rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-[#E8D4AE] shadow-xl p-5 md:p-6"
    >
      {/* Tab Switcher & Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#4A0D18]">
              主持人 / 現場號碼錄入控制台
            </h3>
            <p className="text-xs text-stone-500">
              抽中號碼後在此輸入或點擊，大螢幕即時同步揭曉
            </p>
          </div>
        </div>

        {/* Mode Toggle & Quick Hide Controller */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('input')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'input'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              鍵盤輸入
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quickpad')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'quickpad'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              觸控速選 (1~{maxNumber})
            </button>
          </div>

          {onHidePad && (
            <button
              type="button"
              onClick={onHidePad}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-300/80 text-xs font-semibold transition-all cursor-pointer"
              title="隱藏本控制台（可於上方導覽列或設定中隨時重新開啟）"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">隱藏控制台</span>
            </button>
          )}
        </div>
      </div>

      {/* Error / Warning Alert if any */}
      {errorMessage && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Input Form */}
      {activeTab === 'input' ? (
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Number text field */}
            <div className="relative flex-1">
              <input
                id="input-drawn-number"
                ref={inputRef}
                type="number"
                min={1}
                max={maxNumber}
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={`輸入號碼 (1 - ${maxNumber})`}
                disabled={isRolling}
                className="w-full text-xl md:text-2xl font-bold px-4 py-3.5 rounded-2xl border-2 border-stone-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all placeholder:text-stone-400 placeholder:font-normal placeholder:text-base bg-stone-50/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                按 Enter 送出
              </span>
            </div>

            {/* Special Ball Checkbox */}
            {hasSpecialNumber && (
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer select-none hover:bg-amber-100/70 transition-colors">
                <input
                  type="checkbox"
                  id="chk-special-ball"
                  checked={isSpecial}
                  onChange={(e) => setIsSpecial(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                />
                <span className="text-xs md:text-sm font-semibold text-rose-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  設為特別號
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-submit-number"
              disabled={isRolling || !inputVal.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#996515] hover:from-[#E5BF45] hover:to-[#A77017] text-white font-bold text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>錄入開獎</span>
            </button>
          </div>
        </form>
      ) : (
        /* Quick Tap Matrix Pad */
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-500 font-medium">
              點擊數字直接開出：
            </span>
            {hasSpecialNumber && (
              <label className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSpecial}
                  onChange={(e) => setIsSpecial(e.target.checked)}
                  className="accent-rose-600 rounded cursor-pointer"
                />
                <span>作為特別號錄入</span>
              </label>
            )}
          </div>
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto p-1.5 bg-stone-50 rounded-2xl border border-stone-200">
            {Array.from({ length: maxNumber }, (_, i) => i + 1).map((n) => {
              const isDrawn = drawnSet.has(n);
              return (
                <button
                  key={`quick-tap-${n}`}
                  onClick={() => handleQuickTapNumber(n)}
                  disabled={isDrawn || isRolling}
                  className={`h-9 rounded-lg font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                    isDrawn
                      ? 'bg-amber-100/70 text-amber-800/40 border border-amber-200/50 line-through cursor-not-allowed'
                      : 'bg-white hover:bg-amber-400 hover:text-amber-950 text-stone-800 border border-stone-200 shadow-2xs hover:scale-105 active:scale-95'
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Auxiliary Action Bar: Random Roll, Undo */}
      <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Random Roll Button for digital draw */}
          <button
            type="button"
            id="btn-random-roll"
            onClick={() => onRandomRoll(isSpecial)}
            disabled={isRolling || drawnNumbers.length >= maxNumber}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs md:text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="電腦隨機搖出一顆未開出的幸運球"
          >
            <Dices className="w-4 h-4 text-amber-700" />
            <span>{isRolling ? '搖獎中...' : '電腦隨機搖號'}</span>
          </button>

          <span className="text-xs text-stone-400 hidden sm:inline">
            （可現場手搖抽球手工錄入，也可電腦隨機搖號）
          </span>
        </div>

        {/* Undo Last Button */}
        <button
          type="button"
          id="btn-undo-last"
          onClick={onUndoLast}
          disabled={drawnNumbers.length === 0 || isRolling}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-stone-200 hover:border-rose-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="撤銷上一次錄入的號碼"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>撤銷上一球</span>
        </button>
      </div>
    </div>
  );
};
