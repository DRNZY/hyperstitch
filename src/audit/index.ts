/**
 * `hyperstitch/audit` entry point.
 *
 * The auditor with no component imports, so it can run headlessly in CI without
 * pulling in the studio app, the mock catalog, or the CSS pipeline. React and
 * react-dom are peer dependencies here rather than bundled.
 */
export { auditSpec, buildContext, MIN_MARKUP_LENGTH, renderSpecToMarkup, runRules } from './audit';
export type { RenderedMarkup } from './audit';
export { hasApprovedTypeface, RULES, RULES_BY_NUMBER, RULE_COUNT } from './rules';
export type { AuditContext, AuditFinding, AuditReport, AuditRule, EvidenceKind } from './types';
export {
  anyClass,
  classTokens,
  closest,
  decodeEntities,
  descendants,
  elementChildren,
  elements,
  normaliseWhitespace,
  parseHtml,
  walk,
} from './parse';
export type { AuditNode } from './parse';
