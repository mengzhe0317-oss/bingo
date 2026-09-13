import React, { useState, useEffect } from 'react';
import { X, Settings, Check, Sparkles, KeyRound, LayoutGrid, EyeOff, SlidersHorizontal } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37] shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#4A0D18]">
                婚禮與大樂透規則設定
              </h3>
              <p className="text-xs text-stone-500">
                個性化新人名字、號碼球總數及玩法規則
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 outline-none font-semibold text-stone-900"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 outline-none text-stone-900"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 outline-none text-stone-900"
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
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 outline-none bg-white font-semibold"
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
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 outline-none font-semibold text-stone-900"
              />
            </div>
          </div>

          {/* Preset Numbers Configuration (Backoffice Secret) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <KeyRound className="w-4 h-4 text-amber-700" />
                <span>後台預設開出號碼（例如預定 5 個幸運號）</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                <EyeOff className="w-3 h-3 text-amber-700" />
                <span>前台保密隱藏 · 已設定 {(formData.presetNumbers || []).length} 個</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              此處設定的號碼為<strong className="text-amber-950 font-bold">主持人後台保密</strong>，前台大螢幕與操作台完全不會洩漏。電腦搖號時將自動帶出震撼的樂透轉盤與滾球產出動畫依序開出！
            </p>

            <input
              type="text"
              value={presetInput}
              onChange={(e) => handlePresetTextChange(e.target.value)}
              placeholder="例如：6, 8, 16, 28, 36（逗號或空格分隔）"
              className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:border-amber-600 outline-none text-xs font-bold bg-white text-stone-900"
            />

            {presetError && (
              <p className="text-xs text-rose-600 font-semibold">{presetError}</p>
            )}

            {/* Quick click numbers selector */}
            <div className="pt-1">
              <span className="text-[11px] text-stone-600 font-medium block mb-1.5">
                點擊數字快速加入或取消（1~{formData.maxNumber}）：
              </span>
              <div className="max-h-28 overflow-y-auto grid grid-cols-8 gap-1.5 p-2 bg-white/80 rounded-xl border border-amber-200/70">
                {Array.from({ length: formData.maxNumber }, (_, i) => i + 1).map((num) => {
                  const isSelected = (formData.presetNumbers || []).includes(num);
                  return (
                    <button
                      key={`preset-ball-${num}`}
                      type="button"
                      onClick={() => handleTogglePresetNumber(num)}
                      className={`h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

          {/* Special Number Toggle */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-900 block text-xs md:text-sm">
                開啟「特別號」玩法
              </span>
              <span className="text-[11px] text-stone-500">
                加開一顆幸運特別號碼（通常作為二獎或特別大獎）
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.hasSpecialNumber}
              onChange={(e) =>
                setFormData({ ...formData, hasSpecialNumber: e.target.checked })
              }
              className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Sound Effect Toggle */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-900 block text-xs md:text-sm">
                啟用舞台音頻音效
              </span>
              <span className="text-[11px] text-stone-500">
                包含開獎鐘聲、搖球音效與圓滿歡呼
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.soundEnabled}
              onChange={(e) =>
                setFormData({ ...formData, soundEnabled: e.target.checked })
              }
              className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Matrix Board Display Toggle */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-start gap-2">
              <div className="p-1 rounded-lg bg-amber-200/80 text-amber-900 mt-0.5">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs md:text-sm">
                  顯示全號碼總覽看板 (1~{formData.maxNumber})
                </span>
                <span className="text-[11px] text-stone-500">
                  關閉後將隱藏底部 1~49 矩陣看板，讓大螢幕視覺聚焦在樂透開獎動畫與得獎號碼
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.showNumberMatrix ?? false}
              onChange={(e) =>
                setFormData({ ...formData, showNumberMatrix: e.target.checked })
              }
              className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Controller / NumberInputPad Display Toggle */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-start gap-2">
              <div className="p-1 rounded-lg bg-amber-200/80 text-amber-900 mt-0.5">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs md:text-sm">
                  顯示主持人 / 現場號碼錄入控制台
                </span>
                <span className="text-[11px] text-stone-500">
                  關閉後將隱藏錄入控制台，大螢幕畫面更純粹簡潔（仍可在頂端或開獎區一鍵搖號）
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.showInputPad ?? true}
              onChange={(e) =>
                setFormData({ ...formData, showInputPad: e.target.checked })
              }
              className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-bold shadow-md hover:from-amber-400 hover:to-amber-500 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>儲存設定</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
