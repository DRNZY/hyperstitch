import React from 'react';
import { 
  Monitor, Smartphone, Tablet, Tv, Moon, Sun, 
  Terminal, Sparkles, Download, Check, Code2, ShieldAlert, Sliders
} from 'lucide-react';
import { ThemeId, ViewportId } from '../../types';
import { THEMES } from '../../themes';

interface HeaderToolbarProps {
  currentTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  currentViewport: ViewportId;
  onViewportChange: (v: ViewportId) => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  onExport: () => void;
  copied: boolean;
}

export function HeaderToolbar({
  currentTheme,
  onThemeChange,
  currentViewport,
  onViewportChange,
  isInspectorOpen,
  onToggleInspector,
  onExport,
  copied
}: HeaderToolbarProps) {
  const viewports: { id: ViewportId; label: string; icon: any }[] = [
    { id: 'desktop', label: 'Desktop (1440px)', icon: Monitor },
    { id: 'tablet', label: 'Tablet (768px)', icon: Tablet },
    { id: 'mobile', label: 'Mobile (375px)', icon: Smartphone },
    { id: 'ultrawide', label: 'Ultrawide (32:9)', icon: Tv }
  ];

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-2xl flex items-center justify-between px-4 z-30">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px]">
          <div className="h-full w-full rounded-[11px] bg-black flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-indigo-300" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">HyperStitch</span>
            <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 text-[10px] font-mono text-indigo-400 font-semibold">
              STUDIO
            </span>
          </div>
        </div>
      </div>

      {/* Viewport Switcher */}
      <div className="flex items-center rounded-xl border border-white/[0.08] bg-zinc-900/60 p-1">
        {viewports.map((v) => {
          const Icon = v.icon;
          const isActive = currentViewport === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onViewportChange(v.id)}
              title={v.label}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline capitalize">{v.id}</span>
            </button>
          );
        })}
      </div>

      {/* Theme & Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Selector */}
        <div className="flex items-center rounded-xl border border-white/[0.08] bg-zinc-900/60 p-1">
          {Object.entries(THEMES).map(([id, cfg]) => {
            const isSelected = currentTheme === id;
            return (
              <button
                key={id}
                onClick={() => onThemeChange(id as ThemeId)}
                title={`Theme: ${cfg.name}`}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all ${
                  isSelected ? 'bg-white/[0.12] text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.glowColor }} />
                <span className="capitalize">{id}</span>
              </button>
            );
          })}
        </div>

        {/* Code / Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-all active:scale-[0.98]"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Export Code'}</span>
        </button>

        {/* Inspector Toggle */}
        <button
          onClick={onToggleInspector}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
            isInspectorOpen
              ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
              : 'border-white/[0.08] bg-zinc-900/80 text-zinc-400 hover:text-white'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Inspector</span>
        </button>
      </div>
    </header>
  );
}
