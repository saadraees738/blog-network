import { notFound } from 'next/navigation';
import { siteById, sites } from '../../../../sites.config';
import { legalSlugs, legalPages } from '../../../../lib/legal';

export function generateStaticParams() {
  return sites.map((s) => ({ site: s.id }));
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site: id } = await params;
  const site = siteById(id);
  if (!site) notFound();
  const pages = legalPages(site);
  return (
    <>
      <header className="site">
        <div className="wrap">
          <a className="brand" href="/">{site.name}</a>
          <nav>
            <a href="/">Latest</a>
            <a href="/legal/about">About</a>
            <a href="/legal/editorial-policy">How we work</a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site">
        <div className="wrap">
          <p>
            {legalSlugs.map((slug) => (
              <a key={slug} href={`/legal/${slug}`}>{(pages as any)[slug].title}</a>
            ))}
          </p>
          <p>© {new Date().getFullYear()} {site.name}. Some links are affiliate links; see our disclosure.</p>
        </div>
      </footer>
    </>
  );
}
