# Post image convention

Every post has:

1. **Main image (heroImage)**: a branded cover, `public/images/<site>/<slug>-cover.jpg`, 1200x630. An AI background (Cloudflare Workers AI, FLUX.1 schnell, via the protected `/api/gen-image` route) on the right, the title and category on the left, drawn in code by `scripts/cover/cover.py` so the text is always spelled correctly. Never ask the image model to write text and never ask it for logos or real people.
2. **Supporting images (1-2)** inside the body: charts or diagrams made from cited data, as SVG (`<slug>-chart.svg`, with a PNG copy), inserted as a Markdoc image followed by an italic caption line:

       ![Descriptive alt text](/images/site1/<slug>-chart.svg)
       *Chart created by Stackbrook from ... .*

Rules: imageCredit for the cover states that it is AI-generated. Body charts must match the cited data. `scripts/validate-content.mjs` enforces the `-cover` main image, alt text and that body image files exist.

Cover workflow: write a background prompt (end with "no text, no letters, no logos"), generate through `/api/gen-image`, decode the base64 `image` to a JPEG, add an entry to `POSTS` in `scripts/cover/cover.py` (category, short headline) and run it. Prompts used so far are in `scripts/cover/prompts.json`.
