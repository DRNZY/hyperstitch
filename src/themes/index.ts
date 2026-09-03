import { ThemeConfig, ThemeId } from '../types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  void: {
    id: 'void',
    name: 'OLED Deep Void',
    bgClass: 'bg-[#030304]',
    cardClass: 'bg-[#0A0A0E]/80 backdrop-blur-2xl text-zinc-100 shadow-2xl shadow-indigo-950/20',
    borderClass: 'border-white/[0.08]',
    accentClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    textClass: 'text-zinc-100',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    contrastRatio: '18.4:1'
  },
  apple: {
    id: 'apple',
    name: 'Apple Alpine Light',
    bgClass: 'bg-[#F2F2F7]',
    cardClass: 'bg-white/90 backdrop-blur-xl text-zinc-900 shadow-xl shadow-black/[0.04]',
    borderClass: 'border-black/[0.06]',
    accentClass: 'text-blue-600 bg-blue-50 border-blue-200',
    textClass: 'text-zinc-900',
    glowColor: 'rgba(0, 122, 255, 0.15)',
    contrastRatio: '14.8:1'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Emerald',
    bgClass: 'bg-[#030805]',
    cardClass: 'bg-[#06140B]/90 backdrop-blur-2xl text-emerald-100 shadow-2xl shadow-emerald-950/20',
    borderClass: 'border-emerald-500/20',
    accentClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40',
    textClass: 'text-emerald-100',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    contrastRatio: '16.2:1'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Mirage',
    bgClass: 'bg-[#0B040F]',
    cardClass: 'bg-[#15071F]/80 backdrop-blur-2xl text-rose-100 shadow-2xl shadow-rose-950/20',
    borderClass: 'border-rose-500/20',
    accentClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    textClass: 'text-rose-100',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    contrastRatio: '15.6:1'
  }
};
