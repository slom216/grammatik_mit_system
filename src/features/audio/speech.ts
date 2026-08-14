/**
 * German pronunciation through the browser's own speech synthesis: no audio
 * files, no network, nothing to ship. Voice availability varies by platform —
 * Linux in particular often has none — so callers must hide their controls
 * when `hasGermanVoice()` is false.
 */
const GERMAN = /^de(-|$)/i;

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

/** Speaks German text, replacing whatever is currently being spoken. */
export function speakGerman(text: string): void {
  const speech = synthesis();
  const voice = germanVoice();
  if (!speech || !voice) return;

  speech.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  // Slightly under natural pace: these are sentences being studied, not read.
  utterance.rate = 0.9;
  speech.speak(utterance);
}
