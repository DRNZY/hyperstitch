import React, { useMemo } from 'react';
import type { ComponentSpec } from '../../types';
import { auditSpec } from '../../audit/audit';
import type { AuditReport } from '../../audit/types';
import { Mark, Cross, Alert } from '../marks/Marks';

/**
 * The Anti-Crutch Auditor.
 *
 * It grades the component that actually renders. `auditSpec` mounts the spec's
 * `render()` through `react-dom/server` and runs all twenty AGENTS.md rules
 * over the resulting static markup. The previous version took the `code:`
 * template string as a prop and regex-matched that instead, so the score
 * described a hand-written string rather than the component, and the catalog's
 * own first entry scored clean while its `render()` carried a
 * `from-indigo-500 to-cyan-400` gradient.
 *
 * The score is reported next to the number of rules and the markup size, so an
 * empty render cannot read as a clean bill of health.
 */

interface AntiCrutchAuditorProps {
  component: ComponentSpec;
  props: Record<string, unknown>;
  /** Set false to skip rendering entirely, e.g. while props are being typed. */
  enabled?: boolean;
}

/** A pass is only meaningful if the component produced something to grade. */
function scoreTone(score: number): { label: string; className: string } {
  if (score >= 90) return { label: 'CLEAN', className: 'text-ash-300 border-ash-500/40' };
  if (score >= 70) return { label: 'MARGINAL', className: 'text-ochre-300 border-ochre-500/40' };
  return { label: 'CRUTCH', className: 'text-rust-300 border-rust-500/50' };
}

export function AntiCrutchAuditor({ component, props, enabled = true }: AntiCrutchAuditorProps) {
  const report: AuditReport | null = useMemo(() => {
    if (!enabled) return null;
    return auditSpec(component, props) as AuditReport;
  }, [component, props, enabled]);

  if (!report) {
    return (
      <div className="p-4">
        <p className="font-mono text-xs text-ash-500">Audit paused.</p>
      </div>
    );
  }

  const tone = scoreTone(report.score);
  const degenerate = 'degenerate' in report && (report as { degenerate?: boolean }).degenerate;
  const degenerateReason = (report as { degenerateReason?: string }).degenerateReason;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Score header. No coloured border, no gradient, no pill badge. */}
      <header className="border-b border-ash-800 px-4 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash-400">
            Anti-Crutch Audit
          </h3>
          <div className="flex items-baseline gap-2">
            <span className={`font-mono text-2xl font-semibold tabular-nums ${tone.className.split(' ')[0]}`}>
              {report.score}
            </span>
            <span className="font-mono text-xs text-ash-600">/ 100</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${tone.className}`}>
            {tone.label}
          </span>
          <span className="font-mono text-[10px] text-ash-500">
            {report.passed}/{report.total} rules · {report.markupLength} bytes of markup
          </span>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ash-500">
          Graded against the rendered output of <span className="text-ash-300">{component.id}</span>,
          not the code preview.
        </p>
      </header>

      {degenerate && (
        <div className="flex items-start gap-2 border-b border-rust-800 bg-rust-950/40 px-4 py-3">
          <span className="mt-0.5 shrink-0 text-rust-400"><Alert size={13} /></span>
          <p className="text-[11px] leading-relaxed text-rust-200">
            <span className="font-semibold">This score is not trustworthy.</span>{' '}
            {degenerateReason ?? 'The component rendered too little to audit.'}
          </p>
        </div>
      )}

      {/* Rule list, in AGENTS.md order. */}
      <ol className="divide-y divide-ash-800/60">
        {report.findings.map((finding) => {
          const number = Number(/^rule-(\d+)/.exec(finding.ruleId)?.[1] ?? 0);
          return (
            <li key={finding.ruleId} className="px-4 py-3">
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 shrink-0 ${finding.passed ? 'text-ash-400' : 'text-rust-400'}`}
                  aria-hidden="true"
                >
                  {finding.passed ? <Mark size={13} /> : <Cross size={13} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] tabular-nums text-ash-600">
                      {String(number).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest ${
                        finding.passed ? 'text-ash-500' : 'text-rust-400'
                      }`}
                    >
                      {finding.passed ? 'pass' : 'fail'}
                    </span>
                  </div>
                  <p className={`text-xs leading-snug ${finding.passed ? 'text-ash-300' : 'text-rust-200'}`}>
                    {finding.detail}
                  </p>
                  {finding.evidence.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {finding.evidence.map((item, index) => (
                        <li
                          key={`${finding.ruleId}-${index}`}
                          className="break-all font-mono text-[10px] leading-relaxed text-ash-600"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {finding.limitations && (
                    <p className="mt-1.5 border-l border-ash-700 pl-2 text-[10px] leading-relaxed text-ochre-400/80">
                      Blind spot: {finding.limitations}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default AntiCrutchAuditor;
