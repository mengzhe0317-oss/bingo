import React, { useState, useEffect, useCallback } from 'react';
import {
  Header,
} from './components/Header';
import { HeroLatestBall } from './components/HeroLatestBall';
import { DrawnBallsList } from './components/DrawnBallsList';
import { NumberInputPad } from './components/NumberInputPad';
import { NumberMatrixBoard } from './components/NumberMatrixBoard';
import { TicketCheckerModal } from './components/TicketCheckerModal';
import { SettingsModal } from './components/SettingsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { DrawnNumber, WeddingConfig, SortMode } from './types';
import {
  playBallRevealSound,
  playRollingSound,
  playCelebrationFanfare,
  playWarningSound,
} from './utils/audio';
import { triggerWeddingConfetti } from './utils/confetti';
import { Sparkles, Maximize2, Minimize2, Tv, Heart, SlidersHorizontal, Dices } from 'lucide-react';

const DEFAULT_CONFIG: WeddingConfig = {
  coupleTitle: '🤵 孟哲 & 👰 品欣 的婚禮大樂透',
  eventSubtitle: '浪漫滿溢 · 幸福大樂透開獎現場',
  weddingDate: '喜結良緣 · 永結同心',
  maxNumber: 49,
  targetCount: 5,
  hasSpecialNumber: false,
  soundEnabled: true,
  themeStyle: 'burgundy-gold',
  presetNumbers: [3, 21, 4, 11, 5], // 後台預設 5 個幸運號碼 (03, 21, 04, 11, 05)，前台保密隱藏
  showNumberMatrix: false, // 預設不顯示全號碼總覽看板（可在設定中切換開啟）
  showInputPad: true, // 預設顯示主持人控制台（可一鍵或在設定中隱藏）
};

const STORAGE_KEYS = {
  DRAWN_NUMBERS: 'wedding_lotto_drawn_v6',
  CONFIG: 'wedding_lotto_config_v6',
};

export default function App() {
  // Load saved configuration and drawn numbers from localStorage
  const [config, setConfig] = useState<WeddingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_CONFIG;
  });

  const [drawnNumbers, setDrawnNumbers] = useState<DrawnNumber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRAWN_NUMBERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [sortMode, setSortMode] = useState<SortMode>('order');
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isTicketCheckerOpen, setIsTicketCheckerOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Rolling state for random draw suspense
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollingNumber, setRollingNumber] = useState<number>(1);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAWN_NUMBERS, JSON.stringify(drawnNumbers));
    } catch {
      // ignore
    }
  }, [drawnNumbers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  // Find latest drawn ball
  const latestBall =
    drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null;

  // Add drawn number
  const handleAddNumber = useCallback(
    (num: number, isSpecial: boolean): boolean => {
      // Check duplicate
      const isDuplicate = drawnNumbers.some((d) => d.number === num);
      if (isDuplicate) {
        if (config.soundEnabled) playWarningSound();
        return false;
      }

      // Check max range
      if (num < 1 || num > config.maxNumber) {
        if (config.soundEnabled) playWarningSound();
        return false;
      }

      const regularCount = drawnNumbers.filter((d) => !d.isSpecial).length;

      const newBall: DrawnNumber = {
        id: `${Date.now()}-${num}`,
        number: num,
        isSpecial,
        order: isSpecial ? drawnNumbers.length + 1 : regularCount + 1,
        timestamp: Date.now(),
      };

      const nextDrawn = [...drawnNumbers, newBall];
      setDrawnNumbers(nextDrawn);

      // Audio and confetti feedback
      if (config.soundEnabled) {
        playBallRevealSound(isSpecial);
      }
      triggerWeddingConfetti(isSpecial);

      // Check if target count completed
      const newRegularCount = nextDrawn.filter((d) => !d.isSpecial).length;
      if (newRegularCount === config.targetCount) {
        setTimeout(() => {
          if (config.soundEnabled) playCelebrationFanfare();
          triggerWeddingConfetti(true);
        }, 600);
      }

      return true;
    },
    [drawnNumbers, config]
  );

  // Random roll animation (prioritizes preset numbers if configured, then unpicked pool)
  const handleRandomRoll = useCallback(
    (isSpecial: boolean) => {
      if (isRolling) return;

      const drawnSet = new Set(drawnNumbers.map((d) => d.number));
      const availablePool: number[] = [];
      for (let i = 1; i <= config.maxNumber; i++) {
        if (!drawnSet.has(i)) {
          availablePool.push(i);
        }
      }

      if (availablePool.length === 0) {
        if (config.soundEnabled) playWarningSound();
        return;
      }

      // Check if there are preset numbers that have not been drawn yet
      const undrawnPresets = (config.presetNumbers || []).filter(
        (n) => !drawnSet.has(n) && n >= 1 && n <= config.maxNumber
      );

      // If preset numbers exist, pick the next preset number; otherwise pick random from available
      const chosenNum =
        undrawnPresets.length > 0
          ? undrawnPresets[0]
          : availablePool[Math.floor(Math.random() * availablePool.length)];

      setIsRolling(true);

      let counter = 0;
      const totalSteps = 22;
      const intervalTime = 70;

      const interval = setInterval(() => {
        counter++;
        const tempNum =
          availablePool[Math.floor(Math.random() * availablePool.length)];
        setRollingNumber(tempNum);

        if (config.soundEnabled && counter % 2 === 0) {
          playRollingSound();
        }

        if (counter >= totalSteps) {
          clearInterval(interval);
          setRollingNumber(chosenNum);
          setTimeout(() => {
            setIsRolling(false);
            handleAddNumber(chosenNum, isSpecial);
          }, 300);
        }
      }, intervalTime);
    },
    [isRolling, drawnNumbers, config, handleAddNumber]
  );

  // Undo last drawn number
  const handleUndoLast = useCallback(() => {
    if (drawnNumbers.length === 0) return;
    setDrawnNumbers((prev) => prev.slice(0, -1));
  }, [drawnNumbers.length]);

  // Remove specific number
  const handleRemoveNumber = useCallback((id: string) => {
    setDrawnNumbers((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // Reset round
  const handleConfirmReset = useCallback(() => {
    setDrawnNumbers([]);
  }, []);

  // Toggle fullscreen/projector mode
  const handleToggleProjectorMode = () => {
    const nextMode = !isProjectorMode;
    setIsProjectorMode(nextMode);

    if (nextMode) {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          // ignore if blocked by browser policy
        });
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          // ignore
        });
      }
    }
  };

  return (
    <div
      id="wedding-lottery-app"
      className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2C1810] relative overflow-x-hidden selection:bg-[#E8C575] selection:text-[#5B101D]"
    >
      {/* Subtle festive background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage:
            'radial-gradient(#D4AF37 0.75px, transparent 0.75px), radial-gradient(#800020 0.75px, #FDFBF7 0.75px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      {/* App Header */}
      <div className="relative z-10">
        <Header
          config={config}
          isProjectorMode={isProjectorMode}
          onToggleProjectorMode={handleToggleProjectorMode}
          onToggleSound={() =>
            setConfig((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
          }
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTicketChecker={() => setIsTicketCheckerOpen(true)}
          onResetGame={() => setIsResetConfirmOpen(true)}
          onToggleInputPad={() =>
            setConfig((prev) => ({ ...prev, showInputPad: prev.showInputPad === false ? true : false }))
          }
          drawnCount={drawnNumbers.length}
        />
      </div>

      {/* Main Content Area */}
      <main
        id="main-display-container"
        className={`relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 transition-all ${
          isProjectorMode ? 'py-4' : 'py-6 md:py-8'
        } space-y-6`}
      >
        {/* Top Grid: Hero Latest Ball + Drawn Tray */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Latest Drawn Highlight Ball (Left / Top) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <HeroLatestBall
              latestBall={latestBall}
              totalDrawn={drawnNumbers.length}
              targetCount={config.targetCount}
              isRolling={isRolling}
              rollingNumber={rollingNumber}
            />
          </div>

          {/* Drawn Balls Rack / List (Right / Center) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <DrawnBallsList
              drawnNumbers={drawnNumbers}
              sortMode={sortMode}
              onToggleSortMode={() =>
                setSortMode((prev) => (prev === 'order' ? 'value' : 'order'))
              }
              onRemoveNumber={handleRemoveNumber}
              targetCount={config.targetCount}
              hasSpecialNumber={config.hasSpecialNumber}
              isProjectorMode={isProjectorMode}
            />
          </div>
        </div>

        {/* Number Input / Controller Area (Can be hidden for clean big screen) */}
        {config.showInputPad !== false ? (
          <div className="w-full">
            <NumberInputPad
              maxNumber={config.maxNumber}
              drawnNumbers={drawnNumbers}
              onAddNumber={handleAddNumber}
              onRandomRoll={handleRandomRoll}
              onUndoLast={handleUndoLast}
              isRolling={isRolling}
              hasSpecialNumber={config.hasSpecialNumber}
              targetCount={config.targetCount}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onHidePad={() => setConfig((prev) => ({ ...prev, showInputPad: false }))}
            />
          </div>
        ) : (
          /* Sleek subtle bar shown when controller is hidden, allowing easy one-click roll or restore */
          <div className="w-full flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="font-semibold text-stone-800">
                主持人控制台已隱藏（大螢幕純淨呈現）
              </span>
              <span className="hidden md:inline text-stone-500">
                · 依然可直接在右側或使用熱鍵進行電腦開獎
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRandomRoll(false)}
                disabled={isRolling || drawnNumbers.length >= (config.targetCount + (config.hasSpecialNumber ? 1 : 0))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-bold hover:from-amber-400 hover:to-amber-500 shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Dices className="w-4 h-4 text-amber-950" />
                <span>電腦搖出下一球</span>
              </button>
              <button
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, showInputPad: true }))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 hover:text-stone-900 cursor-pointer shadow-2xs transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>展開控制台</span>
              </button>
            </div>
          </div>
        )}

        {/* Full Number Matrix Board (1 ~ N) - Conditionally displayed based on config */}
        {config.showNumberMatrix && (
          <div className="w-full">
            <NumberMatrixBoard
              maxNumber={config.maxNumber}
              drawnNumbers={drawnNumbers}
              isProjectorMode={isProjectorMode}
            />
          </div>
        )}

        {/* Projector Mode Quick Floating Bar */}
        {isProjectorMode && (
          <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-[#4A0D18]/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-amber-400/40 shadow-2xl">
            <span className="flex items-center gap-1.5 text-xs text-amber-200 font-semibold">
              <Tv className="w-4 h-4 text-amber-400" />
              大螢幕投影模式已開啟
            </span>
            <button
              onClick={handleToggleProjectorMode}
              className="ml-2 text-xs bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-3 py-1 rounded-xl cursor-pointer"
            >
              退出大螢幕
            </button>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="relative z-10 py-6 text-center text-xs text-stone-500 border-t border-stone-200 bg-white/70">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[#800020] font-semibold">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-600" />
            <span>祝願新人百年好合 · 現場賓客喜中大獎</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span>支援鍵盤錄入 / 觸控點選 / 隨機搖號</span>
            <span>•</span>
            <span>已開啟本機資料安全儲存</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TicketCheckerModal
        isOpen={isTicketCheckerOpen}
        onClose={() => setIsTicketCheckerOpen(false)}
        drawnNumbers={drawnNumbers}
        maxNumber={config.maxNumber}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => setConfig(newConfig)}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={handleConfirmReset}
        drawnCount={drawnNumbers.length}
      />
    </div>
  );
}
