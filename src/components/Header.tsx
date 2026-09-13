import React from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  RotateCcw,
  Sparkles,
  Ticket,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';
import { WeddingConfig } from '../types';

interface HeaderProps {
  config: WeddingConfig;
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenTicketChecker: () => void;
  onResetGame: () => void;
  onToggleInputPad?: () => void;
  drawnCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  isProjectorMode,
  onToggleProjectorMode,
  onToggleSound,
  onOpenSettings,
  onOpenTicketChecker,
  onResetGame,
  onToggleInputPad,
  drawnCount,
}) => {
  return (
    <header
      id="wedding-header"
      className={`w-full transition-all duration-300 ${
        isProjectorMode
          ? 'py-3 px-6 bg-gradient-to-r from-[#3D0A14]/90 via-[#5B101D]/90 to-[#3D0A14]/90 text-amber-100 border-b border-amber-500/30 backdrop-blur-md shadow-md'
          : 'py-5 px-4 md:px-8 bg-gradient-to-r from-[#4A0D18] via-[#631422] to-[#4A0D18] text-white border-b-2 border-[#D4AF37]/50 shadow-xl'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left / Center Wedding Title Branding */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FFDF80] to-[#C99726] shadow-inner text-[#4A0D18] border border-amber-200">
            <Heart className="w-6 h-6 fill-current" />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1
                className="text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#FFD778] to-[#F1C40F]"
                style={{ fontFamily: "'Cinzel', 'Noto Serif TC', serif" }}
              >
                {config.coupleTitle}
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                {config.weddingDate || '幸福盛典'}
              </span>
            </div>
            <p className="text-sm md:text-base text-amber-200/90 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{config.eventSubtitle}</span>
              <span className="text-amber-400/60 font-light mx-1">|</span>
              <span className="text-xs text-amber-300 bg-black/20 px-2 py-0.5 rounded">
                已開出 {drawnCount} 個號碼
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap justify-center gap-2 text-sm">
          {/* Ticket Checker Button */}
          <button
            id="btn-ticket-checker"
            onClick={onOpenTicketChecker}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            title="對獎助手：輸入賓客自選號碼快速對獎"
          >
            <Ticket className="w-4 h-4 text-amber-950" />
            <span>賓客對獎</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={onToggleSound}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              config.soundEnabled
                ? 'bg-amber-400/20 border-amber-400/40 text-amber-200 hover:bg-amber-400/30'
                : 'bg-stone-800/40 border-stone-600/40 text-stone-400 hover:bg-stone-800/60'
            }`}
            title={config.soundEnabled ? '音效已開啟' : '音效已靜音'}
          >
            {config.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Projector / Big Screen Mode */}
          <button
            id="btn-projector-toggle"
            onClick={onToggleProjectorMode}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
              isProjectorMode
                ? 'bg-amber-300 text-amber-950 font-bold border-amber-200 shadow-lg'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white font-medium'
            }`}
            title="切換大螢幕全螢幕投影模式"
          >
            {isProjectorMode ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">退出大螢幕</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>大螢幕投影</span>
              </>
            )}
          </button>

          {/* Toggle Control Pad Button */}
          {onToggleInputPad && (
            <button
              id="btn-toggle-input-pad"
              onClick={onToggleInputPad}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                config.showInputPad !== false
                  ? 'bg-amber-400/20 hover:bg-amber-400/30 border-amber-400/40 text-amber-200'
                  : 'bg-stone-800/40 hover:bg-stone-800/60 border-stone-600/40 text-stone-400'
              }`}
              title={
                config.showInputPad !== false
                  ? '點擊隱藏主持人控制台（大螢幕畫面更純粹）'
                  : '點擊顯示主持人控制台'
              }
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">
                {config.showInputPad !== false ? '隱藏控制台' : '顯示控制台'}
              </span>
            </button>
          )}

          {/* Settings Button */}
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
            title="婚禮資訊與規則設定"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Reset Round Button */}
          <button
            id="btn-reset-game"
            onClick={onResetGame}
            className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/50 text-rose-200 transition-all cursor-pointer"
            title="清空重新開獎（重置本輪）"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
