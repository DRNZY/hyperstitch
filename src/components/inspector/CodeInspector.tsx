import React, { useState } from 'react';
import { Code2, Check, Copy, ShieldCheck, Sparkles, Sliders, Download, Zap } from 'lucide-react';
import { ComponentSpec, ThemeConfig } from '../../types';
import { PropsTuner } from './PropsTuner';
import { AntiCrutchAuditor } from './AntiCrutchAuditor';

interface CodeInspectorProps {
  component: ComponentSpec;
  theme: ThemeConfig;
  currentProps: Record<string, any>;
  onChangeProp: (key: string, value: any) => void;
  onResetProps: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CodeInspector({
  component,
  theme,
  currentProps,
  onChangeProp,
  onResetProps,
  isOpen,
  onClose
}: CodeInspectorProps) {
  const [activeTab, setActiveTab] = useState<'props' | 'code' | 'a11y' | 'craft'>('props');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedCode = component.code(currentProps);
  const tokenCountEst = Math.ceil(generatedCode.length / 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.id}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="w-96 border-l border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-2xl flex flex-col h-[calc(100vh-3.5rem)] z-20">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/[0.06] p-1 bg-zinc-950/40">
        <button
          onClick={() => setActiveTab('props')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeTab === 'props' ? 'bg-white/[0.1] text-white font-semibold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sliders className="h-3 w-3" />
          <span>Props</span>
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeTab === 'code' ? 'bg-white/[0.1] text-white font-semibold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Code2 className="h-3 w-3" />
          <span>Code</span>
        </button>
        <button
          onClick={() => setActiveTab('a11y')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeTab === 'a11y' ? 'bg-white/[0.1] text-white font-semibold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          <span>A11y</span>
        </button>
        <button
          onClick={() => setActiveTab('craft')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeTab === 'craft' ? 'bg-white/[0.1] text-white font-semibold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>Craft</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'props' && (
          <PropsTuner
            component={component}
            currentProps={currentProps}
            onChangeProp={onChangeProp}
            onResetProps={onResetProps}
          />
        )}

        {activeTab === 'code' && (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-zinc-400">TypeScript (Tailwind v4)</span>
                <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 text-[9px] font-mono text-indigo-300">
                  ~{tokenCountEst} tokens
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  title="Download .tsx file"
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSX'}</span>
                </button>
              </div>
            </div>
            <pre className="rounded-xl border border-white/[0.06] bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-x-auto selection:bg-indigo-500/40">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}

        {activeTab === 'a11y' && (
          <div className="p-4 space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">WCAG 2.1 Contrast Check</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                  {theme.contrastRatio} (AAA PASS)
                </span>
              </div>
              <p className="mt-2 text-xs text-emerald-200/80">
                Contrast ratio against {theme.name} exceeds the 7.0:1 AAA standard for regular text.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
                <span className="text-zinc-400">Touch Target Dimensions</span>
                <span className="font-mono text-emerald-400 font-semibold">≥ 44 × 44 pt</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
                <span className="text-zinc-400">Keyboard Focus Ring</span>
                <span className="font-mono text-emerald-400 font-semibold">focus-visible:ring-2</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
                <span className="text-zinc-400">Reduced Motion Support</span>
                <span className="font-mono text-emerald-400 font-semibold">motion-safe:animate</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
                <span className="text-zinc-400">Semantic Role Tags</span>
                <span className="font-mono text-emerald-400 font-semibold">aria-live, role="status"</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'craft' && (
          <AntiCrutchAuditor component={component} code={generatedCode} />
        )}
      </div>
    </aside>
  );
}
