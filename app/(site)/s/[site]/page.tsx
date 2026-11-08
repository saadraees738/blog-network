import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteById } from '../../../../sites.config';
import { getPublishedPosts, imageUrl } from '../../../../lib/content';

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Promise<{ site: string }> }): Promise<Metadata> {
  const site = siteById((await params).site);
  if (!site) return {};
  return { title: `${site.name}: ${site.tagline}`, description: site.tagline };
}

export default async function Home({ params }: { params: Promise<{ site: string }> }) {
  const site = siteById((await params).site);
  if (!site) notFound();
  const posts = await getPublishedPosts(site.id);
  return (
    <div className="wrap">
      <h1>{site.tagline}</h1>
      <p className="meta">Every article lists its sources and the date we last verified the facts.</p>
      {posts.length === 0 ? (
        <p className="empty">First articles are on the way.</p>
      ) : (
        <div className="grid">
          {posts.map((p: any) => (
            <a key={p.slug} className="card" href={`/posts/${p.slug}`}>
              <img src={imageUrl(site.id, p.heroImage)} alt={p.heroAlt} loading="lazy" />
              <div className="body">
                {p.category ? <span className="badge">{p.category}</span> : null}
                <h3>{p.title}</h3>
                <p className="meta">{p.description}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
