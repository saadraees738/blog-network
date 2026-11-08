import type { SiteConfig } from '../sites.config';

// Template legal/trust pages. Replace PLACEHOLDER values and have the privacy
// policy and terms reviewed before enabling ads or analytics.
export const legalPages = (s: SiteConfig) => ({
  about: {
    title: `About ${s.name}`,
    body: [
      `${s.name} publishes research-based guides to AI tools and business software for small teams. ${s.tagline}.`,
      `Every article states what it is based on: official pricing pages, documentation, changelogs and other cited sources, each with the date we last checked it. We say plainly when something is our own testing and when it is not.`,
      `Read how we work in our editorial and AI policy, and how we handle mistakes on the corrections page. Questions: ${s.contactEmail}.`,
    ],
  },
  contact: {
    title: 'Contact',
    body: [
      `Email: ${s.contactEmail}`,
      `Spotted an error? Please include the page link and what is wrong, and see our corrections policy for how we handle it.`,
    ],
  },
  privacy: {
    title: 'Privacy policy',
    body: [
      `This policy explains what ${s.name} collects and why. Effective date: PLACEHOLDER.`,
      `Analytics: we may use privacy-focused or Google Analytics to understand which pages are read. Where required (EU/UK), analytics and advertising cookies are only set after you consent.`,
      `Advertising: if we show ads (for example through Google AdSense), the ad provider may use cookies to show personalised or non-personalised ads. You can manage this in the consent banner and in Google's ad settings.`,
      `Email: if you subscribe to a newsletter we store your email address to send it. You can unsubscribe at any time from any email.`,
      `Your rights: depending on where you live you may request access to or deletion of your data. Contact ${s.contactEmail}.`,
    ],
  },
  terms: {
    title: 'Terms of use',
    body: [
      `By using ${s.name} you agree to these terms. Content is provided for general information only and is not professional advice. Prices and features change; always confirm on the vendor's own site before buying.`,
      `You may quote short excerpts with a link back to the source page. Do not copy full articles.`,
      `We are not responsible for third-party sites we link to.`,
    ],
  },
  'affiliate-disclosure': {
    title: 'Affiliate disclosure',
    body: [
      `Some links on ${s.name} are affiliate links. If you click one and buy, we may earn a commission at no extra cost to you.`,
      `Commissions never decide what we include or how we describe it. Pages with affiliate links say so near the top, and those links are marked rel="sponsored".`,
    ],
  },
  'editorial-policy': {
    title: 'Editorial and AI policy',
    body: [
      `How articles are made: drafts are prepared with the help of AI tools. Each draft is then checked against the cited primary sources (official pricing pages, documentation, changelogs), reviewed by a separate review step against a checklist, and only published if every check passes. Anything doubtful is held back for a human editor.`,
      `What we claim: we only describe a tool as "tested" if we actually used it. Otherwise the article says it is based on documentation and published information, and shows the date we last verified it.`,
      `Images: we use charts we generate from cited data, screenshots we capture ourselves, diagrams, and properly licensed images. AI-generated illustrations, if ever used, are labelled. We do not use AI images to depict how a product looks or works.`,
      `Independence: affiliate relationships are disclosed on every page that has them and do not influence rankings or conclusions.`,
    ],
  },
  corrections: {
    title: 'Corrections',
    body: [
      `If we get something wrong we fix it and note the correction at the top of the article with the date. Report errors to ${s.contactEmail}.`,
    ],
  },
});

export type LegalSlug = keyof ReturnType<typeof legalPages>;
export const legalSlugs: LegalSlug[] = [
  'about',
  'contact',
  'privacy',
  'terms',
  'affiliate-disclosure',
  'editorial-policy',
  'corrections',
];
