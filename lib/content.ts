import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export type PublishGate = { ok: boolean; reasons: string[] };

// Defense in depth: even if someone sets status=published by mistake,
// a post that fails these checks is never rendered publicly.
export function publishGate(p: any): PublishGate {
  const reasons: string[] = [];
  if (p.status !== 'published') reasons.push('status is not published');
  if (!p.heroImage) reasons.push('missing hero image');
  if (!p.heroAlt || p.heroAlt.trim().length < 8) reasons.push('missing alt text');
  if (!p.description || p.description.length < 80) reasons.push('meta description too short');
  if (!p.author) reasons.push('missing author');
  if (!p.lastVerified) reasons.push('missing last-verified date');
  if (!p.quickAnswer) reasons.push('missing quick answer');
  if ((p.sources ?? []).filter((s: any) => s.url).length < 2) reasons.push('fewer than 2 sources');
  if (p.factCheck?.status !== 'passed') reasons.push('fact-check not passed');
  if (p.factCheck?.reviewStatus !== 'approved') reasons.push('independent review not approved');
  if (p.publishDate && new Date(p.publishDate) > new Date()) reasons.push('scheduled for the future');
  return { ok: reasons.length === 0, reasons };
}

export async function getPublishedPosts(siteId: string) {
  const col = (reader.collections as any)[`posts_${siteId}`];
  const all = await col.all();
  const out = [];
  for (const entry of all) {
    const gate = publishGate(entry.entry);
    if (gate.ok) out.push({ slug: entry.slug, ...entry.entry });
  }
  out.sort((a: any, b: any) => (b.publishDate ?? '').localeCompare(a.publishDate ?? ''));
  return out as any[];
}

export async function getPost(siteId: string, slug: string) {
  const col = (reader.collections as any)[`posts_${siteId}`];
  const entry = await col.read(slug);
  if (!entry || !publishGate(entry).ok) return null;
  const { node } = await entry.content();
  const tree = Markdoc.transform(node);
  let author: any = null;
  if (entry.author) {
    author = await (reader.collections as any)[`authors_${siteId}`].read(entry.author);
  }
  return { slug, ...entry, tree, authorData: author };
}

// The admin stores uploaded images as a bare filename; the pipeline may store a full path.
export function imageUrl(siteId: string, value?: string | null) {
  if (!value) return '';
  if (value.startsWith('/') || value.startsWith('http')) return value;
  return `/images/${siteId}/${value}`;
}

// Social previews (Facebook, X, LinkedIn, WhatsApp) do not render SVG, so every SVG hero
// ships with a PNG of the same name. Falls back to the original value for other formats.
export function socialImageUrl(siteId: string, value?: string | null) {
  const u = imageUrl(siteId, value);
  return u.endsWith('.svg') ? u.replace(/\.svg$/, '.png') : u;
}

export function siteBaseUrl(domains: string[]) {
  return `https://${domains.find((d) => d !== 'localhost') ?? 'localhost'}`;
}

// Other published posts, same category first, newest first.
export async function getRelatedPosts(siteId: string, slug: string, category?: string | null, limit = 3) {
  const all = (await getPublishedPosts(siteId)).filter((p: any) => p.slug !== slug);
  const same = all.filter((p: any) => category && p.category === category);
  const rest = all.filter((p: any) => !(category && p.category === category));
  return [...same, ...rest].slice(0, limit);
}
