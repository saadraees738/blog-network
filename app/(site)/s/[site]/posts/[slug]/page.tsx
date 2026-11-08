import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteById, sites } from '../../../../../../sites.config';
import { getPost, getPublishedPosts, imageUrl } from '../../../../../../lib/content';
import { Render } from '../../../../../../components/Render';

export const dynamicParams = false;

export async function generateStaticParams() {
  const out: { site: string; slug: string }[] = [];
  for (const s of sites) {
    for (const p of await getPublishedPosts(s.id)) out.push({ site: s.id, slug: p.slug });
  }
  // Next requires at least one param when dynamicParams is false.
  return out.length ? out : [{ site: sites[0].id, slug: '__none__' }];
}

type P = { params: Promise<{ site: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { site: id, slug } = await params;
  const post = slug === '__none__' ? null : await getPost(id, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, images: post.heroImage ? [imageUrl(id, post.heroImage)] : [] },
  };
}

export default async function PostPage({ params }: P) {
  const { site: id, slug } = await params;
  const site = siteById(id);
  const post = slug === '__none__' ? null : await getPost(id, slug);
  if (!site || !post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate,
    dateModified: post.lastVerified ?? post.publishDate,
    image: imageUrl(id, post.heroImage),
    author: post.authorData ? { '@type': 'Person', name: post.authorData.name } : undefined,
  };

  return (
    <article className="narrow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="meta">
        {post.category ? <span className="badge">{post.category}</span> : null}{' '}
        <span className="badge">Facts verified {post.lastVerified}</span>
      </p>
      <h1>{post.title}</h1>
      <p className="meta">
        {post.authorData ? <>By {post.authorData.name} · </> : null}Published {post.publishDate}
      </p>
      {post.affiliateLinks ? (
        <p className="disclosure">
          This page contains affiliate links. We may earn a commission if you buy through them, at no cost to you.{' '}
          <a href="/legal/affiliate-disclosure">Learn more</a>.
        </p>
      ) : null}
      <img className="hero-img" src={imageUrl(id, post.heroImage)} alt={post.heroAlt} />
      {post.imageCredit ? <p className="credit">{post.imageCredit}</p> : null}
      <div className="quick"><strong>Quick answer:</strong> {post.quickAnswer}</div>
      <Render tree={post.tree} affiliate={post.affiliateLinks} />
      <h2>Sources</h2>
      <ol className="sources">
        {post.sources.map((s: any, i: number) => (
          <li key={i}>
            <a href={s.url} rel="noopener" target="_blank">{s.title}</a>
            {s.accessed ? <span className="meta"> (checked {s.accessed})</span> : null}
          </li>
        ))}
      </ol>
      {post.authorData ? (
        <div className="author">
          <div>
            <strong>{post.authorData.name}</strong>
            <div className="meta">{post.authorData.role}</div>
            <div>{post.authorData.bio}</div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
