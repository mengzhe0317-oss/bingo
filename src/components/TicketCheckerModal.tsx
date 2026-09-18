import React, { useState, useEffect } from 'react';
import { X, Ticket, CheckCircle, Award, Sparkles, Plus, Trash2 } from 'lucide-react';
import { DrawnNumber } from '../types';

interface TicketCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawnNumbers: DrawnNumber[];
  maxNumber: number;
}

export const TicketCheckerModal: React.FC<TicketCheckerModalProps> = ({
  isOpen,
  onClose,
  drawnNumbers,
  maxNumber,
}) => {
  const [ticketInput, setTicketInput] = useState<string>('');
  const [ticketNumbers, setTicketNumbers] = useState<number[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);

  // Support ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const regularDrawnSet = new Set(
    drawnNumbers.filter((d) => !d.isSpecial).map((d) => d.number)
  );
  const specialDrawnSet = new Set(
    drawnNumbers.filter((d) => d.isSpecial).map((d) => d.number)
  );

  const handleAddNumber = (num: number) => {
    if (ticketNumbers.includes(num)) {
      setInputError(`號碼 ${num} 已在卡片中了`);
      return;
    }
    if (ticketNumbers.length >= 8) {
      setInputError('一張彩券最多錄入 8 個自選號碼');
      return;
    }
    setTicketNumbers([...ticketNumbers, num]);
    setInputError(null);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(ticketInput.trim(), 10);
    if (isNaN(num) || num < 1 || num > maxNumber) {
      setInputError(`請輸入 1 至 ${maxNumber} 之間的號碼`);
      return;
    }
    handleAddNumber(num);
    setTicketInput('');
  };

  const handleRemoveNumber = (num: number) => {
    setTicketNumbers(ticketNumbers.filter((n) => n !== num));
  };

  const handleClear = () => {
    setTicketNumbers([]);
    setInputError(null);
  };

  // Evaluate matches
  const matchedRegular = ticketNumbers.filter((n) => regularDrawnSet.has(n));
  const matchedSpecial = ticketNumbers.filter((n) => specialDrawnSet.has(n));

  // Determine prize rank
  let prizeText = '尚未中獎，繼續加油！';
  let prizeClass = 'bg-stone-100 text-stone-700 border-stone-200';

  if (matchedRegular.length === 6) {
    prizeText = '👑 頭獎！6個正選全中！恭喜獲得婚禮終極大獎！';
    prizeClass = 'bg-amber-100 text-amber-900 border-amber-400 font-black text-lg';
  } else if (matchedRegular.length === 5 && matchedSpecial.length > 0) {
    prizeText = '🥈 貳獎！中 5 正碼 + 1 特別號！手氣爆棚！';
    prizeClass = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
  } else if (matchedRegular.length === 5) {
    prizeText = '🥉 參獎！命中 5 個正選號碼！';
    prizeClass = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
  } else if (matchedRegular.length === 4) {
    prizeText = '🎉 肆獎！命中 4 個正選號碼！';
    prizeClass = 'bg-rose-50 text-rose-800 border-rose-200 font-semibold';
  } else if (matchedRegular.length === 3 || (matchedRegular.length === 2 && matchedSpecial.length > 0)) {
    prizeText = '✨ 普獎！喜結良緣幸運獎一份！';
    prizeClass = 'bg-green-50 text-green-800 border-green-200 font-semibold';
  } else if (matchedSpecial.length > 0) {
    prizeText = '🌟 幸運特別獎！擊中特別號！';
    prizeClass = 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37] shadow-2xl overflow-hidden">
        {/* Modal Header - Fixed Top */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-[#FFFDF9] shrink-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500 text-amber-950 font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#4A0D18]">
                現場賓客彩券對獎助手
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500">
                輸入賓客彩券上的數字，系統自動比對並判定中獎等級
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 transition-all cursor-pointer"
            title="關閉視窗 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Input number row */}
          <form onSubmit={handleManualAdd} className="flex gap-2">
            <input
              type="number"
              min={1}
              max={maxNumber}
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder={`輸入號碼 (1 - ${maxNumber})`}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-stone-300 focus:border-amber-500 outline-none text-base font-semibold bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-sm flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新增</span>
            </button>
          </form>

          {inputError && (
            <p className="text-xs text-rose-600 font-semibold">{inputError}</p>
          )}

          {/* Current ticket numbers list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-600">
                賓客彩券號碼 ({ticketNumbers.length} 個)：
              </span>
              {ticketNumbers.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>清空重填</span>
                </button>
              )}
            </div>

            <div className="min-h-[56px] p-2.5 rounded-2xl bg-stone-100/70 border border-stone-200 flex flex-wrap gap-2 items-center">
              {ticketNumbers.length === 0 ? (
                <span className="text-xs text-stone-400 mx-auto">
                  請在上方輸入號碼或點擊比對
                </span>
              ) : (
                ticketNumbers.map((n) => {
                  const isRegularHit = regularDrawnSet.has(n);
                  const isSpecialHit = specialDrawnSet.has(n);

                  return (
                    <span
                      key={`ticket-num-${n}`}
                      onClick={() => handleRemoveNumber(n)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm cursor-pointer shadow-xs transition-all ${
                        isRegularHit
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 ring-2 ring-amber-300 animate-pulse'
                          : isSpecialHit
                          ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                          : 'bg-white text-stone-700 border border-stone-300 hover:bg-rose-50'
                      }`}
                      title="點擊移除"
                    >
                      <span>{n}</span>
                      {isRegularHit && <CheckCircle className="w-3.5 h-3.5 text-amber-950" />}
                      {isSpecialHit && <Sparkles className="w-3.5 h-3.5 text-yellow-200" />}
                      <X className="w-3 h-3 opacity-60 hover:opacity-100 ml-0.5" />
                    </span>
                  );
                })
              )}
            </div>
          </div>

          {/* Prize Evaluation Result Box */}
          {ticketNumbers.length > 0 && (
            <div className={`p-4 rounded-2xl border ${prizeClass}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-sm">核對判定結果：</span>
              </div>
              <p className="text-sm md:text-base font-bold">{prizeText}</p>
              <div className="mt-2 text-xs flex gap-4 opacity-85">
                <span>中正碼: {matchedRegular.length} 個</span>
                <span>中特別號: {matchedSpecial.length} 個</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Fixed Bottom */}
        <div className="px-5 py-3.5 border-t border-stone-200/90 bg-[#FAF7F2] flex justify-end shrink-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            完成關閉
          </button>
        </div>
      </div>
    </div>
  );
};

