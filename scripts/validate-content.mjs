// Pre-commit check used by the daily task (and CI): fails if any post marked
// "published" breaks a hard rule. Posts marked queue/draft are not checked.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const contentDir = path.join(root, 'content');
let failures = 0;
const bad = (file, msg) => { failures++; console.error(`FAIL ${file}: ${msg}`); };

for (const site of fs.existsSync(contentDir) ? fs.readdirSync(contentDir) : []) {
  const postsDir = path.join(contentDir, site, 'posts');
  if (!fs.existsSync(postsDir)) continue;
  const authors = new Set(
    fs.existsSync(path.join(contentDir, site, 'authors'))
      ? fs.readdirSync(path.join(contentDir, site, 'authors')).map((f) => f.replace(/\.yaml$/, ''))
      : []
  );
  for (const f of fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdoc'))) {
    const file = path.join(site, 'posts', f);
    const raw = fs.readFileSync(path.join(postsDir, f), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) { bad(file, 'no front matter'); continue; }
    const fm = YAML.parse(m[1]) ?? {};
    const body = m[2] ?? '';
    if (fm.status !== 'published') continue;

    if (!fm.heroImage) bad(file, 'no hero image');
    else {
      const img = fm.heroImage.startsWith('/') ? fm.heroImage : `/images/${site}/${fm.heroImage}`;
      const p = path.join(root, 'public', img);
      if (!fs.existsSync(p)) bad(file, `image file missing: ${img}`);
      else if (fs.statSync(p).size < 500) bad(file, `image file suspiciously small: ${img}`);
      if (img.endsWith('.svg') && !fs.existsSync(p.replace(/\.svg$/, '.png'))) bad(file, `PNG copy for social previews missing: ${img.replace(/\.svg$/, '.png')} (run: rsvg-convert -w 1200 <svg> -o <png>)`);
    }
    if (!fm.heroAlt || fm.heroAlt.length < 8) bad(file, 'alt text missing/too short');
    if (!fm.description || fm.description.length < 80 || fm.description.length > 170) bad(file, 'meta description must be 80-170 chars');
    if (!fm.title || fm.title.length < 10 || fm.title.length > 110) bad(file, 'title length');
    if (!fm.author || !authors.has(fm.author)) bad(file, 'author missing or not found');
    if (!fm.lastVerified) bad(file, 'lastVerified missing');
    if (!fm.quickAnswer) bad(file, 'quickAnswer missing');
    const urls = (fm.sources ?? []).filter((s) => /^https:\/\//.test(s.url ?? ''));
    if (urls.length < 2) bad(file, 'need at least 2 https sources');
    if (fm.factCheck?.status !== 'passed') bad(file, 'fact-check not passed');
    if (fm.factCheck?.reviewStatus !== 'approved') bad(file, 'independent review not approved');
    const words = body.split(/\s+/).filter(Boolean).length;
    if (words < 700) bad(file, `body too short (${words} words, min 700)`);
    if (/lorem ipsum|\bTODO\b|\bTBD\b|\[insert|\bPLACEHOLDER\b/i.test(raw)) bad(file, 'contains placeholder text');
    if (/\bwe tested\b|\bI tested\b|\bour testing\b|\bhands-on\b/i.test(body) && !fm.testedFirstHand) bad(file, 'claims first-hand testing without testedFirstHand: true');
    if (!/^##\s/m.test(body)) bad(file, 'no H2 headings');
  }
}
if (failures) { console.error(`${failures} problem(s). Fix them or set the affected post to status: queue.`); process.exit(1); }
console.log('content OK');
