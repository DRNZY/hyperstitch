import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHtml } from './parse';
import { RULES } from './rules';
import type { AuditContext, AuditFinding, AuditReport } from './types';

/**
 * Render a component spec to static markup and audit the result.
 *
 * Why static markup rather than the `code:` template string
 * ---------------------------------------------------------
 * `ComponentSpec` carries two parallel implementations: a `render()` function
 * that is what actually mounts, and a `code()` function returning a
 * hand-maintained TypeScript string that is supposed to look like the component
 * in the Code tab. The previous auditor scanned the `code()` string, so a
 * component whose `code()` had drifted from its `render()` would be graded on
 * code that does not run. That is not a lint, it is a compliment to a human.
 *
 * So the primary evidence is `renderToStaticMarkup(spec.render(props))`.
 *
 * Hooks
 * -----
 * Several catalog entries call `useState` directly inside `render()`. Calling
 * that function bare would be an invalid hook call, because React has no owning
 * component. Wrapping it in an actual component gives the hooks a legitimate
 * owner and is also what the app does when it renders `{spec.render(props)}`
 * inside `PreviewStage`.
 *
 * Effects do not run under `renderToStaticMarkup`, so a component that only
 * builds its content in `useEffect` audits as empty. `assertRendered` turns that
 * into an explicit error rather than a perfect score.
 */

/** The minimum a spec must render for a score to mean anything. */
export const MIN_MARKUP_LENGTH = 40;

export interface RenderedMarkup {
  markup: string;
  /** True when the markup is too thin to audit meaningfully. */
  degenerate: boolean;
  reason?: string;
}

/**
 * Render a spec to static markup.
 *
 * A spec whose `render` throws is reported as degenerate rather than allowed to
 * take the whole audit down: one broken entry should not blind the report.
 */
export function renderSpecToMarkup(
  spec: { id: string; render: (props: Record<string, unknown>) => unknown },
  props: Record<string, unknown>,
): RenderedMarkup {
  let markup: string;
  try {
    // The wrapper is what makes useState inside render() legal.
    const element = createElement(() => spec.render(props) as never);
    markup = renderToStaticMarkup(element);
  } catch (error) {
    return {
      markup: '',
      degenerate: true,
      reason: `render() threw: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  if (markup.replace(/<[^>]*>/g, '').trim().length === 0 && !markup.includes('<svg')) {
    return {
      markup,
      degenerate: true,
      reason: 'render() produced no text content. A component that builds its DOM in useEffect audits as empty under static rendering.',
    };
  }
  if (markup.length < MIN_MARKUP_LENGTH) {
    return {
      markup,
      degenerate: true,
      reason: `render() produced only ${markup.length} bytes, below the ${MIN_MARKUP_LENGTH}-byte floor for a meaningful audit.`,
    };
  }
  return { markup, degenerate: false };
}

/** Build the context a rule evaluates against. */
export function buildContext(
  spec: { id: string; render: (props: Record<string, unknown>) => unknown; code?: (props: Record<string, unknown>) => string },
  props: Record<string, unknown>,
  rendered?: RenderedMarkup,
): AuditContext {
  const { markup } = rendered ?? renderSpecToMarkup(spec, props);
  let source: string | undefined;
  if (typeof spec.code === 'function') {
    try {
      source = spec.code(props);
    } catch {
      source = undefined;
    }
  }
  return {
    componentId: spec.id,
    props,
    markup,
    root: parseHtml(markup),
    source,
  };
}

/** Run all twenty rules against a context. */
export function runRules(context: AuditContext): AuditFinding[] {
  return RULES.map((rule) => {
    try {
      const { passed, detail, evidence } = rule.evaluate(context);
      return {
        ruleId: rule.id,
        passed,
        detail,
        evidence: evidence ?? [],
        ...(rule.limitations ? { limitations: rule.limitations } : {}),
      };
    } catch (error) {
      // A rule that throws is a broken rule, not a passing component. Surface
      // it as a failure so the score cannot be inflated by a crash.
      return {
        ruleId: rule.id,
        passed: false,
        detail: `Rule threw while evaluating: ${error instanceof Error ? error.message : String(error)}`,
        evidence: [],
        ...(rule.limitations ? { limitations: rule.limitations } : {}),
      };
    }
  });
}

/** Produce the full report for a spec. */
export function auditSpec(
  spec: { id: string; render: (props: Record<string, unknown>) => unknown; code?: (props: Record<string, unknown>) => string },
  props: Record<string, unknown> = {},
): AuditReport & { degenerate: boolean; degenerateReason?: string } {
  const rendered = renderSpecToMarkup(spec, props);
  const context = buildContext(spec, props, rendered);
  const findings = runRules(context);
  const passed = findings.filter((finding) => finding.passed).length;

  return {
    componentId: spec.id,
    findings,
    passed,
    total: RULES.length,
    score: Math.round((passed / RULES.length) * 100),
    failed: findings.filter((f) => !f.passed).map((f) => f.ruleId),
    caveated: findings.filter((f) => f.limitations).map((f) => f.ruleId),
    markupLength: context.markup.length,
    degenerate: rendered.degenerate,
    ...(rendered.reason ? { degenerateReason: rendered.reason } : {}),
  };
}
