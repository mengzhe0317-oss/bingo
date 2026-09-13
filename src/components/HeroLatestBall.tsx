import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Gift, ArrowRight, Disc3 } from 'lucide-react';
import { DrawnNumber } from '../types';
import { LottoBall } from './LottoBall';

interface HeroLatestBallProps {
  latestBall: DrawnNumber | null;
  totalDrawn: number;
  targetCount: number;
  isRolling: boolean;
  rollingNumber: number;
}

export const HeroLatestBall: React.FC<HeroLatestBallProps> = ({
  latestBall,
  targetCount,
  isRolling,
  rollingNumber,
}) => {
  return (
    <div
      id="hero-latest-ball-section"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EC] to-[#FDF4E3] border-2 border-[#EAD5AA] shadow-[0_12px_36px_rgba(163,115,22,0.14)] p-6 md:p-8 text-center"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-rose-300/15 blur-3xl pointer-events-none" />

      {isRolling ? (
        /* Dynamic Lottery Drum & Ball Pop-out Animation State */
        <div className="flex flex-col items-center justify-center py-5 relative">
          {/* Animated Status Pill */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 font-black text-sm tracking-wider uppercase shadow-md mb-6 ring-2 ring-amber-300/60"
          >
            <Sparkles className="w-4 h-4 animate-spin text-amber-900" />
            <span>樂透開獎滾球中 · 萬眾期待！</span>
          </motion.div>

          {/* Golden Lottery Drum / Cage Stage */}
          <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72">
            {/* Outer Spinning Golden Cage Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400/80 shadow-[0_0_30px_rgba(234,179,8,0.35)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3.6, ease: 'linear' }}
              className="absolute inset-3 rounded-full border-2 border-amber-300/60"
            />

            {/* Glowing Center Chamber with subtle radial gradient */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-amber-100/90 via-amber-50/70 to-yellow-100/80 backdrop-blur-xs flex items-center justify-center border border-amber-300/70 shadow-inner overflow-hidden">
              {/* Spinning particle stars */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                className="absolute inset-0 opacity-40 pointer-events-none flex items-center justify-center"
              >
                <Disc3 className="w-48 h-48 text-amber-500/20 animate-pulse" />
              </motion.div>

              {/* Fast Tumble Rolling Lotto Ball */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={rollingNumber}
                  initial={{ y: 28, scale: 0.7, rotate: -30, opacity: 0.8 }}
                  animate={{ y: 0, scale: 1.05, rotate: 0, opacity: 1 }}
                  exit={{ y: -28, scale: 0.7, rotate: 30, opacity: 0.7 }}
                  transition={{ duration: 0.08, ease: 'easeOut' }}
                  className="z-10"
                >
                  <LottoBall number={rollingNumber} size="xl" isSpecial={false} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Golden Drop Chute / Exit Tube */}
            <div className="absolute -bottom-3 px-4 py-1 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-[11px] font-black text-amber-950 shadow-md border border-amber-200">
              幸運球出球軌道
            </div>
          </div>

          <p className="mt-6 text-amber-900 font-bold text-base md:text-lg tracking-wider animate-pulse flex items-center gap-2">
            <span>✦</span>
            <span>樂透搖獎機高速運轉中，下一顆幸運號碼即將出球...</span>
            <span>✦</span>
          </p>
        </div>
      ) : latestBall ? (
        /* Display Latest Drawn Ball with Celebration Pop Animation */
        <motion.div
          key={latestBall.id}
          initial={{ scale: 0.75, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 180 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 text-amber-900 border border-amber-300/80 font-bold text-sm tracking-wider mb-3 shadow-xs">
            {latestBall.isSpecial ? (
              <>
                <Gift className="w-4 h-4 text-rose-600 animate-bounce" />
                <span className="text-rose-700 font-black">★ 重磅開出：幸運特別號 ★</span>
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 text-amber-700" />
                <span className="font-bold">最新開出：第 {latestBall.order} 顆正選球</span>
              </>
            )}
          </div>

          {/* Huge Hero Ball with Pop Animation */}
          <motion.div
            initial={{ scale: 0.6, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="my-1.5"
          >
            <LottoBall
              number={latestBall.number}
              size="giant"
              isSpecial={latestBall.isSpecial}
              isNew={true}
            />
          </motion.div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-3xl md:text-4xl font-black tracking-tight text-[#4A0D18]">
              {latestBall.number < 10 ? `0${latestBall.number}` : latestBall.number} 號
            </span>
            <span className="text-sm font-semibold text-amber-900/90 bg-white/90 px-3.5 py-1 rounded-full border border-amber-200 shadow-2xs">
              {latestBall.isSpecial
                ? '特別加碼 · 幸福降臨'
                : `第 ${latestBall.order} 位幸運數字開出`}
            </span>
          </div>
        </motion.div>
      ) : (
        /* Empty State: Ready for First Draw */
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 mb-4 shadow-inner">
            <Sparkles className="w-10 h-10 animate-pulse text-amber-600" />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#4A0D18]"
            style={{ fontFamily: "'Cinzel', 'Noto Serif TC', serif" }}
          >
            婚禮大樂透 · 準備開獎！
          </h2>
          <p className="mt-2 text-stone-600 max-w-md text-base leading-relaxed">
            點擊下方「電腦隨機搖號」啟動出球動畫，或由主持人手搖抽球後在控制台輸入，大螢幕即時同步揭曉！
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-amber-800 font-semibold bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
            <span>目標開出 {targetCount} 個幸運號碼</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
            <span>目前等待第 1 球</span>
          </div>
        </div>
      )}
    </div>
  );
};
