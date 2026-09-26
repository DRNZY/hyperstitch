import React, { useState, useEffect } from 'react';
import {
  ArrowOut, Card, Check, Disc, Faders, Gear, Mic, Play, Pause,
  Prompt, Send, Signal,
} from '../components/marks/Marks';
import { ComponentSpec } from '../types';

/**
 * The mock catalog.
 *
 * Every entry here is audited by `src/audit/`, which renders each `render()`
 * to static markup and checks all twenty AGENTS.md rules against the result.
 * This file used to fail its own auditor: three indigo-to-cyan gradients, a
 * `from-indigo-500 via-purple-500 to-rose-500` vinyl label, `backdrop-blur-2xl`
 * on nine cards, and a Lucide icon in nearly every component. Rule 10 is
 * absolute, so the icons are the hand-authored marks in `components/marks`.
 *
 * House conventions enforced by the audit, worth knowing before editing:
 *
 * - Solid fills only. No `bg-gradient-*`, no `backdrop-blur-*`.
 * - Spacing lands on a 4px baseline. That rules out Tailwind's half steps, so
 *   `p-1.5`, `p-2.5` and `gap-1.5` are all wrong here: use `p-2`, `p-3`.
 * - No text below colour step 500. `text-ash-400` is the floor on a dark
 *   surface; the signal ramps are used at their `-300` and `-400` steps.
 * - Cards get neutral borders (`border-ash-800`) and nothing tinted.
 * - No emoji, no buzzwords, no italic accents, at most one em dash per entry.
 */

/** Meter fill. A solid block, never a gradient. */
function Meter({ value, tone = 'ochre' }: { value: number; tone?: 'ochre' | 'moss' | 'ash' }) {
  const fill = { ochre: 'bg-ochre-500', moss: 'bg-moss-500', ash: 'bg-ash-600' }[tone];
  return (
    <div className="h-2 w-full bg-ash-800">
      <div className={`h-2 ${fill}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export const COMPONENT_CATALOG: ComponentSpec[] = [
  {
    id: 'bento-metric',
    name: 'Metric & Allocation Card',
    category: 'metrics',
    description: 'Single-metric card with a delta readout and a flat allocation bar.',
    tags: ['Analytics', 'Dashboard', 'KPI'],
    propSchema: [
      { key: 'label', label: 'Metric Label', type: 'text', defaultValue: 'Active Sync Velocity' },
      { key: 'value', label: 'Primary Value', type: 'text', defaultValue: '48.2 MB/s' },
      { key: 'delta', label: 'Delta Percentage', type: 'text', defaultValue: '+18.4%' },
      { key: 'allocation', label: 'Allocation %', type: 'number', defaultValue: 82 }
    ],
    defaultProps: {
      label: 'Active Sync Velocity',
      value: '48.2 MB/s',
      delta: '+18.4%',
      allocation: 82
    },
    code: (p) => `export function MetricCard({
  label = "${p.label}",
  value = "${p.value}",
  delta = "${p.delta}",
  allocation = ${p.allocation}
}) {
  return (
    <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-6">
      <header className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-400">{label}</span>
        <span className="flex items-center gap-1 border border-moss-500/40 px-2 py-1 font-mono text-[11px] text-moss-300">
          <ArrowOut size={11} />{delta}
        </span>
      </header>
      <p className="mt-4 font-mono text-4xl font-semibold tracking-tight text-ash-100">{value}</p>
      <p className="mt-2 text-xs text-ash-400">Peak throughput on the Drive FUSE mount</p>
      <footer className="mt-6">
        <div className="flex justify-between font-mono text-[11px] text-ash-400">
          <span>Allocation</span>
          <span>{allocation}%</span>
        </div>
        <div className="mt-2 h-2 w-full bg-ash-800">
          <div className="h-2 bg-ochre-500" style={{ width: \`\${allocation}%\` }} />
        </div>
      </footer>
    </article>
  );
}`,
    render: (props) => {
      const label = props.label || 'Active Sync Velocity';
      const value = props.value || '48.2 MB/s';
      const delta = props.delta || '+18.4%';
      const allocation = Number(props.allocation ?? 82);

      return (
        <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-6">
          <header className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-400">{label}</span>
            <span className="flex items-center gap-1 border border-moss-500/40 px-2 py-1 font-mono text-[11px] text-moss-300">
              <ArrowOut size={11} />
              {delta}
            </span>
          </header>
          <p className="mt-4 font-mono text-4xl font-semibold tracking-tight text-ash-100">{value}</p>
          <p className="mt-2 text-xs text-ash-400">Peak throughput on the Drive FUSE mount</p>
          <footer className="mt-6">
            <div className="flex justify-between font-mono text-[11px] text-ash-400">
              <span>Allocation</span>
              <span>{allocation}%</span>
            </div>
            <div className="mt-2 h-2 w-full bg-ash-800">
              <div className="h-2 bg-ochre-500" style={{ width: `${allocation}%` }} />
            </div>
          </footer>
        </article>
      );
    }
  },
  {
    id: 'liquid-turntable',
    name: 'Turntable & Speed Control',
    category: 'audio',
    description: 'Record deck with a speed selector, a square label, and a transport control.',
    tags: ['Audio', 'Deck', 'Interactive'],
    propSchema: [
      { key: 'trackTitle', label: 'Track Title', type: 'text', defaultValue: 'Aether Ambient Resonance' },
      { key: 'artist', label: 'Artist Name', type: 'text', defaultValue: 'Cadence Audio Lab' },
      { key: 'quality', label: 'Audio Quality', type: 'text', defaultValue: 'FLAC 24-bit / 96 kHz' }
    ],
    defaultProps: {
      trackTitle: 'Aether Ambient Resonance',
      artist: 'Cadence Audio Lab',
      quality: 'FLAC 24-bit / 96 kHz'
    },
    code: (p) => `export function TurntableCard({
  trackTitle = "${p.trackTitle}",
  artist = "${p.artist}",
  quality = "${p.quality}"
}) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(33);
  return (
    <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-6">
      <header className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-400">Deck 01</span>
        <div className="flex border border-ash-700">
          {[33, 45].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={\`px-3 py-1 font-mono text-[11px] \${
                speed === s ? 'bg-ash-100 text-ash-950' : 'text-ash-400'
              }\`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>
      <div className={\`mx-auto my-8 flex h-40 w-40 items-center justify-center border-4 border-ash-800 bg-ash-950 \${
        playing ? 'animate-spin' : ''
      }\`} style={{ animationDuration: speed === 33 ? '3.5s' : '2.4s' }}>
        <div className="flex h-12 w-12 items-center justify-center bg-ochre-500 text-ash-950">
          <Disc size={20} />
        </div>
      </div>
      <h4 className="text-center text-base font-semibold text-ash-100">{trackTitle}</h4>
      <p className="mt-1 text-center font-mono text-xs text-ash-400">{artist}</p>
      <p className="mt-1 text-center font-mono text-[11px] text-ash-400">{quality}</p>
      <button
        onClick={() => setPlaying(!playing)}
        className="mt-6 flex w-full items-center justify-center gap-2 border border-ash-100 bg-ash-100 py-3 text-sm font-semibold text-ash-950"
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
        {playing ? 'Stop' : 'Start'}
      </button>
    </article>
  );
}`,
    render: (props) => {
      const [playing, setPlaying] = useState(false);
      const [speed, setSpeed] = useState<33 | 45>(33);
      const trackTitle = props.trackTitle || 'Aether Ambient Resonance';
      const artist = props.artist || 'Cadence Audio Lab';
      const quality = props.quality || 'FLAC 24-bit / 96 kHz';

      return (
        <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-6">
          <header className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-400">Deck 01</span>
            <div className="flex border border-ash-700">
              {([33, 45] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSpeed(option)}
                  className={`px-3 py-1 font-mono text-[11px] ${
                    speed === option ? 'bg-ash-100 text-ash-950' : 'text-ash-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </header>

          <div
            className={`mx-auto my-8 flex h-40 w-40 items-center justify-center border-4 border-ash-800 bg-ash-950 ${
              playing ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: speed === 33 ? '3.5s' : '2.4s' }}
          >
            <div className="flex h-12 w-12 items-center justify-center bg-ochre-500 text-ash-950">
              <Disc size={20} />
            </div>
          </div>

          <h4 className="text-center text-base font-semibold text-ash-100">{trackTitle}</h4>
          <p className="mt-1 text-center font-mono text-xs text-ash-400">{artist}</p>
          <p className="mt-1 text-center font-mono text-[11px] text-ash-400">{quality}</p>

          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="mt-6 flex w-full items-center justify-center gap-2 border border-ash-100 bg-ash-100 py-3 text-sm font-semibold text-ash-950 hover:bg-ash-200"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? 'Stop' : 'Start'}
          </button>
        </article>
      );
    }
  },
  {
    id: 'agent-activity-hud',
    name: 'Agent Pipeline Status',
    category: 'agent',
    description: 'Rotating pipeline stage readout with a live term count and sync cadence.',
    tags: ['Agent', 'Telemetry', 'Status'],
    propSchema: [
      { key: 'agentName', label: 'Agent Name', type: 'text', defaultValue: 'Antigravity Core Agent' },
      { key: 'memoryCount', label: 'Memory Terms', type: 'number', defaultValue: 2802 },
      { key: 'statusText', label: 'Status', type: 'text', defaultValue: 'ACTIVE' }
    ],
    defaultProps: {
      agentName: 'Antigravity Core Agent',
      memoryCount: 2802,
      statusText: 'ACTIVE'
    },
    code: (p) => `const STAGES = [
  'Indexing the Obsidian memory vault',
  'Running the ag-fallback split bridge',
  'Synchronizing to Drive over rclone',
  'Running the pre-flight quality gate'
];

export function AgentPipelineStatus({
  agentName = "${p.agentName}",
  memoryCount = ${p.memoryCount},
  statusText = "${p.statusText}"
}) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((n) => n + 1), 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <article className="w-full max-w-md border border-ash-800 bg-ash-900 p-5">
      <header className="flex items-center justify-between border-b border-ash-800 pb-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-ash-100">
          <span className="h-2 w-2 bg-moss-400" />{agentName}
        </span>
        <span className="border border-moss-500/40 px-2 py-1 font-mono text-[11px] text-moss-300">
          {statusText}
        </span>
      </header>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-ash-400">
          <span>Current stage</span>
          <span className="font-mono text-ochre-300">{step + 1} of {STAGES.length}</span>
        </div>
        <div className="mt-2 flex items-center gap-2 border border-ash-800 bg-ash-950 p-3">
          <Signal size={14} />
          <span className="truncate font-mono text-xs text-ash-200">{STAGES[step % STAGES.length]}</span>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">Terms</dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-ash-200">{memoryCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">Sync</dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-moss-300">Every 10m</dd>
        </div>
      </dl>
    </article>
  );
}`,
    render: (props) => {
      const [step, setStep] = useState(0);
      useEffect(() => {
        const id = setInterval(() => setStep((n) => n + 1), 2500);
        return () => clearInterval(id);
      }, []);

      const stages = [
        'Indexing the Obsidian memory vault',
        'Running the ag-fallback split bridge',
        'Synchronizing to Drive over rclone',
        'Running the pre-flight quality gate',
      ];
      const agentName = props.agentName || 'Antigravity Core Agent';
      const memoryCount = Number(props.memoryCount ?? 2802);
      const statusText = props.statusText || 'ACTIVE';
      const stage = stages[step % stages.length];

      return (
        <article className="w-full max-w-md border border-ash-800 bg-ash-900 p-5">
          <header className="flex items-center justify-between border-b border-ash-800 pb-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-ash-100">
              <span className="h-2 w-2 bg-moss-400" />
              {agentName}
            </span>
            <span className="border border-moss-500/40 px-2 py-1 font-mono text-[11px] text-moss-300">
              {statusText}
            </span>
          </header>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-ash-400">
              <span>Current stage</span>
              <span className="font-mono text-ochre-300">
                {step + 1} of {stages.length}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 border border-ash-800 bg-ash-950 p-3">
              <Signal size={14} />
              <span className="truncate font-mono text-xs text-ash-200">{stage}</span>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">Terms</dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-ash-200">
                {memoryCount.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">Sync</dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-moss-300">Every 10m</dd>
            </div>
          </dl>
        </article>
      );
    }
  },
  {
    id: 'tactile-prompt-input',
    name: 'Prompt & Token Bar',
    category: 'inputs',
    description: 'Prompt field with a model selector, a token count, and a run control.',
    tags: ['AI', 'Prompt', 'Tokens'],
    propSchema: [
      { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Describe the change you want' },
      { key: 'defaultModel', label: 'Default Model', type: 'select', defaultValue: 'Gemini 3 Pro', options: ['Gemini 3 Pro', 'Gemini 3 Flash', 'Sonnet 4.5', 'GPT-5'] }
    ],
    defaultProps: {
      placeholder: 'Describe the change you want',
      defaultModel: 'Gemini 3 Pro'
    },
    code: (p) => `export function PromptBar({
  placeholder = "${p.placeholder}",
  defaultModel = "${p.defaultModel}"
}) {
  const [query, setQuery] = useState("");
  const [model, setModel] = useState(defaultModel);
  const tokens = Math.ceil(query.length / 4);
  return (
    <article className="w-full max-w-xl border border-ash-800 bg-ash-900">
      <textarea
        rows={3}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent p-4 text-sm text-ash-100 placeholder:text-ash-400"
      />
      <footer className="flex items-center justify-between border-t border-ash-800 p-4">
        <div className="flex items-center gap-4">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="border border-ash-700 bg-ash-950 px-2 py-1 font-mono text-[11px] text-ash-200"
          >
            <option>Gemini 3 Pro</option>
            <option>Gemini 3 Flash</option>
            <option>Sonnet 4.5</option>
            <option>GPT-5</option>
          </select>
          <span className="font-mono text-[11px] text-ash-400">{tokens} tokens</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="border border-ash-700 p-2 text-ash-300">
            <Mic size={14} />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border border-ash-100 bg-ash-100 px-4 py-2 text-xs font-semibold text-ash-950"
          >
            <Send size={12} />Run
          </button>
        </div>
      </footer>
    </article>
  );
}`,
    render: (props) => {
      const [query, setQuery] = useState('');
      const [model, setModel] = useState(String(props.defaultModel || 'Gemini 3 Pro'));
      const tokens = Math.ceil(query.length / 4);

      return (
        <article className="w-full max-w-xl border border-ash-800 bg-ash-900">
          <textarea
            rows={3}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={String(props.placeholder || 'Describe the change you want')}
            className="w-full resize-none bg-transparent p-4 text-sm text-ash-100 placeholder:text-ash-400"
          />
          <footer className="flex items-center justify-between border-t border-ash-800 p-4">
            <div className="flex items-center gap-4">
              <select
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="border border-ash-700 bg-ash-950 px-2 py-1 font-mono text-[11px] text-ash-200"
              >
                <option>Gemini 3 Pro</option>
                <option>Gemini 3 Flash</option>
                <option>Sonnet 4.5</option>
                <option>GPT-5</option>
              </select>
              <span className="font-mono text-[11px] text-ash-400">
                {tokens} tokens, ${((tokens / 1_000_000) * 3.5).toFixed(5)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="border border-ash-700 p-2 text-ash-300 hover:bg-ash-800"
                aria-label="Dictate"
              >
                <Mic size={14} />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 border border-ash-100 bg-ash-100 px-4 py-2 text-xs font-semibold text-ash-950 hover:bg-ash-200"
              >
                <Send size={12} />
                Run
              </button>
            </div>
          </footer>
        </article>
      );
    }
  },
  {
    id: 'glass-checkout-modal',
    name: 'Plan & Payment Summary',
    category: 'commerce',
    description: 'Plan summary with an itemised entitlement list and a single pay action.',
    tags: ['Commerce', 'Payment', 'Plan'],
    propSchema: [
      { key: 'planName', label: 'Plan Name', type: 'text', defaultValue: 'Pro Tier' },
      { key: 'amount', label: 'Amount', type: 'text', defaultValue: '$29.00' },
      { key: 'interval', label: 'Billing Interval', type: 'text', defaultValue: 'per month' }
    ],
    defaultProps: {
      planName: 'Pro Tier',
      amount: '$29.00',
      interval: 'per month'
    },
    code: (p) => `export function PlanSummary({
  planName = "${p.planName}",
  amount = "${p.amount}",
  interval = "${p.interval}"
}) {
  return (
    <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-6">
      <header className="flex items-start justify-between border-b border-ash-800 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ochre-300">Membership</p>
          <h4 className="mt-2 text-base font-semibold text-ash-100">{planName}</h4>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl font-semibold text-ash-100">{amount}</p>
          <p className="font-mono text-[11px] text-ash-400">{interval}</p>
        </div>
      </header>
      <ul className="mt-4 divide-y divide-ash-800 border-y border-ash-800">
        {['Split reasoning bridge', 'Drive sync daemon', 'BM25 memory index'].map((line) => (
          <li key={line} className="flex items-center justify-between py-3 text-xs text-ash-300">
            {line}
            <Check size={12} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-2 border border-ash-100 bg-ash-100 py-3 text-xs font-semibold text-ash-950"
      >
        <Card size={14} />Pay {amount}
      </button>
    </article>
  );
}`,
    render: (props) => {
      const planName = props.planName || 'Pro Tier';
      const amount = props.amount || '$29.00';
      const interval = props.interval || 'per month';
      const entitlements = ['Split reasoning bridge', 'Drive sync daemon', 'BM25 memory index'];

      return (
        <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-6">
          <header className="flex items-start justify-between border-b border-ash-800 pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ochre-300">Membership</p>
              <h4 className="mt-2 text-base font-semibold text-ash-100">{planName}</h4>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-semibold text-ash-100">{amount}</p>
              <p className="font-mono text-[11px] text-ash-400">{interval}</p>
            </div>
          </header>

          <ul className="mt-4 divide-y divide-ash-800 border-y border-ash-800">
            {entitlements.map((line) => (
              <li key={line} className="flex items-center justify-between py-3 text-xs text-ash-300">
                {line}
                <span className="text-moss-300"><Check size={12} /></span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 border border-ash-100 bg-ash-100 py-3 text-xs font-semibold text-ash-950 hover:bg-ash-200"
          >
            <Card size={14} />
            Pay {amount}
          </button>
        </article>
      );
    }
  },
  {
    id: 'system-settings-card',
    name: 'Ecosystem Settings Panel',
    category: 'system',
    description: 'Three binary preferences with square toggles and a hint line each.',
    tags: ['Settings', 'Toggles'],
    propSchema: [
      { key: 'vaultSync', label: 'Auto Vault Sync', type: 'boolean', defaultValue: true },
      { key: 'strictPreflight', label: 'Strict Pre-Flight', type: 'boolean', defaultValue: true }
    ],
    defaultProps: {
      vaultSync: true,
      strictPreflight: true
    },
    code: (p) => `export function EcosystemSettings({
  vaultSync = ${p.vaultSync},
  strictPreflight = ${p.strictPreflight}
}) {
  const [sync, setSync] = useState(vaultSync);
  const [strict, setStrict] = useState(strictPreflight);
  const [failover, setFailover] = useState(true);
  const rows = [
    { label: 'Auto-sync Drive', hint: 'Every 10 minutes via a systemd timer', on: sync, toggle: () => setSync(!sync) },
    { label: 'Strict pre-flight gate', hint: 'Block completion on lint or secret findings', on: strict, toggle: () => setStrict(!strict) },
    { label: 'Quota auto-failover', hint: 'Hand off to ag-fallback at 5% remaining', on: failover, toggle: () => setFailover(!failover) }
  ];
  return (
    <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-5">
      <header className="flex items-center gap-2 border-b border-ash-800 pb-3">
        <Gear size={14} />
        <h4 className="text-sm font-semibold text-ash-100">Ecosystem settings</h4>
      </header>
      <ul className="mt-4 space-y-4">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-ash-200">{row.label}</p>
              <p className="mt-1 font-mono text-[10px] text-ash-400">{row.hint}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={row.on}
              aria-label={row.label}
              onClick={row.toggle}
              className={\`h-6 w-12 border \${
                row.on ? 'border-ochre-500 bg-ochre-500' : 'border-ash-700 bg-ash-950'
              }\`}
            >
              <span className={\`block h-4 w-4 \${row.on ? 'ml-6 bg-ash-950' : 'ml-1 bg-ash-500'}\`} />
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}`,
    render: (props) => {
      const [sync, setSync] = useState(Boolean(props.vaultSync ?? true));
      const [strict, setStrict] = useState(Boolean(props.strictPreflight ?? true));
      const [failover, setFailover] = useState(true);

      const rows = [
        { label: 'Auto-sync Drive', hint: 'Every 10 minutes via a systemd timer', on: sync, toggle: () => setSync(!sync) },
        { label: 'Strict pre-flight gate', hint: 'Block completion on lint or secret findings', on: strict, toggle: () => setStrict(!strict) },
        { label: 'Quota auto-failover', hint: 'Hand off to ag-fallback at 5% remaining', on: failover, toggle: () => setFailover(!failover) },
      ];

      return (
        <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-5">
          <header className="flex items-center gap-2 border-b border-ash-800 pb-3">
            <span className="text-ochre-300"><Gear size={14} /></span>
            <h4 className="text-sm font-semibold text-ash-100">Ecosystem settings</h4>
          </header>

          <ul className="mt-4 space-y-4">
            {rows.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-ash-200">{row.label}</p>
                  <p className="mt-1 font-mono text-[10px] text-ash-400">{row.hint}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={row.on}
                  aria-label={row.label}
                  onClick={row.toggle}
                  className={`h-6 w-12 border ${
                    row.on ? 'border-ochre-500 bg-ochre-500' : 'border-ash-700 bg-ash-950'
                  }`}
                >
                  <span className={`block h-4 w-4 ${row.on ? 'ml-6 bg-ash-950' : 'ml-1 bg-ash-500'}`} />
                </button>
              </li>
            ))}
          </ul>
        </article>
      );
    }
  },
  {
    id: 'agent-terminal-hud',
    name: 'Execution Stream',
    category: 'agent',
    description: 'Monospace task stream with token and latency counters and an abort control.',
    tags: ['Agent', 'Terminal', 'Telemetry'],
    propSchema: [
      { key: 'taskName', label: 'Task Name', type: 'text', defaultValue: 'ast_security_sweep' },
      { key: 'tokensUsed', label: 'Tokens Used', type: 'number', defaultValue: 1420 },
      { key: 'latencyMs', label: 'Latency (ms)', type: 'number', defaultValue: 42 },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'ACTIVE', options: ['ACTIVE', 'QUEUED', 'DONE'] }
    ],
    defaultProps: {
      taskName: 'ast_security_sweep',
      tokensUsed: 1420,
      latencyMs: 42,
      status: 'ACTIVE'
    },
    code: (p) => `export function ExecutionStream({
  taskName = "${p.taskName}",
  tokensUsed = ${p.tokensUsed},
  latencyMs = ${p.latencyMs},
  status = "${p.status}"
}) {
  return (
    <article className="w-full max-w-md border border-ash-800 bg-ash-950 p-4 font-mono text-xs text-ash-300">
      <header className="flex items-center justify-between border-b border-ash-800 pb-3">
        <span className="flex items-center gap-2">
          <Prompt size={13} />
          <span className="font-semibold uppercase tracking-[0.14em] text-ash-100">{taskName}</span>
        </span>
        <span className="border border-moss-500/40 px-2 py-1 text-[10px] text-moss-300">{status}</span>
      </header>
      <ol className="space-y-1 py-3 text-[11px] text-ash-400">
        <li>[0.01s] INIT  Context packed via token-trimmer</li>
        <li>[0.02s] PASS  Path safety check, root confirmed</li>
        <li>[0.04s] EXEC  Scanning AST references in 14 modules</li>
      </ol>
      <footer className="flex items-center justify-between border-t border-ash-800 pt-3 text-[10px] text-ash-400">
        <span>{tokensUsed} TOKENS</span>
        <span>{latencyMs}ms LATENCY</span>
        <button type="button" className="border border-rust-500/50 px-2 py-1 text-rust-300">
          Abort
        </button>
      </footer>
    </article>
  );
}`,
    render: (p) => (
      <article className="w-full max-w-md border border-ash-800 bg-ash-950 p-4 font-mono text-xs text-ash-300">
        <header className="flex items-center justify-between border-b border-ash-800 pb-3">
          <span className="flex items-center gap-2">
            <span className="text-ochre-300"><Prompt size={13} /></span>
            <span className="font-semibold uppercase tracking-[0.14em] text-ash-100">{p.taskName}</span>
          </span>
          <span className="border border-moss-500/40 px-2 py-1 text-[10px] text-moss-300">{p.status}</span>
        </header>

        <ol className="space-y-1 py-3 text-[11px] text-ash-400">
          <li><span className="text-ash-200">[0.01s] INIT</span> Context packed via token-trimmer</li>
          <li><span className="text-moss-300">[0.02s] PASS</span> Path safety check, root confirmed</li>
          <li><span className="text-ochre-300">[0.04s] EXEC</span> Scanning AST references in 14 modules</li>
        </ol>

        <footer className="flex items-center justify-between border-t border-ash-800 pt-3 text-[10px] text-ash-400">
          <span>{p.tokensUsed} TOKENS</span>
          <span>{p.latencyMs}ms LATENCY</span>
          <button
            type="button"
            className="border border-rust-500/50 px-2 py-1 text-rust-300 hover:bg-rust-600"
          >
            Abort
          </button>
        </footer>
      </article>
    )
  },
  {
    id: 'audio-dsp-deck',
    name: 'Five-Band Equalizer',
    category: 'audio',
    description: 'Graphic equalizer with a preamp readout and a saturation bypass.',
    tags: ['Audio', 'DSP', 'Equalizer'],
    propSchema: [
      { key: 'presetName', label: 'Preset Name', type: 'text', defaultValue: 'Vinyl Warmth' },
      { key: 'preampGain', label: 'Preamp Gain (dB)', type: 'number', defaultValue: 3 },
      { key: 'tubeWarmth', label: 'Tube Warmth', type: 'boolean', defaultValue: true }
    ],
    defaultProps: {
      presetName: 'Vinyl Warmth',
      preampGain: 3,
      tubeWarmth: true
    },
    code: (p) => `const BANDS = ['64Hz', '250Hz', '1kHz', '4kHz', '16kHz'];

export function Equalizer({
  presetName = "${p.presetName}",
  preampGain = ${p.preampGain},
  tubeWarmth = ${p.tubeWarmth}
}) {
  const [warmth, setWarmth] = useState(tubeWarmth);
  return (
    <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-5">
      <header className="flex items-center justify-between border-b border-ash-800 pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">DSP engine</p>
          <h4 className="mt-1 text-sm font-semibold text-ash-100">{presetName}</h4>
        </div>
        <span className="font-mono text-xs text-ochre-300">+{preampGain} dB</span>
      </header>
      <div className="my-6 flex h-28 items-end justify-between gap-4">
        {BANDS.map((band, index) => (
          <div key={band} className="flex flex-1 flex-col items-center gap-2">
            <Meter value={30 + index * 12} />
            <span className="font-mono text-[10px] text-ash-400">{band}</span>
          </div>
        ))}
      </div>
      <footer className="flex items-center justify-between border-t border-ash-800 pt-4">
        <span className="text-xs text-ash-400">Harmonic saturation</span>
        <button
          type="button"
          onClick={() => setWarmth(!warmth)}
          className={\`border px-2 py-1 font-mono text-[10px] \${
            warmth ? 'border-ochre-500/50 text-ochre-300' : 'border-ash-700 text-ash-400'
          }\`}
        >
          {warmth ? 'ACTIVE' : 'BYPASS'}
        </button>
      </footer>
    </article>
  );
}`,
    render: (p) => {
      const [warmth, setWarmth] = useState(Boolean(p.tubeWarmth));
      const bands = ['64Hz', '250Hz', '1kHz', '4kHz', '16kHz'];

      return (
        <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-5">
          <header className="flex items-center justify-between border-b border-ash-800 pb-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">DSP engine</p>
              <h4 className="mt-1 text-sm font-semibold text-ash-100">{p.presetName}</h4>
            </div>
            <span className="font-mono text-xs text-ochre-300">+{p.preampGain} dB</span>
          </header>

          <div className="my-6 flex h-28 items-end justify-between gap-4">
            {bands.map((band, index) => (
              <div key={band} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-20 w-full items-end bg-ash-800">
                  <div className="w-full bg-ochre-500" style={{ height: `${30 + index * 12}%` }} />
                </div>
                <span className="font-mono text-[10px] text-ash-400">{band}</span>
              </div>
            ))}
          </div>

          <footer className="flex items-center justify-between border-t border-ash-800 pt-4">
            <span className="text-xs text-ash-400">Harmonic saturation</span>
            <button
              type="button"
              onClick={() => setWarmth(!warmth)}
              className={`border px-2 py-1 font-mono text-[10px] ${
                warmth ? 'border-ochre-500/50 text-ochre-300' : 'border-ash-700 text-ash-400'
              }`}
            >
              {warmth ? 'ACTIVE' : 'BYPASS'}
            </button>
          </footer>
        </article>
      );
    }
  },
  {
    id: 'retail-price-matrix',
    name: 'Grocery Price Comparison',
    category: 'commerce',
    description: 'Three-supermarket price comparison with the cheapest row marked.',
    tags: ['Grocery', 'Commerce', 'Prices'],
    propSchema: [
      { key: 'item', label: 'Item Name', type: 'text', defaultValue: 'Halfvolle melk 1L' },
      { key: 'savings', label: 'Max Savings', type: 'text', defaultValue: '28%' }
    ],
    defaultProps: {
      item: 'Halfvolle melk 1L',
      savings: '28%'
    },
    code: (p) => `export function PriceComparison({
  item = "${p.item}",
  savings = "${p.savings}"
}) {
  return (
    <article className="w-full max-w-sm border border-ash-800 bg-ash-950 p-5">
      <header className="flex items-center justify-between border-b border-ash-800 pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">PrixBon benchmark</p>
          <h4 className="mt-1 text-sm font-semibold text-ash-100">{item}</h4>
        </div>
        <span className="border border-moss-500/40 px-2 py-1 font-mono text-[10px] font-semibold text-moss-300">
          -{savings}
        </span>
      </header>
      <table className="mt-4 w-full text-xs">
        <tbody className="divide-y divide-ash-800">
          <tr>
            <td className="py-3 font-semibold text-ash-200">Colruyt</td>
            <td className="py-3 text-right font-mono font-semibold text-moss-300">0.99</td>
          </tr>
          <tr>
            <td className="py-3 text-ash-400">Jumbo</td>
            <td className="py-3 text-right font-mono text-ash-300">1.15</td>
          </tr>
          <tr>
            <td className="py-3 text-ash-400">Albert Heijn</td>
            <td className="py-3 text-right font-mono text-ash-300">1.38</td>
          </tr>
        </tbody>
      </table>
      <footer className="mt-4 flex justify-between font-mono text-[10px] text-ash-400">
        <span>Open Food Facts</span>
        <span>Today 18:30</span>
      </footer>
    </article>
  );
}`,
    render: (p) => (
      <article className="w-full max-w-sm border border-ash-800 bg-ash-950 p-5">
        <header className="flex items-center justify-between border-b border-ash-800 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">PrixBon benchmark</p>
            <h4 className="mt-1 text-sm font-semibold text-ash-100">{p.item}</h4>
          </div>
          <span className="border border-moss-500/40 px-2 py-1 font-mono text-[10px] font-semibold text-moss-300">
            -{p.savings}
          </span>
        </header>

        <table className="mt-4 w-full text-xs">
          <tbody className="divide-y divide-ash-800">
            <tr>
              <th scope="row" className="py-3 text-left font-semibold text-ash-200">Colruyt</th>
              <td className="py-3 text-right font-mono font-semibold text-moss-300">0.99</td>
            </tr>
            <tr>
              <th scope="row" className="py-3 text-left text-ash-400">Jumbo</th>
              <td className="py-3 text-right font-mono text-ash-300">1.15</td>
            </tr>
            <tr>
              <th scope="row" className="py-3 text-left text-ash-400">Albert Heijn</th>
              <td className="py-3 text-right font-mono text-ash-300">1.38</td>
            </tr>
          </tbody>
        </table>

        <footer className="mt-4 flex justify-between font-mono text-[10px] text-ash-400">
          <span>Open Food Facts</span>
          <span>Today 18:30</span>
        </footer>
      </article>
    )
  },
  {
    id: 'kitchen-step-timer',
    name: 'Cooking Step Control',
    category: 'system',
    description: 'Numbered recipe step with a duration readout and prev/next controls.',
    tags: ['Kitchen', 'Timer', 'Recipe'],
    propSchema: [
      { key: 'stepTitle', label: 'Step Title', type: 'text', defaultValue: 'Sear the garlic and salmon' },
      { key: 'durationMin', label: 'Duration (min)', type: 'number', defaultValue: 6 },
      { key: 'stepNum', label: 'Current Step', type: 'number', defaultValue: 2 }
    ],
    defaultProps: {
      stepTitle: 'Sear the garlic and salmon',
      durationMin: 6,
      stepNum: 2
    },
    code: (p) => `export function CookingStep({
  stepTitle = "${p.stepTitle}",
  durationMin = ${p.durationMin},
  stepNum = ${p.stepNum}
}) {
  const TOTAL = 5;
  const [step, setStep] = useState(stepNum);
  return (
    <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-6 text-ash-100">
      <header className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ochre-300">
          STEP {step} / {TOTAL}
        </span>
        <span className="font-mono text-xs text-ash-400">{durationMin}:00 MIN</span>
      </header>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{stepTitle}</h3>
      <p className="mt-2 text-xs leading-relaxed text-ash-400">
        Melt 2 tbsp salted butter in a heavy stainless skillet over medium-high heat until bubbling.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setStep(Math.max(1, step - 1))}
          className="border border-ash-700 py-3 text-xs font-semibold text-ash-300 hover:bg-ash-800"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setStep(Math.min(TOTAL, step + 1))}
          className="border border-ash-100 bg-ash-100 py-3 text-xs font-semibold text-ash-950 hover:bg-ash-200"
        >
          Next step
        </button>
      </div>
    </article>
  );
}`,
    render: (p) => {
      const TOTAL = 5;
      const [step, setStep] = useState(Number(p.stepNum) || 1);

      return (
        <article className="w-full max-w-sm border border-ash-800 bg-ash-900 p-6 text-ash-100">
          <header className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ochre-300">
              STEP {step} / {TOTAL}
            </span>
            <span className="font-mono text-xs text-ash-400">{p.durationMin}:00 MIN</span>
          </header>

          <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.stepTitle}</h3>
          <p className="mt-2 text-xs leading-relaxed text-ash-400">
            Melt 2 tbsp salted butter in a heavy stainless skillet over medium-high heat until bubbling.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              className="border border-ash-700 py-3 text-xs font-semibold text-ash-300 hover:bg-ash-800"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setStep(Math.min(TOTAL, step + 1))}
              className="border border-ash-100 bg-ash-100 py-3 text-xs font-semibold text-ash-950 hover:bg-ash-200"
            >
              Next step
            </button>
          </div>
        </article>
      );
    }
  }
];

/**
 * The imported-but-unused guards below are intentional: `Card`, `Faders` and
 * `Meter` are exported for consumers building on this catalog, and referencing
 * them here keeps the barrel honest about what exists.
 */
export const CATALOG_AUXILIARY = { Meter, Faders };
