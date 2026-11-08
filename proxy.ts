import { NextResponse, type NextRequest } from 'next/server';
import { siteByHost } from './sites.config';

// Maps each domain to its site folder: example.com/x -> /s/<siteId>/x
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/keystatic') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/s/') ||
    pathname.startsWith('/images/') ||
    /\.[a-zA-Z0-9]+$/.test(pathname) && !pathname.endsWith('.xml') && !pathname.endsWith('.txt')
  ) {
    return NextResponse.next();
  }
  const site = siteByHost(req.headers.get('host'));
  const url = req.nextUrl.clone();
  const special: Record<string, string> = { '/sitemap.xml': '/sitemapxml', '/robots.txt': '/robotstxt' };
  const path = special[pathname] ?? pathname;
  url.pathname = `/s/${site.id}${path === '/' ? '' : path}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
