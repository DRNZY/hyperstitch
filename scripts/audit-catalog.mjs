#!/usr/bin/env node
/**
 * Audit every entry in the mock catalog and print a report.
 *
 * This is the CI gate the project never had. It exists because the catalog
 * previously failed its own auditor: three indigo-to-cyan gradients, a
 * `from-indigo-500 via-purple-500 to-rose-500` label, `backdrop-blur-2xl` on
 * nine cards, and a Lucide icon in nearly every entry, while the inspector
 * reported a clean score because it was reading the `code:` string.
 *
 * Exit code 0 when every entry passes, 1 otherwise.
 */
import { auditSpec } from '../dist/hyperstitch/audit.mjs';
import { COMPONENT_CATALOG } from '../dist/hyperstitch.mjs';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const OFF = '\x1b[0m';

let failed = 0;
let degenerate = 0;

console.log(`\nAuditing ${COMPONENT_CATALOG.length} catalog entries against 20 rules\n`);

for (const spec of COMPONENT_CATALOG) {
  const report = auditSpec(spec, spec.defaultProps ?? {});
  const status = report.degenerate
    ? `${RED}DEGENERATE${OFF}`
    : report.failed.length === 0
      ? `${GREEN}PASS${OFF}`
      : `${RED}FAIL${OFF}`;

  console.log(
    `${status}  ${String(report.score).padStart(3)}  ${spec.id.padEnd(24)}`
    + ` ${DIM}${report.markupLength}b markup${OFF}`,
  );

  if (report.degenerate) {
    degenerate += 1;
    console.log(`        ${RED}${report.degenerateReason}${OFF}`);
    continue;
  }
  for (const finding of report.findings.filter((f) => !f.passed)) {
    failed += 1;
    console.log(`        ${RED}x${OFF} ${finding.ruleId}: ${finding.detail}`);
    for (const item of finding.evidence) console.log(`            ${DIM}${item}${OFF}`);
  }
  for (const finding of report.findings.filter((f) => f.limitations)) {
    console.log(`        ${DIM}~ blind spot on ${finding.ruleId}${OFF}`);
  }
}

const entries = COMPONENT_CATALOG.length;
console.log(
  `\n${entries - failed === entries ? GREEN : RED}`
  + `${entries} entries, ${failed} rule failure(s), ${degenerate} degenerate${OFF}\n`,
);
process.exit(failed === 0 && degenerate === 0 ? 0 : 1);
