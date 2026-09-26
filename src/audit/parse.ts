/**
 * A minimal HTML tree parser.
 *
 * The auditor needs structure, not a flat string. Rules like "no pill badge
 * above the headline" and "no three icon boxes in a row" are about how elements
 * relate to each other, and a regex over markup cannot answer either question.
 *
 * This is not a spec-compliant parser and does not try to be. It handles the
 * subset that `renderToStaticMarkup` actually emits: void elements, self-closing
 * syntax, quoted attributes, text nodes, and comments. Anything it cannot
 * represent faithfully it keeps as a text node rather than guessing.
 */

/** Elements that never have children in the markup React emits. */
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/** Elements whose content is raw text, not markup. */
const RAW_TEXT_ELEMENTS = new Set(['script', 'style']);

export interface AuditNode {
  tag: string;
  attributes: Record<string, string>;
  /** Class tokens, split and de-duplicated. Empty for non-classed elements. */
  classes: string[];
  children: AuditNode[];
  /** Concatenated descendant text, whitespace-collapsed. */
  text: string;
  /** Own text content only, not descendants. */
  ownText: string;
  /** Depth from the root; the root itself is 0. */
  depth: number;
  /** Index among its parent's element children. */
  index: number;
  parent: AuditNode | null;
}

const ATTRIBUTE_RE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  let match: RegExpExecArray | null;
  ATTRIBUTE_RE.lastIndex = 0;
  while ((match = ATTRIBUTE_RE.exec(source)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    if (!(name in attributes)) {
      attributes[name] = decodeEntities(value);
    }
  }
  return attributes;
}

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
  '#39': "'", '#x27': "'",
};

export function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body: string) => {
    const known = ENTITIES[body.toLowerCase()];
    if (known !== undefined) return known;
    if (body.startsWith('#x') || body.startsWith('#X')) {
      const code = Number.parseInt(body.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    if (body.startsWith('#')) {
      const code = Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return whole;
  });
}

/** Collapse runs of whitespace so text comparisons are not formatting-sensitive. */
export function normaliseWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

export function createNode(tag: string, attributes: Record<string, string>, depth: number, index: number): AuditNode {
  const classAttribute = attributes.class ?? '';
  return {
    tag,
    attributes,
    classes: classAttribute.split(/\s+/).filter(Boolean),
    children: [],
    text: '',
    ownText: '',
    depth,
    index,
    parent: null,
  };
}

/** Recompute `text` for a node and all descendants. Call once after parsing. */
function hydrateText(node: AuditNode): void {
  let own = '';
  for (const child of node.children) {
    if (child.tag === '#text') {
      own += (child as unknown as { value: string }).value;
    } else {
      hydrateText(child);
      own += ` ${child.text} `;
    }
  }
  node.ownText = normaliseWhitespace(own);
  node.text = node.ownText;
}

interface TextChild extends AuditNode {
  value: string;
}

function makeTextNode(value: string, depth: number): TextChild {
  const node = createNode('#text', {}, depth, 0) as TextChild;
  node.value = value;
  return node;
}

/**
 * Parse an HTML string into a tree. Returns the synthetic root node.
 *
 * Unclosed elements are closed implicitly at the end of input, which is the
 * forgiving behaviour React's own output never needs but keeps the auditor from
 * throwing on hand-written fixture markup in tests.
 */
export function parseHtml(html: string): AuditNode {
  const root = createNode('#root', {}, 0, 0);
  const stack: AuditNode[] = [root];
  let cursor = 0;
  let autoIndex = 0;

  const current = (): AuditNode => stack[stack.length - 1];

  const pushElement = (tag: string, attributes: Record<string, string>, selfClosing: boolean): void => {
    const parent = current();
    const node = createNode(tag, attributes, parent.depth + 1, autoIndex++);
    node.parent = parent;
    parent.children.push(node);
    if (!selfClosing && !VOID_ELEMENTS.has(tag)) {
      stack.push(node);
    }
  };

  const addText = (value: string): void => {
    if (!value) return;
    const parent = current();
    parent.children.push(makeTextNode(decodeEntities(value), parent.depth + 1));
  };

  while (cursor < html.length) {
    const open = html.indexOf('<', cursor);
    if (open === -1) {
      addText(html.slice(cursor));
      break;
    }
    if (open > cursor) {
      addText(html.slice(cursor, open));
    }

    // Comment
    if (html.startsWith('<!--', open)) {
      const end = html.indexOf('-->', open + 4);
      cursor = end === -1 ? html.length : end + 3;
      continue;
    }
    // Doctype or processing instruction
    if (html[open + 1] === '!' || html[open + 1] === '?') {
      const end = html.indexOf('>', open);
      cursor = end === -1 ? html.length : end + 1;
      continue;
    }

    // Closing tag
    if (html[open + 1] === '/') {
      const end = html.indexOf('>', open);
      const tag = html.slice(open + 2, end === -1 ? html.length : end).trim().toLowerCase();
      for (let i = stack.length - 1; i > 0; i -= 1) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      cursor = end === -1 ? html.length : end + 1;
      continue;
    }

    // Opening tag
    const end = html.indexOf('>', open);
    if (end === -1) {
      addText(html.slice(open));
      break;
    }
    let inner = html.slice(open + 1, end);
    const selfClosing = inner.trimEnd().endsWith('/');
    if (selfClosing) {
      inner = inner.trimEnd().slice(0, -1);
    }
    const nameMatch = /^([a-zA-Z][-a-zA-Z0-9:._]*)/.exec(inner);
    if (!nameMatch) {
      cursor = end + 1;
      continue;
    }
    const tag = nameMatch[1].toLowerCase();
    const attributes = parseAttributes(inner.slice(nameMatch[1].length));
    pushElement(tag, attributes, selfClosing);

    if (RAW_TEXT_ELEMENTS.has(tag) && !selfClosing) {
      // Consume to the matching close tag without parsing the contents.
      const closeTag = `</${tag}`;
      const closeIndex = html.toLowerCase().indexOf(closeTag, end + 1);
      const bodyEnd = closeIndex === -1 ? html.length : closeIndex;
      addText(html.slice(end + 1, bodyEnd));
      if (closeIndex !== -1) {
        const gt = html.indexOf('>', closeIndex);
        cursor = gt === -1 ? html.length : gt + 1;
      } else {
        cursor = html.length;
      }
      if (stack[stack.length - 1].tag === tag) stack.pop();
      continue;
    }

    cursor = end + 1;
  }

  hydrateText(root);
  return root;
}

/** Depth-first walk, root first, parents before children. */
export function walk(node: AuditNode, visit: (node: AuditNode) => void): void {
  visit(node);
  for (const child of node.children) {
    if (child.tag !== '#text') walk(child, visit);
  }
}

/** Every element node in the tree, excluding the synthetic root and text nodes. */
export function elements(node: AuditNode): AuditNode[] {
  const found: AuditNode[] = [];
  walk(node, (current) => {
    if (current !== node && current.tag !== '#text') found.push(current);
  });
  return found;
}

/** Element children of a node, in document order. */
export function elementChildren(node: AuditNode): AuditNode[] {
  return node.children.filter((child) => child.tag !== '#text') as AuditNode[];
}

/** Nearest ancestor matching a predicate, or null. */
export function closest(node: AuditNode, predicate: (n: AuditNode) => boolean): AuditNode | null {
  let current = node.parent;
  while (current && current.tag !== '#root') {
    if (predicate(current)) return current;
    current = current.parent;
  }
  return null;
}

/** All element descendants of a node, in document order. */
export function descendants(node: AuditNode): AuditNode[] {
  return elements(node);
}

/** Does any class on the node, or on any descendant, match a predicate? */
export function anyClass(node: AuditNode, predicate: (token: string) => boolean): boolean {
  return elements(node).some((element) => element.classes.some(predicate));
}

/** Collect class tokens from a node and all its descendants. */
export function classTokens(node: AuditNode): string[] {
  const tokens: string[] = [];
  for (const element of elements(node)) tokens.push(...element.classes);
  return tokens;
}
