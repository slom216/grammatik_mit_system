import { afterEach, describe, expect, it, vi } from 'vitest';
import { hasGermanVoice, speakGerman } from './speech';

function stubSynthesis(lang: string, speak: (utterance: { text: string }) => void) {
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      speak,
      cancel: vi.fn(),
      getVoices: () => [{ lang, name: lang, localService: true, default: false }],
    },
  });
  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    class {
      voice: unknown = null;
      lang = '';
      rate = 1;
      onerror: ((event: { error: string }) => void) | null = null;
      text: string;
      constructor(text: string) {
        this.text = text;
      }
    },
  );
}

afterEach(() => {
  Reflect.deleteProperty(window, 'speechSynthesis');
  vi.unstubAllGlobals();
});

describe('speech', () => {
  it('accepts a German voice reported as de_DE', () => {
    stubSynthesis('de_DE', vi.fn());
    expect(hasGermanVoice()).toBe(true);
  });

  it('reads matching arrows as a pause', () => {
    const speak = vi.fn();
    stubSynthesis('de-DE', speak);
    speakGerman('spielen → spielst, machen → machst');
    expect(speak.mock.calls[0]?.[0].text).toBe('spielen, spielst, machen, machst');
  });

  it('reports a failing engine instead of throwing', () => {
    stubSynthesis('de-DE', () => {
      throw new Error('synthesis-failed');
    });
    const onError = vi.fn();
    expect(() => speakGerman('Hallo', onError)).not.toThrow();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('reports an asynchronous failure but not an interruption', () => {
    let utterance: { onerror: (event: { error: string }) => void } | undefined;
    stubSynthesis('de-DE', (spoken) => {
      utterance = spoken as unknown as typeof utterance;
    });
    const onError = vi.fn();
    speakGerman('Hallo', onError);
    utterance?.onerror({ error: 'interrupted' });
    expect(onError).not.toHaveBeenCalled();
    utterance?.onerror({ error: 'synthesis-failed' });
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
