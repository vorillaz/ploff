import { fetch } from 'undici';

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
  const final = await head(url);

  const trimmed = final.replace(/\/$/, '');
  return trimmed;
}
