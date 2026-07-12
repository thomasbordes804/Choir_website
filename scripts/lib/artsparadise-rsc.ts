/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Parser for artsparadise.net (a Next.js / React Server Components site).
 * Turns a page's HTML into clean Portable Text blocks + image references,
 * so the biography content can be migrated into Sanity.
 */

// --- 1. Parse the RSC "flight" payload into id→value rows ------------------

export function parseRscRows(html: string): Record<string, string> {
  const re = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g;
  let buf = '';
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) buf += JSON.parse(m[1]);

  const rows: Record<string, string> = {};
  for (const line of buf.split('\n')) {
    const mm = line.match(/^([0-9a-f]+):(.*)$/s);
    if (mm) rows[mm[1]] = mm[2];
  }
  return rows;
}

function parseRowValue(raw: string): any {
  if (!raw) return null;
  const t = raw[0];
  if (t === 'I' || t === 'H') return null; // client-module / hint rows
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function makeResolver(rows: Record<string, string>) {
  const cache: Record<string, any> = {};
  function resolveRow(id: string): any {
    if (id in cache) return cache[id];
    cache[id] = undefined;
    const raw = rows[id];
    if (raw == null) return undefined;
    const resolved = resolve(parseRowValue(raw));
    cache[id] = resolved;
    return resolved;
  }
  function resolve(node: any): any {
    if (typeof node === 'string') {
      if (node === '$undefined') return undefined;
      if (node.startsWith('$L') || node.startsWith('$@')) return resolveRow(node.slice(2));
      if (node === '$Sreact.fragment') return { $frag: true };
      if (node.startsWith('$S')) return undefined;
      if (node.startsWith('$') && node.length > 1 && !node.startsWith('$$')) {
        return resolveRow(node.slice(1));
      }
      return node;
    }
    if (Array.isArray(node)) return node.map(resolve);
    if (node && typeof node === 'object') {
      const out: any = {};
      for (const k of Object.keys(node)) out[k] = resolve(node[k]);
      return out;
    }
    return node;
  }
  return { resolveRow, resolve };
}

// --- 2. Convert a resolved React subtree into Portable Text ----------------

function isElement(node: any): boolean {
  return Array.isArray(node) && node[0] === '$';
}

export type Span = { _type: 'span'; _key: string; text: string; marks: string[] };
export type MarkDef = { _type: 'link'; _key: string; href: string };
export type Block = {
  _type: 'block';
  _key: string;
  style: string;
  markDefs: MarkDef[];
  children: Span[];
  listItem?: string;
  level?: number;
};
export type ExtractedImage = { src: string; alt: string; position: number };

let keyCounter = 0;
const key = (p = 'k') => `${p}-${(keyCounter++).toString(36)}`;

function inlineSpans(children: any, marks: string[], markDefs: MarkDef[], spans: Span[]) {
  if (children == null) return;
  if (typeof children === 'string') {
    if (children) spans.push({ _type: 'span', _key: key('s'), text: children, marks: [...marks] });
    return;
  }
  if (typeof children === 'number') {
    spans.push({ _type: 'span', _key: key('s'), text: String(children), marks: [...marks] });
    return;
  }
  if (Array.isArray(children)) {
    if (isElement(children)) handleInlineElement(children, marks, markDefs, spans);
    else for (const c of children) inlineSpans(c, marks, markDefs, spans);
    return;
  }
  if (children && typeof children === 'object' && 'children' in children) {
    inlineSpans(children.children, marks, markDefs, spans);
  }
}

function handleInlineElement(el: any, marks: string[], markDefs: MarkDef[], spans: Span[]) {
  const type = el[1];
  const props = el[3] || {};
  if (type === 'em' || type === 'i') {
    inlineSpans(props.children, [...marks, 'em'], markDefs, spans);
  } else if (type === 'strong' || type === 'b') {
    inlineSpans(props.children, [...marks, 'strong'], markDefs, spans);
  } else if (type === 'br') {
    spans.push({ _type: 'span', _key: key('s'), text: '\n', marks: [...marks] });
  } else if (type === 'a' || typeof type === 'object' || (typeof type === 'string' && type.startsWith('$'))) {
    const href = props.href;
    // Accept absolute, root-relative, and relative-slug hrefs (relative slugs
    // are how the old site links to its sub-pages). Reject the obfuscated
    // reversed-mailto links (e.g. "…@…:otliam").
    const validHref =
      href && typeof href === 'string' && !/otliam|mailto/i.test(href) && /^(https?:\/\/|\/|[a-z0-9])/i.test(href);
    if (validHref) {
      const markKey = key('link');
      markDefs.push({ _type: 'link', _key: markKey, href });
      inlineSpans(props.children, [...marks, markKey], markDefs, spans);
    } else {
      inlineSpans(props.children, marks, markDefs, spans);
    }
  } else {
    inlineSpans(props.children, marks, markDefs, spans);
  }
}

function textBlock(style: string, children: any): Block | null {
  const markDefs: MarkDef[] = [];
  const spans: Span[] = [];
  inlineSpans(children, [], markDefs, spans);
  const clean = spans.filter((s) => s.text !== '');
  if (clean.length === 0) return null;
  return { _type: 'block', _key: key('b'), style, markDefs, children: clean };
}

function walk(node: any, out: { blocks: Block[]; images: ExtractedImage[] }) {
  if (node == null) return;
  if (Array.isArray(node) && !isElement(node)) {
    for (const c of node) walk(c, out);
    return;
  }
  if (!isElement(node)) return;

  const type = node[1];
  const props = node[3] || {};

  const headingStyles: Record<string, string> = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4' };
  if (headingStyles[type]) {
    const b = textBlock(headingStyles[type], props.children);
    if (b) out.blocks.push(b);
    return;
  }
  if (type === 'p') { const b = textBlock('normal', props.children); if (b) out.blocks.push(b); return; }
  if (type === 'blockquote') { const b = textBlock('blockquote', props.children); if (b) out.blocks.push(b); return; }

  if (type === 'ul' || type === 'ol') {
    const listItem = type === 'ul' ? 'bullet' : 'number';
    const items = Array.isArray(props.children) ? props.children : [props.children];
    for (const li of items) {
      if (isElement(li) && li[1] === 'li') {
        const b = textBlock('normal', (li[3] || {}).children);
        if (b) { b.listItem = listItem; b.level = 1; out.blocks.push(b); }
      }
    }
    return;
  }

  // Image (Next.js <Image>: props.src is {src,...}; plain <img>: props.src is string)
  if (props && props.src && (props.alt !== undefined || typeof props.src === 'object')) {
    const src = typeof props.src === 'object' ? props.src.src : props.src;
    if (src && !/palette|logo|viola|feed\.svg/.test(src)) {
      out.images.push({ src, alt: props.alt || '', position: out.blocks.length });
    }
    return;
  }

  walk(props.children, out);
}

// --- 3. High-level page extraction -----------------------------------------

export type GalleryItem = { src: string; title: string; video: boolean };
export type Page = { title: string; blocks: Block[]; images: ExtractedImage[]; gallery: GalleryItem[] };

function totalText(blocks: Block[]): number {
  return blocks.reduce((s, b) => s + b.children.reduce((t, c) => t + c.text.length, 0), 0);
}
function is404(blocks: Block[]): boolean {
  return blocks.some((b) => b.style === 'h1' && b.children.some((c) => /Page non trouvée/.test(c.text)));
}

function extractGallery(html: string): GalleryItem[] {
  const re =
    /\{\\"src\\":\\"(\/assets\/[^\\"]+)\\",\\"thumbSrc\\":\\"[^\\"]+\\",\\"size\\":\[[0-9,]+\],\\"thumbSize\\":\[[0-9,]+\],\\"title\\":\\"([^\\"]*)\\",\\"video\\":(true|false)\}/g;
  const items: GalleryItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1].includes('.thumb.')) continue;
    items.push({ src: m[1], title: m[2] || '', video: m[3] === 'true' });
  }
  return items;
}

export function extractPage(html: string): Page {
  const rows = parseRscRows(html);
  const { resolveRow } = makeResolver(rows);

  let best: { blocks: Block[]; images: ExtractedImage[]; score: number } | null = null;
  for (const id of Object.keys(rows)) {
    const raw = rows[id];
    if (!raw || raw[0] !== '[') continue;
    keyCounter = 0;
    let resolved: any;
    try {
      resolved = resolveRow(id);
    } catch {
      continue;
    }
    if (!resolved) continue;
    const out = { blocks: [] as Block[], images: [] as ExtractedImage[] };
    walk(resolved, out);
    if (out.blocks.length === 0 || is404(out.blocks)) continue;
    const score = totalText(out.blocks);
    if (!best || score > best.score) best = { ...out, score };
  }

  const blocks = best ? best.blocks : [];
  const images = best ? best.images : [];
  const h1 = blocks.find((b) => b.style === 'h1');
  const title = h1 ? h1.children.map((c) => c.text).join('') : '';
  return { title, blocks, images, gallery: extractGallery(html) };
}

/**
 * Detect the "navigation" sub-links a chapter page lists to its sub-pages.
 * These are bullet items whose whole text is a single relative link
 * (e.g. « studies », « quintette-de-france »). Returns the hrefs + labels,
 * and the set of block keys to strip from the main body.
 */
export function findSubPageLinks(blocks: Block[]): {
  links: { href: string; title: string }[];
  navBlockKeys: Set<string>;
} {
  const links: { href: string; title: string }[] = [];
  const navBlockKeys = new Set<string>();
  for (const b of blocks) {
    if (b.style !== 'normal' || b.listItem !== 'bullet') continue;
    if (b.markDefs.length !== 1) continue;
    const def = b.markDefs[0];
    if (!/^[a-z0-9][a-z0-9-]*$/.test(def.href)) continue; // single relative segment
    const allLinked = b.children.every((c) => c.marks.includes(def._key));
    if (!allLinked) continue;
    links.push({ href: def.href, title: b.children.map((c) => c.text).join('').trim() });
    navBlockKeys.add(b._key);
  }
  return { links, navBlockKeys };
}
