// One entry per blog. Adding a site = adding an entry here (plus its domain in Vercel).
// Everything marked PLACEHOLDER must be replaced before launch.

export type SiteConfig = {
  id: string; // folder/collection key: content/<id>/...
  name: string; // PLACEHOLDER brand name
  tagline: string;
  domains: string[]; // hostnames that map to this site (no protocol)
  contactEmail: string; // PLACEHOLDER
  twitter?: string;
  affiliateDisclosure: boolean;
};

export const sites: SiteConfig[] = [
  {
    id: 'site1',
    name: 'Stackbrook',
    tagline: 'Hands-on tests of AI tools and software for small teams',
    domains: ['localhost', 'stackbrook.com'],
    contactEmail: 'hello@stackbrook.com',
    affiliateDisclosure: true,
  },
];

export const defaultSite = sites[0];

export function siteByHost(host: string | null | undefined): SiteConfig {
  const h = (host ?? '').split(':')[0].toLowerCase().replace(/^www\./, '');
  return sites.find((s) => s.domains.includes(h)) ?? defaultSite;
}

export function siteById(id: string): SiteConfig | undefined {
  return sites.find((s) => s.id === id);
}
