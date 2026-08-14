import type { DialogueLine } from '../../schemas/exerciseSchema';
import { SpeakButton } from '../common/SpeakButton';

export interface DialogueExchangeProps {
  lines: DialogueLine[];
}

/**
 * Renders a short conversational exchange as chat-style bubbles, alternating
 * side by first-seen speaker, so exercises about register or pragmatics
 * (modal particles, connectors) show the surrounding context rather than an
 * isolated sentence.
 */
export function DialogueExchange({ lines }: DialogueExchangeProps) {
  const firstSpeaker = lines[0]?.speaker;

  return (
    <ul className="dialogue">
      {lines.map((line, index) => {
        const side = line.speaker === firstSpeaker ? 'a' : 'b';
        return (
          <li key={`${line.speaker}-${index}`} className={`dialogue__line dialogue__line--${side}`}>
            <div className="dialogue__bubble">
              <span className="dialogue__speaker">{line.speaker}</span>
              <span className="dialogue__german" lang="de">
                {line.german}
                <SpeakButton text={line.german} label={`Listen to ${line.speaker}`} />
              </span>
              {line.english && <span className="dialogue__english">{line.english}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
