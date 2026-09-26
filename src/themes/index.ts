import { ThemeConfig, ThemeId } from '../types';

/**
 * Canvas themes.
 *
 * These style the stage *behind* the component, not the component itself, so
 * they are not subject to the catalog audit. They are still held to the rules:
 * no `backdrop-blur-*` (the card fills used it on all four themes), no purple to
 * blue axis, and `glowColor` is now the theme's own flat surface colour rather
 * than a translucent glow that fed rule 13.
 */
export const THEMES: Record<ThemeId, ThemeConfig> = {
  void: {
    id: 'void',
    name: 'Neutral Dark',
    bgClass: 'bg-ash-950',
    cardClass: 'border border-ash-800 bg-ash-900 text-ash-100',
    borderClass: 'border-ash-800',
    accentClass: 'border border-ochre-500/40 text-ochre-300',
    textClass: 'text-ash-100',
    glowColor: '#08090a',
    contrastRatio: '18.4:1',
  },
  apple: {
    id: 'apple',
    name: 'Paper Light',
    bgClass: 'bg-[#F2F2F0]',
    cardClass: 'border border-black/10 bg-white text-zinc-900',
    borderClass: 'border-black/10',
    accentClass: 'border border-ochre-500 text-[#7A5A12]',
    textClass: 'text-zinc-900',
    glowColor: '#F2F2F0',
    contrastRatio: '14.8:1',
  },
  cyber: {
    id: 'cyber',
    name: 'Moss Dark',
    bgClass: 'bg-[#050A06]',
    cardClass: 'border border-moss-500/40 bg-[#08120B] text-moss-300',
    borderClass: 'border-moss-500/40',
    accentClass: 'border border-moss-400 text-moss-300',
    textClass: 'text-moss-300',
    glowColor: '#050A06',
    contrastRatio: '16.2:1',
  },
  sunset: {
    id: 'sunset',
    name: 'Clay Dark',
    bgClass: 'bg-[#0C0705]',
    cardClass: 'border border-rust-600 bg-[#170C08] text-[#E8B9A6]',
    borderClass: 'border-rust-600',
    accentClass: 'border border-rust-400 text-rust-300',
    textClass: 'text-[#E8B9A6]',
    glowColor: '#0C0705',
    contrastRatio: '15.6:1',
  },
};
