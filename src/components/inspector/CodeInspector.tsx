import React, { useState } from 'react';
import { Brackets, Caliper, Check, Contract, Copy, Download, Faders } from '../marks/Marks';
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

type TabId = 'props' | 'code' | 'a11y' | 'craft';

const TABS: { id: TabId; label: string; Mark: React.ComponentType<{ size?: number }> }[] = [
  { id: 'props', label: 'Props', Mark: Faders },
  { id: 'code', label: 'Code', Mark: Brackets },
  { id: 'a11y', label: 'A11y', Mark: Contract },
  { id: 'craft', label: 'Craft', Mark: Caliper },
];

export function CodeInspector({
  component,
  theme,
  currentProps,
  onChangeProp,
  onResetProps,
  isOpen,
}: CodeInspectorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('props');
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
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${component.id}.tsx`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="z-20 flex h-[calc(100vh-3.5rem)] w-96 flex-col border-l border-ash-800 bg-ash-950">
      <div role="tablist" aria-label="Inspector sections" className="flex border-b border-ash-800">
        {TABS.map(({ id, label, Mark: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 items-center justify-center gap-1 border-b-2 py-2 text-xs ${
                isActive
                  ? 'border-ash-100 font-semibold text-ash-100'
                  : 'border-transparent text-ash-500 hover:text-ash-300'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          );
        })}
      </div>

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
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-ash-400">
                TSX, about {tokenCountEst} tokens
              </span>
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download .tsx"
                  aria-label="Download TSX"
                  className="border border-ash-800 p-1 text-ash-400 hover:bg-ash-900 hover:text-ash-200"
                >
                  <Download size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 border border-ash-800 px-2 py-1 font-mono text-[11px] text-ash-300 hover:bg-ash-900"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </span>
            </div>
            <pre className="overflow-x-auto border border-ash-800 bg-ash-900 p-3 font-mono text-[11px] leading-relaxed text-ash-300">
              <code>{generatedCode}</code>
            </pre>
            <p className="font-mono text-[10px] leading-relaxed text-ash-500">
              A hand-maintained transcription for the clipboard. The Craft tab
              grades the rendered component, not this string.
            </p>
          </div>
        )}

        {activeTab === 'a11y' && (
          <div className="space-y-4 p-4">
            <div className="border border-moss-500/40 bg-ash-900 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-moss-300">WCAG 2.1 contrast</span>
                <span className="font-mono text-xs font-semibold text-ash-100">
                  {theme.contrastRatio}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ash-400">
                Reported for the {theme.name} surface. This is a per-theme figure
                for the canvas behind the component, not a per-element audit of
                the component's own text.
              </p>
            </div>

            <dl className="space-y-2 text-xs">
              {[
                ['Touch targets', '32 px minimum, 44 px for primary actions'],
                ['Focus ring', '2 px solid outline, 2 px offset'],
                ['Reduced motion', 'No opacity or colour transitions; spin is opt-in'],
                ['Semantics', 'role="switch" and aria-checked on toggles'],
              ].map(([term, description]) => (
                <div key={term} className="flex items-baseline justify-between gap-4 border border-ash-800 bg-ash-900 px-3 py-2">
                  <dt className="text-ash-500">{term}</dt>
                  <dd className="text-right font-mono text-[11px] text-ash-300">{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {activeTab === 'craft' && (
          <AntiCrutchAuditor component={component} props={currentProps} />
        )}
      </div>
    </aside>
  );
}
