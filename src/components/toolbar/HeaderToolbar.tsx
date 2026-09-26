import React from 'react';
import {
  Brackets, Check, Download, Grid, Moon, Panel, Phone, Screen, Sun, Tablet, Terminal, Wide,
} from '../marks/Marks';
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

const VIEWPORTS: { id: ViewportId; label: string; Mark: React.ComponentType<{ size?: number }> }[] = [
  { id: 'desktop', label: 'Desktop 1440px', Mark: Screen },
  { id: 'tablet', label: 'Tablet 768px', Mark: Tablet },
  { id: 'mobile', label: 'Mobile 375px', Mark: Phone },
  { id: 'ultrawide', label: 'Ultrawide 32:9', Mark: Wide },
];

export function HeaderToolbar({
  currentTheme,
  onThemeChange,
  currentViewport,
  onViewportChange,
  isInspectorOpen,
  onToggleInspector,
  onExport,
  copied,
}: HeaderToolbarProps) {
  return (
    <header className="z-30 flex h-14 items-center justify-between border-b border-ash-800 bg-ash-950 px-4">
      {/* Brand: a solid square mark, not a gradient ring. */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-ash-700 bg-ash-900">
          <span className="text-ochre-300"><Grid size={15} /></span>
        </div>
        <span className="text-sm font-semibold tracking-tight text-ash-100">HyperStitch</span>
        <span className="border border-ash-700 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-ash-400">
          STUDIO
        </span>
      </div>

      {/* Viewport switcher */}
      <div className="flex items-center border border-ash-800">
        {VIEWPORTS.map(({ id, label, Mark: Icon }) => {
          const isActive = currentViewport === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onViewportChange(id)}
              title={label}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 border-r border-ash-800 px-3 py-1.5 text-xs last:border-r-0 ${
                isActive ? 'bg-ash-100 font-semibold text-ash-950' : 'text-ash-400 hover:bg-ash-900'
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{id}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme switcher */}
        <div className="flex items-center border border-ash-800">
          {Object.entries(THEMES).map(([id, config]) => {
            const isSelected = currentTheme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onThemeChange(id as ThemeId)}
                title={`Theme: ${config.name}`}
                aria-pressed={isSelected}
                className={`flex items-center gap-1.5 border-r border-ash-800 px-3 py-1.5 font-mono text-[11px] last:border-r-0 ${
                  isSelected ? 'bg-ash-100 font-semibold text-ash-950' : 'text-ash-400 hover:bg-ash-900'
                }`}
              >
                {id === 'apple' ? <Sun size={12} /> : <Moon size={12} />}
                {id}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 border border-ash-700 px-3 py-1.5 text-xs font-medium text-ash-200 hover:bg-ash-900"
        >
          {copied ? <span className="text-moss-300"><Check size={13} /></span> : <Download size={13} />}
          {copied ? 'Copied' : 'Export code'}
        </button>

        <button
          type="button"
          onClick={onToggleInspector}
          aria-pressed={isInspectorOpen}
          className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium ${
            isInspectorOpen
              ? 'border-ash-100 bg-ash-100 text-ash-950'
              : 'border-ash-700 text-ash-400 hover:bg-ash-900'
          }`}
        >
          {isInspectorOpen ? <Panel size={13} /> : <Brackets size={13} />}
          <span className="hidden md:inline">Inspector</span>
        </button>
      </div>
    </header>
  );
}

/** Referenced by the barrel so the terminal mark is part of the public set. */
export const HEADER_MARKS = { Terminal };
