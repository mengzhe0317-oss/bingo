import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  drawnCount: number;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  drawnCount,
}) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-white border-2 border-rose-300 shadow-2xl p-6 text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer transition-colors"
          title="關閉視窗 (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-stone-900">
          確認清空本輪開獎？
        </h3>
        <p className="text-sm text-stone-500 mt-2 leading-relaxed">
          目前已開出 <span className="font-bold text-rose-600">{drawnCount}</span> 個號碼。
          重設後所有已開出號碼將全部清空，開啟全新一輪大樂透！
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50 cursor-pointer transition-colors"
          >
            取消保留
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>確認清空</span>
          </button>
        </div>
      </div>
    </div>
  );
};
