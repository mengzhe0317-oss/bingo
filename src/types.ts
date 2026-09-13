export interface DrawnNumber {
  id: string;
  number: number;
  isSpecial: boolean;
  order: number;
  timestamp: number;
  note?: string;
}

export interface WeddingConfig {
  coupleTitle: string; // e.g. "Vivian & Kevin"
  eventSubtitle: string; // e.g. "幸福大乐透 · 浪漫开奖"
  weddingDate: string;
  maxNumber: number; // typically 49 (Taiwan lotto) or 36 or 100
  targetCount: number; // e.g. 6
  hasSpecialNumber: boolean; // whether to draw a special bonus ball
  soundEnabled: boolean;
  themeStyle: 'burgundy-gold' | 'champagne-pink' | 'midnight-gold';
  presetNumbers?: number[]; // 預設開出的號碼清單（例如5個指定幸運號）
  showNumberMatrix?: boolean; // 是否顯示全號碼總覽看板（預設 false）
  showInputPad?: boolean; // 是否顯示主持人/現場號碼錄入控制台（預設 true，可隱藏）
}

export type SortMode = 'order' | 'value';
