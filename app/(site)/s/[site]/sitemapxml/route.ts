import { siteById } from '../../../../../sites.config';
import { getPublishedPosts } from '../../../../../lib/content';
import { legalSlugs } from '../../../../../lib/legal';

export const dynamic = 'force-static';
export function generateStaticParams() {
  return [{ site: 'site1' }];
}

export async function GET(_: Request, { params }: { params: Promise<{ site: string }> }) {
  const site = siteById((await params).site);
  if (!site) return new Response('Not found', { status: 404 });
  const base = `https://${site.domains.find((d) => d !== 'localhost') ?? 'localhost'}`;
  const posts = await getPublishedPosts(site.id);
  const urls = [
    { loc: `${base}/`, lastmod: undefined as string | undefined },
    ...posts.map((p: any) => ({ loc: `${base}/posts/${p.slug}`, lastmod: p.lastVerified })),
    ...legalSlugs.map((s) => ({ loc: `${base}/legal/${s}`, lastmod: undefined })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
