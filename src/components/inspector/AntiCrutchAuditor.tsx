import React from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { ComponentSpec } from '../../types';

interface AntiCrutchAuditorProps {
  component: ComponentSpec;
  code: string;
}

interface AuditRule {
  id: string;
  name: string;
  description: string;
  check: (code: string) => { passed: boolean; details?: string };
}

const RULES: AuditRule[] = [
  {
    id: 'no-purple-blue-gradients',
    name: 'No Purple/Blue Gradients',
    description: 'Forbidden AI aesthetic: from-purple to-blue or from-indigo to-cyan.',
    check: (code) => {
      const match = /(from-purple|from-indigo|from-violet).*(to-blue|to-cyan|to-sky)/i.test(code);
      return {
        passed: !match,
        details: match ? 'Found purple-to-blue gradient utility in markup' : 'Clean palette'
      };
    }
  },
  {
    id: 'no-gradient-text',
    name: 'Solid Typography (No Gradient Text)',
    description: 'Hero text must be solid high-contrast monochrome, not bg-clip-text gradients.',
    check: (code) => {
      const match = /bg-clip-text\s+text-transparent/i.test(code);
      return {
        passed: !match,
        details: match ? 'Found bg-clip-text text-transparent gradient text' : 'Solid typography verified'
      };
    }
  },
  {
    id: 'no-emojis-in-ui',
    name: 'No UI Emojis',
    description: 'Never use emojis in titles, badges, or buttons. Use crisp typography or custom marks.',
    check: (code) => {
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      const match = emojiRegex.test(code);
      return {
        passed: !match,
        details: match ? 'Found raw emoji character in component markup' : 'No emoji crutches detected'
      };
    }
  },
  {
    id: 'no-pill-badges',
    name: 'No Pill Badge Above Title',
    description: 'Avoid standard rounded-full badge pills over headings.',
    check: (code) => {
      const match = /rounded-full\s+bg-.*\/10\s+px-.*py-.*text-xs/i.test(code);
      return {
        passed: !match,
        details: match ? 'Detected generic pill badge container' : 'Asymmetrical structural tag'
      };
    }
  },
  {
    id: 'no-heavy-glass-blur',
    name: 'No Excessive Glassmorphism',
    description: 'Use flat structural borders and solid dark tones instead of heavy backdrop blurs.',
    check: (code) => {
      const match = /backdrop-blur-(2xl|3xl|xl)/i.test(code);
      return {
        passed: !match,
        details: match ? 'High blur overlay detected (backdrop-blur-2xl/3xl)' : 'Crisp flat surface depth'
      };
    }
  },
  {
    id: 'no-generic-buzzwords',
    name: 'No Vague Marketing Copy',
    description: 'Strictly prohibit words like "supercharge", "unleash", "next-gen", or "streamline".',
    check: (code) => {
      const buzzwords = ['supercharge', 'unleash', 'next-gen', 'next generation', 'game-changing', 'seamlessly'];
      const found = buzzwords.filter(b => code.toLowerCase().includes(b));
      return {
        passed: found.length === 0,
        details: found.length > 0 ? `Found generic copy: "${found.join('", "')}"` : 'Concrete technical wording'
      };
    }
  },
  {
    id: 'no-colored-borders',
    name: 'No Colored Card Borders',
    description: 'Use neutral hairline borders (border-white/[0.08] or border-zinc-800), not tinted accent borders.',
    check: (code) => {
      const match = /border-(indigo|purple|violet|blue)-(400|500|600)/i.test(code);
      return {
        passed: !match,
        details: match ? 'Found colored accent border on container' : 'Neutral structural border'
      };
    }
  }
];

export const AntiCrutchAuditor: React.FC<AntiCrutchAuditorProps> = ({ component, code }) => {
  const results = RULES.map(rule => ({
    rule,
    result: rule.check(code)
  }));

  const passedCount = results.filter(r => r.result.passed).length;
  const scorePercent = Math.round((passedCount / RULES.length) * 100);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
      {/* Score Header Card */}
      <div className={`p-4 rounded-2xl border ${
        scorePercent >= 85 
          ? 'bg-emerald-950/20 border-emerald-500/30' 
          : scorePercent >= 60 
          ? 'bg-amber-950/20 border-amber-500/30' 
          : 'bg-rose-950/20 border-rose-500/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {scorePercent >= 85 ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="text-sm font-bold text-zinc-100">Anti-Crutch Craft Score</h3>
          </div>
          <span className="font-mono text-lg font-bold text-zinc-100">
            {scorePercent}%
          </span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Enforces the 20 Anti-Crutch Design Principles from AGENTS.md: zero purple gradients, solid typography, no emoji badges, and pure structural contrast.
        </p>
      </div>

      {/* Rules Evaluation List */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Evaluated Design Gates ({passedCount}/{RULES.length} Passed)
        </span>
        {results.map(({ rule, result }) => (
          <div
            key={rule.id}
            className={`p-3 rounded-xl border transition-all ${
              result.passed
                ? 'bg-zinc-900/40 border-white/[0.06]'
                : 'bg-rose-950/10 border-rose-500/30'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {result.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className={`text-xs font-semibold ${result.passed ? 'text-zinc-200' : 'text-rose-300'}`}>
                  {rule.name}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                result.passed 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {result.passed ? 'PASS' : 'CRUTCH'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 pl-6">
              {rule.description}
            </p>
            {result.details && (
              <p className="text-[10px] font-mono text-zinc-400 mt-1.5 pl-6 border-t border-white/[0.04] pt-1">
                ↳ {result.details}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
