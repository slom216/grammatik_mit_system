import { describe, expect, it } from 'vitest';
import { seoForPath } from './seo';

describe('seoForPath', () => {
  it('points a chapter tab at the chapter itself', () => {
    for (const tab of ['learn', 'practice', 'results']) {
      expect(seoForPath(`/chapter/3/${tab}`).canonical).toBe(
        'https://grammatik.deulern.com/chapter/3',
      );
    }
  });

  it('gives every indexable route a self-referential canonical', () => {
    expect(seoForPath('/').canonical).toBe('https://grammatik.deulern.com/');
    expect(seoForPath('/chapters').canonical).toBe(
      'https://grammatik.deulern.com/chapters',
    );
    expect(seoForPath('/chapters/').canonical).toBe(
      'https://grammatik.deulern.com/chapters',
    );
  });

  it('indexes course content and nothing else', () => {
    for (const path of ['/', '/chapters', '/about', '/placement', '/chapter/1']) {
      expect(seoForPath(path).index, path).toBe(true);
    }
    for (const path of ['/settings', '/progress', '/review', '/calendar', '/activity']) {
      expect(seoForPath(path).index, path).toBe(false);
    }
  });

  it('refuses to index a chapter number that is not in the outline', () => {
    // Renders ChapterUnavailable at status 200 — a soft 404 unless it says noindex.
    expect(seoForPath('/chapter/9999').index).toBe(false);
  });
});
