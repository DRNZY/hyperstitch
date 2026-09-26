/**
 * hyperstitch public API.
 *
 * The README claimed "TypeScript components for spatial canvas layouts" but the
 * package had no barrel and no library build target, so nothing outside this
 * repo could import it: `dist/` held only the app's hashed bundles, and
 * `package.json` had no `exports` map. This file is the single entry point for
 * both the Vite library build and any consumer.
 *
 * What is exported, and why
 * ------------------------
 * - `renderSpecToMarkup` / `auditSpec` / `runRules` — the auditor. Usable
 *   headlessly, which is how the test suite grades the mock catalog and how a
 *   consumer would gate their own components in CI.
 * - `RULES` / `RULES_BY_NUMBER` — the rule table, so a consumer can build a
 *   different report surface over the same twenty rules.
 * - `parseHtml` and the tree helpers — exported because the rule table is only
 *   useful to a caller who can also read the tree.
 * - `COMPONENT_CATALOG` — the mock catalog, which is the thing the auditor is
 *   pointed at by default.
 * - The React components and the mark set.
 */

export type {
  A11yReport,
  ComponentCategory,
  ComponentPropSchema,
  ComponentSpec,
  ThemeConfig,
  ThemeId,
  ViewportConfig,
  ViewportId,
} from './types';

export {
  auditSpec,
  buildContext,
  MIN_MARKUP_LENGTH,
  renderSpecToMarkup,
  runRules,
  type RenderedMarkup,
} from './audit/audit';

export {
  hasApprovedTypeface,
  RULES,
  RULES_BY_NUMBER,
  RULE_COUNT,
} from './audit/rules';

export type {
  AuditContext,
  AuditFinding,
  AuditReport,
  AuditRule,
  EvidenceKind,
} from './audit/types';

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
  type AuditNode,
} from './audit/parse';

export { COMPONENT_CATALOG } from './mock/components';
export { THEMES } from './themes';

export { App } from './App';
export { HeaderToolbar } from './components/toolbar/HeaderToolbar';
export { ComponentSidebar } from './components/gallery/ComponentSidebar';
export { PreviewStage } from './components/canvas/PreviewStage';
export { CodeInspector } from './components/inspector/CodeInspector';
export { PropsTuner } from './components/inspector/PropsTuner';
export { AntiCrutchAuditor } from './components/inspector/AntiCrutchAuditor';

export * from './components/marks/Marks';
