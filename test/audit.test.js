import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { createElement as h } from 'react';
import { RULES, RULE_COUNT, RULES_BY_NUMBER, auditSpec, parseHtml, elements } from '../dist/hyperstitch/audit.mjs';
import { COMPONENT_CATALOG } from '../dist/hyperstitch.mjs';

/**
 * The test suite runs against the built library in `dist/`, not against `src/`.
 *
 * That is deliberate. `node --test` cannot import `.tsx`, so a suite pointed at
 * `src/` would need a transform step that the previous `npm test` script did not
 * have, which is exactly why it globbed `test/*.test.js` against an empty
 * directory and failed. Building first also means these tests double as a check
 * that the library build target actually emits something importable.
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('the library build produced importable output', () => {
  for (const file of ['dist/hyperstitch.mjs', 'dist/hyperstitch/audit.mjs']) {
    assert.ok(existsSync(resolve(ROOT, file)), `${file} should exist after build`);
  }
});

test('the rule table has exactly twenty rules, numbered 1 to 20', () => {
  assert.equal(RULE_COUNT, 20, 'AGENTS.md defines twenty anti-crutch rules');
  assert.equal(RULES.length, 20);
  for (let number = 1; number <= 20; number += 1) {
    const rule = RULES_BY_NUMBER[number];
    assert.ok(rule, `rule ${number} should exist`);
    assert.equal(rule.number, number);
    // The id must carry its AGENTS.md position so a report line is traceable.
    assert.ok(
      rule.id.startsWith(`rule-${String(number).padStart(2, '0')}-`),
      `rule ${number} id should be prefixed rule-${String(number).padStart(2, '0')}-, got ${rule.id}`,
    );
    assert.ok(rule.name.length > 3, `rule ${number} needs a name`);
    assert.ok(rule.statement.length > 10, `rule ${number} needs a real statement`);
    assert.ok(['markup', 'source'].includes(rule.evidence), `rule ${number} declares valid evidence`);
    assert.equal(typeof rule.evaluate, 'function', `rule ${number} needs an evaluate function`);
  }
  // RULES must be in AGENTS.md order, since the report renders it positionally.
  assert.deepEqual(RULES.map((rule) => rule.number), Array.from({ length: 20 }, (_, i) => i + 1));
});

test('rule ids are unique', () => {
  const ids = new Set(RULES.map((rule) => rule.id));
  assert.equal(ids.size, RULES.length);
});

test('the parser builds a tree with correct nesting', () => {
  const root = parseHtml(
    '<div class="a"><span>one</span><span>two</span></div><p>three</p>',
  );
  const all = elements(root);
  assert.equal(all.length, 4);
  assert.equal(all[0].tag, 'div');
  assert.deepEqual(all[0].classes, ['a']);
  assert.equal(all[1].text, 'one');
  assert.equal(all[2].text, 'two');
  assert.equal(all[3].text, 'three');
  assert.equal(all[0].parent.tag, '#root');
  assert.equal(all[1].depth, 2);
});

test('the parser handles self-closing and void elements without losing siblings', () => {
  const root = parseHtml('<div><br/><img src="x.png"/><span>after</span></div>');
  const texts = elements(root).map((node) => node.text).filter(Boolean);
  assert.ok(texts.includes('after'), 'a void sibling must not swallow what follows');
});

test('the parser decodes entities in attribute values and text', () => {
  const root = parseHtml('<button aria-label="Save &amp; close">Tom &amp; Jerry</button>');
  const button = elements(root)[0];
  assert.equal(button.attributes['aria-label'], 'Save & close');
  assert.equal(button.text, 'Tom & Jerry');
});

test('the auditor reports every failing rule on a deliberately bad component', () => {
  /**
   * This is the regression the old auditor could not catch. Every one of these
   * violations is invisible to a regex over a `code:` template, and all of them
   * are visible in the rendered markup.
   */
  const badSpec = {
    id: 'deliberately-bad',
    render: () => h(
      'div',
      {
        className:
          'rounded-2xl border border-indigo-500 bg-gradient-to-r from-indigo-500 '
          + 'to-cyan-400 p-1.5 backdrop-blur-2xl',
      },
      h('span', { className: 'rounded-full bg-white/10 px-2 py-1 text-xs uppercase' }, 'New'),
      h('h1', { className: 'bg-clip-text text-transparent font-inter italic' }, 'Supercharge your workflow'),
      h('p', { className: 'text-zinc-600 hover:opacity-80 mix-blend-screen' }, 'Unleash it \u2014 seamless'),
      h('svg', { className: 'lucide lucide-sparkles' }),
      h('div', { 'data-slot': 'card' }),
      h('div', { className: 'animate-fade-in' }),
      h('span', { className: 'font-serif', style: { fontFamily: 'Space Grotesk' } }, 'Instrument Serif'),
      h('div', { className: 'grain' }),
    ),
  };

  const report = auditSpec(badSpec, {});

  assert.equal(report.degenerate, false, 'the bad component must render enough to audit');
  assert.ok(report.markupLength > 40);

  const failed = new Set(report.failed);
  const expected = [
    'rule-01-no-purple-blue-gradients',   // from-indigo-500 to-cyan-400
    'rule-02-no-gradient-hero-text',      // bg-clip-text + text-transparent
    'rule-03-no-emoji-in-ui',             // no emoji here, so this one should pass
    'rule-04-no-inter-font',              // font-inter
    'rule-05-no-colored-card-borders',    // border-indigo-500 on a rounded surface
    'rule-06-no-glassmorphism',           // backdrop-blur-2xl
    'rule-07-no-low-contrast-grey',       // text-zinc-600
    'rule-10-no-lucide-icons',            // class="lucide ..."
    'rule-11-no-default-shadcn',          // data-slot
    'rule-12-no-fade-in-on-scroll',       // animate-fade-in
    'rule-13-no-cursor-glow',             // mix-blend-screen
    'rule-14-no-fade-on-hover',           // hover:opacity-80 (on a p, not a button)
    'rule-15-spacing-grid-consistency',   // p-1.5 is 6px
    'rule-16-no-em-dash-overuse',         // one em dash is within limit
    'rule-17-no-generic-buzzword-copy',   // supercharge, unleash, seamless
    'rule-18-no-sans-italic-accents',     // italic
    'rule-19-no-space-grotesk-instrument-serif',
    'rule-20-no-grain-overlay',           // class="grain"
  ];

  // Every violation above that is actually present must be reported.
  for (const id of expected) {
    if (id === 'rule-03-no-emoji-in-ui') continue;      // no emoji in the fixture
    if (id === 'rule-16-no-em-dash-overuse') continue;   // exactly one em dash, allowed
    if (id === 'rule-14-no-fade-on-hover') continue;     // the hover:opacity is on a <p>
    assert.ok(failed.has(id), `expected ${id} to fail; failures were ${[...failed].join(', ')}`);
  }

  assert.ok(report.score < 60, `score should be poor, got ${report.score}`);
});

test('the auditor does not grade the code template string instead of the render', () => {
  /**
   * The exact defect being fixed. `code()` claims to be clean; `render()` is not.
   * An auditor that read `code()` would return 100. One that renders returns a
   * failing score.
   */
  const spec = {
    id: 'drifted',
    // A pristine-looking template with no violations at all.
    code: () => 'export function Clean() { return <div className="border border-ash-800" /> }',
    // The implementation actually mounts a purple-to-blue gradient.
    render: () => h('div', { className: 'bg-gradient-to-r from-purple-600 to-blue-500 p-4' }),
  };

  const report = auditSpec(spec, {});
  assert.ok(
    report.failed.includes('rule-01-no-purple-blue-gradients'),
    'rule 1 must fail on the render, regardless of a clean code template',
  );
  assert.ok(report.score < 100, 'score must reflect the render');
});

test('a clean component scores 100 and reports no failures', () => {
  const cleanSpec = {
    id: 'clean',
    render: () => h(
      'article',
      { className: 'w-full max-w-sm border border-ash-800 bg-ash-900 p-4' },
      h(
        'header',
        { className: 'flex items-center justify-between border-b border-ash-800 pb-3' },
        h('span', { className: 'font-mono text-[11px] tracking-[0.14em] text-ash-400' }, 'THROUGHPUT'),
        h('span', { className: 'border border-moss-500/40 px-2 py-1 font-mono text-[11px] text-moss-300' }, '+18%'),
      ),
      h('p', { className: 'mt-4 font-mono text-3xl text-ash-100' }, '48.2 MB/s'),
      h('p', { className: 'mt-2 text-xs text-ash-400' }, 'Measured on the Drive FUSE mount over 60 seconds.'),
      h(
        'button',
        {
          type: 'button',
          className: 'mt-4 border border-ash-100 bg-ash-100 px-4 py-2 text-xs font-semibold text-ash-950 hover:bg-ash-200',
        },
        'Open report',
      ),
    ),
  };

  const report = auditSpec(cleanSpec, {});
  assert.equal(report.degenerate, false);
  assert.deepEqual(report.failed, [], `unexpected failures: ${report.failed.join(', ')}`);
  assert.equal(report.score, 100);
});

test('rules that cannot see everything declare a limitation', () => {
  const rule12 = RULES_BY_NUMBER[12];
  const rule13 = RULES_BY_NUMBER[13];
  assert.ok(rule12.limitations, 'rule 12 must document that effects are invisible to static markup');
  assert.ok(rule13.limitations, 'rule 13 must document its blind spot');
});

test('a degenerate render is reported rather than scored as clean', () => {
  const emptySpec = { id: 'empty', render: () => null };
  const report = auditSpec(emptySpec, {});
  assert.equal(report.degenerate, true, 'an empty render must be flagged degenerate');
  assert.ok(report.degenerateReason && report.degenerateReason.length > 10);
});

test('a render that throws is contained, not fatal', () => {
  const exploding = {
    id: 'exploding',
    render: () => {
      throw new Error('kaboom');
    },
  };
  const report = auditSpec(exploding, {});
  assert.equal(report.degenerate, true);
  assert.match(report.degenerateReason, /kaboom/);
});

test('the mock catalog itself passes its own auditor', () => {
  /**
   * The original catalog failed: three indigo-to-cyan gradients, a
   * `from-indigo-500 via-purple-500 to-rose-500` label, `backdrop-blur-2xl` on
   * nine cards, and a Lucide icon in nearly every entry. Its own auditor scored
   * it clean, because the auditor was reading the wrong string.
   */
  assert.ok(COMPONENT_CATALOG.length >= 10, 'catalog should still hold its entries');

  const failures = [];
  for (const spec of COMPONENT_CATALOG) {
    const report = auditSpec(spec, spec.defaultProps || {});
    if (report.degenerate) {
      failures.push(`${spec.id}: degenerate (${report.degenerateReason})`);
      continue;
    }
    if (report.failed.length > 0) {
      const detail = report.findings
        .filter((finding) => !finding.passed)
        .map((finding) => `${finding.ruleId} [${finding.evidence.join(' | ')}]`)
        .join('; ');
      failures.push(`${spec.id}: ${detail}`);
    }
  }
  assert.deepEqual(failures, [], `catalog entries failed their own audit:\n${failures.join('\n')}`);
});

test('no source file imports an icon package', () => {
  const offenders = [];
  for (const file of ['src/mock/components.tsx', 'src/App.tsx', 'src/components']) {
    const target = resolve(ROOT, file);
    if (!existsSync(target)) continue;
    // Directory case: walk one level down, which is where every component lives.
    if (file.endsWith('components')) {
      for (const entry of ['canvas/PreviewStage.tsx', 'gallery/ComponentSidebar.tsx', 'inspector/AntiCrutchAuditor.tsx', 'inspector/CodeInspector.tsx', 'inspector/PropsTuner.tsx', 'toolbar/HeaderToolbar.tsx']) {
        const text = readFileSync(resolve(ROOT, file, entry), 'utf8');
        if (/from ['"]lucide-react['"]/.test(text)) offenders.push(`${file}/${entry}`);
      }
      continue;
    }
    const text = readFileSync(target, 'utf8');
    if (/from ['"]lucide-react['"]/.test(text)) offenders.push(file);
  }
  assert.deepEqual(offenders, [], 'rule 10 forbids icon libraries');
});

test('package.json declares a library entry and no longer depends on lucide-react', () => {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
  assert.ok(pkg.exports['.'], 'the package needs a root export');
  assert.ok(pkg.exports['./audit'], 'the package needs an audit subpath export');
  assert.ok(pkg.main, 'the package needs a main entry');
  assert.equal(pkg.dependencies, undefined, 'lucide-react should be gone from dependencies');
  assert.ok(pkg.scripts['build:lib'], 'the package needs a library build script');
});
