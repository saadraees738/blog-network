# Daily publishing task: standalone prompt

This is the full instruction set for the scheduled daily run. Every run starts in a fresh session with no memory, so everything the run needs is here and in this repo.

## Goal
Add at most ONE new post per run to the site in `docs/ACTIVE_SITE.md`, by committing files to this GitHub repo. The run never stops because of one bad post: a doubtful post is committed with `status: queue` and the run moves to the next topic (max 6 topics per run).

## Hard rules (never break)
1. **Facts only from fetched sources.** Every price, feature, limit, date or number in the post must come from a page fetched in THIS run (official pricing pages, docs, changelogs, vendor announcements). If a number cannot be confirmed from a fetched page, leave it out. Record each source in `sources` with the date accessed.
2. **No invented experience.** Never write "we tested", "I used", "hands-on" or describe how a product feels unless `testedFirstHand: true` is set by a human. Frame posts as "based on official documentation and pricing as of <date>".
3. **No copying.** Write in original words. Quote at most one short phrase (under 15 words) per source. Never reproduce another site's tables, images or paragraphs.
4. **Image required.** A hero image must exist in `public/images/<site>/` and be one of: a chart generated from cited data, a diagram/SVG, or a screenshot of our own calculators. Never use AI images to depict how a product looks. Write factual alt text. Fill `imageCredit`. If no valid image can be produced, the post goes to the queue.
5. **Complete post.** At least 700 words, a quick answer, 2+ H2 sections, a sources list with 2+ https sources, a real author from `content/<site>/authors/`, and `lastVerified` set to today.
6. **Affiliate honesty.** Set `affiliateLinks: true` only when the post actually contains affiliate links (none until we have approved programs). Never let affiliate payouts change rankings or conclusions.
7. **Topic safety.** No medical, legal, tax or investment advice. No claims about the safety, legality or performance of a product that official sources do not support. Skip any topic where the facts are disputed.
8. **Independent review before publishing.** After drafting, a separate review pass (a different agent that did not write the draft) checks the draft against the fetched sources, line by line: every number and claim traced to a source, no first-hand claims, no copied phrasing, image present, alt text accurate. The reviewer returns PASS or FAIL with reasons. Only PASS allows `status: published`, `factCheck.status: passed`, `factCheck.reviewStatus: approved`.
9. **Validation.** Run `node scripts/validate-content.mjs` before committing. If it fails, set the post to `status: queue`, write the reason in `queueReason`, and commit anyway so nothing is lost.
10. **Safety brake.** If `docs/PAUSED` exists, still write and queue posts but NEVER set `status: published`. (A human creates this file after a Google manual action, an AdSense policy warning, a traffic collapse of 50%+ in a week, or a copyright complaint, and deletes it when the cause is fixed.)

## Steps
1. Read `docs/ACTIVE_SITE.md`, `docs/TOPICS.md` (ordered backlog) and the list of existing posts. Pick the first topic not yet covered. Do not publish near-duplicates of existing posts.
2. Research: fetch the official sources for the topic. Extract only confirmed facts into notes.
3. Draft the post (`content/<site>/posts/<slug>.mdoc`) following `docs/STYLE.md`.
4. Build the hero image locally (chart/SVG/diagram) into `public/images/<site>/`.
5. Run the independent review (rule 8).
6. Set fields according to the result, run the validator (rule 9), commit to `main` with message `post: <slug>` (published) or `queue: <slug> (<reason>)`.
7. If the post was queued, move to the next topic (up to 6 attempts) and repeat from step 2.
8. Mark the topic done in `docs/TOPICS.md` (status: published / queued) in the same commit.
9. End the run with a short summary: what was published, what was queued and why.

## Weekly cap
Count posts published in the last 7 days (by `publishDate`). Cap: 4 per week at first (raise to 5 only after the site has 20+ posts). If the cap is reached, draft and queue instead of publishing.
