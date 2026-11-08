# Blog network

One Next.js app serving several blogs (see `sites.config.ts`), with a git-based CMS (Keystatic) at `/keystatic`.
Posts are files in `content/<site>/posts/`. Pushing to `main` redeploys on Vercel.

## Publishing model
- `status: published` + all checks passed -> live. Anything else -> not rendered (see `lib/content.ts` publishGate).
- `status: queue` -> held for a human; edit it in the admin and set it to published.
- `node scripts/validate-content.mjs` enforces the hard rules before commit.
- Daily automation: see `docs/DAILY_TASK.md`.

## Local run
`npm install && npm run dev` then open http://localhost:3000 and /keystatic (local mode).

## Production admin (GitHub mode)
Set these in Vercel: `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`, `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO`, plus the Keystatic GitHub App secrets created on first visit to /keystatic.

## Before launch (placeholders)
Brand name, domain, contact email, author profile, privacy policy review, cookie-consent tool (certified CMP) before ads.
