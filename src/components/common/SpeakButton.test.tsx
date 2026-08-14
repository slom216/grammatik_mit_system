import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeakButton } from './SpeakButton';
import { useSettingsStore } from '../../features/settings/settingsStore';

/** jsdom has no speech synthesis, so both the API and the voices are stubbed. */
function stubVoices(langs: string[]) {
  const speak = vi.fn();
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      speak,
      cancel: vi.fn(),
      getVoices: () =>
        langs.map((lang) => ({ lang, name: lang, localService: true, default: false })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  // The constructor only has to carry the text through to speak().
  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    class {
      text: string;
      voice: unknown = null;
      lang = '';
      rate = 1;
      constructor(text: string) {
        this.text = text;
      }
    },
  );
  return speak;
}

afterEach(() => {
  Reflect.deleteProperty(window, 'speechSynthesis');
});

describe('SpeakButton', () => {
  it('speaks the German sentence when a German voice exists', async () => {
    const speak = stubVoices(['en-US', 'de-DE']);
    const user = userEvent.setup();
    render(<SpeakButton text="Ich gehe heim." />);

    await user.click(screen.getByRole('button', { name: /listen to "Ich gehe heim\."/i }));

    expect(speak).toHaveBeenCalledTimes(1);
    expect((speak.mock.calls[0]?.[0] as { text: string }).text).toBe('Ich gehe heim.');
    expect((speak.mock.calls[0]?.[0] as { lang: string }).lang).toBe('de-DE');
  });

  it('renders nothing when the device has no German voice', () => {
    stubVoices(['en-US', 'fr-FR']);
    const { container } = render(<SpeakButton text="Ich gehe heim." />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when pronunciation audio is turned off', () => {
    stubVoices(['de-DE']);
    useSettingsStore.setState({ pronunciationAudio: false });
    const { container } = render(<SpeakButton text="Ich gehe heim." />);
    expect(container).toBeEmptyDOMElement();
  });
});
