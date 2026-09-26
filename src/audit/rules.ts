import {
  classTokens,
  elementChildren,
  elements,
  normaliseWhitespace,
  parseHtml,
  type AuditNode,
} from './parse';
import type { AuditContext, AuditRule } from './types';

/**
 * The twenty anti-crutch design rules from AGENTS.md, as an executable table.
 *
 * Design decisions worth knowing before editing this file:
 *
 * 1. Every rule runs against rendered markup. The prior implementation matched
 *    regexes against `component.code(props)`, a hand-maintained string that is
 *    only supposed to resemble the component. Two of the ten catalog entries had
 *    already drifted between `code:` and `render:`, so a green audit said
 *    nothing about what rendered.
 *
 * 2. Each rule declares its `evidence` and, where that is a genuine blind spot,
 *    a `limitations` string. The report prints those caveats next to the
 *    verdict. A rule that cannot see something should say so rather than
 *    reporting a confident pass.
 *
 * 3. Rules return concrete evidence strings. "Found a gradient" is not useful;
 *    "from-indigo-500 to-cyan-400 on <div> in bento-metric" is.
 */

// ── shared matchers ──────────────────────────────────────────────────────────

/** Tailwind colour families that constitute the forbidden purple-to-blue axis. */
const PURPLE_FAMILY = ['purple', 'indigo', 'violet', 'fuchsia'];
const BLUE_FAMILY = ['blue', 'cyan', 'sky', 'teal'];

const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F000}-\u{1F0FF}]/u;

const BUZWORDS = [
  'supercharge', 'unleash', 'next-gen', 'next generation', 'game-changing',
  'game changing', 'seamlessly', 'effortless', 'revolutionize', 'revolutionise',
  'cutting-edge', 'cutting edge', 'world-class', 'delightful', 'beautiful',
  'powerful', 'robust solution', 'best-in-class', 'seamless', 'magical',
  'transformative', 'unprecedented',
];

/**
 * The forbidden font pairing, and the banned typeface.
 *
 * AGENTS.md names Inter as the crutch default and the Space Grotesk +
 * Instrument Serif pairing as a named cliché, so both are matched literally.
 */
const BANNED_FONT = /\binter\b/i;
const BANNED_PAIRING = [/space\s*grotesk/i, /instrument\s*serif/i];

/** Fonts that satisfy the "distinctive typography" requirement. */
const APPROVED_FONT_HINTS = [
  /jetbrains\s*mono/i, /ibm\s*plex\s*mono/i, /space\s*mono/i,
  /plus\s*jakarta/i, /archivo/i, /chivo/i, /darker\s*grotesque/i,
  /sora/i, /outfit/i, /satoshi/i, /general\s*sans/i, /degular/i,
  /neue\s*montserrat/i, /roboto\s*slab/i, /literata/i, /fraunces/i,
  /ibm\s*plex\s*serif/i, /source\s*serif/i, /newsreader/i,
];

/** 4px baseline. Tailwind's numeric scale is 4px-based, so 1 unit = 4px. */
const SPACING_UNIT_PX = 4;

/**
 * Parse a Tailwind spacing token to pixels.
 *
 * Covers the numeric scale, the fractional steps, and the explicit arbitrary
 * pixel form. Returns null for anything that is not a spacing utility, so
 * callers can ignore non-spacing tokens.
 */
function spacingPx(token: string): number | null {
  const explicit = /^(?:[pm][trblxy]?|gap|space-[xy]|gap-[xy]|inset|top|right|bottom|left)-(\d+(?:\.\d+)?)$/.exec(token);
  const fraction = /^(?:[pm][trblxy]?|gap|space-[xy]|gap-[xy]|inset|top|right|bottom|left)-(0\.5|1\.5|2\.5|3\.5)$/.exec(token);
  const arbitrary = /^(?:[pm][trblxy]?|gap|space-[xy]|gap-[xy])-\[(\d+(?:\.\d+)?)px\]$/.exec(token);

  if (fraction) {
    return Number.parseFloat(fraction[1]) * SPACING_UNIT_PX;
  }
  if (arbitrary) {
    return Number.parseFloat(arbitrary[1]);
  }
  if (explicit) {
    return Number.parseInt(explicit[1], 10) * SPACING_UNIT_PX;
  }
  return null;
}

/** Every class token on the element and its descendants that sets spacing. */
function spacingTokens(node: AuditNode): string[] {
  return classTokens(node).filter((token) => spacingPx(token) !== null);
}

function findClasses(root: AuditNode, predicate: (token: string) => boolean, limit = 6): string[] {
  const found: string[] = [];
  for (const element of elements(root)) {
    for (const token of element.classes) {
      if (predicate(token) && !found.includes(token)) found.push(token);
      if (found.length >= limit) return found;
    }
  }
  return found;
}

/** Find the nearest heading, if the node sits inside one. */
function isHeading(node: AuditNode): boolean {
  return /^h[1-6]$/.test(node.tag);
}

/** A card-like container: rounded, and either bordered or surface-filled. */
function isCardLike(node: AuditNode): boolean {
  const rounded = node.classes.some((c) => c.startsWith('rounded'));
  const surface = node.classes.some((c) => c.startsWith('bg-')) || 'background' in node.attributes;
  return rounded && (surface || node.classes.some((c) => c.startsWith('border')));
}

/** Parse `#rgb` / `#rrggbb` into a 0-1 relative luminance. */
function hexLuminance(hex: string): number {
  let value = hex.replace('#', '').trim();
  if (value.length === 3) {
    value = value.split('').map((char) => char + char).join('');
  }
  if (value.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(value)) return Number.NaN;
  const channels = [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/** Tailwind steps run light at low numbers, so "dark surface" is a high step. */
const DARK_STEP = 500;

const BG_TOKEN_RE = /^bg-([a-z]+)-(\d{3})(?:\/(\d{1,3}))?$/;
const BG_NAMED_RE = /^bg-(white|black|transparent|current|inherit)$/;

/**
 * Is the surface behind this element dark?
 *
 * Walks up until a background actually establishes one. A translucent fill
 * (`bg-white/10`) is skipped rather than treated as a light surface, because at
 * 10% alpha it leaves the parent's colour showing through, which is the whole
 * point of it.
 *
 * Returns `true` when nothing is found, because every component in this project
 * styles itself for a dark canvas.
 */
function sitsOnDarkSurface(node: AuditNode): boolean {
  let current: AuditNode | null = node;
  while (current && current.tag !== '#root') {
    for (const token of current.classes) {
      const named = BG_NAMED_RE.exec(token);
      if (named) {
        if (named[1] === 'white') return false;
        if (named[1] === 'black') return true;
        continue; // transparent / current / inherit establish nothing
      }
      const stepped = BG_TOKEN_RE.exec(token);
      if (stepped) {
        const step = Number.parseInt(stepped[2], 10);
        const alpha = stepped[3] === undefined ? 100 : Number.parseInt(stepped[3], 10);
        if (alpha >= 50) return step >= DARK_STEP;
        continue; // too translucent to establish the surface
      }
      if (token.startsWith('bg-[')) {
        const hex = /#([0-9a-fA-F]{3,6})/.exec(token);
        if (hex) {
          const luminance = hexLuminance(hex[1]);
          if (!Number.isNaN(luminance)) return luminance < 0.2;
        }
        continue;
      }
    }
    current = current.parent;
  }
  return true;
}

// ── the table ────────────────────────────────────────────────────────────────

export const RULES: AuditRule[] = [
  {
    id: 'rule-01-no-purple-blue-gradients',
    number: 1,
    name: 'No purple-to-blue gradients',
    statement: 'No purple-to-blue gradients anywhere.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        const gradient = element.classes.find((c) => c.startsWith('bg-gradient-') || c.startsWith('bg-linear-'));
        if (!gradient) continue;
        const from = element.classes.find((c) => c.startsWith('from-'));
        const to = element.classes.find((c) => c.startsWith('to-'));
        const via = element.classes.find((c) => c.startsWith('via-'));
        if (!from || !to) continue;
        const fromFamily = from.slice('from-'.length).replace(/-\d{2,3}$/, '');
        const toFamily = to.slice('to-'.length).replace(/-\d{2,3}$/, '');
        const viaFamily = via ? via.slice('via-'.length).replace(/-\d{2,3}$/, '') : null;
        const crosses = PURPLE_FAMILY.includes(fromFamily)
          && (BLUE_FAMILY.includes(toFamily) || (viaFamily !== null && BLUE_FAMILY.includes(viaFamily)));
        if (crosses) {
          hits.push(`${[gradient, from, via, to].filter(Boolean).join(' ')} on <${element.tag}>`);
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No gradient crosses from a purple family into a blue family.'
          : `${hits.length} purple-to-blue gradient${hits.length === 1 ? '' : 's'} in the rendered output.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-02-no-gradient-hero-text',
    number: 2,
    name: 'No gradient hero text',
    statement: 'No gradient hero text; solid colors only.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits = findClasses(root, (c) => c === 'bg-clip-text' || c === 'text-transparent' || c === 'bg-clip-border');
      const gradientText = elements(root).filter((e) =>
        e.classes.includes('bg-clip-text') && e.classes.includes('text-transparent'));
      return {
        passed: gradientText.length === 0,
        detail: gradientText.length === 0
          ? 'No text element uses a clipped gradient fill.'
          : `${gradientText.length} element${gradientText.length === 1 ? '' : 's'} render text through bg-clip-text.`,
        evidence: gradientText.slice(0, 4).map((e) => `<${e.tag}> ${e.classes.filter((c) => c === 'bg-clip-text' || c === 'text-transparent').join(' ')}`),
      };
    },
  },
  {
    id: 'rule-03-no-emoji-in-ui',
    number: 3,
    name: 'No emojis in headings or UI',
    statement: 'No emojis in headings or UI elements.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        // Only flag emoji that reach a user: in own text, or in a heading, a
        // button, a badge-like span, or an aria-label.
        const candidates = [element.ownText, element.attributes['aria-label'] ?? ''].filter(Boolean);
        for (const value of candidates) {
          if (!EMOJI_RE.test(value)) continue;
          const userFacing = isHeading(element)
            || element.tag === 'button'
            || element.classes.some((c) => c.startsWith('rounded-full') || c.startsWith('uppercase'))
            || 'aria-label' in element.attributes;
          if (userFacing) {
            hits.push(`<${element.tag}> ${JSON.stringify(value.trim().slice(0, 24))}`);
          }
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No emoji reaches a heading, button, badge or accessible name.'
          : `${hits.length} user-facing emoji occurrence${hits.length === 1 ? '' : 's'}.`,
        evidence: hits.slice(0, 5),
      };
    },
  },
  {
    id: 'rule-04-no-inter-font',
    number: 4,
    name: 'No Inter typeface',
    statement: 'Do not use the Inter font; choose distinctive typography.',
    evidence: 'markup',
    limitations:
      'Matches the rendered class and inline style only. A font pulled in by an external stylesheet is not visible here.',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        for (const token of element.classes) {
          if (BANNED_FONT.test(token)) hits.push(`class="${token}"`);
        }
        const style = element.attributes.style ?? '';
        if (style && BANNED_FONT.test(style)) hits.push(`style="${style.slice(0, 60)}"`);
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'Inter does not appear in the rendered output.'
          : `Inter referenced ${hits.length} time${hits.length === 1 ? '' : 's'}.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-05-no-colored-card-borders',
    number: 5,
    name: 'No colored borders on cards',
    statement: 'No colored borders on cards; use neutral structural borders.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        if (!isCardLike(element)) continue;
        const tinted = element.classes.filter((c) =>
          c.startsWith('border-')
          && PURPLE_FAMILY.concat(BLUE_FAMILY, ['emerald', 'amber', 'rose', 'green', 'red', 'yellow', 'teal', 'fuchsia'])
            .some((family) => c.startsWith(`border-${family}-`)));
        if (tinted.length > 0) {
          hits.push(`<${element.tag}> ${tinted.join(' ')}`);
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No card-like container carries a tinted border.'
          : `${hits.length} card container${hits.length === 1 ? '' : 's'} with a tinted border.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-06-no-glassmorphism',
    number: 6,
    name: 'No glassmorphism or heavy blur',
    statement: 'No glassmorphism or heavy background blurs.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const blurs: string[] = [];
      for (const element of elements(root)) {
        const blur = element.classes.find((c) => c.startsWith('backdrop-blur-') && c !== 'backdrop-blur-0' && c !== 'backdrop-blur-none');
        if (blur) blurs.push(`<${element.tag}> ${blur}`);
      }
      // Also catch a raw CSS blur in an inline style.
      for (const element of elements(root)) {
        const style = element.attributes.style ?? '';
        const match = /blur\((\d+)px\)/.exec(style);
        if (match && Number.parseInt(match[1], 10) >= 8) {
          blurs.push(`<${element.tag}> style blur(${match[1]}px)`);
        }
      }
      return {
        passed: blurs.length === 0,
        detail: blurs.length === 0
          ? 'No backdrop blur on any rendered element.'
          : `${blurs.length} element${blurs.length === 1 ? '' : 's'} blur what is behind them.`,
        evidence: blurs.slice(0, 5),
      };
    },
  },
  {
    id: 'rule-07-no-low-contrast-grey',
    number: 7,
    name: 'No low-contrast grey text',
    statement: 'Avoid low-contrast dark mode; use stark, accessible contrast.',
    evidence: 'markup',
    limitations:
      'Evaluates declared Tailwind colour steps and the nearest declared background, not composited pixels. It cannot see a background painted by an ancestor several levels up, a CSS gradient, or an image.',
    evaluate: ({ root }) => {
      // Tailwind steps run light at low numbers and dark at high ones, so on a
      // dark surface the low-contrast end is the *high* steps: `text-zinc-600`
      // on near-black is about 3.5:1, `text-zinc-400` is about 7:1. The original
      // implementation compared the wrong direction and flagged every legible
      // text node in the project.
      //
      // A dark step is only a violation when it sits on a dark surface. Dark
      // text on a light button (`text-ash-950` on `bg-ash-100`) is the opposite
      // of the problem this rule is about.
      //
      // The check is family-agnostic, so `text-ash-600` is caught exactly as
      // `text-zinc-600` would be, and renaming the ramp cannot dodge it.
      const hits: string[] = [];
      for (const element of elements(root)) {
        const text = element.classes.find((c) => /^text-[a-z]+-\d{3}$/.test(c));
        if (!text) continue;
        const step = Number.parseInt(text.split('-').pop() as string, 10);
        if (step < DARK_STEP) continue;
        if (element.ownText.trim().length === 0) continue;
        if (!sitsOnDarkSurface(element)) continue;
        hits.push(`<${element.tag}> ${text} on dark surface ${JSON.stringify(element.ownText.trim().slice(0, 20))}`);
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No dim text sits on a dark surface.'
          : `${hits.length} text node${hits.length === 1 ? '' : 's'} at colour step ${DARK_STEP} or darker on a dark surface.`,
        evidence: hits.slice(0, 5),
      };
    },
  },
  {
    id: 'rule-08-no-three-icon-boxes',
    number: 8,
    name: 'No three-icon-boxes-in-a-row',
    statement: 'Do not use the standard "3 icon boxes in a row" feature section.',
    evidence: 'markup',
    limitations:
      'Structural heuristic: flags a grid of exactly three equal children that each pair a small graphic with a short label. It cannot judge whether the layout is editorial.',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        if (!element.classes.some((c) => c === 'grid-cols-3')) continue;
        const children = elementChildren(element);
        if (children.length !== 3) continue;
        const eachHasGraphic = children.every((child) =>
          elements(child).some((e) => e.tag === 'svg' || e.tag === 'img')
          || child.classes.some((c) => c.startsWith('text-2xl') || c.startsWith('text-3xl')));
        const eachHasLabel = children.every((child) => child.text.trim().length > 0);
        if (eachHasGraphic && eachHasLabel) {
          hits.push(`<${element.tag} class="grid-cols-3"> with 3 graphic+label children`);
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No three-up icon-and-label row.'
          : `${hits.length} three-up icon row${hits.length === 1 ? '' : 's'}.`,
        evidence: hits.slice(0, 3),
      };
    },
  },
  {
    id: 'rule-09-no-pill-badge-above-headline',
    number: 9,
    name: 'No pill badge above the headline',
    statement: 'Do not use pill-shaped badges above the main headline.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        if (!isHeading(element)) continue;
        // Walk backwards through preceding siblings for a pill.
        const parent = element.parent;
        if (!parent) continue;
        const siblings = elementChildren(parent);
        const position = siblings.findIndex((s) => s === element);
        if (position <= 0) continue;
        for (let i = position - 1; i >= 0 && i >= position - 2; i -= 1) {
          const previous = siblings[i];
          const isPill = previous.classes.includes('rounded-full')
            && previous.classes.some((c) => /^px-/.test(c))
            && previous.classes.some((c) => /^py-/.test(c))
            && previous.classes.some((c) => c.startsWith('text-xs') || c.startsWith('text-[1') || c.includes('uppercase'));
          if (isPill) {
            hits.push(`<${previous.tag} class="${previous.classes.join(' ')}"> directly above <${element.tag}>`);
            break;
          }
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No pill-shaped badge precedes a heading.'
          : `${hits.length} pill badge${hits.length === 1 ? '' : 's'} placed above a headline.`,
        evidence: hits.slice(0, 3),
      };
    },
  },
  {
    id: 'rule-10-no-lucide-icons',
    number: 10,
    name: 'No Lucide icons',
    statement: 'Do not use Lucide icons; use sharp custom SVG paths or typography.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        if (element.tag !== 'svg') continue;
        const marker = element.classes.find((c) => c.startsWith('lucide'));
        if (marker) {
          hits.push(`<svg class="${element.classes.join(' ')}">`);
          continue;
        }
        // lucide also stamps data-lucide on its own wrapper in some versions.
        if ('data-lucide' in element.attributes) hits.push(`<svg data-lucide>`);
      }
      // react-icons and other icon packs are the same crutch by another name.
      for (const element of elements(root)) {
        const iconish = element.classes.find((c) =>
          c.startsWith('react-icons') || c.startsWith('heroicon') || c.startsWith('fa-'));
        if (iconish) hits.push(`<${element.tag} class="${iconish}">`);
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No icon-library glyphs in the rendered output.'
          : `${hits.length} icon-library element${hits.length === 1 ? '' : 's'} in the rendered output.`,
        evidence: hits.slice(0, 5),
      };
    },
  },
  {
    id: 'rule-11-no-default-shadcn',
    number: 11,
    name: 'No untouched shadcn defaults',
    statement: 'Do not output default/untouched shadcn components; customise heavily.',
    evidence: 'markup',
    evaluate: ({ root, source }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        for (const [name, value] of Object.entries(element.attributes)) {
          if (name.startsWith('data-slot')) {
            hits.push(`<${element.tag} ${name}="${value}">`);
          }
        }
      }
      if (source) {
        if (/\bcn\s*\(/.test(source)) hits.push('source calls cn()');
        if (/\bclassName=\{cn\(/.test(source)) hits.push('source uses className={cn(...)}');
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No shadcn data-slot stamps or cn() composition.'
          : `${hits.length} shadcn default signature${hits.length === 1 ? '' : 's'}.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-12-no-fade-in-on-scroll',
    number: 12,
    name: 'No lazy fade-in on scroll',
    statement: 'No lazy "fade-in on scroll" animations.',
    evidence: 'markup',
    limitations:
      'Static markup cannot reveal a scroll observer, so this matches the class-level and data-attribute fingerprints of the pattern. A component that hides the trigger in an effect would not be caught.',
    evaluate: ({ root }) => {
      const fingerprints = [
        (c: string) => /^animate-(fade|slide|fade-in|slide-up)/.test(c),
        (c: string) => /fade-in(-up|-down)?$/.test(c),
        (c: string) => /^while-in-view/.test(c),
        (c: string) => /^data-(in-view|while-in-view|viewport)$/.test(c),
        (c: string) => c === 'reveal' || c === 'reveal-on-scroll',
      ];
      const hits: string[] = [];
      for (const element of elements(root)) {
        for (const token of element.classes) {
          if (fingerprints.some((f) => f(token))) {
            hits.push(`<${element.tag} class="${token}">`);
          }
        }
        for (const name of Object.keys(element.attributes)) {
          if (fingerprints.some((f) => f(name))) hits.push(`<${element.tag} ${name}>`);
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No scroll-triggered reveal fingerprint in the markup.'
          : `${hits.length} scroll-reveal fingerprint${hits.length === 1 ? '' : 's'}.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-13-no-cursor-glow',
    number: 13,
    name: 'No cursor-following glow',
    statement: 'No cursor-following glow beams or spotlight effects.',
    evidence: 'markup',
    limitations:
      'Same blind spot as rule 12: a cursor listener set up in an effect produces no markup. Detects the mix-blend and radial-glow fingerprints and any inline radial gradient.',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        for (const token of element.classes) {
          if (token.startsWith('mix-blend-')) hits.push(`<${element.tag} class="${token}">`);
          if (/^(cursor-glow|spotlight|mouse-glow|pointer-glow)$/.test(token)) hits.push(`<${element.tag} class="${token}">`);
        }
        const style = element.attributes.style ?? '';
        if (/radial-gradient/.test(style) && /(cursor|mouse|pointer|--x|--y)/i.test(style)) {
          hits.push(`<${element.tag}> inline radial gradient with pointer coordinates`);
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No blend-mode or pointer-tracked gradient fingerprints.'
          : `${hits.length} cursor-effect fingerprint${hits.length === 1 ? '' : 's'}.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-14-no-fade-on-hover',
    number: 14,
    name: 'No fade-on-hover buttons',
    statement: 'No standard "fade on hover" buttons; use sharp state changes.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        if (element.tag !== 'button' && element.tag !== 'a') continue;
        const fades = element.classes.filter((c) => /^hover:opacity-/.test(c));
        const opacityFades = element.classes.filter((c) =>
          /^transition-(opacity|all)$/.test(c) && fades.length > 0);
        if (fades.length > 0) {
          hits.push(`<${element.tag}> ${[...fades, ...opacityFades].join(' ')}`);
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No interactive element fades itself on hover.'
          : `${hits.length} interactive element${hits.length === 1 ? '' : 's'} fade on hover.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-15-spacing-grid-consistency',
    number: 15,
    name: 'Mathematical spacing consistency',
    statement: 'Maintain strict, mathematical consistency in the spacing system.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const offenders = new Set<string>();
      for (const element of elements(root)) {
        for (const token of element.classes) {
          const px = spacingPx(token);
          if (px === null) continue;
          if (px % SPACING_UNIT_PX !== 0) offenders.add(`${token} (${px}px)`);
        }
      }
      const list = [...offenders];
      return {
        passed: list.length === 0,
        detail: list.length === 0
          ? `Every spacing utility lands on the ${SPACING_UNIT_PX}px baseline.`
          : `${list.length} spacing value${list.length === 1 ? '' : 's'} off the ${SPACING_UNIT_PX}px baseline.`,
        evidence: list.slice(0, 6),
      };
    },
  },
  {
    id: 'rule-16-no-em-dash-overuse',
    number: 16,
    name: 'No em-dash overuse',
    statement: 'Do not overuse em dashes in copy; at most one per page.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        if (!element.ownText.includes('\u2014')) continue;
        hits.push(`<${element.tag}> ${JSON.stringify(element.ownText.trim().slice(0, 40))}`);
      }
      return {
        passed: hits.length <= 1,
        detail: hits.length === 0
          ? 'No em dash in the copy.'
          : hits.length === 1
            ? 'One em dash, within the limit.'
            : `${hits.length} em dashes, over the limit of one.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-17-no-generic-buzzword-copy',
    number: 17,
    name: 'No generic buzzword copy',
    statement: 'No generic buzzword copy; write concrete, specific copy.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const found = new Map<string, string>();
      for (const element of elements(root)) {
        const text = element.text;
        if (!text) continue;
        const lowered = text.toLowerCase();
        for (const word of BUZWORDS) {
          if (!lowered.includes(word)) continue;
          if (!found.has(word)) {
            const at = lowered.indexOf(word);
            found.set(word, `<${element.tag}> ...${normaliseWhitespace(text.slice(Math.max(0, at - 24), at + word.length + 16))}...`);
          }
        }
      }
      const list = [...found.entries()];
      return {
        passed: list.length === 0,
        detail: list.length === 0
          ? 'No buzzword phrasing in the rendered copy.'
          : `${list.length} buzzword${list.length === 1 ? '' : 's'} in the rendered copy.`,
        evidence: list.slice(0, 5).map(([word, where]) => `"${word}" in ${where}`),
      };
    },
  },
  {
    id: 'rule-18-no-sans-italic-accents',
    number: 18,
    name: 'No random serif italic accents',
    statement: 'Do not use random serif italic accents just to look artsy.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        const italic = element.classes.some((c) => c === 'italic' || c.startsWith('italic-') || /^italic$/.test(c));
        const serif = element.classes.some((c) => c.startsWith('font-serif'));
        if (italic) {
          hits.push(`<${element.tag}> italic${serif ? ' + serif' : ''} on ${JSON.stringify(element.ownText.trim().slice(0, 20)) || '(no text)'}`);
        }
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No italic accent typography.'
          : `${hits.length} italic element${hits.length === 1 ? '' : 's'} used as an accent.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
  {
    id: 'rule-19-no-space-grotesk-instrument-serif',
    number: 19,
    name: 'No Space Grotesk + Instrument Serif',
    statement: 'Do not use the "Space Grotesk + Instrument Serif" combination.',
    evidence: 'markup',
    limitations:
      'Matches rendered classes and inline styles. A pairing declared only in the page stylesheet is not visible here.',
    evaluate: ({ root }) => {
      const haystack: string[] = [];
      for (const element of elements(root)) {
        haystack.push(...element.classes, element.attributes.style ?? '');
      }
      const joined = haystack.join(' ');
      const present = BANNED_PAIRING.filter((re) => re.test(joined)).map((re) => re.source);
      const bannedFont = BANNED_FONT.test(joined);
      const all = [...present];
      if (bannedFont) all.push('Inter');
      return {
        passed: all.length === 0,
        detail: all.length === 0
          ? 'Neither the named pairing nor the banned default typeface is used.'
          : `Banned typography in use: ${all.join(', ')}.`,
        evidence: all,
      };
    },
  },
  {
    id: 'rule-20-no-grain-overlay',
    number: 20,
    name: 'No grain or noise overlays',
    statement: 'No grain/noise overlays.',
    evidence: 'markup',
    evaluate: ({ root }) => {
      const hits: string[] = [];
      for (const element of elements(root)) {
        for (const token of element.classes) {
          if (/^(grain|noise|noise-overlay|film-grain)/.test(token)) {
            hits.push(`<${element.tag} class="${token}">`);
          }
          if (token === 'feTurbulence' || token === 'turbulence') hits.push(`<${element.tag} class="${token}">`);
        }
        const style = element.attributes.style ?? '';
        if (/(url\(.*noise|feTurbulence|grain)/i.test(style)) {
          hits.push(`<${element.tag} style="${style.slice(0, 50)}">`);
        }
        // An SVG filter primitive is the mechanism a grain overlay is built from.
        if (element.tag === 'feTurbulence') hits.push('<feTurbulence>');
      }
      return {
        passed: hits.length === 0,
        detail: hits.length === 0
          ? 'No grain or noise overlay in the rendered output.'
          : `${hits.length} grain/noise element${hits.length === 1 ? '' : 's'}.`,
        evidence: hits.slice(0, 4),
      };
    },
  },
];

/** Sanity check surfaced by the test suite: the table must stay at twenty. */
export const RULE_COUNT = RULES.length;

export const RULES_BY_NUMBER: Record<number, AuditRule> = Object.fromEntries(
  RULES.map((rule) => [rule.number, rule]),
);

/** True when at least one declared typeface is an approved distinctive choice. */
export function hasApprovedTypeface(tokens: string[]): boolean {
  const joined = tokens.join(' ');
  return APPROVED_FONT_HINTS.some((re) => re.test(joined));
}

export { parseHtml, normaliseWhitespace };
