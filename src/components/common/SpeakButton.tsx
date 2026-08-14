import { useEffect, useState } from 'react';
import {
  hasGermanVoice,
  onVoicesChanged,
  speakGerman,
} from '../../features/audio/speech';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { Icon } from './Icon';

export interface SpeakButtonProps {
  /** The German text to read aloud. */
  text: string;
  /** Describes what is being read, for screen readers. */
  label?: string;
}

/**
 * Reads a German sentence aloud. Renders nothing when the learner turned audio
 * off, or when the device has no German voice installed — an inert button
 * would be worse than none.
 */
export function SpeakButton({ text, label }: SpeakButtonProps) {
  const pronunciationAudio = useSettingsStore((state) => state.pronunciationAudio);
  // Chrome fills its voice list asynchronously, so this is re-checked on change.
  const [available, setAvailable] = useState(hasGermanVoice);

  useEffect(() => onVoicesChanged(() => setAvailable(hasGermanVoice())), []);

  if (!pronunciationAudio || !available) return null;

  return (
    <button
      type="button"
      className="speak-button"
      onClick={() => speakGerman(text)}
      title="Listen"
    >
      <Icon name="speaker" />
      <span className="visually-hidden">{label ?? `Listen to "${text}"`}</span>
    </button>
  );
}
