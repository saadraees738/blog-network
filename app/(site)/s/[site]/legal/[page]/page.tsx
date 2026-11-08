import { notFound } from 'next/navigation';
import { siteById, sites } from '../../../../../../sites.config';
import { legalPages, legalSlugs } from '../../../../../../lib/legal';

export const dynamicParams = false;

export function generateStaticParams() {
  return sites.flatMap((s) => legalSlugs.map((page) => ({ site: s.id, page })));
}

export default async function Legal({ params }: { params: Promise<{ site: string; page: string }> }) {
  const { site: id, page } = await params;
  const site = siteById(id);
  if (!site) notFound();
  const doc = (legalPages(site) as any)[page];
  if (!doc) notFound();
  return (
    <div className="narrow">
      <h1>{doc.title}</h1>
      {doc.body.map((t: string, i: number) => (
        <p key={i}>{t}</p>
      ))}
    </div>
  );
}
