import { timingSafeEqual } from 'node:crypto';

// Protected helper: generates one image with Cloudflare Workers AI (FLUX.1 schnell)
// and returns it as base64 JSON. Used only by the maintainer to make hero images.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = process.env.GEN_IMAGE_SECRET ?? '';
  const key = url.searchParams.get('key') ?? '';
  if (!secret || !safeEqual(key, secret)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  const prompt = (url.searchParams.get('prompt') ?? '').slice(0, 1000);
  if (!prompt) return Response.json({ error: 'missing prompt' }, { status: 400 });
  const steps = Math.min(8, Math.max(1, Number(url.searchParams.get('steps') ?? 4)));
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !token) return Response.json({ error: 'cloudflare env missing' }, { status: 500 });

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, steps }),
    },
  );
  const text = await res.text();
  if (!res.ok) return Response.json({ error: 'cloudflare', status: res.status, body: text.slice(0, 500) }, { status: 502 });
  try {
    const data = JSON.parse(text);
    return Response.json({ image: data?.result?.image ?? null });
  } catch {
    return Response.json({ error: 'bad response', body: text.slice(0, 200) }, { status: 502 });
  }
}
