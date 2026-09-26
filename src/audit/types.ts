import type { AuditNode } from './parse';

/**
 * What a rule is allowed to look at.
 *
 * `markup` is the default and the primary evidence: the component rendered to
 * static markup with `react-dom/server`. The previous auditor read the
 * hand-written `code:` template string instead, which is a prose copy of the
 * component rather than the component itself, so a passing audit proved nothing
 * about what actually ships.
 *
 * `source` exists for the two rules whose subject is behaviour that leaves no
 * trace in static markup. Those rules say so in their own `limitations` field,
 * and the report surfaces that caveat next to the verdict instead of hiding it.
 */
export type EvidenceKind = 'markup' | 'source';

export interface AuditContext {
  /** The spec under audit. */
  componentId: string;
  /** Props the component was rendered with. */
  props: Record<string, unknown>;
  /** `renderToStaticMarkup(component.render(props))`. The primary evidence. */
  markup: string;
  /** Parsed tree of `markup`. */
  root: AuditNode;
  /** Optional `code:` template, used only by `source` rules. */
  source?: string;
}

export interface AuditFinding {
  ruleId: string;
  passed: boolean;
  /** One line, concrete, naming what was found. */
  detail: string;
  /** Up to a handful of concrete evidence strings, e.g. the offending classes. */
  evidence: string[];
  /** What this rule cannot see, when that is a real limitation. */
  limitations?: string;
}

export interface AuditRule {
  /** Stable id, `rule-NN` matching the AGENTS.md list position. */
  id: string;
  /** 1-based position in the AGENTS.md list of twenty. */
  number: number;
  /** Short label for the report. */
  name: string;
  /** The rule as written in AGENTS.md, condensed to one sentence. */
  statement: string;
  evidence: EvidenceKind;
  /** Honest statement of the rule's blind spots. Shown in the report. */
  limitations?: string;
  evaluate: (context: AuditContext) => { passed: boolean; detail: string; evidence?: string[] };
}

export interface AuditReport {
  componentId: string;
  /** All twenty verdicts, in AGENTS.md order. */
  findings: AuditFinding[];
  passed: number;
  total: number;
  /** 0-100. `Math.round(passed / total * 100)`. */
  score: number;
  /** Ids of rules that failed. */
  failed: string[];
  /** Rules that carry a documented blind spot. */
  caveated: string[];
  /** Rendered markup length, so an empty-render false pass is visible. */
  markupLength: number;
}
