import { notFound } from 'next/navigation';
import Script from 'next/script';
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
  const EEA = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'];
  return (
    <>
      {site.gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',region:${JSON.stringify(EEA)}});
            gtag('js', new Date());
            gtag('config','${site.gaId}');
          `}</Script>
        </>
      )}
      <header className="site">
        <div className="wrap">
          <a className="brand" href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <img src="/icon.png" alt="" width={28} height={28} style={{ borderRadius: 6 }} />
            {site.name}
          </a>
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
