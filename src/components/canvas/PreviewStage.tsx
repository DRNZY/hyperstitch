import React, { useState } from 'react';
import { Lens, Reset } from '../marks/Marks';
import { ComponentSpec, ThemeConfig, ViewportId } from '../../types';

interface PreviewStageProps {
  component: ComponentSpec;
  theme: ThemeConfig;
  viewportId: ViewportId;
  currentProps: Record<string, any>;
}

const VIEWPORT_DIMENSIONS: Record<ViewportId, { width: string; label: string }> = {
  desktop: { width: '100%', label: '1440 x 900' },
  tablet: { width: '768px', label: '768 x 1024' },
  mobile: { width: '375px', label: '375 x 812' },
  ultrawide: { width: '100%', label: '3440 x 1440 (32:9)' },
};

/**
 * The preview stage.
 *
 * The ambient dot grid and the floating control cluster both used a
 * `backdrop-blur-xl` and a `radial-gradient` wash. Rule 6 forbids the blur and
 * rule 13 forbids pointer-tracked glow, so both surfaces are now flat: a solid
 * background colour and an opaque control bar.
 */
export function PreviewStage({ component, theme, viewportId, currentProps }: PreviewStageProps) {
  const [scale, setScale] = useState(1);
  const viewport = VIEWPORT_DIMENSIONS[viewportId];
  const isFramed = viewportId !== 'desktop' && viewportId !== 'ultrawide';

  return (
    <main className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden p-6 ${theme.bgClass}`}>
      {/* Flat control cluster. No blur, no radius on the bar. */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1 border border-ash-800 bg-ash-900 p-1">
        <span className="px-2 font-mono text-[11px] text-ash-400">{viewport.label}</span>
        <button
          type="button"
          onClick={() => setScale((value) => Math.max(0.5, Number((value - 0.1).toFixed(1))))}
          className="px-2 py-1 font-mono text-[11px] text-ash-300 hover:bg-ash-800"
          title="Zoom out"
        >
          &minus;
        </button>
        <span className="w-12 text-center font-mono text-[11px] text-ash-200">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setScale((value) => Math.min(1.5, Number((value + 0.1).toFixed(1))))}
          className="px-2 py-1 font-mono text-[11px] text-ash-300 hover:bg-ash-800"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setScale(1)}
          className="p-1 text-ash-300 hover:bg-ash-800"
          title="Reset scale"
        >
          <Reset size={12} />
        </button>
        <span className="p-1 text-ash-500" title="Framed preview">
          <Lens size={12} />
        </span>
      </div>

      <div
        className="flex max-h-[85vh] w-full items-center justify-center overflow-y-auto"
        style={{ width: viewport.width, transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <div
          className={`flex w-full items-center justify-center p-8 ${
            isFramed ? 'border border-ash-800 bg-ash-950' : ''
          }`}
        >
          {component.render(currentProps)}
        </div>
      </div>
    </main>
  );
}
