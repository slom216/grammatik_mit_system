/**
 * German pronunciation through the browser's own speech synthesis: no audio
 * files, nothing to ship. A voice on the device is preferred; when the only
 * German voice is a network one it is still used, which sends the sentence to
 * the platform's speech service. Voice availability varies by platform —
 * Linux in particular often has none — so callers must hide their controls
 * when `hasGermanVoice()` is false.
 */
// Some Android WebViews report `de_DE` rather than `de-DE`.
const GERMAN = /^de([-_]|$)/i;

function synthesis(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
    ? window.speechSynthesis
    : null;
}

export function germanVoice(): SpeechSynthesisVoice | null {
  const voices = synthesis()?.getVoices() ?? [];
  return (
    voices.find((voice) => GERMAN.test(voice.lang) && voice.localService) ??
    voices.find((voice) => GERMAN.test(voice.lang)) ??
    null
  );
}

export function hasGermanVoice(): boolean {
  return germanVoice() !== null;
}

/**
 * Subscribes to voice-list changes. Chrome loads voices asynchronously, so the
 * first `getVoices()` after page load is often empty.
 */
export function onVoicesChanged(listener: () => void): () => void {
  const speech = synthesis();
  if (!speech) return () => {};
  speech.addEventListener('voiceschanged', listener);
  return () => speech.removeEventListener('voiceschanged', listener);
}

/**
 * Speaks German text, replacing whatever is currently being spoken. Calls
 * `onError` when the engine fails, straight away or mid-utterance, instead of
 * throwing.
 */
export function speakGerman(text: string, onError?: () => void): void {
  const speech = synthesis();
  const voice = germanVoice();
  if (!speech || !voice) return;

  try {
    speech.cancel();
    // "spielen → spielst" would be read as "arrow": a pause says it better.
    const utterance = new SpeechSynthesisUtterance(text.replace(/\s*[→↔]\s*/g, ', '));
    utterance.voice = voice;
    utterance.lang = voice.lang;
    // Slightly under natural pace: these are sentences being studied, not read.
    utterance.rate = 0.9;
    utterance.onerror = (event) => {
      // Cut off by the next Listen click, not a failure.
      if (event.error !== 'canceled' && event.error !== 'interrupted') onError?.();
    };
    speech.speak(utterance);
  } catch {
    onError?.();
  }
}
