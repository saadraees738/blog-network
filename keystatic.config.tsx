import { config, collection, fields, singleton } from '@keystatic/core';
import { sites } from './sites.config';

// GitHub mode in production (edits commit to the repo); local mode in dev.
const useGithub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github';

const postFields = (siteId: string) => ({
  title: fields.slug({ name: { label: 'Title', validation: { length: { min: 10, max: 110 } } } }),
  description: fields.text({
    label: 'Meta description (120-160 chars)',
    multiline: true,
    validation: { length: { min: 80, max: 170 } },
  }),
  status: fields.select({
    label: 'Status',
    description: 'published = live. queue = held for human review. draft = work in progress.',
    options: [
      { label: 'Queue (needs review)', value: 'queue' },
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ],
    defaultValue: 'queue',
  }),
  queueReason: fields.text({
    label: 'Why it is in the queue (set by the daily task)',
    multiline: true,
  }),
  publishDate: fields.date({ label: 'Publish date' }),
  lastVerified: fields.date({ label: 'Facts last verified on' }),
  category: fields.text({ label: 'Category' }),
  author: fields.relationship({ label: 'Author', collection: `authors_${siteId}` }),
  heroImage: fields.image({
    label: 'Hero image (required to publish)',
    directory: `public/images/${siteId}`,
    publicPath: `/images/${siteId}/`,
  }),
  heroAlt: fields.text({ label: 'Hero image alt text (required, factual)' }),
  imageCredit: fields.text({
    label: 'Image credit / type (e.g. "Chart generated from cited data", "Screenshot by us")',
  }),
  affiliateLinks: fields.checkbox({
    label: 'Contains affiliate links (shows disclosure)',
    defaultValue: false,
  }),
  testedFirstHand: fields.checkbox({
    label: 'We actually used this product (only then may the text say "we tested")',
    defaultValue: false,
  }),
  quickAnswer: fields.text({ label: 'Quick answer (1-3 sentences)', multiline: true }),
  sources: fields.array(
    fields.object({
      title: fields.text({ label: 'Source title' }),
      url: fields.url({ label: 'Source URL' }),
      accessed: fields.date({ label: 'Accessed on' }),
    }),
    { label: 'Sources (at least 2 required to publish)', itemLabel: (p) => p.fields.title.value }
  ),
  factCheck: fields.object(
    {
      status: fields.select({
        label: 'Fact-check',
        options: [
          { label: 'Not checked', value: 'none' },
          { label: 'Passed', value: 'passed' },
          { label: 'Failed', value: 'failed' },
        ],
        defaultValue: 'none',
      }),
      reviewStatus: fields.select({
        label: 'Independent review',
        options: [
          { label: 'Not reviewed', value: 'none' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
        ],
        defaultValue: 'none',
      }),
      notes: fields.text({ label: 'Reviewer notes', multiline: true }),
    },
    { label: 'Checks (set by the pipeline, editable by you)' }
  ),
  content: fields.markdoc({ label: 'Body' }),
});

const collections: Record<string, any> = {};
for (const s of sites) {
  collections[`posts_${s.id}`] = collection({
    label: `${s.name}: Posts`,
    path: `content/${s.id}/posts/*`,
    slugField: 'title',
    format: { contentField: 'content' },
    entryLayout: 'content',
    schema: postFields(s.id),
  });
  collections[`authors_${s.id}`] = collection({
    label: `${s.name}: Authors`,
    path: `content/${s.id}/authors/*`,
    slugField: 'name',
    schema: {
      name: fields.slug({ name: { label: 'Real name' } }),
      role: fields.text({ label: 'Role / credentials (must be true)' }),
      bio: fields.text({ label: 'Bio', multiline: true }),
      photo: fields.image({
        label: 'Photo (optional)',
        directory: `public/images/${s.id}/authors`,
        publicPath: `/images/${s.id}/authors/`,
      }),
    },
  });
}

export default config({
  storage: useGithub
    ? {
        kind: 'github',
        repo: {
          owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? 'OWNER',
          name: process.env.NEXT_PUBLIC_GITHUB_REPO ?? 'REPO',
        },
      }
    : { kind: 'local' },
  collections,
  ui: {
    brand: { name: 'Blog network' },
  },
});
