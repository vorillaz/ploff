import { fetch } from 'undici';
import { lru } from 'tiny-lru';

const cache = lru(100, 3e4);

export async function head(url: string) {
  const res = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
  });

  if (res?.redirected) {
    return res.url;
  }

  return url;
}

export async function finalUrl(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const final = await head(url);

  const trimmed = final.replace(/\/$/, '');
  cache.set(url, trimmed);
  return trimmed;
}
