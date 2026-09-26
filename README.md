# hyperstitch

A React component prototyping studio with an Anti-Crutch auditor that grades
what a component actually renders.

## The auditor

`src/audit/` implements all twenty anti-crutch design rules from `AGENTS.md` as a
data-driven table in `src/audit/rules.ts`, and runs them against the component's
**rendered output**.

That distinction is the whole point. A `ComponentSpec` carries two parallel
implementations: `render()`, which is what mounts, and `code()`, a
hand-maintained TypeScript string for the Code tab that is *supposed* to resemble
it. The previous auditor regex-matched `code()`, so a component whose `code()`
had drifted from its `render()` was graded on a string that does not run. The
first catalog entry scored clean while its `render()` carried a
`from-indigo-500 to-cyan-400` gradient.

`auditSpec` now mounts `render()` through `render-dom/server`, parses the
resulting markup into a small tree, and evaluates every rule against that tree:

```js
import { auditSpec } from 'hyperstitch/audit';

const report = auditSpec(spec, spec.defaultProps);
// { score, passed, total, failed, findings, markupLength, degenerate }
```

`render` needs a real HTML tree rather than a flat string, because several rules
are about structure: "no pill badge above the headline" and "no three icon boxes
in a row" are both questions about how elements relate to each other. `src/audit/parse.ts`
is a small HTML parser that answers them.

### Rules that cannot see everything

Rules 12 and 13 concern behaviour that leaves no trace in static markup: a
scroll observer or a pointer listener set up in an effect renders nothing. Those
rules match the class and data-attribute fingerprints of the pattern and declare
a `limitations` string, which the UI prints next to the verdict. A rule that
cannot see something says so rather than reporting a confident pass.

A component that renders too little to audit is reported as `degenerate` with a
reason, so an empty render cannot read as a clean bill of health.

## Setup

```bash
npm install
npm run build:all   # library to dist/, studio app to dist/app/
npm test            # builds the library, then runs the suite against it
```

| Script | What it does |
|---|---|
| `dev` | Studio on port 5185 |
| `build` | Typecheck and build the studio app to `dist/app` |
| `build:lib` | Build the library to `dist/` plus `.d.ts` declarations |
| `build:all` | Both, in that order |
| `test` | `build:lib`, then `node --test test/*.test.js` |
| `audit:catalog` | Grade every mock catalog entry, exit non-zero on any failure |

The app and the library write to different directories on purpose. Vite empties
`outDir` on every build, so with both writing to `dist/`, `npm run build`
silently deleted the library output and left every `exports` entry dangling.

## Package layout

Two entry points:

- `hyperstitch` — the full surface: components, themes, the mock catalog.
- `hyperstitch/audit` — the parser, the rule table and the engine, with no
  component imports. This is the part meant to run in CI.

`react` and `react-dom` are peer dependencies, kept external so a consuming app
never ends up with two copies of React.

## House conventions

The catalog is held to these by `npm run audit:catalog`, and they are worth
knowing before editing anything in `src/mock/`:

- Solid fills. No `bg-gradient-*`, no `backdrop-blur-*`.
- Spacing on a 4px baseline. That rules out Tailwind's half steps, so `p-1.5`,
  `p-2.5` and `gap-1.5` are all wrong here; use `p-2`, `p-3`.
- No text at colour step 500 or darker while it sits on a dark surface.
  `text-ash-400` is the floor. Dark text on a light fill is fine, and rule 7
  checks the background before it complains.
- Cards get `border-ash-800` and nothing tinted.
- Icons are the hand-authored marks in `src/components/marks/`, not a package.
  Rule 10 is absolute.

## License

MIT License. Copyright (c) 2026 Darnell Dijksteel.
