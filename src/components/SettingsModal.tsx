import React, { useState, useEffect } from 'react';
import { X, Settings, Check, KeyRound, LayoutGrid, EyeOff, SlidersHorizontal } from 'lucide-react';
import { WeddingConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
  onSaveConfig: (newConfig: WeddingConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<WeddingConfig>({ ...config });
  const [presetInput, setPresetInput] = useState('');
  const [presetError, setPresetError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...config });
      setPresetInput(config.presetNumbers && config.presetNumbers.length > 0 ? config.presetNumbers.join(', ') : '');
      setPresetError(null);
    }
  }, [isOpen, config]);

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

  const handleTogglePresetNumber = (num: number) => {
    const current = formData.presetNumbers || [];
    if (current.includes(num)) {
      const next = current.filter((n) => n !== num);
      setFormData({ ...formData, presetNumbers: next });
      setPresetInput(next.join(', '));
      setPresetError(null);
    } else {
      if (current.length >= 10) {
        setPresetError('最多預設 10 個號碼');
        return;
      }
      const next = [...current, num];
      setFormData({ ...formData, presetNumbers: next });
      setPresetInput(next.join(', '));
      setPresetError(null);
    }
  };

  const handlePresetTextChange = (text: string) => {
    setPresetInput(text);
    setPresetError(null);

    if (!text.trim()) {
      setFormData({ ...formData, presetNumbers: [] });
      return;
    }

    const parts = text.split(/[,，\s、]+/).filter(Boolean);
    const nums: number[] = [];
    const seen = new Set<number>();

    for (const part of parts) {
      const n = parseInt(part, 10);
      if (isNaN(n) || n < 1 || n > formData.maxNumber) {
        setPresetError(`請輸入 1 至 ${formData.maxNumber} 的數字`);
        return;
      }
      if (!seen.has(n)) {
        seen.add(n);
        nums.push(n);
      }
    }

    setFormData({ ...formData, presetNumbers: nums });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37] shadow-2xl overflow-hidden">
        {/* Header - Fixed Top */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-[#FFFDF9] shrink-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shadow-2xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#4A0D18]">
                婚禮與大樂透規則設定
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500">
                個性化新人名字、號碼球總數及玩法規則
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

        {/* Form Body - Scrollable Area */}
        <form
          id="settings-modal-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm"
        >
          {/* Couple Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              新人名稱 / 標題
            </label>
            <input
              type="text"
              value={formData.coupleTitle}
              onChange={(e) =>
                setFormData({ ...formData, coupleTitle: e.target.value })
              }
              placeholder="例如：👰 Vivian & 🤵 Kevin"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 outline-none font-semibold text-stone-900 bg-white"
              required
            />
          </div>

          {/* Event Subtitle */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              活動副標題
            </label>
            <input
              type="text"
              value={formData.eventSubtitle}
              onChange={(e) =>
                setFormData({ ...formData, eventSubtitle: e.target.value })
              }
              placeholder="例如：幸福大樂透 · 浪漫開獎"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 outline-none text-stone-900 bg-white"
            />
          </div>

          {/* Wedding Date */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              婚禮日期 / 紀念文字
            </label>
            <input
              type="text"
              value={formData.weddingDate}
              onChange={(e) =>
                setFormData({ ...formData, weddingDate: e.target.value })
              }
              placeholder="例如：2026.09.28 喜結良緣"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 outline-none text-stone-900 bg-white"
            />
          </div>

          {/* Max Ball Range & Target Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                號碼最大值 (1 ~ N)
              </label>
              <select
                value={formData.maxNumber}
                onChange={(e) =>
                  setFormData({ ...formData, maxNumber: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 outline-none bg-white font-semibold text-stone-900"
              >
                <option value={36}>1 ~ 36 (大樂透36)</option>
                <option value={42}>1 ~ 42</option>
                <option value={49}>1 ~ 49 (標準台灣大樂透)</option>
                <option value={60}>1 ~ 60</option>
                <option value={80}>1 ~ 80 (賓果樂透)</option>
                <option value={100}>1 ~ 100 (百數大抽獎)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                正選號碼目標數
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={formData.targetCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetCount: parseInt(e.target.value, 10) || 6,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 outline-none font-semibold text-stone-900 bg-white"
              />
            </div>
          </div>

          {/* Preset Numbers Configuration (Backoffice Secret) */}
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-300/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <KeyRound className="w-4 h-4 text-amber-700" />
                <span>後台預設開出號碼（預定幸運號）</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                <EyeOff className="w-3 h-3 text-amber-700" />
                <span>保密隱藏 · 已設 {(formData.presetNumbers || []).length} 個</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-normal">
              此號碼僅於<strong className="text-amber-950 font-bold">後台保密</strong>，前台大螢幕不會洩漏。電腦搖號時自動依序開出！
            </p>

            <input
              type="text"
              value={presetInput}
              onChange={(e) => handlePresetTextChange(e.target.value)}
              placeholder="例如：3, 21, 4, 11, 5（逗號或空格分隔）"
              className="w-full px-3 py-1.5 rounded-xl border border-amber-300 focus:border-amber-600 outline-none text-xs font-bold bg-white text-stone-900"
            />

            {presetError && (
              <p className="text-xs text-rose-600 font-semibold">{presetError}</p>
            )}

            {/* Quick click numbers selector */}
            <div className="pt-0.5">
              <span className="text-[11px] text-stone-600 font-medium block mb-1">
                點擊數字快速加入或取消（1~{formData.maxNumber}）：
              </span>
              <div className="max-h-24 overflow-y-auto grid grid-cols-7 sm:grid-cols-9 gap-1 p-1.5 bg-white/90 rounded-xl border border-amber-200/80">
                {Array.from({ length: formData.maxNumber }, (_, i) => i + 1).map((num) => {
                  const isSelected = (formData.presetNumbers || []).includes(num);
                  return (
                    <button
                      key={`preset-ball-${num}`}
                      type="button"
                      onClick={() => handleTogglePresetNumber(num)}
                      className={`h-6 sm:h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-amber-950 font-black shadow-xs ring-1 ring-amber-600'
                          : 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Toggle options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Special Number Toggle */}
            <label className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors">
              <div>
                <span className="font-bold text-stone-900 block text-xs">
                  開啟「特別號」玩法
                </span>
                <span className="text-[10px] text-stone-500">加開 1 顆特別號碼</span>
              </div>
              <input
                type="checkbox"
                checked={formData.hasSpecialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, hasSpecialNumber: e.target.checked })
                }
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
              />
            </label>

            {/* Sound Effect Toggle */}
            <label className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors">
              <div>
                <span className="font-bold text-stone-900 block text-xs">
                  啟用舞台音頻音效
                </span>
                <span className="text-[10px] text-stone-500">開獎鐘聲、搖球歡呼音效</span>
              </div>
              <input
                type="checkbox"
                checked={formData.soundEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, soundEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
              />
            </label>

            {/* Matrix Board Display Toggle */}
            <label className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors">
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 block text-xs">
                    顯示全號碼總覽看板
                  </span>
                  <span className="text-[10px] text-stone-500">顯示/隱藏底部 1~N 看板</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.showNumberMatrix ?? false}
                onChange={(e) =>
                  setFormData({ ...formData, showNumberMatrix: e.target.checked })
                }
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
              />
            </label>

            {/* Controller / NumberInputPad Display Toggle */}
            <label className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 block text-xs">
                    顯示錄入控制台
                  </span>
                  <span className="text-[10px] text-stone-500">顯示/隱藏現場錄入面板</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.showInputPad ?? true}
                onChange={(e) =>
                  setFormData({ ...formData, showInputPad: e.target.checked })
                }
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
              />
            </label>
          </div>
        </form>

        {/* Modal Footer - Fixed Bottom */}
        <div className="px-5 py-3.5 border-t border-stone-200/90 bg-[#FAF7F2] flex items-center justify-between shrink-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200/70 font-semibold cursor-pointer border border-stone-300/80 transition-all text-xs sm:text-sm"
          >
            取消 / 退出
          </button>
          <button
            type="submit"
            form="settings-modal-form"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-amber-950 font-bold shadow-md hover:shadow-lg hover:from-amber-400 hover:to-amber-500 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-xs sm:text-sm"
          >
            <Check className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>確認並儲存</span>
          </button>
        </div>
      </div>
    </div>
  );
};
