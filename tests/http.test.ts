import { finalUrl } from '../src/http';

import { describe, test, expect } from 'vitest';

describe('finalUrl', () => {
  test('should return the final URL without redirects', async () => {
    const url = 'https://vorillaz.com';
    const result = await finalUrl(url);
    expect(result).toBe('https://www.vorillaz.com');
  });
  test('should follow redirects', async () => {
    const url = 'https://dub.sh/play';
    const result = await finalUrl(url);
    expect(result).toBe('https://www.vorillaz.com/talks');
  });

  test('should throw an error if the URL is invalid', async () => {
    const url = 'https://dub.sh/invalidXXXXX';
    try {
      await finalUrl(url);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
