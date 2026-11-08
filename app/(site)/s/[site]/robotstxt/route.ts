import { siteById } from '../../../../../sites.config';

export const dynamic = 'force-static';
export function generateStaticParams() {
  return [{ site: 'site1' }];
}

export async function GET(_: Request, { params }: { params: Promise<{ site: string }> }) {
  const site = siteById((await params).site);
  if (!site) return new Response('Not found', { status: 404 });
  const host = site.domains.find((d) => d !== 'localhost') ?? 'localhost';
  return new Response(`User-agent: *\nAllow: /\nDisallow: /keystatic\nDisallow: /api/\n\nSitemap: https://${host}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
