# Style guide
- Plain, specific, useful. Lead with the answer (quick answer box), then evidence.
- Every price/limit states the date it was checked ("as of 8 Nov 2026") and links its source.
- Tables for comparisons; short paragraphs; no filler intros; no hype words.
- Say what we do not know. Say when a plan changed recently.
- Title 10-110 chars; meta description 80-170 chars; H2 sections; sources at the end are rendered by the template.
- Never claim first-hand testing unless testedFirstHand is true.
- Hero images: vary the chart type. Never use the same chart style as the previous post (check the newest posts' `heroImage` and `heroAlt` first). Rotate through: horizontal bars, vertical columns, dot plot / number line, pictogram, line or step chart, table-style diagram, flow diagram. All SVG, generated locally, 800x420, labels inside the canvas (render to PNG with rsvg-convert and look for clipped text before publishing).
- Every SVG hero needs a PNG copy of the same name (1200x630) for social previews: `rsvg-convert -w 1200 -h 630 x-hero.svg -o x-hero.png`. The validator fails without it.
