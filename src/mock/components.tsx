import React, { useState, useEffect } from 'react';
import { 
  Activity, ArrowUpRight, CheckCircle2, Disc3, 
  Layers, Play, Pause, RefreshCw, ShieldCheck, Sparkles, 
  Terminal, Zap, DollarSign, ShoppingBag, Cpu, Sliders,
  Send, Mic, Volume2, HardDrive, Compass, CreditCard,
  Check, Copy, Settings, Bell, Lock
} from 'lucide-react';
import { ComponentSpec } from '../types';

export const COMPONENT_CATALOG: ComponentSpec[] = [
  {
    id: 'bento-metric',
    name: 'Bento Metric & Sparkline Card',
    category: 'metrics',
    description: 'High-density metrics card with animated delta pill, sparkline vector, and tactile hover elevation.',
    tags: ['Analytics', 'Finance', 'Dashboard', 'KPI'],
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
    code: (p) => `export function BentoMetricCard({
  label = "${p.label}",
  value = "${p.value}",
  delta = "${p.delta}",
  allocation = ${p.allocation}
}) {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-900/80 p-6 backdrop-blur-2xl transition-all hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          <ArrowUpRight className="h-3 w-3" /> {delta}
        </span>
      </div>
      <div className="mt-3">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        <p className="mt-1 text-xs text-zinc-500">Live throughput over Google Drive FUSE</p>
      </div>
      <div className="mt-5 space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
          <span>Bandwidth Allocation</span>
          <span>{allocation}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: \`\${allocation}%\` }} />
        </div>
      </div>
    </div>
  );
}`,
    render: (props) => {
      const p = {
        label: props.label || 'Active Sync Velocity',
        value: props.value || '48.2 MB/s',
        delta: props.delta || '+18.4%',
        allocation: props.allocation ?? 82
      };

      return (
        <div className="w-full max-w-sm rounded-3xl border border-white/[0.08] bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{p.label}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="h-3 w-3" /> {p.delta}
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold tracking-tight text-white">{p.value}</span>
            <p className="mt-1 text-xs text-zinc-500">Peak throughput over Google Drive FUSE</p>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
              <span>Bandwidth Allocation</span>
              <span>{p.allocation}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: `${p.allocation}%` }} />
            </div>
          </div>
        </div>
      );
    }
  },
  {
    id: 'liquid-turntable',
    name: 'Cadence Turntable & Audio Deck',
    category: 'audio',
    description: 'Interactive vinyl record player card with rotational speed toggling, live needle state, and tactile audio controls.',
    tags: ['Music', 'Audio', 'Cadence', 'Interactive'],
    propSchema: [
      { key: 'trackTitle', label: 'Track Title', type: 'text', defaultValue: 'Aether Ambient Resonance' },
      { key: 'artist', label: 'Artist Name', type: 'text', defaultValue: 'Cadence Audio Lab' },
      { key: 'quality', label: 'Audio Quality', type: 'text', defaultValue: 'FLAC 24-Bit / 96kHz Lossless' }
    ],
    defaultProps: {
      trackTitle: 'Aether Ambient Resonance',
      artist: 'Cadence Audio Lab',
      quality: 'FLAC 24-Bit / 96kHz Lossless'
    },
    code: (p) => `export function LiquidTurntableCard({
  trackTitle = "${p.trackTitle}",
  artist = "${p.artist}",
  quality = "${p.quality}"
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState(33);
  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/[0.08] bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-2xl">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[11px] font-mono uppercase text-zinc-400">Vinyl Deck 01</span>
        <div className="flex rounded-lg border border-white/[0.08] bg-zinc-900/60 p-0.5">
          <button onClick={() => setRpm(33)} className="px-2 py-0.5 text-[11px] font-mono rounded">33 RPM</button>
          <button onClick={() => setRpm(45)} className="px-2 py-0.5 text-[11px] font-mono rounded">45 RPM</button>
        </div>
      </div>
      <div className="relative my-4 flex items-center justify-center">
        <div className={\`flex h-44 w-44 items-center justify-center rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-2xl \${isPlaying ? 'animate-spin' : ''}\`}>
          <Disc3 className="h-8 w-8 text-white" />
        </div>
      </div>
      <h4 className="font-bold text-white text-base text-center">{trackTitle}</h4>
      <p className="text-xs text-zinc-400 text-center">{artist} • {quality}</p>
    </div>
  );
}`,
    render: (props) => {
      const [isPlaying, setIsPlaying] = useState(false);
      const [rpm, setRpm] = useState<33 | 45>(33);
      const trackTitle = props.trackTitle || 'Aether Ambient Resonance';
      const artist = props.artist || 'Cadence Audio Lab';
      const quality = props.quality || 'FLAC 24-Bit / 96kHz Lossless';

      return (
        <div className="w-full max-w-sm rounded-3xl border border-white/[0.08] bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">Vinyl Deck 01</span>
            <div className="flex rounded-lg border border-white/[0.08] bg-zinc-900/60 p-0.5">
              <button 
                onClick={() => setRpm(33)} 
                className={`px-2 py-0.5 text-[11px] font-mono rounded ${rpm === 33 ? 'bg-indigo-500 text-white font-bold' : 'text-zinc-400'}`}
              >
                33 RPM
              </button>
              <button 
                onClick={() => setRpm(45)} 
                className={`px-2 py-0.5 text-[11px] font-mono rounded ${rpm === 45 ? 'bg-indigo-500 text-white font-bold' : 'text-zinc-400'}`}
              >
                45 RPM
              </button>
            </div>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div 
              className={`relative flex h-44 w-44 items-center justify-center rounded-full bg-zinc-900 border-4 border-zinc-800/80 shadow-2xl transition-transform ${isPlaying ? 'animate-spin' : ''}`}
              style={{ animationDuration: rpm === 33 ? '3.5s' : '2.4s' }}
            >
              <div className="absolute inset-2 rounded-full border border-zinc-800" />
              <div className="absolute inset-5 rounded-full border border-zinc-800/60" />
              <div className="absolute inset-8 rounded-full border border-zinc-800/40" />
              <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 flex items-center justify-center text-white shadow-inner">
                <Disc3 className="h-6 w-6 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <h4 className="font-bold text-white text-base">{trackTitle}</h4>
            <p className="text-xs text-zinc-400">{artist} • {quality}</p>
          </div>

          <div className="mt-5 flex gap-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 py-2.5 text-sm font-semibold text-black transition-all active:scale-[0.98]"
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              {isPlaying ? 'Pause Motor' : 'Start Playback'}
            </button>
          </div>
        </div>
      );
    }
  },
  {
    id: 'agent-activity-hud',
    name: 'Agent Multi-Process HUD',
    category: 'agent',
    description: 'Live mission-control telemetry card tracking autonomous agents, task queues, and memory sync health.',
    tags: ['Agent', 'Blackboard', 'Telemetry', 'Status'],
    propSchema: [
      { key: 'agentName', label: 'Agent Name', type: 'text', defaultValue: 'Antigravity Core Agent' },
      { key: 'memoryCount', label: 'Memory Terms', type: 'number', defaultValue: 2802 },
      { key: 'statusText', label: 'Status Badge', type: 'text', defaultValue: 'ACTIVE' }
    ],
    defaultProps: {
      agentName: 'Antigravity Core Agent',
      memoryCount: 2802,
      statusText: 'ACTIVE'
    },
    code: (p) => `export function AgentActivityHUD({
  agentName = "${p.agentName}",
  memoryCount = ${p.memoryCount},
  statusText = "${p.statusText}"
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-900/90 p-5 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-sm text-white">{agentName}</span>
        </div>
        <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-mono text-emerald-400">
          {statusText}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <div className="rounded-xl bg-black/40 border border-white/[0.05] p-2.5 text-xs text-zinc-200 font-mono">
          Indexing Obsidian Memory ({memoryCount} terms)
        </div>
      </div>
    </div>
  );
}`,
    render: (props) => {
      const [tick, setTick] = useState(0);
      useEffect(() => {
        const t = setInterval(() => setTick(n => n + 1), 2500);
        return () => clearInterval(t);
      }, []);

      const stages = [
        'Indexing Obsidian Memory Vault',
        'Executing ag-fallback Split Bridge',
        'Synchronizing to Google Drive (rclone)',
        'Running Pre-Flight Quality Gate'
      ];
      const activeStage = stages[tick % stages.length];
      const agentName = props.agentName || 'Antigravity Core Agent';
      const memoryCount = props.memoryCount ?? 2802;
      const statusText = props.statusText || 'ACTIVE';

      return (
        <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-900/90 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-semibold text-sm text-white">{agentName}</span>
            </div>
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-mono font-medium text-emerald-400">
              {statusText}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Current Pipeline Stage</span>
                <span className="font-mono text-indigo-400">Step {tick % 4 + 1}/4</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-black/40 border border-white/[0.05] p-2.5 text-xs text-zinc-200 font-mono">
                <Activity className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                <span className="truncate">{activeStage}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Memory Cache</span>
                <span className="text-sm font-bold text-zinc-200 mt-0.5 block">{memoryCount.toLocaleString()} Terms</span>
              </div>
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Sync Daemon</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block">Every 10m</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    id: 'tactile-prompt-input',
    name: 'Tactile AI Prompt & Token Bar',
    category: 'inputs',
    description: 'Modern prompt input with live token counter, model pill switcher, and microphone animation.',
    tags: ['AI', 'Prompt', 'TokenTrimmer', 'Chat'],
    propSchema: [
      { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Ask Antigravity to build or refactor...' },
      { key: 'defaultModel', label: 'Default Model', type: 'select', defaultValue: 'Gemini 2.5 Pro', options: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'Claude 3.5 Sonnet', 'GPT-4o'] }
    ],
    defaultProps: {
      placeholder: 'Ask Antigravity to build or refactor...',
      defaultModel: 'Gemini 2.5 Pro'
    },
    code: (p) => `export function TactilePromptInput({
  placeholder = "${p.placeholder}",
  defaultModel = "${p.defaultModel}"
}) {
  const [query, setQuery] = useState("");
  const [model, setModel] = useState(defaultModel);
  const tokenEst = Math.ceil(query.length / 4);

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/[0.12] bg-zinc-950/90 p-2 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center gap-2 px-2 pt-1 pb-2">
        <textarea
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 px-2">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-mono text-indigo-300">
            {model}
          </span>
          <span className="text-[11px] font-mono text-zinc-500">~{tokenEst} tokens</span>
        </div>
        <button className="rounded-xl bg-white p-2 text-black hover:bg-zinc-200">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}`,
    render: (props) => {
      const [query, setQuery] = useState('');
      const [model, setModel] = useState(props.defaultModel || 'Gemini 2.5 Pro');
      const tokenEst = Math.ceil(query.length / 4);

      return (
        <div className="w-full max-w-xl rounded-2xl border border-white/[0.12] bg-zinc-950/90 p-3 shadow-2xl backdrop-blur-2xl">
          <textarea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={props.placeholder || 'Ask Antigravity to build, refactor, or test...'}
            className="w-full resize-none bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 mt-1">
            <div className="flex items-center gap-2">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="rounded-lg bg-zinc-900 border border-white/[0.08] px-2 py-1 text-[11px] font-mono text-zinc-300 focus:outline-none"
              >
                <option>Gemini 2.5 Pro</option>
                <option>Gemini 2.5 Flash</option>
                <option>Claude 3.5 Sonnet</option>
                <option>GPT-4o</option>
              </select>
              <span className="text-[11px] font-mono text-zinc-500">
                {tokenEst} tokens (~${((tokenEst / 1_000_000) * 3.5).toFixed(5)})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors">
                <Mic className="h-3.5 w-3.5" />
              </button>
              <button className="flex items-center gap-1 rounded-xl bg-white hover:bg-zinc-200 px-3 py-1.5 text-xs font-bold text-black transition-all active:scale-[0.98]">
                <Send className="h-3.5 w-3.5 fill-current" />
                <span>Run</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    id: 'glass-checkout-modal',
    name: 'Glass Payment Checkout',
    category: 'commerce',
    description: 'Frosted glass checkout card with simulated credit card chip, instant Apple Pay trigger, and security badge.',
    tags: ['Commerce', 'Payment', 'Glass', 'Checkout'],
    propSchema: [
      { key: 'planName', label: 'Plan Name', type: 'text', defaultValue: 'Antigravity Pro Tier' },
      { key: 'amount', label: 'Amount ($)', type: 'text', defaultValue: '$29.00' },
      { key: 'interval', label: 'Billing Interval', type: 'text', defaultValue: '/ month' }
    ],
    defaultProps: {
      planName: 'Antigravity Pro Tier',
      amount: '$29.00',
      interval: '/ month'
    },
    code: (p) => `export function GlassCheckoutModal({
  planName = "${p.planName}",
  amount = "${p.amount}",
  interval = "${p.interval}"
}) {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/[0.1] bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-2xl">
      <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
        <div>
          <h4 className="font-bold text-sm text-white">{planName}</h4>
          <span className="text-xs text-zinc-400">Includes unlimited split reasoning</span>
        </div>
        <span className="text-lg font-extrabold text-white">{amount}</span>
      </div>
      <button className="mt-5 w-full rounded-2xl bg-white py-3 text-xs font-bold text-black hover:bg-zinc-200">
        Pay with Apple Pay
      </button>
    </div>
  );
}`,
    render: (props) => {
      const planName = props.planName || 'Antigravity Pro Tier';
      const amount = props.amount || '$29.00';
      const interval = props.interval || '/ month';

      return (
        <div className="w-full max-w-sm rounded-3xl border border-white/[0.1] bg-zinc-950/85 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex justify-between items-start pb-4 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-bold block mb-1">
                MEMBERSHIP
              </span>
              <h4 className="font-bold text-base text-white">{planName}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Unlimited split reasoning & memory sync</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-white font-mono">{amount}</span>
              <span className="text-[11px] text-zinc-500 block">{interval}</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/40 p-4 space-y-2">
            <div className="flex justify-between text-xs text-zinc-300">
              <span>High-speed Gemini Split Bridge</span>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex justify-between text-xs text-zinc-300">
              <span>Automatic Google Drive Sync</span>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex justify-between text-xs text-zinc-300">
              <span>Sub-millisecond BM25 Memory</span>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </div>
          </div>

          <button className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-zinc-200 py-3 text-xs font-bold text-black transition-all active:scale-[0.98]">
            <CreditCard className="h-4 w-4" />
            <span>Pay {amount} with Apple Pay</span>
          </button>
        </div>
      );
    }
  },
  {
    id: 'system-settings-card',
    name: 'Modern System Preferences Panel',
    category: 'system',
    description: 'Clean settings panel with tactile iOS-style switches, radio selector, and quota telemetry.',
    tags: ['Settings', 'Preferences', 'Toggles', 'System'],
    propSchema: [
      { key: 'vaultSync', label: 'Auto Vault Sync', type: 'boolean', defaultValue: true },
      { key: 'strictPreflight', label: 'Strict Pre-Flight', type: 'boolean', defaultValue: true }
    ],
    defaultProps: {
      vaultSync: true,
      strictPreflight: true
    },
    code: () => `export function SystemSettingsCard() {
  const [sync, setSync] = useState(true);
  const [strict, setStrict] = useState(true);
  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/[0.08] bg-zinc-900/90 p-5 backdrop-blur-2xl">
      <h4 className="font-bold text-sm text-white mb-4">Ecosystem Settings</h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-300">Auto Vault Sync</span>
          <button onClick={() => setSync(!sync)} className={\`h-6 w-11 rounded-full p-0.5 \${sync ? 'bg-indigo-500' : 'bg-zinc-800'}\`}>
            <div className={\`h-5 w-5 rounded-full bg-white transition-transform \${sync ? 'translate-x-5' : ''}\`} />
          </button>
        </div>
      </div>
    </div>
  );
}`,
    render: (props) => {
      const [sync, setSync] = useState(props.vaultSync ?? true);
      const [strict, setStrict] = useState(props.strictPreflight ?? true);
      const [failover, setFailover] = useState(true);

      return (
        <div className="w-full max-w-sm rounded-3xl border border-white/[0.08] bg-zinc-900/90 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Settings className="h-4 w-4 text-indigo-400" />
            <h4 className="font-bold text-sm text-white">Agent Ecosystem Settings</h4>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center p-2 rounded-xl bg-black/20">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Auto-Sync Google Drive</span>
                <span className="text-[10px] text-zinc-500">Every 10 minutes via systemd timer</span>
              </div>
              <button 
                onClick={() => setSync(!sync)}
                className={`h-5 w-9 rounded-full p-0.5 transition-colors ${sync ? 'bg-indigo-500' : 'bg-zinc-800'}`}
              >
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${sync ? 'translate-x-4' : ''}`} />
              </button>
            </div>

            <div className="flex justify-between items-center p-2 rounded-xl bg-black/20">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Strict Pre-Flight Gate</span>
                <span className="text-[10px] text-zinc-500">Block completion on secrets/lint errors</span>
              </div>
              <button 
                onClick={() => setStrict(!strict)}
                className={`h-5 w-9 rounded-full p-0.5 transition-colors ${strict ? 'bg-emerald-500' : 'bg-zinc-800'}`}
              >
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${strict ? 'translate-x-4' : ''}`} />
              </button>
            </div>

            <div className="flex justify-between items-center p-2 rounded-xl bg-black/20">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Quota Auto-Failover</span>
                <span className="text-[10px] text-zinc-500">Trigger ag-fallback at ≤ 5% quota</span>
              </div>
              <button 
                onClick={() => setFailover(!failover)}
                className={`h-5 w-9 rounded-full p-0.5 transition-colors ${failover ? 'bg-indigo-500' : 'bg-zinc-800'}`}
              >
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${failover ? 'translate-x-4' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    id: 'agent-terminal-hud',
    name: 'Agent Execution Stream HUD',
    category: 'agent',
    description: 'Minimalist high-contrast monospace agent stream with live token count, latency, and kill switch.',
    tags: ['Agent', 'Mission Control', 'Terminal', 'Telemetry'],
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
    code: (p) => `export function AgentTerminalHUD({
  taskName = "${p.taskName}",
  tokensUsed = ${p.tokensUsed},
  latencyMs = ${p.latencyMs},
  status = "${p.status}"
}) {
  return (
    <div className="w-full max-w-md bg-black border border-white/[0.12] rounded-2xl p-4 font-mono text-xs text-zinc-300 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white uppercase tracking-wider">{taskName}</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-emerald-400">
          {status}
        </span>
      </div>
      <div className="py-3 space-y-1 text-[11px] text-zinc-400">
        <div className="text-zinc-500">// Stream ingress: 127.0.0.1:5180</div>
        <div>[0.01s] <span className="text-zinc-200">INIT</span> Local context packed via token-trimmer</div>
        <div>[0.02s] <span className="text-emerald-300">PASS</span> Path safety check: root confirmed</div>
        <div>[0.04s] <span className="text-indigo-300">EXEC</span> Scanning AST references in 14 modules</div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-[10px] text-zinc-500">
        <span>{tokensUsed} TOKENS</span>
        <span>{latencyMs}ms LATENCY</span>
        <button className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition">
          ABORT
        </button>
      </div>
    </div>
  );
}`,
    render: (p) => {
      return (
        <div className="w-full max-w-md bg-black border border-white/[0.12] rounded-2xl p-4 font-mono text-xs text-zinc-300 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider">{p.taskName}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-emerald-400">
              {p.status}
            </span>
          </div>
          <div className="py-3 space-y-1 text-[11px] text-zinc-400">
            <div className="text-zinc-500">// Stream ingress: 127.0.0.1:5180</div>
            <div>[0.01s] <span className="text-zinc-200">INIT</span> Local context packed via token-trimmer</div>
            <div>[0.02s] <span className="text-emerald-300">PASS</span> Path safety check: root confirmed</div>
            <div>[0.04s] <span className="text-indigo-300">EXEC</span> Scanning AST references in 14 modules</div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-[10px] text-zinc-500">
            <span>{p.tokensUsed} TOKENS</span>
            <span>{p.latencyMs}ms LATENCY</span>
            <button className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition active:scale-95">
              ABORT
            </button>
          </div>
        </div>
      );
    }
  },
  {
    id: 'audio-dsp-deck',
    name: 'Tactile Audio DSP Equalizer',
    category: 'audio',
    description: 'Cadence-inspired 5-band graphic equalizer with tube warmth toggle and master gain.',
    tags: ['Audio', 'DSP', 'Cadence', 'Equalizer'],
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
    code: (p) => `export function AudioDspDeck({
  presetName = "${p.presetName}",
  preampGain = ${p.preampGain},
  tubeWarmth = ${p.tubeWarmth}
}) {
  return (
    <div className="w-full max-w-sm bg-zinc-950 border border-white/[0.1] rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">DSP Engine</span>
          <h4 className="text-sm font-bold text-white">{presetName}</h4>
        </div>
        <span className="font-mono text-xs text-amber-400">+{preampGain} dB</span>
      </div>
      <div className="flex justify-between items-end h-28 my-4 px-2">
        {['64Hz', '250Hz', '1kHz', '4kHz', '16kHz'].map((f, i) => (
          <div key={f} className="flex flex-col items-center gap-2">
            <div className="w-2.5 h-20 bg-zinc-800 rounded-full relative flex items-end">
              <div 
                className="w-full bg-white rounded-full transition-all"
                style={{ height: \`\${30 + i * 12}%\` }}
              />
            </div>
            <span className="text-[9px] font-mono text-zinc-500">{f}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
        <span className="text-zinc-400">Harmonic Tube Saturation</span>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
          {tubeWarmth ? 'ACTIVE' : 'BYPASS'}
        </span>
      </div>
    </div>
  );
}`,
    render: (p) => {
      const [warmth, setWarmth] = useState(p.tubeWarmth);
      return (
        <div className="w-full max-w-sm bg-zinc-950 border border-white/[0.1] rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">DSP Engine</span>
              <h4 className="text-sm font-bold text-white">{p.presetName}</h4>
            </div>
            <span className="font-mono text-xs text-amber-400">+{p.preampGain} dB</span>
          </div>
          <div className="flex justify-between items-end h-28 my-4 px-2">
            {['64Hz', '250Hz', '1kHz', '4kHz', '16kHz'].map((f, i) => (
              <div key={f} className="flex flex-col items-center gap-2">
                <div className="w-2.5 h-20 bg-zinc-800 rounded-full relative flex items-end">
                  <div 
                    className="w-full bg-white rounded-full transition-all"
                    style={{ height: `${30 + i * 12}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-zinc-500">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
            <span className="text-zinc-400">Harmonic Tube Saturation</span>
            <button
              onClick={() => setWarmth(!warmth)}
              className={`px-2 py-0.5 rounded font-mono text-[10px] border transition-colors ${
                warmth
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}
            >
              {warmth ? 'ACTIVE' : 'BYPASS'}
            </button>
          </div>
        </div>
      );
    }
  },
  {
    id: 'retail-price-matrix',
    name: 'Benelux Grocery Price Matrix',
    category: 'commerce',
    description: 'PrixBon-inspired high-contrast comparison matrix comparing Albert Heijn, Jumbo, and Colruyt prices.',
    tags: ['PrixBon', 'Grocery', 'Commerce', 'Finance'],
    propSchema: [
      { key: 'item', label: 'Item Name', type: 'text', defaultValue: 'Halfvolle Melk 1L' },
      { key: 'savings', label: 'Max Savings', type: 'text', defaultValue: '28%' }
    ],
    defaultProps: {
      item: 'Halfvolle Melk 1L',
      savings: '28%'
    },
    code: (p) => `export function RetailPriceMatrix({
  item = "${p.item}",
  savings = "${p.savings}"
}) {
  return (
    <div className="w-full max-w-sm bg-black border border-white/[0.1] rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">PrixBon Benchmark</span>
          <h4 className="text-sm font-bold text-white">{item}</h4>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
          -{savings}
        </span>
      </div>
      <div className="divide-y divide-white/[0.04] my-2 text-xs">
        <div className="flex items-center justify-between py-2.5">
          <span className="font-semibold text-zinc-300">Colruyt (Laagste Prijs)</span>
          <span className="font-mono font-bold text-emerald-400">€ 0.99</span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-zinc-400">Jumbo</span>
          <span className="font-mono text-zinc-300">€ 1.15</span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-zinc-400">Albert Heijn</span>
          <span className="font-mono text-zinc-300">€ 1.38</span>
        </div>
      </div>
      <div className="pt-2 text-[10px] text-zinc-500 flex justify-between">
        <span>Verified on Open Food Facts</span>
        <span className="text-zinc-400 font-mono">Today 18:30</span>
      </div>
    </div>
  );
}`,
    render: (p) => {
      return (
        <div className="w-full max-w-sm bg-black border border-white/[0.1] rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">PrixBon Benchmark</span>
              <h4 className="text-sm font-bold text-white">{p.item}</h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
              -{p.savings}
            </span>
          </div>
          <div className="divide-y divide-white/[0.04] my-2 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <span className="font-semibold text-zinc-300">Colruyt (Laagste Prijs)</span>
              <span className="font-mono font-bold text-emerald-400">€ 0.99</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400">Jumbo</span>
              <span className="font-mono text-zinc-300">€ 1.15</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400">Albert Heijn</span>
              <span className="font-mono text-zinc-300">€ 1.38</span>
            </div>
          </div>
          <div className="pt-2 text-[10px] text-zinc-500 flex justify-between">
            <span>Verified on Open Food Facts</span>
            <span className="text-zinc-400 font-mono">Today 18:30</span>
          </div>
        </div>
      );
    }
  },
  {
    id: 'kitchen-step-timer',
    name: 'Tactile Kitchen Cooking Stepper',
    category: 'system',
    description: 'Reelcipe-inspired knuckle-friendly cooking step with active countdown and progress bar.',
    tags: ['Reelcipe', 'Kitchen', 'Timer', 'Cooking'],
    propSchema: [
      { key: 'stepTitle', label: 'Step Title', type: 'text', defaultValue: 'Sear the Garlic & Salmon' },
      { key: 'durationMin', label: 'Duration (min)', type: 'number', defaultValue: 6 },
      { key: 'stepNum', label: 'Current Step', type: 'number', defaultValue: 2 }
    ],
    defaultProps: {
      stepTitle: 'Sear the Garlic & Salmon',
      durationMin: 6,
      stepNum: 2
    },
    code: (p) => `export function KitchenStepTimer({
  stepTitle = "${p.stepTitle}",
  durationMin = ${p.durationMin},
  stepNum = ${p.stepNum}
}) {
  return (
    <div className="w-full max-w-sm bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono font-bold">
          STEP {stepNum} / 5
        </span>
        <span className="font-mono text-xs text-amber-400">{durationMin}:00 MIN</span>
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-2">{stepTitle}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed mb-6">
        Melt 2 tbsp salted butter in a heavy stainless skillet over medium-high heat until bubbling.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button className="py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition active:scale-95">
          PREV
        </button>
        <button className="py-3.5 rounded-2xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition active:scale-95">
          NEXT STEP ›
        </button>
      </div>
    </div>
  );
}`,
    render: (p) => {
      const [currStep, setCurrStep] = useState(p.stepNum);
      return (
        <div className="w-full max-w-sm bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono font-bold">
              STEP {currStep} / 5
            </span>
            <span className="font-mono text-xs text-amber-400">{p.durationMin}:00 MIN</span>
          </div>
          <h3 className="text-lg font-bold tracking-tight mb-2">{p.stepTitle}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            Melt 2 tbsp salted butter in a heavy stainless skillet over medium-high heat until bubbling.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setCurrStep(Math.max(1, currStep - 1))}
              className="py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition active:scale-95"
            >
              PREV
            </button>
            <button 
              onClick={() => setCurrStep(Math.min(5, currStep + 1))}
              className="py-3.5 rounded-2xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition active:scale-95"
            >
              NEXT STEP ›
            </button>
          </div>
        </div>
      );
    }
  }
];
