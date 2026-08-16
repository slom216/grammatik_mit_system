import { describe, expect, it } from 'vitest';
import { compactDuration } from './studyTime';

describe('compactDuration', () => {
  it('keeps seconds below a minute, so a short session does not read as zero', () => {
    expect(compactDuration(0)).toBe('0s');
    expect(compactDuration(47_000)).toBe('47s');
  });

  it('switches to whole minutes from a minute up', () => {
    expect(compactDuration(60_000)).toBe('1m');
    expect(compactDuration(600_000)).toBe('10m');
    expect(compactDuration(3_599_000)).toBe('59m');
  });

  it('pads the minutes once hours appear, so 1h4 cannot be read as 1h40', () => {
    expect(compactDuration(3_600_000)).toBe('1h00');
    expect(compactDuration(3_840_000)).toBe('1h04');
    expect(compactDuration(9_000_000)).toBe('2h30');
  });
});
