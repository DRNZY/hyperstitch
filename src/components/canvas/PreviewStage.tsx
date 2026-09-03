import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Smartphone, Tablet, Monitor, Tv } from 'lucide-react';
import { ComponentSpec, ThemeConfig, ViewportId } from '../../types';

interface PreviewStageProps {
  component: ComponentSpec;
  theme: ThemeConfig;
  viewportId: ViewportId;
  currentProps: Record<string, any>;
}

const VIEWPORT_DIMENSIONS: Record<ViewportId, { width: string; label: string }> = {
  desktop: { width: '100%', label: '1440 × 900' },
  tablet: { width: '768px', label: '768 × 1024' },
  mobile: { width: '375px', label: '375 × 812' },
  ultrawide: { width: '100%', label: '3440 × 1440 (32:9)' }
};

export function PreviewStage({
  component,
  theme,
  viewportId,
  currentProps
}: PreviewStageProps) {
  const [scale, setScale] = useState(1);
  const vp = VIEWPORT_DIMENSIONS[viewportId];

  return (
    <main className={`flex-1 relative overflow-hidden flex flex-col items-center justify-center p-6 transition-colors duration-500 ${theme.bgClass}`}>
      {/* Background ambient grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/60 p-1 backdrop-blur-xl z-10 text-xs text-zinc-300">
        <span className="px-2 font-mono text-[11px] text-zinc-400">{vp.label}</span>
        <button 
          onClick={() => setScale(s => Math.max(0.5, parseFloat((s - 0.1).toFixed(1))))} 
          className="p-1.5 rounded hover:bg-white/[0.1] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <span className="font-mono text-[10px] w-8 text-center">{Math.round(scale * 100)}%</span>
        <button 
          onClick={() => setScale(s => Math.min(1.5, parseFloat((s + 0.1).toFixed(1))))} 
          className="p-1.5 rounded hover:bg-white/[0.1] transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button 
          onClick={() => setScale(1)} 
          className="p-1.5 rounded hover:bg-white/[0.1] transition-colors"
          title="Reset Scale (100%)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Viewport Frame Container */}
      <div 
        className="relative transition-all duration-300 flex items-center justify-center max-h-[85vh] overflow-y-auto"
        style={{
          width: vp.width,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <div className={`w-full flex items-center justify-center p-8 rounded-3xl ${
          viewportId !== 'desktop' && viewportId !== 'ultrawide' 
            ? 'border border-white/[0.1] shadow-2xl bg-black/40 backdrop-blur-md min-h-[500px]' 
            : ''
        }`}>
          {component.render(currentProps)}
        </div>
      </div>
    </main>
  );
}
