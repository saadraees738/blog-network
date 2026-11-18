# Scheduled publishing task: standalone prompt (5 runs a day)

Every run starts in a fresh session with no memory, so everything it needs is here and in this repo. Updated 2026-11-18: the owner asked for 5 posts a day (one post per run, 5 runs a day).

## Goal
Each run adds exactly ONE new post to the site in `docs/ACTIVE_SITE.md` by committing to this GitHub repo (`saadraees738/blog-network`, branch `main`). A doubtful post is committed with `status: queue`; the run then stops (the next run tries a new topic). Never publish a weak post to hit the number. Quality beats the count: if no topic can be fully verified in this run, queue the best draft and say why.

## Setup (every run)
- Work in `/home/claude/blog-network`. If it is missing, clone `https://github.com/saadraees738/blog-network` (use the add_repo tool for push credentials if a plain clone/push is refused).
- `git config user.name "saadraees738"` and `git config user.email "177437009+saadraees738@users.noreply.github.com"` (Vercel blocks other authors).
- `git pull --rebase origin main` first (other runs and the owner also push). Run `npm ci` only if `node_modules` is missing.
- If `docs/PAUSED` exists: write and queue posts but NEVER set `status: published`.

## Hard rules (never break)
1. **Facts only from fetched sources.** Every price, feature, limit, date or number comes from a page fetched in THIS run, preferably the official vendor page. Search snippets and aggregator sites are leads, not sources. If a number cannot be confirmed, leave it out. List each source in `sources` with the date accessed (https URLs only).
2. **No invented experience.** Never write "we tested", "I tested", "our testing", "hands-on", or describe how a product feels. `testedFirstHand: false`.
3. **No copying.** Original wording. At most one short quote (under 15 words) per source. No copied tables, images or sentences.
4. **Complete post.** 700+ words, quick answer (plain scalar, never containing `: `, use ` - `), 2+ H2s, 2+ https sources, author `saad-r`, `lastVerified` = today, `publishDate` = today (never future).
5. **Affiliate honesty.** `affiliateLinks: false` (no approved programs yet). No affiliate links.
6. **Topic safety.** No medical, legal, tax or investment advice. Skip disputed facts. Label anything reported but not confirmed as "reported" or "unconfirmed". For payment, privacy or safety topics add "general information, not financial or legal advice".
7. **Disclosure paragraph** (italic, right after the intro): drafted by Claude, an AI assistant made by Anthropic, and checked by a separate AI reviewer against the cited pages for figures, dates and wording; not a full human review; mention if the vendor is a competitor of Anthropic (OpenAI, Google); Stackbrook did not test the product; no affiliate relationship at time of writing; header image AI-generated.
8. **Independent review.** After drafting, a separate agent (Agent tool, no edit rights) checks the draft against the cited pages and returns numbered findings with severity and APPROVE or REVISE. Apply all findings. Only then set `status: published`, `factCheck.status: passed`, `factCheck.reviewStatus: approved`, and put a factCheck note stating one review round, the number of findings applied, and what could not be verified. If the reviewer finds a high-severity problem you cannot fix from sources, queue the post.
9. **Validation.** Run `node scripts/validate-content.mjs` (not piped, check the exit code) and `npm run build` before pushing. Failure = fix, or set `status: queue` with `queueReason`.

## Choosing the topic (trending, mixed, not repetitive)
1. List existing posts (`content/site1/posts/*.mdoc`: title, category, publishDate). Never the same category as the newest post; at most 2 of any 5 consecutive posts in one category; no more than about 1 in 4 posts may be a pricing comparison.
2. Mix the formats over the day and week: news with analysis, new tool or model launches, hardware and robots, how-tos, explainers, safety/policy, occasional pricing. Prefer AI categories. Topics should feel random and varied, not a cluster of launches.
3. Find what is new and genuinely useful today: WebSearch for AI news from the last 48 hours (use the actual current date), then confirm on official pages (vendor blogs, docs, newsrooms, regulator pages). Skip rumours that only appear on aggregators. Skip near-duplicates of existing posts (search the repo first). Use `docs/TOPICS.md` as a backlog of evergreen ideas when the news is thin; mark the topic done there.
4. Audience: small businesses and everyday users of AI tools and software; neutral, no identity targeting.

## Cover and chart images (every post needs both)
- **Chart:** one SVG chart from the cited data, `public/images/site1/<slug>-chart.svg` (1200x630, labels inside the canvas) plus PNG `rsvg-convert -o <slug>-chart.png <slug>-chart.svg`; open the PNG and check nothing is clipped. Vary the chart type from the previous post (docs/STYLE.md). Body line: `![alt of 8+ chars](/images/site1/<slug>-chart.svg) *Chart created by Stackbrook from the cited pages.*`
- **Cover (main image, required):** `heroImage: /images/site1/<slug>-cover.jpg`, `imageCredit: 'Cover image generated with AI (FLUX.1 schnell via Cloudflare Workers AI); title and layout added by Stackbrook'` (if the AI background was NOT used, use `'Cover image created by Stackbrook (generated background pattern, title and layout added in code)'`).
  1. REQUIRED when a key is available: the image key (`GEN_KEY`) is given in the scheduled task's prompt (it is never stored in this repo) or in `/home/claude/.genkey`. Load `mcp__Vercel__web_fetch_vercel_url` via ToolSearch and fetch `https://stackbrook.com/api/gen-image?key=<GEN_KEY>&steps=4&prompt=<url-encoded prompt ending "no text, no letters, no logos, no people">`. The result is large and is saved to a file under /tmp/claude-tool-results/; decode the base64 `image` field from it into `/tmp/covers/<slug>_bg.jpg` (mkdir -p /tmp/covers; the JSON may be wrapped, find the `"image":"..."` value with python). Retry once on failure. Never print or share the key. Only if both attempts fail, use the fallback in step 2.
  2. Render: `python3 -c "import sys; sys.path.insert(0,'scripts/cover'); import cover; cover.make('<slug>','public/images/site1/<slug>-cover.jpg','<Category>','<headline, max 40 chars>')"`. If no background file exists, `cover.py` draws a branded generated background automatically, so a cover always exists.
  3. Add `'<slug>':('<Category>','<headline>')` to `POSTS` in `scripts/cover/cover.py` in the same commit.
- Never depict a real person, brand logo or product look with AI art. heroAlt (single-quoted YAML, doubled apostrophes) describes the illustration honestly.

## Frontmatter reference
Copy the keys of a recent post (e.g. `content/site1/posts/gemini-4-hydrogen-explained-which-model-to-use.mdoc`): title, description (80-170 chars), status, queueReason '', publishDate, lastVerified, category, author, heroImage, heroAlt, imageCredit, affiliateLinks false, testedFirstHand false, quickAnswer, sources, factCheck. YAML: single-quote strings with apostrophes/colons and double the apostrophes.

## Steps
1. Setup, topic choice (above). 2. Research official pages. 3. Draft `.mdoc` + chart. 4. Cover. 5. Independent review, apply fixes. 6. Validate + build. 7. Commit `post: <slug>` (or `queue: <slug> (<reason>)`) with trailers `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; `git pull --rebase origin main`; `git push origin HEAD:main`. 8. End with a 3-line summary: slug, category, published or queued (and why).

## Daily and weekly limits
Target 5 per day (about 35 per week); this is the owner's explicit setting (2026-11-18). Count today's posts first (by `publishDate` = today). If 5 or more already exist today (for example the owner added some by hand), stop without publishing. A run that cannot produce a fully verified post queues instead.

## Safety brake
`docs/PAUSED` (created by the owner after a Google manual action, AdSense policy warning, 50%+ traffic collapse or copyright complaint) turns every run into queue-only.
